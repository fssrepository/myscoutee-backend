package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.payments.service.PaymentRefundService;
import com.raxim.myscoutee.domain.payments.service.PaymentService;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

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
import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

/** Durable cancellation/refund work. Actor authority is checked by the event service before enqueueing. */
@Service
public class EventCancellationService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobGroupScope;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    @org.springframework.beans.factory.annotation.Autowired
    private EventParticipationTicketService tickets;
    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.beans.factory.ObjectProvider<PaymentRefundService> refunds;
    private final MongoTemplate mongo;
    private final PaymentService payments;
    private final ScheduledMongoSessionRunner sessions;
    private final NotificationDelivery notifications;
    private final org.springframework.beans.factory.ObjectProvider<ActivitiesMembersService> members;

    public EventCancellationService(MongoTemplate mongo, PaymentService payments,
            ScheduledMongoSessionRunner sessions, NotificationDelivery notifications,
            org.springframework.beans.factory.ObjectProvider<ActivitiesMembersService> members) {
        this.mongo = mongo; this.payments = payments; this.sessions = sessions; this.notifications = notifications;
        this.members = members;
    }

    public void requestParticipantCancellation(String sourceId, String userId) {
        Criteria scope = paymentScope(sourceId, userId).and("eventChangeRefundEligible").is(true);
        List<Payment> eligible = mongo.find(Query.query(scope), Payment.class);
        if (eligible.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No changed-terms cancellation is available for this booking.");
        }
        for (Payment payment : eligible) refunds.getObject().requestChangedTermsRefund(payment.getId(), userId);
    }

    /** Invoked only after the membership service has authorized an organizer removal. */
    public void requestAdminRemovals(String sourceId, Collection<String> userIds, String actorUserId) {
        if (userIds.isEmpty()) return;
        List<Payment> eligible = mongo.find(Query.query(paymentScope(sourceId, null)
                .and("userId").in(userIds).and("bookingStatus").ne("cancelled")), Payment.class);
        enqueueRefunds(eligible, actorUserId, "event-member-removed");
    }

    private void enqueueRefunds(List<Payment> eligible, String actor, String reason) {
        if (eligible.isEmpty()) return;
        // Persist all requests before removing membership or calling the provider.
        var writes = mongo.bulkOps(org.springframework.data.mongodb.core.BulkOperations.BulkMode.UNORDERED, Payment.class);
        for (Payment payment : eligible) {
            writes.updateOne(Query.query(Criteria.where("_id").is(payment.getId()).and("refundRequestedTargetAmount").is(null)),
                    new Update().set("refundRequestedTargetAmount", payment.getAmount())
                            .set("cancellationRequestedBy", actor).set("cancellationReason", reason)
                            .set("cancellationSessionMode", com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode().name()).inc("version", 1L));
        }
        writes.execute();
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
            for (Payment payment : jobGroupScope.findOwned(Query.query(Criteria.where("auditKind").is("payment")
                    .and("refundRequestedTargetAmount").gt(0)).limit(20), Payment.class, "userId")) {
                guardedInMode(payment.getCancellationSessionMode(), () -> {
                    String eventId = PaymentService.FULFILLMENT_KIND_CLIENT.equals(payment.getFulfillmentKind())
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
                    mongo.updateFirst(Query.query(Criteria.where("_id").is(payment.getId())
                                    .and("bookingStatus").is("cancelled")),
                            new Update().unset("refundRequestedTargetAmount").inc("version", 1L), Payment.class);
                });
            }
        }));
    }

    private void finishEventCancellation(ActivityEvent event) {
        String sourceId = event.getSourceId();
        // Keep provider work bounded. Completed operations disappear from the next batch.
        Criteria pending = paymentScope(sourceId, null).andOperator(new Criteria().orOperator(
                Criteria.where("bookingStatus").ne("cancelled"),
                Criteria.where("$expr").is(new Document("$lt", List.of(
                        new Document("$ifNull", List.of("$refundedAmount", 0)), "$amount")))));
        List<Payment> batch = mongo.find(Query.query(pending).limit(20), Payment.class);
        boolean failed = false;
        for (Payment payment : batch) {
            try { payments.completeEventCancellation(payment, "event-cancelled"); }
            catch (RuntimeException error) { failed = true; logFailure(error); }
        }
        LinkedHashSet<String> audience = new LinkedHashSet<>();
        add(audience, event.getAcceptedMemberUserIds()); add(audience, event.getPendingMemberUserIds());
        add(audience, event.getInvitedMemberUserIds()); add(audience, event.getPendingRequestMemberUserIds());
        audience.addAll(mongo.findDistinct(Query.query(paymentScope(sourceId, null)), "userId", Payment.class, String.class));
        audience.remove(event.getCancelledByUserId());
        notifyUsers(sourceId, event.getTitle(), audience, "event-cancelled", event.getCancelledAtIso(), event.getCancelledByUserId());
        if (!failed && !mongo.exists(Query.query(pending), Payment.class)) {
            tickets.syncParticipationTicketsForEvent(sourceId);
            mongo.updateMulti(Query.query(Criteria.where("sourceId").is(sourceId)
                            .and("cancelledAtIso").is(event.getCancelledAtIso())),
                    new Update().set("cancellationRefundsComplete", true).set("refundEligibleUserIds", List.of()), ActivityEvent.class);
        }
    }

    private void grantChangedTerms(ActivityEvent event) {
        String stamp = event.getPaidTermsChangedAtIso();
        var paidAt = new Document("$ifNull", List.of("$capturedAtIso",
                new Document("$ifNull", List.of("$gatewayApprovedAtIso", "$createdDate"))));
        Criteria scope = paymentScope(event.getSourceId(), null)
                .and("$expr").is(new Document("$and", List.of(new Document("$lte", List.of(paidAt, stamp)),
                        new Document("$lt", List.of(new Document("$ifNull", List.of("$refundedAmount", 0)), "$amount")))))
                .and("bookingStatus").ne("cancelled");
        mongo.updateMulti(Query.query(scope).addCriteria(Criteria.where("eventChangeRefundEligible").ne(true)),
                new Update().set("eventChangeRefundEligible", true).inc("version", 1L), Payment.class);
        List<String> audience = refreshEligibleUsers(event.getSourceId());
        notifyUsers(event.getSourceId(), event.getTitle(), audience, "event-paid-terms-changed", stamp, event.getPaidTermsChangedBy());
        mongo.updateMulti(Query.query(Criteria.where("sourceId").is(event.getSourceId()).and("paidTermsChangedAtIso").is(stamp)),
                new Update().set("paidTermsRefundsProjectedAtIso", stamp).set("paidTermsRefundsPending", false), ActivityEvent.class);
    }

    private List<String> refreshEligibleUsers(String sourceId) {
        List<String> users = mongo.findDistinct(Query.query(paymentScope(sourceId, null)
                .and("eventChangeRefundEligible").is(true)), "userId", Payment.class, String.class);
        mongo.updateMulti(Query.query(Criteria.where("sourceId").is(sourceId)),
                new Update().set("refundEligibleUserIds", users), ActivityEvent.class);
        return users;
    }

    private static Criteria paymentScope(String sourceId, String userId) {
        Criteria scope = new Criteria().orOperator(Criteria.where("sourceId").is(sourceId), Criteria.where("contextEventId").is(sourceId), Criteria.where("slotSourceId").is(sourceId))
                .and("auditKind").is("payment").and("amount").gt(0)
                .and("status").in("authorized", "approved", "captured", "partially_refunded", "refunded");
        if (StringUtils.hasText(userId)) scope.and("userId").is(userId);
        return scope;
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
