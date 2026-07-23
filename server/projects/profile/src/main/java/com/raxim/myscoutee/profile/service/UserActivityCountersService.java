package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.EventFeedbackState;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class UserActivityCountersService {
    private static final String OWNER_TYPE_EVENT = "event";

    private final UsersRepository usersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AssetsRepository assetsRepository;
    private final EventFeedbackStatesRepository eventFeedbackStatesRepository;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final MongoTemplate mongoTemplate;

    public UserActivityCountersService(
            UsersRepository usersRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository,
            AssetsRepository assetsRepository,
            EventFeedbackStatesRepository eventFeedbackStatesRepository,
            EventParticipationTicketService eventParticipationTicketService,
            MongoTemplate mongoTemplate) {
        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
        this.eventFeedbackStatesRepository = eventFeedbackStatesRepository;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.mongoTemplate = mongoTemplate;
    }

    public void refreshEventCountersForDocuments(Collection<ActivityEvent> events) {
        refreshEventCountersForSourceIds(events == null
                ? List.of()
                : events.stream()
                        .map(event -> normalizeId(event == null ? null : event.getSourceId()))
                        .filter(StringUtils::hasText)
                        .toList());
    }

    public void refreshEventCountersForSourceIds(Collection<String> sourceIds) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return;
        }
        Set<String> userIds = new LinkedHashSet<>();
        for (ActivityEvent event : activityEventsRepository.findBySourceIdIn(normalizedSourceIds)) {
            collectEventUserIds(userIds, event);
        }
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, normalizedSourceIds)) {
            String userId = normalizeId(member == null ? null : member.getUserId());
            if (StringUtils.hasText(userId)) {
                userIds.add(userId);
            }
        }
        refreshEventCountersForUsers(userIds);
    }

    public void refreshEventCountersForUsers(Collection<String> userIds) {
        for (String userId : normalizeIds(userIds)) {
            usersRepository.findByUserId(userId).ifPresent(user -> {
                Users.UserActivitiesRecord current = user.getActivities();
                Users.UserActivitiesRecord next = withEventCounters(
                        current,
                        resolveEventCounters(userId),
                        resolveTicketCount(userId));
                if (!Objects.equals(current, next)) {
                    updateEventCounters(userId, next);
                }
            });
        }
    }

    public void refreshAssetCountersForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(user -> {
            Users.UserActivitiesRecord current = user.getActivities();
            Users.UserActivitiesRecord next = withAssetCounters(current, resolveAssetCounters(normalizedUserId));
            if (!Objects.equals(current, next)) {
                updateAssetCounters(normalizedUserId, next);
            }
        });
    }

    public void applyFeedbackStateTransition(
            String userId,
            boolean wasSubmitted,
            boolean wasRemoved,
            boolean isSubmitted,
            boolean isRemoved) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(user -> {
            FeedbackCounters counters = currentFeedbackCounters(user.getActivities());
            String previousBucket = feedbackBucket(wasSubmitted, wasRemoved);
            String nextBucket = feedbackBucket(isSubmitted, isRemoved);
            if (!Objects.equals(previousBucket, nextBucket)) {
                counters = counters.minus(previousBucket).plus(nextBucket);
            }
            Users.UserActivitiesRecord next = withFeedbackCounters(user.getActivities(), counters);
            if (!Objects.equals(user.getActivities(), next)) {
                updateFeedbackCounters(normalizedUserId, next);
            }
        });
    }

    public void refreshFeedbackReceivedCountersForEvent(String eventId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return;
        }
        Set<String> ownerUserIds = new LinkedHashSet<>();
        for (ActivityEvent event : activityEventsRepository.findBySourceId(normalizedEventId)) {
            if (event == null || isTrashScopeStatus(event)) {
                continue;
            }
            String creatorUserId = normalizeId(event.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                ownerUserIds.add(creatorUserId);
            }
            safeStrings(event.getAdmins()).forEach(ownerUserIds::add);
        }
        for (String ownerUserId : ownerUserIds) {
            refreshFeedbackReceivedCountersForUser(ownerUserId);
        }
    }

    public void refreshFeedbackReceivedCountersForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        usersRepository.findByUserId(normalizedUserId).ifPresent(user -> {
            Users.UserActivitiesRecord current = user.getActivities();
            FeedbackCounters counters = currentFeedbackCounters(current);
            counters = new FeedbackCounters(
                    resolveReceivedFeedbackEventCount(normalizedUserId),
                    counters.pending(),
                    counters.feedbacked(),
                    counters.removed());
            Users.UserActivitiesRecord next = withFeedbackCounters(current, counters);
            if (!Objects.equals(current, next)) {
                updateFeedbackCounters(normalizedUserId, next);
            }
        });
    }

    private EventCounters resolveEventCounters(String userId) {
        Set<String> sourceIds = new LinkedHashSet<>();
        collectSourceIds(sourceIds, activityEventsRepository.findDirectOwnerEvents(userId));
        collectSourceIds(sourceIds, activityEventsRepository.findAdminVisibleEvents(userId));
        collectSourceIds(sourceIds, activityEventsRepository.findAcceptedMembershipEvents(userId));
        collectSourceIds(sourceIds, activityEventsRepository.findActiveInvitationEvents(userId));
        collectSourceIds(sourceIds, activityEventsRepository.findPendingRequestEvents(userId));
        Map<String, ActivityEvent> preferredBySourceId = preferredEventsBySourceId(activityEventsRepository.findBySourceIdIn(sourceIds), userId);

        int active = 0;
        int pending = 0;
        int invitations = 0;
        int hosting = 0;
        int drafts = 0;
        int trash = 0;
        Set<String> countedSources = new LinkedHashSet<>();
        for (ActivityEvent event : preferredBySourceId.values()) {
            String sourceId = normalizeId(event.getSourceId());
            if (!countedSources.add(sourceId)) {
                continue;
            }
            if (isTrashScopeStatus(event)) {
                trash += 1;
                continue;
            }
            if (isInvitationForUser(event, userId)) {
                invitations += 1;
                continue;
            }
            boolean hostingRecord = isHostingRecordForUser(event, userId);
            if (hostingRecord) {
                hosting += 1;
                if (isDraftStatus(event)) {
                    drafts += 1;
                }
                if (isPendingReviewStatus(event)) {
                    pending += 1;
                }
                continue;
            }
            if (isPendingRequestForUser(event, userId) || isPendingReviewStatus(event)) {
                pending += 1;
                continue;
            }
            if (isAcceptedMemberForUser(event, userId) || isActiveEventStatus(event)) {
                active += 1;
            }
        }
        return new EventCounters(active + pending + invitations + hosting, active, pending, invitations, hosting, drafts, trash);
    }

    private AssetCounters resolveAssetCounters(String userId) {
        int cars = 0;
        int accommodation = 0;
        int supplies = 0;
        for (Asset asset : assetsRepository.findByOwnerUserId(userId)) {
            if (asset == null || isSuppressedAssetStatus(asset.getStatus())) {
                continue;
            }
            switch (safeText(asset.getType())) {
                case AssetCatalog.TYPE_TRANSPORT -> cars += 1;
                case AssetCatalog.TYPE_ACCOMMODATION -> accommodation += 1;
                case AssetCatalog.TYPE_SUPPLIES -> supplies += 1;
                default -> {
                }
            }
        }
        return new AssetCounters(cars, accommodation, supplies);
    }

    private int resolveTicketCount(String userId) {
        long ticketCount = eventParticipationTicketService.queryTicketRecordsForUser(userId).stream()
                .filter(Objects::nonNull)
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .count();
        return (int) Math.min(Integer.MAX_VALUE, ticketCount);
    }

    private int resolveReceivedFeedbackEventCount(String userId) {
        Set<String> eventIds = new LinkedHashSet<>();
        for (ActivityEvent event : activityEventsRepository.findByCreatorUserId(userId)) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (StringUtils.hasText(sourceId) && !isTrashScopeStatus(event)) {
                eventIds.add(sourceId);
            }
        }
        for (ActivityEvent event : activityEventsRepository.findByAdminsContaining(userId)) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (StringUtils.hasText(sourceId) && !isTrashScopeStatus(event)) {
                eventIds.add(sourceId);
            }
        }
        if (eventIds.isEmpty()) {
            return 0;
        }
        Set<String> eventsWithFeedback = new LinkedHashSet<>();
        for (EventFeedbackState state : eventFeedbackStatesRepository.findByEventIdInOrderByEventIdAscUpdatedDateDesc(eventIds)) {
            String eventId = normalizeId(state == null ? null : state.getEventId());
            String viewerUserId = normalizeId(state == null ? null : state.getViewerUserId());
            if (StringUtils.hasText(eventId)
                    && !Objects.equals(userId, viewerUserId)
                    && (StringUtils.hasText(state.getSubmittedAtIso()) || StringUtils.hasText(state.getOrganizerNote()))) {
                eventsWithFeedback.add(eventId);
            }
        }
        return eventsWithFeedback.size();
    }

    private Users.UserActivitiesRecord withEventCounters(
            Users.UserActivitiesRecord current,
            EventCounters counters,
            int ticketCount) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        Users.UserAssetCountersRecord currentAsset = safe.asset() == null
                ? emptyActivities().asset()
                : safe.asset();
        return new Users.UserActivitiesRecord(
                count(safe.game()),
                count(safe.chats()),
                counters.invitations(),
                counters.active(),
                counters.hosting(),
                count(safe.cars()),
                count(safe.accommodation()),
                count(safe.supplies()),
                count(ticketCount),
                count(safe.contacts()),
                count(safe.feedback()),
                safe.chat(),
                new Users.UserEventCountersRecord(
                        counters.all(),
                        counters.active(),
                        counters.pending(),
                        counters.invitations(),
                        counters.hosting(),
                        counters.drafts(),
                        counters.trash()),
                new Users.UserAssetCountersRecord(
                        count(currentAsset.cars()),
                        count(currentAsset.accommodation()),
                        count(currentAsset.supplies()),
                        count(ticketCount)),
                safe.eventFeedback(),
                count(safe.adminJobs()),
                count(safe.adminMetrics()));
    }

    private void updateEventCounters(String userId, Users.UserActivitiesRecord next) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || next == null) {
            return;
        }
        Users.UserEventCountersRecord event = next.event() == null ? emptyActivities().event() : next.event();
        Update update = new Update()
                .set("activities.invitations", count(next.invitations()))
                .set("activities.events", count(next.events()))
                .set("activities.hosting", count(next.hosting()))
                .set("activities.event.all", count(event.all()))
                .set("activities.event.active", count(event.active()))
                .set("activities.event.pending", count(event.pending()))
                .set("activities.event.invitations", count(event.invitations()))
                .set("activities.event.hosting", count(event.hosting()))
                .set("activities.event.drafts", count(event.drafts()))
                .set("activities.event.trash", count(event.trash()))
                .set("activities.tickets", count(next.tickets()))
                .set("activities.asset.tickets", count(next.asset() == null ? null : next.asset().tickets()));
        updateUserActivityFields(normalizedUserId, update);
    }

    private Users.UserActivitiesRecord withAssetCounters(Users.UserActivitiesRecord current, AssetCounters counters) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        return new Users.UserActivitiesRecord(
                count(safe.game()),
                count(safe.chats()),
                count(safe.invitations()),
                count(safe.events()),
                count(safe.hosting()),
                counters.cars(),
                counters.accommodation(),
                counters.supplies(),
                count(safe.tickets()),
                count(safe.contacts()),
                count(safe.feedback()),
                safe.chat(),
                safe.event(),
                new Users.UserAssetCountersRecord(
                        counters.cars(),
                        counters.accommodation(),
                        counters.supplies(),
                        count(safe.asset() == null ? null : safe.asset().tickets())),
                safe.eventFeedback(),
                count(safe.adminJobs()),
                count(safe.adminMetrics()));
    }

    private void updateAssetCounters(String userId, Users.UserActivitiesRecord next) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || next == null) {
            return;
        }
        Users.UserAssetCountersRecord asset = next.asset() == null ? emptyActivities().asset() : next.asset();
        Update update = new Update()
                .set("activities.cars", count(next.cars()))
                .set("activities.accommodation", count(next.accommodation()))
                .set("activities.supplies", count(next.supplies()))
                .set("activities.asset.cars", count(asset.cars()))
                .set("activities.asset.accommodation", count(asset.accommodation()))
                .set("activities.asset.supplies", count(asset.supplies()))
                .set("activities.asset.tickets", count(asset.tickets()));
        updateUserActivityFields(normalizedUserId, update);
    }

    private Users.UserActivitiesRecord withFeedbackCounters(Users.UserActivitiesRecord current, FeedbackCounters counters) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        return new Users.UserActivitiesRecord(
                count(safe.game()),
                count(safe.chats()),
                count(safe.invitations()),
                count(safe.events()),
                count(safe.hosting()),
                count(safe.cars()),
                count(safe.accommodation()),
                count(safe.supplies()),
                count(safe.tickets()),
                count(safe.contacts()),
                counters.pending(),
                safe.chat(),
                safe.event(),
                safe.asset(),
                new Users.UserEventFeedbackCountersRecord(
                        counters.ownEvents(),
                        counters.pending(),
                        counters.feedbacked(),
                        counters.removed()),
                count(safe.adminJobs()),
                count(safe.adminMetrics()));
    }

    private void updateFeedbackCounters(String userId, Users.UserActivitiesRecord next) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || next == null) {
            return;
        }
        Users.UserEventFeedbackCountersRecord feedback = next.eventFeedback() == null
                ? emptyActivities().eventFeedback()
                : next.eventFeedback();
        Update update = new Update()
                .set("activities.feedback", count(next.feedback()))
                .set("activities.eventFeedback.ownEvents", count(feedback.ownEvents()))
                .set("activities.eventFeedback.pending", count(feedback.pending()))
                .set("activities.eventFeedback.feedbacked", count(feedback.feedbacked()))
                .set("activities.eventFeedback.removed", count(feedback.removed()));
        updateUserActivityFields(normalizedUserId, update);
    }

    private void updateUserActivityFields(String userId, Update update) {
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("userId").is(userId)),
                update,
                Users.class);
    }

    private Users.UserActivitiesRecord emptyActivities() {
        return new Users.UserActivitiesRecord(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(0, 0, 0, 0),
                new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0),
                0, 0);
    }

    private FeedbackCounters currentFeedbackCounters(Users.UserActivitiesRecord current) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        Users.UserEventFeedbackCountersRecord feedback = safe.eventFeedback();
        return new FeedbackCounters(
                count(feedback == null ? null : feedback.ownEvents()),
                count(feedback == null ? null : feedback.pending()),
                count(feedback == null ? null : feedback.feedbacked()),
                count(feedback == null ? null : feedback.removed()));
    }

    private String feedbackBucket(boolean submitted, boolean removed) {
        if (removed) {
            return "removed";
        }
        return submitted ? "feedbacked" : "pending";
    }

    private void collectEventUserIds(Set<String> userIds, ActivityEvent event) {
        if (event == null) {
            return;
        }
        addUserId(userIds, event.getOwnerUserId());
        addUserId(userIds, event.getCreatorUserId());
        safeStrings(event.getAdmins()).forEach(userIds::add);
    }

    private void addUserId(Set<String> userIds, String userId) {
        String normalized = normalizeId(userId);
        if (StringUtils.hasText(normalized)) {
            userIds.add(normalized);
        }
    }

    private Map<String, ActivityEvent> preferredEventsBySourceId(Collection<ActivityEvent> events, String userId) {
        Map<String, ActivityEvent> preferred = new LinkedHashMap<>();
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            String sourceId = normalizeId(event == null ? null : event.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent current = preferred.get(sourceId);
            if (current == null || eventPreferenceScore(event, userId) > eventPreferenceScore(current, userId)) {
                preferred.put(sourceId, event);
            }
        }
        return preferred;
    }

    private void collectSourceIds(Set<String> sourceIds, Collection<ActivityEvent> events) {
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            String parentEventId = isGeneratedSlotRecord(event)
                    ? normalizeId(event.getParentEventId())
                    : "";
            String sourceId = StringUtils.hasText(parentEventId)
                    ? parentEventId
                    : normalizeId(event == null ? null : event.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
    }

    private boolean isGeneratedSlotRecord(ActivityEvent event) {
        return event != null
                && (Boolean.TRUE.equals(event.getGenerated())
                || StringUtils.hasText(normalizeId(event.getParentEventId()))
                || "slot".equals(safeText(event.getEventType())));
    }

    private int eventPreferenceScore(ActivityEvent event, String userId) {
        if (event == null) {
            return 0;
        }
        String normalizedUserId = normalizeId(userId);
        return (normalizedUserId.equals(normalizeId(event.getOwnerUserId())) ? 64 : 0)
                + (isTrashScopeStatus(event) ? 0 : 16)
                + (isHostingRecordForUser(event, normalizeId(event.getCreatorUserId())) ? 8 : 0)
                + (isActiveEventStatus(event) ? 2 : 0)
                + (!safeStrings(event.getAdmins()).isEmpty() ? 1 : 0);
    }

    private boolean isHostingRecordForUser(ActivityEvent event, String userId) {
        if (event == null) {
            return false;
        }
        String normalizedUserId = normalizeId(userId);
        return StringUtils.hasText(normalizedUserId)
                && (normalizedUserId.equals(normalizeId(event.getCreatorUserId()))
                        || safeStrings(event.getAdmins()).contains(normalizedUserId));
    }

    private boolean isInvitationForUser(ActivityEvent event, String userId) {
        return event != null && safeStrings(event.getInvitedMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isPendingRequestForUser(ActivityEvent event, String userId) {
        return event != null && safeStrings(event.getPendingRequestMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isAcceptedMemberForUser(ActivityEvent event, String userId) {
        return event != null && safeStrings(event.getAcceptedMemberUserIds()).contains(normalizeId(userId));
    }

    private boolean isDraftStatus(ActivityEvent event) {
        return event != null
                && (Boolean.FALSE.equals(event.getPublished()) || ActivityEvent.STATUS_DRAFT.equals(normalizeStatus(event.getStatus())));
    }

    private boolean isPendingReviewStatus(ActivityEvent event) {
        String status = normalizeStatus(event == null ? null : event.getStatus());
        return ActivityEvent.STATUS_UNDER_REVIEW.equals(status) || ActivityEvent.STATUS_BLOCKED.equals(status);
    }

    private boolean isActiveEventStatus(ActivityEvent event) {
        String status = normalizeStatus(event == null ? null : event.getStatus());
        return ActivityEvent.STATUS_ACTIVE.equals(status) || !StringUtils.hasText(status);
    }

    private boolean isTrashScopeStatus(ActivityEvent event) {
        if (event == null || Boolean.TRUE.equals(event.getIsTrashed())) {
            return true;
        }
        String status = normalizeStatus(event.getStatus());
        return ActivityEvent.STATUS_TRASHED.equals(status);
    }

    private boolean isSuppressedAssetStatus(String status) {
        String normalized = normalizeStatus(status);
        return ActivityEvent.STATUS_UNDER_REVIEW.equals(normalized)
                || ActivityEvent.STATUS_BLOCKED.equals(normalized)
                || ActivityEvent.STATUS_DELETED.equals(normalized)
                || ActivityEvent.STATUS_INACTIVE.equals(normalized)
                || ActivityEvent.STATUS_TRASHED.equals(normalized);
    }

    private List<String> normalizeIds(Collection<String> values) {
        return values == null
                ? List.of()
                : values.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
    }

    private List<String> safeStrings(Collection<String> values) {
        return values == null
                ? List.of()
                : values.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
    }

    private String normalizeStatus(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "active" -> ActivityEvent.STATUS_ACTIVE;
            case "draft" -> ActivityEvent.STATUS_DRAFT;
            case "trashed", "trash" -> ActivityEvent.STATUS_TRASHED;
            case "under-review", "under review" -> ActivityEvent.STATUS_UNDER_REVIEW;
            case "blocked" -> ActivityEvent.STATUS_BLOCKED;
            case "deleted" -> ActivityEvent.STATUS_DELETED;
            case "inactive" -> ActivityEvent.STATUS_INACTIVE;
            default -> normalized.toUpperCase();
        };
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private int count(Integer value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, value.intValue());
    }

    private record EventCounters(
            int all,
            int active,
            int pending,
            int invitations,
            int hosting,
            int drafts,
            int trash) {
    }

    private record AssetCounters(
            int cars,
            int accommodation,
            int supplies) {
    }

    private record FeedbackCounters(
            int ownEvents,
            int pending,
            int feedbacked,
            int removed) {
        FeedbackCounters plus(String bucket) {
            return switch (bucket) {
                case "removed" -> new FeedbackCounters(ownEvents, pending, feedbacked, removed + 1);
                case "feedbacked" -> new FeedbackCounters(ownEvents, pending, feedbacked + 1, removed);
                default -> new FeedbackCounters(ownEvents, pending + 1, feedbacked, removed);
            };
        }

        FeedbackCounters minus(String bucket) {
            return switch (bucket) {
                case "removed" -> new FeedbackCounters(ownEvents, pending, feedbacked, Math.max(0, removed - 1));
                case "feedbacked" -> new FeedbackCounters(ownEvents, pending, Math.max(0, feedbacked - 1), removed);
                default -> new FeedbackCounters(ownEvents, Math.max(0, pending - 1), feedbacked, removed);
            };
        }
    }
}
