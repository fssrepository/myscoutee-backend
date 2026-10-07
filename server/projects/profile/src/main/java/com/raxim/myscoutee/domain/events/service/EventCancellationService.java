package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.payments.api.PaymentRefunds;
import com.raxim.myscoutee.domain.payments.api.EventPayments;
import com.raxim.myscoutee.domain.events.service.EventJobQueries;

import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.payments.api.PaymentView;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

/** Durable cancellation/refund work. Actor authority is checked by the event service before enqueueing. */
@Service
public class EventCancellationService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.events.service.EventJobQueries jobGroupScope;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    @org.springframework.beans.factory.annotation.Autowired
    private EventParticipationTicketService tickets;
    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.beans.factory.ObjectProvider<PaymentRefunds> refunds;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.payments.api.EventPaymentCancellations paymentCancellations;
    private final MongoTemplate mongo;
    private final EventPayments payments;
    private final ScheduledMongoSessionRunner sessions;
    private final NotificationDelivery notifications;
    private final org.springframework.beans.factory.ObjectProvider<ActivitiesMembersService> members;

    public EventCancellationService(MongoTemplate mongo, EventPayments payments,
            ScheduledMongoSessionRunner sessions, NotificationDelivery notifications,
            org.springframework.beans.factory.ObjectProvider<ActivitiesMembersService> members) {
        this.mongo = mongo; this.payments = payments; this.sessions = sessions; this.notifications = notifications;
        this.members = members;
    }

    public void requestParticipantCancellation(String sourceId, String userId) {
        var eligible = paymentCancellations.eligibleParticipantPayments(sourceId, userId);
        if (eligible.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No changed-terms cancellation is available for this booking.");
        }
        for (PaymentView payment : eligible) refunds.getObject().requestChangedTermsRefund(payment.getId(), userId);
    }

    /** Invoked only after the membership service has authorized an organizer removal. */
    public void requestAdminRemovals(String sourceId, Collection<String> userIds, String actorUserId) {
        paymentCancellations.queueAdminRemovals(sourceId, userIds, actorUserId);
    }

    @Scheduled(fixedDelay = 5_000L)
    public void finishPendingCancellations() {
        sessions.runAcrossConfiguredDatabases(() -> groupRules.runScheduledGroups("event-cancellation", () -> {
            List<ActivityEvent> cancelled = mongo.find(Query.query(Criteria.where("cancelledAtIso").ne(null)
                    .and("cancellationRefundsComplete").is(false)).addCriteria(jobGroupScope.workspaceCriteria("workspaceGroupId")).limit(10), ActivityEvent.class);
            Set<String> processed = new HashSet<>();
            for (ActivityEvent event : cancelled) {
                if (processed.add(event.getSourceId())) guardedInMode(event.getCancellationSessionMode(), () -> finishEventCancellation(event));
            }
            for (ActivityEvent event : mongo.find(Query.query(Criteria.where("paidTermsRefundsPending").is(true)).addCriteria(jobGroupScope.workspaceCriteria("workspaceGroupId")).limit(10), ActivityEvent.class)) {
                if (processed.add(event.getSourceId())) guarded(() -> grantChangedTerms(event));
            }
            for (PaymentView payment : paymentCancellations.pendingRequestedCancellations()) {
                guardedInMode(payment.getCancellationSessionMode(), () -> {
                    String eventId = EventPayments.FULFILLMENT_KIND_CLIENT.equals(payment.getFulfillmentKind())
                            && StringUtils.hasText(payment.getContextEventId()) ? payment.getContextEventId() : payment.getSourceId();
                    String reason = StringUtils.hasText(payment.getCancellationReason())
                            ? payment.getCancellationReason() : "event-terms-changed";
                    payments.completeEventCancellation(payment, reason);
                    if ("event-member-removed".equals(reason)) {
                        members.getObject().applyAction(new com.raxim.myscoutee.domain.events.dto.ActivityMembersDtos.ActivityMemberActionRequestDto(
                                new com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberOwnerRefDto("event", eventId),
                                payment.getCancellationRequestedBy(), payment.getUserId(), "remove", reason));
                    } else {
                        members.getObject().suppressEventParticipationTree(eventId, payment.getUserId(), payment.getUserId());
                    }
                    refreshEligibleUsers(eventId);
                    notifyUsers(eventId, "", List.of(payment.getUserId()), "event-booking-cancelled",
                            "payment-" + payment.getId(), payment.getUserId());
                    paymentCancellations.acknowledgeCancelledRequest(payment.getId());
                });
            }
        }));
    }

    private void finishEventCancellation(ActivityEvent event) {
        String sourceId = event.getSourceId();
        // Keep provider work bounded. Completed operations disappear from the next batch.
        var batch = paymentCancellations.pendingForCancelledEvent(sourceId);
        boolean failed = false;
        for (PaymentView payment : batch) {
            try { payments.completeEventCancellation(payment, "event-cancelled"); }
            catch (RuntimeException error) { failed = true; logFailure(error); }
        }
        LinkedHashSet<String> audience = new LinkedHashSet<>();
        add(audience, event.getAcceptedMemberUserIds()); add(audience, event.getPendingMemberUserIds());
        add(audience, event.getInvitedMemberUserIds()); add(audience, event.getPendingRequestMemberUserIds());
        audience.addAll(paymentCancellations.participantIds(sourceId));
        audience.remove(event.getCancelledByUserId());
        notifyUsers(sourceId, event.getTitle(), audience, "event-cancelled", event.getCancelledAtIso(), event.getCancelledByUserId());
        if (!failed && !paymentCancellations.hasPendingForCancelledEvent(sourceId)) {
            tickets.syncParticipationTicketsForEvent(sourceId);
            mongo.updateMulti(Query.query(Criteria.where("sourceId").is(sourceId)
                            .and("cancelledAtIso").is(event.getCancelledAtIso())),
                    new Update().set("cancellationRefundsComplete", true).set("refundEligibleUserIds", List.of()), ActivityEvent.class);
        }
    }

    private void grantChangedTerms(ActivityEvent event) {
        String stamp = event.getPaidTermsChangedAtIso();
        paymentCancellations.grantChangedTerms(event.getSourceId(), stamp);
        List<String> audience = refreshEligibleUsers(event.getSourceId());
        notifyUsers(event.getSourceId(), event.getTitle(), audience, "event-paid-terms-changed", stamp, event.getPaidTermsChangedBy());
        mongo.updateMulti(Query.query(Criteria.where("sourceId").is(event.getSourceId()).and("paidTermsChangedAtIso").is(stamp)),
                new Update().set("paidTermsRefundsProjectedAtIso", stamp).set("paidTermsRefundsPending", false), ActivityEvent.class);
    }

    private List<String> refreshEligibleUsers(String sourceId) {
        List<String> users = paymentCancellations.eligibleUserIds(sourceId);
        mongo.updateMulti(Query.query(Criteria.where("sourceId").is(sourceId)),
                new Update().set("refundEligibleUserIds", users), ActivityEvent.class);
        return users;
    }

    private void notifyUsers(String sourceId, String title, Collection<String> recipients, String type, String revision, String actor) {
        List<String> audience = recipients.stream().filter(StringUtils::hasText)
                .filter(id -> !"event-paid-terms-changed".equals(type) || !id.equals(actor))
                .distinct().toList();
        if (audience.isEmpty()) return;
        Map<String, String> payload = Map.of("sourceId", sourceId, "eventId", sourceId,
                "notification_title_key", "notification.kind." + type + ".title",
                "notification_message_key", "notification.kind." + type + ".message");
        notifications.enqueueOnce(type + ":" + sourceId + ":" + revision, new NotificationIntent(type, "event", sourceId, "event-participant", audience,
                title == null ? "Event" : title, "Event booking updated.", "/game", "/assets/logo/heart.webp", "/assets/logo/heart.webp",
                type + ":" + sourceId + ":" + revision, payload, actor));
    }

    /** Fields that the published editor requires unpublishing before changing. */
    public static boolean paidTermsChanged(ActivityEvent before, ActivityEvent after) {
        return before != null && after != null && !terms(before).equals(terms(after));
    }
    private static List<Object> terms(ActivityEvent event) {
        return Arrays.asList(event.getTitle(), event.getSubtitle(), event.getTimeframe(), event.getStartAtIso(), event.getEndAtIso(),
                event.getLocation(), event.getLocationCoordinates(), event.getImageUrl(), event.getImageUrls(), event.getSourceLink(),
                event.getCapacityMin(), event.getCapacityMax(), event.getFrequency(), event.getPricing(), event.getPoliciesEnabled(), event.getPolicies(),
                event.getSlotsEnabled(), event.getSlotTemplates(), event.getSubEventsEnabled(), event.getSubEventDefinitions(),
                event.getMode(), event.getMingleConfiguration(), event.getVisibility(), event.getBlindMode(), event.getTopics(),
                event.getApprovalRequired(), event.getPaymentDeadlineHours(), event.getPaymentDeadlineEnabled());
    }
    private static void add(Set<String> target, List<String> values) { if (values != null) target.addAll(values); }
    private static void guardedInMode(String mode, Runnable action) {
        var previous = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
        try {
            if (StringUtils.hasText(mode)) com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(
                    com.raxim.myscoutee.common.config.mongo.MongoSessionMode.valueOf(mode));
            guarded(action);
        } finally { com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(previous); }
    }
    private static void guarded(Runnable action) { try { action.run(); } catch (RuntimeException error) { logFailure(error); } }
    private static void logFailure(RuntimeException error) {
        org.slf4j.LoggerFactory.getLogger(EventCancellationService.class).warn("Event cancellation work remains pending: {}", error.getClass().getSimpleName());
    }
}
