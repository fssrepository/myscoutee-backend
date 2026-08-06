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
import java.util.function.Supplier;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventGroup;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDetailDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventInvitationContextDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutOptionalSubEventDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPricingSummaryRowDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSlotDayDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSlotDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSlotsQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSlotsResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventListPageDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsSlotPage;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsSlotDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.UserActivityCounterDeltaDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.UserChatCounterDeltaDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.UserEventCounterDeltaDto;
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
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventStageRuntimeStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingActionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingDemandRuleDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingTimeRuleDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventGroupsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventDetailMapper;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventMapper;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventSubEventsMapper;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventSubEventsMapper.SubEventResourceLookup;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventSubEventsMapper.SubEventStageRuntimeLookup;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventSubEventsMapper.SubEventStateLookups;
import com.raxim.myscoutee.profile.service.mapper.ActivitySubEventResourceMapper;
import com.raxim.myscoutee.profile.service.mapper.ActivitySubEventStageRuntimeMapper;
import com.raxim.myscoutee.profile.service.mapper.SubEventItemMapper;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class ActivitiesEventsService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Logger LOGGER = LoggerFactory.getLogger(ActivitiesEventsService.class);
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_SUB_EVENT = "subEvent";
    private static final String OWNER_TYPE_GROUP = "group";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";
    private static final String MEMBER_STATUS_PENDING = "pending";
    private static final String MEMBER_STATUS_INVITED = "I";
    private static final String MEMBER_STATUS_DELETED = "deleted";
    private static final String STAGE_STATUS_ACTIVE = "A";
    private static final String STAGE_STATUS_START_REVIEW = "RS";
    private static final String STAGE_STATUS_SCORE_REVIEW = "SR";
    private static final String STAGE_STATUS_FINALIZED = "F";
    private static final String STAGE_STATUS_SUSPENDED = "S";
    private static final String STAGE_STATUS_ERROR = "E";
    private static final String STAGE_ACTION_START = "start-tournament";
    private static final String STAGE_ACTION_CLOSE = "close-stage";
    private static final String STAGE_ACTION_FINALIZE = "finalize-stage";
    private static final String STAGE_ACTION_REOPEN = "reopen-scores";
    private static final String STAGE_ACTION_SUSPEND = "suspend-tournament";
    private static final String STAGE_ACTION_RESUME = "resume-tournament";
    private static final String RUNTIME_STATUS_DELETED = "D";
    private static final int MONGO_NO_QUERY_EXECUTION_PLANS_CODE = 291;
    private static final double AFFINITY_DISTANCE_BOOST_SCALE = 10_000d;
    private static final AtomicBoolean MISSING_EVENT_GEO_INDEX_WARNING_LOGGED = new AtomicBoolean(false);
    private static final ThreadLocal<EventQueryContext> ACTIVE_CONTEXT = new ThreadLocal<>();

    private final ActivityEventsRepository activityEventsRepository;
    private final ActivitySubEventGroupsRepository activitySubEventGroupsRepository;
    private final ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    private final ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final UsersRepository usersRepository;
    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final ActivitiesMembersService activitiesMembersService;
    private final ActivitiesResourcesService activitiesResourcesService;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final PaymentService paymentService;
    private final EventCheckoutBasketService eventCheckoutBasketService;
    private final ScheduledMessageTaskService scheduledMessageTaskService;
    private final AbsoluteAffinityService absoluteAffinityService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;
    private final MongoTemplate mongoTemplate;
    private final ChatAttachmentLifecycleService chatAttachmentLifecycleService;
    private final NotificationOutboxService notificationOutboxService;
    private final EventInviteNotificationService eventInviteNotificationService;
    private final ObjectProvider<EventScheduler> eventSchedulerProvider;
    private final ChatService chatService;
    private final ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    private final EventSlotReadModelService eventSlotReadModelService;
    private final AccessControlService accessControlService;
    private final UserActivityCountersService userActivityCountersService;
    private final ActivityEventDetailMapper activityEventDetailMapper;
    private final ActivityEventMapper activityEventMapper;
    private final ActivityEventSubEventsMapper activityEventSubEventsMapper;
    private final ActivitySubEventResourceMapper activitySubEventResourceMapper;
    private final ActivitySubEventStageRuntimeMapper activitySubEventStageRuntimeMapper;

    public ActivitiesEventsService(
            ActivityEventsRepository activityEventsRepository,
            ActivitySubEventGroupsRepository activitySubEventGroupsRepository,
            ActivitySubEventResourcesRepository activitySubEventResourcesRepository,
            ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository,
            ActivityMembersRepository activityMembersRepository,
            UsersRepository usersRepository,
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            HomeUserProfileService homeUserProfileService,
            ActivitiesMembersService activitiesMembersService,
            ActivitiesResourcesService activitiesResourcesService,
            EventParticipationTicketService eventParticipationTicketService,
            PaymentService paymentService,
            EventCheckoutBasketService eventCheckoutBasketService,
            ScheduledMessageTaskService scheduledMessageTaskService,
            AbsoluteAffinityService absoluteAffinityService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService,
            MongoTemplate mongoTemplate,
            ChatAttachmentLifecycleService chatAttachmentLifecycleService,
            NotificationOutboxService notificationOutboxService,
            EventInviteNotificationService eventInviteNotificationService,
            ObjectProvider<EventScheduler> eventSchedulerProvider,
            ChatService chatService,
            ActivitiesEventLeaderboardService activitiesEventLeaderboardService,
            EventSlotReadModelService eventSlotReadModelService,
            AccessControlService accessControlService,
            UserActivityCountersService userActivityCountersService,
            ActivityEventDetailMapper activityEventDetailMapper,
            ActivityEventMapper activityEventMapper,
            ActivityEventSubEventsMapper activityEventSubEventsMapper,
            ActivitySubEventResourceMapper activitySubEventResourceMapper,
            ActivitySubEventStageRuntimeMapper activitySubEventStageRuntimeMapper) {
        this.activityEventsRepository = activityEventsRepository;
        this.activitySubEventGroupsRepository = activitySubEventGroupsRepository;
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.activitySubEventStageRuntimeRepository = activitySubEventStageRuntimeRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.usersRepository = usersRepository;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.activitiesMembersService = activitiesMembersService;
        this.activitiesResourcesService = activitiesResourcesService;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.paymentService = paymentService;
        this.eventCheckoutBasketService = eventCheckoutBasketService;
        this.scheduledMessageTaskService = scheduledMessageTaskService;
        this.absoluteAffinityService = absoluteAffinityService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.mongoTemplate = mongoTemplate;
        this.chatAttachmentLifecycleService = chatAttachmentLifecycleService;
        this.notificationOutboxService = notificationOutboxService;
        this.eventInviteNotificationService = eventInviteNotificationService;
        this.eventSchedulerProvider = eventSchedulerProvider;
        this.chatService = chatService;
        this.activitiesEventLeaderboardService = activitiesEventLeaderboardService;
        this.eventSlotReadModelService = eventSlotReadModelService;
        this.accessControlService = accessControlService;
        this.userActivityCountersService = userActivityCountersService;
        this.activityEventDetailMapper = activityEventDetailMapper;
        this.activityEventMapper = activityEventMapper;
        this.activityEventSubEventsMapper = activityEventSubEventsMapper;
        this.activitySubEventResourceMapper = activitySubEventResourceMapper;
        this.activitySubEventStageRuntimeMapper = activitySubEventStageRuntimeMapper;
    }

    private EventQueryContext buildUserQueryContext(ViewerContext viewer) {
        return buildUserQueryContext(viewer, true);
    }

    private EventQueryContext buildUserQueryContext(ViewerContext viewer, boolean includeEdgeWeights) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return emptyEventQueryContext();
        }

        List<ActivityEvent> directOwnerRecords = queryDirectOwnerRecords(viewer.userId());
        Set<String> directSourceIds = directOwnerRecords.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        Map<String, String> trackedStatusesBySourceId = trackedEventMembershipStatuses(viewer.userId());
        Set<String> trackedSourceIds = visibleActivitySourceIds(trackedStatusesBySourceId);
        Set<String> membershipSourceIds = new LinkedHashSet<>(trackedSourceIds);
        membershipSourceIds.removeAll(directSourceIds);

        List<ActivityEvent> membershipRecords = loadEventDocumentsBySourceIds(membershipSourceIds);
        List<ActivityEvent> scopedEvents = new ArrayList<>(directOwnerRecords.size() + membershipRecords.size());
        scopedEvents.addAll(directOwnerRecords);
        scopedEvents.addAll(membershipRecords);

        return new EventQueryContext(
                scopedEvents,
                scopedEvents,
                buildMemberSnapshotMap(scopedEvents),
                trackedSourceIds,
                trackedStatusesBySourceId,
                pendingPaymentEventSourceIds(viewer.userId(), scopedEvents),
                includeEdgeWeights ? queryEventOwnerEdgeWeights(viewer, scopedEvents) : Map.of());
    }

    private EventQueryContext buildDirectOwnerQueryContext(ViewerContext viewer) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return emptyEventQueryContext();
        }
        List<ActivityEvent> directOwnerRecords = queryDirectOwnerRecords(viewer.userId());
        return new EventQueryContext(
                directOwnerRecords,
                directOwnerRecords,
                buildMemberSnapshotMap(directOwnerRecords),
                activitiesMembersService.findTrackedEventSourceIdsForUser(viewer.userId()),
                trackedEventMembershipStatuses(viewer.userId()),
                Set.of(),
                Map.of());
    }

    private EventQueryContext buildAttendingQueryContext(ViewerContext viewer) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return emptyEventQueryContext();
        }
        Map<String, String> trackedStatusesBySourceId = trackedEventMembershipStatuses(viewer.userId());
        Set<String> trackedSourceIds = visibleActivitySourceIds(trackedStatusesBySourceId);
        List<ActivityEvent> preferredRecords = computePreferredEventRecords(loadEventDocumentsBySourceIds(trackedSourceIds));
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId = buildMemberSnapshotMap(preferredRecords);
        EventQueryContext snapshotContext = new EventQueryContext(
                preferredRecords,
                preferredRecords,
                snapshotsBySourceId,
                trackedSourceIds,
                trackedStatusesBySourceId,
                pendingPaymentEventSourceIds(viewer.userId(), preferredRecords),
                Map.of());
        List<ActivityEvent> attendingRecords = withEventQueryContext(snapshotContext, () -> preferredRecords.stream()
                .filter(record -> !viewer.userId().equals(normalizeId(record.getCreatorUserId())))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .filter(record -> isTrackedAttendingMembershipStatus(trackedStatusesBySourceId.get(normalizeId(record.getSourceId()))))
                .map(record -> buildMembershipProjection(viewer.userId(), record))
                .toList());
        return new EventQueryContext(
                attendingRecords,
                attendingRecords,
                snapshotsBySourceId,
                trackedSourceIds,
                trackedStatusesBySourceId,
                snapshotContext.pendingPaymentEventSourceIds(),
                Map.of());
    }

    private EventQueryContext buildDirectOwnerListCardQueryContext(ViewerContext viewer) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return emptyEventQueryContext();
        }
        List<ActivityEvent> directOwnerRecords = queryDirectOwnerListCardRecords(viewer.userId());
        return new EventQueryContext(
                directOwnerRecords,
                directOwnerRecords,
                Map.of(),
                Set.of(),
                Map.of(),
                Set.of(),
                Map.of());
    }

    private EventQueryContext buildUserListCardQueryContext(ViewerContext viewer, boolean includeEdgeWeights) {
        return buildUserListCardQueryContext(viewer, includeEdgeWeights, false);
    }

    private EventQueryContext buildUserListCardQueryContext(
            ViewerContext viewer,
            boolean includeEdgeWeights,
            boolean includeDeletedMemberships) {
        return buildUserListCardQueryContext(
                viewer,
                includeEdgeWeights,
                includeDeletedMemberships,
                true);
    }

    private EventQueryContext buildUserListCardQueryContext(
            ViewerContext viewer,
            boolean includeEdgeWeights,
            boolean includeDeletedMemberships,
            boolean includePendingPayments) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return emptyEventQueryContext();
        }

        List<ActivityEvent> directOwnerRecords = queryDirectOwnerListCardRecords(viewer.userId());
        Set<String> directSourceIds = directOwnerRecords.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        Map<String, String> trackedStatusesBySourceId = trackedEventMembershipStatuses(viewer.userId(), includeDeletedMemberships);
        LinkedHashSet<String> membershipSourceIds = new LinkedHashSet<>(trackedStatusesBySourceId.keySet());
        membershipSourceIds.removeAll(directSourceIds);

        List<ActivityEvent> membershipRecords = loadEventListCardDocumentsBySourceIds(membershipSourceIds);
        List<ActivityEvent> scopedRecords = new ArrayList<>(directOwnerRecords.size() + membershipRecords.size());
        scopedRecords.addAll(directOwnerRecords);
        scopedRecords.addAll(membershipRecords);

        return new EventQueryContext(
                scopedRecords,
                scopedRecords,
                Map.of(),
                trackedStatusesBySourceId.keySet(),
                trackedStatusesBySourceId,
                includePendingPayments
                        ? pendingPaymentEventSourceIds(viewer.userId(), scopedRecords)
                        : Set.of(),
                includeEdgeWeights ? queryEventOwnerEdgeWeights(viewer, scopedRecords) : Map.of());
    }

    private EventQueryContext buildAttendingListCardQueryContext(ViewerContext viewer) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return emptyEventQueryContext();
        }
        Map<String, String> trackedStatusesBySourceId = trackedEventMembershipStatuses(viewer.userId());
        List<ActivityEvent> preferredRecords = computePreferredEventRecords(loadEventListCardDocumentsBySourceIds(trackedStatusesBySourceId.keySet()));
        EventQueryContext context = new EventQueryContext(
                preferredRecords,
                preferredRecords,
                Map.of(),
                trackedStatusesBySourceId.keySet(),
                trackedStatusesBySourceId,
                pendingPaymentEventSourceIds(viewer.userId(), preferredRecords),
                Map.of());
        List<ActivityEvent> attendingRecords = withEventQueryContext(context, () -> preferredRecords.stream()
                .filter(record -> !viewer.userId().equals(normalizeId(record.getCreatorUserId())))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .filter(record -> isTrackedAttendingMembershipStatus(trackedStatusesBySourceId.get(normalizeId(record.getSourceId()))))
                .map(record -> buildMembershipProjection(viewer.userId(), record))
                .toList());
        return new EventQueryContext(
                attendingRecords,
                attendingRecords,
                Map.of(),
                trackedStatusesBySourceId.keySet(),
                trackedStatusesBySourceId,
                context.pendingPaymentEventSourceIds(),
                Map.of());
    }

    private EventQueryContext emptyEventQueryContext() {
        return new EventQueryContext(List.of(), List.of(), Map.of(), Set.of(), Map.of(), Set.of(), Map.of());
    }

    private <T> T withEventQueryContext(EventQueryContext context, Supplier<T> action) {
        EventQueryContext previous = ACTIVE_CONTEXT.get();
        try {
            ACTIVE_CONTEXT.set(context);
            return action.get();
        } finally {
            if (previous == null) {
                ACTIVE_CONTEXT.remove();
            } else {
                ACTIVE_CONTEXT.set(previous);
            }
        }
    }

    private EventQueryContext buildExploreQueryContext(ViewerContext viewer) {
        return buildExploreQueryContext(viewer, true);
    }

    private EventQueryContext buildExploreQueryContext(ViewerContext viewer, boolean includeEdgeWeights) {
        return buildExploreQueryContext(viewer, includeEdgeWeights, queryCanonicalExploreRecords());
    }

    private EventQueryContext buildExplorePageQueryContext(ViewerContext viewer, boolean includeEdgeWeights) {
        return buildExploreQueryContext(viewer, includeEdgeWeights, queryCanonicalExplorePageRecords());
    }

    private EventQueryContext buildExploreQueryContext(
            ViewerContext viewer,
            boolean includeEdgeWeights,
            List<ActivityEvent> allEvents) {
        List<ActivityEvent> scopedEvents = allEvents == null ? List.of() : allEvents;
        LinkedHashSet<String> trackedSourceIds = new LinkedHashSet<>();
        Map<String, String> trackedStatusesBySourceId = Map.of();
        if (viewer != null && StringUtils.hasText(viewer.userId())) {
            trackedStatusesBySourceId = trackedEventMembershipStatuses(viewer.userId());
            trackedSourceIds.addAll(trackedStatusesBySourceId.keySet());
            queryDirectOwnerRecords(viewer.userId()).stream()
                    .map(ActivityEvent::getSourceId)
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .forEach(trackedSourceIds::add);
        }
        return new EventQueryContext(
                scopedEvents,
                scopedEvents,
                new LinkedHashMap<>(),
                trackedSourceIds,
                trackedStatusesBySourceId,
                Set.of(),
                includeEdgeWeights ? queryEventOwnerEdgeWeights(viewer, scopedEvents) : Map.of());
    }

    private Map<String, String> trackedEventMembershipStatuses(String userId) {
        return trackedEventMembershipStatuses(userId, false);
    }

    private Map<String, String> trackedEventMembershipStatuses(String userId, boolean includeDeleted) {
        Map<String, String> rawStatuses = activitiesMembersService.findTrackedEventMembershipStatusesForUser(userId, includeDeleted);
        if (rawStatuses == null || rawStatuses.isEmpty()) {
            return Map.of();
        }
        Map<String, String> statusesBySourceId = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : rawStatuses.entrySet()) {
            String sourceId = normalizeId(entry.getKey());
            String status = safeText(entry.getValue());
            if (StringUtils.hasText(sourceId)
                    && (MEMBER_STATUS_ACCEPTED.equals(status)
                    || MEMBER_STATUS_PENDING.equals(status)
                    || MEMBER_STATUS_INVITED.equals(status)
                    || (includeDeleted && MEMBER_STATUS_DELETED.equals(status)))) {
                statusesBySourceId.put(sourceId, status);
            }
        }
        return statusesBySourceId;
    }

    private Set<String> pendingPaymentEventSourceIds(String userId, Collection<ActivityEvent> records) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || records == null || records.isEmpty()) {
            return Set.of();
        }
        List<String> ticketedSourceIds = records.stream()
                .filter(Objects::nonNull)
                .filter(record -> Boolean.TRUE.equals(record.getTicketing()))
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (ticketedSourceIds.isEmpty()) {
            return Set.of();
        }
        Set<String> pendingSourceIds =
                paymentService.findPendingEventJoinSourceIds(normalizedUserId, ticketedSourceIds);
        return pendingSourceIds == null || pendingSourceIds.isEmpty()
                ? Set.of()
                : Set.copyOf(pendingSourceIds);
    }

    private Set<String> visibleActivitySourceIds(Map<String, String> statusesBySourceId) {
        Set<String> sourceIds = statusesBySourceId == null
                ? new LinkedHashSet<>()
                : new LinkedHashSet<>(statusesBySourceId.keySet());
        if (sourceIds.isEmpty()) {
            return sourceIds;
        }
        for (ActivityEvent record : loadEventDocumentsBySourceIds(sourceIds)) {
            if (isGeneratedSlotRecord(record)) {
                String parentEventId = normalizeId(record.getParentEventId());
                if (StringUtils.hasText(parentEventId)) {
                    sourceIds.add(parentEventId);
                    sourceIds.remove(normalizeId(record.getSourceId()));
                }
            }
        }
        return sourceIds;
    }

    private boolean isTrackedAttendingMembershipStatus(String status) {
        String normalized = safeText(status);
        return MEMBER_STATUS_ACCEPTED.equals(normalized) || MEMBER_STATUS_PENDING.equals(normalized);
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
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            String sourceId = normalizeId(record == null ? null : record.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                preferredBySourceId.putIfAbsent(sourceId, record);
            }
        }
        if (preferredBySourceId.isEmpty()) {
            return new LinkedHashMap<>();
        }
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshots =
                activitiesMembersService.buildBatchEventSnapshots(preferredBySourceId);
        return snapshots == null ? new LinkedHashMap<>() : new LinkedHashMap<>(snapshots);
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

    public List<EventDto> queryItemsByUser(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        try {
            ACTIVE_CONTEXT.set(buildUserQueryContext(viewer));
            return queryUserRecords(viewer).stream()
                    .map(record -> toEventDto(record, viewer))
                    .filter(Objects::nonNull)
                    .sorted(listItemComparator())
                    .toList();
        } finally {
            ACTIVE_CONTEXT.remove();
        }
    }

    public EventsExplorePageDto queryItemsByUserPage(String requestedUserId, Integer requestedLimit, String cursor) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }

        return withEventQueryContext(buildUserListCardQueryContext(viewer, false), () -> {
            int limit = normalizePageLimit(requestedLimit, 12);
            List<ActivityEvent> sorted = sortEventRecordsByStart(queryUserRecords(viewer));
            int startIndex = resolveRecordCursorStartIndex(sorted, cursor);
            int endIndex = Math.min(sorted.size(), startIndex + limit);
            List<ActivityEvent> pageRecords = sorted.subList(startIndex, endIndex);
            String nextCursor = endIndex < sorted.size() && !pageRecords.isEmpty()
                    ? serializeCursorId(pageRecords.get(pageRecords.size() - 1).getSourceId())
                    : null;

            return new EventsExplorePageDto(toHydratedEventDtos(viewer, pageRecords), sorted.size(), nextCursor);
        });
    }

    public List<EventDto> queryInvitations(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return withEventQueryContext(buildDirectOwnerQueryContext(viewer), () ->
                queryDirectFilteredRecords(viewer, "invitations", "all").stream()
                        .map(record -> toEventDto(record, viewer))
                        .filter(Objects::nonNull)
                        .sorted(listItemComparator())
                        .toList());
    }

    public EventsExplorePageDto queryInvitationsPage(String requestedUserId, Integer requestedLimit, String cursor) {
        return queryDirectFilterPage(requestedUserId, "invitations", "all", requestedLimit, cursor);
    }

    public List<EventDto> queryAttending(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return withEventQueryContext(buildAttendingQueryContext(viewer), () ->
                allEventDocuments(viewer).stream()
                        .map(record -> toEventDto(record, viewer))
                        .filter(Objects::nonNull)
                        .sorted(listItemComparator())
                        .toList());
    }

    public EventsExplorePageDto queryAttendingPage(String requestedUserId, Integer requestedLimit, String cursor) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }

        return withEventQueryContext(buildAttendingListCardQueryContext(viewer), () -> {
            int limit = normalizePageLimit(requestedLimit, 12);
            List<ActivityEvent> sorted = sortEventRecordsByStart(allEventDocuments(viewer).stream()
                    .filter(Objects::nonNull)
                    .toList());
            int startIndex = resolveRecordCursorStartIndex(sorted, cursor);
            int endIndex = Math.min(sorted.size(), startIndex + limit);
            List<ActivityEvent> pageRecords = sorted.subList(startIndex, endIndex);
            String nextCursor = endIndex < sorted.size() && !pageRecords.isEmpty()
                    ? serializeCursorId(pageRecords.get(pageRecords.size() - 1).getSourceId())
                    : null;
            return new EventsExplorePageDto(toHydratedEventDtos(viewer, pageRecords), sorted.size(), nextCursor);
        });
    }

    public List<EventDto> queryHosting(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return withEventQueryContext(buildDirectOwnerQueryContext(viewer), () ->
                queryDirectFilteredRecords(viewer, "my-events", "all").stream()
                        .map(record -> toEventDto(record, viewer))
                        .filter(Objects::nonNull)
                        .sorted(listItemComparator())
                        .toList());
    }

    public EventsExplorePageDto queryHostingPage(String requestedUserId, Integer requestedLimit, String cursor) {
        return queryDirectFilterPage(requestedUserId, "my-events", "all", requestedLimit, cursor);
    }

    public List<EventDto> queryTrash(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        EventsFilterRequestDto request = new EventsFilterRequestDto(
                requestedUserId, "trash", "all", null, null, null, null, null, null, null, null);
        return withEventQueryContext(buildUserListCardQueryContext(viewer, false, true, false), () ->
                queryFilteredRecords(viewer, request).stream()
                        .map(record -> toEventDto(record, viewer))
                        .filter(Objects::nonNull)
                        .sorted(listItemComparator())
                        .toList());
    }

    public EventsExplorePageDto queryTrashPage(String requestedUserId, Integer requestedLimit, String cursor) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }
        EventsFilterRequestDto request = new EventsFilterRequestDto(
                requestedUserId, "trash", "all", null, null, null, requestedLimit, cursor, null, null, null);
        return withEventQueryContext(buildUserListCardQueryContext(viewer, false, true, false), () -> {
            int limit = normalizePageLimit(requestedLimit, 12);
            List<ActivityEvent> sorted = sortEventRecordsByStart(queryFilteredRecords(viewer, request));
            int startIndex = resolveRecordCursorStartIndex(sorted, cursor);
            int endIndex = Math.min(sorted.size(), startIndex + limit);
            List<ActivityEvent> pageRecords = sorted.subList(startIndex, endIndex);
            String nextCursor = endIndex < sorted.size() && !pageRecords.isEmpty()
                    ? serializeCursorId(pageRecords.get(pageRecords.size() - 1).getSourceId())
                    : null;
            return new EventsExplorePageDto(toHydratedEventDtos(viewer, pageRecords), sorted.size(), nextCursor);
        });
    }

    private EventsExplorePageDto queryDirectFilterPage(
            String requestedUserId,
            String filter,
            String hostingPublicationFilter,
            Integer requestedLimit,
            String cursor) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }
        EventsFilterRequestDto request = new EventsFilterRequestDto(
                viewer.userId(),
                filter,
                hostingPublicationFilter,
                "recent",
                "date",
                "day",
                requestedLimit,
                cursor,
                null,
                null,
                null);
        return withEventQueryContext(buildDirectOwnerListCardQueryContext(viewer), () ->
                pageDirectFilteredRecords(viewer, filter, hostingPublicationFilter, request));
    }

    public EventListPageDto queryActivitiesEventListPage(EventsFilterRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        if (viewer == null) {
            return new EventListPageDto(List.of(), 0, null);
        }
        String filter = normalizeActivityListFilter(request == null ? null : request.filter());
        String hostingPublicationFilter = normalizeHostingPublicationFilter(request == null ? null : request.hostingPublicationFilter());
        if ("trash".equals(filter)) {
            EventQueryContext context = buildUserListCardQueryContext(
                    viewer,
                    needsActivitiesAffinityEdges(request),
                    true,
                    false);
            return withEventQueryContext(context, () ->
                    pageEventListRecords(viewer, queryFilteredRecords(viewer, request), request));
        }
        if (usesDirectOwnerListFilter(filter)) {
            return withEventQueryContext(buildDirectOwnerListCardQueryContext(viewer), () ->
                    pageEventListRecords(viewer, queryDirectFilteredRecords(viewer, filter, hostingPublicationFilter), request));
        }

        EventQueryContext context = buildUserListCardQueryContext(viewer, needsActivitiesAffinityEdges(request));
        return withEventQueryContext(context, () ->
                pageEventListRecords(viewer, queryFilteredRecords(viewer, request), request));
    }

    public EventDetailDto loadEventDetailById(String requestedUserId, String eventId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        String sourceId = normalizeId(eventId);
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return null;
        }
        ActivityEvent preferred = findPreferredEventDetailRecord(sourceId);
        return preferred == null
                ? null
                : activityEventDetailMapper.toDto(preferred, new ActivityEventDetailMapper.MappingContext(
                        isViewerAdmin(preferred, viewer.userId()) ? "hosting" : "events"));
    }

    public EventInvitationContextDto loadInvitationContext(String requestedUserId, String eventId) {
        EventDetailDto record = loadEventDetailById(requestedUserId, eventId);
        if (record == null) {
            return null;
        }
        return new EventInvitationContextDto(
                record,
                activitiesMembersService.queryMembers(OWNER_TYPE_EVENT, record.id(), false),
                eventCheckoutBasketService.loadBasketByEvent(requestedUserId, record.id()));
    }

    public EventCheckoutSlotsResultDto loadCheckoutSlots(EventCheckoutSlotsQueryDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = normalizeId(request == null ? null : request.eventId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return null;
        }
        ActivityEvent selected = preferredSubEventsDefinitionRecord(loadEventDocumentsBySourceIds(List.of(sourceId)), viewer.userId());
        if (selected == null) {
            return null;
        }
        String parentEventId = isGeneratedSlotRecord(selected)
                ? firstNonBlank(selected.getParentEventId(), selected.getSourceId())
                : selected.getSourceId();
        if (!StringUtils.hasText(parentEventId)) {
            return null;
        }
        eventSlotReadModelService.refreshForChangedSourceIds(List.of(parentEventId));
        ActivityEvent parent = preferredSubEventsDefinitionRecord(loadEventDocumentsBySourceIds(List.of(parentEventId)), viewer.userId());
        if (parent == null) {
            parent = selected;
        }
        ActivityEvent checkoutParent = parent;
        EventCheckoutBasketDto checkoutBasket = eventCheckoutBasketService.loadBasketByEvent(viewer.userId(), parentEventId);
        Map<String, Integer> slotReservations = eventCheckoutBasketService.activeSlotReservationCountsByEvent(parentEventId);
        Map<String, Integer> optionalReservations = eventCheckoutBasketService.activeOptionalReservationCountsByEvent(parentEventId);
        boolean basketView = "basket".equalsIgnoreCase(safeText(request == null ? null : request.view()));

        List<EventSlotOccurrenceDto> allSlots = cloneSlotOccurrences(checkoutParent.getUpcomingSlots()).stream()
                .filter(Objects::nonNull)
                .filter(slot -> checkoutSlotMatchesOrder(slot, request))
                .filter(slot -> basketView || checkoutSlotOverlapsRange(slot, request))
                .sorted((left, right) -> checkoutSlotDirection(request)
                        * Long.compare(toSortableDate(left.startAtIso()), toSortableDate(right.startAtIso())))
                .toList();
        Set<String> bookedSlotIds = acceptedParticipantOwnerIds(
                OWNER_TYPE_EVENT,
                allSlots.stream()
                        .map(EventSlotOccurrenceDto::id)
                        .toList(),
                viewer.userId());
        List<EventCheckoutSlotDto> allSlotDtos = allSlots.stream()
                .map(slot -> toCheckoutSlotDto(
                        checkoutParent,
                        slot,
                        slotReservations.getOrDefault(normalizeId(slot.id()), 0),
                        bookedSlotIds.contains(normalizeId(slot.id()))))
                .toList();
        List<EventCheckoutSlotDayDto> days = checkoutSlotDayDtos(allSlotDtos);
        Map<String, EventCheckoutSlotDto> allSlotDtosById = new LinkedHashMap<>();
        for (EventCheckoutSlotDto slotDto : allSlotDtos) {
            String slotId = normalizeId(slotDto == null ? null : slotDto.id());
            if (StringUtils.hasText(slotId)) {
                allSlotDtosById.put(slotId, slotDto);
            }
        }
        List<EventCheckoutSlotDto> basketSlotDtos = checkoutBasket == null
                ? List.of()
                : (checkoutBasket.items() == null ? List.<EventCheckoutBasketItemDto>of() : checkoutBasket.items()).stream()
                        .filter(Objects::nonNull)
                        .filter(item -> "event".equals(safeText(item.kind())))
                        .filter(item -> StringUtils.hasText(normalizeId(item.slotSourceId())))
                        .map(item -> isSucceededCheckoutResult(item.resultState())
                                ? checkoutSlotDtoFromBasketItem(checkoutParent, item)
                                : allSlotDtosById.getOrDefault(
                                        normalizeId(item.slotSourceId()),
                                        checkoutSlotDtoFromBasketItem(checkoutParent, item)))
                        .filter(Objects::nonNull)
                        .sorted((left, right) -> checkoutSlotDirection(request)
                                * Long.compare(toSortableDate(left.startAtIso()), toSortableDate(right.startAtIso())))
                        .toList();
        List<EventCheckoutSlotDto> pageSource = basketView ? basketSlotDtos : allSlotDtos;
        int offset = checkoutCursorOffset(request == null ? null : request.cursor());
        int limit = Math.max(1, Math.min(60, request == null || request.limit() == null ? 15 : request.limit()));
        int from = Math.min(offset, pageSource.size());
        int to = Math.min(pageSource.size(), from + limit);
        String nextCursor = to < pageSource.size() ? Integer.toString(to) : null;
        String currency = pageSource.stream()
                .map(EventCheckoutSlotDto::currency)
                .filter(StringUtils::hasText)
                .findFirst()
                .or(() -> allSlotDtos.stream()
                        .map(EventCheckoutSlotDto::currency)
                        .filter(StringUtils::hasText)
                        .findFirst())
                .orElseGet(() -> checkoutPricingCurrency(checkoutParent.getPricing()));
        return new EventCheckoutSlotsResultDto(
                parentEventId,
                checkoutParent.getMode(),
                days,
                pageSource.subList(from, to),
                pageSource.size(),
                nextCursor,
                currency,
                checkoutOptionalSubEventDtos(checkoutParent, optionalReservations, currency),
                checkoutBasket);
    }

    private EventCheckoutSlotDto toCheckoutSlotDto(
            ActivityEvent parent,
            EventSlotOccurrenceDto slot,
            int reservedCount,
            boolean bookedByViewer) {
        CheckoutSlotPricing pricing = resolveCheckoutSlotPricing(parent == null ? null : parent.getPricing(), parent, slot);
        int capacityTotal = normalizeCount(slot == null ? null : slot.capacityTotal());
        int acceptedMembers = normalizeCount(slot == null ? null : slot.acceptedMembers());
        int pendingMembers = normalizeCount(slot == null ? null : slot.pendingMembers());
        int activeReservations = Math.max(0, reservedCount);
        int availableSlots = Math.max(0, capacityTotal - acceptedMembers - pendingMembers - activeReservations);
        return new EventCheckoutSlotDto(
                slot == null ? "" : slot.id(),
                slot == null ? "" : slot.parentEventId(),
                slot == null ? "" : slot.id(),
                slot == null ? null : slot.slotTemplateId(),
                slot == null ? null : slot.title(),
                slot == null ? null : slot.timeframe(),
                slot == null ? null : slot.startAtIso(),
                slot == null ? null : slot.endAtIso(),
                capacityTotal,
                acceptedMembers,
                pendingMembers,
                availableSlots,
                bookedByViewer,
                pricing.amount(),
                pricing.currency(),
                pricing.rows());
    }

    private EventCheckoutSlotDto checkoutSlotDtoFromBasketItem(ActivityEvent parent, EventCheckoutBasketItemDto item) {
        String slotSourceId = normalizeId(item == null ? null : item.slotSourceId());
        if (!StringUtils.hasText(slotSourceId)) {
            return null;
        }
        String selectedDateKey = safeText(item.selectedDateKey());
        int quantity = Math.max(1, item.quantity() == null ? 1 : item.quantity());
        return new EventCheckoutSlotDto(
                slotSourceId,
                parent == null ? "" : parent.getSourceId(),
                slotSourceId,
                item.slotTemplateId(),
                parent == null ? null : parent.getTitle(),
                firstNonBlank(item.detail(), parent == null ? null : parent.getTimeframe(), "Selected slot"),
                StringUtils.hasText(selectedDateKey) ? selectedDateKey + "T00:00:00.000Z" : parent == null ? null : parent.getStartAtIso(),
                StringUtils.hasText(selectedDateKey) ? selectedDateKey + "T23:59:59.000Z" : parent == null ? null : parent.getEndAtIso(),
                quantity,
                0,
                0,
                quantity,
                isSucceededCheckoutResult(item == null ? null : item.resultState()),
                Math.max(0d, item.amount() == null ? 0d : item.amount()),
                firstNonBlank(item.currency(), parent == null ? null : checkoutPricingCurrency(parent.getPricing()), "USD"),
                item.pricingSummaryRows() == null ? List.of() : item.pricingSummaryRows());
    }

    private boolean isSucceededCheckoutResult(String resultState) {
        return "succeeded".equals(safeText(resultState));
    }

    private List<EventCheckoutOptionalSubEventDto> checkoutOptionalSubEventDtos(
            ActivityEvent parent,
            Map<String, Integer> reservations,
            String fallbackCurrency) {
        if (parent == null || !Boolean.TRUE.equals(parent.getSubEventsEnabled())) {
            return List.of();
        }
        Map<String, SubEventDefinitionDto> definitionsById = new LinkedHashMap<>();
        addCheckoutOptionalDefinitions(definitionsById, parent.getSubEventDefinitions());
        for (EventSlotTemplateDto template : parent.getSlotTemplates() == null ? List.<EventSlotTemplateDto>of() : parent.getSlotTemplates()) {
            addCheckoutOptionalDefinitions(definitionsById, template == null ? null : template.subEventDefinitions());
        }
        return definitionsById.values().stream()
                .filter(Objects::nonNull)
                .filter(item -> Boolean.TRUE.equals(item.optional()))
                .map(item -> toCheckoutOptionalSubEventDto(
                        item,
                        reservations == null ? 0 : reservations.getOrDefault(normalizeId(item.id()), 0),
                        fallbackCurrency))
                .toList();
    }

    private void addCheckoutOptionalDefinitions(
            Map<String, SubEventDefinitionDto> target,
            List<SubEventDefinitionDto> definitions) {
        if (target == null) {
            return;
        }
        int index = 0;
        for (SubEventDefinitionDto definition : definitions == null ? List.<SubEventDefinitionDto>of() : definitions) {
            String id = firstNonBlank(definition == null ? null : definition.id(), fallbackSubEventId(index));
            index += 1;
            if (definition == null || !StringUtils.hasText(id) || target.containsKey(id)) {
                continue;
            }
            target.put(id, definition);
        }
    }

    private EventCheckoutOptionalSubEventDto toCheckoutOptionalSubEventDto(
            SubEventDefinitionDto definition,
            int reservedCount,
            String fallbackCurrency) {
        CheckoutSlotPricing pricing = resolveCheckoutOptionalSubEventPricing(definition, fallbackCurrency);
        int capacityTotal = normalizeCount(definition == null ? null : definition.capacityMax());
        int normalizedReservedCount = Math.max(0, reservedCount);
        return new EventCheckoutOptionalSubEventDto(
                definition == null ? "" : firstNonBlank(definition.id(), "optional"),
                definition == null ? "Optional sub event" : firstNonBlank(definition.name(), definition.id(), "Optional sub event"),
                definition == null ? null : definition.description(),
                null,
                null,
                capacityTotal,
                normalizedReservedCount,
                Math.max(0, capacityTotal - normalizedReservedCount),
                pricing.amount(),
                pricing.currency(),
                pricing.rows());
    }

    private List<EventCheckoutSlotDayDto> checkoutSlotDayDtos(List<EventCheckoutSlotDto> slots) {
        Map<String, CheckoutSlotDayAccumulator> grouped = new LinkedHashMap<>();
        for (EventCheckoutSlotDto slot : slots == null ? List.<EventCheckoutSlotDto>of() : slots) {
            String dateKey = checkoutSlotDateKey(slot == null ? null : slot.startAtIso());
            if (!StringUtils.hasText(dateKey)) {
                continue;
            }
            CheckoutSlotDayAccumulator accumulator = grouped.computeIfAbsent(
                    dateKey,
                    key -> new CheckoutSlotDayAccumulator(slot == null ? "USD" : slot.currency()));
            accumulator.add(slot);
        }
        return grouped.entrySet().stream()
                .map(entry -> entry.getValue().toDto(entry.getKey()))
                .toList();
    }

    private CheckoutSlotPricing resolveCheckoutSlotPricing(
            PricingConfigDto pricing,
            ActivityEvent parent,
            EventSlotOccurrenceDto slot) {
        String currency = checkoutPricingCurrency(pricing);
        if (pricing == null || Boolean.FALSE.equals(pricing.enabled())) {
            return new CheckoutSlotPricing(0d, currency, List.of());
        }
        String slotTemplateId = safeText(slot == null ? null : slot.slotTemplateId());
        double previewBase = safeDouble(pricing.basePrice());
        if (Boolean.TRUE.equals(pricing.slotPricingEnabled()) && StringUtils.hasText(slotTemplateId)) {
            previewBase = (pricing.slotOverrides() == null ? List.<com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingSlotOverrideDto>of() : pricing.slotOverrides()).stream()
                    .filter(override -> slotTemplateId.equals(safeText(override == null ? null : override.slotId())))
                    .map(override -> override == null ? null : override.price())
                    .filter(Objects::nonNull)
                    .findFirst()
                    .map(this::safeDouble)
                    .orElse(previewBase);
        }
        List<EventCheckoutPricingSummaryRowDto> rows = new ArrayList<>();
        rows.add(new EventCheckoutPricingSummaryRowDto(
                StringUtils.hasText(slotTemplateId) ? "base:" + slotTemplateId : "base",
                StringUtils.hasText(slotTemplateId) ? "Slot base price" : "Base price",
                null,
                roundMoney(previewBase),
                currency,
                1));

        double nextPrice = previewBase;
        int capacityTotal = normalizeCount(slot == null ? null : slot.capacityTotal());
        int acceptedMembers = normalizeCount(slot == null ? null : slot.acceptedMembers());
        int capacityFilledPercent = capacityTotal > 0
                ? (int) Math.round((acceptedMembers / (double) capacityTotal) * 100d)
                : 0;
        double hoursUntilStart = resolveCheckoutHoursUntilStart(slot == null ? null : slot.startAtIso());

        if (checkoutPricingModeMatches(pricing.mode(), "demand-based", "hybrid") && Boolean.TRUE.equals(pricing.demandRulesEnabled())) {
            for (PricingDemandRuleDto rule : pricing.demandRules() == null ? List.<PricingDemandRuleDto>of() : pricing.demandRules()) {
                if (!matchesCheckoutDemandRule(rule, capacityFilledPercent, slotTemplateId)) {
                    continue;
                }
                double previousPrice = nextPrice;
                nextPrice = applyCheckoutPricingAction(nextPrice, rule.action());
                rows.add(new EventCheckoutPricingSummaryRowDto(
                        "demand:" + firstNonBlank(rule.id(), UUID.randomUUID().toString()),
                        "Demand pricing",
                        describeCheckoutPricingAction(rule.action()),
                        roundMoney(nextPrice - previousPrice),
                        currency,
                        1));
            }
        }
        if (checkoutPricingModeMatches(pricing.mode(), "time-based", "hybrid") && Boolean.TRUE.equals(pricing.timeRulesEnabled())) {
            for (PricingTimeRuleDto rule : pricing.timeRules() == null ? List.<PricingTimeRuleDto>of() : pricing.timeRules()) {
                if (!matchesCheckoutTimeRule(rule, hoursUntilStart, slotTemplateId, slot == null ? null : slot.startAtIso())) {
                    continue;
                }
                double previousPrice = nextPrice;
                nextPrice = applyCheckoutPricingAction(nextPrice, rule.action());
                rows.add(new EventCheckoutPricingSummaryRowDto(
                        "time:" + firstNonBlank(rule.id(), UUID.randomUUID().toString()),
                        "Time pricing",
                        describeCheckoutPricingAction(rule.action()),
                        roundMoney(nextPrice - previousPrice),
                        currency,
                        1));
            }
        }

        if (pricing.minPrice() != null) {
            double previousPrice = nextPrice;
            nextPrice = Math.max(safeDouble(pricing.minPrice()), nextPrice);
            if (nextPrice != previousPrice) {
                rows.add(new EventCheckoutPricingSummaryRowDto("min-price", "Minimum price", null, roundMoney(nextPrice - previousPrice), currency, 1));
            }
        }
        if (pricing.maxPrice() != null) {
            double previousPrice = nextPrice;
            nextPrice = Math.min(safeDouble(pricing.maxPrice()), nextPrice);
            if (nextPrice != previousPrice) {
                rows.add(new EventCheckoutPricingSummaryRowDto("max-price", "Maximum price", null, roundMoney(nextPrice - previousPrice), currency, 1));
            }
        }
        return new CheckoutSlotPricing(roundMoney(nextPrice), currency, rows);
    }

    private CheckoutSlotPricing resolveCheckoutOptionalSubEventPricing(
            SubEventDefinitionDto definition,
            String fallbackCurrency) {
        PricingConfigDto pricing = definition == null ? null : definition.pricing();
        String currency = pricing == null || !StringUtils.hasText(safeText(pricing.currency()))
                ? firstNonBlank(fallbackCurrency, "USD")
                : checkoutPricingCurrency(pricing);
        if (pricing == null || Boolean.FALSE.equals(pricing.enabled())) {
            return new CheckoutSlotPricing(0d, currency, List.of());
        }
        double amount = roundMoney(Math.max(0d, safeDouble(pricing.basePrice())));
        return new CheckoutSlotPricing(
                amount,
                currency,
                List.of(new EventCheckoutPricingSummaryRowDto(
                        "subevent:" + firstNonBlank(definition.id(), "optional") + ":base",
                        firstNonBlank(definition.name(), "Optional sub event"),
                        null,
                        amount,
                        currency,
                        1)));
    }

    private String checkoutPricingCurrency(PricingConfigDto pricing) {
        String currency = safeText(pricing == null ? null : pricing.currency()).toUpperCase(Locale.ROOT);
        return StringUtils.hasText(currency) ? currency : "USD";
    }

    private boolean checkoutPricingModeMatches(String value, String... expected) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(normalized)) {
            normalized = "fixed";
        }
        for (String candidate : expected == null ? new String[0] : expected) {
            if (normalized.equals(safeText(candidate).toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private boolean matchesCheckoutDemandRule(PricingDemandRuleDto rule, int capacityFilledPercent, String slotTemplateId) {
        if (rule == null) {
            return false;
        }
        if ("selected_slots".equals(safeText(rule.appliesTo())) && !checkoutRuleIncludesSlot(rule.slotIds(), slotTemplateId)) {
            return false;
        }
        int threshold = normalizeCount(rule.capacityFilledPercent());
        return "lte".equals(safeText(rule.operator()))
                ? capacityFilledPercent <= threshold
                : capacityFilledPercent >= threshold;
    }

    private boolean matchesCheckoutTimeRule(PricingTimeRuleDto rule, double hoursUntilStart, String slotTemplateId, String startAtIso) {
        if (rule == null) {
            return false;
        }
        if ("selected_slots".equals(safeText(rule.appliesTo())) && !checkoutRuleIncludesSlot(rule.slotIds(), slotTemplateId)) {
            return false;
        }
        String trigger = safeText(rule.trigger());
        if ("specific_date".equals(trigger)) {
            String start = safeText(rule.specificDateStart());
            String end = safeText(rule.specificDateEnd());
            String comparisonDate = safeText(startAtIso).length() >= 10 ? safeText(startAtIso).substring(0, 10) : "";
            return StringUtils.hasText(start)
                    && StringUtils.hasText(end)
                    && StringUtils.hasText(comparisonDate)
                    && comparisonDate.compareTo(start) >= 0
                    && comparisonDate.compareTo(end) <= 0;
        }
        double value = Math.max(0d, safeDouble(rule.offsetValue()));
        if ("hours_before_start".equals(trigger)) {
            return hoursUntilStart <= value;
        }
        return hoursUntilStart <= value * 24d;
    }

    private boolean checkoutRuleIncludesSlot(List<String> slotIds, String slotTemplateId) {
        String normalizedSlotTemplateId = safeText(slotTemplateId);
        return StringUtils.hasText(normalizedSlotTemplateId)
                && (slotIds == null ? List.<String>of() : slotIds).stream()
                        .anyMatch(item -> normalizedSlotTemplateId.equals(safeText(item)));
    }

    private double applyCheckoutPricingAction(double currentPrice, PricingActionDto action) {
        if (action == null) {
            return Math.max(0d, currentPrice);
        }
        double value = safeDouble(action.value());
        return switch (safeText(action.kind())) {
            case "set_exact_price" -> Math.max(0d, value);
            case "increase_amount" -> Math.max(0d, currentPrice + value);
            case "decrease_amount" -> Math.max(0d, currentPrice - value);
            case "decrease_percent" -> Math.max(0d, currentPrice * (1d - (value / 100d)));
            default -> Math.max(0d, currentPrice * (1d + (value / 100d)));
        };
    }

    private String describeCheckoutPricingAction(PricingActionDto action) {
        double value = action == null ? 0d : safeDouble(action.value());
        return switch (safeText(action == null ? null : action.kind())) {
            case "set_exact_price" -> "Set to " + roundMoney(value);
            case "increase_amount" -> "+" + roundMoney(value);
            case "decrease_amount" -> "-" + roundMoney(value);
            case "decrease_percent" -> "-" + roundMoney(value) + "%";
            default -> "+" + roundMoney(value) + "%";
        };
    }

    private double roundMoney(double value) {
        return Math.round(value * 100d) / 100d;
    }

    private double resolveCheckoutHoursUntilStart(String startAtIso) {
        long startMs = toSortableDate(startAtIso);
        if (startMs <= 0L) {
            return 0d;
        }
        return Math.max(0d, Math.round((startMs - System.currentTimeMillis()) / (60d * 60d * 1000d)));
    }

    private boolean checkoutSlotMatchesOrder(EventSlotOccurrenceDto slot, EventCheckoutSlotsQueryDto query) {
        long end = toSortableDate(slot == null ? null : slot.endAtIso());
        if (end <= 0L) {
            end = toSortableDate(slot == null ? null : slot.startAtIso());
        }
        if (end <= 0L) {
            return false;
        }
        boolean past = end <= System.currentTimeMillis();
        return "past".equalsIgnoreCase(safeText(query == null ? null : query.order())) ? past : !past;
    }

    private boolean checkoutSlotOverlapsRange(EventSlotOccurrenceDto slot, EventCheckoutSlotsQueryDto query) {
        LocalDate rangeStart = checkoutQueryDate(firstNonBlank(query == null ? null : query.rangeStart(), query == null ? null : query.anchorDate()));
        LocalDate rangeEnd = checkoutQueryDate(query == null ? null : query.rangeEnd());
        if (checkoutQueryIsUpcomingFromDate(query, rangeStart, rangeEnd)) {
            rangeEnd = null;
        }
        if (rangeStart == null && rangeEnd == null) {
            return true;
        }
        long startMs = toSortableDate(slot == null ? null : slot.startAtIso());
        long endMs = toSortableDate(slot == null ? null : slot.endAtIso());
        if (endMs <= 0L) {
            endMs = startMs;
        }
        if (rangeStart != null && endMs < rangeStart.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()) {
            return false;
        }
        if (rangeEnd != null && startMs > rangeEnd.atTime(23, 59, 59, 999_000_000).toInstant(ZoneOffset.UTC).toEpochMilli()) {
            return false;
        }
        return true;
    }

    private boolean checkoutQueryIsUpcomingFromDate(EventCheckoutSlotsQueryDto query, LocalDate rangeStart, LocalDate rangeEnd) {
        return rangeStart != null
                && rangeStart.equals(rangeEnd)
                && "day".equalsIgnoreCase(safeText(query == null ? null : query.view()))
                && !"past".equalsIgnoreCase(safeText(query == null ? null : query.order()));
    }

    private int checkoutSlotDirection(EventCheckoutSlotsQueryDto query) {
        return "past".equalsIgnoreCase(safeText(query == null ? null : query.order())) ? -1 : 1;
    }

    private LocalDate checkoutQueryDate(String value) {
        String text = safeText(value);
        if (!StringUtils.hasText(text)) {
            return null;
        }
        try {
            return LocalDate.parse(text.length() > 10 ? text.substring(0, 10) : text);
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private String checkoutSlotDateKey(String startAtIso) {
        long startMs = toSortableDate(startAtIso);
        return startMs <= 0L ? "" : Instant.ofEpochMilli(startMs).atZone(ZoneOffset.UTC).toLocalDate().toString();
    }

    private int checkoutCursorOffset(String cursor) {
        try {
            return Math.max(0, Integer.parseInt(safeText(cursor)));
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }

    public EventSubEventsResultDto loadSubEventsById(EventSubEventsQueryDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = normalizeId(request == null ? null : request.eventId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return null;
        }
        ActivityEvent selected = preferredSubEventsDefinitionRecord(loadEventDocumentsBySourceIds(List.of(sourceId)), viewer.userId());
        if (selected == null) {
            return null;
        }
        String parentEventId = isGeneratedSlotRecord(selected)
                ? firstNonBlank(selected.getParentEventId(), selected.getSourceId())
                : selected.getSourceId();
        ActivityEvent parent = preferredSubEventsDefinitionRecord(loadEventDocumentsBySourceIds(List.of(parentEventId)), viewer.userId());
        if (parent == null) {
            parent = selected;
        }
        EventSubEventsSlotPage page = activityEventSubEventsMapper.toSlotPage(
                parentEventId,
                parent,
                request);
        List<EventSubEventsSlotDto> baseSlots = page.slots();
        if (Boolean.TRUE.equals(request.participantOnly())) {
            baseSlots = filterSubEventSlotsByAcceptedParticipation(baseSlots, viewer.userId());
        }
        SubEventStateLookups lookups = activityEventSubEventsMapper.subEventStateLookups(baseSlots, viewer.userId());
        Map<String, ActivitySubEventStageRuntimeStateDto> stageRuntimeByKey = subEventStageRuntimeRecordsByKey(lookups.stageRuntimeLookups());
        List<EventSubEventsSlotDto> slots = activityEventSubEventsMapper.withSubEventStates(
                baseSlots,
                Map.of(),
                stageRuntimeByKey,
                viewer.userId());
        return new EventSubEventsResultDto(parent.getMode(), slots, page.total(), page.nextCursor());
    }

    private List<EventSubEventsSlotDto> filterSubEventSlotsByAcceptedParticipation(
            List<EventSubEventsSlotDto> slots,
            String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || slots == null || slots.isEmpty()) {
            return List.of();
        }
        List<SubEventParticipationSlotCandidate> candidates = slots.stream()
                .filter(Objects::nonNull)
                .map(this::subEventParticipationSlotCandidate)
                .toList();
        if (candidates.isEmpty()) {
            return List.of();
        }
        addManualGroupOwnerIds(candidates);
        Set<String> acceptedEventOwnerIds = acceptedParticipantOwnerIds(
                OWNER_TYPE_EVENT,
                candidates.stream()
                        .flatMap(candidate -> candidate.eventOwnerIds.stream())
                        .toList(),
                normalizedUserId);
        Set<String> acceptedSubEventOwnerIds = acceptedParticipantOwnerIds(
                OWNER_TYPE_SUB_EVENT,
                candidates.stream()
                        .flatMap(candidate -> candidate.subEventOwnerIdsByIndex.values().stream())
                        .flatMap(Collection::stream)
                        .toList(),
                normalizedUserId);
        Set<String> acceptedGroupOwnerIds = acceptedParticipantOwnerIds(
                OWNER_TYPE_GROUP,
                candidates.stream()
                        .flatMap(candidate -> candidate.groupOwnerIds.stream())
                        .toList(),
                normalizedUserId);

        List<EventSubEventsSlotDto> filtered = new ArrayList<>();
        for (SubEventParticipationSlotCandidate candidate : candidates) {
            List<SubEventItemDto> items = candidate.items();
            boolean hasSlotParticipation = intersects(candidate.eventOwnerIds, acceptedEventOwnerIds)
                    || intersects(candidate.groupOwnerIds, acceptedGroupOwnerIds)
                    || hasTournamentSubEventParticipation(candidate, acceptedSubEventOwnerIds);
            if (hasSlotParticipation) {
                filtered.add(candidate.slot);
                continue;
            }
            List<SubEventItemDto> filteredItems = new ArrayList<>();
            for (int index = 0; index < items.size(); index += 1) {
                if (intersects(candidate.subEventOwnerIdsByIndex.get(index), acceptedSubEventOwnerIds)) {
                    filteredItems.add(items.get(index));
                }
            }
            if (!filteredItems.isEmpty()) {
                filtered.add(withSubEventItems(candidate.slot, filteredItems));
            }
        }
        return filtered;
    }

    private SubEventParticipationSlotCandidate subEventParticipationSlotCandidate(EventSubEventsSlotDto slot) {
        SubEventParticipationSlotCandidate candidate = new SubEventParticipationSlotCandidate(slot);
        String slotOwnerId = subEventParticipantSlotOwnerId(slot);
        boolean concreteSlot = isConcreteSubEventSlot(slot);
        candidate.eventOwnerIds.addAll(uniqueParticipantOwnerIds(
                slotOwnerId,
                concreteSlot ? null : slot == null ? null : slot.parentEventId(),
                slot == null ? null : slot.slotSourceId(),
                slot == null ? null : slot.id()));
        List<SubEventItemDto> items = candidate.items();
        for (int index = 0; index < items.size(); index += 1) {
            SubEventItemDto item = items.get(index);
            String subEventId = subEventParticipantItemId(item, index);
            candidate.subEventOwnerIdsByIndex.put(index, new LinkedHashSet<>(
                    subEventParticipantOwnerIds(candidate.eventOwnerIds, subEventId)));
            candidate.groupOwnerIds.addAll(generatedGroupParticipantOwnerIds(subEventId, item == null ? null : item.groupsCount()));
        }
        return candidate;
    }

    private void addManualGroupOwnerIds(List<SubEventParticipationSlotCandidate> candidates) {
        List<SubEventStageRuntimeLookup> runtimeRefs = new ArrayList<>();
        for (SubEventParticipationSlotCandidate candidate : candidates == null ? List.<SubEventParticipationSlotCandidate>of() : candidates) {
            String slotOwnerId = subEventParticipantSlotOwnerId(candidate.slot);
            if (!StringUtils.hasText(slotOwnerId)) {
                continue;
            }
            List<SubEventItemDto> items = candidate.items();
            for (int index = 0; index < items.size(); index += 1) {
                String subEventId = subEventParticipantItemId(items.get(index), index);
                if (StringUtils.hasText(subEventId)) {
                    runtimeRefs.add(new SubEventStageRuntimeLookup(slotOwnerId, subEventId));
                }
            }
        }
        Map<String, ActivitySubEventStageRuntime> runtimeByKey = subEventStageRuntimeDocumentsByKey(runtimeRefs);
        Set<String> runtimeOwnerIds = runtimeByKey.values().stream()
                .map(ActivitySubEventStageRuntime::getId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (runtimeOwnerIds.isEmpty()) {
            return;
        }
        Map<String, List<String>> groupIdsByRuntimeOwnerId = new LinkedHashMap<>();
        List<ActivitySubEventGroup> groups = activitySubEventGroupsRepository
                .findByOwnerIdInAndStatusNot(runtimeOwnerIds, RUNTIME_STATUS_DELETED);
        for (ActivitySubEventGroup group : groups == null ? List.<ActivitySubEventGroup>of() : groups) {
            String ownerId = normalizeId(group == null ? null : group.getOwnerId());
            String groupId = normalizeId(group == null ? null : group.getGroupId());
            if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(groupId)) {
                continue;
            }
            groupIdsByRuntimeOwnerId.computeIfAbsent(ownerId, ignored -> new ArrayList<>()).add(groupId);
        }
        if (groupIdsByRuntimeOwnerId.isEmpty()) {
            return;
        }
        for (SubEventParticipationSlotCandidate candidate : candidates) {
            String slotOwnerId = subEventParticipantSlotOwnerId(candidate.slot);
            if (!StringUtils.hasText(slotOwnerId)) {
                continue;
            }
            List<SubEventItemDto> items = candidate.items();
            for (int index = 0; index < items.size(); index += 1) {
                String subEventId = subEventParticipantItemId(items.get(index), index);
                ActivitySubEventStageRuntime runtime = runtimeByKey.get(
                        activityEventSubEventsMapper.subEventStageRuntimeRecordKey(slotOwnerId, subEventId));
                String runtimeOwnerId = normalizeId(runtime == null ? null : runtime.getId());
                if (StringUtils.hasText(runtimeOwnerId)) {
                    candidate.groupOwnerIds.addAll(groupIdsByRuntimeOwnerId.getOrDefault(runtimeOwnerId, List.of()));
                }
            }
        }
    }

    private Map<String, ActivitySubEventStageRuntime> subEventStageRuntimeDocumentsByKey(
            Collection<SubEventStageRuntimeLookup> refs) {
        if (refs == null || refs.isEmpty()) {
            return Map.of();
        }
        Set<String> ownerIds = refs.stream()
                .map(SubEventStageRuntimeLookup::ownerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Set<String> requestedKeys = refs.stream()
                .map(ref -> activityEventSubEventsMapper.subEventStageRuntimeRecordKey(ref.ownerId(), ref.subEventId()))
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (ownerIds.isEmpty() || requestedKeys.isEmpty()) {
            return Map.of();
        }
        Map<String, ActivitySubEventStageRuntime> recordsByKey = new LinkedHashMap<>();
        List<ActivitySubEventStageRuntime> records = activitySubEventStageRuntimeRepository
                .findByOwnerIdInAndStatusNot(ownerIds, RUNTIME_STATUS_DELETED);
        for (ActivitySubEventStageRuntime record : records == null ? List.<ActivitySubEventStageRuntime>of() : records) {
            String key = activityEventSubEventsMapper.subEventStageRuntimeRecordKey(
                    record == null ? null : record.getOwnerId(),
                    record == null ? null : record.getSubEventId());
            if (requestedKeys.contains(key)) {
                recordsByKey.put(key, record);
            }
        }
        return recordsByKey;
    }

    private Set<String> acceptedParticipantOwnerIds(
            String ownerType,
            Collection<String> ownerIds,
            String userId) {
        Set<String> normalizedOwnerIds = ownerIds == null
                ? Set.of()
                : ownerIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(ownerType) || normalizedOwnerIds.isEmpty() || !StringUtils.hasText(normalizedUserId)) {
            return Set.of();
        }
        return activityMembersRepository
                .findAcceptedByOwnerTypeOwnerIdInAndUserId(ownerType, normalizedOwnerIds, normalizedUserId, MEMBER_STATUS_ACCEPTED)
                .stream()
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private boolean hasTournamentSubEventParticipation(
            SubEventParticipationSlotCandidate candidate,
            Set<String> acceptedSubEventOwnerIds) {
        List<SubEventItemDto> items = candidate.items();
        for (int index = 0; index < items.size(); index += 1) {
            if (isTournamentSubEvent(items.get(index))
                    && intersects(candidate.subEventOwnerIdsByIndex.get(index), acceptedSubEventOwnerIds)) {
                return true;
            }
        }
        return false;
    }

    private String subEventParticipantSlotOwnerId(EventSubEventsSlotDto slot) {
        return firstNonBlank(
                slot == null ? null : slot.slotSourceId(),
                slot == null ? null : slot.parentEventId(),
                slot == null ? null : slot.id());
    }

    private boolean isConcreteSubEventSlot(EventSubEventsSlotDto slot) {
        String slotSourceId = normalizeId(slot == null ? null : slot.slotSourceId());
        String parentEventId = normalizeId(slot == null ? null : slot.parentEventId());
        return StringUtils.hasText(slotSourceId) && !slotSourceId.equals(parentEventId);
    }

    private String subEventParticipantItemId(SubEventItemDto item, int index) {
        return firstNonBlank(item == null ? null : item.id(), "subevent-" + (index + 1));
    }

    private List<String> subEventParticipantOwnerIds(Set<String> eventOwnerIds, String subEventId) {
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedSubEventId)) {
            return List.of();
        }
        List<String> ownerIds = new ArrayList<>();
        ownerIds.add(normalizedSubEventId);
        for (String eventOwnerId : eventOwnerIds == null ? Set.<String>of() : eventOwnerIds) {
            String normalizedEventOwnerId = normalizeId(eventOwnerId);
            if (StringUtils.hasText(normalizedEventOwnerId)) {
                ownerIds.add(normalizedEventOwnerId + ":" + normalizedSubEventId);
            }
        }
        return uniqueParticipantOwnerIds(ownerIds.toArray(String[]::new));
    }

    private List<String> generatedGroupParticipantOwnerIds(String subEventId, Integer groupsCount) {
        String normalizedSubEventId = normalizeId(subEventId);
        int groupCount = Math.max(0, groupsCount == null ? 0 : groupsCount);
        if (!StringUtils.hasText(normalizedSubEventId) || groupCount <= 0) {
            return List.of();
        }
        List<String> ownerIds = new ArrayList<>();
        for (int index = 1; index <= groupCount; index += 1) {
            ownerIds.add(normalizedSubEventId + ":group:" + index);
            ownerIds.add(normalizedSubEventId + "-group-" + index);
        }
        return uniqueParticipantOwnerIds(ownerIds.toArray(String[]::new));
    }

    private boolean intersects(Set<String> ownerIds, Set<String> acceptedOwnerIds) {
        if (ownerIds == null || ownerIds.isEmpty() || acceptedOwnerIds == null || acceptedOwnerIds.isEmpty()) {
            return false;
        }
        for (String ownerId : ownerIds) {
            if (acceptedOwnerIds.contains(normalizeId(ownerId))) {
                return true;
            }
        }
        return false;
    }

    private boolean isTournamentSubEvent(SubEventItemDto item) {
        return item != null
                && (Math.max(0, item.groupsCount() == null ? 0 : item.groupsCount()) > 0
                        || "Score".equalsIgnoreCase(safeText(item.tournamentLeaderboardType()))
                        || "Fifa".equalsIgnoreCase(safeText(item.tournamentLeaderboardType())));
    }

    private EventSubEventsSlotDto withSubEventItems(EventSubEventsSlotDto slot, List<SubEventItemDto> items) {
        return new EventSubEventsSlotDto(
                slot == null ? "" : slot.id(),
                slot == null ? "" : slot.parentEventId(),
                slot == null ? null : slot.slotSourceId(),
                slot == null ? null : slot.slotTemplateId(),
                slot == null ? null : slot.title(),
                slot == null ? null : slot.timeframe(),
                slot == null ? null : slot.startAt(),
                slot == null ? null : slot.endAt(),
                items == null ? List.of() : items);
    }

    private List<String> uniqueParticipantOwnerIds(String... values) {
        if (values == null || values.length == 0) {
            return List.of();
        }
        List<String> result = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();
        for (String value : values) {
            String normalized = normalizeId(value);
            if (StringUtils.hasText(normalized) && seen.add(normalized)) {
                result.add(normalized);
            }
        }
        return result;
    }

    private static final class SubEventParticipationSlotCandidate {
        private final EventSubEventsSlotDto slot;
        private final Set<String> eventOwnerIds = new LinkedHashSet<>();
        private final Map<Integer, Set<String>> subEventOwnerIdsByIndex = new LinkedHashMap<>();
        private final Set<String> groupOwnerIds = new LinkedHashSet<>();

        private SubEventParticipationSlotCandidate(EventSubEventsSlotDto slot) {
            this.slot = slot;
        }

        private List<SubEventItemDto> items() {
            return slot == null || slot.subEventItems() == null ? List.of() : slot.subEventItems();
        }
    }

    private ActivityEvent preferredSubEventsDefinitionRecord(List<ActivityEvent> records, String viewerUserId) {
        ActivityEvent best = null;
        int bestScore = Integer.MIN_VALUE;
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            int score = subEventsDefinitionRecordScore(record, viewerUserId);
            if (best == null || score > bestScore) {
                best = record;
                bestScore = score;
            }
        }
        return best;
    }

    private int subEventsDefinitionRecordScore(ActivityEvent record, String viewerUserId) {
        if (record == null) {
            return Integer.MIN_VALUE;
        }
        String normalizedViewerUserId = normalizeId(viewerUserId);
        int slotTemplateCount = record.getSlotTemplates() == null ? 0 : record.getSlotTemplates().size();
        int definitionCount = record.getSubEventDefinitions() == null ? 0 : record.getSubEventDefinitions().size();
        int runtimeItemCount = record.getSubEvents() == null ? 0 : record.getSubEvents().size();
        int score = 0;
        score += isGeneratedSlotRecord(record) ? -10_000 : 0;
        score += normalizedViewerUserId.equals(normalizeId(record.getOwnerUserId())) ? 2_000 : 0;
        score += normalizedViewerUserId.equals(normalizeId(record.getCreatorUserId())) ? 1_000 : 0;
        score += normalizeIds(record.getAdmins()).contains(normalizedViewerUserId) ? 400 : 0;
        score += Boolean.FALSE.equals(record.getSubEventsEnabled()) ? -500 : 100;
        score += Boolean.TRUE.equals(record.getSlotsEnabled()) ? 500 : 0;
        score += slotTemplateCount * 100;
        score += definitionCount * 40;
        score += runtimeItemCount * 10;
        score += ActivityEvent.STATUS_ACTIVE.equals(safeText(record.getStatus())) ? 5 : 0;
        return score;
    }

    private Map<String, ActivitySubEventStageRuntimeStateDto> subEventStageRuntimeRecordsByKey(
            Collection<SubEventStageRuntimeLookup> refs) {
        if (refs == null || refs.isEmpty()) {
            return Map.of();
        }
        Set<String> ownerIds = refs.stream()
                .map(SubEventStageRuntimeLookup::ownerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Set<String> requestedKeys = refs.stream()
                .map(ref -> activityEventSubEventsMapper.subEventStageRuntimeRecordKey(ref.ownerId(), ref.subEventId()))
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (ownerIds.isEmpty() || requestedKeys.isEmpty()) {
            return Map.of();
        }
        Map<String, ActivitySubEventStageRuntimeStateDto> recordsByKey = new LinkedHashMap<>();
        List<ActivitySubEventStageRuntime> records = activitySubEventStageRuntimeRepository.findByOwnerIdInAndStatusNot(ownerIds, RUNTIME_STATUS_DELETED);
        for (ActivitySubEventStageRuntime record : records == null ? List.<ActivitySubEventStageRuntime>of() : records) {
            ActivitySubEventStageRuntimeStateDto dto = activitySubEventStageRuntimeMapper.toDto(record);
            if (dto == null) {
                continue;
            }
            String key = activityEventSubEventsMapper.subEventStageRuntimeRecordKey(dto.ownerId(), dto.subEventId());
            if (requestedKeys.contains(key)) {
                recordsByKey.put(key, dto);
            }
        }
        return recordsByKey;
    }

    public List<EventDto> queryExploreItems(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        try {
            ACTIVE_CONTEXT.set(buildExploreQueryContext(viewer));
            List<ActivityEvent> records = computeExploreRecords(viewer);
            return records.stream()
                    .map(record -> toEventDto(record, viewer))
                    .filter(Objects::nonNull)
                    .sorted(Comparator
                            .comparing((EventDto item) -> toSortableDate(item.startAtIso()))
                            .thenComparing(item -> safeText(item.id())))
                    .toList();
        } finally {
            ACTIVE_CONTEXT.remove();
        }
    }

    public EventsExplorePageDto queryEventExplorePage(EventsExploreQueryDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }
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

        return withEventQueryContext(buildExplorePageQueryContext(viewer, "most-relevant".equals(order)), () -> {
            List<EventProjection> sorted = computeExploreRecords(viewer).stream()
                    .filter(record -> !excludedSourceIds.contains(normalizeId(record.getSourceId())))
                    .map(record -> toSortProjection(record, viewer))
                    .filter(Objects::nonNull)
                    .filter(projection -> !hasTrackedUserParticipation(projection.record(), viewer.userId()))
                    .filter(projection -> !friendsOnly || exploreHasFriendGoing(projection.record(), viewer.userId()))
                    .filter(projection -> !openSpotsOnly || exploreHasOpenSpots(projection.record()))
                    .filter(projection -> !StringUtils.hasText(topic) || hasTopic(projection.record(), topic))
                    .sorted((left, right) -> compareExploreProjection(left, right, order, view))
                    .toList();

            int startIndex = resolveCursorStartIndex(sorted, cursor);
            int endIndex = Math.min(sorted.size(), startIndex + limit);
            List<EventProjection> pageProjections = sorted.subList(startIndex, endIndex);
            List<EventDto> records = pageProjections.stream()
                    .map(projection -> toEventDto(projection.record(), viewer))
                    .filter(Objects::nonNull)
                    .toList();
            String nextCursor = endIndex < sorted.size() && !pageProjections.isEmpty()
                    ? serializeCursorId(projectionId(pageProjections.get(pageProjections.size() - 1)))
                    : null;
            return new EventsExplorePageDto(records, sorted.size(), nextCursor);
        });
    }

    public EventParticipationActionResultDto trash(EventActionRequestDto request) {
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        String userId = request == null ? null : request.userId();
        if (Boolean.TRUE.equals(request == null ? null : request.removeMembershipOnly())) {
            return removeCheckoutMembershipOnlyWithCounterDelta(request, sourceId);
        }
        boolean organizerLifecycleRequest = isOrganizerLifecycleRequest(request);
        if (!organizerLifecycleRequest) {
            return removeCheckoutMembershipOnlyWithCounterDelta(request, sourceId);
        }
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        ActivitiesMembersService.OwnerMembersSnapshot beforeSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
        UserEventActivityState beforeState = eventActivityState(preferred, beforeSnapshot, userId);
        if (organizerLifecycleRequest && !accessControlService.canCurrentActorDeleteEvent(sourceId)) {
            return withCounterDelta(
                    toLifecycleActionResult(sourceId, "trash", preferred, false, "forbidden"),
                    null);
        }
        boolean changed = preferred != null && !ActivityEvent.STATUS_TRASHED.equals(safeText(preferred.getStatus()));
        maybePostMemberLeftMessage(request);
        maybeApplyLeaveCancellationRefund(request);
        List<ActivityEvent> updated = updateItemState(request, current -> {
            String currentStatus = safeText(current.getStatus());
            if (!ActivityEvent.STATUS_TRASHED.equals(currentStatus)) {
                current.setStatusBeforeSuppression(currentStatus);
            }
            current.setStatus(ActivityEvent.STATUS_TRASHED);
            current.setTrashedAtIso(Instant.now().toString());
        }, true);
        if (organizerLifecycleRequest) {
            scheduleEventLifecycleChangedNotification(sourceId, updated, "deleted", request == null ? null : request.userId());
            syncStageReminderTasksForSavedEvents(updated, request == null ? null : request.userId());
            markEventAttachmentsUnavailable(updated, "trashed");
        }
        userActivityCountersService.refreshEventCountersForDocuments(updated);
        return withCounterDelta(
                toLifecycleActionResult(sourceId, "trash", findPreferredEventRecord(sourceId), changed, null),
                changed
                        ? eventActivityTransition(beforeState, UserEventActivityState.trash(), false)
                        : null);
    }

    private EventParticipationActionResultDto removeCheckoutMembershipOnlyWithCounterDelta(
            EventActionRequestDto request,
            String sourceId) {
        String userId = request == null ? null : normalizeId(request.userId());
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        ActivitiesMembersService.OwnerMembersSnapshot beforeSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
        UserEventActivityState beforeState = eventActivityState(preferred, beforeSnapshot, userId);
        EventParticipationActionResultDto result = removeCheckoutMembershipOnly(request, sourceId);
        return withCounterDelta(
                result,
                result != null && result.changed()
                        ? eventActivityTransition(beforeState, UserEventActivityState.trash(), false)
                        : null);
    }

    private EventParticipationActionResultDto removeCheckoutMembershipOnly(
            EventActionRequestDto request,
            String sourceId) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String normalizedSourceId = normalizeId(sourceId);
        String slotSourceId = normalizeId(request == null ? null : request.slotSourceId());
        if (viewer == null || !StringUtils.hasText(normalizedSourceId)) {
            return null;
        }

        ActivitiesMembersService.OwnerMembersSnapshot sourceSnapshot =
                activitiesMembersService.suppressEventParticipationTree(
                        normalizedSourceId,
                        viewer.userId(),
                        viewer.userId());
        boolean membershipChanged = sourceSnapshot != null && sourceSnapshot.mutationApplied();
        boolean alreadyApplied = !membershipChanged
                && sourceSnapshot != null
                && !sourceSnapshot.hasParticipation(viewer.userId())
                && !sourceSnapshot.hasInvitation(viewer.userId());
        if (membershipChanged || alreadyApplied) {
            String checkoutState = safeText(request == null ? null : request.checkoutState());
            if (StringUtils.hasText(checkoutState)) {
                String pendingReason = pendingReasonForCheckoutState(checkoutState, request.pendingReason());
                eventCheckoutBasketService.updateBasketState(new EventCheckoutStateChangeRequestDto(
                        viewer.userId(),
                        normalizedSourceId,
                        slotSourceId,
                        checkoutState,
                        firstNonBlank(request.checkoutResultState(), "deleted"),
                        pendingReason,
                        firstNonBlank(request.checkoutSessionId(), request.paymentSessionId(), null)));
            }
        }

        ActivityEvent refreshed = findPreferredEventRecord(normalizedSourceId);
        return toParticipationLeaveResult(
                normalizedSourceId,
                slotSourceId,
                refreshed,
                sourceSnapshot,
                request,
                membershipChanged,
                alreadyApplied ? "already-applied" : membershipChanged ? null : "leave-not-allowed");
    }

    public EventParticipationActionResultDto publish(EventActionRequestDto request) {
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        String userId = request == null ? null : request.userId();
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        ActivitiesMembersService.OwnerMembersSnapshot beforeSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
        UserEventActivityState beforeState = eventActivityState(preferred, beforeSnapshot, userId);
        if (!accessControlService.canCurrentActorPublishEvent(sourceId)) {
            return withCounterDelta(
                    toLifecycleActionResult(sourceId, "publish", preferred, false, "forbidden"),
                    null);
        }
        boolean changed = preferred != null && !ActivityEvent.STATUS_ACTIVE.equals(safeText(preferred.getStatus()));
        String nowIso = Instant.now().toString();
        List<ActivityEvent> updated = updateItemState(request, current -> {
            current.setStatus(ActivityEvent.STATUS_ACTIVE);
            current.setSubEvents(ensureTournamentStartReviewStage(current.getSubEvents(), nowIso));
        });
        List<ActivityEvent> publishedDocuments = ensurePublishedEventDocuments(updated, request == null ? null : request.userId());
        boolean eventChatAdded = false;
        if (changed) {
            eventChatAdded = materializePublishedMainEventChats(publishedDocuments, userId);
            chatService.updateEventChatOwnerStatus(sourceId, ActivityEvent.STATUS_ACTIVE);
            if (eventChatAdded) {
                notifyPublishedPendingInvitees(publishedDocuments, beforeSnapshot, userId);
                scheduleAcceptedEventLifecycleChangedNotification(
                        sourceId,
                        publishedDocuments,
                        beforeSnapshot,
                        "modified",
                        userId);
            } else {
                scheduleEventLifecycleChangedNotification(sourceId, publishedDocuments, "modified", userId);
            }
            syncStageReminderTasksForSavedEvents(publishedDocuments, userId);
            markEventAttachmentsAvailable(publishedDocuments);
            enqueueTournamentStartReviewNotifications(publishedDocuments, userId);
            runInitialAutoInviteBatch(publishedDocuments);
        }
        eventParticipationTicketService.syncParticipationTicketsForEvent(sourceId);
        userActivityCountersService.refreshEventCountersForDocuments(publishedDocuments);
        ActivityEvent refreshed = findPreferredEventRecord(sourceId);
        ActivitiesMembersService.OwnerMembersSnapshot afterSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
        return withCounterDelta(
                toLifecycleActionResult(sourceId, "publish", refreshed, changed, null),
                changed
                        ? eventActivityTransition(
                                beforeState,
                                eventActivityState(refreshed, afterSnapshot, userId),
                                false)
                        : null);
    }

    public EventParticipationActionResultDto unpublish(EventActionRequestDto request) {
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        String userId = request == null ? null : request.userId();
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        ActivitiesMembersService.OwnerMembersSnapshot beforeSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
        UserEventActivityState beforeState = eventActivityState(preferred, beforeSnapshot, userId);
        if (!accessControlService.canCurrentActorUnpublishEvent(sourceId)) {
            return withCounterDelta(
                    toLifecycleActionResult(sourceId, "unpublish", preferred, false, "forbidden"),
                    null);
        }
        boolean changed = preferred != null && !ActivityEvent.STATUS_DRAFT.equals(safeText(preferred.getStatus()));
        List<ActivityEvent> updated = updateItemState(request, current -> {
            current.setStatus(ActivityEvent.STATUS_DRAFT);
        });
        if (changed) {
            chatService.updateEventChatOwnerStatus(sourceId, ActivityEvent.STATUS_DRAFT);
            scheduleEventLifecycleChangedNotification(sourceId, updated, "under-review", userId);
            syncStageReminderTasksForSavedEvents(updated, userId);
            markEventAttachmentsUnavailable(updated, "unpublished");
        }
        eventParticipationTicketService.syncParticipationTicketsForEvent(sourceId);
        userActivityCountersService.refreshEventCountersForDocuments(updated);
        ActivityEvent refreshed = findPreferredEventRecord(sourceId);
        ActivitiesMembersService.OwnerMembersSnapshot afterSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
        return withCounterDelta(
                toLifecycleActionResult(sourceId, "unpublish", refreshed, changed, null),
                changed
                        ? eventActivityTransition(
                                beforeState,
                                eventActivityState(refreshed, afterSnapshot, userId),
                                false)
                        : null);
    }

    public EventParticipationActionResultDto restore(EventActionRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return null;
        }
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        boolean organizerLifecycleRequest = preferred != null && isViewerAdmin(preferred, viewer.userId());
        if (!organizerLifecycleRequest) {
            boolean restored =
                    activitiesMembersService.restoreEventParticipationTree(
                            sourceId,
                            viewer.userId(),
                            viewer.userId());
            ActivityEvent refreshed = findPreferredEventRecord(sourceId);
            ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                    activitiesMembersService.queryOwnerSnapshot("event", sourceId);
            return withCounterDelta(
                    toParticipationRestoreResult(
                            sourceId,
                            viewer.userId(),
                            refreshed,
                            snapshot,
                            restored,
                            restored ? null : "restore-unavailable"),
                    restored
                            ? eventActivityTransition(
                                    UserEventActivityState.trash(),
                                    eventActivityState(refreshed, snapshot, viewer.userId()),
                                    false)
                            : null);
        }
        if (!accessControlService.canCurrentActorRestoreEvent(sourceId)) {
            ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                    activitiesMembersService.queryOwnerSnapshot("event", sourceId);
            return withCounterDelta(
                    toParticipationRestoreResult(
                            sourceId,
                            viewer.userId(),
                            preferred,
                            snapshot,
                            false,
                            "forbidden"),
                    null);
        }
        boolean changed = ActivityEvent.STATUS_TRASHED.equals(safeText(preferred.getStatus()))
                || Boolean.TRUE.equals(preferred.getIsTrashed());
        List<ActivityEvent> updated = updateItemState(request, current -> {
            String restoredStatus = safeText(current.getStatusBeforeSuppression());
            if (!StringUtils.hasText(restoredStatus) || isSuppressedLifecycleStatus(restoredStatus)) {
                restoredStatus = ActivityEvent.STATUS_ACTIVE;
            }
            current.setStatus(restoredStatus);
            current.setStatusBeforeSuppression(null);
            current.setTrashedAtIso(null);
        });
        syncStageReminderTasksForSavedEvents(updated, request == null ? null : request.userId());
        markEventAttachmentsAvailable(updated);
        userActivityCountersService.refreshEventCountersForDocuments(updated);
        ActivityEvent refreshed = findPreferredEventRecord(sourceId);
        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                activitiesMembersService.queryOwnerSnapshot("event", sourceId);
        return withCounterDelta(
                toParticipationRestoreResult(
                        sourceId,
                        viewer.userId(),
                        refreshed,
                        snapshot,
                        changed,
                        changed ? null : "already-applied"),
                changed
                        ? eventActivityTransition(
                                UserEventActivityState.trash(),
                                eventActivityState(refreshed, snapshot, viewer.userId()),
                                false)
                        : null);
    }

    public void takeOver(EventActionRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return;
        }
        if (!accessControlService.canCurrentActorTakeOverEvent(sourceId)) {
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
            if (!ActivityEvent.STATUS_UNDER_REVIEW.equals(safeText(document.getStatus()))) {
                continue;
            }
            ActivityEvent next = cloneDocument(document);
            String restoredStatus = safeText(next.getStatusBeforeSuppression());
            if (!StringUtils.hasText(restoredStatus) || isSuppressedLifecycleStatus(restoredStatus)) {
                restoredStatus = ActivityEvent.STATUS_ACTIVE;
            }
            next.setStatus(restoredStatus);
            next.setStatusBeforeSuppression(null);
            next.setTrashedAtIso(null);
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
        userActivityCountersService.refreshEventCountersForDocuments(updated);
    }

    public EventStageActionResultDto applyStageAction(EventStageActionRequestDto request) {
        if (request == null) {
            return null;
        }
        ViewerContext viewer = resolveViewer(request.userId());
        String sourceId = normalizeId(request.sourceId());
        String slotSourceId = normalizeId(request.slotSourceId());
        String runtimeOwnerId = StringUtils.hasText(slotSourceId) ? slotSourceId : sourceId;
        StageActionTarget actionTarget = resolveStageActionTarget(request);
        if (viewer == null || !StringUtils.hasText(sourceId) || actionTarget == null) {
            return null;
        }
        if (!accessControlService.canCurrentActorApplyEventStageAction(sourceId)) {
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
            return null;
        }

        List<SubEventItem> preferredSubEvents = StringUtils.hasText(slotSourceId)
                ? stageActionSlotSubEvents(sourceId, slotSourceId, preferred, request)
                : cloneSubEvents(runtimeStageSequence(preferred));
        int preferredStageIndex = resolveStageIndex(preferredSubEvents, request.subEventId(), request.subEventIndex());
        if (preferredStageIndex < 0 || preferredStageIndex >= preferredSubEvents.size()) {
            return null;
        }
        SubEventItem preferredStage = preferredSubEvents.get(preferredStageIndex);
        if (!canApplyStageAction(actionTarget.action(), preferredStage, preferredSubEvents, preferredStageIndex)) {
            return toStageActionResult(runtimeOwnerId, preferredStage, preferredStageIndex, actionTarget.action(), preferred.getAutoInviter());
        }
        actionTarget = effectiveStageActionTarget(actionTarget, preferredStage);

        if (StringUtils.hasText(slotSourceId)) {
            return applyGeneratedSlotStageAction(
                    sourceId,
                    slotSourceId,
                    documents,
                    preferred,
                    preferredSubEvents,
                    preferredStageIndex,
                    actionTarget,
                    viewer.userId());
        }

        String nowIso = Instant.now().toString();
        String stageId = normalizeId(preferredStage.id());
        List<ActivityEvent> updated = new ArrayList<>();
        for (ActivityEvent document : documents) {
            List<SubEventItem> subEvents = cloneSubEvents(document.getSubEvents());
            int stageIndex = resolveStageIndex(subEvents, stageId, preferredStageIndex);
            if (stageIndex < 0 || stageIndex >= subEvents.size()) {
                continue;
            }
            ActivityEvent next = cloneDocument(document);
            List<SubEventItem> nextSubEvents = new ArrayList<>(subEvents);
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
            SubEventItem savedStage = copySubEventWithStageStatus(
                    preferredStage,
                    actionTarget.nextStatus(),
                    actionTarget.reason(),
                    nowIso,
                    STAGE_STATUS_FINALIZED.equals(actionTarget.nextStatus()) ? nowIso : null,
                    STAGE_STATUS_FINALIZED.equals(actionTarget.nextStatus()) ? viewer.userId() : null);
            saveSubEventStageRuntime(sourceId, preferred, savedStage, viewer.userId());
            affinityRecomputeTaskService.enqueueEventChanged(sourceId, viewer.userId());
            return toStageActionResult(
                    sourceId,
                    savedStage,
                    preferredStageIndex,
                    actionTarget.action(),
                    STAGE_ACTION_START.equals(actionTarget.action()) ? Boolean.FALSE : preferred.getAutoInviter());
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
        List<SubEventItem> savedSubEvents = cloneSubEvents(savedPreferred.getSubEvents());
        int savedStageIndex = resolveStageIndex(savedSubEvents, stageId, preferredStageIndex);
        SubEventItem savedStage = savedStageIndex >= 0 && savedStageIndex < savedSubEvents.size()
                ? savedSubEvents.get(savedStageIndex)
                : preferredStage;
        boolean finalStage = savedStageIndex >= 0 && savedStageIndex == savedSubEvents.size() - 1;
        TournamentResultSummary resultSummary = resolveTournamentResultSummary(savedPreferred, savedStage, finalStage);
        saveSubEventStageRuntime(sourceId, savedPreferred, savedStage, viewer.userId());
        enqueueStageStatusNotifications(savedPreferred, savedStage, actionTarget.action(), actionTarget.nextStatus(), viewer.userId(), finalStage, resultSummary);
        postStageChatMessage(savedPreferred, savedStage, actionTarget.action(), actionTarget.nextStatus(), finalStage, resultSummary);
        adminTelemetryService.record("event.stage.action", "events", sourceId, viewer.userId(), 1L, Map.of(
                "action", actionTarget.action(),
                "stageStatus", actionTarget.nextStatus(),
                "stageId", firstNonBlank(stageId, Integer.toString(preferredStageIndex))));
        userActivityCountersService.refreshEventCountersForDocuments(saved);
        return toStageActionResult(
                sourceId,
                savedStage,
                savedStageIndex >= 0 ? savedStageIndex : preferredStageIndex,
                actionTarget.action(),
                savedPreferred.getAutoInviter());
    }

    private EventStageActionResultDto applyGeneratedSlotStageAction(
            String parentEventId,
            String slotSourceId,
            List<ActivityEvent> parentDocuments,
            ActivityEvent preferredParent,
            List<SubEventItem> slotStages,
            int stageIndex,
            StageActionTarget actionTarget,
            String actorUserId) {
        if (slotStages == null || stageIndex < 0 || stageIndex >= slotStages.size()) {
            return null;
        }
        String nowIso = Instant.now().toString();
        SubEventItem savedStage = copySubEventWithStageStatus(
                slotStages.get(stageIndex),
                actionTarget.nextStatus(),
                actionTarget.reason(),
                nowIso,
                STAGE_STATUS_FINALIZED.equals(actionTarget.nextStatus()) ? nowIso : null,
                STAGE_STATUS_FINALIZED.equals(actionTarget.nextStatus()) ? actorUserId : null);

        List<ActivityEvent> savedParentDocuments = parentDocuments == null ? List.of() : parentDocuments;
        ActivityEvent savedPreferredParent = preferredParent;
        if (STAGE_ACTION_START.equals(actionTarget.action())) {
            List<ActivityEvent> updatedParents = new ArrayList<>();
            for (ActivityEvent document : savedParentDocuments) {
                ActivityEvent next = cloneDocument(document);
                next.setAutoInviter(false);
                next.setUpdatedDate(nowIso);
                next.setUpdatedUser(actorUserId);
                next.setAdmins(resolveAdminUserIds(next.getSourceId(), next.getCreatorUserId()));
                next.normalizeLifecycleState();
                updatedParents.add(next);
            }
            if (!updatedParents.isEmpty()) {
                savedParentDocuments = activityEventsRepository.saveAll(updatedParents);
                savedPreferredParent = computePreferredEventRecords(savedParentDocuments).stream()
                        .findFirst()
                        .orElse(preferredParent);
                syncStageReminderTasksForSavedEvents(savedParentDocuments, actorUserId);
            }
            EventScheduler scheduler = eventSchedulerProvider == null ? null : eventSchedulerProvider.getIfAvailable();
            if (scheduler != null) {
                scheduler.generateRandomPlansForEvents(List.of(slotSourceId));
            }
        }

        boolean finalStage = stageIndex == slotStages.size() - 1;
        TournamentResultSummary resultSummary = resolveTournamentResultSummary(savedPreferredParent, savedStage, finalStage);
        saveSubEventStageRuntime(slotSourceId, savedPreferredParent, savedStage, actorUserId);
        affinityRecomputeTaskService.enqueueEventChanged(parentEventId, actorUserId);
        enqueueStageStatusNotifications(savedPreferredParent, savedStage, actionTarget.action(), actionTarget.nextStatus(), actorUserId, finalStage, resultSummary);
        postStageChatMessage(savedPreferredParent, savedStage, actionTarget.action(), actionTarget.nextStatus(), finalStage, resultSummary);
        adminTelemetryService.record("event.stage.action", "events", parentEventId, actorUserId, 1L, Map.of(
                "action", actionTarget.action(),
                "stageStatus", actionTarget.nextStatus(),
                "stageId", firstNonBlank(normalizeId(savedStage.id()), Integer.toString(stageIndex))));
        if (!savedParentDocuments.isEmpty()) {
            userActivityCountersService.refreshEventCountersForDocuments(savedParentDocuments);
        }
        return toStageActionResult(
                slotSourceId,
                savedStage,
                stageIndex,
                actionTarget.action(),
                STAGE_ACTION_START.equals(actionTarget.action()) ? Boolean.FALSE : savedPreferredParent.getAutoInviter());
    }

    private List<SubEventItem> stageActionSlotSubEvents(
            String parentEventId,
            String slotSourceId,
            ActivityEvent parent,
            EventStageActionRequestDto request) {
        ActivityEvent slotRecord = loadEventDocumentsBySourceIds(List.of(slotSourceId)).stream()
                .filter(this::isGeneratedSlotRecord)
                .findFirst()
                .orElse(null);
        List<SubEventItem> materializedStages = cloneSubEvents(slotRecord == null ? null : slotRecord.getSubEvents());
        if (!materializedStages.isEmpty()) {
            return withStageRuntimeStates(slotSourceId, materializedStages);
        }
        if (slotRecord != null && activityEventSubEventsMapper != null) {
            EventSubEventsSlotDto slot = activityEventSubEventsMapper.toSlotDtos(parentEventId, slotRecord, null).stream()
                    .findFirst()
                    .orElse(null);
            if (slot != null) {
                return withStageRuntimeStates(slotSourceId, SubEventItemMapper.toRecordList(slot.subEventItems()));
            }
        }
        if (parent == null || activityEventSubEventsMapper == null) {
            return List.of();
        }
        String slotDate = generatedSlotDateFromSourceId(parentEventId, slotSourceId);
        List<EventSubEventsQueryDto> queries = StringUtils.hasText(slotDate)
                ? List.of(
                        new EventSubEventsQueryDto(request.userId(), parentEventId, "upcoming", "day", slotDate, slotDate, slotDate, false),
                        new EventSubEventsQueryDto(request.userId(), parentEventId, "past", "day", slotDate, slotDate, slotDate, false))
                : List.of(
                        new EventSubEventsQueryDto(request.userId(), parentEventId, "upcoming", "day", null, null, null, false),
                        new EventSubEventsQueryDto(request.userId(), parentEventId, "past", "day", null, null, null, false));
        for (EventSubEventsQueryDto query : queries) {
            EventSubEventsSlotDto slot = activityEventSubEventsMapper.toSlotDtos(parentEventId, parent, query).stream()
                    .filter(candidate -> slotSourceId.equals(normalizeId(candidate == null ? null : candidate.slotSourceId()))
                            || slotSourceId.equals(normalizeId(candidate == null ? null : candidate.id())))
                    .findFirst()
                    .orElse(null);
            if (slot != null) {
                return withStageRuntimeStates(slotSourceId, SubEventItemMapper.toRecordList(slot.subEventItems()));
            }
        }
        return List.of();
    }

    private List<SubEventItem> withStageRuntimeStates(String ownerId, List<SubEventItem> stages) {
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerId) || stages == null || stages.isEmpty()) {
            return stages == null ? List.of() : stages;
        }
        List<SubEventItem> updated = new ArrayList<>();
        for (SubEventItem stage : stages) {
            String subEventId = normalizeId(stage == null ? null : stage.id());
            if (!StringUtils.hasText(subEventId)) {
                updated.add(stage);
                continue;
            }
            ActivitySubEventStageRuntimeStateDto runtime = activitySubEventStageRuntimeRepository
                    .findByOwnerIdAndSubEventId(normalizedOwnerId, subEventId)
                    .map(activitySubEventStageRuntimeMapper::toDto)
                    .orElse(null);
            if (runtime == null) {
                updated.add(stage);
                continue;
            }
            updated.add(copySubEventWithStageStatus(
                    stage,
                    firstNonBlank(runtime.stageStatus(), stage.stageStatus()),
                    firstNonBlank(runtime.stageStatusReason(), stage.stageStatusReason()),
                    firstNonBlank(runtime.stageStatusUpdatedAt(), stage.stageStatusUpdatedAt()),
                    firstNonBlank(runtime.stageFinalizedAt(), stage.stageFinalizedAt()),
                    firstNonBlank(runtime.stageFinalizedByUserId(), stage.stageFinalizedByUserId())));
        }
        return updated;
    }

    private String generatedSlotDateFromSourceId(String parentEventId, String slotSourceId) {
        String prefix = normalizeId(parentEventId) + ":slot:";
        String normalizedSlotSourceId = normalizeId(slotSourceId);
        if (!StringUtils.hasText(prefix) || !normalizedSlotSourceId.startsWith(prefix)) {
            return null;
        }
        String tail = normalizedSlotSourceId.substring(prefix.length());
        int dateStart = tail.indexOf(':');
        if (dateStart < 0 || dateStart + 1 >= tail.length()) {
            return null;
        }
        try {
            return Instant.parse(tail.substring(dateStart + 1)).atOffset(ZoneOffset.UTC).toLocalDate().toString();
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private void saveSubEventStageRuntime(String ownerId, ActivityEvent event, SubEventItem stage, String actorUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(stage == null ? null : stage.id());
        if (!StringUtils.hasText(normalizedOwnerId) || !StringUtils.hasText(normalizedSubEventId)) {
            return;
        }
        ActivitySubEventStageRuntime existing = activitySubEventStageRuntimeRepository
                .findByOwnerIdAndSubEventId(normalizedOwnerId, normalizedSubEventId)
                .orElse(null);
        int autoGroupsCount = autoTournamentGroupCount(event, stage);
        ActivitySubEventStageRuntime next = activitySubEventStageRuntimeMapper.toRecord(
                new ActivitySubEventStageRuntimeStateDto(
                        normalizedOwnerId,
                        normalizedSubEventId,
                        stage.stageStatus(),
                        stage.stageStatusReason(),
                        stage.stageStatusUpdatedAt(),
                        stage.stageFinalizedAt(),
                        stage.stageFinalizedByUserId(),
                        autoGroupsCount),
                existing,
                actorUserId);
        if (next != null) {
            next.setGroupsCount(autoGroupsCount + manualGroupCountForRuntime(next.getId()));
            activitySubEventStageRuntimeRepository.save(next);
        }
    }

    private int manualGroupCountForRuntime(String runtimeRecordId) {
        String normalizedRuntimeRecordId = normalizeId(runtimeRecordId);
        if (!StringUtils.hasText(normalizedRuntimeRecordId)) {
            return 0;
        }
        List<ActivitySubEventGroup> groups = activitySubEventGroupsRepository
                .findByOwnerIdAndStatusNot(normalizedRuntimeRecordId, RUNTIME_STATUS_DELETED);
        return groups == null ? 0 : groups.size();
    }

    public EventParticipationActionResultDto requestJoin(EventActionRequestDto request) {
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
            return withCounterDelta(
                    toParticipationActionResult(sourceId, slotSourceId, "unchanged", null, preferred, null, request),
                    null);
        }
        if (!accessControlService.canCurrentActorJoinEvent(viewer.userId(), sourceId)) {
            return withCounterDelta(
                    toParticipationActionResult(sourceId, slotSourceId, "unchanged", null, preferred, null, request),
                    null);
        }
        ActivitiesMembersService.OwnerMembersSnapshot beforeSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
        UserEventActivityState beforeState = eventActivityState(preferred, beforeSnapshot, viewer.userId());
        boolean checkoutBasketUpdateRequested = isPendingCheckoutBasketUpdateRequest(request, viewer.userId(), requestedSourceId);
        syncCheckoutBasketForJoin(request);
        boolean alreadyAccepted = isAcceptedMember(beforeSnapshot, viewer.userId());
        boolean acceptingInvitation = activitiesMembersService.hasPendingInvitation(sourceId, viewer.userId());
        boolean approvalRequested = acceptingInvitation
                ? activitiesMembersService.pendingInvitationRequiresAdminApproval(sourceId, viewer.userId())
                : isApprovalRequested(request)
                        || (Boolean.TRUE.equals(preferred.getApprovalRequired()) && !alreadyAccepted);
        boolean waitingList = isWaitlistRequested(request) || isRecordFull(preferred);
        boolean accepted = !waitingList && !approvalRequested && isConfirmedBooking(request, preferred);

        if (StringUtils.hasText(slotSourceId)) {
            final String requestedSlotSourceId = Objects.requireNonNull(slotSourceId);
            ActivityEvent slotRecord = loadEventDocumentsBySourceIds(List.of(requestedSlotSourceId)).stream()
                    .filter(this::isGeneratedSlotRecord)
                    .findFirst()
                    .orElse(null);
            if (slotRecord != null) {
                waitingList = waitingList || isRecordFull(slotRecord);
                accepted = !waitingList && !approvalRequested && isConfirmedBooking(request, preferred);
                ActivitiesMembersService.OwnerMembersSnapshot sourceSnapshot =
                        activitiesMembersService.requestJoin(
                                sourceId,
                                viewer.user(),
                                preferred,
                                accepted,
                                waitingList,
                                approvalRequested);
                ActivitiesMembersService.OwnerMembersSnapshot slotSnapshot =
                        activitiesMembersService.requestJoin(slotSourceId, viewer.user(), slotRecord, accepted, waitingList, approvalRequested);
                boolean joinedSlot = isAcceptedMember(slotSnapshot, viewer.userId());
                if (joinedSlot) {
                    markAcceptedCheckoutBasketSucceeded(request, viewer.userId(), sourceId, slotSourceId);
                    recordJoinPayment(request, viewer.userId(), sourceId, slotSourceId, slotRecord.getStartAtIso(), preferred);
                } else if (checkoutBasketUpdateRequested) {
                    enqueueCheckoutBasketUpdatedNotification(preferred, viewer.user(), pendingReasonForAction(waitingList, approvalRequested));
                }
                ActivityEvent refreshedSlotRecord = loadEventDocumentsBySourceIds(List.of(requestedSlotSourceId)).stream()
                        .filter(this::isGeneratedSlotRecord)
                        .findFirst()
                        .orElse(slotRecord);
                ActivityEvent refreshedSource = findPreferredEventRecord(sourceId);
                return withCounterDelta(
                        toParticipationActionResult(
                                sourceId,
                                slotSourceId,
                                joinedSlot ? "accepted" : "pending",
                                joinedSlot ? null : pendingReasonForAction(waitingList, approvalRequested),
                                refreshedSlotRecord,
                                slotSnapshot,
                                request),
                        sourceSnapshot != null && sourceSnapshot.mutationApplied()
                                ? eventActivityTransition(
                                        beforeState,
                                        eventActivityState(
                                                refreshedSource == null ? preferred : refreshedSource,
                                                sourceSnapshot,
                                                viewer.userId()),
                                        false)
                                : null);
            }
        }

        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                activitiesMembersService.requestJoin(sourceId, viewer.user(), preferred, accepted, waitingList, approvalRequested);
        boolean joined = isAcceptedMember(snapshot, viewer.userId());
        if (joined) {
            markAcceptedCheckoutBasketSucceeded(request, viewer.userId(), sourceId, null);
            recordJoinPayment(request, viewer.userId(), sourceId, null, preferred.getStartAtIso(), preferred);
        } else if (checkoutBasketUpdateRequested) {
            enqueueCheckoutBasketUpdatedNotification(preferred, viewer.user(), pendingReasonForAction(waitingList, approvalRequested));
        }
        ActivityEvent refreshed = findPreferredEventRecord(sourceId);
        return withCounterDelta(
                toParticipationActionResult(
                        sourceId,
                        null,
                        joined ? "accepted" : "pending",
                        joined ? null : pendingReasonForAction(waitingList, approvalRequested),
                        refreshed == null ? preferred : refreshed,
                        snapshot,
                        request),
                snapshot != null && snapshot.mutationApplied()
                        ? eventActivityTransition(
                                beforeState,
                                eventActivityState(
                                        refreshed == null ? preferred : refreshed,
                                        snapshot,
                                        viewer.userId()),
                                false)
                        : null);
    }

    private void markAcceptedCheckoutBasketSucceeded(
            EventActionRequestDto request,
            String userId,
            String sourceId,
            String slotSourceId) {
        String checkoutState = safeText(request == null ? null : request.checkoutState());
        if (!StringUtils.hasText(checkoutState)) {
            return;
        }
        eventCheckoutBasketService.updateBasketState(new EventCheckoutStateChangeRequestDto(
                userId,
                sourceId,
                slotSourceId,
                checkoutState,
                "succeeded",
                null,
                request.paymentSessionId()));
    }

    public EventParticipationActionResultDto payEventCheckout(EventCheckoutStateChangeRequestDto request, String provider) {
        if (request == null) {
            return null;
        }
        EventCheckoutBasketDto basket = saveSubmittedPaymentBasket(request);
        if (basket == null) {
            basket = eventCheckoutBasketService.loadBasketByEvent(request.userId(), request.sourceId());
        }
        if (basket == null || basket.items() == null || basket.items().isEmpty()) {
            return null;
        }
        String slotSourceId = firstNonBlank(basket.slotSourceId(), request.slotSourceId(), null);
        String paymentMembershipSourceId = firstNonBlank(slotSourceId, request.sourceId(), null);
        ActivitiesMembersService.OwnerMembersSnapshot acceptedBeforePaymentSnapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizeId(paymentMembershipSourceId));
        boolean acceptedBeforePayment = isAcceptedMember(acceptedBeforePaymentSnapshot, request.userId());
        ActivityEvent paymentRecord = StringUtils.hasText(slotSourceId)
                ? loadEventDocumentsBySourceIds(List.of(slotSourceId)).stream()
                        .filter(Objects::nonNull)
                        .findFirst()
                        .orElse(null)
                : findPreferredEventRecord(request.sourceId());
        if (!paymentService.hasJoinedEventJoin(request.userId(), paymentMembershipSourceId)
                && isRecordFull(paymentRecord)) {
            eventCheckoutBasketService.updateBasketState(new EventCheckoutStateChangeRequestDto(
                    request.userId(),
                    request.sourceId(),
                    slotSourceId,
                    "waiting",
                    null,
                    "waitlist",
                    null));
            return withCounterDelta(
                    toParticipationActionResult(
                            request.sourceId(),
                            slotSourceId,
                            "pending",
                            "waitlist",
                            paymentRecord == null ? findPreferredEventRecord(request.sourceId()) : paymentRecord,
                            acceptedBeforePaymentSnapshot,
                            null),
                    null);
        }
        EventCheckoutRequestDto paymentRequest = checkoutRequestFromBasket(request, basket);
        EventCheckoutSessionDto session = paymentService.payCheckout(paymentRequest, provider);
        EventActionRequestDto joinRequest = new EventActionRequestDto(
                request.userId(),
                request.sourceId(),
                slotSourceId,
                basket.items().stream()
                        .map(item -> normalizeId(item.subEventId()))
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList(),
                List.of(),
                List.of(),
                session == null ? null : session.id(),
                Boolean.TRUE,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                basket.appliedPromoCodes());
        try {
            EventParticipationActionResultDto result = acceptedBeforePayment
                    ? toParticipationActionResult(
                            request.sourceId(),
                            slotSourceId,
                            "accepted",
                            null,
                            paymentRecord == null ? findPreferredEventRecord(request.sourceId()) : paymentRecord,
                            acceptedBeforePaymentSnapshot,
                            joinRequest)
                    : requestJoin(joinRequest);
            if (result == null || !"accepted".equals(safeText(result.membershipStatus()))) {
                eventCheckoutBasketService.updateBasketState(new EventCheckoutStateChangeRequestDto(
                        request.userId(),
                        request.sourceId(),
                        slotSourceId,
                        "approval".equals(safeText(result == null ? null : result.pendingReason()))
                                ? "approval-pending"
                                : "waitlist".equals(safeText(result == null ? null : result.pendingReason()))
                                        ? "waiting"
                                        : "confirmed",
                        null,
                        result == null ? null : result.pendingReason(),
                        session == null ? null : session.id()));
                return result;
            }
            eventCheckoutBasketService.updateBasketState(new EventCheckoutStateChangeRequestDto(
                    request.userId(),
                    request.sourceId(),
                    slotSourceId,
                    "pay",
                    "succeeded",
                    null,
                    session == null ? null : session.id()));
            return result;
        } catch (RuntimeException exception) {
            eventCheckoutBasketService.updateBasketState(new EventCheckoutStateChangeRequestDto(
                    request.userId(),
                    request.sourceId(),
                    slotSourceId,
                    "pay",
                    "failed",
                    null,
                    session == null ? null : session.id()));
            throw exception;
        }
    }

    private EventCheckoutBasketDto saveSubmittedPaymentBasket(EventCheckoutStateChangeRequestDto request) {
        EventCheckoutRequestDto checkout = request == null ? null : request.checkoutRequest();
        if (checkout == null || checkout.basketItems() == null || checkout.basketItems().isEmpty()) {
            return null;
        }
        return eventCheckoutBasketService.saveBasket(new EventCheckoutRequestDto(
                request.userId(),
                request.sourceId(),
                firstNonBlank(checkout.slotSourceId(), request.slotSourceId(), null),
                checkout.optionalSubEventIds(),
                checkout.assetSelections(),
                checkout.acceptedPolicyIds(),
                checkout.basketItems(),
                checkout.pricingSummaryRows(),
                "confirmed",
                checkout.lineItems(),
                checkout.totalAmount(),
                checkout.currency(),
                null,
                checkout.appliedPromoCodes()));
    }

    private void syncCheckoutBasketForJoin(EventActionRequestDto request) {
        String checkoutState = safeText(request == null ? null : request.checkoutState());
        if (!StringUtils.hasText(checkoutState)) {
            return;
        }
        String pendingReason = pendingReasonForCheckoutState(checkoutState, request.pendingReason());
        String userId = normalizeId(request.userId());
        String sourceId = normalizeId(request.sourceId());
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(sourceId)) {
            return;
        }
        List<EventCheckoutBasketItemDto> basketItems = request.basketItems() == null
                ? List.of()
                : request.basketItems().stream().filter(Objects::nonNull).toList();
        if (!basketItems.isEmpty()) {
            eventCheckoutBasketService.saveBasket(new EventCheckoutRequestDto(
                    userId,
                    sourceId,
                    request.slotSourceId(),
                    request.optionalSubEventIds(),
                    request.assetSelections(),
                    request.acceptedPolicyIds(),
                    basketItems,
                    request.pricingSummaryRows(),
                    checkoutState,
                    request.lineItems(),
                    request.totalAmount(),
                    request.currency(),
                    pendingReason,
                    request.appliedPromoCodes()));
            return;
        }
        eventCheckoutBasketService.updateBasketState(new EventCheckoutStateChangeRequestDto(
                userId,
                sourceId,
                request.slotSourceId(),
                checkoutState,
                null,
                pendingReason,
                request.paymentSessionId()));
    }

    private boolean isPendingCheckoutBasketUpdateRequest(
            EventActionRequestDto request,
            String userId,
            String sourceId) {
        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        if (request == null || !StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedSourceId)) {
            return false;
        }
        String checkoutState = safeText(request == null ? null : request.checkoutState());
        if (!"waiting".equals(checkoutState) && !"approval-pending".equals(checkoutState)) {
            return false;
        }
        if (request.basketItems() == null || request.basketItems().isEmpty()) {
            return false;
        }
        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedSourceId);
        return snapshot != null
                && (snapshot.pendingMemberUserIds().contains(normalizedUserId)
                        || snapshot.hasPendingRequest(normalizedUserId));
    }

    private void enqueueCheckoutBasketUpdatedNotification(
            ActivityEvent event,
            Users member,
            String pendingReason) {
        if (notificationOutboxService == null || event == null || member == null) {
            return;
        }
        String eventId = normalizeId(event.getSourceId());
        String memberUserId = normalizeId(member.getId());
        if (!StringUtils.hasText(eventId) || !StringUtils.hasText(memberUserId)) {
            return;
        }
        List<String> adminUserIds = resolveAdminUserIds(eventId, event.getCreatorUserId()).stream()
                .filter(userId -> !memberUserId.equals(normalizeId(userId)))
                .toList();
        if (adminUserIds.isEmpty()) {
            return;
        }
        boolean waitlist = "waitlist".equals(safeText(pendingReason));
        String eventTitle = firstNonBlank(event.getTitle(), "event");
        String memberName = firstNonBlank(member.getName(), memberUserId, "A member");
        String title = waitlist ? "Waitlist basket updated" : "Booking update needs re-approval";
        String body = waitlist
                ? memberName + " updated the waiting-list basket for " + eventTitle + ". Review the new selection."
                : memberName + " updated the checkout basket for " + eventTitle + ". Please re-approve the request.";
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", safeText(event.getTitle()));
        payload.put("memberUserId", memberUserId);
        payload.put("memberName", memberName);
        payload.put("pendingReason", safeText(pendingReason));
        payload.put("checkoutAction", "basket-update");
        payload.put("updatedAt", Instant.now().toString());
        notificationOutboxService.enqueue(new NotificationIntent(
                "event-checkout-basket-updated",
                "event",
                eventId,
                "event-admins",
                adminUserIds,
                title,
                body,
                "/game",
                firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "event-checkout-basket-updated-" + eventId + "-" + memberUserId,
                payload,
                memberUserId));
    }

    private EventCheckoutRequestDto checkoutRequestFromBasket(
            EventCheckoutStateChangeRequestDto request,
            EventCheckoutBasketDto basket) {
        return new EventCheckoutRequestDto(
                request.userId(),
                request.sourceId(),
                firstNonBlank(basket.slotSourceId(), request.slotSourceId(), null),
                basket.items().stream()
                        .map(item -> normalizeId(item.subEventId()))
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList(),
                List.of(),
                List.of(),
                basket.items(),
                basket.pricingSummaryRows(),
                "pay",
                basket.lineItems(),
                basket.totalAmount(),
                basket.currency(),
                null,
                basket.appliedPromoCodes());
    }

    private EventParticipationActionResultDto toParticipationActionResult(
            String sourceId,
            String slotSourceId,
            String membershipStatus,
            String pendingReason,
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot,
            EventActionRequestDto request) {
        ActivitiesMembersService.OwnerMembersSnapshot resolvedSnapshot = snapshot == null
                ? resolveSnapshot(normalizeId(record == null ? sourceId : record.getSourceId()))
                : snapshot;
        int acceptedMembers = resolvedSnapshot == null
                ? normalizeCount(record == null ? null : record.getAcceptedMembers())
                : resolvedSnapshot.acceptedMembers();
        int pendingMembers = resolvedSnapshot == null
                ? normalizeCount(record == null ? null : record.getPendingMembers())
                : resolvedSnapshot.pendingMembers();
        int capacityTotal = resolvedSnapshot == null || resolvedSnapshot.capacityTotal() == null
                ? normalizeCount(record == null ? null : record.getCapacityTotal())
                : Math.max(0, resolvedSnapshot.capacityTotal());
        return new EventParticipationActionResultDto(
                normalizeId(sourceId),
                StringUtils.hasText(slotSourceId) ? normalizeId(slotSourceId) : null,
                "join",
                safeText(membershipStatus),
                pendingReasonForDto(pendingReason),
                acceptedMembers,
                pendingMembers,
                Math.max(acceptedMembers, capacityTotal),
                resolveFullForActionResult(record, acceptedMembers, capacityTotal),
                normalizeId(request == null ? null : request.paymentSessionId()),
                true,
                null);
    }

    private EventParticipationActionResultDto toParticipationLeaveResult(
            String sourceId,
            String slotSourceId,
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot,
            EventActionRequestDto request,
            boolean membershipChanged,
            String reason) {
        int acceptedMembers = snapshot == null
                ? normalizeCount(record == null ? null : record.getAcceptedMembers())
                : snapshot.acceptedMembers();
        int pendingMembers = snapshot == null
                ? normalizeCount(record == null ? null : record.getPendingMembers())
                : snapshot.pendingMembers();
        int capacityTotal = snapshot == null || snapshot.capacityTotal() == null
                ? normalizeCount(record == null ? null : record.getCapacityTotal())
                : Math.max(0, snapshot.capacityTotal());
        return new EventParticipationActionResultDto(
                normalizeId(sourceId),
                StringUtils.hasText(slotSourceId) ? normalizeId(slotSourceId) : null,
                "leave",
                membershipChanged || "already-applied".equals(reason) ? "trashed" : "unchanged",
                null,
                acceptedMembers,
                pendingMembers,
                Math.max(acceptedMembers, capacityTotal),
                resolveFullForActionResult(record, acceptedMembers, capacityTotal),
                normalizeId(firstNonBlank(
                        request == null ? null : request.checkoutSessionId(),
                        request == null ? null : request.paymentSessionId(),
                        null)),
                membershipChanged,
                reason);
    }

    private EventParticipationActionResultDto toParticipationRestoreResult(
            String sourceId,
            String restoredUserId,
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot,
            boolean restored,
            String reason) {
        int acceptedMembers = snapshot == null
                ? normalizeCount(record == null ? null : record.getAcceptedMembers())
                : snapshot.acceptedMembers();
        int pendingMembers = snapshot == null
                ? normalizeCount(record == null ? null : record.getPendingMembers())
                : snapshot.pendingMembers();
        int capacityTotal = snapshot == null || snapshot.capacityTotal() == null
                ? normalizeCount(record == null ? null : record.getCapacityTotal())
                : Math.max(0, snapshot.capacityTotal());
        String normalizedRestoredUserId = normalizeId(restoredUserId);
        String membershipStatus = "unchanged";
        if (restored) {
            if (snapshot != null && snapshot.acceptedMemberUserIds().contains(normalizedRestoredUserId)) {
                membershipStatus = "accepted";
            } else if (snapshot != null && snapshot.pendingMemberUserIds().contains(normalizedRestoredUserId)) {
                membershipStatus = "pending";
            } else if (snapshot != null && snapshot.invitedMemberUserIds().contains(normalizedRestoredUserId)) {
                membershipStatus = "invited";
            } else {
                membershipStatus = "restored";
            }
        }
        return new EventParticipationActionResultDto(
                normalizeId(sourceId),
                null,
                "restore",
                membershipStatus,
                null,
                acceptedMembers,
                pendingMembers,
                Math.max(acceptedMembers, capacityTotal),
                resolveFullForActionResult(record, acceptedMembers, capacityTotal),
                null,
                restored,
                reason);
    }

    private EventParticipationActionResultDto toLifecycleActionResult(
            String sourceId,
            String action,
            ActivityEvent record,
            boolean changed,
            String reason) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveSnapshot(normalizeId(sourceId));
        int acceptedMembers = snapshot == null
                ? normalizeCount(record == null ? null : record.getAcceptedMembers())
                : snapshot.acceptedMembers();
        int pendingMembers = snapshot == null
                ? normalizeCount(record == null ? null : record.getPendingMembers())
                : snapshot.pendingMembers();
        int capacityTotal = snapshot == null || snapshot.capacityTotal() == null
                ? normalizeCount(record == null ? null : record.getCapacityTotal())
                : Math.max(0, snapshot.capacityTotal());
        return new EventParticipationActionResultDto(
                normalizeId(sourceId),
                null,
                safeText(action),
                record == null ? "unchanged" : safeText(record.getStatus()).toLowerCase(Locale.US),
                null,
                acceptedMembers,
                pendingMembers,
                Math.max(acceptedMembers, capacityTotal),
                resolveFullForActionResult(record, acceptedMembers, capacityTotal),
                null,
                changed,
                reason);
    }

    private EventParticipationActionResultDto withCounterDelta(
            EventParticipationActionResultDto result,
            UserActivityCounterDeltaDto counterDelta) {
        if (result == null) {
            return null;
        }
        return new EventParticipationActionResultDto(
                result.sourceId(),
                result.slotSourceId(),
                result.action(),
                result.membershipStatus(),
                result.pendingReason(),
                result.acceptedMembers(),
                result.pendingMembers(),
                result.capacityTotal(),
                result.full(),
                result.paymentSessionId(),
                result.changed(),
                result.reason(),
                counterDelta);
    }

    private UserActivityCounterDeltaDto eventActivityTransition(
            UserEventActivityState before,
            UserEventActivityState after,
            boolean eventChatAdded) {
        UserEventActivityState safeBefore = before == null ? UserEventActivityState.none() : before;
        UserEventActivityState safeAfter = after == null ? UserEventActivityState.none() : after;
        Integer chats = eventChatAdded ? 1 : null;
        Integer invitations = counterDirection(
                safeBefore.bucket() == UserEventActivityBucket.INVITATION,
                safeAfter.bucket() == UserEventActivityBucket.INVITATION);
        Integer events = counterDirection(
                safeBefore.bucket() == UserEventActivityBucket.ACTIVE,
                safeAfter.bucket() == UserEventActivityBucket.ACTIVE);
        Integer hosting = counterDirection(
                safeBefore.bucket() == UserEventActivityBucket.HOSTING,
                safeAfter.bucket() == UserEventActivityBucket.HOSTING);
        UserChatCounterDeltaDto chat = eventChatAdded
                ? new UserChatCounterDeltaDto(1, 1, null, null, null, null)
                : null;
        UserEventCounterDeltaDto event = new UserEventCounterDeltaDto(
                counterDirection(isAllEventBucket(safeBefore.bucket()), isAllEventBucket(safeAfter.bucket())),
                counterDirection(
                        safeBefore.bucket() == UserEventActivityBucket.ACTIVE,
                        safeAfter.bucket() == UserEventActivityBucket.ACTIVE),
                counterDirection(
                        safeBefore.bucket() == UserEventActivityBucket.PENDING,
                        safeAfter.bucket() == UserEventActivityBucket.PENDING),
                counterDirection(
                        safeBefore.bucket() == UserEventActivityBucket.INVITATION,
                        safeAfter.bucket() == UserEventActivityBucket.INVITATION),
                counterDirection(
                        safeBefore.bucket() == UserEventActivityBucket.HOSTING,
                        safeAfter.bucket() == UserEventActivityBucket.HOSTING),
                counterDirection(safeBefore.draft(), safeAfter.draft()),
                counterDirection(
                        safeBefore.bucket() == UserEventActivityBucket.TRASH,
                        safeAfter.bucket() == UserEventActivityBucket.TRASH));
        if (!hasValue(event.all(), event.active(), event.pending(), event.invitations(),
                event.hosting(), event.drafts(), event.trash())) {
            event = null;
        }
        if (!hasValue(chats, invitations, events, hosting, chat, event)) {
            return null;
        }
        return new UserActivityCounterDeltaDto(
                null,
                chats,
                invitations,
                events,
                hosting,
                null,
                null,
                null,
                null,
                null,
                null,
                chat,
                event,
                null,
                null,
                null,
                null,
                null);
    }

    private UserEventActivityState eventActivityState(
            ActivityEvent event,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot,
            String userId) {
        String normalizedUserId = normalizeId(userId);
        if (event == null || !StringUtils.hasText(normalizedUserId)) {
            return UserEventActivityState.none();
        }
        boolean invited = containsUser(
                snapshot == null ? event.getInvitedMemberUserIds() : snapshot.invitedMemberUserIds(),
                normalizedUserId);
        boolean hosting = isEventHostForUser(event, snapshot, normalizedUserId);
        boolean pending = containsUser(
                    snapshot == null ? event.getPendingMemberUserIds() : snapshot.pendingMemberUserIds(),
                    normalizedUserId)
                || containsUser(
                    snapshot == null ? event.getPendingRequestMemberUserIds() : snapshot.pendingRequestMemberUserIds(),
                    normalizedUserId);
        boolean accepted = containsUser(
                snapshot == null ? event.getAcceptedMemberUserIds() : snapshot.acceptedMemberUserIds(),
                normalizedUserId);
        String status = safeText(event.getStatus());
        boolean trashed = Boolean.TRUE.equals(event.getIsTrashed())
                || ActivityEvent.STATUS_TRASHED.equals(status);
        if (trashed && (invited || hosting || pending || accepted)) {
            return UserEventActivityState.trash();
        }
        if (invited) {
            return new UserEventActivityState(UserEventActivityBucket.INVITATION, false);
        }
        if (hosting) {
            boolean draft = Boolean.FALSE.equals(event.getPublished())
                    || ActivityEvent.STATUS_DRAFT.equals(status);
            return new UserEventActivityState(UserEventActivityBucket.HOSTING, draft);
        }
        if (pending) {
            return new UserEventActivityState(UserEventActivityBucket.PENDING, false);
        }
        if (accepted) {
            return new UserEventActivityState(UserEventActivityBucket.ACTIVE, false);
        }
        return UserEventActivityState.none();
    }

    private boolean isEventHostForUser(
            ActivityEvent event,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot,
            String userId) {
        String normalizedUserId = normalizeId(userId);
        if (event == null || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        if (normalizedUserId.equals(normalizeId(event.getCreatorUserId()))) {
            return true;
        }
        if (snapshot != null) {
            return snapshot.hasAcceptedAdminRole(normalizedUserId);
        }
        return normalizeIds(event.getAdmins()).contains(normalizedUserId);
    }

    private boolean containsUser(Collection<String> userIds, String userId) {
        String normalizedUserId = normalizeId(userId);
        return StringUtils.hasText(normalizedUserId)
                && normalizeIds(userIds).contains(normalizedUserId);
    }

    private boolean isAllEventBucket(UserEventActivityBucket bucket) {
        return bucket == UserEventActivityBucket.ACTIVE
                || bucket == UserEventActivityBucket.PENDING
                || bucket == UserEventActivityBucket.INVITATION
                || bucket == UserEventActivityBucket.HOSTING;
    }

    private Integer counterDirection(boolean before, boolean after) {
        if (before == after) {
            return null;
        }
        return after ? 1 : -1;
    }

    private boolean hasValue(Object... values) {
        return values != null && java.util.Arrays.stream(values).anyMatch(Objects::nonNull);
    }

    private enum UserEventActivityBucket {
        NONE,
        ACTIVE,
        PENDING,
        INVITATION,
        HOSTING,
        TRASH
    }

    private record UserEventActivityState(UserEventActivityBucket bucket, boolean draft) {
        private static UserEventActivityState none() {
            return new UserEventActivityState(UserEventActivityBucket.NONE, false);
        }

        private static UserEventActivityState trash() {
            return new UserEventActivityState(UserEventActivityBucket.TRASH, false);
        }
    }

    private String pendingReasonForAction(boolean waitingList, boolean approvalRequested) {
        if (waitingList) {
            return "waitlist";
        }
        if (approvalRequested) {
            return "approval";
        }
        return null;
    }

    private String pendingReasonForDto(String pendingReason) {
        String normalized = safeText(pendingReason);
        if ("waitlist".equals(normalized)) {
            return "waitlist";
        }
        if ("approval".equals(normalized)) {
            return "approval";
        }
        return null;
    }

    private String pendingReasonForCheckoutState(String checkoutState, String pendingReason) {
        String normalizedState = safeText(checkoutState);
        if ("waiting".equals(normalizedState)) {
            return "waitlist";
        }
        if ("approval-pending".equals(normalizedState)) {
            return "approval";
        }
        if (StringUtils.hasText(normalizedState)) {
            return null;
        }
        return pendingReasonForDto(pendingReason);
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
            SubEventItem stage,
            List<SubEventItem> stages,
            int stageIndex) {
        String status = normalizeStageStatus(stage == null ? null : stage.stageStatus());
        return switch (safeText(action)) {
            case STAGE_ACTION_START -> STAGE_STATUS_ERROR.equals(status)
                    || (STAGE_STATUS_START_REVIEW.equals(status) && isStageDatePassed(stage == null ? null : stage.startAt()));
            case STAGE_ACTION_CLOSE -> STAGE_STATUS_ERROR.equals(status)
                    || ((STAGE_STATUS_ACTIVE.equals(status) || STAGE_STATUS_START_REVIEW.equals(status))
                            && isStageDatePassed(stage == null ? null : stage.endAt()));
            case STAGE_ACTION_FINALIZE -> STAGE_STATUS_SCORE_REVIEW.equals(status);
            case STAGE_ACTION_REOPEN -> STAGE_STATUS_FINALIZED.equals(status) && canReopenScores(stages, stageIndex);
            case STAGE_ACTION_SUSPEND -> STAGE_STATUS_ACTIVE.equals(status) && isStageInScheduleWindow(stage);
            case STAGE_ACTION_RESUME -> STAGE_STATUS_SUSPENDED.equals(status);
            default -> false;
        };
    }

    private StageActionTarget effectiveStageActionTarget(StageActionTarget actionTarget, SubEventItem stage) {
        if (actionTarget == null || !STAGE_ACTION_RESUME.equals(actionTarget.action())) {
            return actionTarget;
        }
        String nextStatus = isStageDatePassed(stage == null ? null : stage.endAt())
                ? STAGE_STATUS_SCORE_REVIEW
                : STAGE_STATUS_ACTIVE;
        return new StageActionTarget(actionTarget.action(), nextStatus, actionTarget.reason());
    }

    private boolean isStageStartAllowed(List<SubEventItem> stages, int stageIndex) {
        if (stages == null || stageIndex < 0 || stageIndex >= stages.size()) {
            return false;
        }
        if (stageIndex == 0) {
            return true;
        }
        SubEventItem previousStage = stages.get(stageIndex - 1);
        return STAGE_STATUS_FINALIZED.equals(normalizeStageStatus(previousStage == null ? null : previousStage.stageStatus()));
    }

    private boolean canReopenScores(List<SubEventItem> stages, int stageIndex) {
        return stages != null && stageIndex >= 0 && stageIndex < stages.size();
    }

    private boolean isStageInScheduleWindow(SubEventItem stage) {
        long startMs = toSortableDate(stage == null ? null : stage.startAt());
        long endMs = toSortableDate(stage == null ? null : stage.endAt());
        long nowMs = System.currentTimeMillis();
        return startMs > 0L && endMs > 0L && startMs <= nowMs && nowMs <= endMs;
    }

    private boolean isStageDatePassed(String value) {
        long timestamp = toSortableDate(value);
        return timestamp > 0L && timestamp <= System.currentTimeMillis();
    }

    private EventStageActionResultDto toStageActionResult(
            String sourceId,
            SubEventItem stage,
            int stageIndex,
            String action,
            Boolean autoInviter) {
        if (stage == null) {
            return null;
        }
        return new EventStageActionResultDto(
                normalizeId(sourceId),
                normalizeId(stage.id()),
                Math.max(0, stageIndex),
                safeText(action),
                firstNonBlank(stage.stageStatus(), STAGE_STATUS_START_REVIEW),
                safeText(stage.stageStatusReason()),
                safeText(stage.stageStatusUpdatedAt()),
                safeText(stage.stageFinalizedAt()),
                safeText(stage.stageFinalizedByUserId()),
                autoInviter);
    }

    private int resolveStageIndex(List<SubEventItem> stages, String subEventId, Integer fallbackIndex) {
        if (stages == null || stages.isEmpty()) {
            return -1;
        }
        String normalizedSubEventId = normalizeId(subEventId);
        if (StringUtils.hasText(normalizedSubEventId)) {
            for (int index = 0; index < stages.size(); index += 1) {
                SubEventItem candidate = stages.get(index);
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
            case STAGE_STATUS_ERROR -> STAGE_STATUS_ERROR;
            default -> STAGE_STATUS_ACTIVE;
        };
    }

    private String normalizeEventStatus(String status) {
        String normalized = safeText(status).toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case ActivityEvent.STATUS_DRAFT -> ActivityEvent.STATUS_DRAFT;
            case ActivityEvent.STATUS_TRASHED -> ActivityEvent.STATUS_TRASHED;
            case ActivityEvent.STATUS_UNDER_REVIEW -> ActivityEvent.STATUS_UNDER_REVIEW;
            case ActivityEvent.STATUS_BLOCKED -> ActivityEvent.STATUS_BLOCKED;
            case ActivityEvent.STATUS_DELETED -> ActivityEvent.STATUS_DELETED;
            case ActivityEvent.STATUS_INACTIVE -> ActivityEvent.STATUS_INACTIVE;
            default -> ActivityEvent.STATUS_ACTIVE;
        };
    }

    private SubEventItem copySubEventWithStageStatus(
            SubEventItem subEvent,
            String stageStatus,
            String stageStatusReason,
            String stageStatusUpdatedAt,
            String stageFinalizedAt,
            String stageFinalizedByUserId) {
        return new SubEventItem(
                subEvent.id(),
                subEvent.name(),
                subEvent.description(),
                subEvent.startAt(),
                subEvent.endAt(),
                subEvent.location(),
                subEvent.createdByUserId(),
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
            SubEventItem stage,
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
            SubEventItem stage,
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

    private void notifyParticipantsWhenTicketingEnabled(
            ActivityEvent previous,
            ActivityEvent event,
            ActivitiesMembersService.OwnerMembersSnapshot members,
            String actorUserId) {
        if (notificationOutboxService == null
                || previous == null
                || event == null
                || Boolean.TRUE.equals(previous.getTicketing())
                || !Boolean.TRUE.equals(event.getTicketing())) {
            return;
        }
        LinkedHashSet<String> recipientUserIds = new LinkedHashSet<>(members == null
                ? resolveAcceptedMemberUserIds(event)
                : members.acceptedMemberUserIds());
        recipientUserIds.remove(normalizeId(event.getCreatorUserId()));
        recipientUserIds.removeIf(userId -> !StringUtils.hasText(normalizeId(userId)));
        if (recipientUserIds.isEmpty()) {
            return;
        }
        String eventId = normalizeId(event.getSourceId());
        String eventTitle = firstNonBlank(event.getTitle(), "Event");
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", eventTitle);
        payload.put("eventScope", "tickets");
        payload.put("ticketing", "enabled");
        notificationOutboxService.enqueue(new NotificationIntent(
                "event-ticketing-enabled",
                "event",
                eventId,
                "accepted-participants",
                recipientUserIds,
                "Your event ticket is ready",
                "Ticketing is now enabled for " + eventTitle + ". Open Tickets to view your entry code.",
                "/game",
                firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "event-ticketing-enabled-" + eventId,
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
            SubEventItem firstStage = firstTournamentStage(event.getSubEvents());
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
            SubEventItem stage,
            String action,
            String nextStatus,
            boolean finalStage,
            TournamentResultSummary resultSummary) {
        if (chatService == null || event == null || stage == null) {
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
        chatService.postSystemMessage(eventId, text, action);
    }

    private void maybePostMemberLeftMessage(EventActionRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || chatService == null || !StringUtils.hasText(sourceId)) {
            return;
        }
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        if (preferred == null || isViewerAdmin(preferred, viewer.userId())) {
            return;
        }
        chatService.postSystemMessage(
                sourceId,
                firstNonBlank(viewer.user().getName(), viewer.userId(), "A member") + " left the event.",
                "member-left");
    }

    private String stageTitle(SubEventItem stage) {
        return firstNonBlank(stage == null ? null : stage.name(), stage == null ? null : stage.id(), "Stage");
    }

    private boolean isConfirmedBooking(EventActionRequestDto request, ActivityEvent preferred) {
        return Boolean.TRUE.equals(request == null ? null : request.bookingConfirmed());
    }

    private boolean isWaitlistRequested(EventActionRequestDto request) {
        return "waitlist".equals(pendingReasonForCheckoutState(
                request == null ? null : request.checkoutState(),
                request == null ? null : request.pendingReason()));
    }

    private boolean isApprovalRequested(EventActionRequestDto request) {
        return "approval".equals(pendingReasonForCheckoutState(
                request == null ? null : request.checkoutState(),
                request == null ? null : request.pendingReason()));
    }

    private boolean isRecordFull(ActivityEvent record) {
        if (record == null) {
            return false;
        }
        if (Boolean.TRUE.equals(record.getFull())) {
            return true;
        }
        if (isSlotParentRecord(record)) {
            return slotParentFull(record.getUpcomingSlots());
        }
        return directRecordFull(record);
    }

    private boolean resolveFullForActionResult(ActivityEvent record, int acceptedMembers, int capacityTotal) {
        if (record != null && Boolean.TRUE.equals(record.getFull())) {
            return true;
        }
        if (record != null && isSlotParentRecord(record)) {
            return slotParentFull(record.getUpcomingSlots());
        }
        return capacityTotal > 0 && acceptedMembers >= capacityTotal;
    }

    private boolean slotParentFull(List<EventSlotOccurrenceDto> slots) {
        if (slots == null || slots.isEmpty()) {
            return true;
        }
        return slots.stream().allMatch(this::slotOccurrenceFull);
    }

    private boolean slotOccurrenceFull(EventSlotOccurrenceDto slot) {
        if (slot == null) {
            return false;
        }
        int capacityTotal = normalizeCount(slot.capacityTotal());
        return capacityTotal > 0 && normalizeCount(slot.acceptedMembers()) >= capacityTotal;
    }

    private boolean directRecordFull(ActivityEvent record) {
        if (record == null) {
            return false;
        }
        int capacityTotal = normalizeCount(record.getCapacityTotal());
        if (capacityTotal <= 0) {
            return false;
        }
        return Math.max(normalizeCount(record.getAcceptedMembers()), resolveAcceptedMemberUserIds(record).size()) >= capacityTotal;
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
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
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

    public EventDto sync(EventDetailDto request) {
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

        Users creator = actor != null ? actor.user() : usersRepository.findByUserId(actorUserId).orElse(null);
        String ownerUserId = normalizeId(request.creatorUserId());
        if (!StringUtils.hasText(ownerUserId)) {
            ownerUserId = actorUserId;
        }
        ActivityEvent existing = activityEventsRepository
                .findByOwnerUserIdAndSourceId(ownerUserId, sourceId)
                .orElse(null);
        boolean allowed = existing == null
                ? accessControlService.canCurrentActorCreateEvent(ownerUserId, sourceId)
                : accessControlService.canCurrentActorEditEvent(sourceId);
        if (!allowed) {
            return null;
        }
        ActivityEvent baseRecord = buildSyncedRecord(request, creator, actorUserId, sourceId, syncedMembersSnapshot);
        EventDefinitionChangeSummary definitionChange = eventDefinitionChangeSummary(existing, baseRecord);
        Set<String> preChangeAssignedAudienceUserIds = definitionChange.changed()
                ? activeSubEventResourceAudienceUserIds(sourceId)
                : Set.of();
        List<ActivityEvent> savedDocuments = activityEventsRepository.saveAll(List.of(baseRecord));
        ActivitiesMembersService.OwnerMembersSnapshot canonicalMembersSnapshot =
                activitiesMembersService.ensureEventCreatorAdminMembership(sourceId, actorUserId);
        List<ActivityEvent> canonicalDocuments = activityEventsRepository.findBySourceId(sourceId).stream()
                .filter(Objects::nonNull)
                .toList();
        if (!canonicalDocuments.isEmpty()) {
            savedDocuments = canonicalDocuments;
        }
        affinityRecomputeTaskService.enqueueEventChanged(sourceId, actorUserId);
        Set<String> removedRuntimeAudienceUserIds = definitionChange.removedSubEventIds().isEmpty()
                ? Set.of()
                : markDeletedRuntimeStateForRemovedDefinitions(sourceId, definitionChange.removedSubEventIds(), actorUserId);
        scheduleEventDefinitionChangedNotification(
                sourceId,
                baseRecord,
                definitionChange,
                preChangeAssignedAudienceUserIds,
                removedRuntimeAudienceUserIds,
                actorUserId,
                false);
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
        syncStageReminderTasksForSavedEvents(savedDocuments, actorUserId);
        if (definitionChange.changed()) {
            syncStageRuntimeGroupCountsForDefinitions(sourceId, actorUserId);
        }
        eventParticipationTicketService.syncParticipationTicketsForEvent(sourceId);
        userActivityCountersService.refreshEventCountersForDocuments(savedDocuments);
        notifyParticipantsWhenTicketingEnabled(
                existing,
                baseRecord,
                canonicalMembersSnapshot == null ? syncedMembersSnapshot : canonicalMembersSnapshot,
                actorUserId);
        String paymentSessionId = normalizeId(request.paymentSessionId());
        if (StringUtils.hasText(paymentSessionId)) {
            String bookingStartAtIso = request.nextSlot() != null && StringUtils.hasText(request.nextSlot().startAtIso())
                    ? request.nextSlot().startAtIso()
                    : request.startAtIso();
            paymentService.recordEventJoin(
                    paymentSessionId,
                    null,
                    sourceId,
                    request.nextSlot() == null ? null : normalizeId(request.nextSlot().id()),
                    bookingStartAtIso,
                    request.pricing() == null ? null : request.pricing().cancellationPolicy());
        }
        return toEventDto(selectSyncedResponseRecord(sourceId, savedDocuments, List.of(), baseRecord), actor);
    }

    private ActivityEvent selectSyncedResponseRecord(
            String sourceId,
            List<ActivityEvent> savedDocuments,
            List<ActivityEvent> refreshedReadModelDocuments,
            ActivityEvent fallback) {
        for (ActivityEvent record : refreshedReadModelDocuments == null ? List.<ActivityEvent>of() : refreshedReadModelDocuments) {
            if (sourceId.equals(normalizeId(record == null ? null : record.getSourceId()))) {
                return record;
            }
        }
        for (ActivityEvent record : savedDocuments == null ? List.<ActivityEvent>of() : savedDocuments) {
            if (sourceId.equals(normalizeId(record == null ? null : record.getSourceId()))) {
                return record;
            }
        }
        return fallback;
    }

    private EventDefinitionChangeSummary eventDefinitionChangeSummary(ActivityEvent previous, ActivityEvent next) {
        if (previous == null || next == null) {
            return new EventDefinitionChangeSummary(false, Set.of(), List.of());
        }
        Set<String> previousSubEventIds = subEventDefinitionIds(previous);
        Set<String> nextSubEventIds = subEventDefinitionIds(next);
        LinkedHashSet<String> removedSubEventIds = new LinkedHashSet<>(previousSubEventIds);
        removedSubEventIds.removeAll(nextSubEventIds);

        List<String> reasons = new ArrayList<>();
        if (!Objects.equals(safeText(previous.getTitle()), safeText(next.getTitle()))
                || !Objects.equals(safeText(previous.getLocation()), safeText(next.getLocation()))) {
            reasons.add("details");
        }
        if (!Objects.equals(safeText(previous.getStartAtIso()), safeText(next.getStartAtIso()))
                || !Objects.equals(safeText(previous.getEndAtIso()), safeText(next.getEndAtIso()))
                || !Objects.equals(safeText(previous.getTimeframe()), safeText(next.getTimeframe()))
                || !Objects.equals(safeText(previous.getFrequency()), safeText(next.getFrequency()))) {
            reasons.add("schedule");
        }
        if (!Objects.equals(definitionSignature(previous), definitionSignature(next))) {
            reasons.add("sub-events");
        }

        return new EventDefinitionChangeSummary(!reasons.isEmpty(), removedSubEventIds, reasons);
    }

    private Set<String> subEventDefinitionIds(ActivityEvent event) {
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        collectSubEventDefinitionIds(ids, event == null ? null : event.getSubEventDefinitions());
        for (EventSlotTemplateDto template : event == null || event.getSlotTemplates() == null
                ? List.<EventSlotTemplateDto>of()
                : event.getSlotTemplates()) {
            collectSubEventDefinitionIds(ids, template == null ? null : template.subEventDefinitions());
        }
        return ids;
    }

    private void collectSubEventDefinitionIds(Set<String> ids, List<SubEventDefinitionDto> definitions) {
        int index = 0;
        for (SubEventDefinitionDto definition : definitions == null ? List.<SubEventDefinitionDto>of() : definitions) {
            String id = firstNonBlank(definition == null ? null : definition.id(), fallbackSubEventId(index));
            if (StringUtils.hasText(id)) {
                ids.add(id);
            }
            index++;
        }
    }

    private String definitionSignature(ActivityEvent event) {
        if (event == null) {
            return "";
        }
        Map<String, Object> signature = new LinkedHashMap<>();
        signature.put("subEventsEnabled", event.getSubEventsEnabled());
        signature.put("subEventDefinitions", event.getSubEventDefinitions() == null ? List.of() : event.getSubEventDefinitions());
        signature.put("slotsEnabled", event.getSlotsEnabled());
        signature.put("slotTemplates", event.getSlotTemplates() == null ? List.of() : event.getSlotTemplates());
        signature.put("mode", safeText(event.getMode()));
        try {
            return OBJECT_MAPPER.writeValueAsString(signature);
        } catch (Exception ignored) {
            return signature.toString();
        }
    }

    private Set<String> activeSubEventResourceAudienceUserIds(String parentEventId) {
        String normalizedParentEventId = normalizeId(parentEventId);
        if (!StringUtils.hasText(normalizedParentEventId)) {
            return Set.of();
        }
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        for (ActivitySubEventResource resource : mongoTemplate.find(runtimeOwnerQuery(normalizedParentEventId), ActivitySubEventResource.class)) {
            collectSubEventResourceAudienceUserIds(userIds, resource);
        }
        return userIds;
    }

    private void syncStageRuntimeGroupCountsForDefinitions(String parentEventId, String actorUserId) {
        String normalizedParentEventId = normalizeId(parentEventId);
        if (!StringUtils.hasText(normalizedParentEventId)) {
            return;
        }
        List<ActivitySubEventStageRuntime> stageRuntimeRecords = mongoTemplate.find(
                runtimeOwnerQuery(normalizedParentEventId),
                ActivitySubEventStageRuntime.class);
        if (stageRuntimeRecords == null || stageRuntimeRecords.isEmpty()) {
            return;
        }

        LinkedHashSet<String> ownerIds = new LinkedHashSet<>();
        ownerIds.add(normalizedParentEventId);
        LinkedHashSet<String> groupOwnerIds = new LinkedHashSet<>();
        for (ActivitySubEventStageRuntime record : stageRuntimeRecords) {
            String ownerId = normalizeId(record == null ? null : record.getOwnerId());
            if (StringUtils.hasText(ownerId)) {
                ownerIds.add(ownerId);
            }
            String subEventId = normalizeId(record == null ? null : record.getSubEventId());
            String runtimeRecordId = normalizeId(record == null ? null : record.getId());
            if (StringUtils.hasText(runtimeRecordId)) {
                groupOwnerIds.add(runtimeRecordId);
            }
        }
        if (ownerIds.isEmpty()) {
            return;
        }

        Map<String, ActivityEvent> eventsBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : computePreferredEventRecords(activityEventsRepository.findBySourceIdIn(ownerIds))) {
            String sourceId = normalizeId(record == null ? null : record.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                eventsBySourceId.put(sourceId, record);
            }
        }

        Map<String, Integer> manualCountsByRuntimeId = new LinkedHashMap<>();
        List<ActivitySubEventGroup> manualGroups = groupOwnerIds.isEmpty()
                ? List.of()
                : activitySubEventGroupsRepository.findByOwnerIdInAndStatusNot(groupOwnerIds, RUNTIME_STATUS_DELETED);
        for (ActivitySubEventGroup group : manualGroups == null ? List.<ActivitySubEventGroup>of() : manualGroups) {
            String groupOwnerId = normalizeId(group == null ? null : group.getOwnerId());
            if (!StringUtils.hasText(groupOwnerId)) {
                continue;
            }
            manualCountsByRuntimeId.put(groupOwnerId, manualCountsByRuntimeId.getOrDefault(groupOwnerId, 0) + 1);
        }

        String nowIso = Instant.now().toString();
        String updatedBy = StringUtils.hasText(normalizeId(actorUserId)) ? normalizeId(actorUserId) : "event-definition-sync";
        List<ActivitySubEventStageRuntime> changed = new ArrayList<>();
        for (ActivitySubEventStageRuntime record : stageRuntimeRecords) {
            String ownerId = normalizeId(record == null ? null : record.getOwnerId());
            String subEventId = normalizeId(record == null ? null : record.getSubEventId());
            if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(subEventId)) {
                continue;
            }
            ActivityEvent ownerEvent = eventsBySourceId.get(ownerId);
            ActivityEvent definitionEvent = ownerEvent == null ? eventsBySourceId.get(normalizedParentEventId) : ownerEvent;
            SubEventItem stage = findSubEvent(definitionEvent, subEventId);
            if (stage == null) {
                continue;
            }
            String runtimeId = normalizeId(record == null ? null : record.getId());
            int groupsCount = autoTournamentGroupCount(definitionEvent, stage)
                    + manualCountsByRuntimeId.getOrDefault(runtimeId, 0);
            if (Objects.equals(record.getGroupsCount(), groupsCount)) {
                continue;
            }
            record.setGroupsCount(Math.max(0, groupsCount));
            record.setStatus(StringUtils.hasText(record.getStatus()) ? record.getStatus() : ActivityEvent.STATUS_ACTIVE);
            record.setUpdatedDate(nowIso);
            record.setUpdatedUser(updatedBy);
            changed.add(record);
        }
        if (!changed.isEmpty()) {
            activitySubEventStageRuntimeRepository.saveAll(changed);
        }
    }

    private Set<String> markDeletedRuntimeStateForRemovedDefinitions(
            String parentEventId,
            Set<String> removedSubEventIds,
            String actorUserId) {
        String normalizedParentEventId = normalizeId(parentEventId);
        LinkedHashSet<String> normalizedSubEventIds = removedSubEventIds == null
                ? new LinkedHashSet<>()
                : removedSubEventIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (!StringUtils.hasText(normalizedParentEventId) || normalizedSubEventIds.isEmpty()) {
            return Set.of();
        }

        String nowIso = Instant.now().toString();
        String updatedBy = StringUtils.hasText(normalizeId(actorUserId)) ? normalizeId(actorUserId) : "event-definition-sync";
        Query resourceQuery = runtimeOwnerQuery(normalizedParentEventId)
                .addCriteria(Criteria.where("subEventId").in(normalizedSubEventIds));
        List<ActivitySubEventResource> resourceRecords = mongoTemplate.find(resourceQuery, ActivitySubEventResource.class);
        LinkedHashSet<String> audienceUserIds = new LinkedHashSet<>();
        for (ActivitySubEventResource record : resourceRecords == null ? List.<ActivitySubEventResource>of() : resourceRecords) {
            collectSubEventResourceAudienceUserIds(audienceUserIds, record);
            record.setStatus(RUNTIME_STATUS_DELETED);
            record.setUpdatedDate(nowIso);
            record.setUpdatedUser(updatedBy);
        }
        if (resourceRecords != null && !resourceRecords.isEmpty()) {
            activitySubEventResourcesRepository.saveAll(resourceRecords);
        }

        Query stageRuntimeQuery = runtimeOwnerQuery(normalizedParentEventId)
                .addCriteria(Criteria.where("subEventId").in(normalizedSubEventIds));
        List<ActivitySubEventStageRuntime> stageRuntimeRecords = mongoTemplate.find(stageRuntimeQuery, ActivitySubEventStageRuntime.class);
        for (ActivitySubEventStageRuntime record : stageRuntimeRecords == null ? List.<ActivitySubEventStageRuntime>of() : stageRuntimeRecords) {
            record.setStatus(RUNTIME_STATUS_DELETED);
            record.setUpdatedDate(nowIso);
            record.setUpdatedUser(updatedBy);
        }
        if (stageRuntimeRecords != null && !stageRuntimeRecords.isEmpty()) {
            activitySubEventStageRuntimeRepository.saveAll(stageRuntimeRecords);
        }

        Set<String> groupOwnerIds = stageRuntimeRecords == null
                ? Set.of()
                : stageRuntimeRecords.stream()
                        .map(record -> normalizeId(record == null ? null : record.getId()))
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Query groupQuery = Query.query(Criteria.where("ownerId").in(groupOwnerIds)
                .and("status").ne(RUNTIME_STATUS_DELETED));
        List<ActivitySubEventGroup> groupRecords = mongoTemplate.find(groupQuery, ActivitySubEventGroup.class);
        for (ActivitySubEventGroup record : groupRecords == null ? List.<ActivitySubEventGroup>of() : groupRecords) {
            record.setStatus(RUNTIME_STATUS_DELETED);
            record.setUpdatedDate(nowIso);
            record.setUpdatedUser(updatedBy);
        }
        if (groupRecords != null && !groupRecords.isEmpty()) {
            activitySubEventGroupsRepository.saveAll(groupRecords);
        }
        return audienceUserIds;
    }

    private Query runtimeOwnerQuery(String parentEventId) {
        String normalizedParentEventId = normalizeId(parentEventId);
        String ownerRegex = "^" + Pattern.quote(normalizedParentEventId) + "($|:)";
        return Query.query(Criteria.where("ownerId").regex(ownerRegex).and("status").ne(RUNTIME_STATUS_DELETED));
    }

    private void collectSubEventResourceAudienceUserIds(Set<String> userIds, ActivitySubEventResource resource) {
        if (userIds == null || resource == null) {
            return;
        }
        addUserId(userIds, resource.getAssetOwnerUserId());
        if (resource.getAssetSettingsByType() != null) {
            for (Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord> settingsByAssetId
                    : resource.getAssetSettingsByType().values()) {
                for (ActivitySubEventResource.SubEventAssignedAssetSettingsRecord settings
                        : settingsByAssetId == null ? List.<ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>of() : settingsByAssetId.values()) {
                    addUserId(userIds, settings == null ? null : settings.addedByUserId());
                }
            }
        }
        if (resource.getSupplyContributionEntriesByAssetId() != null) {
            for (List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord> entries
                    : resource.getSupplyContributionEntriesByAssetId().values()) {
                for (ActivitySubEventResource.SubEventSupplyContributionEntryRecord entry
                        : entries == null ? List.<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>of() : entries) {
                    addUserId(userIds, entry == null ? null : entry.userId());
                }
            }
        }
    }

    private void scheduleEventDefinitionChangedNotification(
            String sourceId,
            ActivityEvent event,
            EventDefinitionChangeSummary definitionChange,
            Set<String> preChangeAssignedAudienceUserIds,
            Set<String> removedRuntimeAudienceUserIds,
            String actorUserId,
            boolean lifecycleOccurrence) {
        if (definitionChange == null || !definitionChange.changed()) {
            return;
        }
        LinkedHashSet<String> audienceUserIds = new LinkedHashSet<>();
        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, sourceId);
        if (snapshot != null) {
            audienceUserIds.addAll(snapshot.acceptedMemberUserIds());
            audienceUserIds.addAll(snapshot.pendingMemberUserIds());
            audienceUserIds.addAll(snapshot.invitedMemberUserIds());
            audienceUserIds.addAll(snapshot.pendingRequestMemberUserIds());
        }
        audienceUserIds.addAll(preChangeAssignedAudienceUserIds == null ? Set.of() : preChangeAssignedAudienceUserIds);
        audienceUserIds.addAll(removedRuntimeAudienceUserIds == null ? Set.of() : removedRuntimeAudienceUserIds);
        String normalizedActorUserId = normalizeId(actorUserId);
        audienceUserIds.removeIf(userId ->
                !StringUtils.hasText(safeText(userId))
                        || normalizeId(userId).equals(normalizedActorUserId));
        if (lifecycleOccurrence) {
            scheduledMessageTaskService.scheduleEventLifecycleChanged(
                    sourceId,
                    event == null ? null : event.getTitle(),
                    audienceUserIds,
                    definitionChange.reasons(),
                    actorUserId);
        } else {
            scheduledMessageTaskService.scheduleEventDefinitionChanged(
                    sourceId,
                    event == null ? null : event.getTitle(),
                    audienceUserIds,
                    definitionChange.reasons(),
                    actorUserId);
        }
    }

    private void scheduleEventLifecycleChangedNotification(
            String sourceId,
            List<ActivityEvent> updatedRecords,
            String reason,
            String actorUserId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return;
        }
        ActivityEvent event = computePreferredEventRecords(updatedRecords == null ? List.of() : updatedRecords)
                .stream()
                .findFirst()
                .orElseGet(() -> findPreferredEventRecord(normalizedSourceId));
        scheduleEventDefinitionChangedNotification(
                normalizedSourceId,
                event,
                new EventDefinitionChangeSummary(true, Set.of(), List.of(safeText(reason))),
                activeSubEventResourceAudienceUserIds(normalizedSourceId),
                Set.of(),
                actorUserId,
                true);
    }

    private void scheduleAcceptedEventLifecycleChangedNotification(
            String sourceId,
            List<ActivityEvent> updatedRecords,
            ActivitiesMembersService.OwnerMembersSnapshot membershipSnapshot,
            String reason,
            String actorUserId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId) || membershipSnapshot == null) {
            return;
        }
        LinkedHashSet<String> audienceUserIds = new LinkedHashSet<>(
                normalizeIds(membershipSnapshot.acceptedMemberUserIds()));
        audienceUserIds.remove(normalizeId(actorUserId));
        if (audienceUserIds.isEmpty()) {
            return;
        }
        ActivityEvent event = computePreferredEventRecords(updatedRecords == null ? List.of() : updatedRecords)
                .stream()
                .findFirst()
                .orElseGet(() -> findPreferredEventRecord(normalizedSourceId));
        scheduledMessageTaskService.scheduleEventLifecycleChanged(
                normalizedSourceId,
                event == null ? null : event.getTitle(),
                audienceUserIds,
                List.of(safeText(reason)),
                actorUserId);
    }

    private void notifyPublishedPendingInvitees(
            List<ActivityEvent> publishedRecords,
            ActivitiesMembersService.OwnerMembersSnapshot membershipSnapshot,
            String actorUserId) {
        if (membershipSnapshot == null) {
            return;
        }
        LinkedHashSet<String> recipients = new LinkedHashSet<>(
                normalizeIds(membershipSnapshot.invitedMemberUserIds()));
        recipients.retainAll(normalizeIds(membershipSnapshot.pendingMemberUserIds()));
        recipients.remove(normalizeId(actorUserId));
        if (recipients.isEmpty()) {
            return;
        }
        ActivityEvent event = computePreferredEventRecords(
                publishedRecords == null ? List.of() : publishedRecords)
                .stream()
                .findFirst()
                .orElse(null);
        eventInviteNotificationService.notifyInvitees(
                event,
                List.copyOf(recipients),
                actorUserId);
    }

    private void addUserId(Set<String> userIds, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (StringUtils.hasText(normalizedUserId)) {
            userIds.add(normalizedUserId);
        }
    }

    private String fallbackSubEventId(int index) {
        return "subevent-" + Math.max(1, index + 1);
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
        String filter = request == null ? "active-events" : normalizeActivityListFilter(request.filter());
        String hostingPublicationFilter = request == null ? "all" : normalizeHostingPublicationFilter(request.hostingPublicationFilter());

        List<ActivityEvent> userItems = queryUserRecords(viewer);
        List<ActivityEvent> memberEventItems = userItems.stream()
                .filter(record -> !isViewerAdmin(record, viewer.userId()))
                .filter(record -> !isTrashStatus(record))
                .filter(record -> hasAcceptedParticipation(record, viewer.userId()) || isPendingParticipation(record, viewer.userId()))
                .toList();
        List<ActivityEvent> pendingEventItems = memberEventItems.stream()
                .filter(record -> isPendingParticipation(record, viewer.userId()) || isPendingReviewStatus(record))
                .toList();
        List<ActivityEvent> activeEventItems = memberEventItems.stream()
                .filter(record -> hasAcceptedParticipation(record, viewer.userId()) && !isPendingReviewStatus(record))
                .toList();

        return switch (filter) {
            case "all" -> {
                List<ActivityEvent> directOwnerRecords = currentDirectOwnerRecords(viewer.userId());
                yield concat(
                        concat(activeEventItems, pendingEventItems),
                        concat(
                                queryInvitationRecords(viewer, directOwnerRecords),
                                queryMyEventRecords(viewer, directOwnerRecords)));
            }
            case "pending" -> concat(
                    pendingEventItems,
                    queryMyEventRecords(viewer, currentDirectOwnerRecords(viewer.userId())).stream()
                            .filter(this::isPendingReviewStatus)
                            .toList());
            case "trash" -> userItems.stream()
                    .filter(record -> isTrashStatus(record) || hasDeletedMembership(record, viewer.userId()))
                    .toList();
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
                .map(record -> buildViewerScopedDirectRecord(viewer.userId(), record))
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

    private ActivityEvent buildViewerScopedDirectRecord(String viewerUserId, ActivityEvent record) {
        if (record == null) {
            return null;
        }
        if (viewerUserId.equals(normalizeId(record.getCreatorUserId())) || isViewerAdmin(record, viewerUserId)) {
            return cloneDocument(record);
        }
        return buildMembershipProjection(viewerUserId, record);
    }

    private EventsExplorePageDto pageDirectFilteredRecords(
            ViewerContext viewer,
            String filter,
            String hostingPublicationFilter,
            EventsFilterRequestDto request) {
        String secondaryFilter = normalizeActivitiesSecondaryFilter(request == null ? null : request.secondaryFilter());
        String view = normalizeActivitiesView(request == null ? null : request.view());
        String sort = normalizeActivitiesSort(request == null ? null : request.sort(), view, secondaryFilter);
        Integer requestedLimit = request == null ? null : request.limit();
        int limit = normalizeLimit(requestedLimit, 10);

        List<EventProjection> sorted = queryDirectFilteredRecords(viewer, filter, hostingPublicationFilter).stream()
                .map(record -> toSortProjection(record, viewer))
                .filter(Objects::nonNull)
                .filter(projection -> matchesActivitiesSecondaryFilter(projection, secondaryFilter))
                .filter(projection -> matchesActivitiesCalendarRange(projection, request, view))
                .sorted((left, right) -> compareActivitiesProjection(left, right, sort, view, secondaryFilter))
                .toList();

        if ("week".equals(view) || "month".equals(view)) {
            return new EventsExplorePageDto(
                    toHydratedEventDtos(viewer, sorted.stream().map(EventProjection::record).toList()),
                    sorted.size(),
                    null);
        }

        String cursor = request == null ? null : request.cursor();
        int startIndex = resolveCursorStartIndex(sorted, cursor);
        int endIndex = Math.min(sorted.size(), startIndex + limit);
        List<EventProjection> pageProjections = sorted.subList(startIndex, endIndex);
        List<EventDto> records = toHydratedEventDtos(viewer, pageProjections.stream()
                .map(EventProjection::record)
                .toList());
        String nextCursor = endIndex < sorted.size() && !pageProjections.isEmpty()
                ? serializeCursorId(pageProjections.get(pageProjections.size() - 1).record().getSourceId())
                : null;
        return new EventsExplorePageDto(records, sorted.size(), nextCursor);
    }

    private List<EventDto> toHydratedEventDtos(ViewerContext viewer, List<ActivityEvent> projectedRecords) {
        List<ActivityEvent> hydratedRecords = hydratePageRecords(viewer, projectedRecords);
        if (hydratedRecords.isEmpty()) {
            return List.of();
        }
        EventQueryContext current = ACTIVE_CONTEXT.get();
        EventQueryContext pageContext = new EventQueryContext(
                hydratedRecords,
                hydratedRecords,
                resolveHydratedPageSnapshots(current, hydratedRecords),
                current == null ? Set.of() : current.trackedEventSourceIds(),
                current == null ? Map.of() : current.trackedEventStatusesBySourceId(),
                current == null ? Set.of() : current.pendingPaymentEventSourceIds(),
                current == null ? Map.of() : current.edgeWeightsByPairKey(),
                creatorAvatarUrlsByUserId(hydratedRecords));
        Map<String, String> checkoutResultStatesBySourceId = checkoutResultStatesBySourceId(
                viewer == null ? null : viewer.userId(),
                hydratedRecords);
        return withEventQueryContext(pageContext, () -> hydratedRecords.stream()
                .map(record -> toEventDto(record, viewer, checkoutResultStatesBySourceId))
                .filter(Objects::nonNull)
                .toList());
    }

    private Map<String, String> creatorAvatarUrlsByUserId(Collection<ActivityEvent> records) {
        List<String> creatorUserIds = (records == null ? List.<ActivityEvent>of() : records).stream()
                .filter(Objects::nonNull)
                .map(ActivityEvent::getCreatorUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (creatorUserIds.isEmpty()) {
            return Map.of();
        }
        Map<String, String> avatarUrlsByUserId = new LinkedHashMap<>();
        for (Users user : usersRepository.findByUserIdIn(creatorUserIds)) {
            String userId = normalizeId(user == null ? null : user.getUserId());
            String avatarUrl = firstUserImageUrl(user);
            if (StringUtils.hasText(userId) && StringUtils.hasText(avatarUrl)) {
                avatarUrlsByUserId.put(userId, avatarUrl);
            }
        }
        return avatarUrlsByUserId;
    }

    private String firstUserImageUrl(Users user) {
        if (user == null || user.getImages() == null) {
            return "";
        }
        return user.getImages().stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse("");
    }

    private Map<String, String> checkoutResultStatesBySourceId(
            String userId,
            List<ActivityEvent> records) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || records == null || records.isEmpty()) {
            return Map.of();
        }
        List<String> sourceIds = records.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        return eventCheckoutBasketService.loadResultStatesByEvent(normalizedUserId, sourceIds);
    }

    private Map<String, ActivitiesMembersService.OwnerMembersSnapshot> resolveHydratedPageSnapshots(
            EventQueryContext current,
            List<ActivityEvent> hydratedRecords) {
        if (hydratedRecords == null || hydratedRecords.isEmpty()) {
            return Map.of();
        }
        if (current == null) {
            return buildMemberSnapshotMap(hydratedRecords);
        }
        return current.snapshotsBySourceId() == null ? Map.of() : current.snapshotsBySourceId();
    }

    private List<ActivityEvent> hydratePageRecords(ViewerContext viewer, List<ActivityEvent> projectedRecords) {
        if (projectedRecords == null || projectedRecords.isEmpty()) {
            return List.of();
        }
        List<String> sourceIds = projectedRecords.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        List<ActivityEvent> fullDocuments = loadEventDocumentsBySourceIds(sourceIds);
        Map<String, ActivityEvent> fullByDocumentId = new LinkedHashMap<>();
        for (ActivityEvent document : fullDocuments) {
            String documentId = normalizeId(document == null ? null : document.getId());
            if (StringUtils.hasText(documentId)) {
                fullByDocumentId.put(documentId, document);
            }
        }
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent document : computePreferredEventRecords(fullDocuments)) {
            String sourceId = normalizeId(document == null ? null : document.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                preferredBySourceId.put(sourceId, document);
            }
        }

        List<ActivityEvent> hydrated = new ArrayList<>();
        for (ActivityEvent projected : projectedRecords) {
            if (projected == null) {
                continue;
            }
            String documentId = normalizeId(projected.getId());
            String sourceId = normalizeId(projected.getSourceId());
            ActivityEvent full = StringUtils.hasText(documentId) ? fullByDocumentId.get(documentId) : null;
            if (full == null && StringUtils.hasText(sourceId)) {
                full = preferredBySourceId.get(sourceId);
            }
            hydrated.add(applyPageProjection(viewer, projected, full == null ? projected : full));
        }
        return hydrated;
    }

    private ActivityEvent applyPageProjection(ViewerContext viewer, ActivityEvent projection, ActivityEvent fullRecord) {
        ActivityEvent hydrated = cloneDocument(fullRecord == null ? projection : fullRecord);
        String projectedOwnerUserId = normalizeId(projection == null ? null : projection.getOwnerUserId());
        if (StringUtils.hasText(projectedOwnerUserId)
                && !projectedOwnerUserId.equals(normalizeId(hydrated.getOwnerUserId()))) {
            return buildMembershipProjection(projectedOwnerUserId, hydrated);
        }
        return hydrated;
    }

    private EventListPageDto pageEventListRecords(
            ViewerContext viewer,
            List<ActivityEvent> records,
            EventsFilterRequestDto request) {
        String secondaryFilter = normalizeActivitiesSecondaryFilter(request == null ? null : request.secondaryFilter());
        String view = normalizeActivitiesView(request == null ? null : request.view());
        String sort = normalizeActivitiesSort(request == null ? null : request.sort(), view, secondaryFilter);
        Integer requestedLimit = request == null ? null : request.limit();
        int limit = normalizeLimit(requestedLimit, 10);

        List<EventProjection> sorted = (records == null ? List.<ActivityEvent>of() : records).stream()
                .map(record -> toSortProjection(record, viewer))
                .filter(Objects::nonNull)
                .filter(projection -> matchesActivitiesSecondaryFilter(projection, secondaryFilter))
                .filter(projection -> matchesActivitiesCalendarRange(projection, request, view))
                .sorted((left, right) -> compareActivitiesProjection(left, right, sort, view, secondaryFilter))
                .toList();

        if ("week".equals(view) || "month".equals(view)) {
            List<ActivityEvent> pageSourceRecords = sorted.stream()
                    .map(EventProjection::record)
                    .toList();
            List<EventDto> pageRecords = pageSourceRecords.stream()
                    .map(record -> toEventDto(record, viewer))
                    .filter(Objects::nonNull)
                    .toList();
            return new EventListPageDto(
                    pageRecords,
                    sorted.size(),
                    null,
                    toHydratedEventDtos(viewer, pageSourceRecords));
        }

        String cursor = request == null ? null : request.cursor();
        int startIndex = resolveCursorStartIndex(sorted, cursor);
        int endIndex = Math.min(sorted.size(), startIndex + limit);
        List<EventProjection> pageProjections = sorted.subList(startIndex, endIndex);
        List<ActivityEvent> pageSourceRecords = pageProjections.stream()
                .map(EventProjection::record)
                .toList();
        List<EventDto> pageRecords = pageSourceRecords.stream()
                .map(record -> toEventDto(record, viewer))
                .filter(Objects::nonNull)
                .toList();
        String nextCursor = endIndex < sorted.size() && !pageProjections.isEmpty()
                ? serializeCursorId(pageProjections.get(pageProjections.size() - 1).record().getSourceId())
                : null;
        return new EventListPageDto(
                pageRecords,
                sorted.size(),
                nextCursor,
                toHydratedEventDtos(viewer, pageSourceRecords));
    }

    private boolean needsActivitiesAffinityEdges(EventsFilterRequestDto request) {
        return "relevant".equals(normalizeActivitiesSecondaryFilter(request == null ? null : request.secondaryFilter()));
    }

    private boolean usesDirectOwnerListFilter(String filter) {
        return "invitations".equals(filter)
                || "my-events".equals(filter)
                || "drafts".equals(filter)
                || "trash".equals(filter);
    }

    private List<ActivityEvent> queryDirectFilteredRecords(
            ViewerContext viewer,
            String filter,
            String hostingPublicationFilter) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return List.of();
        }

        List<ActivityEvent> directOwnerRecords = currentDirectOwnerRecords(viewer.userId());

        return switch (filter) {
            case "invitations" -> queryInvitationRecords(viewer, directOwnerRecords);
            case "my-events" -> {
                List<ActivityEvent> myEvents = queryMyEventRecords(viewer, directOwnerRecords);
                yield "drafts".equals(hostingPublicationFilter)
                        ? myEvents.stream().filter(record -> Boolean.FALSE.equals(record.getPublished())).toList()
                        : myEvents;
            }
            case "drafts" -> queryMyEventRecords(viewer, directOwnerRecords).stream()
                    .filter(record -> Boolean.FALSE.equals(record.getPublished()))
                    .toList();
            case "pending" -> queryMyEventRecords(viewer, directOwnerRecords).stream()
                    .filter(this::isPendingReviewStatus)
                    .toList();
            case "trash" -> directOwnerRecords.stream()
                    .filter(this::isTrashStatus)
                    .sorted(directRecordComparator())
                    .toList();
            default -> List.of();
        };
    }

    private List<ActivityEvent> queryDirectOwnerRecords(String ownerUserId) {
        return activityEventsRepository.findAdminVisibleEvents(ownerUserId).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .sorted(directRecordComparator())
                .toList();
    }

    private List<ActivityEvent> queryDirectOwnerListCardRecords(String ownerUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        if (!StringUtils.hasText(normalizedOwnerUserId)) {
            return List.of();
        }
        Query query = new Query(new Criteria().orOperator(
                Criteria.where("ownerUserId").is(normalizedOwnerUserId),
                Criteria.where("admins").is(normalizedOwnerUserId)));
        query.addCriteria(Criteria.where("sourceId").exists(true).ne(""));
        query.addCriteria(Criteria.where("generated").ne(true));
        query.with(Sort.by(Sort.Direction.ASC, "startAtIso", "sourceId"));
        includeEventListCardFields(query);
        return mongoTemplate.find(query, ActivityEvent.class).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .sorted(directRecordComparator())
                .toList();
    }

    private List<ActivityEvent> currentDirectOwnerRecords(String ownerUserId) {
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        if (ctx != null) {
            return ctx.allEvents().stream()
                    .filter(record -> ownerUserId.equals(normalizeId(record == null ? null : record.getOwnerUserId()))
                            || normalizeIds(record == null ? null : record.getAdmins()).contains(ownerUserId))
                    .filter(record -> StringUtils.hasText(normalizeId(record == null ? null : record.getSourceId())))
                    .map(this::cloneDocument)
                    .peek(ActivityEvent::normalizeLifecycleState)
                    .sorted(directRecordComparator())
                    .toList();
        }
        return queryDirectOwnerRecords(ownerUserId);
    }

    private List<ActivityEvent> queryCanonicalExploreRecords() {
        return activityEventsRepository.findCanonicalExploreCandidates().stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .filter(this::isCanonicalExploreRecord)
                .toList();
    }

    private List<ActivityEvent> queryCanonicalExplorePageRecords() {
        Query query = new Query(Criteria.where("status").is(ActivityEvent.STATUS_ACTIVE)
                .and("generated").ne(true)
                .and("sourceId").exists(true).ne(""));
        query.with(Sort.by(Sort.Direction.ASC, "startAtIso", "sourceId"));
        includeEventExplorePageFields(query);
        return mongoTemplate.find(query, ActivityEvent.class).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .filter(this::isCanonicalExploreRecord)
                .toList();
    }

    private void includeEventExplorePageFields(Query query) {
        includeEventListCardFields(query);
        query.fields()
                .include("creatorGender")
                .include("blindMode")
                .include("sourceLink")
                .include("autoInviter")
                .include("frequency")
                .include("pricing")
                .include("slotsEnabled")
                .include("subEventsEnabled")
                .include("upcomingSlots")
                .include("mode");
    }

    private List<ActivityEvent> queryInvitationRecords(
            ViewerContext viewer,
            List<ActivityEvent> directOwnerRecords) {
        if (viewer == null || !StringUtils.hasText(viewer.userId())) {
            return List.of();
        }
        Set<String> scopedTrashSourceIds = (directOwnerRecords == null ? List.<ActivityEvent>of() : directOwnerRecords).stream()
                .filter(this::isTrashStatus)
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        LinkedHashMap<String, ActivityEvent> invitationRecordsBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : activityEventsRepository.findActiveInvitationEvents(viewer.userId())) {
            String sourceId = normalizeId(record == null ? null : record.getSourceId());
            if (!StringUtils.hasText(sourceId)
                    || scopedTrashSourceIds.contains(sourceId)
                    || !ActivityEvent.STATUS_ACTIVE.equals(safeText(record.getStatus()))
                    || isTrashStatus(record)
                    || !hasInvitationMembership(record, viewer.userId())) {
                continue;
            }
            ActivityEvent projection = cloneDocument(record);
            projection.setOwnerUserId(viewer.userId());
            projection.setAdmins(resolveAdminUserIds(record));
            projection.normalizeLifecycleState();
            invitationRecordsBySourceId.put(sourceId, projection);
        }
        return new ArrayList<>(invitationRecordsBySourceId.values()).stream()
                .sorted(directRecordComparator())
                .toList();
    }

    private List<ActivityEvent> queryMyEventRecords(ViewerContext viewer, List<ActivityEvent> directOwnerRecords) {
        LinkedHashMap<String, ActivityEvent> myEventRecordsBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : directOwnerRecords) {
            if (isTrashStatus(record)) {
                continue;
            }
            if (isViewerAdmin(record, viewer.userId())) {
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
        if (!StringUtils.hasText(sourceStatus) || ActivityEvent.STATUS_ACTIVE.equals(sourceStatus)) {
            sourceStatus = Boolean.TRUE.equals(source.getPublished()) ? ActivityEvent.STATUS_ACTIVE : ActivityEvent.STATUS_DRAFT;
        }
        projection.setOwnerUserId(viewerUserId);
        projection.setStatus(sourceStatus);
        projection.setAdmins(resolveAdminUserIds(source));
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
            if (record == null) {
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
        return normalizeCount(next.getAcceptedMembers()) >= normalizeCount(current.getAcceptedMembers());
    }

    private boolean shouldIncludeUserDirectRecord(ActivityEvent record, String userId, ActivityEvent preferredRecord) {
        if (record == null) {
            return false;
        }
        if (userId.equals(normalizeId(record.getOwnerUserId())) && isTrashStatus(record)) {
            return true;
        }
        if (userId.equals(normalizeId(record.getCreatorUserId())) || isViewerAdmin(record, userId)) {
            return true;
        }
        return hasTrackedUserParticipation(preferredRecord == null ? record : preferredRecord, userId);
    }

    private boolean isPendingReviewStatus(ActivityEvent record) {
        String status = safeText(record == null ? null : record.getStatus());
        return ActivityEvent.STATUS_UNDER_REVIEW.equals(status) || ActivityEvent.STATUS_BLOCKED.equals(status);
    }

    private boolean isTrashStatus(ActivityEvent record) {
        if (Boolean.TRUE.equals(record == null ? null : record.getIsTrashed())) {
            return true;
        }
        String status = safeText(record == null ? null : record.getStatus());
        return ActivityEvent.STATUS_TRASHED.equals(status);
    }

    private boolean hasDeletedMembership(ActivityEvent record, String userId) {
        String normalizedUserId = normalizeId(userId);
        String sourceId = normalizeId(record == null ? null : record.getSourceId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(sourceId)) {
            return false;
        }
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        if (ctx != null) {
            return MEMBER_STATUS_DELETED.equals(
                    safeText(ctx.trackedEventStatusesBySourceId().get(sourceId)));
        }
        return MEMBER_STATUS_DELETED.equals(eventMembershipStatusForUser(sourceId, normalizedUserId));
    }

    private String eventMembershipStatusForUser(String sourceId, String userId) {
        String normalizedSourceId = normalizeId(sourceId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedSourceId) || !StringUtils.hasText(normalizedUserId)) {
            return "";
        }
        return activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(OWNER_TYPE_EVENT, normalizedSourceId, normalizedUserId)
                .map(ActivityMember::getStatus)
                .map(this::safeText)
                .orElse("");
    }

    private ActivityEvent buildMembershipProjection(String ownerUserId, ActivityEvent record) {
        ActivityEvent projection = cloneDocument(record);
        projection.setOwnerUserId(ownerUserId);
        projection.setAdmins(resolveAdminUserIds(record));
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
        if (!Boolean.TRUE.equals(record.getPublished())) {
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
        if (isGeneratedSlotRecord(record)) {
            return false;
        }
        if (Boolean.TRUE.equals(record.getIsTrashed())) {
            return false;
        }
        if (!Boolean.TRUE.equals(record.getPublished())) {
            return false;
        }
        return StringUtils.hasText(normalizeId(record.getSourceId()));
    }

    private boolean shouldPreferExploreRecord(ActivityEvent next, ActivityEvent current) {
        if (!Objects.equals(next.getPublished(), current.getPublished())) {
            return Boolean.TRUE.equals(next.getPublished());
        }
        return normalizeCount(next.getActivity()) >= normalizeCount(current.getActivity());
    }

    private EventProjection toSortProjection(ActivityEvent record, ViewerContext viewer) {
        if (record == null) {
            return null;
        }
        long startAtMs = toSortableDate(record.getStartAtIso());
        long endAtMs = toSortableDate(record.getEndAtIso());
        if (endAtMs <= 0L) {
            endAtMs = startAtMs;
        }
        Integer distanceMetersExact = resolveDistanceMetersExact(viewer == null ? null : viewer.locationCoordinates(), record);
        int affinityGap = Math.abs(Math.max(0, normalizeCount(record.getAffinity()))
                - (viewer == null ? 0 : viewer.affinity()));
        return new EventProjection(
                record,
                null,
                distanceMetersExact == null ? Integer.MAX_VALUE : distanceMetersExact,
                Math.max(0d, safeDouble(record.getBoost())),
                startAtMs,
                endAtMs,
                dateOnly(startAtMs),
                boostAffinityRank(record, viewer, affinityGap),
                affinityGap,
                -Math.max(0, (int) Math.round(safeDouble(record.getRating()) * 100d)),
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

    private EventDto toEventDto(ActivityEvent record, ViewerContext viewer) {
        return toEventDto(record, viewer, Map.of());
    }

    private EventDto toEventDto(
            ActivityEvent record,
            ViewerContext viewer,
            Map<String, String> checkoutResultStatesBySourceId) {
        return activityEventMapper.toDto(record, eventDtoMappingContext(viewer, record, checkoutResultStatesBySourceId));
    }

    private ActivityEventMapper.MappingContext eventDtoMappingContext(
            ViewerContext viewer,
            ActivityEvent record) {
        return eventDtoMappingContext(viewer, record, Map.of());
    }

    private ActivityEventMapper.MappingContext eventDtoMappingContext(
            ViewerContext viewer,
            ActivityEvent record,
            Map<String, String> checkoutResultStatesBySourceId) {
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId =
                ctx == null ? singleRecordSnapshot(record) : ctx.snapshotsBySourceId();
        return new ActivityEventMapper.MappingContext(
                viewer == null ? null : viewer.locationCoordinates(),
                snapshotsBySourceId,
                checkoutResultStatesBySourceId,
                ctx == null ? Map.of() : ctx.creatorAvatarUrlsByUserId());
    }

    private Map<String, ActivitiesMembersService.OwnerMembersSnapshot> singleRecordSnapshot(ActivityEvent record) {
        String sourceId = normalizeId(record == null ? null : record.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return Map.of();
        }
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveSnapshot(sourceId);
        return snapshot == null ? Map.of() : Map.of(sourceId, snapshot);
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
                return projectionId(left).compareTo(projectionId(right));
            }
            int delta = Integer.compare(left.distanceMeters(), right.distanceMeters());
            if (delta != 0) {
                return delta;
            }
            delta = Long.compare(right.startAtMs(), left.startAtMs());
            if (delta != 0) {
                return delta;
            }
            return projectionId(left).compareTo(projectionId(right));
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
            return projectionId(left).compareTo(projectionId(right));
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
            return projectionId(left).compareTo(projectionId(right));
        }

        int delta = Long.compare(left.dayMs(), right.dayMs());
        if (delta != 0) {
            return delta;
        }
        delta = Long.compare(left.startAtMs(), right.startAtMs());
        if (delta != 0) {
            return delta;
        }
        return projectionId(left).compareTo(projectionId(right));
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
        return projectionId(left).compareTo(projectionId(right));
    }

    private String projectionId(EventProjection projection) {
        if (projection == null) {
            return "";
        }
        EventDto item = projection.item();
        if (item != null && StringUtils.hasText(item.id())) {
            return item.id();
        }
        return normalizeId(projection.record() == null ? null : projection.record().getSourceId());
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
        return updateItemState(request, updater, false);
    }

    private List<ActivityEvent> updateItemState(
            EventActionRequestDto request,
            Consumer<ActivityEvent> updater,
            boolean createScopedRecord) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return List.of();
        }

        List<ActivityEvent> documents = resolveActionDocuments(viewer.userId(), sourceId, createScopedRecord);
        if (documents.isEmpty()) {
            return List.of();
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

    private boolean isOrganizerLifecycleRequest(EventActionRequestDto request) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return false;
        }
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        return preferred != null && isViewerAdmin(preferred, viewer.userId());
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
            if (current == null || shouldPreferRecord(document, current)) {
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

    private List<ActivityEvent> resolveActionDocuments(String ownerUserId, String sourceId) {
        return resolveActionDocuments(ownerUserId, sourceId, false);
    }

    private List<ActivityEvent> resolveActionDocuments(String ownerUserId, String sourceId, boolean createScopedRecord) {
        ActivityEvent preferred = findPreferredEventRecord(sourceId);
        if (preferred != null && isViewerAdmin(preferred, ownerUserId)) {
            return activityEventsRepository.findBySourceId(sourceId).stream()
                    .filter(Objects::nonNull)
                    .map(this::cloneDocument)
                    .peek(ActivityEvent::normalizeLifecycleState)
                    .toList();
        }
        return activityEventsRepository.findByOwnerUserIdAndSourceId(ownerUserId, sourceId)
                .map(this::cloneDocument)
                .map(record -> {
                    record.normalizeLifecycleState();
                    return record;
                })
                .map(List::of)
                .orElseGet(() -> createScopedRecord
                        ? createScopedActionRecord(ownerUserId, sourceId, preferred)
                        : List.of());
    }

    private List<ActivityEvent> createScopedActionRecord(String ownerUserId, String sourceId, ActivityEvent preferred) {
        if (preferred == null
                || !StringUtils.hasText(ownerUserId)
                || !StringUtils.hasText(sourceId)
                || !hasTrackedUserParticipation(preferred, ownerUserId)) {
            return List.of();
        }
        ActivityEvent scoped = cloneDocument(preferred);
        scoped.setId(resolveExistingId(ownerUserId, sourceId, null));
        scoped.setSyncKey(resolveExistingSyncKey(ownerUserId, sourceId, null));
        scoped.setOwnerUserId(ownerUserId);
        scoped.setAdmins(resolveAdminUserIds(scoped.getSourceId(), scoped.getCreatorUserId()));
        scoped.normalizeLifecycleState();
        return List.of(scoped);
    }

    private List<ActivityEvent> ensurePublishedEventDocuments(List<ActivityEvent> documents, String actorUserId) {
        List<ActivityEvent> normalizedDocuments = documents == null
                ? List.of()
                : documents.stream().filter(Objects::nonNull).toList();
        LinkedHashSet<String> sourceIds = normalizedDocuments.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        for (String sourceId : sourceIds) {
            activitiesMembersService.ensureEventCreatorAdminMembership(sourceId, actorUserId);
        }
        if (sourceIds.isEmpty()) {
            return normalizedDocuments;
        }
        List<ActivityEvent> refreshed = activityEventsRepository.findBySourceIdIn(sourceIds).stream()
                .filter(Objects::nonNull)
                .toList();
        return refreshed.isEmpty() ? normalizedDocuments : refreshed;
    }

    private boolean materializePublishedMainEventChats(
            List<ActivityEvent> documents,
            String actorUserId) {
        if (chatService == null || documents == null || documents.isEmpty()) {
            return false;
        }
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent document : documents) {
            if (document == null || Boolean.TRUE.equals(document.getGenerated())) {
                continue;
            }
            String sourceId = normalizeId(document.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent current = preferredBySourceId.get(sourceId);
            if (current == null || shouldPreferRecord(document, current)) {
                preferredBySourceId.put(sourceId, document);
            }
        }
        if (preferredBySourceId.isEmpty()) {
            return false;
        }

        boolean actorChatAdded = false;
        String normalizedActorUserId = normalizeId(actorUserId);
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshots =
                activitiesMembersService.buildBatchOwnerSnapshots(OWNER_TYPE_EVENT, preferredBySourceId.keySet());
        for (Map.Entry<String, ActivityEvent> entry : preferredBySourceId.entrySet()) {
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshots.get(entry.getKey());
            List<String> acceptedUserIds = snapshot == null
                    ? List.of()
                    : normalizeIds(snapshot.acceptedMemberUserIds());
            if (acceptedUserIds.isEmpty()) {
                throw new IllegalStateException(
                        "Published event " + entry.getKey() + " has no accepted member for its main chat.");
            }
            ChatService.PublishedMainEventChatResult result =
                    chatService.ensurePublishedMainEventChat(entry.getValue(), acceptedUserIds);
            if (result != null
                    && result.createdOwnerUserIds().contains(normalizedActorUserId)) {
                actorChatAdded = true;
            }
        }
        return actorChatAdded;
    }

    private ActivityEvent buildSyncedRecord(
            EventDetailDto request,
            Users creator,
            String actorUserId,
            String sourceId,
            ActivitiesMembersService.OwnerMembersSnapshot syncedMembersSnapshot) {
        String ownerUserId = normalizeId(request.creatorUserId());
        if (!StringUtils.hasText(ownerUserId)) {
            ownerUserId = actorUserId;
        }

        ActivityEvent existing = activityEventsRepository.findByOwnerUserIdAndSourceId(ownerUserId, sourceId)
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
                ? persistedAcceptedMemberUserIds(existing)
                : new ArrayList<>(syncedMembersSnapshot.acceptedMemberUserIds());
        int acceptedMembers = syncedMembersSnapshot == null
                ? Math.max(normalizeCount(request.acceptedMembers()), acceptedMemberUserIds.size())
                : syncedMembersSnapshot.acceptedMembers();
        int pendingMembers = syncedMembersSnapshot == null
                ? normalizeCount(request.pendingMembers())
                : syncedMembersSnapshot.pendingMembers();
        List<String> pendingMemberUserIds = syncedMembersSnapshot == null
                ? normalizeIds(existing == null ? null : existing.getPendingMemberUserIds())
                : new ArrayList<>(syncedMembersSnapshot.pendingMemberUserIds());
        List<String> invitedMemberUserIds = syncedMembersSnapshot == null
                ? normalizeIds(existing == null ? null : existing.getInvitedMemberUserIds())
                : new ArrayList<>(syncedMembersSnapshot.invitedMemberUserIds());
        List<String> pendingRequestMemberUserIds = syncedMembersSnapshot == null
                ? normalizeIds(existing == null ? null : existing.getPendingRequestMemberUserIds())
                : new ArrayList<>(syncedMembersSnapshot.pendingRequestMemberUserIds());

        document.setId(resolveExistingId(ownerUserId, sourceId, existing));
        document.setSyncKey(resolveExistingSyncKey(ownerUserId, sourceId, existing == null ? request.syncKey() : existing.getSyncKey()));
        document.setSourceId(sourceId);
        document.setOwnerUserId(ownerUserId);
        document.setAvatar(resolveCreatorInitials(request.creatorInitials(), creator, request.creatorName()));
        document.setTitle(safeText(request.title()));
        document.setSubtitle(safeText(request.subtitle()));
        document.setTimeframe(safeText(request.timeframe()));
        document.setInviter(existing == null ? null : existing.getInviter());
        document.setUnread(existing == null ? 0 : normalizeCount(existing.getUnread()));
        document.setActivity(normalizeCount(request.activity()));
        String requestedStatus = normalizeEventStatus(request.status());
        document.setStatus(ActivityEvent.STATUS_DRAFT.equals(requestedStatus) ? ActivityEvent.STATUS_DRAFT : ActivityEvent.STATUS_ACTIVE);
        document.setTrashedAtIso(existing == null ? null : existing.getTrashedAtIso());
        document.setCreatorUserId(ownerUserId);
        document.setCreatorName(resolveCreatorName(request.creatorName(), creator));
        document.setCreatorInitials(resolveCreatorInitials(request.creatorInitials(), creator, request.creatorName()));
        document.setCreatorGender(resolveCreatorGender(request.creatorGender(), creator));
        document.setCreatorCity(resolveCreatorCity(request.creatorCity(), creator));
        document.setVisibility(publishedExisting != null ? safeText(publishedExisting.getVisibility()) : resolveVisibility(request.visibility(), existing));
        document.setBlindMode(publishedExisting != null ? safeText(publishedExisting.getBlindMode()) : resolveBlindMode(request.blindMode(), existing));
        String normalizedFrequency = publishedManageMode
                ? normalizeEventFrequency(existing == null ? null : existing.getFrequency())
                : normalizeEventFrequency(StringUtils.hasText(request.frequency()) ? request.frequency().trim() : safeText(existing == null ? null : existing.getFrequency()));
        document.setFrequency(normalizedFrequency);
        document.setStartAtIso(publishedManageMode
                ? normalizeDateTime(existing == null ? null : existing.getStartAtIso(), nowIso)
                : normalizeDateTime(request.startAtIso(), existing == null ? nowIso : existing.getStartAtIso()));
        document.setEndAtIso(publishedManageMode
                ? normalizeDateTime(existing == null ? null : existing.getEndAtIso(), document.getStartAtIso())
                : normalizeDateTime(request.endAtIso(), document.getStartAtIso()));
        resetExpiredOnBoundaryChange(document, existing);
        document.setDistanceKm(null);
        document.setImageUrl(request.imageUrl() == null
                ? safeText(existing == null ? null : existing.getImageUrl())
                : request.imageUrl().trim());
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
                ? existing != null && (Boolean.TRUE.equals(existing.getTicketing()) || Boolean.TRUE.equals(request.ticketing()))
                : request.ticketing() != null ? request.ticketing() : existing != null && Boolean.TRUE.equals(existing.getTicketing()));
        document.setApprovalRequired(publishedManageMode
                ? existing != null && Boolean.TRUE.equals(existing.getApprovalRequired())
                : request.approvalRequired() != null ? request.approvalRequired() : existing != null && Boolean.TRUE.equals(existing.getApprovalRequired()));
        document.setPricing(publishedManageMode
                ? existing == null ? null : clonePricing(existing.getPricing())
                : request.pricing() != null ? clonePricing(request.pricing()) : existing == null ? null : clonePricing(existing.getPricing()));
        document.setPoliciesEnabled(publishedManageMode
                ? existing != null && Boolean.TRUE.equals(existing.getPoliciesEnabled())
                : Boolean.TRUE.equals(request.policiesEnabled()));
        document.setPolicies(publishedManageMode
                ? clonePolicies(existing == null ? null : existing.getPolicies())
                : clonePolicies(request.policies()));
        boolean slotsEnabled = publishedManageMode
                ? existing != null && Boolean.TRUE.equals(existing.getSlotsEnabled())
                : !slotEvent && Boolean.TRUE.equals(request.slotsEnabled());
        document.setSlotsEnabled(slotsEnabled);
        document.setSlotTemplates(publishedManageMode
                ? cloneSlotTemplates(existing == null ? null : existing.getSlotTemplates())
                : slotEvent || !slotsEnabled ? List.of() : cloneSlotTemplates(request.slotTemplates()));
        document.setParentEventId(slotEvent ? parentEventId : null);
        document.setSlotTemplateId(slotEvent ? slotTemplateId : null);
        document.setGenerated(slotEvent && generated);
        document.setEventType(slotEvent ? "slot" : "main");
        document.setUpcomingSlots(slotEvent ? List.of() : cloneSlotOccurrences(existing == null ? null : existing.getUpcomingSlots()));
        document.setAcceptedMembers(acceptedMembers);
        document.setPendingMembers(pendingMembers);
        document.setAcceptedMemberUserIds(acceptedMemberUserIds);
        document.setPendingMemberUserIds(pendingMemberUserIds);
        document.setInvitedMemberUserIds(invitedMemberUserIds);
        document.setPendingRequestMemberUserIds(pendingRequestMemberUserIds);
        document.setFull(directRecordFull(document));
        document.setTopics(normalizeStrings(request.topics()));
        boolean subEventsEnabled = publishedManageMode
                ? existing == null || existing.getSubEventsEnabled() == null || Boolean.TRUE.equals(existing.getSubEventsEnabled())
                : request.subEventsEnabled() == null || Boolean.TRUE.equals(request.subEventsEnabled());
        List<SubEventDefinitionDto> nextSubEventDefinitions = publishedManageMode
                ? cloneSubEventDefinitions(existing == null ? null : existing.getSubEventDefinitions())
                : cloneSubEventDefinitions(request.subEventDefinitions());
        document.setSubEventsEnabled(subEventsEnabled);
        document.setSubEventDefinitions(nextSubEventDefinitions);
        document.setSubEvents(List.of());
        document.setMode(normalizeEventMode(publishedManageMode
                ? safeText(existing == null ? null : existing.getMode())
                : safeText(request.mode())));
        document.setRating(existing == null ? 0d : safeDouble(existing.getRating()));
        document.setAffinity(resolveAffinity(document, creator, acceptedMemberUserIds));
        document.setBoost(resolveBoost(document, creator, acceptedMemberUserIds));
        document.setCreatedDate(existing == null ? nowIso : safeText(existing.getCreatedDate()));
        document.setCreatedUser(existing == null ? actorUserId : safeText(existing.getCreatedUser()));
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(actorUserId);
        document.setAdmins(syncedMembersSnapshot == null
                ? normalizeIds(existing == null ? null : existing.getAdmins())
                : new ArrayList<>(syncedMembersSnapshot.adminUserIds()));
        document.normalizeLifecycleState();
        return document;
    }

    private void resetExpiredOnBoundaryChange(ActivityEvent document, ActivityEvent existing) {
        if (document == null) {
            return;
        }
        if (existing == null) {
            document.setIsExpired(false);
            return;
        }
        String previousBoundary = expiryBoundaryIso(existing);
        String nextBoundary = expiryBoundaryIso(document);
        if (!Objects.equals(previousBoundary, nextBoundary)) {
            document.setIsExpired(false);
        }
    }

    private String expiryBoundaryIso(ActivityEvent event) {
        if (event == null) {
            return "";
        }
        return firstNonBlank(event.getEndAtIso(), event.getStartAtIso());
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

    private List<String> persistedAcceptedMemberUserIds(ActivityEvent existing) {
        return normalizeIds(existing == null ? null : existing.getAcceptedMemberUserIds());
    }

    private int resolveCapacityTotal(
            EventDetailDto request,
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
                && !ActivityEvent.STATUS_DRAFT.equals(safeText(existing.getStatus()));
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

    private String resolveExistingId(String ownerUserId, String sourceId, ActivityEvent existing) {
        if (existing != null && StringUtils.hasText(existing.getId())) {
            return existing.getId();
        }
        return activityEventsRepository.findByOwnerUserIdAndSourceId(ownerUserId, sourceId)
                .map(ActivityEvent::getId)
                .filter(StringUtils::hasText)
                .orElseGet(() -> new ObjectId().toHexString());
    }

    private String resolveExistingSyncKey(String ownerUserId, String sourceId, String preferred) {
        if (StringUtils.hasText(preferred)) {
            return preferred.trim();
        }
        return activityEventsRepository.findByOwnerUserIdAndSourceId(ownerUserId, sourceId)
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
                .append("query", new Document("status", ActivityEvent.STATUS_ACTIVE)
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
        if (ctx != null && StringUtils.hasText(sourceId)) {
            if (ctx.trackedEventSourceIds().contains(sourceId)) {
                return true;
            }
            String status = safeText(ctx.trackedEventStatusesBySourceId().get(sourceId));
            return MEMBER_STATUS_ACCEPTED.equals(status)
                    || MEMBER_STATUS_PENDING.equals(status)
                    || MEMBER_STATUS_INVITED.equals(status)
                    || MEMBER_STATUS_DELETED.equals(status);
        }
        return resolveAcceptedMemberUserIds(record).contains(userId)
                || resolvePendingRequestMemberUserIds(record).contains(userId)
                || resolveInvitedMemberUserIds(record).contains(userId);
    }

    private boolean hasAcceptedParticipation(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId) || isViewerAdmin(record, userId)) {
            return false;
        }
        String trackedStatus = trackedEventMembershipStatus(record);
        if (MEMBER_STATUS_ACCEPTED.equals(trackedStatus)) {
            return !hasPendingPaymentParticipation(record, userId);
        }
        if (MEMBER_STATUS_PENDING.equals(trackedStatus)) {
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
        String trackedStatus = trackedEventMembershipStatus(record);
        if (MEMBER_STATUS_ACCEPTED.equals(trackedStatus)) {
            return hasPendingPaymentParticipation(record, userId);
        }
        if (MEMBER_STATUS_PENDING.equals(trackedStatus)) {
            return !hasInvitationMembership(record, userId);
        }
        if (resolveAcceptedMemberUserIds(record).contains(userId)) {
            return hasPendingPaymentParticipation(record, userId);
        }
        return resolvePendingRequestMemberUserIds(record).contains(userId);
    }

    private boolean hasInvitationMembership(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId)) {
            return false;
        }
        if (resolveInvitedMemberUserIds(record).contains(userId)) {
            return true;
        }
        String trackedStatus = trackedEventMembershipStatus(record);
        return MEMBER_STATUS_INVITED.equals(trackedStatus);
    }

    private String trackedEventMembershipStatus(ActivityEvent record) {
        String sourceId = normalizeId(record == null ? null : record.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return "";
        }
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        return ctx == null ? "" : safeText(ctx.trackedEventStatusesBySourceId().get(sourceId));
    }

    private boolean hasPendingPaymentParticipation(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId) || !Boolean.TRUE.equals(record.getTicketing())) {
            return false;
        }
        String sourceId = normalizeId(record.getSourceId());
        EventQueryContext ctx = ACTIVE_CONTEXT.get();
        if (ctx != null) {
            return ctx.pendingPaymentEventSourceIds().contains(sourceId);
        }
        return paymentService.hasPendingEventJoin(userId, sourceId);
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
        return !isRecordFull(record);
    }

    private boolean isViewerAdmin(ActivityEvent record, String viewerUserId) {
        if (record == null || !StringUtils.hasText(viewerUserId)) {
            return false;
        }
        if (viewerUserId.equals(normalizeId(record.getCreatorUserId()))) {
            return true;
        }
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null) {
            return snapshot.hasAcceptedAdminRole(viewerUserId);
        }
        return normalizeIds(record.getAdmins()).contains(viewerUserId);
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

    private ActivityEvent findPreferredEventDetailRecord(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return null;
        }
        ActivityEvent best = null;
        int bestScore = Integer.MIN_VALUE;
        for (ActivityEvent record : loadEventDocumentsBySourceIds(List.of(normalizedSourceId))) {
            int score = eventDetailRecordScore(record);
            if (best == null || score > bestScore) {
                best = record;
                bestScore = score;
            }
        }
        return best;
    }

    private int eventDetailRecordScore(ActivityEvent record) {
        if (record == null) {
            return Integer.MIN_VALUE;
        }
        int score = 0;
        // The creator-owned document is the canonical editor document. Participant
        // and member-scoped copies intentionally contain only list/runtime state.
        String ownerUserId = normalizeId(record.getOwnerUserId());
        String creatorUserId = normalizeId(record.getCreatorUserId());
        if (StringUtils.hasText(ownerUserId) && ownerUserId.equals(creatorUserId)) {
            score += 1_000_000;
        }
        score += record.getSubEventDefinitions() == null ? 0 : record.getSubEventDefinitions().size() * 10_000;
        score += record.getSlotTemplates() == null ? 0 : record.getSlotTemplates().size() * 1_000;
        score += record.getPolicies() == null ? 0 : record.getPolicies().size() * 100;
        score += record.getPricing() == null ? 0 : 50;
        score += StringUtils.hasText(record.getSourceLink()) ? 10 : 0;
        score += StringUtils.hasText(record.getBlindMode()) ? 5 : 0;
        return score;
    }

    private List<ActivityEvent> loadEventDocumentsBySourceIds(Collection<String> sourceIds) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return List.of();
        }
        List<ActivityEvent> documents = activityEventsRepository.findBySourceIdIn(normalizedSourceIds);
        return (documents == null ? List.<ActivityEvent>of() : documents).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .toList();
    }

    private List<ActivityEvent> loadEventListCardDocumentsBySourceIds(Collection<String> sourceIds) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return List.of();
        }
        Query query = new Query(Criteria.where("sourceId").in(normalizedSourceIds));
        query.with(Sort.by(Sort.Direction.ASC, "startAtIso", "sourceId"));
        includeEventListCardFields(query);
        return mongoTemplate.find(query, ActivityEvent.class).stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .map(this::cloneDocument)
                .peek(ActivityEvent::normalizeLifecycleState)
                .toList();
    }

    private void includeEventListCardFields(Query query) {
        query.fields()
                .include("sourceId")
                .include("ownerUserId")
                .include("status")
                .include("admins")
                .include("avatar")
                .include("title")
                .include("subtitle")
                .include("timeframe")
                .include("unread")
                .include("activity")
                .include("creatorUserId")
                .include("creatorName")
                .include("creatorInitials")
                .include("creatorCity")
                .include("visibility")
                .include("startAtIso")
                .include("endAtIso")
                .include("distanceKm")
                .include("imageUrl")
                .include("location")
                .include("locationCoordinates")
                .include("capacityMin")
                .include("capacityMax")
                .include("capacityTotal")
                .include("full")
                .include("ticketing")
                .include("approvalRequired")
                .include("parentEventId")
                .include("slotTemplateId")
                .include("generated")
                .include("eventType")
                .include("acceptedMembers")
                .include("pendingMembers")
                .include("acceptedMemberUserIds")
                .include("pendingMemberUserIds")
                .include("invitedMemberUserIds")
                .include("pendingRequestMemberUserIds")
                .include("topics")
                .include("rating")
                .include("boost")
                .include("affinity");
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

    private List<String> resolveAdminUserIds(ActivityEvent record) {
        LinkedHashSet<String> adminUserIds = new LinkedHashSet<>();
        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                resolveSnapshot(normalizeId(record == null ? null : record.getSourceId()));
        if (snapshot != null) {
            adminUserIds.addAll(snapshot.adminUserIds());
        } else {
            adminUserIds.addAll(normalizeIds(record == null ? null : record.getAdmins()));
        }
        String creatorUserId = normalizeId(record == null ? null : record.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId)) {
            adminUserIds.add(creatorUserId);
        }
        return new ArrayList<>(adminUserIds);
    }

    private List<String> resolveAcceptedMemberUserIds(ActivityEvent record) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null) {
            return new ArrayList<>(snapshot.acceptedMemberUserIds());
        }
        return persistedAcceptedMemberUserIds(record);
    }

    private List<String> resolvePendingMemberUserIds(ActivityEvent record) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null) {
            return new ArrayList<>(snapshot.pendingMemberUserIds());
        }
        return normalizeIds(record == null ? null : record.getPendingMemberUserIds());
    }

    private List<String> resolveInvitedMemberUserIds(ActivityEvent record) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null) {
            return new ArrayList<>(snapshot.invitedMemberUserIds());
        }
        return normalizeIds(record == null ? null : record.getInvitedMemberUserIds());
    }

    private List<String> resolvePendingRequestMemberUserIds(ActivityEvent record) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null) {
            return new ArrayList<>(snapshot.pendingRequestMemberUserIds());
        }
        return normalizeIds(record == null ? null : record.getPendingRequestMemberUserIds());
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
            if (cursorId.equals(projectionId(items.get(index)))) {
                return index + 1;
            }
        }
        return 0;
    }

    private int resolveRecordCursorStartIndex(List<ActivityEvent> items, String cursor) {
        String cursorId = parseCursorId(cursor);
        if (!StringUtils.hasText(cursorId)) {
            return 0;
        }
        for (int index = 0; index < items.size(); index += 1) {
            if (cursorId.equals(normalizeId(items.get(index).getSourceId()))) {
                return index + 1;
            }
        }
        return 0;
    }

    private String serializeCursor(EventDto item) {
        if (item == null || !StringUtils.hasText(item.id())) {
            return null;
        }
        return serializeCursorId(item.id());
    }

    private String serializeCursorId(String id) {
        String normalizedId = normalizeId(id);
        if (!StringUtils.hasText(normalizedId)) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(Map.of("id", normalizedId));
        } catch (Exception ignored) {
            return normalizedId;
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

    private Comparator<EventDto> listItemComparator() {
        return Comparator.comparing((EventDto item) -> toSortableDate(item.startAtIso()))
                .thenComparing(item -> safeText(item.id()));
    }

    private List<ActivityEvent> sortEventRecordsByStart(List<ActivityEvent> records) {
        if (records == null || records.isEmpty()) {
            return List.of();
        }
        return records.stream()
                .filter(Objects::nonNull)
                .map(record -> new EventRecordSortKey(
                        record,
                        toSortableDate(record.getStartAtIso()),
                        safeText(normalizeId(record.getSourceId()))))
                .sorted(Comparator.comparingLong(EventRecordSortKey::startAtMs)
                        .thenComparing(EventRecordSortKey::sourceId))
                .map(EventRecordSortKey::record)
                .toList();
    }

    private ActivityEvent cloneDocument(ActivityEvent source) {
        ActivityEvent clone = new ActivityEvent();
        BeanUtils.copyProperties(source, clone);
        clone.setAdmins(new ArrayList<>(normalizeIds(source.getAdmins())));
        clone.setAcceptedMemberUserIds(new ArrayList<>(normalizeIds(source.getAcceptedMemberUserIds())));
        clone.setPendingMemberUserIds(new ArrayList<>(normalizeIds(source.getPendingMemberUserIds())));
        clone.setInvitedMemberUserIds(new ArrayList<>(normalizeIds(source.getInvitedMemberUserIds())));
        clone.setPendingRequestMemberUserIds(new ArrayList<>(normalizeIds(source.getPendingRequestMemberUserIds())));
        clone.setTopics(new ArrayList<>(normalizeStrings(source.getTopics())));
        clone.setSubEventDefinitions(cloneSubEventDefinitions(source.getSubEventDefinitions()));
        clone.setSubEvents(cloneSubEvents(source.getSubEvents()));
        clone.setSlotTemplates(cloneSlotTemplates(source.getSlotTemplates()));
        clone.setUpcomingSlots(cloneSlotOccurrences(source.getUpcomingSlots()));
        clone.setPricing(clonePricing(source.getPricing()));
        clone.setPolicies(clonePolicies(source.getPolicies()));
        clone.setLocationCoordinates(cloneLocation(source.getLocationCoordinates()));
        clone.setLocationGeo(cloneGeoPoint(source.getLocationGeo()));
        return clone;
    }

    private boolean isSuppressedLifecycleStatus(String status) {
        String normalized = safeText(status);
        return ActivityEvent.STATUS_UNDER_REVIEW.equals(normalized)
                || ActivityEvent.STATUS_BLOCKED.equals(normalized)
                || ActivityEvent.STATUS_DELETED.equals(normalized)
                || ActivityEvent.STATUS_INACTIVE.equals(normalized);
    }

    private String normalizeActivityListFilter(String value) {
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

    private int normalizePageLimit(Integer value, int fallback) {
        return Math.min(100, normalizeLimit(value, fallback));
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

    private String resolveTelemetryEventType(EventDetailDto request) {
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

    private List<SubEventItem> cloneSubEvents(List<SubEventItem> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private List<SubEventDefinitionDto> cloneSubEventDefinitions(List<SubEventDefinitionDto> items) {
        if (items == null) {
            return new ArrayList<>();
        }
        List<SubEventDefinitionDto> cloned = new ArrayList<>();
        for (SubEventDefinitionDto item : items) {
            if (item == null) {
                continue;
            }
            cloned.add(new SubEventDefinitionDto(
                    item.id(),
                    item.name(),
                    item.description(),
                    item.timing(),
                    item.offsetMinutes(),
                    item.durationMinutes(),
                    item.location(),
                    item.tournamentGroupCapacityMin(),
                    item.tournamentGroupCapacityMax(),
                    item.tournamentLeaderboardType(),
                    item.tournamentAdvancePerGroup(),
                    item.optional(),
                    clonePricing(item.pricing()),
                    item.capacityMin(),
                    item.capacityMax(),
                    item.icon()));
        }
        return cloned;
    }

    private List<SubEventItem> ensureTournamentStartReviewStage(List<SubEventItem> items, String nowIso) {
        List<SubEventItem> subEvents = cloneSubEvents(items);
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

        SubEventItem firstStage = subEvents.get(0);
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

    private SubEventItem firstTournamentStage(List<SubEventItem> items) {
        List<SubEventItem> subEvents = cloneSubEvents(items);
        if (subEvents.isEmpty() || !isTournamentStage(subEvents.get(0))) {
            return null;
        }
        return subEvents.get(0);
    }

    private boolean isTournamentStage(SubEventItem item) {
        if (item == null || Boolean.TRUE.equals(item.optional())) {
            return false;
        }
        return autoTournamentGroupCount(item) > 0
                || "Score".equalsIgnoreCase(safeText(item.tournamentLeaderboardType()))
                || "Fifa".equalsIgnoreCase(safeText(item.tournamentLeaderboardType()));
    }

    private int autoTournamentGroupCount(SubEventItem item) {
        return autoTournamentGroupCountForIncoming(item, item == null ? 0 : safeCount(item.capacityMax()));
    }

    private int autoTournamentGroupCount(ActivityEvent event, SubEventItem targetStage) {
        if (targetStage == null) {
            return 0;
        }
        List<SubEventItem> stages = runtimeStageSequence(event);
        if (stages.isEmpty()) {
            stages = List.of(targetStage);
        }
        int incomingCapacityMax = Math.max(safeCount(event == null ? null : event.getCapacityMax()), safeCount(targetStage.capacityMax()));
        for (SubEventItem stage : stages == null ? List.<SubEventItem>of() : stages) {
            if (stage == null) {
                continue;
            }
            int groupCount = autoTournamentGroupCountForIncoming(stage, incomingCapacityMax);
            if (sameStage(stage, targetStage)) {
                return groupCount;
            }
            if (hasTournamentStageConfig(stage) && groupCount > 0) {
                int advancePerGroup = safeCount(stage.tournamentAdvancePerGroup());
                incomingCapacityMax = advancePerGroup > 0 ? groupCount * advancePerGroup : 0;
            }
        }
        return autoTournamentGroupCountForIncoming(targetStage, incomingCapacityMax);
    }

    private int autoTournamentGroupCountForIncoming(SubEventItem item, int incomingCapacityMax) {
        if (item == null) {
            return 0;
        }
        int groupMin = Math.max(0, item.tournamentGroupCapacityMin() == null ? 0 : item.tournamentGroupCapacityMin());
        int groupMax = Math.max(groupMin, item.tournamentGroupCapacityMax() == null ? groupMin : item.tournamentGroupCapacityMax());
        if (groupMin > 0 || groupMax > 0) {
            int divisor = Math.max(1, groupMax > 0 ? groupMax : groupMin);
            int capacityMax = Math.max(0, incomingCapacityMax > 0 ? incomingCapacityMax : safeCount(item.capacityMax()));
            int groupsNeededForMaximum = capacityMax > 0
                    ? (int) Math.ceil((double) capacityMax / divisor)
                    : 0;
            int groupsAllowedByMinimum = groupMin > 0
                    ? Math.max(1, capacityMax / groupMin)
                    : groupsNeededForMaximum;
            return Math.min(groupsNeededForMaximum, groupsAllowedByMinimum);
        }
        return 0;
    }

    private boolean hasTournamentStageConfig(SubEventItem item) {
        return item != null
                && !Boolean.TRUE.equals(item.optional())
                && (safeCount(item.tournamentGroupCapacityMin()) > 0
                        || safeCount(item.tournamentGroupCapacityMax()) > 0
                        || "Score".equalsIgnoreCase(safeText(item.tournamentLeaderboardType()))
                        || "Fifa".equalsIgnoreCase(safeText(item.tournamentLeaderboardType())));
    }

    private boolean sameStage(SubEventItem left, SubEventItem right) {
        if (left == null || right == null) {
            return false;
        }
        String leftId = normalizeId(left.id());
        String rightId = normalizeId(right.id());
        return StringUtils.hasText(leftId) && leftId.equals(rightId);
    }

    private int safeCount(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private SubEventItem findSubEvent(ActivityEvent event, String subEventId) {
        String normalizedSubEventId = normalizeId(subEventId);
        if (event == null || !StringUtils.hasText(normalizedSubEventId)) {
            return null;
        }
        for (SubEventItem item : runtimeStageSequence(event)) {
            if (item != null && normalizedSubEventId.equals(normalizeId(item.id()))) {
                return item;
            }
        }
        return null;
    }

    private List<SubEventItem> runtimeStageSequence(ActivityEvent event) {
        if (event == null) {
            return List.of();
        }
        List<SubEventItem> subEvents = event.getSubEvents();
        if (subEvents != null && !subEvents.isEmpty()) {
            return subEvents;
        }
        List<SubEventDefinitionDto> definitions = event.getSubEventDefinitions();
        if (definitions == null || definitions.isEmpty()) {
            return List.of();
        }
        List<SubEventItem> stages = new ArrayList<>();
        for (int index = 0; index < definitions.size(); index += 1) {
            SubEventDefinitionDto definition = definitions.get(index);
            if (definition == null) {
                continue;
            }
            stages.add(new SubEventItem(
                    firstNonBlank(definition.id(), fallbackSubEventId(index)),
                    firstNonBlank(definition.name(), "Sub Event " + (index + 1)),
                    safeText(definition.description()),
                    null,
                    null,
                    safeText(definition.location()),
                    null,
                    definition.tournamentGroupCapacityMin(),
                    definition.tournamentGroupCapacityMax(),
                    definition.tournamentLeaderboardType(),
                    definition.tournamentAdvancePerGroup(),
                    definition.optional(),
                    clonePricing(definition.pricing()),
                    definition.capacityMin(),
                    definition.capacityMax(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    Math.max(0, definition.offsetMinutes() == null ? 0 : definition.offsetMinutes()),
                    Math.max(0, definition.durationMinutes() == null ? 0 : definition.durationMinutes())));
        }
        return stages;
    }

    private String normalizeSubEventDefinitionTiming(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        if ("before".equals(normalized)) {
            return "Before";
        }
        if ("during".equals(normalized)) {
            return "During";
        }
        if ("after".equals(normalized)) {
            return "After";
        }
        return "During";
    }

    private List<SubEventDefinitionTimelineEntry> subEventDefinitionTimeline(List<SubEventDefinitionDto> items) {
        if (items == null || items.isEmpty()) {
            return List.of();
        }
        List<SubEventDefinitionTimelineEntry> timeline = new ArrayList<>();
        int previousStartOffsetMinutes = 0;
        int previousEndOffsetMinutes = 0;
        boolean hasPrevious = false;
        for (SubEventDefinitionDto item : items) {
            if (item == null) {
                continue;
            }
            int durationMinutes = Math.max(0, item.durationMinutes() == null ? 0 : item.durationMinutes());
            int offsetMinutes = Math.max(0, item.offsetMinutes() == null ? 0 : item.offsetMinutes());
            String timing = normalizeSubEventDefinitionTiming(item.timing());
            int startOffsetMinutes = !hasPrevious
                    ? offsetMinutes
                    : "During".equals(timing)
                            ? previousStartOffsetMinutes + offsetMinutes
                            : previousEndOffsetMinutes + offsetMinutes;
            previousStartOffsetMinutes = startOffsetMinutes;
            previousEndOffsetMinutes = startOffsetMinutes + durationMinutes;
            hasPrevious = true;
            timeline.add(new SubEventDefinitionTimelineEntry(item, startOffsetMinutes, durationMinutes));
        }
        return timeline;
    }

    private long subEventDefinitionsDurationMinutes(List<SubEventDefinitionDto> items) {
        long maxEndOffset = 0L;
        for (SubEventDefinitionTimelineEntry entry : subEventDefinitionTimeline(items)) {
            maxEndOffset = Math.max(maxEndOffset, (long) entry.startOffsetMinutes() + entry.durationMinutes());
        }
        return maxEndOffset;
    }

    private List<SubEventDefinitionDto> slotTemplateSubEventDefinitions(ActivityEvent parent, EventSlotTemplateDto template) {
        if (!Boolean.TRUE.equals(parent.getSubEventsEnabled())) {
            return List.of();
        }
        List<SubEventDefinitionDto> overrideDefinitions = cloneSubEventDefinitions(template == null ? null : template.subEventDefinitions());
        return overrideDefinitions.isEmpty()
                ? cloneSubEventDefinitions(parent.getSubEventDefinitions())
                : overrideDefinitions;
    }

    private record SubEventDefinitionTimelineEntry(
            SubEventDefinitionDto item,
            int startOffsetMinutes,
            int durationMinutes) {
    }

    private List<EventSlotTemplateDto> cloneSlotTemplates(List<EventSlotTemplateDto> items) {
        if (items == null) {
            return new ArrayList<>();
        }
        List<EventSlotTemplateDto> cloned = new ArrayList<>();
        for (EventSlotTemplateDto item : items) {
            if (item == null) {
                continue;
            }
            cloned.add(new EventSlotTemplateDto(
                    item.id(),
                    item.startAt(),
                    item.overrideDate(),
                    item.closed(),
                    cloneSubEventDefinitions(item.subEventDefinitions())));
        }
        return cloned;
    }

    private List<EventSlotOccurrenceDto> cloneSlotOccurrences(List<EventSlotOccurrenceDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private PricingConfigDto clonePricing(PricingConfigDto pricing) {
        return pricing;
    }

    private List<PolicyItemDto> clonePolicies(List<PolicyItemDto> policies) {
        if (policies == null) {
            return new ArrayList<>();
        }
        List<PolicyItemDto> normalized = new ArrayList<>();
        for (int index = 0; index < policies.size(); index += 1) {
            PolicyItemDto policy = policies.get(index);
            if (policy == null) {
                continue;
            }
            String title = safeText(policy.title());
            String description = safeText(policy.description());
            if (!StringUtils.hasText(title) && !StringUtils.hasText(description)) {
                continue;
            }
            String id = safeText(policy.id());
            if (!StringUtils.hasText(id)) {
                id = "policy-" + (index + 1);
            }
            normalized.add(new PolicyItemDto(
                    id,
                    StringUtils.hasText(title) ? title : "Policy " + (index + 1),
                    description,
                    !Boolean.FALSE.equals(policy.required())));
        }
        return normalized;
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
            case "custom" -> "Custom";
            case "daily" -> "Daily";
            case "weekly" -> "Weekly";
            case "bi-weekly", "biweekly" -> "Bi-weekly";
            case "monthly" -> "Monthly";
            case "yearly", "annual", "annually" -> "Yearly";
            default -> "One-time";
        };
    }

    private String normalizeEventMode(String value) {
        return "tournament".equalsIgnoreCase(safeText(value)) ? "Tournament" : "Casual";
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

    private String resolveVisibility(String requestedVisibility, ActivityEvent existing) {
        if (StringUtils.hasText(requestedVisibility)) {
            return requestedVisibility.trim();
        }
        if (existing != null && StringUtils.hasText(existing.getVisibility())) {
            return existing.getVisibility();
        }
        return "Public";
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

    private record CheckoutSlotPricing(
            double amount,
            String currency,
            List<EventCheckoutPricingSummaryRowDto> rows) {
    }

    private static final class CheckoutSlotDayAccumulator {
        private int slotCount;
        private int availableSlots;
        private boolean bookedByViewer;
        private double lowestAmount = Double.MAX_VALUE;
        private String currency;

        CheckoutSlotDayAccumulator(String currency) {
            this.currency = StringUtils.hasText(currency) ? currency : "USD";
        }

        void add(EventCheckoutSlotDto slot) {
            if (slot == null) {
                return;
            }
            slotCount += 1;
            int slotAvailable = Math.max(0, slot.availableSlots() == null ? 0 : slot.availableSlots());
            availableSlots += slotAvailable;
            bookedByViewer = bookedByViewer || Boolean.TRUE.equals(slot.bookedByViewer());
            if (slotAvailable > 0) {
                double amount = slot.amount() == null ? 0d : Math.max(0d, slot.amount());
                lowestAmount = Math.min(lowestAmount, amount);
            }
            if (StringUtils.hasText(slot.currency())) {
                currency = slot.currency();
            }
        }

        EventCheckoutSlotDayDto toDto(String dateKey) {
            return new EventCheckoutSlotDayDto(
                    dateKey,
                    slotCount,
                    availableSlots,
                    bookedByViewer,
                    lowestAmount == Double.MAX_VALUE ? 0d : lowestAmount,
                    currency);
        }
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

    private record EventDefinitionChangeSummary(
            boolean changed,
            Set<String> removedSubEventIds,
            List<String> reasons) {
    }

    private record EventProjection(
            ActivityEvent record,
            EventDto item,
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

    private record EventRecordSortKey(ActivityEvent record, long startAtMs, String sourceId) {
    }

    private record EventQueryContext(
            List<ActivityEvent> allEvents,
            List<ActivityEvent> mergedEvents,
            Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId,
            Set<String> trackedEventSourceIds,
            Map<String, String> trackedEventStatusesBySourceId,
            Set<String> pendingPaymentEventSourceIds,
            Map<String, Double> edgeWeightsByPairKey,
            Map<String, String> creatorAvatarUrlsByUserId) {
        private EventQueryContext(
                List<ActivityEvent> allEvents,
                List<ActivityEvent> mergedEvents,
                Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId,
                Set<String> trackedEventSourceIds,
                Map<String, String> trackedEventStatusesBySourceId,
                Set<String> pendingPaymentEventSourceIds,
                Map<String, Double> edgeWeightsByPairKey) {
            this(
                    allEvents,
                    mergedEvents,
                    snapshotsBySourceId,
                    trackedEventSourceIds,
                    trackedEventStatusesBySourceId,
                    pendingPaymentEventSourceIds,
                    edgeWeightsByPairKey,
                    Map.of());
        }
    }
}
