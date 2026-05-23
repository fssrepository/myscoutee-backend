package com.raxim.myscoutee.profile.service;

import java.text.Normalizer;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.BeanUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.ActivitiesEventSyncPayloadDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExplorePageDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExploreQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsFilterRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardFifaStandingRowDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardGroupDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardMemberDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardScoreStandingRowDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class ActivitiesEventsService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Logger LOGGER = LoggerFactory.getLogger(ActivitiesEventsService.class);
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String TYPE_EVENTS = "events";
    private static final String TYPE_HOSTING = "hosting";
    private static final String TYPE_INVITATIONS = "invitations";
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_HOSTING = "H";
    private static final String STATUS_DRAFT = "DR";
    private static final String STATUS_TRASHED = "T";
    private static final String STATUS_UNDER_REVIEW = "UR";
    private static final String STATUS_BLOCKED = "B";
    private static final String STATUS_DELETED = "D";
    private static final String STATUS_INACTIVE = "I";
    private static final String STAGE_STATUS_ACTIVE = "A";
    private static final String STAGE_STATUS_START_REVIEW = "RS";
    private static final String STAGE_STATUS_SCORE_REVIEW = "SR";
    private static final String STAGE_STATUS_FINALIZED = "F";
    private static final String STAGE_STATUS_SUSPENDED = "S";
    private static final String STAGE_ACTION_START = "start-tournament";
    private static final String STAGE_ACTION_CLOSE = "close-stage";
    private static final String STAGE_ACTION_FINALIZE = "finalize-stage";
    private static final String STAGE_ACTION_REOPEN = "reopen-scores";
    private static final String STAGE_ACTION_SUSPEND = "suspend-tournament";
    private static final String STAGE_ACTION_RESUME = "resume-tournament";
    private static final int MONGO_NO_QUERY_EXECUTION_PLANS_CODE = 291;
    private static final double AFFINITY_DISTANCE_BOOST_SCALE = 10_000d;
    private static final AtomicBoolean MISSING_EVENT_GEO_INDEX_WARNING_LOGGED = new AtomicBoolean(false);
    private static final ThreadLocal<EventQueryContext> ACTIVE_CONTEXT = new ThreadLocal<>();

    private final ActivityEventsRepository activityEventsRepository;
    private final UsersRepository usersRepository;
    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final ActivitiesMembersService activitiesMembersService;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final PaymentService paymentService;
    private final ScheduledMessageTaskService scheduledMessageTaskService;
    private final AbsoluteAffinityService absoluteAffinityService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;
    private final MongoTemplate mongoTemplate;
    private final ChatAttachmentLifecycleService chatAttachmentLifecycleService;
    private final NotificationOutboxService notificationOutboxService;
    private final ObjectProvider<EventScheduler> eventSchedulerProvider;
    private final ActivitiesChatService activitiesChatService;
    private final ActivitiesEventLeaderboardService activitiesEventLeaderboardService;

    public ActivitiesEventsService(
            ActivityEventsRepository activityEventsRepository,
            UsersRepository usersRepository,
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            HomeUserProfileService homeUserProfileService,
            ActivitiesMembersService activitiesMembersService,
            EventParticipationTicketService eventParticipationTicketService,
            PaymentService paymentService,
            ScheduledMessageTaskService scheduledMessageTaskService,
            AbsoluteAffinityService absoluteAffinityService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService,
            MongoTemplate mongoTemplate,
            ChatAttachmentLifecycleService chatAttachmentLifecycleService,
            NotificationOutboxService notificationOutboxService,
            ObjectProvider<EventScheduler> eventSchedulerProvider,
            ActivitiesChatService activitiesChatService,
            ActivitiesEventLeaderboardService activitiesEventLeaderboardService) {
        this.activityEventsRepository = activityEventsRepository;
        this.usersRepository = usersRepository;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.activitiesMembersService = activitiesMembersService;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.paymentService = paymentService;
        this.scheduledMessageTaskService = scheduledMessageTaskService;
        this.absoluteAffinityService = absoluteAffinityService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.mongoTemplate = mongoTemplate;
        this.chatAttachmentLifecycleService = chatAttachmentLifecycleService;
        this.notificationOutboxService = notificationOutboxService;
        this.eventSchedulerProvider = eventSchedulerProvider;
        this.activitiesChatService = activitiesChatService;
        this.activitiesEventLeaderboardService = activitiesEventLeaderboardService;
    }

    private EventQueryContext buildUserQueryContext(ViewerContext viewer) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return new EventQueryContext(List.of(), List.of(), new LinkedHashMap<>(), Set.of(), Map.of());
        }

        List<ActivityEvent> directOwnerRecords = queryDirectOwnerRecords(viewer.userId());
        Set<String> directSourceIds = directOwnerRecords.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        Set<String> membershipSourceIds = new LinkedHashSet<>(activitiesMembersService.findTrackedEventSourceIdsForUser(viewer.userId()));
        membershipSourceIds.removeAll(directSourceIds);

        List<ActivityEvent> membershipRecords = loadEventDocumentsBySourceIds(membershipSourceIds);
        List<ActivityEvent> scopedEvents = new ArrayList<>(directOwnerRecords.size() + membershipRecords.size());
        scopedEvents.addAll(directOwnerRecords);
        scopedEvents.addAll(membershipRecords);

        return new EventQueryContext(
                scopedEvents,
                scopedEvents,
                buildMemberSnapshotMap(scopedEvents),
                activitiesMembersService.findTrackedEventSourceIdsForUser(viewer.userId()),
                queryEventOwnerEdgeWeights(viewer, scopedEvents));
    }

    private EventQueryContext buildExploreQueryContext(ViewerContext viewer) {
        List<ActivityEvent> allEvents = queryCanonicalExploreRecords();
        LinkedHashSet<String> trackedSourceIds = new LinkedHashSet<>();
        if (viewer != null && StringUtils.hasText(viewer.userId())) {
            trackedSourceIds.addAll(activitiesMembersService.findTrackedEventSourceIdsForUser(viewer.userId()));
            queryDirectOwnerRecords(viewer.userId()).stream()
                    .map(ActivityEvent::getSourceId)
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .forEach(trackedSourceIds::add);
        }
        return new EventQueryContext(
                allEvents,
                allEvents,
                new LinkedHashMap<>(),
                trackedSourceIds,
                queryEventOwnerEdgeWeights(viewer, allEvents));
    }

    private Map<String, Double> queryEventOwnerEdgeWeights(ViewerContext viewer, Collection<ActivityEvent> records) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return Map.of();
        }
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        userIds.add(viewer.userId());
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            String ownerUserId = resolveEventOwnerUserId(record);
            if (StringUtils.hasText(ownerUserId)) {
                userIds.add(ownerUserId);
            }
        }
        return queryAffinityEdgeWeights(userIds);
    }

    private Map<String, Double> queryAffinityEdgeWeights(Collection<String> userIds) {
        List<String> normalizedUserIds = userIds == null
                ? List.of()
                : userIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
        if (normalizedUserIds.isEmpty()) {
            return Map.of();
        }

        Map<String, Double> weightsByPairKey = new LinkedHashMap<>();
        for (UserAffinityEdge edge : userAffinityEdgesRepository.findRelevantByUserIds(normalizedUserIds)) {
            String leftUserId = normalizeId(edge == null ? null : edge.getLeftUserId());
            String rightUserId = normalizeId(edge == null ? null : edge.getRightUserId());
            if (!StringUtils.hasText(leftUserId)
                    || !StringUtils.hasText(rightUserId)
                    || leftUserId.equals(rightUserId)) {
                continue;
            }
            double edgeWeight = resolveAffinityEdgeWeight(edge);
            if (edgeWeight <= 0d) {
                continue;
            }
            String key = pairKey(leftUserId, rightUserId);
            Double existingWeight = weightsByPairKey.get(key);
            if (existingWeight == null || edgeWeight > existingWeight.doubleValue()) {
                weightsByPairKey.put(key, edgeWeight);
            }
        }
        return weightsByPairKey;
    }

    private double resolveAffinityEdgeWeight(UserAffinityEdge edge) {
        if (edge == null) {
            return 0d;
        }
        Double edgeWeight = edge.getEdgeWeight();
        if (edgeWeight == null || !Double.isFinite(edgeWeight) || edgeWeight <= 0d) {
            edgeWeight = edge.getAffinityScore();
        }
        if (edgeWeight == null || !Double.isFinite(edgeWeight)) {
            return 0d;
        }
        return Math.max(0d, Math.min(1d, edgeWeight));
    }

    private Map<String, ActivitiesMembersService.OwnerMembersSnapshot> buildMemberSnapshotMap(List<ActivityEvent> records) {
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : computePreferredEventRecords(records)) {
            String sourceId = normalizeId(record.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                preferredBySourceId.put(sourceId, record);
            }
        }
        if (preferredBySourceId.isEmpty()) {
            return new LinkedHashMap<>();
        }
        return new LinkedHashMap<>(activitiesMembersService.buildBatchEventSnapshots(preferredBySourceId));
    }

    public boolean isPagedFilterRequest(EventsFilterRequestDto request) {
        return request != null
                && (request.limit() != null
                        || StringUtils.hasText(request.cursor())
                        || StringUtils.hasText(request.secondaryFilter())
                        || StringUtils.hasText(request.sort())
                        || StringUtils.hasText(request.view()));
    }

    public boolean isPagedExploreRequest(EventsExploreQueryDto request) {
        return request != null
                && (request.limit() != null
                        || StringUtils.hasText(request.cursor())
                        || StringUtils.hasText(request.order())
                        || StringUtils.hasText(request.view())
                        || request.friendsOnly() != null
                        || request.openSpotsOnly() != null
                        || StringUtils.hasText(request.topic())
                        || (request.excludedSourceIds() != null && !request.excludedSourceIds().isEmpty()));
    }

    public List<EventRecordDto> queryItemsByUser(String requestedUserId) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        try {
            ACTIVE_CONTEXT.set(buildUserQueryContext(viewer));
            return queryUserRecords(viewer).stream()
                    .map(record -> toEventRecordDto(record, viewer))
                    .filter(Objects::nonNull)
                    .sorted(listItemComparator())
                    .toList();
        } finally {
            ACTIVE_CONTEXT.remove();
        }
    }

    public List<EventRecordDto> queryInvitations(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return queryDirectScopedRecords(viewer, "invitations", "all").stream()
                .map(record -> toEventRecordDto(record, viewer))
                .filter(Objects::nonNull)
                .sorted(listItemComparator())
                .toList();
    }

    public List<EventRecordDto> queryAttending(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        try {
            ACTIVE_CONTEXT.set(buildUserQueryContext(viewer));
            return queryUserRecords(viewer).stream()
                    .filter(record -> TYPE_EVENTS.equals(resolveViewerScopedEventType(record, viewer.userId())))
                    .map(record -> toEventRecordDto(record, viewer))
                    .filter(Objects::nonNull)
                    .sorted(listItemComparator())
                    .toList();
        } finally {
            ACTIVE_CONTEXT.remove();
        }
    }

    public List<EventRecordDto> queryHosting(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return queryDirectScopedRecords(viewer, "my-events", "all").stream()
                .map(record -> toEventRecordDto(record, viewer))
                .filter(Objects::nonNull)
                .sorted(listItemComparator())
                .toList();
    }

    public List<EventRecordDto> queryTrash(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return queryDirectScopedRecords(viewer, "trash", "all").stream()
                .map(record -> toEventRecordDto(record, viewer))
                .filter(Objects::nonNull)
                .sorted(listItemComparator())
                .toList();
    }

    public List<EventRecordDto> queryItemsByFilter(EventsFilterRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        if (viewer == null) {
            return List.of();
        }
        String filter = normalizeEventScopeFilter(request == null ? null : request.filter());
        String hostingPublicationFilter = normalizeHostingPublicationFilter(request == null ? null : request.hostingPublicationFilter());
        if (usesDirectOwnerScope(filter)) {
            return queryDirectScopedRecords(viewer, filter, hostingPublicationFilter).stream()
                    .map(record -> toEventRecordDto(record, viewer))
                    .filter(Objects::nonNull)
                    .sorted(listItemComparator())
                    .toList();
        }
        materializeSlotOccurrences();
        try {
            ACTIVE_CONTEXT.set(buildUserQueryContext(viewer));
            return queryFilteredRecords(viewer, request).stream()
                    .map(record -> toEventRecordDto(record, viewer))
                    .filter(Objects::nonNull)
                    .sorted(listItemComparator())
                    .toList();
        } finally {
            ACTIVE_CONTEXT.remove();
        }
    }

    public EventsExplorePageDto queryActivitiesEventPage(EventsFilterRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }
        String filter = normalizeEventScopeFilter(request == null ? null : request.filter());
        String hostingPublicationFilter = normalizeHostingPublicationFilter(request == null ? null : request.hostingPublicationFilter());
        if (usesDirectOwnerScope(filter)) {
            return pageDirectScopedRecords(viewer, filter, hostingPublicationFilter, request);
        }
        materializeSlotOccurrences();
        try {
            ACTIVE_CONTEXT.set(buildUserQueryContext(viewer));

            String secondaryFilter = normalizeActivitiesSecondaryFilter(request == null ? null : request.secondaryFilter());
            String view = normalizeActivitiesView(request == null ? null : request.view());
            String sort = normalizeActivitiesSort(request == null ? null : request.sort(), view, secondaryFilter);
            Integer requestedLimit = request == null ? null : request.limit();
            int limit = normalizeLimit(requestedLimit, 10);

            List<EventProjection> sorted = queryFilteredRecords(viewer, request).stream()
                    .map(record -> toProjection(record, viewer))
                    .filter(Objects::nonNull)
                    .filter(projection -> matchesActivitiesSecondaryFilter(projection, secondaryFilter))
                    .filter(projection -> matchesActivitiesCalendarRange(projection, request, view))
                    .sorted((left, right) -> compareActivitiesProjection(left, right, sort, view, secondaryFilter))
                    .toList();

            if ("week".equals(view) || "month".equals(view)) {
                return new EventsExplorePageDto(sorted.stream().map(EventProjection::item).toList(), sorted.size(), null);
            }

            String cursor = request == null ? null : request.cursor();
            int startIndex = resolveCursorStartIndex(sorted, cursor);
            int endIndex = Math.min(sorted.size(), startIndex + limit);
            List<EventRecordDto> records = sorted.subList(startIndex, endIndex).stream()
                    .map(EventProjection::item)
                    .toList();
            String nextCursor = endIndex < sorted.size() && !records.isEmpty()
                    ? serializeCursor(records.get(records.size() - 1))
                    : null;
            return new EventsExplorePageDto(records, sorted.size(), nextCursor);
        } finally {
            ACTIVE_CONTEXT.remove();
        }
    }

    public List<EventRecordDto> queryExploreItems(String requestedUserId) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        try {
            ACTIVE_CONTEXT.set(buildExploreQueryContext(viewer));
            List<ActivityEvent> records = computeExploreRecords(viewer);
            return records.stream()
                    .map(record -> toEventRecordDto(record, viewer))
                    .filter(Objects::nonNull)
                    .sorted(Comparator
                            .comparing((EventRecordDto item) -> toSortableDate(item.startAtIso()))
                            .thenComparing(item -> safeText(item.id())))
                    .toList();
        } finally {
            ACTIVE_CONTEXT.remove();
        }
    }

    public EventsExplorePageDto queryEventExplorePage(EventsExploreQueryDto request) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }
        try {
            ACTIVE_CONTEXT.set(buildExploreQueryContext(viewer));

            String order = normalizeExploreOrder(request == null ? null : request.order());
            String view = normalizeExploreView(request == null ? null : request.view());
            String topic = normalizeTopic(request == null ? null : request.topic());
            Boolean requestedFriendsOnly = request == null ? null : request.friendsOnly();
            Boolean requestedOpenSpotsOnly = request == null ? null : request.openSpotsOnly();
            Integer requestedLimit = request == null ? null : request.limit();
            boolean friendsOnly = Boolean.TRUE.equals(requestedFriendsOnly);
            boolean openSpotsOnly = Boolean.TRUE.equals(requestedOpenSpotsOnly);
            int limit = normalizeLimit(requestedLimit, 10);
            String cursor = request == null ? null : request.cursor();
            Set<String> excludedSourceIds = new LinkedHashSet<>(normalizeIds(request == null ? null : request.excludedSourceIds()));

            List<ActivityEvent> exploreRecords = computeExploreRecords(viewer);

            List<EventProjection> sorted = exploreRecords.stream()
                    .filter(record -> !excludedSourceIds.contains(normalizeId(record.getSourceId())))
                    .map(record -> toProjection(record, viewer))
                    .filter(Objects::nonNull)
                    .filter(projection -> !hasTrackedUserParticipation(projection.record(), viewer.userId()))
                    .filter(projection -> !friendsOnly || exploreHasFriendGoing(projection.record(), viewer.userId()))
                    .filter(projection -> !openSpotsOnly || exploreHasOpenSpots(projection.record()))
                    .filter(projection -> !StringUtils.hasText(topic) || hasTopic(projection.record(), topic))
                    .sorted((left, right) -> compareExploreProjection(left, right, order, view))
                    .toList();

            int startIndex = resolveCursorStartIndex(sorted, cursor);
            int endIndex = Math.min(sorted.size(), startIndex + limit);
            List<EventRecordDto> records = sorted.subList(startIndex, endIndex).stream()
                    .map(EventProjection::item)
                    .toList();
            String nextCursor = endIndex < sorted.size() && !records.isEmpty()
                    ? serializeCursor(records.get(records.size() - 1))
                    : null;
            return new EventsExplorePageDto(records, sorted.size(), nextCursor);
        } finally {
            ACTIVE_CONTEXT.remove();
        }
    }

    public void trash(EventActionRequestDto request) {
        maybePostMemberLeftMessage(request);
        maybeApplyLeaveCancellationRefund(request);
        List<ActivityEvent> updated = updateItemState(request, current -> {
            current.setStatus(STATUS_TRASHED);
            current.setIsTrashed(true);
            current.setTrashedAtIso(Instant.now().toString());
        });
        syncStageReminderTasksForSavedEvents(updated, request == null ? null : request.userId());
        markEventAttachmentsUnavailable(updated, "trashed");
    }

    public void publish(EventActionRequestDto request) {
        String nowIso = Instant.now().toString();
        List<ActivityEvent> updated = updateItemState(request, current -> {
            current.setStatus(TYPE_HOSTING.equals(normalizeType(current.getType())) ? STATUS_HOSTING : STATUS_ACTIVE);
            current.setPublished(true);
            current.setSubEvents(ensureTournamentStartReviewStage(current.getSubEvents(), nowIso));
        });
        syncStageReminderTasksForSavedEvents(updated, request == null ? null : request.userId());
        markEventAttachmentsAvailable(updated);
        enqueueTournamentStartReviewNotifications(updated, request == null ? null : request.userId());
        runInitialAutoInviteBatch(updated);
    }

    public void unpublish(EventActionRequestDto request) {
        List<ActivityEvent> updated = updateItemState(request, current -> {
            current.setStatus(STATUS_DRAFT);
            current.setPublished(false);
        });
        syncStageReminderTasksForSavedEvents(updated, request == null ? null : request.userId());
        markEventAttachmentsUnavailable(updated, "unpublished");
    }

    public void restore(EventActionRequestDto request) {
        List<ActivityEvent> updated = updateItemState(request, current -> {
            current.setStatus(TYPE_HOSTING.equals(normalizeType(current.getType())) ? STATUS_HOSTING : STATUS_ACTIVE);
            current.setStatusBeforeSuppression(null);
            current.setIsTrashed(false);
            current.setTrashedAtIso(null);
        });
        syncStageReminderTasksForSavedEvents(updated, request == null ? null : request.userId());
        markEventAttachmentsAvailable(updated);
    }

    public void takeOver(EventActionRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return;
        }
        List<ActivityEvent> documents = activityEventsRepository.findBySourceId(sourceId).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .toList();
        ActivityEvent preferred = computePreferredEventRecords(documents).stream().findFirst().orElse(null);
        if (!isViewerAdmin(preferred, viewer.userId())) {
            return;
        }
        String nowIso = Instant.now().toString();
        List<ActivityEvent> updated = new ArrayList<>();
        for (ActivityEvent document : documents) {
            if (!STATUS_UNDER_REVIEW.equals(safeText(document.getStatus()))) {
                continue;
            }
            ActivityEvent next = cloneDocument(document);
            String restoredStatus = safeText(next.getStatusBeforeSuppression());
            if (!StringUtils.hasText(restoredStatus) || isSuppressedLifecycleStatus(restoredStatus)) {
                restoredStatus = TYPE_HOSTING.equals(normalizeType(next.getType())) ? STATUS_HOSTING : STATUS_ACTIVE;
            }
            next.setStatus(restoredStatus);
            next.setStatusBeforeSuppression(null);
            next.setIsTrashed(false);
            next.setTrashedAtIso(null);
            next.setPublished(!STATUS_DRAFT.equals(restoredStatus));
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(viewer.userId());
            next.setAdmins(resolveAdminUserIds(next.getSourceId(), next.getCreatorUserId()));
            next.normalizeLifecycleState();
            updated.add(next);
        }
        if (updated.isEmpty()) {
            return;
        }
        updated = activityEventsRepository.saveAll(updated);
        affinityRecomputeTaskService.enqueueEventChanged(sourceId, viewer.userId());
        syncStageReminderTasksForSavedEvents(updated, request == null ? null : request.userId());
        markEventAttachmentsAvailable(updated);
    }

    public EventRecordDto applyStageAction(EventStageActionRequestDto request) {
        if (request == null) {
            return null;
        }
        ViewerContext viewer = resolveViewer(request.userId());
        String sourceId = normalizeId(request.sourceId());
        StageActionTarget actionTarget = resolveStageActionTarget(request);
        if (viewer == null || !StringUtils.hasText(sourceId) || actionTarget == null) {
            return null;
        }

        List<ActivityEvent> documents = activityEventsRepository.findBySourceId(sourceId).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .toList();
        ActivityEvent preferred = computePreferredEventRecords(documents).stream().findFirst().orElse(null);
        if (preferred == null || !isViewerAdmin(preferred, viewer.userId())) {
            return preferred == null ? null : toEventRecordDto(preferred, viewer);
        }

        List<SubEventFormItemDto> preferredSubEvents = cloneSubEvents(preferred.getSubEvents());
        int preferredStageIndex = resolveStageIndex(preferredSubEvents, request.subEventId(), request.subEventIndex());
        if (preferredStageIndex < 0 || preferredStageIndex >= preferredSubEvents.size()) {
            return toEventRecordDto(preferred, viewer);
        }
        SubEventFormItemDto preferredStage = preferredSubEvents.get(preferredStageIndex);
        if (!canApplyStageAction(actionTarget.action(), preferredStage, preferredSubEvents, preferredStageIndex)) {
            return toEventRecordDto(preferred, viewer);
        }

        String nowIso = Instant.now().toString();
        String stageId = normalizeId(preferredStage.id());
        List<ActivityEvent> updated = new ArrayList<>();
        for (ActivityEvent document : documents) {
            List<SubEventFormItemDto> subEvents = cloneSubEvents(document.getSubEvents());
            int stageIndex = resolveStageIndex(subEvents, stageId, preferredStageIndex);
            if (stageIndex < 0 || stageIndex >= subEvents.size()) {
                continue;
            }
            ActivityEvent next = cloneDocument(document);
            List<SubEventFormItemDto> nextSubEvents = new ArrayList<>(subEvents);
            nextSubEvents.set(stageIndex, copySubEventWithStageStatus(
                    subEvents.get(stageIndex),
                    actionTarget.nextStatus(),
                    actionTarget.reason(),
                    nowIso,
                    STAGE_STATUS_FINALIZED.equals(actionTarget.nextStatus()) ? nowIso : null,
                    STAGE_STATUS_FINALIZED.equals(actionTarget.nextStatus()) ? viewer.userId() : null));
            next.setSubEvents(nextSubEvents);
            if (STAGE_ACTION_START.equals(actionTarget.action())) {
                next.setAutoInviter(false);
            }
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(viewer.userId());
            next.setAdmins(resolveAdminUserIds(next.getSourceId(), next.getCreatorUserId()));
            next.normalizeLifecycleState();
            updated.add(next);
        }

        if (updated.isEmpty()) {
            return toEventRecordDto(preferred, viewer);
        }

        List<ActivityEvent> saved = activityEventsRepository.saveAll(updated);
        affinityRecomputeTaskService.enqueueEventChanged(sourceId, viewer.userId());
        syncStageReminderTasksForSavedEvents(saved, viewer.userId());
        if (STAGE_ACTION_START.equals(actionTarget.action())) {
            EventScheduler scheduler = eventSchedulerProvider == null ? null : eventSchedulerProvider.getIfAvailable();
            if (scheduler != null) {
                scheduler.generateRandomPlansForEvents(List.of(sourceId));
            }
            List<ActivityEvent> refreshed = activityEventsRepository.findBySourceId(sourceId).stream()
                    .filter(Objects::nonNull)
                    .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                    .map(this::cloneDocument)
                    .peek(ActivityEvent::normalizeLifecycleState)
                    .toList();
            if (!refreshed.isEmpty()) {
                saved = refreshed;
            }
        }

        ActivityEvent savedPreferred = computePreferredEventRecords(saved).stream().findFirst().orElse(saved.get(0));
        List<SubEventFormItemDto> savedSubEvents = cloneSubEvents(savedPreferred.getSubEvents());
        int savedStageIndex = resolveStageIndex(savedSubEvents, stageId, preferredStageIndex);
        SubEventFormItemDto savedStage = savedStageIndex >= 0 && savedStageIndex < savedSubEvents.size()
                ? savedSubEvents.get(savedStageIndex)
                : preferredStage;
        boolean finalStage = savedStageIndex >= 0 && savedStageIndex == savedSubEvents.size() - 1;
        TournamentResultSummary resultSummary = resolveTournamentResultSummary(savedPreferred, savedStage, finalStage);
        enqueueStageStatusNotifications(savedPreferred, savedStage, actionTarget.action(), actionTarget.nextStatus(), viewer.userId(), finalStage, resultSummary);
        postStageChatMessage(savedPreferred, savedStage, actionTarget.action(), actionTarget.nextStatus(), finalStage, resultSummary);
        adminTelemetryService.record("event.stage.action", "events", sourceId, viewer.userId(), 1L, Map.of(
                "action", actionTarget.action(),
                "stageStatus", actionTarget.nextStatus(),
                "stageId", firstNonBlank(stageId, Integer.toString(preferredStageIndex))));
        return toEventRecordDto(savedPreferred, viewer);
    }

    public EventRecordDto requestJoin(EventActionRequestDto request) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        String slotSourceId = request == null ? null : normalizeId(request.slotSourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return null;
        }
        final String requestedSourceId = Objects.requireNonNull(sourceId);

        ActivityEvent preferred = findPreferredEventRecord(requestedSourceId);
        if (preferred == null) {
            return null;
        }
        if (viewer.userId().equals(normalizeId(preferred.getCreatorUserId()))) {
            return toEventRecordDto(preferred, viewer);
        }
        boolean approvalRequested = isApprovalRequested(request);
        boolean waitingList = isWaitlistRequested(request) || isRecordFull(preferred);
        boolean accepted = !waitingList && isConfirmedBooking(request, preferred);

        if (StringUtils.hasText(slotSourceId)) {
            final String requestedSlotSourceId = Objects.requireNonNull(slotSourceId);
            ActivityEvent slotRecord = loadEventDocumentsBySourceIds(List.of(requestedSlotSourceId)).stream()
                    .filter(this::isGeneratedSlotRecord)
                    .findFirst()
                    .orElse(null);
            if (slotRecord != null) {
                waitingList = waitingList || isRecordFull(slotRecord);
                accepted = !waitingList && isConfirmedBooking(request, preferred);
                activitiesMembersService.requestJoin(sourceId, viewer.user(), preferred, accepted, waitingList, approvalRequested);
                ActivitiesMembersService.OwnerMembersSnapshot slotSnapshot =
                        activitiesMembersService.requestJoin(slotSourceId, viewer.user(), slotRecord, accepted, waitingList, approvalRequested);
                boolean joinedSlot = isAcceptedMember(slotSnapshot, viewer.userId());
                affinityRecomputeTaskService.enqueueEventMembersChanged(sourceId, viewer.userId());
                affinityRecomputeTaskService.enqueueEventMembersChanged(slotSourceId, viewer.userId());
                if (joinedSlot) {
                    recordJoinPayment(request, viewer.userId(), sourceId, slotSourceId, slotRecord.getStartAtIso(), preferred);
                    postMemberJoinedMessage(sourceId, viewer.user());
                }
                ActivityEvent refreshedSlotRecord = loadEventDocumentsBySourceIds(List.of(requestedSlotSourceId)).stream()
                        .filter(this::isGeneratedSlotRecord)
                        .findFirst()
                        .orElse(slotRecord);
                return toEventRecordDto(buildMembershipProjection(viewer.userId(), refreshedSlotRecord), viewer);
            }
        }

        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                activitiesMembersService.requestJoin(sourceId, viewer.user(), preferred, accepted, waitingList, approvalRequested);
        boolean joined = isAcceptedMember(snapshot, viewer.userId());
        affinityRecomputeTaskService.enqueueEventMembersChanged(sourceId, viewer.userId());
        if (joined) {
            recordJoinPayment(request, viewer.userId(), sourceId, null, preferred.getStartAtIso(), preferred);
            postMemberJoinedMessage(sourceId, viewer.user());
        }
        ActivityEvent refreshed = findPreferredEventRecord(sourceId);
        return toEventRecordDto(buildMembershipProjection(viewer.userId(), refreshed == null ? preferred : refreshed), viewer);
    }

    private boolean isAcceptedMember(ActivitiesMembersService.OwnerMembersSnapshot snapshot, String userId) {
        String normalizedUserId = normalizeId(userId);
        return StringUtils.hasText(normalizedUserId)
                && snapshot != null
                && snapshot.acceptedMemberUserIds().contains(normalizedUserId);
    }

    private StageActionTarget resolveStageActionTarget(EventStageActionRequestDto request) {
        String action = safeText(request == null ? null : request.action());
        return switch (action) {
            case STAGE_ACTION_START -> new StageActionTarget(action, STAGE_STATUS_ACTIVE,
                    firstNonBlank(request == null ? null : request.reason(), "tournament-started"));
            case STAGE_ACTION_CLOSE -> new StageActionTarget(action, STAGE_STATUS_SCORE_REVIEW,
                    firstNonBlank(request == null ? null : request.reason(), "stage-closed"));
            case STAGE_ACTION_FINALIZE -> new StageActionTarget(action, STAGE_STATUS_FINALIZED,
                    firstNonBlank(request == null ? null : request.reason(), "stage-finalized"));
            case STAGE_ACTION_REOPEN -> new StageActionTarget(action, STAGE_STATUS_SCORE_REVIEW,
                    firstNonBlank(request == null ? null : request.reason(), "scores-reopened"));
            case STAGE_ACTION_SUSPEND -> new StageActionTarget(action, STAGE_STATUS_SUSPENDED,
                    firstNonBlank(request == null ? null : request.reason(), "manual-suspension"));
            case STAGE_ACTION_RESUME -> new StageActionTarget(action, STAGE_STATUS_SCORE_REVIEW,
                    firstNonBlank(request == null ? null : request.reason(), "manual-resume"));
            default -> null;
        };
    }

    private boolean canApplyStageAction(
            String action,
            SubEventFormItemDto stage,
            List<SubEventFormItemDto> stages,
            int stageIndex) {
        String status = normalizeStageStatus(stage == null ? null : stage.stageStatus());
        return switch (safeText(action)) {
            case STAGE_ACTION_START -> stageIndex == 0 && STAGE_STATUS_START_REVIEW.equals(status);
            case STAGE_ACTION_CLOSE -> STAGE_STATUS_ACTIVE.equals(status);
            case STAGE_ACTION_FINALIZE -> STAGE_STATUS_SCORE_REVIEW.equals(status);
            case STAGE_ACTION_REOPEN -> STAGE_STATUS_FINALIZED.equals(status) && canReopenScores(stages, stageIndex);
            case STAGE_ACTION_SUSPEND -> !STAGE_STATUS_START_REVIEW.equals(status) && !STAGE_STATUS_SUSPENDED.equals(status) && !STAGE_STATUS_FINALIZED.equals(status);
            case STAGE_ACTION_RESUME -> STAGE_STATUS_SUSPENDED.equals(status);
            default -> false;
        };
    }

    private boolean canReopenScores(List<SubEventFormItemDto> stages, int stageIndex) {
        if (stages == null || stageIndex < 0 || stageIndex >= stages.size()) {
            return false;
        }
        if (stageIndex + 1 >= stages.size()) {
            return true;
        }
        SubEventFormItemDto nextStage = stages.get(stageIndex + 1);
        if (!STAGE_STATUS_ACTIVE.equals(normalizeStageStatus(nextStage == null ? null : nextStage.stageStatus()))) {
            return false;
        }
        long nextStartAtMs = toSortableDate(nextStage == null ? null : nextStage.startAt());
        return nextStartAtMs <= 0L || nextStartAtMs > System.currentTimeMillis();
    }

    private int resolveStageIndex(List<SubEventFormItemDto> stages, String subEventId, Integer fallbackIndex) {
        if (stages == null || stages.isEmpty()) {
            return -1;
        }
        String normalizedSubEventId = normalizeId(subEventId);
        if (StringUtils.hasText(normalizedSubEventId)) {
            for (int index = 0; index < stages.size(); index += 1) {
                SubEventFormItemDto candidate = stages.get(index);
                if (candidate != null && normalizedSubEventId.equals(normalizeId(candidate.id()))) {
                    return index;
                }
            }
        }
        int index = fallbackIndex == null ? -1 : fallbackIndex;
        return index >= 0 && index < stages.size() ? index : -1;
    }

    private String normalizeStageStatus(String status) {
        String normalized = safeText(status).toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case STAGE_STATUS_START_REVIEW -> STAGE_STATUS_START_REVIEW;
            case STAGE_STATUS_SCORE_REVIEW -> STAGE_STATUS_SCORE_REVIEW;
            case STAGE_STATUS_FINALIZED -> STAGE_STATUS_FINALIZED;
            case STAGE_STATUS_SUSPENDED -> STAGE_STATUS_SUSPENDED;
            default -> STAGE_STATUS_ACTIVE;
        };
    }

    private SubEventFormItemDto copySubEventWithStageStatus(
            SubEventFormItemDto subEvent,
            String stageStatus,
            String stageStatusReason,
            String stageStatusUpdatedAt,
            String stageFinalizedAt,
            String stageFinalizedByUserId) {
        return new SubEventFormItemDto(
                subEvent.id(),
                subEvent.name(),
                subEvent.description(),
                subEvent.startAt(),
                subEvent.endAt(),
                subEvent.location(),
                subEvent.createdByUserId(),
                subEvent.groups(),
                subEvent.tournamentGroupCount(),
                subEvent.tournamentGroupCapacityMin(),
                subEvent.tournamentGroupCapacityMax(),
                subEvent.tournamentLeaderboardType(),
                subEvent.tournamentAdvancePerGroup(),
                subEvent.optional(),
                subEvent.pricing(),
                subEvent.capacityMin(),
                subEvent.capacityMax(),
                subEvent.membersAccepted(),
                subEvent.membersPending(),
                subEvent.carsPending(),
                subEvent.accommodationPending(),
                subEvent.suppliesPending(),
                subEvent.carsAccepted(),
                subEvent.accommodationAccepted(),
                subEvent.suppliesAccepted(),
                subEvent.carsCapacityMin(),
                subEvent.carsCapacityMax(),
                subEvent.accommodationCapacityMin(),
                subEvent.accommodationCapacityMax(),
                subEvent.suppliesCapacityMin(),
                subEvent.suppliesCapacityMax(),
                subEvent.slotStartOffsetMinutes(),
                subEvent.slotDurationMinutes(),
                stageStatus,
                stageStatusReason,
                stageStatusUpdatedAt,
                stageFinalizedAt,
                stageFinalizedByUserId);
    }

    private void runInitialAutoInviteBatch(List<ActivityEvent> updated) {
        if (updated == null || updated.isEmpty() || eventSchedulerProvider == null) {
            return;
        }
        LinkedHashSet<String> sourceIds = new LinkedHashSet<>();
        for (ActivityEvent event : updated) {
            if (event == null || !Boolean.TRUE.equals(event.getAutoInviter()) || !Boolean.TRUE.equals(event.getPublished())) {
                continue;
            }
            String sourceId = normalizeId(event.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
        if (sourceIds.isEmpty()) {
            return;
        }
        EventScheduler scheduler = eventSchedulerProvider.getIfAvailable();
        if (scheduler != null) {
            scheduler.generatePriorityPlansForEvents(sourceIds);
        }
    }

    private void enqueueStageStatusNotifications(
            ActivityEvent event,
            SubEventFormItemDto stage,
            String action,
            String nextStatus,
            String actorUserId,
            boolean finalStage,
            TournamentResultSummary resultSummary) {
        if (notificationOutboxService == null || event == null || stage == null) {
            return;
        }
        String eventId = normalizeId(event.getSourceId());
        if (!StringUtils.hasText(eventId)) {
            return;
        }
        String stageTitle = stageTitle(stage);
        List<String> adminUserIds = resolveAdminUserIds(eventId, event.getCreatorUserId());
        List<String> audienceUserIds = eventAudienceUserIds(event);
        if (STAGE_ACTION_START.equals(action)) {
            enqueueEventNotification(
                    "event-tournament-started",
                    event,
                    "event-participants",
                    audienceUserIds,
                    "Tournament started",
                    stageTitle + " has started. Groups are ready.",
                    action,
                    stageTitle,
                    actorUserId);
            return;
        }
        if (STAGE_STATUS_SCORE_REVIEW.equals(nextStatus)) {
            enqueueEventNotification(
                    "event-stage-review",
                    event,
                    "event-admins",
                    adminUserIds,
                    "Tournament scores need review",
                    stageTitle + " is closed. Please fill scores and finalize the stage.",
                    action,
                    stageTitle,
                    actorUserId);
            enqueueEventNotification(
                    "event-stage-closed",
                    event,
                    "event-participants",
                    audienceUserIds,
                    "Tournament stage closed",
                    stageTitle + " is closed while scores are reviewed.",
                    action,
                    stageTitle,
                    actorUserId);
            return;
        }
        if (STAGE_STATUS_FINALIZED.equals(nextStatus)) {
            enqueueEventNotification(
                    finalStage ? "event-tournament-finalized" : "event-stage-finalized",
                    event,
                    "event-participants",
                    audienceUserIds,
                    finalStage ? "Tournament finalized" : "Tournament stage finalized",
                    finalStage
                            ? tournamentFinalizedBody(resultSummary)
                            : stageTitle + " has been finalized.",
                    action,
                    stageTitle,
                    actorUserId);
            return;
        }
        if (STAGE_STATUS_SUSPENDED.equals(nextStatus)) {
            enqueueEventNotification(
                    "event-tournament-suspended",
                    event,
                    "event-participants",
                    audienceUserIds,
                    "Tournament suspended",
                    stageTitle + " is paused while the organizers review it.",
                    action,
                    stageTitle,
                    actorUserId);
        }
    }

    private TournamentResultSummary resolveTournamentResultSummary(
            ActivityEvent event,
            SubEventFormItemDto stage,
            boolean finalStage) {
        if (!finalStage || event == null || stage == null || activitiesEventLeaderboardService == null) {
            return TournamentResultSummary.empty();
        }
        String eventId = normalizeId(event.getSourceId());
        String stageId = normalizeId(stage.id());
        if (!StringUtils.hasText(eventId) || !StringUtils.hasText(stageId)) {
            return TournamentResultSummary.empty();
        }
        try {
            EventLeaderboardStateDto state = activitiesEventLeaderboardService.queryState(eventId, stageId);
            return new TournamentResultSummary(resolveWinnerNames(state));
        } catch (RuntimeException exception) {
            LOGGER.debug("Unable to resolve final tournament result summary for event {} stage {}.", eventId, stageId, exception);
            return TournamentResultSummary.empty();
        }
    }

    private List<String> resolveWinnerNames(EventLeaderboardStateDto state) {
        if (state == null || state.groups() == null || state.groups().isEmpty()) {
            return List.of();
        }
        LinkedHashMap<String, String> namesByMemberId = new LinkedHashMap<>();
        LinkedHashSet<String> winnerIds = new LinkedHashSet<>();
        for (EventLeaderboardGroupDto group : state.groups()) {
            if (group == null) {
                continue;
            }
            collectMemberNames(namesByMemberId, group);
            if (group.advancingMemberIds() != null && !group.advancingMemberIds().isEmpty()) {
                group.advancingMemberIds().stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .forEach(winnerIds::add);
                continue;
            }
            int winnerCount = Math.max(1, group.advancePerGroup() == null ? 0 : group.advancePerGroup());
            if (group.fifaRows() != null && !group.fifaRows().isEmpty()) {
                group.fifaRows().stream()
                        .filter(Objects::nonNull)
                        .limit(winnerCount)
                        .map(EventLeaderboardFifaStandingRowDto::memberId)
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .forEach(winnerIds::add);
            } else if (group.scoreRows() != null && !group.scoreRows().isEmpty()) {
                group.scoreRows().stream()
                        .filter(Objects::nonNull)
                        .limit(winnerCount)
                        .map(EventLeaderboardScoreStandingRowDto::memberId)
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .forEach(winnerIds::add);
            }
        }
        return winnerIds.stream()
                .map(memberId -> firstNonBlank(namesByMemberId.get(memberId), memberId))
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private void collectMemberNames(Map<String, String> namesByMemberId, EventLeaderboardGroupDto group) {
        if (group == null) {
            return;
        }
        if (group.members() != null) {
            for (EventLeaderboardMemberDto member : group.members()) {
                if (member == null) {
                    continue;
                }
                String memberId = normalizeId(member.memberId());
                if (StringUtils.hasText(memberId)) {
                    namesByMemberId.putIfAbsent(memberId, safeText(member.memberName()));
                }
            }
        }
        if (group.scoreRows() != null) {
            for (EventLeaderboardScoreStandingRowDto row : group.scoreRows()) {
                if (row == null) {
                    continue;
                }
                String memberId = normalizeId(row.memberId());
                if (StringUtils.hasText(memberId)) {
                    namesByMemberId.putIfAbsent(memberId, safeText(row.memberName()));
                }
            }
        }
        if (group.fifaRows() != null) {
            for (EventLeaderboardFifaStandingRowDto row : group.fifaRows()) {
                if (row == null) {
                    continue;
                }
                String memberId = normalizeId(row.memberId());
                if (StringUtils.hasText(memberId)) {
                    namesByMemberId.putIfAbsent(memberId, safeText(row.memberName()));
                }
            }
        }
    }

    private String tournamentFinalizedBody(TournamentResultSummary summary) {
        String winnerSummary = summary == null ? "" : summary.shortWinnerSummary();
        if (!StringUtils.hasText(winnerSummary)) {
            return "The final stage is complete. Open the event results to review the standings.";
        }
        return "The final stage is complete. Results are ready. " + winnerSummary + ".";
    }

    private String tournamentFinalizedChatText(TournamentResultSummary summary) {
        String winnerSummary = summary == null ? "" : summary.shortWinnerSummary();
        if (!StringUtils.hasText(winnerSummary)) {
            return "The tournament has been finalized. Results are ready.";
        }
        return "The tournament has been finalized. " + winnerSummary + ".";
    }

    private void enqueueEventNotification(
            String type,
            ActivityEvent event,
            String recipientScope,
            List<String> recipientUserIds,
            String title,
            String body,
            String action,
            String stageTitle,
            String actorUserId) {
        List<String> recipients = normalizeIds(recipientUserIds);
        if (recipients.isEmpty()) {
            return;
        }
        String eventId = normalizeId(event.getSourceId());
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", safeText(event.getTitle()));
        payload.put("stageTitle", safeText(stageTitle));
        payload.put("stageAction", safeText(action));
        notificationOutboxService.enqueue(new NotificationIntent(
                type,
                "event",
                eventId,
                recipientScope,
                recipients,
                title,
                body,
                "/game",
                firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                type + "-" + eventId,
                payload,
                actorUserId));
    }

    private List<String> eventAudienceUserIds(ActivityEvent event) {
        if (event == null) {
            return List.of();
        }
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        String eventId = normalizeId(event.getSourceId());
        if (StringUtils.hasText(eventId)) {
            userIds.addAll(resolveAdminUserIds(eventId, event.getCreatorUserId()));
        }
        userIds.addAll(resolveAcceptedMemberUserIds(event));
        return new ArrayList<>(userIds);
    }

    private void enqueueTournamentStartReviewNotifications(List<ActivityEvent> events, String actorUserId) {
        if (notificationOutboxService == null || events == null || events.isEmpty()) {
            return;
        }
        for (ActivityEvent event : computePreferredEventRecords(events)) {
            if (event == null || !Boolean.TRUE.equals(event.getPublished())) {
                continue;
            }
            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            SubEventFormItemDto firstStage = firstTournamentStage(event.getSubEvents());
            if (firstStage == null || !STAGE_STATUS_START_REVIEW.equals(normalizeStageStatus(firstStage.stageStatus()))) {
                continue;
            }
            String stageTitle = stageTitle(firstStage);
            enqueueEventNotification(
                    "event-tournament-start-review",
                    event,
                    "event-admins",
                    resolveAdminUserIds(eventId, event.getCreatorUserId()),
                    "Tournament needs start review",
                    "Finalize members and start " + stageTitle + " when ready.",
                    "start-review",
                    stageTitle,
                    actorUserId);
        }
    }

    private void postStageChatMessage(
            ActivityEvent event,
            SubEventFormItemDto stage,
            String action,
            String nextStatus,
            boolean finalStage,
            TournamentResultSummary resultSummary) {
        if (activitiesChatService == null || event == null || stage == null) {
            return;
        }
        String eventId = normalizeId(event.getSourceId());
        if (!StringUtils.hasText(eventId)) {
            return;
        }
        String stageTitle = stageTitle(stage);
        String text;
        if (STAGE_ACTION_START.equals(action)) {
            text = "The tournament has started at " + stageTitle + ".";
        } else if (STAGE_ACTION_REOPEN.equals(action)) {
            text = "Scores for " + stageTitle + " were reopened.";
        } else if (STAGE_ACTION_RESUME.equals(action)) {
            text = "Tournament review resumed at " + stageTitle + ".";
        } else if (STAGE_STATUS_SCORE_REVIEW.equals(nextStatus)) {
            text = stageTitle + " was closed for score review.";
        } else if (STAGE_STATUS_FINALIZED.equals(nextStatus)) {
            text = finalStage ? tournamentFinalizedChatText(resultSummary) : stageTitle + " was finalized.";
        } else if (STAGE_STATUS_SUSPENDED.equals(nextStatus)) {
            text = "The tournament was suspended at " + stageTitle + ".";
        } else {
            text = stageTitle + " was updated.";
        }
        activitiesChatService.postSystemMessage(eventId, text, action);
    }

    private void postMemberJoinedMessage(String eventId, Users user) {
        if (activitiesChatService == null || user == null) {
            return;
        }
        String normalizedEventId = normalizeId(eventId);
        if (StringUtils.hasText(normalizedEventId)) {
            activitiesChatService.postSystemMessage(
                    normalizedEventId,
                    firstNonBlank(user.getName(), user.getId(), "A member") + " joined the event.",
                    "member-joined");
        }
    }

    private void maybePostMemberLeftMessage(EventActionRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || activitiesChatService == null || !TYPE_EVENTS.equals(normalizeType(request == null ? null : request.type())) || !StringUtils.hasText(sourceId)) {
            return;
        }
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        if (preferred == null || isViewerAdmin(preferred, viewer.userId())) {
            return;
        }
        activitiesChatService.postSystemMessage(
                sourceId,
                firstNonBlank(viewer.user().getName(), viewer.userId(), "A member") + " left the event.",
                "member-left");
    }

    private String stageTitle(SubEventFormItemDto stage) {
        return firstNonBlank(stage == null ? null : stage.name(), stage == null ? null : stage.id(), "Stage");
    }

    private boolean isConfirmedBooking(EventActionRequestDto request, ActivityEvent preferred) {
        if (isWaitlistRequested(request) || isApprovalRequested(request)) {
            return false;
        }
        if (!Boolean.TRUE.equals(preferred == null ? null : preferred.getTicketing())) {
            return false;
        }
        return Boolean.TRUE.equals(request == null ? null : request.bookingConfirmed());
    }

    private boolean isWaitlistRequested(EventActionRequestDto request) {
        return "waitlist".equals(safeText(request == null ? null : request.pendingReason()));
    }

    private boolean isApprovalRequested(EventActionRequestDto request) {
        return "approval".equals(safeText(request == null ? null : request.pendingReason()));
    }

    private boolean isRecordFull(ActivityEvent record) {
        if (record == null) {
            return false;
        }
        int capacityTotal = normalizeCount(record.getCapacityTotal());
        if (capacityTotal <= 0) {
            return false;
        }
        return resolveAcceptedMemberUserIds(record).size() >= capacityTotal;
    }

    private void recordJoinPayment(
            EventActionRequestDto request,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            ActivityEvent preferred) {
        String paymentSessionId = request == null ? null : normalizeId(request.paymentSessionId());
        if (!StringUtils.hasText(paymentSessionId)) {
            return;
        }
        paymentService.recordEventJoin(
                paymentSessionId,
                userId,
                sourceId,
                slotSourceId,
                bookingStartAtIso,
                preferred == null || preferred.getPricing() == null ? null : preferred.getPricing().cancellationPolicy());
    }

    private void maybeApplyLeaveCancellationRefund(EventActionRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String requestType = request == null ? null : normalizeType(request.type());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !TYPE_EVENTS.equals(requestType) || !StringUtils.hasText(sourceId)) {
            return;
        }

        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        if (preferred == null) {
            return;
        }
        if (viewer.userId().equals(normalizeId(preferred.getCreatorUserId()))) {
            return;
        }

        String fallbackStartAtIso = resolveRequestedBookingStartAtIso(preferred, request == null ? null : request.slotSourceId());
        paymentService.cancelEventBooking(
                viewer.userId(),
                sourceId,
                fallbackStartAtIso,
                preferred.getPricing() == null ? null : preferred.getPricing().cancellationPolicy());
    }

    private String resolveRequestedBookingStartAtIso(ActivityEvent preferred, String slotSourceId) {
        String normalizedSlotSourceId = normalizeId(slotSourceId);
        if (StringUtils.hasText(normalizedSlotSourceId)) {
            ActivityEvent slotRecord = loadEventDocumentsBySourceIds(List.of(normalizedSlotSourceId)).stream()
                    .filter(this::isGeneratedSlotRecord)
                    .findFirst()
                    .orElse(null);
            if (slotRecord != null && StringUtils.hasText(slotRecord.getStartAtIso())) {
                return slotRecord.getStartAtIso();
            }
        }
        return preferred == null ? null : preferred.getStartAtIso();
    }

    public EventRecordDto sync(ActivitiesEventSyncPayloadDto request) {
        if (request == null) {
            return null;
        }
        String sourceId = normalizeId(request.id());
        if (!StringUtils.hasText(sourceId)) {
            return null;
        }

        ViewerContext actor = resolveViewer(request.creatorUserId());
        String actorUserId = actor == null ? normalizeId(request.creatorUserId()) : actor.userId();
        if (!StringUtils.hasText(actorUserId)) {
            return null;
        }

        ActivitiesMembersService.OwnerMembersSnapshot syncedMembersSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);

        String targetType = normalizeTargetType(request.target());
        if (!StringUtils.hasText(targetType)) {
            return null;
        }

        Users creator = actor != null ? actor.user() : usersRepository.findByUserId(actorUserId).orElse(null);
        ActivityEvent baseRecord = buildSyncedRecord(request, creator, actorUserId, sourceId, targetType, syncedMembersSnapshot);
        List<ActivityEvent> documentsToSave = new ArrayList<>();
        documentsToSave.add(baseRecord);
        if (TYPE_HOSTING.equals(targetType) && !Boolean.FALSE.equals(baseRecord.getPublished())) {
            ActivityEvent eventsOverlay = cloneDocument(baseRecord);
            eventsOverlay.setType(TYPE_EVENTS);
            eventsOverlay.setStatus(Boolean.FALSE.equals(baseRecord.getPublished()) || STATUS_DRAFT.equals(safeText(baseRecord.getStatus()))
                    ? STATUS_DRAFT
                    : STATUS_ACTIVE);
            eventsOverlay.setIsHosting(false);
            eventsOverlay.setIsInvitation(false);
            eventsOverlay.setPublished(!STATUS_DRAFT.equals(safeText(eventsOverlay.getStatus())));
            eventsOverlay.setId(resolveExistingId(baseRecord.getOwnerUserId(), TYPE_EVENTS, sourceId, null));
            eventsOverlay.setSyncKey(resolveExistingSyncKey(baseRecord.getOwnerUserId(), TYPE_EVENTS, sourceId, null));
            eventsOverlay.setAdmins(resolveAdminUserIds(sourceId, baseRecord.getCreatorUserId()));
            eventsOverlay.normalizeLifecycleState();
            documentsToSave.add(eventsOverlay);
        }
        activityEventsRepository.saveAll(documentsToSave);
        affinityRecomputeTaskService.enqueueEventChanged(sourceId, actorUserId);
        Map<String, String> telemetryTags = new LinkedHashMap<>();
        String city = safeText(request.creatorCity());
        if (!StringUtils.hasText(city)) {
            city = safeText(request.location());
        }
        if (StringUtils.hasText(city)) {
            telemetryTags.put("city", city);
        }
        if (request.topics() != null) {
            request.topics().stream()
                    .map(this::safeText)
                    .filter(StringUtils::hasText)
                    .findFirst()
                    .ifPresent(topic -> telemetryTags.put("topic", topic));
        }
        telemetryTags.put("eventType", resolveTelemetryEventType(request));
        adminTelemetryService.record("event.synced", "events", sourceId, actorUserId, 1L, telemetryTags);
        syncStageReminderTasksForSavedEvents(documentsToSave, actorUserId);
        materializeSlotOccurrences();
        eventParticipationTicketService.syncParticipationTicketsForEvent(sourceId);
        String paymentSessionId = normalizeId(request.paymentSessionId());
        if (StringUtils.hasText(paymentSessionId) && TYPE_EVENTS.equals(targetType)) {
            String bookingStartAtIso = request.nextSlot() != null && StringUtils.hasText(request.nextSlot().startAtIso())
                    ? request.nextSlot().startAtIso()
                    : request.startAt();
            paymentService.recordEventJoin(
                    paymentSessionId,
                    null,
                    sourceId,
                    request.nextSlot() == null ? null : normalizeId(request.nextSlot().id()),
                    bookingStartAtIso,
                    request.pricing() == null ? null : request.pricing().cancellationPolicy());
        }
        return toEventRecordDto(baseRecord, actor);
    }

    private ViewerContext resolveViewer(String requestedUserId) {
        Users user = homeUserProfileService.resolveCurrentUser(requestedUserId);
        String userId = user == null ? null : normalizeId(user.getId());
        if (!StringUtils.hasText(userId) || user == null) {
            return null;
        }
        int affinity = user.getAffinity() == null ? 0 : Math.max(0, (int) Math.round(user.getAffinity()));
        return new ViewerContext(userId, user, toLocationCoordinatesDto(user.getLocationCoordinates()), affinity);
    }

    private List<ActivityEvent> queryFilteredRecords(ViewerContext viewer, EventsFilterRequestDto request) {
        String filter = request == null ? "active-events" : normalizeEventScopeFilter(request.filter());
        String hostingPublicationFilter = request == null ? "all" : normalizeHostingPublicationFilter(request.hostingPublicationFilter());

        List<ActivityEvent> userItems = queryUserRecords(viewer);
        List<ActivityEvent> memberEventItems = userItems.stream()
                .filter(record -> TYPE_EVENTS.equals(resolveViewerScopedEventType(record, viewer.userId())))
                .filter(record -> !isViewerAdmin(record, viewer.userId()))
                .filter(record -> !isTrashScopeStatus(record))
                .filter(record -> hasAcceptedParticipation(record, viewer.userId()) || isPendingParticipation(record, viewer.userId()))
                .toList();
        List<ActivityEvent> pendingEventItems = memberEventItems.stream()
                .filter(record -> isPendingParticipation(record, viewer.userId()) || isPendingReviewStatus(record))
                .toList();
        List<ActivityEvent> activeEventItems = memberEventItems.stream()
                .filter(record -> hasAcceptedParticipation(record, viewer.userId()) && !isPendingReviewStatus(record))
                .toList();
        List<ActivityEvent> invitationItems = userItems.stream()
                .filter(record -> TYPE_INVITATIONS.equals(resolveViewerScopedEventType(record, viewer.userId())))
                .filter(record -> !isTrashScopeStatus(record))
                .toList();
        List<ActivityEvent> myEventItems = queryMyEventScopeRecords(viewer, userItems);
        List<ActivityEvent> draftItems = myEventItems.stream()
                .filter(record -> Boolean.FALSE.equals(record.getPublished()))
                .toList();
        List<ActivityEvent> reviewItems = myEventItems.stream()
                .filter(this::isPendingReviewStatus)
                .toList();

        return switch (filter) {
            case "all" -> concat(concat(activeEventItems, pendingEventItems), concat(invitationItems, myEventItems));
            case "pending" -> concat(pendingEventItems, reviewItems);
            case "invitations" -> invitationItems;
            case "my-events" -> "drafts".equals(hostingPublicationFilter) ? draftItems : myEventItems;
            case "drafts" -> draftItems;
            case "trash" -> userItems.stream().filter(this::isTrashScopeStatus).toList();
            default -> activeEventItems;
        };
    }

    private List<ActivityEvent> queryUserRecords(ViewerContext viewer) {
        List<ActivityEvent> allRecords = allEventDocuments(viewer);
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : computePreferredEventRecords(allRecords)) {
            preferredBySourceId.put(normalizeId(record.getSourceId()), record);
        }

        List<ActivityEvent> directRecords = allRecords.stream()
                .filter(record -> viewer.userId().equals(normalizeId(record.getOwnerUserId())))
                .filter(record -> shouldIncludeUserDirectRecord(record, viewer.userId(), preferredBySourceId.get(normalizeId(record.getSourceId()))))
                .map(this::cloneDocument)
                .toList();
        Set<String> directSourceIds = directRecords.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        List<ActivityEvent> membershipRecords = computePreferredEventRecords(allRecords).stream()
                .filter(record -> !viewer.userId().equals(normalizeId(record.getCreatorUserId())))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .filter(record -> !directSourceIds.contains(normalizeId(record.getSourceId())))
                .filter(record -> hasTrackedUserParticipation(record, viewer.userId()))
                .map(record -> buildMembershipProjection(viewer.userId(), record))
                .toList();

        return concat(directRecords, membershipRecords);
    }

    private EventsExplorePageDto pageDirectScopedRecords(
            ViewerContext viewer,
            String filter,
            String hostingPublicationFilter,
            EventsFilterRequestDto request) {
        String secondaryFilter = normalizeActivitiesSecondaryFilter(request == null ? null : request.secondaryFilter());
        String view = normalizeActivitiesView(request == null ? null : request.view());
        String sort = normalizeActivitiesSort(request == null ? null : request.sort(), view, secondaryFilter);
        Integer requestedLimit = request == null ? null : request.limit();
        int limit = normalizeLimit(requestedLimit, 10);

        List<EventProjection> sorted = queryDirectScopedRecords(viewer, filter, hostingPublicationFilter).stream()
                .map(record -> toProjection(record, viewer))
                .filter(Objects::nonNull)
                .filter(projection -> matchesActivitiesSecondaryFilter(projection, secondaryFilter))
                .filter(projection -> matchesActivitiesCalendarRange(projection, request, view))
                .sorted((left, right) -> compareActivitiesProjection(left, right, sort, view, secondaryFilter))
                .toList();

        if ("week".equals(view) || "month".equals(view)) {
            return new EventsExplorePageDto(sorted.stream().map(EventProjection::item).toList(), sorted.size(), null);
        }

        String cursor = request == null ? null : request.cursor();
        int startIndex = resolveCursorStartIndex(sorted, cursor);
        int endIndex = Math.min(sorted.size(), startIndex + limit);
        List<EventRecordDto> records = sorted.subList(startIndex, endIndex).stream()
                .map(EventProjection::item)
                .toList();
        String nextCursor = endIndex < sorted.size() && !records.isEmpty()
                ? serializeCursor(records.get(records.size() - 1))
                : null;
        return new EventsExplorePageDto(records, sorted.size(), nextCursor);
    }

    private boolean usesDirectOwnerScope(String filter) {
        return "invitations".equals(filter)
                || "my-events".equals(filter)
                || "drafts".equals(filter)
                || "trash".equals(filter);
    }

    private List<ActivityEvent> queryDirectScopedRecords(
            ViewerContext viewer,
            String filter,
            String hostingPublicationFilter) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return List.of();
        }

        List<ActivityEvent> directOwnerRecords = queryDirectOwnerRecords(viewer.userId());
        List<ActivityEvent> invitations = queryInvitationScopeRecords(directOwnerRecords);
        List<ActivityEvent> myEvents = queryMyEventScopeRecords(viewer, directOwnerRecords);
        List<ActivityEvent> drafts = myEvents.stream()
                .filter(record -> Boolean.FALSE.equals(record.getPublished()))
                .toList();
        List<ActivityEvent> reviewItems = myEvents.stream()
                .filter(this::isPendingReviewStatus)
                .toList();

        return switch (filter) {
            case "invitations" -> invitations;
            case "my-events" -> "drafts".equals(hostingPublicationFilter) ? drafts : myEvents;
            case "drafts" -> drafts;
            case "pending" -> reviewItems;
            case "trash" -> directOwnerRecords.stream()
                    .filter(this::isTrashScopeStatus)
                    .sorted(directRecordComparator())
                    .toList();
            default -> List.of();
        };
    }

    private List<ActivityEvent> queryDirectOwnerRecords(String ownerUserId) {
        return activityEventsRepository.findByOwnerUserId(ownerUserId).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .sorted(directRecordComparator())
                .toList();
    }

    private List<ActivityEvent> queryCanonicalExploreRecords() {
        return activityEventsRepository.findCanonicalExploreCandidates(TYPE_EVENTS).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .filter(this::isCanonicalExploreRecord)
                .toList();
    }

    private List<ActivityEvent> queryInvitationScopeRecords(List<ActivityEvent> directOwnerRecords) {
        LinkedHashMap<String, ActivityEvent> invitationRecordsBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : directOwnerRecords) {
            if (!Boolean.TRUE.equals(record.getIsInvitation()) || Boolean.TRUE.equals(record.getIsTrashed())) {
                continue;
            }
            invitationRecordsBySourceId.put(normalizeId(record.getSourceId()), record);
        }
        return new ArrayList<>(invitationRecordsBySourceId.values()).stream()
                .sorted(directRecordComparator())
                .toList();
    }

    private List<ActivityEvent> queryMyEventScopeRecords(ViewerContext viewer, List<ActivityEvent> directOwnerRecords) {
        LinkedHashMap<String, ActivityEvent> myEventRecordsBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : directOwnerRecords) {
            if (isTrashScopeStatus(record)) {
                continue;
            }
            if (TYPE_HOSTING.equals(normalizeType(record.getType()))) {
                myEventRecordsBySourceId.put(normalizeId(record.getSourceId()), record);
                continue;
            }
            if (TYPE_EVENTS.equals(normalizeType(record.getType())) && isViewerAdmin(record, viewer.userId())) {
                myEventRecordsBySourceId.putIfAbsent(normalizeId(record.getSourceId()), buildHostingProjection(viewer.userId(), record));
            }
        }
        return new ArrayList<>(myEventRecordsBySourceId.values()).stream()
                .sorted(directRecordComparator())
                .toList();
    }

    private ActivityEvent buildHostingProjection(String viewerUserId, ActivityEvent source) {
        ActivityEvent projection = cloneDocument(source);
        String sourceStatus = safeText(source.getStatus());
        if (!StringUtils.hasText(sourceStatus) || STATUS_ACTIVE.equals(sourceStatus) || STATUS_HOSTING.equals(sourceStatus)) {
            sourceStatus = Boolean.FALSE.equals(source.getPublished()) ? STATUS_DRAFT : STATUS_HOSTING;
        }
        projection.setOwnerUserId(viewerUserId);
        projection.setType(TYPE_HOSTING);
        projection.setStatus(sourceStatus);
        projection.setPublished(STATUS_DRAFT.equals(sourceStatus) ? Boolean.FALSE : source.getPublished());
        projection.setIsHosting(true);
        projection.setIsInvitation(false);
        projection.setIsAdmin(true);
        projection.setAdmins(resolveAdminUserIds(source.getSourceId(), source.getCreatorUserId()));
        projection.normalizeLifecycleState();
        return projection;
    }

    private Comparator<ActivityEvent> directRecordComparator() {
        return Comparator.comparing((ActivityEvent record) -> toSortableDate(record == null ? null : record.getStartAtIso()))
                .thenComparing(record -> normalizeId(record == null ? null : record.getSourceId()), Comparator.nullsLast(String::compareTo));
    }

    private List<ActivityEvent> computePreferredEventRecords(List<ActivityEvent> records) {
        Map<String, ActivityEvent> preferred = new LinkedHashMap<>();
        for (ActivityEvent record : records) {
            if (record == null || Boolean.TRUE.equals(record.getIsInvitation())) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent current = preferred.get(sourceId);
            if (current == null || shouldPreferRecord(record, current)) {
                preferred.put(sourceId, record);
            }
        }
        return new ArrayList<>(preferred.values());
    }

    private boolean shouldPreferRecord(ActivityEvent next, ActivityEvent current) {
        if (Boolean.TRUE.equals(next.getIsHosting()) && !Boolean.TRUE.equals(current.getIsHosting())) {
            return true;
        }
        if (!Boolean.TRUE.equals(next.getIsHosting()) && Boolean.TRUE.equals(current.getIsHosting())) {
            return false;
        }
        if (Boolean.TRUE.equals(next.getIsHosting()) != Boolean.TRUE.equals(current.getIsHosting())) {
            return Boolean.TRUE.equals(next.getIsHosting());
        }
        return normalizeCount(next.getAcceptedMembers()) >= normalizeCount(current.getAcceptedMembers());
    }

    private boolean shouldIncludeUserDirectRecord(ActivityEvent record, String userId, ActivityEvent preferredRecord) {
        if (record == null) {
            return false;
        }
        if (!TYPE_EVENTS.equals(normalizeType(record.getType())) || Boolean.TRUE.equals(record.getIsInvitation())) {
            return true;
        }
        if (userId.equals(normalizeId(record.getCreatorUserId())) || isViewerAdmin(record, userId)) {
            return true;
        }
        return hasTrackedUserParticipation(preferredRecord == null ? record : preferredRecord, userId);
    }

    private boolean isPendingReviewStatus(ActivityEvent record) {
        String status = safeText(record == null ? null : record.getStatus());
        return STATUS_UNDER_REVIEW.equals(status) || STATUS_BLOCKED.equals(status);
    }

    private boolean isTrashScopeStatus(ActivityEvent record) {
        if (Boolean.TRUE.equals(record == null ? null : record.getIsTrashed())) {
            return true;
        }
        String status = safeText(record == null ? null : record.getStatus());
        return STATUS_TRASHED.equals(status)
                || STATUS_DELETED.equals(status)
                || STATUS_INACTIVE.equals(status);
    }

    private ActivityEvent buildMembershipProjection(String ownerUserId, ActivityEvent record) {
        ActivityEvent projection = cloneDocument(record);
        projection.setOwnerUserId(ownerUserId);
        projection.setType(TYPE_EVENTS);
        if (STATUS_HOSTING.equals(safeText(projection.getStatus()))) {
            projection.setStatus(STATUS_ACTIVE);
        }
        projection.setIsAdmin(false);
        projection.setIsInvitation(false);
        projection.setIsHosting(false);
        projection.setAdmins(resolveAdminUserIds(projection.getSourceId(), projection.getCreatorUserId()));
        projection.normalizeLifecycleState();
        return projection;
    }

    private List<ActivityEvent> computeExploreRecords(ViewerContext viewer) {
        Map<String, ActivityEvent> preferredByEventId = new LinkedHashMap<>();
        for (ActivityEvent record : allEventDocuments(viewer)) {
            if (!shouldIncludeExploreRecord(record, viewer.userId())) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            ActivityEvent current = preferredByEventId.get(sourceId);
            if (current == null || shouldPreferExploreRecord(record, current)) {
                preferredByEventId.put(sourceId, record);
            }
        }
        return preferredByEventId.values().stream()
                .map(this::cloneDocument)
                .toList();
    }

    private boolean shouldIncludeExploreRecord(ActivityEvent record, String activeUserId) {
        if (record == null || !isCanonicalExploreRecord(record)) {
            return false;
        }
        if (Boolean.FALSE.equals(record.getPublished())) {
            return false;
        }
        if (activeUserId.equals(normalizeId(record.getCreatorUserId()))) {
            return false;
        }
        if (hasTrackedUserParticipation(record, activeUserId)) {
            return false;
        }
        String visibility = safeText(record.getVisibility());
        if ("Invitation only".equals(visibility)) {
            return false;
        }
        return !"Friends only".equals(visibility) || isFriendOfActiveUser(normalizeId(record.getCreatorUserId()), activeUserId);
    }

    private boolean isCanonicalExploreRecord(ActivityEvent record) {
        if (record == null) {
            return false;
        }
        if (!TYPE_EVENTS.equals(normalizeType(record.getType()))) {
            return false;
        }
        if (isGeneratedSlotRecord(record)) {
            return false;
        }
        if (Boolean.TRUE.equals(record.getIsTrashed()) || Boolean.TRUE.equals(record.getIsInvitation())) {
            return false;
        }
        if (!STATUS_ACTIVE.equals(safeText(record.getStatus()))) {
            return false;
        }
        return StringUtils.hasText(normalizeId(record.getSourceId()));
    }

    private boolean shouldPreferExploreRecord(ActivityEvent next, ActivityEvent current) {
        if (Boolean.TRUE.equals(next.getIsHosting()) && !Boolean.TRUE.equals(current.getIsHosting())) {
            return true;
        }
        if (!Boolean.TRUE.equals(next.getIsHosting()) && Boolean.TRUE.equals(current.getIsHosting())) {
            return false;
        }
        if (!Objects.equals(next.getPublished(), current.getPublished())) {
            return Boolean.TRUE.equals(next.getPublished());
        }
        return normalizeCount(next.getActivity()) >= normalizeCount(current.getActivity());
    }

    private EventProjection toProjection(ActivityEvent record, ViewerContext viewer) {
        EventRecordDto item = toEventRecordDto(record, viewer);
        if (item == null) {
            return null;
        }
        long startAtMs = toSortableDate(item.startAtIso());
        long endAtMs = resolveProjectionEndAtMs(item, startAtMs);
        Integer distanceMetersExact = resolveDistanceMetersExact(viewer.locationCoordinates(), record);
        int affinityGap = Math.abs(Math.max(0, normalizeCount(record.getAffinity())) - viewer.affinity());
        return new EventProjection(
                record,
                item,
                distanceMetersExact == null ? Integer.MAX_VALUE : distanceMetersExact,
                Math.max(0d, safeDouble(item.boost())),
                startAtMs,
                endAtMs,
                dateOnly(startAtMs),
                boostAffinityRank(record, viewer, affinityGap),
                affinityGap,
                -Math.max(0, (int) Math.round(safeDouble(item.rating()) * 100d)),
                endAtMs < System.currentTimeMillis());
    }

    private long boostAffinityRank(ActivityEvent record, ViewerContext viewer, int affinityGap) {
        double score = boostAffinityScore(record, viewer, affinityGap);
        return -Math.round(score * 1_000_000d);
    }

    private double boostAffinityScore(ActivityEvent record, ViewerContext viewer, int affinityGap) {
        double boost = safeDouble(record == null ? null : record.getBoost());
        return boost + ownerConnectionBoost(record, viewer) - (Math.max(0, affinityGap) / AFFINITY_DISTANCE_BOOST_SCALE);
    }

    private double ownerConnectionBoost(ActivityEvent record, ViewerContext viewer) {
        String viewerUserId = normalizeId(viewer == null ? null : viewer.userId());
        String ownerUserId = resolveEventOwnerUserId(record);
        if (!StringUtils.hasText(viewerUserId) || !StringUtils.hasText(ownerUserId)) {
            return 0d;
        }
        if (viewerUserId.equals(ownerUserId)) {
            return 100d;
        }
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        double knownEdgeWeight = edgeWeight(
                viewerUserId,
                ownerUserId,
                ctx == null ? Map.of() : ctx.edgeWeightsByPairKey());
        if (knownEdgeWeight > 0d) {
            return knownEdgeWeight * 100d;
        }
        return 0d;
    }

    private boolean matchesActivitiesSecondaryFilter(EventProjection projection, String secondaryFilter) {
        if (projection == null) {
            return false;
        }
        return switch (secondaryFilter) {
            case "past" -> projection.past();
            case "recent", "relevant" -> !projection.past();
            default -> true;
        };
    }

    private boolean matchesActivitiesCalendarRange(
            EventProjection projection,
            EventsFilterRequestDto request,
            String view) {
        if (projection == null || (!"week".equals(view) && !"month".equals(view))) {
            return true;
        }
        long rangeStartMs = toCalendarRangeBoundary(request == null ? null : request.rangeStart(), false);
        long rangeEndMs = toCalendarRangeBoundary(request == null ? null : request.rangeEnd(), true);
        if (rangeStartMs <= 0L || rangeEndMs <= 0L || rangeStartMs > rangeEndMs) {
            return true;
        }
        return projection.startAtMs() <= rangeEndMs && projection.endAtMs() >= rangeStartMs;
    }

    private long toCalendarRangeBoundary(String value, boolean endOfDay) {
        long parsed = toSortableDate(value);
        if (parsed <= 0L || !StringUtils.hasText(value) || !value.trim().matches("\\d{4}-\\d{2}-\\d{2}")) {
            return parsed;
        }
        return endOfDay ? parsed + ChronoUnit.DAYS.getDuration().toMillis() - 1L : parsed;
    }

    private long resolveProjectionEndAtMs(EventRecordDto item, long fallbackStartAtMs) {
        if (item == null) {
            return fallbackStartAtMs;
        }
        long endAtMs = toSortableDate(item.endAtIso());
        if (endAtMs > 0L) {
            return endAtMs;
        }
        return fallbackStartAtMs;
    }

    private EventRecordDto toEventRecordDto(ActivityEvent record, ViewerContext viewer) {
        if (record == null) {
            return null;
        }
        Integer distanceMetersExact = resolveDistanceMetersExact(viewer == null ? null : viewer.locationCoordinates(), record);
        ActivitiesMembersService.OwnerMembersSnapshot membersSnapshot = resolveMembersSnapshot(record);
        int capacityTotal = membersSnapshot == null || membersSnapshot.capacityTotal() == null
                ? normalizeCount(record.getCapacityTotal())
                : Math.max(0, membersSnapshot.capacityTotal());
        int acceptedMembers = membersSnapshot == null
                ? Math.max(normalizeCount(record.getAcceptedMembers()), fallbackAcceptedMemberUserIds(record).size())
                : membersSnapshot.acceptedMembers();
        int pendingMembers = membersSnapshot == null
                ? normalizeCount(record.getPendingMembers())
                : membersSnapshot.pendingMembers();
        List<EventSlotOccurrenceDto> upcomingSlots = resolveUpcomingSlotOccurrences(record);
        return new EventRecordDto(
                normalizeId(record.getSourceId()),
                normalizeId(record.getOwnerUserId()),
                resolveViewerScopedEventType(record, viewer == null ? null : viewer.userId()),
                safeText(record.getStatus()),
                safeText(record.getAvatar()),
                safeText(record.getTitle()),
                safeText(record.getSubtitle()),
                safeText(record.getTimeframe()),
                StringUtils.hasText(record.getInviter()) ? record.getInviter().trim() : null,
                normalizeCount(record.getUnread()),
                normalizeCount(record.getActivity()),
                isViewerAdmin(record, viewer == null ? null : viewer.userId()),
                Boolean.TRUE.equals(record.getIsInvitation()),
                Boolean.TRUE.equals(record.getIsHosting()),
                Boolean.TRUE.equals(record.getIsTrashed()),
                Boolean.FALSE.equals(record.getPublished()) ? Boolean.FALSE : Boolean.TRUE,
                StringUtils.hasText(record.getTrashedAtIso()) ? record.getTrashedAtIso().trim() : null,
                normalizeId(record.getCreatorUserId()),
                safeText(record.getCreatorName()),
                safeText(record.getCreatorInitials()),
                safeText(record.getCreatorGender()),
                safeText(record.getCreatorCity()),
                safeText(record.getVisibility()),
                safeText(record.getBlindMode()),
                StringUtils.hasText(record.getStartAtIso()) ? record.getStartAtIso().trim() : null,
                StringUtils.hasText(record.getEndAtIso()) ? record.getEndAtIso().trim() : null,
                distanceMetersExact == null
                        ? Math.max(0d, safeDouble(record.getDistanceKm()))
                        : distanceMetersExact.doubleValue() / 1000d,
                safeText(record.getImageUrl()),
                safeText(record.getSourceLink()),
                safeText(record.getLocation()),
                cloneLocation(record.getLocationCoordinates()),
                nullableCount(record.getCapacityMin()),
                nullableCount(record.getCapacityMax()),
                Math.max(acceptedMembers, capacityTotal),
                Boolean.TRUE.equals(record.getAutoInviter()),
                safeText(record.getFrequency()),
                Boolean.TRUE.equals(record.getTicketing()),
                clonePricing(record.getPricing()),
                Boolean.TRUE.equals(record.getSlotsEnabled()),
                cloneSlotTemplates(record.getSlotTemplates()),
                safeText(record.getParentEventId()),
                safeText(record.getSlotTemplateId()),
                Boolean.TRUE.equals(record.getGenerated()),
                isGeneratedSlotRecord(record) ? "slot" : "main",
                upcomingSlots.isEmpty() ? null : upcomingSlots.get(0),
                upcomingSlots,
                acceptedMembers,
                pendingMembers,
                normalizeStrings(record.getTopics()),
                cloneSubEvents(record.getSubEvents()),
                safeText(record.getSubEventsDisplayMode()),
                safeDouble(record.getRating()),
                safeDouble(record.getBoost()),
                safeDouble(record.getAffinity()));
    }

    private int compareActivitiesProjection(
            EventProjection left,
            EventProjection right,
            String sort,
            String view,
            String secondaryFilter) {
        if ("distance".equals(view) || "distance".equals(sort)) {
            if ("relevant".equals(secondaryFilter)) {
                int delta = Integer.compare(left.distanceMeters(), right.distanceMeters());
                if (delta != 0) {
                    return delta;
                }
                delta = Double.compare(right.boostValue(), left.boostValue());
                if (delta != 0) {
                    return delta;
                }
                delta = Long.compare(right.startAtMs(), left.startAtMs());
                if (delta != 0) {
                    return delta;
                }
                return left.item().id().compareTo(right.item().id());
            }
            int delta = Integer.compare(left.distanceMeters(), right.distanceMeters());
            if (delta != 0) {
                return delta;
            }
            delta = Long.compare(right.startAtMs(), left.startAtMs());
            if (delta != 0) {
                return delta;
            }
            return left.item().id().compareTo(right.item().id());
        }

        if ("relevant".equals(secondaryFilter)) {
            int delta = Long.compare(left.dayMs(), right.dayMs());
            if (delta != 0) {
                return delta;
            }
            delta = Double.compare(right.boostValue(), left.boostValue());
            if (delta != 0) {
                return delta;
            }
            delta = Long.compare(right.startAtMs(), left.startAtMs());
            if (delta != 0) {
                return delta;
            }
            return left.item().id().compareTo(right.item().id());
        }

        if ("past".equals(secondaryFilter)) {
            int delta = Long.compare(right.dayMs(), left.dayMs());
            if (delta != 0) {
                return delta;
            }
            delta = Long.compare(right.startAtMs(), left.startAtMs());
            if (delta != 0) {
                return delta;
            }
            return left.item().id().compareTo(right.item().id());
        }

        int delta = Long.compare(left.dayMs(), right.dayMs());
        if (delta != 0) {
            return delta;
        }
        delta = Long.compare(left.startAtMs(), right.startAtMs());
        if (delta != 0) {
            return delta;
        }
        return left.item().id().compareTo(right.item().id());
    }

    private int compareExploreProjection(EventProjection left, EventProjection right, String order, String view) {
        List<Long> leftTuple = buildExploreSortTuple(left, order, view);
        List<Long> rightTuple = buildExploreSortTuple(right, order, view);
        for (int index = 0; index < leftTuple.size(); index += 1) {
            int delta = Long.compare(leftTuple.get(index), rightTuple.get(index));
            if (delta != 0) {
                return delta;
            }
        }
        return left.item().id().compareTo(right.item().id());
    }

    private List<Long> buildExploreSortTuple(EventProjection projection, String order, String view) {
        long startAtMs = projection.startAtMs();
        long dayMs = projection.dayMs();
        long distanceMeters = projection.distanceMeters();
        long ratingValue = projection.ratingValue();
        long affinityGap = projection.affinityGap();
        long boostAffinityRank = projection.boostAffinityRank();
        long isPast = projection.past() ? 1L : 0L;
        long pastPriority = projection.past() ? 0L : 1L;

        if ("distance".equals(view)) {
            return switch (order) {
                case "past-events" -> List.of(distanceMeters, pastPriority, -startAtMs, affinityGap);
                case "nearby" -> List.of(distanceMeters, isPast, startAtMs, affinityGap);
                case "top-rated" -> List.of(distanceMeters, isPast, ratingValue, startAtMs);
                case "most-relevant" -> List.of(distanceMeters, isPast, boostAffinityRank, startAtMs);
                default -> List.of(distanceMeters, isPast, startAtMs, affinityGap);
            };
        }

        return switch (order) {
            case "past-events" -> List.of(pastPriority, -dayMs, -startAtMs, distanceMeters);
            case "nearby" -> List.of(isPast, dayMs, distanceMeters, startAtMs);
            case "top-rated" -> List.of(isPast, dayMs, ratingValue, startAtMs);
            case "most-relevant" -> List.of(isPast, dayMs, boostAffinityRank, startAtMs);
            default -> List.of(isPast, dayMs, startAtMs, distanceMeters);
        };
    }

    private List<ActivityEvent> updateItemState(EventActionRequestDto request, Consumer<ActivityEvent> updater) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return List.of();
        }

        String requestType = request == null ? null : request.type();
        List<ActivityEvent> documents = resolveActionDocuments(viewer.userId(), requestType, sourceId);
        if (documents.isEmpty()) {
            ActivityEvent overlay = buildUserStateOverlayRecord(viewer.userId(), requestType, sourceId);
            if (overlay == null) {
                return List.of();
            }
            documents = List.of(overlay);
        }

        List<ActivityEvent> updated = new ArrayList<>();
        for (ActivityEvent document : documents) {
            ActivityEvent next = cloneDocument(document);
            updater.accept(next);
            next.setUpdatedDate(Instant.now().toString());
            next.setUpdatedUser(viewer.userId());
            next.setAdmins(resolveAdminUserIds(next.getSourceId(), next.getCreatorUserId()));
            next.normalizeLifecycleState();
            updated.add(next);
        }
        List<ActivityEvent> saved = activityEventsRepository.saveAll(updated);
        affinityRecomputeTaskService.enqueueEventChanged(sourceId, viewer.userId());
        return saved;
    }

    private void syncStageReminderTasksForSavedEvents(List<ActivityEvent> documents, String actorUserId) {
        if (documents == null || documents.isEmpty()) {
            return;
        }
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent document : documents) {
            if (document == null) {
                continue;
            }
            String sourceId = normalizeId(document.getSourceId());
            if (!StringUtils.hasText(sourceId) || Boolean.TRUE.equals(document.getGenerated())) {
                continue;
            }
            ActivityEvent current = preferredBySourceId.get(sourceId);
            if (current == null || TYPE_HOSTING.equals(document.getType())) {
                preferredBySourceId.put(sourceId, document);
            }
        }
        for (ActivityEvent event : preferredBySourceId.values()) {
            String sourceId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            if (Boolean.FALSE.equals(event.getPublished()) || Boolean.TRUE.equals(event.getIsTrashed())) {
                scheduledMessageTaskService.suspendEventStageReminders(sourceId, actorUserId);
            } else {
                scheduledMessageTaskService.scheduleEventStageReminders(event, actorUserId);
            }
        }
    }

    private void markEventAttachmentsUnavailable(List<ActivityEvent> documents, String reason) {
        if (chatAttachmentLifecycleService == null || documents == null || documents.isEmpty()) {
            return;
        }
        documents.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .forEach(sourceId -> chatAttachmentLifecycleService.markEventUnavailable(sourceId, reason));
    }

    private void markEventAttachmentsAvailable(List<ActivityEvent> documents) {
        if (chatAttachmentLifecycleService == null || documents == null || documents.isEmpty()) {
            return;
        }
        documents.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .forEach(chatAttachmentLifecycleService::markEventAvailable);
    }

    private List<ActivityEvent> resolveActionDocuments(String ownerUserId, String type, String sourceId) {
        List<String> candidateTypes = TYPE_INVITATIONS.equals(normalizeType(type))
                ? List.of(TYPE_INVITATIONS)
                : List.of(TYPE_EVENTS, TYPE_HOSTING);
        List<ActivityEvent> documents = new ArrayList<>();
        for (String candidateType : candidateTypes) {
            activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId(ownerUserId, candidateType, sourceId)
                    .ifPresent(documents::add);
        }
        return documents;
    }

    private ActivityEvent buildUserStateOverlayRecord(String ownerUserId, String type, String sourceId) {
        if (TYPE_INVITATIONS.equals(normalizeType(type))) {
            return null;
        }
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        if (preferred == null) {
            return null;
        }
        String overlayType = TYPE_HOSTING.equals(normalizeType(type)) ? TYPE_HOSTING : TYPE_EVENTS;
        ActivityEvent overlay = cloneDocument(preferred);
        overlay.setId(new ObjectId().toHexString());
        overlay.setSyncKey(UUID.randomUUID().toString());
        overlay.setOwnerUserId(ownerUserId);
        overlay.setType(overlayType);
        overlay.setIsAdmin(TYPE_HOSTING.equals(overlayType));
        overlay.setIsHosting(TYPE_HOSTING.equals(overlayType));
        overlay.setIsInvitation(false);
        overlay.setAdmins(resolveAdminUserIds(sourceId, overlay.getCreatorUserId()));
        overlay.setCreatedDate(Instant.now().toString());
        overlay.setCreatedUser(ownerUserId);
        overlay.setUpdatedDate(Instant.now().toString());
        overlay.setUpdatedUser(ownerUserId);
        overlay.normalizeLifecycleState();
        return overlay;
    }

    private ActivityEvent buildSyncedRecord(
            ActivitiesEventSyncPayloadDto request,
            Users creator,
            String actorUserId,
            String sourceId,
            String targetType,
            ActivitiesMembersService.OwnerMembersSnapshot syncedMembersSnapshot) {
        String ownerUserId = normalizeId(request.creatorUserId());
        if (!StringUtils.hasText(ownerUserId)) {
            ownerUserId = actorUserId;
        }

        ActivityEvent existing = activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId(ownerUserId, targetType, sourceId)
                .orElse(null);
        ActivityEvent document = existing == null ? new ActivityEvent() : cloneDocument(existing);
        ActivityEvent publishedExisting = isPublishedEventManageUpdate(existing) ? existing : null;
        boolean publishedManageMode = publishedExisting != null;
        String nowIso = Instant.now().toString();
        String parentEventId = publishedExisting != null ? safeText(publishedExisting.getParentEventId()) : safeText(request.parentEventId());
        if (!StringUtils.hasText(parentEventId) && existing != null) {
            parentEventId = safeText(existing.getParentEventId());
        }
        String slotTemplateId = publishedExisting != null ? safeText(publishedExisting.getSlotTemplateId()) : safeText(request.slotTemplateId());
        if (!StringUtils.hasText(slotTemplateId) && existing != null) {
            slotTemplateId = safeText(existing.getSlotTemplateId());
        }
        boolean generated = publishedExisting != null
                ? Boolean.TRUE.equals(publishedExisting.getGenerated())
                : request.generated() != null
                ? Boolean.TRUE.equals(request.generated())
                : existing != null && Boolean.TRUE.equals(existing.getGenerated());
        String requestedEventType = publishedExisting != null ? safeText(publishedExisting.getEventType()) : safeText(request.eventType());
        if (!StringUtils.hasText(requestedEventType) && existing != null) {
            requestedEventType = safeText(existing.getEventType());
        }
        boolean slotEvent = generated
                || "slot".equalsIgnoreCase(requestedEventType)
                || StringUtils.hasText(parentEventId);
        List<String> acceptedMemberUserIds = syncedMembersSnapshot == null
                ? fallbackAcceptedMemberUserIds(request, existing, ownerUserId)
                : new ArrayList<>(syncedMembersSnapshot.acceptedMemberUserIds());
        int acceptedMembers = syncedMembersSnapshot == null
                ? Math.max(normalizeCount(request.acceptedMembers()), acceptedMemberUserIds.size())
                : syncedMembersSnapshot.acceptedMembers();
        int pendingMembers = syncedMembersSnapshot == null
                ? normalizeCount(request.pendingMembers())
                : syncedMembersSnapshot.pendingMembers();

        document.setId(resolveExistingId(ownerUserId, targetType, sourceId, existing));
        document.setSyncKey(resolveExistingSyncKey(ownerUserId, targetType, sourceId, existing == null ? request.syncKey() : existing.getSyncKey()));
        document.setSourceId(sourceId);
        document.setOwnerUserId(ownerUserId);
        document.setType(targetType);
        document.setAvatar(resolveCreatorInitials(request.creatorInitials(), creator, request.creatorName()));
        document.setTitle(safeText(request.title()));
        document.setSubtitle(safeText(request.shortDescription()));
        document.setTimeframe(safeText(request.timeframe()));
        document.setInviter(existing == null ? null : existing.getInviter());
        document.setUnread(existing == null ? 0 : normalizeCount(existing.getUnread()));
        document.setActivity(normalizeCount(request.activity()));
        document.setIsAdmin(TYPE_HOSTING.equals(targetType));
        document.setIsInvitation(false);
        document.setIsHosting(TYPE_HOSTING.equals(targetType));
        document.setIsTrashed(existing != null && Boolean.TRUE.equals(existing.getIsTrashed()));
        boolean nextPublished = publishedManageMode
                || !TYPE_HOSTING.equals(targetType)
                || !Boolean.FALSE.equals(request.published());
        document.setPublished(nextPublished);
        document.setTrashedAtIso(existing == null ? null : existing.getTrashedAtIso());
        document.setCreatorUserId(ownerUserId);
        document.setCreatorName(resolveCreatorName(request.creatorName(), creator));
        document.setCreatorInitials(resolveCreatorInitials(request.creatorInitials(), creator, request.creatorName()));
        document.setCreatorGender(resolveCreatorGender(request.creatorGender(), creator));
        document.setCreatorCity(resolveCreatorCity(request.creatorCity(), creator));
        document.setVisibility(publishedExisting != null ? safeText(publishedExisting.getVisibility()) : resolveVisibility(request.visibility(), existing, targetType));
        document.setBlindMode(publishedExisting != null ? safeText(publishedExisting.getBlindMode()) : resolveBlindMode(request.blindMode(), existing));
        String normalizedFrequency = publishedManageMode
                ? normalizeEventFrequency(existing == null ? null : existing.getFrequency())
                : normalizeEventFrequency(StringUtils.hasText(request.frequency()) ? request.frequency().trim() : safeText(existing == null ? null : existing.getFrequency()));
        document.setFrequency(normalizedFrequency);
        document.setStartAtIso(publishedManageMode
                ? normalizeDateTime(existing == null ? null : existing.getStartAtIso(), nowIso)
                : normalizeDateTime(request.startAt(), existing == null ? nowIso : existing.getStartAtIso()));
        document.setEndAtIso(publishedManageMode
                ? normalizeDateTime(existing == null ? null : existing.getEndAtIso(), document.getStartAtIso())
                : normalizeDateTime(request.endAt(), document.getStartAtIso()));
        document.setDistanceKm(null);
        document.setImageUrl(StringUtils.hasText(request.imageUrl()) ? request.imageUrl().trim() : safeText(existing == null ? null : existing.getImageUrl()));
        document.setSourceLink(StringUtils.hasText(request.sourceLink()) ? request.sourceLink().trim() : safeText(existing == null ? null : existing.getSourceLink()));
        document.setLocation(StringUtils.hasText(request.location()) ? request.location().trim() : safeText(existing == null ? null : existing.getLocation()));
        document.setLocationCoordinates(request.locationCoordinates() != null
                ? cloneLocation(request.locationCoordinates())
                : (existing != null && existing.getLocationCoordinates() != null
                        ? cloneLocation(existing.getLocationCoordinates())
                        : toLocationCoordinatesDto(creator == null ? null : creator.getLocationCoordinates())));
        document.setLocationGeo(toGeoPoint(document.getLocationCoordinates()));
        Integer requestedCapacityMax = nullableCount(request.capacityMax());
        Integer effectiveCapacityMax = publishedManageMode
                ? resolvePublishedCapacityMax(existing, requestedCapacityMax, acceptedMembers)
                : requestedCapacityMax;
        document.setCapacityMin(publishedManageMode
                ? nullableCount(existing == null ? null : existing.getCapacityMin())
                : nullableCount(request.capacityMin()));
        document.setCapacityMax(effectiveCapacityMax);
        document.setCapacityTotal(publishedManageMode
                ? resolvePublishedCapacityTotal(existing, effectiveCapacityMax, acceptedMembers, syncedMembersSnapshot)
                : resolveCapacityTotal(request, existing, acceptedMembers, syncedMembersSnapshot));
        document.setAutoInviter(request.autoInviter() != null ? request.autoInviter() : existing != null && Boolean.TRUE.equals(existing.getAutoInviter()));
        document.setTicketing(publishedManageMode
                ? existing != null && Boolean.TRUE.equals(existing.getTicketing())
                : request.ticketing() != null ? request.ticketing() : existing != null && Boolean.TRUE.equals(existing.getTicketing()));
        document.setPricing(publishedManageMode
                ? existing == null ? null : clonePricing(existing.getPricing())
                : request.pricing() != null ? clonePricing(request.pricing()) : existing == null ? null : clonePricing(existing.getPricing()));
        boolean slotsEnabled = publishedManageMode
                ? existing != null && Boolean.TRUE.equals(existing.getSlotsEnabled())
                : !slotEvent && !"One-time".equals(normalizedFrequency);
        document.setSlotsEnabled(slotsEnabled);
        document.setSlotTemplates(publishedManageMode
                ? cloneSlotTemplates(existing == null ? null : existing.getSlotTemplates())
                : slotEvent || !slotsEnabled ? List.of() : cloneSlotTemplates(request.slotTemplates()));
        document.setParentEventId(slotEvent ? parentEventId : null);
        document.setSlotTemplateId(slotEvent ? slotTemplateId : null);
        document.setGenerated(slotEvent && generated);
        document.setEventType(slotEvent ? "slot" : "main");
        document.setAcceptedMembers(acceptedMembers);
        document.setPendingMembers(pendingMembers);
        document.setTopics(normalizeStrings(request.topics()));
        document.setSubEvents(publishedManageMode
                ? cloneSubEvents(existing == null ? null : existing.getSubEvents())
                : cloneSubEvents(request.subEvents()));
        document.setSubEventsDisplayMode(publishedManageMode
                ? safeText(existing == null ? null : existing.getSubEventsDisplayMode())
                : safeText(request.subEventsDisplayMode()));
        document.setRating(existing == null ? 0d : safeDouble(existing.getRating()));
        document.setAffinity(resolveAffinity(document, creator, acceptedMemberUserIds));
        document.setBoost(resolveBoost(document, creator, acceptedMemberUserIds));
        document.setCreatedDate(existing == null ? nowIso : safeText(existing.getCreatedDate()));
        document.setCreatedUser(existing == null ? actorUserId : safeText(existing.getCreatedUser()));
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(actorUserId);
        document.setAdmins(existing != null && existing.getAdmins() != null
                ? new ArrayList<>(existing.getAdmins())
                : resolveAdminUserIds(StringUtils.hasText(parentEventId) ? parentEventId : sourceId, document.getCreatorUserId()));
        document.normalizeLifecycleState();
        return document;
    }

    private double resolveAffinity(ActivityEvent event, Users creator, List<String> acceptedMemberUserIds) {
        return absoluteAffinityService.resolveEventAffinity(event, resolveAffinityParticipants(creator, acceptedMemberUserIds));
    }

    private double resolveBoost(ActivityEvent event, Users creator, List<String> acceptedMemberUserIds) {
        return absoluteAffinityService.resolveEventBoost(event, resolveAffinityParticipants(creator, acceptedMemberUserIds));
    }

    private List<Users> resolveAffinityParticipants(Users creator, List<String> acceptedMemberUserIds) {
        LinkedHashMap<String, Users> participantsByUserId = new LinkedHashMap<>();
        String creatorUserId = normalizeId(creator == null ? null : creator.getId());
        if (StringUtils.hasText(creatorUserId)) {
            participantsByUserId.put(creatorUserId, creator);
        }
        List<String> missingUserIds = normalizeIds(acceptedMemberUserIds).stream()
                .filter(userId -> !participantsByUserId.containsKey(userId))
                .toList();
        if (!missingUserIds.isEmpty()) {
            for (Users user : usersRepository.findByUserIdIn(missingUserIds)) {
                String userId = normalizeId(user == null ? null : user.getId());
                if (StringUtils.hasText(userId)) {
                    participantsByUserId.put(userId, user);
                }
            }
        }
        return new ArrayList<>(participantsByUserId.values());
    }

    private List<String> fallbackAcceptedMemberUserIds(
            ActivitiesEventSyncPayloadDto request,
            ActivityEvent existing,
            String ownerUserId) {
        LinkedHashSet<String> acceptedMemberUserIds = new LinkedHashSet<>();
        String creatorUserId = normalizeId(request.creatorUserId());
        if (!StringUtils.hasText(creatorUserId) && existing != null) {
            creatorUserId = normalizeId(existing.getCreatorUserId());
        }
        if (!StringUtils.hasText(creatorUserId)) {
            creatorUserId = normalizeId(ownerUserId);
        }
        if (StringUtils.hasText(creatorUserId)) {
            acceptedMemberUserIds.add(creatorUserId);
        }
        return new ArrayList<>(acceptedMemberUserIds);
    }

    private int resolveCapacityTotal(
            ActivitiesEventSyncPayloadDto request,
            ActivityEvent existing,
            int acceptedMembers,
            ActivitiesMembersService.OwnerMembersSnapshot syncedMembersSnapshot) {
        int requestedCapacity = Math.max(normalizeCount(request.capacityTotal()), Math.max(nullableCount(request.capacityMax()) == null ? 0 : nullableCount(request.capacityMax()), acceptedMembers));
        if (requestedCapacity > 0) {
            return requestedCapacity;
        }
        if (syncedMembersSnapshot != null && syncedMembersSnapshot.capacityTotal() != null) {
            return Math.max(acceptedMembers, syncedMembersSnapshot.capacityTotal());
        }
        return Math.max(acceptedMembers, existing == null ? 0 : normalizeCount(existing.getCapacityTotal()));
    }

    private boolean isPublishedEventManageUpdate(ActivityEvent existing) {
        return existing != null
                && !Boolean.FALSE.equals(existing.getPublished())
                && !STATUS_DRAFT.equals(safeText(existing.getStatus()));
    }

    private Integer resolvePublishedCapacityMax(ActivityEvent existing, Integer requestedCapacityMax, int acceptedMembers) {
        int existingMax = normalizeCount(existing == null ? null : existing.getCapacityMax());
        int requestedMax = requestedCapacityMax == null ? 0 : Math.max(0, requestedCapacityMax);
        int nextMax = Math.max(Math.max(existingMax, requestedMax), Math.max(0, acceptedMembers));
        return nextMax > 0 ? nextMax : null;
    }

    private int resolvePublishedCapacityTotal(
            ActivityEvent existing,
            Integer capacityMax,
            int acceptedMembers,
            ActivitiesMembersService.OwnerMembersSnapshot syncedMembersSnapshot) {
        int snapshotCapacity = syncedMembersSnapshot != null && syncedMembersSnapshot.capacityTotal() != null
                ? Math.max(0, syncedMembersSnapshot.capacityTotal())
                : 0;
        return Math.max(
                Math.max(normalizeCount(existing == null ? null : existing.getCapacityTotal()), snapshotCapacity),
                Math.max(Math.max(capacityMax == null ? 0 : capacityMax, acceptedMembers), 0));
    }

    private String resolveExistingId(String ownerUserId, String type, String sourceId, ActivityEvent existing) {
        if (existing != null && StringUtils.hasText(existing.getId())) {
            return existing.getId();
        }
        return activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId(ownerUserId, type, sourceId)
                .map(ActivityEvent::getId)
                .filter(StringUtils::hasText)
                .orElseGet(() -> new ObjectId().toHexString());
    }

    private String resolveExistingSyncKey(String ownerUserId, String type, String sourceId, String preferred) {
        if (StringUtils.hasText(preferred)) {
            return preferred.trim();
        }
        return activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId(ownerUserId, type, sourceId)
                .map(ActivityEvent::getSyncKey)
                .filter(StringUtils::hasText)
                .orElseGet(() -> UUID.randomUUID().toString());
    }

    private List<ActivityEvent> allEventDocuments() {
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        if (ctx != null) {
            return ctx.allEvents();
        }
        return activityEventsRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .toList();
    }

    private List<ActivityEvent> allEventDocuments(ViewerContext viewer) {
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        if (ctx != null) {
            return ctx.mergedEvents();
        }
        if (viewer == null || viewer.locationCoordinates() == null) {
            return allEventDocuments();
        }

        List<ActivityEvent> fallback = allEventDocuments();
        List<ActivityEvent> geoOrdered = geoOrderedEventDocuments(viewer.locationCoordinates());
        if (geoOrdered.isEmpty()) {
            return fallback;
        }

        LinkedHashMap<String, ActivityEvent> merged = new LinkedHashMap<>();
        for (ActivityEvent record : geoOrdered) {
            String documentId = normalizeId(record == null ? null : record.getId());
            if (StringUtils.hasText(documentId)) {
                merged.put(documentId, record);
            }
        }
        for (ActivityEvent record : fallback) {
            String documentId = normalizeId(record == null ? null : record.getId());
            if (StringUtils.hasText(documentId) && !merged.containsKey(documentId)) {
                merged.put(documentId, record);
            }
        }
        return new ArrayList<>(merged.values());
    }

    private List<ActivityEvent> geoOrderedEventDocuments(LocationCoordinatesDto viewerCoordinates) {
        GeoJsonPoint viewerPoint = toGeoPoint(viewerCoordinates);
        if (viewerPoint == null) {
            return List.of();
        }

        Document geoNearStage = new Document("$geoNear", new Document("near", toGeoJsonDocument(viewerPoint))
                .append("distanceField", "distanceSortValue")
                .append("spherical", true)
                .append("key", "locationGeo")
                .append("query", new Document("type", TYPE_EVENTS)
                        .append("status", new Document("$in", List.of(STATUS_ACTIVE, "active")))
                        .append("generated", new Document("$ne", true))));

        List<Document> rawDocuments;
        try {
            rawDocuments = mongoTemplate.getCollection(mongoTemplate.getCollectionName(ActivityEvent.class))
                    .aggregate(List.of(geoNearStage))
                    .into(new ArrayList<>());
        } catch (RuntimeException exception) {
            if (isMissingGeoNearIndex(exception)) {
                logMissingEventGeoIndexWarning();
                return List.of();
            }
            throw exception;
        }

        List<ActivityEvent> ordered = new ArrayList<>();
        for (Document rawDocument : rawDocuments) {
            ActivityEvent record = readGeoOrderedDocument(rawDocument);
            if (record != null && isCanonicalExploreRecord(record)) {
                ordered.add(record);
            }
        }
        return ordered;
    }

    private boolean isMissingGeoNearIndex(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            if (current instanceof com.mongodb.MongoCommandException commandException
                    && commandException.getErrorCode() == MONGO_NO_QUERY_EXECUTION_PLANS_CODE
                    && safeText(commandException.getErrorMessage()).contains("$geoNear")) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }

    private void logMissingEventGeoIndexWarning() {
        if (MISSING_EVENT_GEO_INDEX_WARNING_LOGGED.compareAndSet(false, true)) {
            LOGGER.warn("Missing 2dsphere index for events.locationGeo. Falling back to non-geo event ordering.");
        }
    }

    private boolean hasTrackedUserParticipation(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId)) {
            return false;
        }
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        String sourceId = normalizeId(record.getSourceId());
        if (ctx != null && StringUtils.hasText(sourceId) && ctx.trackedEventSourceIds().contains(sourceId)) {
            return true;
        }
        return resolveAcceptedMemberUserIds(record).contains(userId)
                || resolvePendingMemberUserIds(record).contains(userId);
    }

    private boolean hasAcceptedParticipation(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId) || isViewerAdmin(record, userId)) {
            return false;
        }
        if (!resolveAcceptedMemberUserIds(record).contains(userId)) {
            return false;
        }
        return !hasPendingPaymentParticipation(record, userId);
    }

    private boolean isPendingParticipation(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId) || isViewerAdmin(record, userId)) {
            return false;
        }
        if (resolveAcceptedMemberUserIds(record).contains(userId)) {
            return hasPendingPaymentParticipation(record, userId);
        }
        return resolvePendingMemberUserIds(record).contains(userId);
    }

    private boolean hasPendingPaymentParticipation(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId) || !Boolean.TRUE.equals(record.getTicketing())) {
            return false;
        }
        return paymentService.hasPendingEventJoin(userId, normalizeId(record.getSourceId()));
    }

    private boolean hasTopic(ActivityEvent record, String topic) {
        return normalizeStrings(record.getTopics()).stream()
                .map(this::normalizeTopic)
                .anyMatch(topic::equals);
    }

    private boolean exploreHasFriendGoing(ActivityEvent record, String activeUserId) {
        List<String> candidateUserIds = new ArrayList<>();
        candidateUserIds.add(normalizeId(record.getCreatorUserId()));
        candidateUserIds.addAll(resolveAcceptedMemberUserIds(record));
        return candidateUserIds.stream()
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(activeUserId))
                .anyMatch(userId -> isFriendOfActiveUser(userId, activeUserId));
    }

    private boolean exploreHasOpenSpots(ActivityEvent record) {
        return normalizeCount(record.getCapacityTotal()) > resolveAcceptedMemberUserIds(record).size();
    }

    private boolean isViewerAdmin(ActivityEvent record, String viewerUserId) {
        if (record == null || !StringUtils.hasText(viewerUserId)) {
            return false;
        }
        if (normalizeIds(record.getAdmins()).contains(viewerUserId)) {
            return true;
        }
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null && snapshot.hasAcceptedAdminRole(viewerUserId)) {
            return true;
        }
        return viewerUserId.equals(normalizeId(record.getCreatorUserId()));
    }

    private String resolveViewerScopedEventType(ActivityEvent record, String viewerUserId) {
        if (record == null) {
            return TYPE_EVENTS;
        }
        if (Boolean.TRUE.equals(record.getIsInvitation())) {
            return TYPE_INVITATIONS;
        }
        if (Boolean.TRUE.equals(record.getIsHosting()) || isViewerAdmin(record, viewerUserId)) {
            return TYPE_HOSTING;
        }
        return TYPE_EVENTS;
    }

    private ActivityEvent findPreferredEventRecord(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return null;
        }
        return computePreferredEventRecords(loadEventDocumentsBySourceIds(List.of(normalizedSourceId))).stream()
                .findFirst()
                .orElse(null);
    }

    private List<ActivityEvent> loadEventDocumentsBySourceIds(Collection<String> sourceIds) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return List.of();
        }
        return activityEventsRepository.findBySourceIdIn(normalizedSourceIds).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .toList();
    }

    private ActivitiesMembersService.OwnerMembersSnapshot resolveMembersSnapshot(ActivityEvent record) {
        if (record == null || !StringUtils.hasText(normalizeId(record.getSourceId()))) {
            return null;
        }
        return resolveSnapshot(normalizeId(record.getSourceId()));
    }

    private ActivitiesMembersService.OwnerMembersSnapshot resolveSnapshot(String sourceId) {
        if (!StringUtils.hasText(sourceId)) {
            return null;
        }
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        if (ctx != null) {
            return ctx.snapshotsBySourceId().get(sourceId);
        }
        return activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
    }

    private List<String> resolveAdminUserIds(String sourceId, String creatorUserId) {
        LinkedHashSet<String> adminUserIds = new LinkedHashSet<>();
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveSnapshot(normalizeId(sourceId));
        if (snapshot != null) {
            adminUserIds.addAll(snapshot.adminUserIds());
        }
        String normalizedCreatorUserId = normalizeId(creatorUserId);
        if (StringUtils.hasText(normalizedCreatorUserId)) {
            adminUserIds.add(normalizedCreatorUserId);
        }
        return new ArrayList<>(adminUserIds);
    }

    private List<String> resolveAcceptedMemberUserIds(ActivityEvent record) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null) {
            return new ArrayList<>(snapshot.acceptedMemberUserIds());
        }
        return fallbackAcceptedMemberUserIds(record);
    }

    private List<String> resolvePendingMemberUserIds(ActivityEvent record) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null) {
            return new ArrayList<>(snapshot.pendingMemberUserIds());
        }
        return List.of();
    }

    private List<String> fallbackAcceptedMemberUserIds(ActivityEvent record) {
        String creatorUserId = record == null ? null : normalizeId(record.getCreatorUserId());
        return StringUtils.hasText(creatorUserId) ? List.of(creatorUserId) : List.of();
    }

    private boolean isFriendOfActiveUser(String userId, String activeUserId) {
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(activeUserId) || userId.equals(activeUserId)) {
            return false;
        }
        String firstId = userId.compareTo(activeUserId) <= 0 ? userId : activeUserId;
        String secondId = userId.compareTo(activeUserId) <= 0 ? activeUserId : userId;
        int seed = hashText("friend-pair:" + firstId + ":" + secondId);
        return (seed % 100) < 32;
    }

    private int hashText(String value) {
        int hash = 0;
        for (int index = 0; index < value.length(); index += 1) {
            hash = (hash * 31 + value.charAt(index)) % 104729;
        }
        return Math.abs(hash);
    }

    private int resolveCursorStartIndex(List<EventProjection> items, String cursor) {
        String cursorId = parseCursorId(cursor);
        if (!StringUtils.hasText(cursorId)) {
            return 0;
        }
        for (int index = 0; index < items.size(); index += 1) {
            if (cursorId.equals(items.get(index).item().id())) {
                return index + 1;
            }
        }
        return 0;
    }

    private String serializeCursor(EventRecordDto item) {
        if (item == null || !StringUtils.hasText(item.id())) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(Map.of("id", item.id()));
        } catch (Exception ignored) {
            return item.id();
        }
    }

    private String parseCursorId(String cursor) {
        if (!StringUtils.hasText(cursor)) {
            return null;
        }
        try {
            Map<String, String> parsed = OBJECT_MAPPER.readValue(cursor, new TypeReference<>() { });
            return normalizeId(parsed.get("id"));
        } catch (Exception ignored) {
            return normalizeId(cursor);
        }
    }

    private Comparator<EventRecordDto> listItemComparator() {
        return Comparator.comparing((EventRecordDto item) -> toSortableDate(item.startAtIso()))
                .thenComparing(item -> safeText(item.id()));
    }

    private ActivityEvent cloneDocument(ActivityEvent source) {
        ActivityEvent clone = new ActivityEvent();
        BeanUtils.copyProperties(source, clone);
        clone.setAdmins(new ArrayList<>(normalizeIds(source.getAdmins())));
        clone.setTopics(new ArrayList<>(normalizeStrings(source.getTopics())));
        clone.setSubEvents(cloneSubEvents(source.getSubEvents()));
        clone.setSlotTemplates(cloneSlotTemplates(source.getSlotTemplates()));
        clone.setPricing(clonePricing(source.getPricing()));
        clone.setLocationCoordinates(cloneLocation(source.getLocationCoordinates()));
        clone.setLocationGeo(cloneGeoPoint(source.getLocationGeo()));
        return clone;
    }

    private String normalizeType(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case TYPE_EVENTS, TYPE_HOSTING, TYPE_INVITATIONS -> normalized;
            default -> TYPE_EVENTS;
        };
    }

    private String normalizeTargetType(String value) {
        String normalized = safeText(value);
        return TYPE_EVENTS.equals(normalized) || TYPE_HOSTING.equals(normalized) ? normalized : null;
    }

    private boolean isSuppressedLifecycleStatus(String status) {
        String normalized = safeText(status);
        return STATUS_UNDER_REVIEW.equals(normalized)
                || STATUS_BLOCKED.equals(normalized)
                || STATUS_DELETED.equals(normalized)
                || STATUS_INACTIVE.equals(normalized);
    }

    private String normalizeEventScopeFilter(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "all", "pending", "invitations", "my-events", "drafts", "trash" -> normalized;
            default -> "active-events";
        };
    }

    private String normalizeHostingPublicationFilter(String value) {
        return "drafts".equals(safeText(value)) ? "drafts" : "all";
    }

    private String normalizeActivitiesSecondaryFilter(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "past", "relevant" -> normalized;
            default -> "recent";
        };
    }

    private String normalizeActivitiesView(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "week", "month", "distance" -> normalized;
            default -> "day";
        };
    }

    private String normalizeActivitiesSort(String value, String view, String secondaryFilter) {
        String normalized = safeText(value);
        if (StringUtils.hasText(normalized)) {
            return normalized;
        }
        if ("distance".equals(view)) {
            return "distance";
        }
        if ("relevant".equals(secondaryFilter)) {
            return "relevance";
        }
        return "date";
    }

    private String normalizeExploreOrder(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "past-events", "nearby", "most-relevant", "top-rated" -> normalized;
            default -> "upcoming";
        };
    }

    private String normalizeExploreView(String value) {
        return "distance".equals(safeText(value)) ? "distance" : "day";
    }

    private String normalizeTopic(String value) {
        String normalized = safeText(value).replaceFirst("^#+\\s*", "");
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return Normalizer.normalize(normalized.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .trim();
    }

    private int normalizeLimit(Integer value, int fallback) {
        return Math.max(1, value == null ? fallback : value);
    }

    private int normalizeCount(Number value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private Integer nullableCount(Number value) {
        return value == null ? null : Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private double safeDouble(Number value) {
        return value == null ? 0d : value.doubleValue();
    }

    private String normalizeId(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private String resolveTelemetryEventType(ActivitiesEventSyncPayloadDto request) {
        if (request == null) {
            return "Organized";
        }
        String eventType = safeText(request.eventType());
        String normalizedEventType = eventType.toLowerCase(Locale.ROOT);
        if (Boolean.TRUE.equals(request.generated())) {
            return "Random";
        }
        if (normalizedEventType.contains("tournament")) {
            return "Tournament";
        }
        if (normalizedEventType.contains("recurring") || StringUtils.hasText(safeText(request.frequency()))) {
            return "Recurring";
        }
        if (Boolean.TRUE.equals(request.slotsEnabled()) || request.slotTemplates() != null && !request.slotTemplates().isEmpty()) {
            return "Multi-slot";
        }
        return StringUtils.hasText(eventType) ? eventType : "Organized";
    }

    private List<String> normalizeIds(Collection<String> values) {
        if (values == null) {
            return List.of();
        }
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String value : values) {
            String id = normalizeId(value);
            if (StringUtils.hasText(id)) {
                normalized.add(id);
            }
        }
        return new ArrayList<>(normalized);
    }

    private String resolveEventOwnerUserId(ActivityEvent record) {
        if (record == null) {
            return null;
        }
        String creatorUserId = normalizeId(record.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId)) {
            return creatorUserId;
        }
        return normalizeId(record.getOwnerUserId());
    }

    private double edgeWeight(String leftUserId, String rightUserId, Map<String, Double> edgeWeightsByPairKey) {
        String normalizedLeft = normalizeId(leftUserId);
        String normalizedRight = normalizeId(rightUserId);
        if (!StringUtils.hasText(normalizedLeft)
                || !StringUtils.hasText(normalizedRight)
                || normalizedLeft.equals(normalizedRight)
                || edgeWeightsByPairKey == null
                || edgeWeightsByPairKey.isEmpty()) {
            return 0d;
        }
        return Math.max(0d, Math.min(1d, edgeWeightsByPairKey.getOrDefault(pairKey(normalizedLeft, normalizedRight), 0d)));
    }

    private String pairKey(String leftUserId, String rightUserId) {
        String normalizedLeft = normalizeId(leftUserId);
        String normalizedRight = normalizeId(rightUserId);
        if (normalizedLeft.compareTo(normalizedRight) <= 0) {
            return normalizedLeft + ":" + normalizedRight;
        }
        return normalizedRight + ":" + normalizedLeft;
    }

    private List<String> normalizeStrings(Collection<String> values) {
        if (values == null) {
            return List.of();
        }
        List<String> normalized = new ArrayList<>();
        for (String value : values) {
            String text = safeText(value);
            if (StringUtils.hasText(text)) {
                normalized.add(text);
            }
        }
        return normalized;
    }

    private List<SubEventFormItemDto> cloneSubEvents(List<SubEventFormItemDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private List<SubEventFormItemDto> ensureTournamentStartReviewStage(List<SubEventFormItemDto> items, String nowIso) {
        List<SubEventFormItemDto> subEvents = cloneSubEvents(items);
        if (subEvents.isEmpty()) {
            return subEvents;
        }
        int firstTournamentIndex = -1;
        for (int index = 0; index < subEvents.size(); index += 1) {
            if (isTournamentStage(subEvents.get(index))) {
                firstTournamentIndex = index;
                break;
            }
        }
        if (firstTournamentIndex != 0) {
            return subEvents;
        }

        SubEventFormItemDto firstStage = subEvents.get(0);
        String currentStatus = normalizeStageStatus(firstStage.stageStatus());
        if (!STAGE_STATUS_ACTIVE.equals(currentStatus)) {
            return subEvents;
        }
        subEvents.set(0, copySubEventWithStageStatus(
                firstStage,
                STAGE_STATUS_START_REVIEW,
                "awaiting-tournament-start",
                firstNonBlank(nowIso, Instant.now().toString()),
                null,
                null));
        return subEvents;
    }

    private SubEventFormItemDto firstTournamentStage(List<SubEventFormItemDto> items) {
        List<SubEventFormItemDto> subEvents = cloneSubEvents(items);
        if (subEvents.isEmpty() || !isTournamentStage(subEvents.get(0))) {
            return null;
        }
        return subEvents.get(0);
    }

    private boolean isTournamentStage(SubEventFormItemDto item) {
        if (item == null || Boolean.TRUE.equals(item.optional())) {
            return false;
        }
        return (item.tournamentGroupCount() != null && item.tournamentGroupCount() > 0)
                || (item.groups() != null && !item.groups().isEmpty());
    }

    private List<SubEventFormItemDto> materializeSubEventsForSlotOccurrence(
            List<SubEventFormItemDto> items,
            LocalDateTime occurrenceStart,
            LocalDateTime occurrenceEnd) {
        List<SubEventFormItemDto> source = cloneSubEvents(items);
        if (source.isEmpty() || occurrenceStart == null || occurrenceEnd == null || !occurrenceEnd.isAfter(occurrenceStart)) {
            return source;
        }

        int slotDurationMinutes = Math.max(1, (int) ChronoUnit.MINUTES.between(occurrenceStart, occurrenceEnd));
        List<SubEventFormItemDto> materialized = new ArrayList<>(source.size());
        for (SubEventFormItemDto item : source) {
            if (item == null) {
                continue;
            }

            LocalDateTime rawStart = toLocalDateTime(item.startAt());
            LocalDateTime rawEnd = toLocalDateTime(item.endAt());
            Integer explicitOffset = item.slotStartOffsetMinutes();
            Integer explicitDuration = item.slotDurationMinutes();

            int offsetMinutes;
            if (explicitOffset != null) {
                offsetMinutes = Math.max(0, explicitOffset);
            } else if (rawStart != null) {
                offsetMinutes = Math.max(
                        0,
                        ((rawStart.getHour() * 60) + rawStart.getMinute())
                                - ((occurrenceStart.getHour() * 60) + occurrenceStart.getMinute()));
            } else {
                offsetMinutes = 0;
            }

            int durationMinutes;
            if (explicitDuration != null) {
                durationMinutes = Math.max(1, explicitDuration);
            } else if (rawStart != null && rawEnd != null && rawEnd.isAfter(rawStart)) {
                durationMinutes = Math.max(1, (int) ChronoUnit.MINUTES.between(rawStart, rawEnd));
            } else {
                durationMinutes = slotDurationMinutes;
            }

            int safeOffsetMinutes = Math.min(Math.max(0, slotDurationMinutes - 1), offsetMinutes);
            int safeDurationMinutes = Math.min(Math.max(1, slotDurationMinutes - safeOffsetMinutes), durationMinutes);
            LocalDateTime subEventStart = occurrenceStart.plusMinutes(safeOffsetMinutes);
            LocalDateTime subEventEnd = subEventStart.plusMinutes(safeDurationMinutes);
            if (!subEventEnd.isAfter(subEventStart)) {
                subEventEnd = occurrenceEnd;
            }

            materialized.add(new SubEventFormItemDto(
                    item.id(),
                    item.name(),
                    item.description(),
                    subEventStart.toString(),
                    subEventEnd.toString(),
                    item.location(),
                    item.createdByUserId(),
                    item.groups(),
                    item.tournamentGroupCount(),
                    item.tournamentGroupCapacityMin(),
                    item.tournamentGroupCapacityMax(),
                    item.tournamentLeaderboardType(),
                    item.tournamentAdvancePerGroup(),
                    item.optional(),
                    item.pricing(),
                    item.capacityMin(),
                    item.capacityMax(),
                    item.membersAccepted(),
                    item.membersPending(),
                    item.carsPending(),
                    item.accommodationPending(),
                    item.suppliesPending(),
                    item.carsAccepted(),
                    item.accommodationAccepted(),
                    item.suppliesAccepted(),
                    item.carsCapacityMin(),
                    item.carsCapacityMax(),
                    item.accommodationCapacityMin(),
                    item.accommodationCapacityMax(),
                    item.suppliesCapacityMin(),
                    item.suppliesCapacityMax(),
                    safeOffsetMinutes,
                    safeDurationMinutes,
                    item.stageStatus(),
                    item.stageStatusReason(),
                    item.stageStatusUpdatedAt(),
                    item.stageFinalizedAt(),
                    item.stageFinalizedByUserId()));
        }
        return materialized;
    }

    private List<EventSlotTemplateDto> cloneSlotTemplates(List<EventSlotTemplateDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private PricingConfigDto clonePricing(PricingConfigDto pricing) {
        return pricing;
    }

    private boolean isGeneratedSlotRecord(ActivityEvent record) {
        return record != null
                && (Boolean.TRUE.equals(record.getGenerated())
                        || "slot".equalsIgnoreCase(safeText(record.getEventType()))
                        || StringUtils.hasText(normalizeId(record.getParentEventId())));
    }

    private boolean isSlotParentRecord(ActivityEvent record) {
        return record != null
                && Boolean.TRUE.equals(record.getSlotsEnabled())
                && !isGeneratedSlotRecord(record)
                && record.getSlotTemplates() != null
                && !record.getSlotTemplates().isEmpty();
    }

    private void materializeSlotOccurrences() {
        List<ActivityEvent> documents = allEventDocuments();
        List<ActivityEvent> parents = computePreferredEventRecords(documents).stream()
                .filter(this::isSlotParentRecord)
                .toList();
        if (parents.isEmpty()) {
            return;
        }

        List<ActivityEvent> toSave = new ArrayList<>();
        for (ActivityEvent parent : parents) {
            Map<String, ActivityEvent> existingBySourceId = new LinkedHashMap<>();
            for (ActivityEvent record : documents) {
                if (isGeneratedSlotRecord(record)
                        && normalizeId(parent.getSourceId()).equals(normalizeId(record.getParentEventId()))) {
                    existingBySourceId.put(normalizeId(record.getSourceId()), record);
                }
            }
            for (ActivityEvent generated : buildGeneratedSlotRecordsForParent(parent, existingBySourceId)) {
                ActivityEvent existing = existingBySourceId.get(normalizeId(generated.getSourceId()));
                if (existing == null) {
                    toSave.add(generated);
                }
            }
        }
        if (!toSave.isEmpty()) {
            activityEventsRepository.saveAll(toSave);
        }
    }

    private List<ActivityEvent> buildGeneratedSlotRecordsForParent(
            ActivityEvent parent,
            Map<String, ActivityEvent> existingBySourceId) {
        LocalDateTime parentStart = toLocalDateTime(parent.getStartAtIso());
        LocalDateTime parentEnd = toLocalDateTime(parent.getEndAtIso());
        if (parentStart == null || parentEnd == null || !parentEnd.isAfter(parentStart)) {
            return List.of();
        }

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime horizonStart = parentStart.isAfter(now.minusDays(1)) ? parentStart : now.minusDays(1);
        LocalDateTime horizonEnd = parentEnd.isBefore(now.plusDays(45)) ? parentEnd : now.plusDays(45);
        if (horizonEnd.isBefore(horizonStart)) {
            return List.of();
        }

        List<ActivityEvent> records = new ArrayList<>();
        String parentSourceId = normalizeId(parent.getSourceId());
        String creatorUserId = normalizeId(parent.getCreatorUserId());
        List<EventSlotTemplateDto> templates = cloneSlotTemplates(parent.getSlotTemplates());
        Set<LocalDate> overrideDates = templates.stream()
                .filter(Objects::nonNull)
                .map(EventSlotTemplateDto::overrideDate)
                .map(this::slotOverrideDateKey)
                .filter(Objects::nonNull)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        for (EventSlotTemplateDto template : templates) {
            if (template == null || !StringUtils.hasText(template.id())) {
                continue;
            }
            if (StringUtils.hasText(template.overrideDate()) || Boolean.TRUE.equals(template.closed())) {
                continue;
            }
            LocalDateTime templateStart = toLocalDateTime(template.startAt());
            LocalDateTime templateEnd = toLocalDateTime(template.endAt());
            if (templateStart == null || templateEnd == null) {
                continue;
            }
            long durationMinutes = Math.max(60L, ChronoUnit.MINUTES.between(templateStart, templateEnd));
            for (LocalDateTime occurrenceStart : generateSlotOccurrenceStarts(parent.getFrequency(), templateStart, horizonStart, horizonEnd)) {
                if (overrideDates.contains(slotOccurrenceAnchorDateKey(occurrenceStart, templateStart, parentStart))) {
                    continue;
                }
                LocalDateTime occurrenceEnd = occurrenceStart.plusMinutes(durationMinutes);
                if (occurrenceStart.isBefore(parentStart) || occurrenceEnd.isAfter(parentEnd)) {
                    continue;
                }
                addGeneratedSlotRecordIfMissing(records, parent, existingBySourceId, template.id(), occurrenceStart, occurrenceEnd, parentSourceId, creatorUserId);
            }
        }
        for (EventSlotTemplateDto template : templates) {
            if (template == null || !StringUtils.hasText(template.id()) || !StringUtils.hasText(template.overrideDate())) {
                continue;
            }
            if (Boolean.TRUE.equals(template.closed())) {
                continue;
            }
            LocalDateTime templateStart = toLocalDateTime(template.startAt());
            LocalDateTime templateEnd = toLocalDateTime(template.endAt());
            if (templateStart == null || templateEnd == null) {
                continue;
            }
            if (templateEnd.isBefore(templateStart) || templateEnd.equals(templateStart)) {
                templateEnd = templateStart.plusMinutes(60L);
            }
            if (templateStart.isBefore(horizonStart) || templateStart.isAfter(horizonEnd)) {
                continue;
            }
            if (templateStart.isBefore(parentStart) || templateEnd.isAfter(parentEnd)) {
                continue;
            }
            addGeneratedSlotRecordIfMissing(records, parent, existingBySourceId, template.id(), templateStart, templateEnd, parentSourceId, creatorUserId);
        }
        return records;
    }

    private void addGeneratedSlotRecordIfMissing(
            List<ActivityEvent> records,
            ActivityEvent parent,
            Map<String, ActivityEvent> existingBySourceId,
            String slotTemplateId,
            LocalDateTime occurrenceStart,
            LocalDateTime occurrenceEnd,
            String parentSourceId,
            String creatorUserId) {
        String sourceId = buildGeneratedSlotSourceId(parentSourceId, slotTemplateId, occurrenceStart);
        ActivityEvent existing = existingBySourceId.get(normalizeId(sourceId));
        if (existing != null) {
            return;
        }
        ActivityEvent next = new ActivityEvent();
        String nowIso = Instant.now().toString();
        next.setId(resolveExistingId(creatorUserId, TYPE_EVENTS, sourceId, existing));
        next.setSyncKey(resolveExistingSyncKey(creatorUserId, TYPE_EVENTS, sourceId, existing == null ? null : existing.getSyncKey()));
        next.setSourceId(sourceId);
        next.setOwnerUserId(creatorUserId);
        next.setType(TYPE_EVENTS);
        next.setAvatar(parent.getAvatar());
        next.setTitle(parent.getTitle());
        next.setSubtitle(parent.getSubtitle());
        next.setTimeframe(buildGeneratedSlotTimeframe(occurrenceStart, occurrenceEnd));
        next.setInviter(null);
        next.setUnread(existing == null ? 0 : normalizeCount(existing.getUnread()));
        next.setActivity(existing == null ? 0 : normalizeCount(existing.getActivity()));
        next.setIsAdmin(true);
        next.setIsInvitation(false);
        next.setIsHosting(false);
        next.setIsTrashed(existing != null && Boolean.TRUE.equals(existing.getIsTrashed()));
        next.setPublished(Boolean.FALSE.equals(parent.getPublished()) ? Boolean.FALSE : Boolean.TRUE);
        next.setTrashedAtIso(existing == null ? null : existing.getTrashedAtIso());
        next.setCreatorUserId(creatorUserId);
        next.setCreatorName(parent.getCreatorName());
        next.setCreatorInitials(parent.getCreatorInitials());
        next.setCreatorGender(parent.getCreatorGender());
        next.setCreatorCity(parent.getCreatorCity());
        next.setVisibility(parent.getVisibility());
        next.setBlindMode(parent.getBlindMode());
        next.setStartAtIso(occurrenceStart.toInstant(ZoneOffset.UTC).toString());
        next.setEndAtIso(occurrenceEnd.toInstant(ZoneOffset.UTC).toString());
        next.setDistanceKm(null);
        String existingImageUrl = safeText(existing == null ? null : existing.getImageUrl());
        String existingSourceLink = safeText(existing == null ? null : existing.getSourceLink());
        String existingLocation = safeText(existing == null ? null : existing.getLocation());
        next.setImageUrl(StringUtils.hasText(existingImageUrl) ? existingImageUrl : parent.getImageUrl());
        next.setSourceLink(StringUtils.hasText(existingSourceLink) ? existingSourceLink : parent.getSourceLink());
        next.setLocation(StringUtils.hasText(existingLocation) ? existingLocation : parent.getLocation());
        next.setLocationCoordinates(cloneLocation(parent.getLocationCoordinates()));
        next.setLocationGeo(toGeoPoint(next.getLocationCoordinates()));
        next.setCapacityMin(parent.getCapacityMin());
        next.setCapacityMax(parent.getCapacityMax());
        next.setCapacityTotal(normalizeCount(parent.getCapacityTotal()));
        next.setAutoInviter(parent.getAutoInviter());
        next.setFrequency(parent.getFrequency());
        next.setTicketing(parent.getTicketing());
        next.setPricing(clonePricing(parent.getPricing()));
        next.setSlotsEnabled(false);
        next.setSlotTemplates(List.of());
        next.setParentEventId(parentSourceId);
        next.setSlotTemplateId(slotTemplateId);
        next.setGenerated(true);
        next.setEventType("slot");
        next.setAcceptedMembers(existing == null ? 0 : normalizeCount(existing.getAcceptedMembers()));
        next.setPendingMembers(existing == null ? 0 : normalizeCount(existing.getPendingMembers()));
        next.setTopics(normalizeStrings(parent.getTopics()));
        next.setSubEvents(materializeSubEventsForSlotOccurrence(parent.getSubEvents(), occurrenceStart, occurrenceEnd));
        next.setSubEventsDisplayMode(parent.getSubEventsDisplayMode());
        next.setRating(existing == null ? safeDouble(parent.getRating()) : safeDouble(existing.getRating()));
        next.setAffinity(existing == null ? safeDouble(parent.getAffinity()) : safeDouble(existing.getAffinity()));
        next.setBoost(existing == null ? safeDouble(parent.getBoost()) : safeDouble(existing.getBoost()));
        next.setCreatedDate(existing == null ? nowIso : safeText(existing.getCreatedDate()));
        next.setCreatedUser(existing == null ? creatorUserId : safeText(existing.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(creatorUserId);
        next.setAdmins(resolveAdminUserIds(parentSourceId, creatorUserId));
        next.normalizeLifecycleState();
        records.add(next);
    }

    private List<EventSlotOccurrenceDto> resolveUpcomingSlotOccurrences(ActivityEvent record) {
        if (!isSlotParentRecord(record)) {
            return List.of();
        }
        String parentSourceId = normalizeId(record.getSourceId());
        long nowMs = System.currentTimeMillis() - (60L * 60L * 1000L);
        return computePreferredEventRecords(allEventDocuments()).stream()
                .filter(this::isGeneratedSlotRecord)
                .filter(item -> parentSourceId.equals(normalizeId(item.getParentEventId())))
                .filter(item -> !Boolean.TRUE.equals(item.getIsTrashed()))
                .filter(item -> toSortableDate(item.getEndAtIso()) >= nowMs)
                .sorted(Comparator.comparing(item -> toSortableDate(item.getStartAtIso())))
                .map(item -> new EventSlotOccurrenceDto(
                        normalizeId(item.getSourceId()),
                        parentSourceId,
                        safeText(item.getSlotTemplateId()),
                        safeText(item.getTitle()),
                        safeText(item.getTimeframe()),
                        safeText(item.getStartAtIso()),
                        safeText(item.getEndAtIso()),
                        normalizeCount(item.getCapacityTotal()),
                        resolveAcceptedMemberUserIds(item).size(),
                        resolvePendingMemberUserIds(item).size()))
                .toList();
    }

    private String buildGeneratedSlotSourceId(String parentEventId, String slotTemplateId, LocalDateTime occurrenceStart) {
        return parentEventId + ":slot:" + slotTemplateId + ":" + occurrenceStart.toInstant(ZoneOffset.UTC);
    }

    private String buildGeneratedSlotTimeframe(LocalDateTime startAt, LocalDateTime endAt) {
        return startAt.toLocalDate() + " · "
                + String.format("%02d:%02d", startAt.getHour(), startAt.getMinute())
                + " - "
                + String.format("%02d:%02d", endAt.getHour(), endAt.getMinute());
    }

    private List<LocalDateTime> generateSlotOccurrenceStarts(
            String frequency,
            LocalDateTime templateStart,
            LocalDateTime horizonStart,
            LocalDateTime horizonEnd) {
        String normalizedFrequency = safeText(frequency).toLowerCase();
        if (!StringUtils.hasText(normalizedFrequency) || "one-time".equals(normalizedFrequency)) {
            return !templateStart.isBefore(horizonStart) && !templateStart.isAfter(horizonEnd)
                    ? List.of(templateStart)
                    : List.of();
        }

        List<LocalDateTime> starts = new ArrayList<>();
        LocalDate cursor = horizonStart.toLocalDate();
        LocalDate endDate = horizonEnd.toLocalDate();
        while (!cursor.isAfter(endDate)) {
            if (matchesSlotFrequency(cursor, templateStart, normalizedFrequency)) {
                LocalDateTime candidate = cursor.atTime(templateStart.toLocalTime());
                if (!candidate.isBefore(horizonStart) && !candidate.isAfter(horizonEnd)) {
                    starts.add(candidate);
                }
            }
            cursor = cursor.plusDays(1);
        }
        return starts;
    }

    private boolean matchesSlotFrequency(LocalDate date, LocalDateTime templateStart, String frequency) {
        if ("daily".equals(frequency)) {
            return true;
        }
        if ("weekly".equals(frequency)) {
            return date.getDayOfWeek() == templateStart.getDayOfWeek();
        }
        if ("bi-weekly".equals(frequency) || "biweekly".equals(frequency)) {
            if (date.getDayOfWeek() != templateStart.getDayOfWeek()) {
                return false;
            }
            long weeksBetween = ChronoUnit.WEEKS.between(templateStart.toLocalDate(), date);
            return weeksBetween >= 0L && weeksBetween % 2L == 0L;
        }
        if ("monthly".equals(frequency)) {
            int day = Math.min(templateStart.getDayOfMonth(), date.lengthOfMonth());
            return date.getDayOfMonth() == day;
        }
        if ("yearly".equals(frequency) || "annual".equals(frequency) || "annually".equals(frequency)) {
            if (date.getMonthValue() != templateStart.getMonthValue()) {
                return false;
            }
            int day = Math.min(templateStart.getDayOfMonth(), date.lengthOfMonth());
            return date.getDayOfMonth() == day;
        }
        return false;
    }

    private LocalDateTime toLocalDateTime(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return Instant.parse(value.trim()).atOffset(ZoneOffset.UTC).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value.trim());
            } catch (DateTimeParseException secondIgnored) {
                return null;
            }
        }
    }

    private LocalDate toLocalDate(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private LocalDate slotOverrideDateKey(String value) {
        return toLocalDate(value);
    }

    private LocalDate slotOccurrenceAnchorDateKey(LocalDateTime occurrenceStart, LocalDateTime templateStart, LocalDateTime parentStart) {
        if (occurrenceStart == null || templateStart == null || parentStart == null) {
            return null;
        }
        long templateOffsetMinutes = ChronoUnit.MINUTES.between(parentStart, templateStart);
        return occurrenceStart.minusMinutes(templateOffsetMinutes).toLocalDate();
    }

    private LocationCoordinatesDto cloneLocation(LocationCoordinatesDto value) {
        if (value == null || value.latitude() == null || value.longitude() == null) {
            return null;
        }
        return new LocationCoordinatesDto(value.latitude(), value.longitude());
    }

    private GeoJsonPoint cloneGeoPoint(GeoJsonPoint value) {
        if (value == null) {
            return null;
        }
        return new GeoJsonPoint(value.getX(), value.getY());
    }

    private LocationCoordinatesDto toLocationCoordinatesDto(Users.LocationCoordinatesRecord value) {
        if (value == null || value.latitude() == null || value.longitude() == null) {
            return null;
        }
        return new LocationCoordinatesDto(value.latitude(), value.longitude());
    }

    private GeoJsonPoint toGeoPoint(LocationCoordinatesDto value) {
        if (value == null || value.latitude() == null || value.longitude() == null) {
            return null;
        }
        return new GeoJsonPoint(value.longitude(), value.latitude());
    }

    private Document toGeoJsonDocument(GeoJsonPoint value) {
        if (value == null) {
            return null;
        }
        return new Document("type", "Point")
                .append("coordinates", List.of(value.getX(), value.getY()));
    }

    private ActivityEvent readGeoOrderedDocument(Document rawDocument) {
        if (rawDocument == null) {
            return null;
        }
        Document copy = new Document(rawDocument);
        copy.remove("distanceSortValue");
        return mongoTemplate.getConverter().read(ActivityEvent.class, copy);
    }

    private Integer resolveDistanceMetersExact(LocationCoordinatesDto viewerCoordinates, ActivityEvent record) {
        LocationCoordinatesDto eventCoordinates = record == null ? null : cloneLocation(record.getLocationCoordinates());
        if (viewerCoordinates == null || eventCoordinates == null) {
            Double fallbackDistanceKm = record == null ? null : record.getDistanceKm();
            if (fallbackDistanceKm == null || !Double.isFinite(fallbackDistanceKm)) {
                return null;
            }
            return Math.max(0, (int) Math.round(fallbackDistanceKm * 1000d));
        }
        return haversineDistanceMeters(viewerCoordinates, eventCoordinates);
    }

    private int haversineDistanceMeters(LocationCoordinatesDto from, LocationCoordinatesDto to) {
        double earthRadiusMeters = 6_371_000d;
        double latitudeDelta = Math.toRadians(to.latitude() - from.latitude());
        double longitudeDelta = Math.toRadians(to.longitude() - from.longitude());
        double fromLatitude = Math.toRadians(from.latitude());
        double toLatitude = Math.toRadians(to.latitude());
        double sinLatitude = Math.sin(latitudeDelta / 2d);
        double sinLongitude = Math.sin(longitudeDelta / 2d);
        double a = (sinLatitude * sinLatitude)
                + (Math.cos(fromLatitude) * Math.cos(toLatitude) * sinLongitude * sinLongitude);
        double c = 2d * Math.atan2(Math.sqrt(a), Math.sqrt(1d - a));
        return Math.max(0, (int) Math.round(earthRadiusMeters * c));
    }

    private long toSortableDate(String value) {
        if (!StringUtils.hasText(value)) {
            return 0L;
        }
        try {
            return Instant.parse(value.trim()).toEpochMilli();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value.trim()).toInstant(ZoneOffset.UTC).toEpochMilli();
            } catch (DateTimeParseException secondIgnored) {
                try {
                    return LocalDate.parse(value.trim()).atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli();
                } catch (DateTimeParseException thirdIgnored) {
                    return 0L;
                }
            }
        }
    }

    private long dateOnly(long timestamp) {
        if (timestamp <= 0L) {
            return 0L;
        }
        return Instant.ofEpochMilli(timestamp).atZone(ZoneOffset.UTC).toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli();
    }

    private String normalizeDateTime(String value, String fallback) {
        if (!StringUtils.hasText(value)) {
            return StringUtils.hasText(fallback) ? fallback : Instant.now().toString();
        }
        String normalized = value.trim();
        try {
            return Instant.parse(normalized).toString();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(normalized).toInstant(ZoneOffset.UTC).toString();
            } catch (DateTimeParseException secondIgnored) {
                return normalized;
            }
        }
    }

    private String normalizeEventFrequency(String value) {
        String normalized = safeText(value).toLowerCase();
        return switch (normalized) {
            case "daily" -> "Daily";
            case "weekly" -> "Weekly";
            case "bi-weekly", "biweekly" -> "Bi-weekly";
            case "monthly" -> "Monthly";
            case "yearly", "annual", "annually" -> "Yearly";
            default -> "One-time";
        };
    }

    private String resolveCreatorName(String requestedName, Users creator) {
        if (StringUtils.hasText(requestedName)) {
            return requestedName.trim();
        }
        return creator == null ? "" : safeText(creator.getName());
    }

    private String resolveCreatorInitials(String requestedInitials, Users creator, String requestedName) {
        if (StringUtils.hasText(requestedInitials)) {
            return requestedInitials.trim();
        }
        String name = resolveCreatorName(requestedName, creator);
        if (!StringUtils.hasText(name)) {
            return "U";
        }
        String[] words = name.trim().split("\\s+");
        if (words.length == 1) {
            return words[0].substring(0, Math.min(2, words[0].length())).toUpperCase();
        }
        return ("" + words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }

    private String resolveCreatorGender(String requestedGender, Users creator) {
        if (StringUtils.hasText(requestedGender)) {
            return requestedGender.trim();
        }
        return creator == null ? "man" : safeText(creator.getGender());
    }

    private String resolveCreatorCity(String requestedCity, Users creator) {
        if (StringUtils.hasText(requestedCity)) {
            return requestedCity.trim();
        }
        return creator == null ? "" : safeText(creator.getCity());
    }

    private String resolveVisibility(String requestedVisibility, ActivityEvent existing, String targetType) {
        if (StringUtils.hasText(requestedVisibility)) {
            return requestedVisibility.trim();
        }
        if (existing != null && StringUtils.hasText(existing.getVisibility())) {
            return existing.getVisibility();
        }
        return TYPE_HOSTING.equals(targetType) ? "Invitation only" : "Public";
    }

    private String resolveBlindMode(String requestedBlindMode, ActivityEvent existing) {
        if (StringUtils.hasText(requestedBlindMode)) {
            return requestedBlindMode.trim();
        }
        if (existing != null && StringUtils.hasText(existing.getBlindMode())) {
            return existing.getBlindMode();
        }
        return "Open Event";
    }

    private static <T> List<T> concat(List<T> first, List<T> second) {
        List<T> merged = new ArrayList<>(first.size() + second.size());
        merged.addAll(first);
        merged.addAll(second);
        return merged;
    }

    private record ViewerContext(
            String userId,
            Users user,
            LocationCoordinatesDto locationCoordinates,
            int affinity) {
    }

    private record StageActionTarget(
            String action,
            String nextStatus,
            String reason) {
    }

    private record TournamentResultSummary(List<String> winnerNames) {
        private static TournamentResultSummary empty() {
            return new TournamentResultSummary(List.of());
        }

        private String shortWinnerSummary() {
            List<String> names = winnerNames == null
                    ? List.of()
                    : winnerNames.stream()
                            .map(value -> value == null ? "" : value.trim())
                            .filter(StringUtils::hasText)
                            .distinct()
                            .toList();
            if (names.isEmpty()) {
                return "";
            }
            String prefix = names.size() == 1 ? "Winner: " : "Winners: ";
            if (names.size() <= 3) {
                return prefix + String.join(", ", names);
            }
            return prefix + String.join(", ", names.subList(0, 3)) + " and " + (names.size() - 3) + " more";
        }
    }

    private record EventProjection(
            ActivityEvent record,
            EventRecordDto item,
            int distanceMeters,
            double boostValue,
            long startAtMs,
            long endAtMs,
            long dayMs,
            long boostAffinityRank,
            int affinityGap,
            int ratingValue,
            boolean past) {
    }

    private record EventQueryContext(
            List<ActivityEvent> allEvents,
            List<ActivityEvent> mergedEvents,
            Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId,
            Set<String> trackedEventSourceIds,
            Map<String, Double> edgeWeightsByPairKey) {
    }
}
