package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberActionResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberInviteRejectionDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberStatusDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersInviteRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersInviteResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersSummariesRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberSyncKnownItemDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersSyncResponseDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberInvolvementDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMembersSummaryDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.mapper.ActivityMemberMapper;

@Service
public class ActivitiesMembersService {
    private static final String RANDOM_ROOM_EVENT_TYPE = "random-room";
    private static final String TOURNAMENT_ROOM_EVENT_TYPE = "tournament-room";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_SUB_EVENT = "subEvent";
    private static final String OWNER_TYPE_GROUP = "group";
    private static final String OWNER_TYPE_ASSET = "asset";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String STATUS_PENDING = "pending";
    private static final String STATUS_INVITED = "I";
    private static final String STATUS_DELETED = "deleted";
    private static final String STATUS_REMOVED = "removed";
    private static final String STATUS_SUPPRESSED = "suppressed";
    private static final String RESOURCE_STATUS_DELETED = "D";
    private static final String STATUS_DISQUALIFIED = "disqualified";
    private static final String STAGE_STATUS_ACTIVE = "A";
    private static final String STAGE_STATUS_SCORE_REVIEW = "SR";
    private static final String STAGE_STATUS_FINALIZED = "F";
    private static final String STAGE_STATUS_SUSPENDED = "S";
    private static final String ACTION_ACCEPT = "accept";
    private static final String ACTION_REMOVE = "remove";
    private static final String ACTION_DISQUALIFY = "disqualify";
    private static final String ACTION_REINSTATE = "reinstate";
    private static final String ACTION_PROMOTE_ADMIN = "promote-admin";
    private static final String ACTION_STEP_DOWN_ADMIN = "step-down-admin";
    private static final String ACTION_SET_ORGANIZER_ONLY = "set-organizer-only";
    private static final String ACTION_SET_PARTICIPANT = "set-participant";
    private static final String REQUEST_KIND_JOIN = "join";
    private static final String REQUEST_KIND_INVITE = "invite";
    private static final String REQUEST_KIND_APPROVAL = "approval";
    private static final String REQUEST_KIND_WAITLIST = "waitlist";
    private static final String REQUEST_KIND_WAITLIST_INVITE = "waitlist-invite";
    private static final Set<String> OWNER_TYPES = Set.of("event", "subEvent", "group", "asset");
    private static final Set<String> PARTICIPATION_TREE_OWNER_TYPES =
            Set.of(OWNER_TYPE_EVENT, OWNER_TYPE_SUB_EVENT, OWNER_TYPE_GROUP);
    private static final Set<String> ACCEPTED_STATUSES = Set.of(STATUS_ACCEPTED);
    private static final Set<String> ROOT_SUPPRESSIBLE_STATUSES =
            Set.of(STATUS_ACCEPTED, STATUS_PENDING, STATUS_INVITED);
    private static final Set<String> SUPPRESSIBLE_STATUSES =
            Set.of(STATUS_ACCEPTED, STATUS_PENDING, STATUS_INVITED, STATUS_DISQUALIFIED);
    private static final Set<String> HIDDEN_MEMBERSHIP_STATUSES =
            Set.of(STATUS_DELETED, STATUS_SUPPRESSED, STATUS_REMOVED);
    private static final Set<String> ADMIN_ROLES = Set.of("Admin");
    private static final Set<String> MANAGER_ROLES = Set.of("Admin", "Manager");
    private static final DateTimeFormatter SLOT_DATE_FORMATTER = DateTimeFormatter
            .ofPattern("MMM d", Locale.US)
            .withZone(ZoneOffset.UTC);

    private final ActivityMembersRepository activityMembersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    private final UsersRepository usersRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final AssetsService assetsService;
    private final ActivitiesResourcesService activitiesResourcesService;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final EventCheckoutBasketService eventCheckoutBasketService;
    private final PaymentService paymentService;
    private final EventInviteNotificationService eventInviteNotificationService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;
    private final ChatService chatService;
    private final EventSlotReadModelService eventSlotReadModelService;
    private final AccessControlService accessControlService;
    private final UserActivityCountersService userActivityCountersService;
    private final ActivityTournamentGroupCounterService tournamentGroupCounterService;
    private final ActivityMemberMapper activityMemberMapper;
    private final ConcurrentMap<String, Object> eventJoinLocks = new ConcurrentHashMap<>();

    public ActivitiesMembersService(
            ActivityMembersRepository activityMembersRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivitySubEventResourcesRepository activitySubEventResourcesRepository,
            UsersRepository usersRepository,
            HomeUserProfileService homeUserProfileService,
            AssetsService assetsService,
            ActivitiesResourcesService activitiesResourcesService,
            EventParticipationTicketService eventParticipationTicketService,
            EventCheckoutBasketService eventCheckoutBasketService,
            PaymentService paymentService,
            EventInviteNotificationService eventInviteNotificationService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService,
            ChatService chatService,
            EventSlotReadModelService eventSlotReadModelService,
            AccessControlService accessControlService,
            UserActivityCountersService userActivityCountersService,
            ActivityTournamentGroupCounterService tournamentGroupCounterService,
            ActivityMemberMapper activityMemberMapper) {
        this.activityMembersRepository = activityMembersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.assetsService = assetsService;
        this.activitiesResourcesService = activitiesResourcesService;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.eventCheckoutBasketService = eventCheckoutBasketService;
        this.paymentService = paymentService;
        this.eventInviteNotificationService = eventInviteNotificationService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.chatService = chatService;
        this.eventSlotReadModelService = eventSlotReadModelService;
        this.accessControlService = accessControlService;
        this.userActivityCountersService = userActivityCountersService;
        this.tournamentGroupCounterService = tournamentGroupCounterService;
        this.activityMemberMapper = activityMemberMapper;
    }

    public List<ActivityMemberEntryDto> queryMembers(String ownerType, String ownerId) {
        return queryMembers(ownerType, ownerId, false);
    }

    public List<ActivityMemberEntryDto> queryMembers(String ownerType, String ownerId, Boolean pendingOnly) {
        return queryMembers(ownerType, ownerId, pendingOnly, null, null);
    }

    public List<ActivityMemberEntryDto> queryMembers(
            String ownerType,
            String ownerId,
            Boolean pendingOnly,
            String eventId,
            String subEventId) {
        return queryMembers(ownerType, ownerId, pendingOnly, eventId, subEventId, null);
    }

    public List<ActivityMemberEntryDto> queryMembers(
            String ownerType,
            String ownerId,
            Boolean pendingOnly,
            String eventId,
            String subEventId,
            String assetRequestId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)
                && !canViewEventOwnerMembers(normalizedOwnerId, eventId, subEventId)) {
            return List.of();
        }

        String viewerUserId = homeUserProfileService.resolveSelectedUserId(null);
        boolean scopedAssetMembers = OWNER_TYPE_ASSET.equals(normalizedOwnerType)
                && StringUtils.hasText(normalizeId(eventId))
                && StringUtils.hasText(normalizeId(subEventId));
        if (StringUtils.hasText(assetRequestId) && !scopedAssetMembers) {
            return List.of();
        }
        List<ActivityMember> ownerMembers;
        if (scopedAssetMembers) {
            ownerMembers = loadScopedAssetDocuments(normalizedOwnerId, eventId, subEventId, pendingOnly, assetRequestId);
        } else if (Boolean.TRUE.equals(pendingOnly)) {
            ownerMembers = activityMembersRepository
                    .findByOwnerTypeAndOwnerIdAndStatusOrderByActionAtIsoDescUserIdAsc(
                            normalizedOwnerType,
                            normalizedOwnerId,
                            STATUS_PENDING);
        } else {
            ownerMembers = activityMembersRepository.findManagementOrderedByOwner(
                    normalizedOwnerType,
                    normalizedOwnerId);
        }
        ownerMembers = ownerMembers.stream()
                .filter(Objects::nonNull)
                .filter(member -> !isHiddenMembershipStatus(member.getStatus()))
                .toList();
        Map<String, List<ActivityMemberInvolvementDto>> involvementsByUserId = memberInvolvementsByUserId(
                normalizedOwnerType,
                normalizedOwnerId,
                ownerMembers);
        Map<String, Users> usersById = memberUsersById(ownerMembers);
        return ownerMembers.stream()
                .map(member -> toEntryDto(member, viewerUserId, usersById))
                .filter(Objects::nonNull)
                .map(entry -> withInvolvements(entry, involvementsByUserId.getOrDefault(normalizeId(entry.userId()), List.of())))
                .toList();
    }

    private boolean canViewEventOwnerMembers(String ownerId, String parentEventId, String subEventId) {
        if (accessControlService.canCurrentActorViewEventMembers(ownerId)) {
            return true;
        }
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedParentEventId = normalizeId(parentEventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedParentEventId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !normalizedOwnerId.startsWith(
                        RANDOM_ROOM_EVENT_TYPE
                                + ":"
                                + normalizedParentEventId
                                + ":"
                                + normalizedSubEventId
                                + ":")) {
            return false;
        }
        ActivityEvent room = findPreferredEventRecord(normalizedOwnerId);
        return room != null
                && (RANDOM_ROOM_EVENT_TYPE.equals(normalizeId(room.getEventType()))
                        || TOURNAMENT_ROOM_EVENT_TYPE.equals(normalizeId(room.getEventType())))
                && accessControlService.canCurrentActorViewEventMembers(normalizedParentEventId);
    }

    public ActivityMembersSyncResponseDto syncMembers(ActivityMembersSyncRequestDto request) {
        if (request == null || request.owner() == null) {
            return new ActivityMembersSyncResponseDto(List.of(), List.of(), 0);
        }
        String ownerType = normalizeOwnerType(request.owner().ownerType());
        String ownerId = normalizeId(request.owner().ownerId());
        if (!StringUtils.hasText(ownerType) || !StringUtils.hasText(ownerId)) {
            return new ActivityMembersSyncResponseDto(List.of(), List.of(), 0);
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)
                && !accessControlService.canCurrentActorViewEventMembers(ownerId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Authenticated user is not allowed to synchronize members for this event.");
        }
        List<ActivityMemberEntryDto> current = queryMembers(
                ownerType,
                ownerId,
                false,
                request.eventId(),
                request.subEventId(),
                request.assetRequestId());
        Map<String, String> knownRevisionsById = new LinkedHashMap<>();
        for (ActivityMemberSyncKnownItemDto item : request.knownItems() == null
                ? List.<ActivityMemberSyncKnownItemDto>of()
                : request.knownItems()) {
            String id = normalizeId(item == null ? null : item.id());
            if (StringUtils.hasText(id)) {
                knownRevisionsById.put(id, safeText(item.revision()));
            }
        }

        List<ActivityMemberEntryDto> upserts = new ArrayList<>();
        Set<String> remainingKnownIds = new LinkedHashSet<>(knownRevisionsById.keySet());
        for (ActivityMemberEntryDto entry : current) {
            String id = normalizeId(entry == null ? null : entry.id());
            if (!StringUtils.hasText(id)) {
                continue;
            }
            remainingKnownIds.remove(id);
            String knownRevision = knownRevisionsById.get(id);
            if (knownRevision == null || !Objects.equals(knownRevision, safeText(entry.revision()))) {
                upserts.add(entry);
            }
        }
        return new ActivityMembersSyncResponseDto(
                List.copyOf(upserts),
                List.copyOf(remainingKnownIds),
                current.size());
    }

    private List<ActivityMember> loadScopedAssetDocuments(
            String assetId,
            String eventId,
            String subEventId,
            Boolean pendingOnly) {
        return loadScopedAssetDocuments(assetId, eventId, subEventId, pendingOnly, null);
    }

    private List<ActivityMember> loadScopedAssetDocuments(
            String assetId,
            String eventId,
            String subEventId,
            Boolean pendingOnly,
            String assetRequestId) {
        Asset asset = assetsService.findAssetByAssetIdWithScopedRequests(
                assetId,
                eventId,
                subEventId,
                Boolean.TRUE.equals(pendingOnly) ? STATUS_PENDING : null,
                assetRequestId).orElse(null);
        if (asset == null) {
            return List.of();
        }

        Map<String, ActivityMember> storedAssetMembersByUserId =
                activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_ASSET, assetId).stream()
                    .filter(Objects::nonNull)
                    .filter(member -> StringUtils.hasText(normalizeId(member.getUserId())))
                    .collect(Collectors.toMap(
                            member -> normalizeId(member.getUserId()),
                            member -> member,
                            (left, right) -> toSortableDate(right.getUpdatedDate()) >= toSortableDate(left.getUpdatedDate())
                                    ? right
                                    : left,
                            LinkedHashMap::new));
        List<ActivityMember> members = new ArrayList<>();
        String scopedManagerUserId = resolveScopedAssetManagerUserId(assetId, eventId, subEventId);
        String assetOwnerUserId = normalizeId(asset.getOwnerUserId());
        if (!StringUtils.hasText(assetRequestId)
                && !Boolean.TRUE.equals(pendingOnly)
                && StringUtils.hasText(scopedManagerUserId)
                && scopedManagerUserId.equals(assetOwnerUserId)) {
            ActivityMember owner = scopedAssetOwnerMember(
                    asset,
                    eventId,
                    subEventId,
                    storedAssetMembersByUserId.get(assetOwnerUserId));
            if (owner != null) {
                members.add(owner);
            }
        }
        for (Asset.AssetRequestRecord request : asset.getRequests() == null ? List.<Asset.AssetRequestRecord>of() : asset.getRequests()) {
            String requestUserId = normalizeId(request == null ? null : request.userId());
            ActivityMember member = scopedAssetRequestMember(
                    asset,
                    request,
                    storedAssetMembersByUserId.get(requestUserId),
                    scopedManagerUserId);
            String memberUserId = normalizeId(member == null ? null : member.getUserId());
            if (StringUtils.hasText(memberUserId) && !memberUserId.equals(normalizeId(asset.getOwnerUserId()))) {
                members.add(member);
            }
        }
        return members.stream()
                .sorted(this::compareMembersForManagement)
                .toList();
    }

    private String resolveScopedAssetManagerUserId(String assetId, String eventId, String subEventId) {
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedAssetId)) {
            return null;
        }
        for (ActivitySubEventResource resource : activitySubEventResourcesRepository
                .findByOwnerIdAndSubEventIdAndStatusNot(
                        normalizeId(eventId),
                        normalizeId(subEventId),
                        RESOURCE_STATUS_DELETED)) {
            if (resource == null) {
                continue;
            }
            Map<String, Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>> settingsByType =
                    resource.getAssetSettingsByType();
            if (settingsByType != null) {
                for (Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord> settingsByAssetId : settingsByType.values()) {
                    ActivitySubEventResource.SubEventAssignedAssetSettingsRecord settings = settingsByAssetId == null
                            ? null
                            : settingsByAssetId.get(normalizedAssetId);
                    String managerUserId = normalizeId(settings == null ? null : settings.addedByUserId());
                    if (StringUtils.hasText(managerUserId)) {
                        return managerUserId;
                    }
                }
            }
            boolean assigned = resource.getAssetAssignmentIds() != null
                    && resource.getAssetAssignmentIds().values().stream()
                            .filter(Objects::nonNull)
                            .flatMap(Collection::stream)
                            .map(this::normalizeId)
                            .anyMatch(normalizedAssetId::equals);
            if (assigned) {
                String fallbackManagerUserId = normalizeId(resource.getAssetOwnerUserId());
                if (StringUtils.hasText(fallbackManagerUserId)) {
                    return fallbackManagerUserId;
                }
            }
        }
        return null;
    }

    private ActivityMember scopedAssetOwnerMember(
            Asset asset,
            String eventId,
            String subEventId,
            ActivityMember storedAssetMember) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String ownerUserId = normalizeId(asset == null ? null : asset.getOwnerUserId());
        if (!StringUtils.hasText(assetId)
                || !StringUtils.hasText(ownerUserId)
                || StringUtils.hasText(safeText(asset.getOwnerReleasedAtIso()))) {
            return null;
        }
        ActivityMember member = new ActivityMember();
        member.setSyncKey("asset-scope-owner:" + assetId + ":" + normalizeId(eventId) + ":" + normalizeId(subEventId));
        member.setOwnerType(OWNER_TYPE_ASSET);
        member.setOwnerId(assetId);
        member.setUserId(ownerUserId);
        member.setRole("Manager");
        member.setStatus(STATUS_ACCEPTED);
        member.setOrganizerOnly(storedAssetMember == null ? false : storedAssetMember.getOrganizerOnly());
        member.setActionAtIso(normalizeDateTime(asset.getUpdatedDate(), normalizeDateTime(asset.getCreatedDate(), Instant.now().toString())));
        member.setMetAtIso(member.getActionAtIso());
        member.setMetWhere(firstNonBlank(asset.getCity(), asset.getTitle()));
        return member;
    }

    private ActivityMember scopedAssetRequestMember(
            Asset asset,
            Asset.AssetRequestRecord request,
            ActivityMember storedAssetMember,
            String scopedManagerUserId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String userId = normalizeId(request == null ? null : request.userId());
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(userId)) {
            return null;
        }
        String status = normalizeStatus(request.status());
        ActivityMember member = new ActivityMember();
        member.setSyncKey(firstNonBlank(request.id(), "asset-scope-request:" + assetId + ":" + userId));
        member.setOwnerType(OWNER_TYPE_ASSET);
        member.setOwnerId(assetId);
        member.setUserId(userId);
        boolean acceptedStoredManager = STATUS_ACCEPTED.equals(status)
                && storedAssetMember != null
                && STATUS_ACCEPTED.equals(normalizeStatus(storedAssetMember.getStatus()))
                && MANAGER_ROLES.contains(resolveStoredRole(storedAssetMember, OWNER_TYPE_ASSET, assetId));
        boolean acceptedScopedManager = userId.equals(normalizeId(scopedManagerUserId));
        member.setRole(acceptedStoredManager || acceptedScopedManager ? "Manager" : "Member");
        member.setStatus(status);
        member.setOrganizerOnly(storedAssetMember == null ? false : storedAssetMember.getOrganizerOnly());
        if (STATUS_PENDING.equals(status)) {
            boolean borrowerInitiated = "borrow".equalsIgnoreCase(safeText(request.requestKind()));
            member.setPendingSource(borrowerInitiated ? "member" : "admin");
            member.setRequestKind(borrowerInitiated ? REQUEST_KIND_JOIN : REQUEST_KIND_INVITE);
        }
        String requestedAtIso = normalizeDateTime(request.requestedAtIso(), Instant.now().toString());
        String actionAtIso = acceptedStoredManager
                ? normalizeDateTime(storedAssetMember.getActionAtIso(), requestedAtIso)
                : requestedAtIso;
        member.setActionAtIso(actionAtIso);
        member.setMetAtIso(actionAtIso);
        member.setMetWhere(safeText(asset.getTitle()));
        if (acceptedStoredManager) {
            member.setUpdatedDate(normalizeDateTime(storedAssetMember.getUpdatedDate(), actionAtIso));
            member.setUpdatedUser(normalizeId(storedAssetMember.getUpdatedUser()));
            member.setCreatedUser(normalizeId(storedAssetMember.getCreatedUser()));
            member.setManagerGrantedByUserId(normalizeId(storedAssetMember.getManagerGrantedByUserId()));
        }
        return member;
    }

    public List<ActivityMembersSummaryDto> querySummaries(ActivityMembersSummariesRequestDto request) {
        if (request == null || request.owners() == null || request.owners().isEmpty()) {
            return List.of();
        }

        List<ActivityMembersSummaryDto> summaries = new ArrayList<>();
        for (ActivityMemberOwnerRefDto owner : request.owners()) {
            String ownerType = normalizeOwnerType(owner == null ? null : owner.ownerType());
            String ownerId = normalizeId(owner == null ? null : owner.ownerId());
            if (OWNER_TYPE_EVENT.equals(ownerType)
                    && !accessControlService.canCurrentActorViewEventMembers(ownerId)) {
                continue;
            }
            ActivityMembersSummaryDto summary = querySummary(owner == null ? null : owner.ownerType(), owner == null ? null : owner.ownerId());
            if (summary != null) {
                summaries.add(summary);
            }
        }
        return summaries;
    }

    public ActivityMembersSummaryDto querySummary(String ownerType, String ownerId) {
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(ownerType, ownerId);
        return snapshot == null ? null : snapshot.toSummaryDto();
    }

    public OwnerMembersSnapshot queryOwnerSnapshot(String ownerType, String ownerId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return null;
        }
        return toOwnerSnapshot(
                normalizedOwnerType,
                normalizedOwnerId,
                loadOwnerDocuments(normalizedOwnerType, normalizedOwnerId));
    }

    public boolean hasAcceptedAdminRole(String ownerType, String ownerId, String userId) {
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(ownerType, ownerId);
        return snapshot != null && snapshot.hasAcceptedAdminRole(userId);
    }

    public boolean hasParticipation(String ownerType, String ownerId, String userId) {
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(ownerType, ownerId);
        return snapshot != null && snapshot.hasParticipation(userId);
    }

    public boolean hasPendingInvitation(String eventId, String userId) {
        ActivityMember member = findEventMember(eventId, userId);
        return member != null
                && STATUS_PENDING.equals(normalizeStatus(member.getStatus()))
                && isInvitationMembership(member);
    }

    /**
     * Reads the stored membership state without applying the normal Members-view
     * visibility filter. Tournament standings use this for terminal group-room
     * states, so the standings never infer a removal from an event projection.
     */
    public Map<String, String> queryStoredMemberStatuses(String ownerType, String ownerId) {
        Map<String, String> statusesByUserId = new LinkedHashMap<>();
        queryStoredMemberStates(ownerType, ownerId)
                .forEach((userId, state) -> statusesByUserId.put(userId, state.status()));
        return Map.copyOf(statusesByUserId);
    }

    /**
     * Reads terminal membership state and display data directly from the stored
     * owner membership documents. This intentionally bypasses the normal
     * Members-view visibility filter so retained tournament score rows can keep
     * both their terminal marker and the participant's name.
     */
    public Map<String, StoredMemberState> queryStoredMemberStates(String ownerType, String ownerId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return Map.of();
        }
        List<ActivityMember> storedMembers = activityMembersRepository
                .findByOwnerTypeAndOwnerId(normalizedOwnerType, normalizedOwnerId);
        LinkedHashSet<String> userIds = storedMembers.stream()
                .filter(Objects::nonNull)
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Map<String, String> namesByUserId = new LinkedHashMap<>();
        if (!userIds.isEmpty()) {
            for (Users user : usersRepository.findByUserIdIn(userIds)) {
                String userId = normalizeId(user == null ? null : user.getUserId());
                if (StringUtils.hasText(userId)) {
                    namesByUserId.putIfAbsent(userId, safeText(user.getName()));
                }
            }
        }
        Map<String, StoredMemberState> statesByUserId = new LinkedHashMap<>();
        for (ActivityMember member : storedMembers) {
            String userId = normalizeId(member == null ? null : member.getUserId());
            if (StringUtils.hasText(userId)) {
                statesByUserId.put(userId, new StoredMemberState(
                        normalizeStatus(member.getStatus()),
                        firstNonBlank(namesByUserId.get(userId), userId)));
            }
        }
        return Map.copyOf(statesByUserId);
    }

    public boolean pendingInvitationRequiresAdminApproval(String eventId, String userId) {
        ActivityMember invitation = findEventMember(eventId, userId);
        if (invitation == null
                || !STATUS_PENDING.equals(normalizeStatus(invitation.getStatus()))
                || !isInvitationMembership(invitation)) {
            return false;
        }
        String inviterUserId = normalizeId(invitation.getInvitedByUserId());
        return StringUtils.hasText(inviterUserId) && !isEventAdminUser(eventId, inviterUserId);
    }

    public void refreshEventParticipationProjection(String eventId) {
        refreshEmbeddedEventMembers(eventId);
    }

    public OwnerMembersSnapshot ensureEventCreatorAdminMembership(String eventId, String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return null;
        }
        synchronized (eventJoinLock(normalizedEventId)) {
            ActivityEvent eventRecord = findPreferredEventRecord(normalizedEventId);
            String creatorUserId = normalizeId(eventRecord == null ? null : eventRecord.getCreatorUserId());
            if (!StringUtils.hasText(creatorUserId)) {
                return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
            }

            List<ActivityMember> existing = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId);
            ActivityMember current = existing.stream()
                    .filter(member -> creatorUserId.equals(normalizeId(member == null ? null : member.getUserId())))
                    .findFirst()
                    .orElse(null);
            if (isCanonicalEventCreatorAdminMembership(current)) {
                return toOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId, existing);
            }

            Map<String, ActivityMember> existingByUserId = new LinkedHashMap<>();
            for (ActivityMember member : existing) {
                String memberUserId = normalizeId(member == null ? null : member.getUserId());
                if (StringUtils.hasText(memberUserId)) {
                    existingByUserId.put(memberUserId, member);
                }
            }
            String normalizedActorUserId = firstNonBlank(resolveActorUserId(actorUserId), creatorUserId);
            String nowIso = Instant.now().toString();
            ActivityMember creatorMembership = ensureOwnerAdminMembership(
                            OWNER_TYPE_EVENT,
                            normalizedEventId,
                            normalizedEventId,
                            current == null ? List.of() : List.of(current),
                            existingByUserId,
                            normalizedActorUserId,
                            nowIso)
                    .stream()
                    .filter(member -> creatorUserId.equals(normalizeId(member == null ? null : member.getUserId())))
                    .findFirst()
                    .orElse(null);
            if (creatorMembership == null) {
                return toOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId, existing);
            }

            activityMembersRepository.saveAll(List.of(creatorMembership));
            enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, normalizedEventId, normalizedActorUserId);
            adminTelemetryService.record(
                    "event.members.changed",
                    OWNER_TYPE_EVENT,
                    normalizedEventId,
                    normalizedActorUserId,
                    1L);
            finalizeAcceptedEventReservations(normalizedEventId, List.of(creatorMembership));
            eventParticipationTicketService.syncParticipationTicketsForEvent(normalizedEventId);
            refreshEmbeddedEventMembers(normalizedEventId);
            userActivityCountersService.refreshEventCountersForSourceIds(List.of(normalizedEventId));
            OwnerMembersSnapshot snapshot = queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
            return snapshot == null ? null : snapshot.withMutationApplied(true);
        }
    }

    public Set<String> findTrackedEventSourceIdsForUser(String userId) {
        return new LinkedHashSet<>(findTrackedEventMembershipStatusesForUser(userId).keySet());
    }

    public Map<String, String> findTrackedEventMembershipStatusesForUser(String userId) {
        return findTrackedEventMembershipStatusesForUser(userId, false);
    }

    public Map<String, String> findTrackedEventMembershipStatusesForUser(String userId, boolean includeDeleted) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return Map.of();
        }
        Map<String, String> statusesByOwnerId = new LinkedHashMap<>();
        List<ActivityMember> memberships = activityMembersRepository.findMembershipStatusesByOwnerTypeAndUserId(
                OWNER_TYPE_EVENT,
                normalizedUserId);
        for (ActivityMember member : memberships == null ? List.<ActivityMember>of() : memberships) {
            ActivityMemberStatusDto membership = activityMemberMapper.toStatusDto(member);
            if (membership == null) {
                continue;
            }
            String status = normalizeStatus(membership.status());
            if (!STATUS_ACCEPTED.equals(status)
                    && !STATUS_PENDING.equals(status)
                    && !STATUS_INVITED.equals(status)
                    && !(includeDeleted && STATUS_DELETED.equals(status))) {
                continue;
            }
            String ownerId = normalizeId(membership.ownerId());
            if (StringUtils.hasText(ownerId)) {
                statusesByOwnerId.put(ownerId, status);
            }
        }
        return statusesByOwnerId;
    }

    public Set<String> findInvitationEventSourceIdsForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return Set.of();
        }
        Set<String> sourceIds = new LinkedHashSet<>();
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, normalizedUserId)) {
            String ownerId = normalizeId(member == null ? null : member.getOwnerId());
            if (!StringUtils.hasText(ownerId)) {
                continue;
            }
            String status = normalizeStatus(member.getStatus());
            if (STATUS_INVITED.equals(status) || (STATUS_PENDING.equals(status) && isInvitationMembership(member))) {
                sourceIds.add(ownerId);
            }
        }
        return sourceIds;
    }

    /**
     * Builds member snapshots for all given events in bulk using only 2 DB queries total
     * (one for members, one for resources) instead of N queries per event.
     */
    public Map<String, OwnerMembersSnapshot> buildBatchEventSnapshots(
            Map<String, ActivityEvent> preferredEventBySourceId) {
        if (preferredEventBySourceId == null || preferredEventBySourceId.isEmpty()) {
            return Map.of();
        }

        Set<String> allSourceIds = new LinkedHashSet<>();
        for (Map.Entry<String, ActivityEvent> entry : preferredEventBySourceId.entrySet()) {
            if (StringUtils.hasText(entry.getKey())) {
                allSourceIds.add(entry.getKey());
            }
        }
        if (allSourceIds.isEmpty()) {
            return Map.of();
        }

        // Bulk load all event members (one query)
        Map<String, List<ActivityMember>> membersByOwnerId = new LinkedHashMap<>();
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, allSourceIds)) {
            if (member == null) continue;
            String ownerId = normalizeId(member.getOwnerId());
            if (StringUtils.hasText(ownerId)) {
                membersByOwnerId.computeIfAbsent(ownerId, k -> new ArrayList<>()).add(member);
            }
        }

        // Bulk load all sub-event resources (one query)
        Map<String, List<ActivitySubEventResource>> resourcesByOwnerId = new LinkedHashMap<>();
        for (ActivitySubEventResource resource : activitySubEventResourcesRepository.findByOwnerIdInAndStatusNot(allSourceIds, RESOURCE_STATUS_DELETED)) {
            if (resource == null) continue;
            String ownerId = normalizeId(resource.getOwnerId());
            if (StringUtils.hasText(ownerId)) {
                resourcesByOwnerId.computeIfAbsent(ownerId, k -> new ArrayList<>()).add(resource);
            }
        }

        // Build all snapshots from pre-loaded data
        Map<String, OwnerMembersSnapshot> result = new LinkedHashMap<>();
        for (String sourceId : allSourceIds) {
            ActivityEvent eventRecord = preferredEventBySourceId.get(sourceId);
            List<ActivityMember> rawMembers = membersByOwnerId.getOrDefault(sourceId, List.of())
                    .stream().filter(Objects::nonNull).toList();

            List<ActivitySubEventResource> resources = resourcesByOwnerId.getOrDefault(sourceId, List.of());
            result.put(sourceId, toOwnerSnapshotBatch(OWNER_TYPE_EVENT, sourceId, rawMembers, eventRecord, resources));
        }
        return result;
    }

    public Map<String, OwnerMembersSnapshot> buildBatchOwnerSnapshots(String ownerType, Collection<String> ownerIds) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        if (!StringUtils.hasText(normalizedOwnerType) || ownerIds == null || ownerIds.isEmpty()) {
            return Map.of();
        }
        Set<String> normalizedOwnerIds = ownerIds.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (normalizedOwnerIds.isEmpty()) {
            return Map.of();
        }

        Map<String, List<ActivityMember>> membersByOwnerId = new LinkedHashMap<>();
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(normalizedOwnerType, normalizedOwnerIds)) {
            if (member == null) {
                continue;
            }
            String ownerId = normalizeId(member.getOwnerId());
            if (StringUtils.hasText(ownerId)) {
                membersByOwnerId.computeIfAbsent(ownerId, key -> new ArrayList<>()).add(member);
            }
        }

        Map<String, OwnerMembersSnapshot> result = new LinkedHashMap<>();
        for (String ownerId : normalizedOwnerIds) {
            List<ActivityMember> members = membersByOwnerId.getOrDefault(ownerId, List.of())
                    .stream()
                    .filter(Objects::nonNull)
                    .toList();
            result.put(ownerId, toOwnerSnapshot(normalizedOwnerType, ownerId, members));
        }
        return result;
    }

    private Map<String, String> resolveEventManagerActionAtFromResources(List<ActivitySubEventResource> resources) {
        LinkedHashMap<String, String> managerActionAtByUserId = new LinkedHashMap<>();
        for (ActivitySubEventResource resource : resources == null ? List.<ActivitySubEventResource>of() : resources) {
            if (resource == null || !hasManagedEventAssets(resource)) {
                continue;
            }
            String actionAtIso = deriveManagedEventActionAt(resource);
            for (String managerUserId : resolveManagedUserIds(resource)) {
                String currentActionAtIso = managerActionAtByUserId.get(managerUserId);
                if (toSortableDate(actionAtIso) >= toSortableDate(currentActionAtIso)) {
                    managerActionAtByUserId.put(managerUserId, actionAtIso);
                }
            }
        }
        return managerActionAtByUserId;
    }

    private OwnerMembersSnapshot toOwnerSnapshotBatch(
            String ownerType,
            String ownerId,
            List<ActivityMember> members,
            ActivityEvent eventRecord,
            List<ActivitySubEventResource> resources) {
        List<ActivityMember> ordered = members.stream()
                .filter(Objects::nonNull)
                .filter(member -> !isHiddenMembershipStatus(member.getStatus()))
                .sorted(this::compareMembersForManagement)
                .toList();
        List<String> acceptedUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .filter(member -> !Boolean.TRUE.equals(member.getOrganizerOnly()))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        List<String> capacityOccupyingAcceptedUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .filter(member -> !Boolean.TRUE.equals(member.getOrganizerOnly()))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        List<String> pendingUserIds = ordered.stream()
                .filter(member -> "pending".equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        List<String> invitedUserIds = memberUserIds(ordered, member -> {
            String status = normalizeStatus(member.getStatus());
            return STATUS_INVITED.equals(status) || (STATUS_PENDING.equals(status) && isInvitationMembership(member));
        });
        List<String> pendingRequestUserIds = memberUserIds(ordered, member ->
                STATUS_PENDING.equals(normalizeStatus(member.getStatus())) && !isInvitationMembership(member));
        Set<String> eventAdminUserIds = resolveEventAdminUserIds(eventRecord);
        Map<String, String> managersByUserId = resolveEventManagerActionAtFromResources(resources);
        Set<String> adminUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .filter(member -> {
                    String role = safeText(member.getRole());
                    if ("Admin".equals(role) || "Manager".equals(role) || "Member".equals(role)) {
                        return ADMIN_ROLES.contains(role);
                    }
                    String userId = normalizeId(member.getUserId());
                    if (eventAdminUserIds.contains(userId)) return true;
                    return managersByUserId.containsKey(userId) && ADMIN_ROLES.contains("Manager");
                })
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Integer capacityTotal = eventRecord == null ? null : eventRecord.getCapacityTotal();
        return new OwnerMembersSnapshot(
                ownerType,
                ownerId,
                ordered,
                acceptedUserIds,
                capacityOccupyingAcceptedUserIds,
                pendingUserIds,
                invitedUserIds,
                pendingRequestUserIds,
                adminUserIds,
                capacityTotal,
                false);
    }

    public void replace(ActivityMembersReplaceRequestDto request) {
        if (request == null || request.owner() == null) {
            return;
        }

        String ownerType = normalizeOwnerType(request.owner().ownerType());
        String ownerId = normalizeId(request.owner().ownerId());
        if (!StringUtils.hasText(ownerType) || !StringUtils.hasText(ownerId)) {
            return;
        }

        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            synchronized (eventJoinLock(ownerId)) {
                replaceResolved(request, ownerType, ownerId);
            }
        } else {
            replaceResolved(request, ownerType, ownerId);
        }
    }

    private void replaceResolved(
            ActivityMembersReplaceRequestDto request,
            String ownerType,
            String ownerId) {
        String actorUserId = resolveActorUserId(request.actorUserId());
        String scopedEventId = normalizeId(request.eventId());
        String scopedSubEventId = normalizeId(request.subEventId());
        if (OWNER_TYPE_ASSET.equals(ownerType)
                && StringUtils.hasText(scopedEventId)
                && StringUtils.hasText(scopedSubEventId)) {
            if (!assetsService.canManageScopedAssetMembers(
                    ownerId,
                    scopedEventId,
                    scopedSubEventId,
                    actorUserId)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Authenticated user is not allowed to replace members for this asset booking.");
            }
            assetsService.syncScopedRequestsFromMemberEntries(
                    ownerId,
                    scopedEventId,
                    scopedSubEventId,
                    safeMembers(request.members()),
                    actorUserId);
            return;
        }
        String nowIso = Instant.now().toString();
        List<ActivityMember> existing = loadOwnerDocuments(ownerType, ownerId);
        List<ActivityMember> existingVisibleMembers = existing;
        Map<String, ActivityMember> existingBySyncKey = new LinkedHashMap<>();
        Map<String, ActivityMember> existingByUserId = new LinkedHashMap<>();
        for (ActivityMember member : existing) {
            if (member == null) {
                continue;
            }
            if (StringUtils.hasText(member.getSyncKey())) {
                existingBySyncKey.put(member.getSyncKey().trim(), member);
            }
            String memberUserId = normalizeId(member.getUserId());
            if (StringUtils.hasText(memberUserId)) {
                existingByUserId.put(memberUserId, member);
            }
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)
                && !accessControlService.canManageEventMembers(ownerId, actorUserId)
                && !isAcceptedMemberInvitationOnlyReplacement(
                    ownerId,
                    actorUserId,
                    request.members(),
                    existingByUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Authenticated user may only add invitations for this event.");
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            validateEventMemberReplacement(ownerId, actorUserId, request.members(), existingByUserId);
        } else {
            validateManagedOwnerMemberReplacement(
                    ownerType,
                    ownerId,
                    actorUserId,
                    scopedEventId,
                    request.members(),
                    existingByUserId);
        }

        ActivityEvent invitationEvent = OWNER_TYPE_EVENT.equals(ownerType) ? findPreferredEventRecord(ownerId) : null;
        boolean organizerInvitation = invitationEvent != null
                && canManageOwnerMembers(ownerType, ownerId, actorUserId);
        List<ActivityMember> nextDocuments = new ArrayList<>();
        for (ActivityMemberEntryDto entry : safeMembers(request.members())) {
            String memberUserId = normalizeId(entry.userId());
            if (!StringUtils.hasText(memberUserId)) {
                continue;
            }

            ActivityMember current = StringUtils.hasText(normalizeId(entry.id()))
                    ? existingBySyncKey.get(normalizeId(entry.id()))
                    : null;
            if (current == null) {
                current = existingByUserId.get(memberUserId);
            }

            ActivityMember next = current == null ? new ActivityMember() : cloneMember(current);
            next.setId(current == null ? new ObjectId().toHexString() : current.getId());
            next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey())
                    ? current.getSyncKey().trim()
                    : UUID.randomUUID().toString());
            next.setOwnerType(ownerType);
            next.setOwnerId(ownerId);
            next.setUserId(memberUserId);
            next.setRole(normalizeRole(entry.role(), memberUserId, ownerType, ownerId));
            next.setStatus(normalizeStatus(entry.status()));
            next.setPendingSource(resolvePendingSource(entry.pendingSource(), next.getStatus()));
            next.setRequestKind(resolveRequestKind(entry.requestKind(), next.getStatus(), next.getPendingSource()));
            next.setInvitedByUserId(resolveInvitedByUserId(entry, current, actorUserId));
            if (OWNER_TYPE_EVENT.equals(ownerType) && REQUEST_KIND_INVITE.equals(next.getRequestKind())
                    && (current == null || !isInvitationMembership(current))) {
                EventVipInvitation.issue(next, organizerInvitation,
                        invitationEvent == null ? null : invitationEvent.getPricing(), nowIso);
            }
            next.setOrganizerOnly(Boolean.TRUE.equals(entry.organizerOnly()));
            String actionAtIso = normalizeDateTime(entry.actionAtIso(), nowIso);
            next.setActionAtIso(actionAtIso);
            next.setMetAtIso(normalizeDateTime(entry.metAtIso(), actionAtIso));
            next.setMetWhere(safeText(entry.metWhere()));
            next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
            next.setCreatedUser(current == null ? resolveCreatedUser(next, actorUserId) : safeText(current.getCreatedUser()));
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, current));
            nextDocuments.add(next);
        }

        nextDocuments = ensureOwnerAdminMembership(
                ownerType,
                ownerId,
                scopedEventId,
                nextDocuments,
                existingByUserId,
                actorUserId,
                nowIso);
        if (OWNER_TYPE_EVENT.equals(ownerType)
                && exceedsEventCapacity(
                        findPreferredEventRecord(ownerId),
                        nextDocuments)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Accepted members and active invitations exceed event capacity.");
        }
        List<ActivityMember> joinedEventMembers = OWNER_TYPE_EVENT.equals(ownerType)
                ? joinedAcceptedEventMembers(ownerType, ownerId, nextDocuments, existingByUserId)
                : List.of();
        Set<String> retainedUserIds = nextDocuments.stream()
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        List<ActivityMember> removedVisibleMembers = existingVisibleMembers.stream()
                .filter(Objects::nonNull)
                .filter(member -> !retainedUserIds.contains(normalizeId(member.getUserId())))
                .filter(member -> !isHiddenMembershipStatus(member.getStatus()))
                .toList();
        List<ActivityMember> removedMembers = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> !retainedUserIds.contains(normalizeId(member.getUserId())))
                .filter(member -> !isHiddenMembershipStatus(member.getStatus()))
                .map(member -> toRemovedMember(member, actorUserId, nowIso))
                .toList();
        List<ActivityMember> membersToSave = new ArrayList<>(nextDocuments);
        membersToSave.addAll(removedMembers);
        if (!membersToSave.isEmpty()) {
            activityMembersRepository.saveAll(membersToSave);
            enqueueOwnerMembersChanged(ownerType, ownerId, actorUserId);
            adminTelemetryService.record("event.members.changed", ownerType, ownerId, actorUserId, membersToSave.size());
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            cascadeRemovedEventMembersFromAssignedAssets(ownerId, removedVisibleMembers, actorUserId, nowIso);
            Set<String> removedManagedAssetIds = activitiesResourcesService
                    .removeManagedResourcesForRemovedEventMembers(ownerId, removedVisibleMembers, actorUserId, nowIso);
            clearRemovedManagedAssetMembers(removedManagedAssetIds, actorUserId, nowIso);
            processEventWaitlist(ownerId, findPreferredEventRecord(ownerId), true);
            finalizeAcceptedEventReservations(ownerId, joinedEventMembers);
            eventParticipationTicketService.syncParticipationTicketsForEvent(ownerId);
            refreshEmbeddedEventMembers(ownerId);
            notifyRemovedEventMembers(ownerId, removedVisibleMembers, actorUserId, nowIso);
            postEventMembershipChangeMessages(ownerId, joinedEventMembers, removedVisibleMembers, actorUserId);
            userActivityCountersService.refreshEventCountersForSourceIds(List.of(ownerId));
        }
        if (OWNER_TYPE_SUB_EVENT.equals(ownerType)
                && StringUtils.hasText(scopedEventId)
                && StringUtils.hasText(scopedSubEventId)) {
            refreshEmbeddedSubEventMembers(scopedEventId, scopedSubEventId, ownerId);
        }
        if (OWNER_TYPE_GROUP.equals(ownerType)) {
            tournamentGroupCounterService.syncParent(scopedEventId, scopedSubEventId);
        }
        if (OWNER_TYPE_ASSET.equals(ownerType)) {
            assetsService.syncRequestsFromMembers(ownerId, membersToSave);
        }
    }

    public List<ActivityMemberEntryDto> applyAction(ActivityMemberActionRequestDto request) {
        if (request == null || request.owner() == null) {
            return List.of();
        }

        String ownerType = normalizeOwnerType(request.owner().ownerType());
        String ownerId = normalizeId(request.owner().ownerId());
        String actorUserId = resolveActorUserId(request.actorUserId());
        String targetUserId = normalizeId(request.targetUserId());
        String action = normalizeMemberAction(request.action());
        String scopedEventId = normalizeId(request.eventId());
        String scopedSubEventId = normalizeId(request.subEventId());
        String targetMemberId = normalizeId(request.targetMemberId());
        boolean organizerParticipationAction = ACTION_SET_ORGANIZER_ONLY.equals(action)
                || ACTION_SET_PARTICIPANT.equals(action);
        boolean scopedAssetAction = OWNER_TYPE_ASSET.equals(ownerType)
                && StringUtils.hasText(scopedEventId)
                && StringUtils.hasText(scopedSubEventId);
        if (!StringUtils.hasText(ownerType)
                || !StringUtils.hasText(ownerId)
                || !StringUtils.hasText(actorUserId)
                || !StringUtils.hasText(targetUserId)
                || !StringUtils.hasText(action)) {
            return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            if (ACTION_REMOVE.equals(action) && actorUserId.equals(targetUserId)) {
                suppressEventParticipationTree(ownerId, targetUserId, actorUserId);
                return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
            }
            if (!canApplyEventMemberAction(ownerId, actorUserId, targetUserId, action)) {
                return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
            }
        }
        List<ActivityMember> existing = scopedAssetAction
                ? loadScopedAssetDocuments(ownerId, scopedEventId, scopedSubEventId, false)
                : loadOwnerDocuments(ownerType, ownerId);
        ActivityMember current = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> targetUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> !scopedAssetAction
                        || !StringUtils.hasText(targetMemberId)
                        || targetMemberId.equals(firstNonBlank(
                                normalizeId(member.getSyncKey()),
                                normalizeId(member.getId()))))
                .findFirst()
                .orElse(null);
        if (current == null || STATUS_DELETED.equals(normalizeStatus(current.getStatus()))) {
            return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isInvitationMembership(current)
                && !actorUserId.equals(targetUserId)
                && !actorUserId.equals(normalizeId(current.getInvitedByUserId()))) {
            return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
        }
        String currentRole = resolveStoredRole(current, ownerType, ownerId);
        boolean actorCanManageOwner = canManageOwnerMembers(
                ownerType,
                ownerId,
                actorUserId,
                scopedEventId);
        boolean organizerParticipationAllowed = organizerParticipationAction
                && actorUserId.equals(targetUserId)
                && (STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                    || STATUS_PENDING.equals(normalizeStatus(current.getStatus())))
                && (actorCanManageOwner || scopedAssetAction);
        if (organizerParticipationAllowed
                && (OWNER_TYPE_GROUP.equals(ownerType) || OWNER_TYPE_SUB_EVENT.equals(ownerType))) {
            SubEventCounterScope scope = OWNER_TYPE_GROUP.equals(ownerType)
                    ? groupCounterScope(ownerId) : subEventCounterScope(ownerId);
            String eventId = StringUtils.hasText(scopedEventId) ? scopedEventId
                    : scope == null ? "" : scope.eventId();
            String stageId = StringUtils.hasText(scopedSubEventId) ? scopedSubEventId
                    : scope == null ? "" : scope.subEventId();
            ActivityEvent event = findPreferredEventRecord(eventId);
            organizerParticipationAllowed = false;
            if (event != null && event.getSubEvents() != null) {
                organizerParticipationAllowed = event.getSubEvents().stream()
                        .filter(Objects::nonNull)
                        .filter(stage -> stageId.equals(stage.id()))
                        .filter(stage -> OWNER_TYPE_SUB_EVENT.equals(ownerType)
                                ? ownerId.equals(eventId + ":" + stage.id())
                                : stage.groups() != null && stage.groups().stream()
                                        .filter(Objects::nonNull)
                                        .anyMatch(group -> ownerId.equals(eventId + ":" + stage.id() + ":" + group.id())))
                        .anyMatch(stage -> !(isTournamentStage(stage)
                                && Set.of(STAGE_STATUS_ACTIVE, STAGE_STATUS_SCORE_REVIEW,
                                        STAGE_STATUS_FINALIZED, STAGE_STATUS_SUSPENDED)
                                        .contains(safeText(stage.stageStatus()).toUpperCase(Locale.US))));
            }
        }
        if (organizerParticipationAction && !organizerParticipationAllowed) {
            return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
        }
        boolean ownerRemovingAcceptedAssetManager = OWNER_TYPE_ASSET.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && isAssetOwnerUser(ownerId, actorUserId)
                && !actorUserId.equals(targetUserId)
                && STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                && MANAGER_ROLES.contains(currentRole);
        boolean acceptingOwnManagedInvitation = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_ACCEPT.equals(action)
                && actorUserId.equals(targetUserId)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isInvitationMembership(current);
        boolean cancellingOwnManagedInvitation = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isInvitationMembership(current)
                && actorUserId.equals(normalizeId(current.getInvitedByUserId()));
        boolean rejectingOwnManagedInvitation = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && actorUserId.equals(targetUserId)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isInvitationMembership(current);
        boolean withdrawingOwnApprovalRequest = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && actorUserId.equals(targetUserId)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isAdminApprovalMembership(current);
        boolean managingPendingApproval = !OWNER_TYPE_EVENT.equals(ownerType)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isAdminApprovalMembership(current)
                && actorCanManageOwner;
        boolean managingPendingInvitation = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isInvitationMembership(current)
                && actorCanManageOwner
                && !actorUserId.equals(targetUserId);
        boolean steppingDownOwnManagedRole = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_STEP_DOWN_ADMIN.equals(action)
                && actorUserId.equals(targetUserId)
                && STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                && MANAGER_ROLES.contains(currentRole)
                && hasAcceptedManagerSuccessor(existing, targetUserId, ownerType, ownerId);
        boolean leavingOwnManagedMembership = !OWNER_TYPE_EVENT.equals(ownerType)
                && !OWNER_TYPE_ASSET.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && actorUserId.equals(targetUserId)
                && STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                && !MANAGER_ROLES.contains(currentRole)
                && !isProtectedOwnerMember(ownerType, ownerId, targetUserId);
        if (!OWNER_TYPE_EVENT.equals(ownerType)
                && !acceptingOwnManagedInvitation
                && !cancellingOwnManagedInvitation
                && !rejectingOwnManagedInvitation
                && !withdrawingOwnApprovalRequest
                && !managingPendingApproval
                && !managingPendingInvitation
                && !steppingDownOwnManagedRole
                && !leavingOwnManagedMembership
                && !organizerParticipationAction
                && (!actorCanManageOwner
                    || actorUserId.equals(targetUserId)
                    || (isProtectedOwnerMember(ownerType, ownerId, targetUserId)
                        && !ownerRemovingAcceptedAssetManager))) {
            return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
        }

        if (organizerParticipationAction) {
            String nowIso = Instant.now().toString();
            ActivityMember next = scopedAssetAction
                    ? scopedOrganizerParticipationMember(
                        current,
                        ownerId,
                        targetUserId,
                        actorUserId,
                        nowIso)
                    : cloneMember(current);
            next.setOrganizerOnly(ACTION_SET_ORGANIZER_ONLY.equals(action));
            next.setActionAtIso(nowIso);
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, current));
            activityMembersRepository.save(next);
            if (OWNER_TYPE_EVENT.equals(ownerType)) {
                refreshEmbeddedEventMembers(ownerId);
                userActivityCountersService.refreshEventCountersForSourceIds(List.of(ownerId));
            } else if (OWNER_TYPE_SUB_EVENT.equals(ownerType)) {
                SubEventCounterScope scope = subEventCounterScope(ownerId);
                if (scope != null) {
                    refreshEmbeddedSubEventMembers(scope.eventId(), scope.subEventId(), ownerId);
                }
            } else if (OWNER_TYPE_GROUP.equals(ownerType)) {
                tournamentGroupCounterService.syncParent(scopedEventId, scopedSubEventId);
            } else if (OWNER_TYPE_ASSET.equals(ownerType) && scopedAssetAction) {
                activitiesResourcesService.refreshResourceMetricsForScope(
                        scopedEventId,
                        scopedSubEventId,
                        actorUserId);
            }
            return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
        }
        if (!OWNER_TYPE_EVENT.equals(ownerType)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isInvitationMembership(current)
                && !acceptingOwnManagedInvitation
                && !cancellingOwnManagedInvitation
                && !rejectingOwnManagedInvitation
                && !managingPendingInvitation) {
            return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
        }

        String currentStatus = normalizeStatus(current.getStatus());
        boolean cancellingEventInvitation = OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && STATUS_PENDING.equals(currentStatus)
                && isInvitationMembership(current);
        boolean approvingEventJoinRequest = OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_ACCEPT.equals(action)
                && STATUS_PENDING.equals(currentStatus)
                && isAdminApprovalMembership(current);
        if (approvingEventJoinRequest && isTournamentAdmissionLocked(findPreferredEventRecord(ownerId))) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "tournament-registration-closed");
        }
        String nextStatus;
        boolean requiresManagerApproval = acceptingOwnManagedInvitation
                && !scopedAssetAction
                && !canManageOwnerMembers(
                    ownerType,
                    ownerId,
                    current.getInvitedByUserId(),
                    scopedEventId);
        if (ACTION_ACCEPT.equals(action)) {
            if (!STATUS_PENDING.equals(currentStatus)
                    || (!acceptingOwnManagedInvitation && !isAdminApprovalMembership(current))) {
                return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
            }
            nextStatus = requiresManagerApproval ? STATUS_PENDING : STATUS_ACCEPTED;
        } else if (ACTION_REMOVE.equals(action)) {
            nextStatus = STATUS_DELETED;
        } else if (ACTION_DISQUALIFY.equals(action)) {
            if (!STATUS_ACCEPTED.equals(currentStatus)) {
                return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
            }
            nextStatus = STATUS_DISQUALIFIED;
        } else if (ACTION_REINSTATE.equals(action)) {
            if (!STATUS_DISQUALIFIED.equals(currentStatus)) {
                return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
            }
            nextStatus = STATUS_ACCEPTED;
        } else if (ACTION_PROMOTE_ADMIN.equals(action)) {
            if (!STATUS_ACCEPTED.equals(currentStatus) || "Admin".equals(safeText(current.getRole()))) {
                return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
            }
            nextStatus = STATUS_ACCEPTED;
        } else if (ACTION_STEP_DOWN_ADMIN.equals(action)) {
            if (!STATUS_ACCEPTED.equals(currentStatus) || !MANAGER_ROLES.contains(currentRole)) {
                return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
            }
            nextStatus = STATUS_ACCEPTED;
        } else {
            return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
        }

        String nowIso = Instant.now().toString();
        ActivityMember next = STATUS_DELETED.equals(nextStatus)
                ? toDeletedMember(current, actorUserId, nowIso)
                : cloneMember(current);
        if (!STATUS_DELETED.equals(nextStatus)) {
            next.setStatus(nextStatus);
            next.setPendingSource(requiresManagerApproval ? "member" : null);
            next.setRequestKind(requiresManagerApproval ? REQUEST_KIND_APPROVAL : null);
            if (!requiresManagerApproval) {
                next.setInvitedByUserId(null);
            }
            next.setActionAtIso(nowIso);
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, current));
        }
        if (ACTION_PROMOTE_ADMIN.equals(action)) {
            next.setRole("Admin");
        } else if (ACTION_STEP_DOWN_ADMIN.equals(action)) {
            next.setRole("Member");
        }
        if (scopedAssetAction) {
            persistScopedAssetAction(
                    ownerId,
                    scopedEventId,
                    scopedSubEventId,
                    actorUserId,
                    targetUserId,
                    targetMemberId,
                    existing,
                    next);
            if (ACTION_REMOVE.equals(action)) {
                activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                                OWNER_TYPE_ASSET,
                                ownerId,
                                targetUserId)
                        .map(member -> toDeletedMember(member, actorUserId, nowIso))
                        .ifPresent(activityMembersRepository::save);
            }
        } else if (OWNER_TYPE_EVENT.equals(ownerType)
                && STATUS_ACCEPTED.equals(nextStatus)
                && !STATUS_ACCEPTED.equals(currentStatus)) {
            synchronized (eventJoinLock(ownerId)) {
                List<ActivityMember> latestMembers =
                        loadOwnerDocuments(OWNER_TYPE_EVENT, ownerId);
                ActivityMember latestCurrent = latestMembers.stream()
                        .filter(Objects::nonNull)
                        .filter(member -> targetUserId.equals(
                                normalizeId(member.getUserId())))
                        .findFirst()
                        .orElse(null);
                if (latestCurrent == null
                        || !currentStatus.equals(
                                normalizeStatus(latestCurrent.getStatus()))
                        || isCapacityFullForJoin(
                                findPreferredEventRecord(ownerId),
                                latestMembers,
                                targetUserId)) {
                    return queryMembers(
                            ownerType,
                            ownerId,
                            false,
                            scopedEventId,
                            scopedSubEventId,
                            request.assetRequestId());
                }
                activityMembersRepository.save(next);
            }
        } else {
            activityMembersRepository.save(next);
        }

        if (OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && STATUS_ACCEPTED.equals(currentStatus)) {
            removeGeneratedTournamentRoomParticipation(
                    ownerId,
                    targetUserId,
                    actorUserId,
                    nowIso);
        } else if (OWNER_TYPE_EVENT.equals(ownerType)
                && (ACTION_DISQUALIFY.equals(action) || ACTION_REINSTATE.equals(action))) {
            updateGeneratedTournamentRoomParticipationStatus(
                    ownerId,
                    targetUserId,
                    action,
                    actorUserId,
                    nowIso);
        }

        boolean removingPendingEventMembership = OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && STATUS_PENDING.equals(currentStatus);
        if (!removingPendingEventMembership && !scopedAssetAction) {
            enqueueOwnerMembersChanged(ownerType, ownerId, actorUserId);
        }
        adminTelemetryService.record(
                memberActionTelemetry(action),
                ownerType,
                ownerId,
                actorUserId,
                1L,
                Map.of("targetUserId", targetUserId));

        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            if (removingPendingEventMembership) {
                int promotedWaitlistMembers = processEventWaitlist(
                        ownerId,
                        findPreferredEventRecord(ownerId),
                        true);
                if (promotedWaitlistMembers == 0) {
                    refreshEmbeddedEventMembers(ownerId);
                }
                userActivityCountersService.refreshEventCountersForUsers(List.of(targetUserId));
                if (cancellingEventInvitation) {
                    eventInviteNotificationService.markInvitationResolved(
                            ownerId,
                            targetUserId);
                }
                return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
            }
            if (ACTION_REMOVE.equals(action)) {
                cascadeRemovedEventMembersFromAssignedAssets(ownerId, List.of(current), actorUserId, nowIso);
                Set<String> removedManagedAssetIds = activitiesResourcesService
                        .removeManagedResourcesForRemovedEventMembers(ownerId, List.of(current), actorUserId, nowIso);
                clearRemovedManagedAssetMembers(removedManagedAssetIds, actorUserId, nowIso);
                processEventWaitlist(ownerId, findPreferredEventRecord(ownerId), true);
            }
            if (STATUS_ACCEPTED.equals(nextStatus) && !STATUS_ACCEPTED.equals(currentStatus)) {
                finalizeAcceptedEventReservations(ownerId, List.of(next));
            }
            eventParticipationTicketService.syncParticipationTicketsForEvent(ownerId);
            refreshEmbeddedEventMembers(ownerId);
            if (approvingEventJoinRequest && STATUS_ACCEPTED.equals(nextStatus)) {
                eventInviteNotificationService.notifyMemberApproved(
                        findPreferredEventRecord(ownerId),
                        targetUserId,
                        next.getActionAtIso(),
                        actorUserId);
            }
            if (ACTION_ACCEPT.equals(action)) {
                postEventMembershipChangeMessages(ownerId, List.of(next), List.of(), actorUserId);
                ActivityEvent notificationEvent = findPreferredEventRecord(ownerId);
                if (isRootEventRecord(notificationEvent)) {
                    eventInviteNotificationService.notifyMemberJoined(
                            notificationEvent,
                            targetUserId,
                            memberDisplayName(next),
                            next.getActionAtIso(),
                            eventJoinedRecipientUserIds(ownerId, notificationEvent, targetUserId));
                }
            } else if (ACTION_REMOVE.equals(action)) {
                notifyRemovedEventMembers(ownerId, List.of(current), actorUserId, nowIso);
                postEventMembershipChangeMessages(ownerId, List.of(), List.of(current), actorUserId);
            } else if (ACTION_DISQUALIFY.equals(action) || ACTION_REINSTATE.equals(action)) {
                postMemberActionChatMessage(ownerId, action, next);
                notifyEventMemberStatusChanged(ownerId, next, action, actorUserId, nowIso);
            }
            userActivityCountersService.refreshEventCountersForSourceIds(List.of(ownerId));
        } else if (OWNER_TYPE_SUB_EVENT.equals(ownerType)) {
            SubEventCounterScope scope = subEventCounterScope(ownerId);
            if (scope != null) {
                refreshEmbeddedSubEventMembers(scope.eventId(), scope.subEventId(), ownerId);
            }
        } else if (OWNER_TYPE_GROUP.equals(ownerType)) {
            tournamentGroupCounterService.syncParent(request.eventId(), request.subEventId());
        } else if (OWNER_TYPE_ASSET.equals(ownerType) && !scopedAssetAction) {
            assetsService.syncRequestsFromMembers(ownerId, List.of(next));
        }

        return queryMembers(ownerType, ownerId, false, scopedEventId, scopedSubEventId, request.assetRequestId());
    }

    public ActivityMemberActionResponseDto applyActionWithContext(ActivityMemberActionRequestDto request) {
        List<ActivityMemberEntryDto> members = applyAction(request);
        String actorUserId = resolveActorUserId(request == null ? null : request.actorUserId());
        return new ActivityMemberActionResponseDto(
                members,
                homeUserProfileService.queryMenuCounters(actorUserId));
    }

    private void persistScopedAssetAction(
            String assetId,
            String eventId,
            String subEventId,
            String actorUserId,
            String targetUserId,
            String targetMemberId,
            List<ActivityMember> existing,
            ActivityMember next) {
        String viewerUserId = homeUserProfileService.resolveSelectedUserId(actorUserId);
        List<ActivityMemberEntryDto> nextEntries = new ArrayList<>();
        List<ActivityMember> profileMembers = new ArrayList<>(existing == null ? List.of() : existing);
        if (next != null) profileMembers.add(next);
        Map<String, Users> usersById = memberUsersById(profileMembers);
        for (ActivityMember member : existing == null ? List.<ActivityMember>of() : existing) {
            String memberId = member == null ? "" : firstNonBlank(
                    normalizeId(member.getSyncKey()),
                    normalizeId(member.getId()));
            boolean target = member != null
                    && targetUserId.equals(normalizeId(member.getUserId()))
                    && (!StringUtils.hasText(targetMemberId) || targetMemberId.equals(memberId));
            if (member == null || target) {
                continue;
            }
            ActivityMemberEntryDto entry = toEntryDto(member, viewerUserId, usersById);
            if (entry != null) {
                nextEntries.add(entry);
            }
        }
        if (next != null && !STATUS_DELETED.equals(normalizeStatus(next.getStatus()))) {
            ActivityMemberEntryDto nextEntry = toEntryDto(next, viewerUserId, usersById);
            if (nextEntry != null) {
                nextEntries.add(nextEntry);
            }
        }
        assetsService.syncScopedRequestsFromMemberEntries(
                assetId,
                eventId,
                subEventId,
                nextEntries,
                actorUserId);
    }

    private ActivityMember scopedOrganizerParticipationMember(
            ActivityMember current,
            String assetId,
            String targetUserId,
            String actorUserId,
            String nowIso) {
        ActivityMember stored = activityMembersRepository
                .findByOwnerTypeAndOwnerIdAndUserId(OWNER_TYPE_ASSET, assetId, targetUserId)
                .orElse(null);
        ActivityMember next = stored == null ? cloneMember(current) : cloneMember(stored);
        next.setRole(resolveStoredRole(current, OWNER_TYPE_ASSET, assetId));
        next.setStatus(normalizeStatus(current.getStatus()));
        next.setPendingSource(current.getPendingSource());
        next.setRequestKind(current.getRequestKind());
        if (stored == null) {
            next.setId(new ObjectId().toHexString());
            next.setSyncKey("asset-organizer:" + assetId + ":" + targetUserId);
            next.setOwnerType(OWNER_TYPE_ASSET);
            next.setOwnerId(assetId);
            next.setUserId(targetUserId);
            next.setMetAtIso(normalizeDateTime(current.getMetAtIso(), nowIso));
            next.setMetWhere(safeText(current.getMetWhere()));
            next.setCreatedDate(nowIso);
            next.setCreatedUser(resolveCreatedUser(next, actorUserId));
        }
        return next;
    }

    public OwnerMembersSnapshot requestJoin(String eventId, Users viewer, ActivityEvent eventRecord) {
        return requestJoin(eventId, viewer, eventRecord, false);
    }

    public OwnerMembersSnapshot requestJoin(String eventId, Users viewer, ActivityEvent eventRecord, boolean accepted) {
        return requestJoin(eventId, viewer, eventRecord, accepted, false);
    }

    public OwnerMembersSnapshot requestJoin(String eventId, Users viewer, ActivityEvent eventRecord, boolean accepted, boolean waitingList) {
        return requestJoin(eventId, viewer, eventRecord, accepted, waitingList, false);
    }

    public OwnerMembersSnapshot requestJoin(
            String eventId,
            Users viewer,
            ActivityEvent eventRecord,
            boolean accepted,
            boolean waitingList,
            boolean approvalRequested) {
        String normalizedEventId = normalizeId(eventId);
        String viewerUserId = viewer == null ? null : normalizeId(viewer.getId());
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(viewerUserId)) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }

        synchronized (eventJoinLock(normalizedEventId)) {
        List<ActivityMember> existing = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId);
        Map<String, ActivityMember> existingByUserId = new LinkedHashMap<>();
        for (ActivityMember member : existing) {
            if (member != null && StringUtils.hasText(normalizeId(member.getUserId()))) {
                existingByUserId.put(normalizeId(member.getUserId()), member);
            }
        }

        ActivityMember current = existingByUserId.get(viewerUserId);
        boolean rejoiningSuppressedParticipation = current != null
                && STATUS_SUPPRESSED.equals(normalizeStatus(current.getStatus()))
                && ROOT_SUPPRESSIBLE_STATUSES.contains(
                        normalizeStatus(current.getStatusBeforeSuppression()))
                && StringUtils.hasText(normalizeId(current.getSuppressionRootOwnerId()));
        boolean resolvingInvitation = current != null
                && (STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                    || STATUS_INVITED.equals(normalizeStatus(current.getStatus())))
                && isInvitationMembership(current);
        boolean adminApprovalAlreadyPending = isAdminApprovalMembership(current);
        if (current != null
                && STATUS_SUPPRESSED.equals(normalizeStatus(current.getStatus()))
                && !rejoiningSuppressedParticipation) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }
        if (current != null && ACCEPTED_STATUSES.contains(normalizeStatus(current.getStatus()))) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }
        if (isTournamentAdmissionLocked(eventRecord == null
                ? findPreferredEventRecord(normalizedEventId)
                : eventRecord)) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }
        boolean mutationApplied = false;
        if (accepted && isCapacityFullForJoin(eventRecord, existing, viewerUserId)) {
            accepted = false;
            waitingList = true;
        }
        boolean newMember = current == null;
        if (current == null) {
            current = new ActivityMember();
            current.setId(new ObjectId().toHexString());
            current.setSyncKey(UUID.randomUUID().toString());
            current.setOwnerType(OWNER_TYPE_EVENT);
            current.setOwnerId(normalizedEventId);
            current.setUserId(viewerUserId);
            current.setCreatedDate(Instant.now().toString());
            current.setCreatedUser(viewerUserId);
        }
        if (accepted || newMember || !ACCEPTED_STATUSES.contains(normalizeStatus(current.getStatus()))) {
            String nowIso = Instant.now().toString();
            if (resolvingInvitation) {
                EventVipInvitation.accept(current,
                        eventRecord == null ? null : eventRecord.getPricing(), nowIso);
            } else if (newMember || !STATUS_PENDING.equals(current.getStatus())) {
                EventVipInvitation.issue(current, false, null, nowIso);
            }
            current.setRole(normalizeRole(current.getRole(), viewerUserId, OWNER_TYPE_EVENT, normalizedEventId));
            current.setStatus(accepted ? STATUS_ACCEPTED : "pending");
            current.setPendingSource(accepted ? null : "member");
            current.setRequestKind(accepted ? null : pendingJoinRequestKind(waitingList, approvalRequested));
            if (!Boolean.TRUE.equals(current.getEventVipInvitation())) {
                current.setInvitedByUserId(null);
            }
            current.setStatusBeforeSuppression(null);
            current.setSuppressionRootOwnerId(null);
            current.setSuppressedAtIso(null);
            current.setActionAtIso(nowIso);
            current.setMetAtIso(normalizeDateTime(current.getMetAtIso(), nowIso));
            current.setMetWhere(safeText(current.getMetWhere()));
            current.setUpdatedDate(nowIso);
            current.setUpdatedUser(viewerUserId);
            activityMembersRepository.save(current);
            mutationApplied = true;
            if (rejoiningSuppressedParticipation) {
                restoreTrashedParticipationOverlays(
                        loadEventDocumentsBySourceId(List.of(normalizedEventId)),
                        viewerUserId,
                        viewerUserId,
                        nowIso,
                        false);
            }
            enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, normalizedEventId, viewerUserId);
            adminTelemetryService.record("event.member.joined", "events", normalizedEventId, viewerUserId);
            if (accepted) {
                processEventWaitlist(normalizedEventId, eventRecord, true);
                finalizeAcceptedEventReservations(normalizedEventId, List.of(current));
            }
            eventParticipationTicketService.syncParticipationTicketForUser(normalizedEventId, viewerUserId);
            refreshEmbeddedEventMembers(normalizedEventId);
            if (accepted) {
                postEventMembershipChangeMessages(
                        normalizedEventId,
                        List.of(current),
                        List.of(),
                        viewerUserId);
            }
            userActivityCountersService.refreshEventCountersForUsers(List.of(viewerUserId));
            if (!adminApprovalAlreadyPending && isAdminApprovalMembership(current)) {
                ActivityEvent notificationEvent = eventRecord == null
                        ? findPreferredEventRecord(normalizedEventId)
                        : eventRecord;
                eventInviteNotificationService.notifyJoinRequested(
                        notificationEvent,
                        viewerUserId,
                        memberDisplayName(current),
                        current.getActionAtIso(),
                        List.copyOf(resolveEventAdminUserIds(notificationEvent)));
            }
            if (resolvingInvitation) {
                eventInviteNotificationService.markInvitationResolved(
                        normalizedEventId,
                        viewerUserId);
            }
            if (accepted) {
                ActivityEvent notificationEvent = eventRecord == null
                        ? findPreferredEventRecord(normalizedEventId)
                        : eventRecord;
                if (resolvingInvitation) {
                    eventInviteNotificationService.notifyInvitationAccepted(
                            notificationEvent,
                            viewerUserId,
                            memberDisplayName(current),
                            current.getActionAtIso(),
                            eventAcceptanceRecipientUserIds(normalizedEventId, notificationEvent, viewerUserId));
                } else if (isRootEventRecord(notificationEvent)) {
                    eventInviteNotificationService.notifyMemberJoined(
                            notificationEvent,
                            viewerUserId,
                            memberDisplayName(current),
                            current.getActionAtIso(),
                            eventJoinedRecipientUserIds(normalizedEventId, notificationEvent, viewerUserId));
                }
            }
        }
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        return snapshot == null ? null : snapshot.withMutationApplied(mutationApplied);
        }
    }

    private boolean isRootEventRecord(ActivityEvent event) {
        return event != null && !StringUtils.hasText(normalizeId(event.getParentEventId()));
    }

    public OwnerMembersSnapshot removeEventParticipation(String eventId, String userId, String actorUserId) {
        return suppressEventParticipationTree(eventId, userId, actorUserId);
    }

    public OwnerMembersSnapshot suppressEventParticipationTree(
            String rootEventId,
            String userId,
            String actorUserId) {
        String normalizedEventId = normalizeId(rootEventId);
        String normalizedUserId = normalizeId(userId);
        String normalizedActorUserId = resolveActorUserId(actorUserId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedUserId)) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }
        if (!normalizedUserId.equals(normalizedActorUserId)) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }

        synchronized (eventJoinLock(normalizedEventId)) {
            List<ActivityMember> existing = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId);
            ActivityMember current = existing.stream()
                    .filter(Objects::nonNull)
                    .filter(member -> normalizedUserId.equals(normalizeId(member.getUserId())))
                    .findFirst()
                    .orElse(null);
            boolean resolvingInvitation = current != null
                    && (STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                        || STATUS_INVITED.equals(normalizeStatus(current.getStatus())))
                    && isInvitationMembership(current);
            boolean cancellingJoinRequest = isAdminApprovalMembership(current);
            ActivityEvent joinRequestEvent = cancellingJoinRequest
                    ? findPreferredEventRecord(normalizedEventId)
                    : null;
            String cancellingMemberName = cancellingJoinRequest
                    ? memberDisplayName(current)
                    : "";
            boolean alreadySuppressed = current != null
                    && STATUS_SUPPRESSED.equals(normalizeStatus(current.getStatus()))
                    && normalizedEventId.equals(normalizeId(current.getSuppressionRootOwnerId()))
                    && StringUtils.hasText(
                            normalizeRestorableMembershipStatus(
                                    current.getStatusBeforeSuppression()));
            if (alreadySuppressed) {
                String repairNowIso = Instant.now().toString();
                List<ActivityMember> suppressedTree =
                        loadEventParticipationTree(normalizedEventId, normalizedUserId, existing).stream()
                                .filter(Objects::nonNull)
                                .filter(member -> STATUS_SUPPRESSED.equals(normalizeStatus(member.getStatus())))
                                .filter(member -> normalizedEventId.equals(
                                        normalizeId(member.getSuppressionRootOwnerId())))
                                .toList();
                LinkedHashSet<String> eventSourceIds = eventSourceIds(suppressedTree);
                Map<String, List<ActivityEvent>> documentsBySourceId =
                        loadEventDocumentsBySourceId(eventSourceIds);
                boolean rootOverlayExists = documentsBySourceId
                        .getOrDefault(normalizedEventId, List.of()).stream()
                        .filter(Objects::nonNull)
                        .anyMatch(document -> normalizedUserId.equals(normalizeId(document.getOwnerUserId()))
                                && ActivityEvent.STATUS_TRASHED.equals(safeText(document.getStatus()))
                                && StringUtils.hasText(safeText(document.getStatusBeforeSuppression())));
                List<ActivityEvent> repairedOverlays = rootOverlayExists
                        ? List.of()
                        : upsertTrashedParticipationOverlays(
                                eventSourceIds,
                                normalizedUserId,
                                normalizedActorUserId,
                                repairNowIso);
                LinkedHashSet<String> persistedEventSourceIds =
                        eventSourceIdsFromDocuments(repairedOverlays);
                if (persistedEventSourceIds.isEmpty()) {
                    documentsBySourceId.values().stream()
                            .flatMap(Collection::stream)
                            .map(ActivityEvent::getSourceId)
                            .map(this::normalizeId)
                            .filter(StringUtils::hasText)
                            .forEach(persistedEventSourceIds::add);
                }
                refreshSuppressedEventSources(persistedEventSourceIds, normalizedUserId);
                refreshManagedChildParticipationProjections(suppressedTree);
                int promotedWaitlistMembers = 0;
                if (STATUS_ACCEPTED.equals(
                        normalizeRestorableMembershipStatus(current.getStatusBeforeSuppression()))) {
                    cascadeRemovedEventMembersFromAssignedAssets(
                            normalizedEventId,
                            List.of(current),
                            normalizedActorUserId,
                            repairNowIso);
                    Set<String> removedManagedAssetIds = activitiesResourcesService
                            .removeManagedResourcesForRemovedEventMembers(
                                    normalizedEventId,
                                    List.of(current),
                                    normalizedActorUserId,
                                    repairNowIso);
                    clearRemovedManagedAssetMembers(
                            removedManagedAssetIds,
                            normalizedActorUserId,
                            repairNowIso);
                    promotedWaitlistMembers = processEventWaitlist(
                            normalizedEventId,
                            findPreferredEventRecord(normalizedEventId),
                            true);
                }
                if (promotedWaitlistMembers == 0) {
                    userActivityCountersService.refreshEventCountersForUsers(List.of(normalizedUserId));
                } else {
                    userActivityCountersService.refreshEventCountersForSourceIds(
                            List.copyOf(persistedEventSourceIds));
                }
                OwnerMembersSnapshot repairedSnapshot =
                        queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
                return repairedSnapshot == null
                        ? null
                        : repairedSnapshot.withMutationApplied(!rootOverlayExists);
            }
            if (current == null || !ROOT_SUPPRESSIBLE_STATUSES.contains(normalizeStatus(current.getStatus()))) {
                return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
            }
            EventAdminLeavePlan leavePlan = resolveEventAdminLeavePlan(
                    normalizedEventId,
                    normalizedUserId,
                    current,
                    existing);
            if (!leavePlan.allowed()) {
                return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
            }

            String currentStatus = normalizeStatus(current.getStatus());
            String nowIso = Instant.now().toString();
            if (StringUtils.hasText(leavePlan.successorAdminUserId())) {
                transferEventOwnership(
                        normalizedEventId,
                        normalizedUserId,
                        leavePlan.successorAdminUserId(),
                        normalizedActorUserId,
                        nowIso);
            }

            List<ActivityMember> participationTree =
                    loadEventParticipationTree(normalizedEventId, normalizedUserId, existing);
            List<ActivityMember> suppressedMembers = participationTree.stream()
                    .filter(Objects::nonNull)
                    .filter(member -> SUPPRESSIBLE_STATUSES.contains(normalizeStatus(member.getStatus())))
                    .map(member -> toSuppressedMember(
                            member,
                            normalizedEventId,
                            normalizedActorUserId,
                            nowIso))
                    .toList();
            if (suppressedMembers.isEmpty()) {
                return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
            }

            LinkedHashSet<String> affectedEventSourceIds = eventSourceIds(suppressedMembers);
            List<ActivityEvent> trashedOverlays = upsertTrashedParticipationOverlays(
                    affectedEventSourceIds,
                    normalizedUserId,
                    normalizedActorUserId,
                    nowIso);
            LinkedHashSet<String> persistedEventSourceIds =
                    new LinkedHashSet<>(affectedEventSourceIds);
            persistedEventSourceIds.addAll(eventSourceIdsFromDocuments(trashedOverlays));
            activityMembersRepository.saveAll(suppressedMembers);

            int promotedWaitlistMembers = 0;
            if (STATUS_ACCEPTED.equals(currentStatus)) {
                enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, normalizedEventId, normalizedActorUserId);
            }
            adminTelemetryService.record(
                    "event.member.removed",
                    "events",
                    normalizedEventId,
                    normalizedActorUserId,
                    1L,
                    Map.of("targetUserId", normalizedUserId));
            if (STATUS_ACCEPTED.equals(currentStatus)) {
                cascadeRemovedEventMembersFromAssignedAssets(normalizedEventId, List.of(current), normalizedActorUserId, nowIso);
                Set<String> removedManagedAssetIds = activitiesResourcesService
                        .removeManagedResourcesForRemovedEventMembers(normalizedEventId, List.of(current), normalizedActorUserId, nowIso);
                clearRemovedManagedAssetMembers(removedManagedAssetIds, normalizedActorUserId, nowIso);
                promotedWaitlistMembers =
                        processEventWaitlist(normalizedEventId, findPreferredEventRecord(normalizedEventId), true);
                notifyRemovedEventMembers(
                        normalizedEventId,
                        List.of(current),
                        normalizedActorUserId,
                        nowIso);
                postEventMembershipChangeMessages(
                        normalizedEventId,
                        List.of(),
                        List.of(current),
                        normalizedActorUserId);
            }

            refreshSuppressedEventSources(persistedEventSourceIds, normalizedUserId);
            refreshManagedChildParticipationProjections(suppressedMembers);
            if (promotedWaitlistMembers == 0) {
                LinkedHashSet<String> counterUserIds = new LinkedHashSet<>();
                counterUserIds.add(normalizedUserId);
                if (StringUtils.hasText(leavePlan.successorAdminUserId())) {
                    counterUserIds.add(leavePlan.successorAdminUserId());
                }
                userActivityCountersService.refreshEventCountersForUsers(List.copyOf(counterUserIds));
            } else {
                userActivityCountersService.refreshEventCountersForSourceIds(List.copyOf(persistedEventSourceIds));
            }
            if (resolvingInvitation) {
                eventInviteNotificationService.markInvitationResolved(
                        normalizedEventId,
                        normalizedUserId);
            }
            if (cancellingJoinRequest) {
                eventInviteNotificationService.notifyJoinRequestCancelled(
                        joinRequestEvent,
                        normalizedUserId,
                        cancellingMemberName,
                        nowIso,
                        List.copyOf(resolveEventAdminUserIds(joinRequestEvent)));
            }
            OwnerMembersSnapshot updatedSnapshot =
                    queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
            return updatedSnapshot == null ? null : updatedSnapshot.withMutationApplied(true);
        }
    }

    public boolean restoreEventParticipationTree(
            String rootEventId,
            String userId,
            String actorUserId) {
        String normalizedEventId = normalizeId(rootEventId);
        String normalizedUserId = normalizeId(userId);
        String normalizedActorUserId = resolveActorUserId(actorUserId);
        if (!StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedUserId)
                || !normalizedUserId.equals(normalizedActorUserId)) {
            return false;
        }

        synchronized (eventJoinLock(normalizedEventId)) {
            List<ActivityMember> rootMembers = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId);
            List<ActivityMember> participationTree =
                    loadEventParticipationTree(normalizedEventId, normalizedUserId, rootMembers);
            ActivityMember rootMembership = participationTree.stream()
                    .filter(Objects::nonNull)
                    .filter(member -> OWNER_TYPE_EVENT.equals(normalizeOwnerType(member.getOwnerType())))
                    .filter(member -> normalizedEventId.equals(normalizeId(member.getOwnerId())))
                    .findFirst()
                    .orElse(null);

            LinkedHashSet<String> candidateEventSourceIds = participationTree.stream()
                    .filter(Objects::nonNull)
                    .filter(member -> OWNER_TYPE_EVENT.equals(normalizeOwnerType(member.getOwnerType())))
                    .filter(member -> normalizedEventId.equals(normalizeId(member.getSuppressionRootOwnerId()))
                            || normalizedEventId.equals(normalizeId(member.getOwnerId())))
                    .map(ActivityMember::getOwnerId)
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .collect(LinkedHashSet::new, Set::add, Set::addAll);
            candidateEventSourceIds.add(normalizedEventId);
            Map<String, List<ActivityEvent>> eventDocumentsBySourceId =
                    loadEventDocumentsBySourceId(candidateEventSourceIds);
            ActivityEvent canonicalRoot = preferredCanonicalEventRecord(
                    eventDocumentsBySourceId.getOrDefault(normalizedEventId, List.of()));
            if (canonicalRoot == null
                    || ActivityEvent.STATUS_TRASHED.equals(safeText(canonicalRoot.getStatus()))) {
                return false;
            }

            boolean legacyRootRestore = isSafeLegacySelfDeletedRoot(
                    rootMembership,
                    normalizedEventId,
                    normalizedUserId,
                    eventDocumentsBySourceId.getOrDefault(normalizedEventId, List.of()));
            boolean suppressedRootRestore = rootMembership != null
                    && STATUS_SUPPRESSED.equals(normalizeStatus(rootMembership.getStatus()))
                    && normalizedEventId.equals(normalizeId(rootMembership.getSuppressionRootOwnerId()))
                    && StringUtils.hasText(
                            normalizeRestorableMembershipStatus(
                                    rootMembership.getStatusBeforeSuppression()));
            boolean legacyInvitationOverlayRestore = isSafeLegacyInvitationTrashOverlay(
                    rootMembership,
                    normalizedEventId,
                    normalizedUserId,
                    eventDocumentsBySourceId.getOrDefault(normalizedEventId, List.of()));
            if (!suppressedRootRestore && !legacyRootRestore && !legacyInvitationOverlayRestore) {
                return false;
            }

            for (ActivityMember member : participationTree) {
                if (member == null) {
                    continue;
                }
                boolean matchingSuppression = STATUS_SUPPRESSED.equals(normalizeStatus(member.getStatus()))
                        && normalizedEventId.equals(normalizeId(member.getSuppressionRootOwnerId()));
                boolean legacyRoot = legacyRootRestore
                        && member == rootMembership
                        && STATUS_DELETED.equals(normalizeStatus(member.getStatus()));
                if (!matchingSuppression && !legacyRoot) {
                    continue;
                }

                String restoredStatus = legacyRoot
                        ? STATUS_ACCEPTED
                        : normalizeRestorableMembershipStatus(member.getStatusBeforeSuppression());
                if (!STATUS_ACCEPTED.equals(restoredStatus)
                        || !OWNER_TYPE_EVENT.equals(normalizeOwnerType(member.getOwnerType()))) {
                    continue;
                }

                String memberEventId = normalizeId(member.getOwnerId());
                List<ActivityEvent> memberEventDocuments =
                        eventDocumentsBySourceId.getOrDefault(memberEventId, List.of());
                ActivityEvent memberCanonical = normalizedEventId.equals(memberEventId)
                        ? canonicalRoot
                        : preferredCanonicalEventRecord(memberEventDocuments);
                if (!memberEventDocuments.isEmpty()
                        && (memberCanonical == null
                                || ActivityEvent.STATUS_TRASHED.equals(safeText(memberCanonical.getStatus())))) {
                    return false;
                }
                if (memberCanonical != null) {
                    List<ActivityMember> ownerMembers = normalizedEventId.equals(memberEventId)
                            ? rootMembers
                            : loadOwnerDocuments(OWNER_TYPE_EVENT, memberEventId);
                    if (isCapacityFullForJoin(memberCanonical, ownerMembers, normalizedUserId)) {
                        return false;
                    }
                }
            }

            String nowIso = Instant.now().toString();
            List<ActivityMember> restoredMembers = new ArrayList<>();
            for (ActivityMember member : participationTree) {
                if (member == null) {
                    continue;
                }
                boolean matchingSuppression = STATUS_SUPPRESSED.equals(normalizeStatus(member.getStatus()))
                        && normalizedEventId.equals(normalizeId(member.getSuppressionRootOwnerId()));
                boolean legacyRoot = legacyRootRestore
                        && member == rootMembership
                        && STATUS_DELETED.equals(normalizeStatus(member.getStatus()));
                if (!matchingSuppression && !legacyRoot) {
                    continue;
                }
                ActivityMember restored = toRestoredMember(
                        member,
                        legacyRoot ? STATUS_ACCEPTED : member.getStatusBeforeSuppression(),
                        normalizedActorUserId,
                        nowIso);
                if (restored != null) {
                    restoredMembers.add(restored);
                }
            }

            List<ActivityEvent> restoredOverlays = restoreTrashedParticipationOverlays(
                    eventDocumentsBySourceId,
                    normalizedUserId,
                    normalizedActorUserId,
                    nowIso,
                    legacyInvitationOverlayRestore);
            if (restoredMembers.isEmpty() && restoredOverlays.isEmpty()) {
                return false;
            }
            if (!restoredMembers.isEmpty()) {
                activityMembersRepository.saveAll(restoredMembers);
            }

            ActivityMember restoredRoot = restoredMembers.stream()
                    .filter(member -> OWNER_TYPE_EVENT.equals(normalizeOwnerType(member.getOwnerType())))
                    .filter(member -> normalizedEventId.equals(normalizeId(member.getOwnerId())))
                    .findFirst()
                    .orElse(null);
            if (restoredRoot != null && STATUS_ACCEPTED.equals(normalizeStatus(restoredRoot.getStatus()))) {
                enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, normalizedEventId, normalizedActorUserId);
                postEventMembershipChangeMessages(
                        normalizedEventId,
                        List.of(restoredRoot),
                        List.of(),
                        normalizedActorUserId);
            }

            LinkedHashSet<String> affectedEventSourceIds = eventSourceIds(restoredMembers);
            restoredOverlays.stream()
                    .map(ActivityEvent::getSourceId)
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .forEach(affectedEventSourceIds::add);
            affectedEventSourceIds.removeIf(sourceId ->
                    eventDocumentsBySourceId.getOrDefault(sourceId, List.of()).isEmpty());
            refreshSuppressedEventSources(affectedEventSourceIds, normalizedUserId);
            refreshManagedChildParticipationProjections(restoredMembers);
            userActivityCountersService.refreshEventCountersForUsers(List.of(normalizedUserId));
            return true;
        }
    }

    private List<ActivityMember> loadEventParticipationTree(
            String rootEventId,
            String userId,
            List<ActivityMember> rootMembers) {
        String normalizedRootEventId = normalizeId(rootEventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedRootEventId) || !StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        Map<String, ActivityMember> membersByOwner = new LinkedHashMap<>();
        for (ActivityMember member : rootMembers == null ? List.<ActivityMember>of() : rootMembers) {
            if (member == null
                    || !normalizedUserId.equals(normalizeId(member.getUserId()))
                    || !isInEventParticipationTree(member, normalizedRootEventId)) {
                continue;
            }
            membersByOwner.put(ownerKey(member.getOwnerType(), member.getOwnerId()), member);
        }
        List<ActivityMember> storedTree = activityMembersRepository.findParticipationTreeForUser(
                normalizedUserId,
                normalizedRootEventId,
                PARTICIPATION_TREE_OWNER_TYPES,
                "^" + Pattern.quote(normalizedRootEventId) + ":");
        for (ActivityMember member : storedTree == null ? List.<ActivityMember>of() : storedTree) {
            if (member == null || !isInEventParticipationTree(member, normalizedRootEventId)) {
                continue;
            }
            membersByOwner.put(ownerKey(member.getOwnerType(), member.getOwnerId()), member);
        }
        return List.copyOf(membersByOwner.values());
    }

    private void removeGeneratedTournamentRoomParticipation(
            String parentEventId,
            String targetUserId,
            String actorUserId,
            String nowIso) {
        String normalizedParentEventId = normalizeId(parentEventId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        if (!StringUtils.hasText(normalizedParentEventId)
                || !StringUtils.hasText(normalizedTargetUserId)) {
            return;
        }
        Map<String, ActivityEvent> roomsBySourceId = new LinkedHashMap<>();
        for (ActivityEvent room : activityEventsRepository
                .findByParentEventIdIn(List.of(normalizedParentEventId))) {
            String roomSourceId = normalizeId(room == null ? null : room.getSourceId());
            if (!StringUtils.hasText(roomSourceId)
                    || !Boolean.TRUE.equals(room.getGenerated())
                    || !TOURNAMENT_ROOM_EVENT_TYPE.equalsIgnoreCase(safeText(room.getEventType()))) {
                continue;
            }
            roomsBySourceId.putIfAbsent(roomSourceId, room);
        }
        if (roomsBySourceId.isEmpty()) {
            return;
        }
        List<ActivityMember> removedRoomMembers = activityMembersRepository
                .findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, roomsBySourceId.keySet())
                .stream()
                .filter(Objects::nonNull)
                .filter(member -> normalizedTargetUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> !isHiddenMembershipStatus(member.getStatus()))
                .map(member -> toRemovedMember(member, actorUserId, nowIso))
                .toList();
        if (removedRoomMembers.isEmpty()) {
            return;
        }
        LinkedHashSet<String> affectedRoomIds = removedRoomMembers.stream()
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        String removedMemberName = memberDisplayName(removedRoomMembers.get(0));
        activityMembersRepository.saveAll(removedRoomMembers);
        refreshEmbeddedEventMembersBatch(roomsBySourceId.keySet());
        for (Map.Entry<String, ActivityEvent> entry : roomsBySourceId.entrySet()) {
            OwnerMembersSnapshot roomMembers = queryOwnerSnapshot(OWNER_TYPE_EVENT, entry.getKey());
            if (roomMembers != null && !roomMembers.acceptedMemberUserIds().isEmpty()) {
                chatService.ensureMainEventChat(entry.getValue(), roomMembers.acceptedMemberUserIds());
                if (affectedRoomIds.contains(entry.getKey()) && StringUtils.hasText(removedMemberName)) {
                    chatService.postSystemMessage(
                            entry.getKey(),
                            removedMemberName + " was removed from the tournament group.",
                            "member-removed");
                }
            }
        }
    }

    private void updateGeneratedTournamentRoomParticipationStatus(
            String parentEventId,
            String targetUserId,
            String action,
            String actorUserId,
            String nowIso) {
        String normalizedParentEventId = normalizeId(parentEventId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        String normalizedAction = normalizeMemberAction(action);
        String expectedCurrentStatus = ACTION_DISQUALIFY.equals(normalizedAction)
                ? STATUS_ACCEPTED
                : ACTION_REINSTATE.equals(normalizedAction) ? STATUS_DISQUALIFIED : "";
        String nextStatus = ACTION_DISQUALIFY.equals(normalizedAction)
                ? STATUS_DISQUALIFIED
                : ACTION_REINSTATE.equals(normalizedAction) ? STATUS_ACCEPTED : "";
        if (!StringUtils.hasText(normalizedParentEventId)
                || !StringUtils.hasText(normalizedTargetUserId)
                || !StringUtils.hasText(expectedCurrentStatus)
                || !StringUtils.hasText(nextStatus)) {
            return;
        }
        Map<String, ActivityEvent> roomsBySourceId = new LinkedHashMap<>();
        for (ActivityEvent room : activityEventsRepository.findByParentEventIdIn(List.of(normalizedParentEventId))) {
            String roomSourceId = normalizeId(room == null ? null : room.getSourceId());
            if (!StringUtils.hasText(roomSourceId)
                    || !Boolean.TRUE.equals(room.getGenerated())
                    || !TOURNAMENT_ROOM_EVENT_TYPE.equalsIgnoreCase(safeText(room.getEventType()))) {
                continue;
            }
            roomsBySourceId.putIfAbsent(roomSourceId, room);
        }
        if (roomsBySourceId.isEmpty()) {
            return;
        }
        List<ActivityMember> changedRoomMembers = activityMembersRepository
                .findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, roomsBySourceId.keySet())
                .stream()
                .filter(Objects::nonNull)
                .filter(member -> normalizedTargetUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> expectedCurrentStatus.equals(normalizeStatus(member.getStatus())))
                .map(member -> {
                    ActivityMember next = cloneMember(member);
                    next.setStatus(nextStatus);
                    next.setPendingSource(null);
                    next.setRequestKind(null);
                    next.setInvitedByUserId(null);
                    next.setActionAtIso(nowIso);
                    next.setUpdatedDate(nowIso);
                    next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, member));
                    return next;
                })
                .toList();
        if (changedRoomMembers.isEmpty()) {
            return;
        }
        LinkedHashSet<String> affectedRoomIds = changedRoomMembers.stream()
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        String memberName = memberDisplayName(changedRoomMembers.get(0));
        activityMembersRepository.saveAll(changedRoomMembers);
        refreshEmbeddedEventMembersBatch(affectedRoomIds);
        if (!StringUtils.hasText(memberName)) {
            return;
        }
        String actionText = ACTION_DISQUALIFY.equals(normalizedAction)
                ? "disqualified from"
                : "reinstated to";
        for (String roomId : affectedRoomIds) {
            chatService.postSystemMessage(
                    roomId,
                    memberName + " was " + actionText + " the tournament group.",
                    "member-" + normalizedAction);
        }
    }

    private boolean isInEventParticipationTree(ActivityMember member, String rootEventId) {
        String ownerType = normalizeOwnerType(member == null ? null : member.getOwnerType());
        String ownerId = normalizeId(member == null ? null : member.getOwnerId());
        String normalizedRootEventId = normalizeId(rootEventId);
        if (!PARTICIPATION_TREE_OWNER_TYPES.contains(ownerType)
                || !StringUtils.hasText(ownerId)
                || !StringUtils.hasText(normalizedRootEventId)) {
            return false;
        }
        return OWNER_TYPE_EVENT.equals(ownerType) && normalizedRootEventId.equals(ownerId)
                || ownerId.startsWith(normalizedRootEventId + ":");
    }

    private ActivityMember toSuppressedMember(
            ActivityMember member,
            String rootEventId,
            String actorUserId,
            String nowIso) {
        String currentStatus = normalizeStatus(member == null ? null : member.getStatus());
        if (member == null || !SUPPRESSIBLE_STATUSES.contains(currentStatus)) {
            return null;
        }
        ActivityMember next = cloneMember(member);
        next.setStatusBeforeSuppression(currentStatus);
        next.setStatus(STATUS_SUPPRESSED);
        next.setSuppressionRootOwnerId(normalizeId(rootEventId));
        next.setSuppressedAtIso(nowIso);
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, member));
        return next;
    }

    private ActivityMember toRestoredMember(
            ActivityMember member,
            String previousStatus,
            String actorUserId,
            String nowIso) {
        String restoredStatus = normalizeRestorableMembershipStatus(previousStatus);
        if (member == null || !StringUtils.hasText(restoredStatus)) {
            return null;
        }
        ActivityMember next = cloneMember(member);
        next.setStatus(restoredStatus);
        next.setStatusBeforeSuppression(null);
        next.setSuppressionRootOwnerId(null);
        next.setSuppressedAtIso(null);
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, member));
        return next;
    }

    private String normalizeRestorableMembershipStatus(String status) {
        String normalizedStatus = safeText(status);
        return SUPPRESSIBLE_STATUSES.contains(normalizedStatus) ? normalizedStatus : null;
    }

    private LinkedHashSet<String> eventSourceIds(Collection<ActivityMember> members) {
        return (members == null ? List.<ActivityMember>of() : members).stream()
                .filter(Objects::nonNull)
                .filter(member -> OWNER_TYPE_EVENT.equals(normalizeOwnerType(member.getOwnerType())))
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private LinkedHashSet<String> eventSourceIdsFromDocuments(Collection<ActivityEvent> documents) {
        return (documents == null ? List.<ActivityEvent>of() : documents).stream()
                .filter(Objects::nonNull)
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private void refreshSuppressedEventSources(Collection<String> eventSourceIds, String userId) {
        LinkedHashSet<String> normalizedEventSourceIds = new LinkedHashSet<>();
        for (String eventSourceId : eventSourceIds == null ? List.<String>of() : eventSourceIds) {
            String normalizedEventSourceId = normalizeId(eventSourceId);
            if (!StringUtils.hasText(normalizedEventSourceId)) {
                continue;
            }
            normalizedEventSourceIds.add(normalizedEventSourceId);
            eventParticipationTicketService.syncParticipationTicketForUser(
                    normalizedEventSourceId,
                    normalizeId(userId));
        }
        refreshEmbeddedEventMembersBatch(normalizedEventSourceIds);
    }

    private void refreshManagedChildParticipationProjections(Collection<ActivityMember> members) {
        LinkedHashSet<String> subEventOwnerIds = new LinkedHashSet<>();
        Map<String, SubEventCounterScope> groupCounterScopes = new LinkedHashMap<>();
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            String ownerType = normalizeOwnerType(member == null ? null : member.getOwnerType());
            String ownerId = normalizeId(member == null ? null : member.getOwnerId());
            if (!StringUtils.hasText(ownerId)) {
                continue;
            }
            if (OWNER_TYPE_SUB_EVENT.equals(ownerType)) {
                subEventOwnerIds.add(ownerId);
            } else if (OWNER_TYPE_GROUP.equals(ownerType)) {
                SubEventCounterScope scope = groupCounterScope(ownerId);
                if (scope != null) {
                    groupCounterScopes.put(scope.eventId() + ":" + scope.subEventId(), scope);
                }
            }
        }
        for (String subEventOwnerId : subEventOwnerIds) {
            SubEventCounterScope scope = subEventCounterScope(subEventOwnerId);
            if (scope != null) {
                refreshEmbeddedSubEventMembers(
                        scope.eventId(),
                        scope.subEventId(),
                        subEventOwnerId);
            }
        }
        for (SubEventCounterScope scope : groupCounterScopes.values()) {
            tournamentGroupCounterService.syncParent(scope.eventId(), scope.subEventId());
        }
    }

    private SubEventCounterScope groupCounterScope(String ownerId) {
        String normalizedOwnerId = normalizeId(ownerId);
        int mingleRoundMarker = normalizedOwnerId.indexOf(":mingle-round-");
        int mingleTableMarker = normalizedOwnerId.indexOf(":table:", mingleRoundMarker + 1);
        if (mingleRoundMarker > 0 && mingleTableMarker > mingleRoundMarker) {
            String eventId = normalizedOwnerId.substring(0, mingleRoundMarker);
            String subEventId = normalizedOwnerId.substring(mingleRoundMarker + 1, mingleTableMarker);
            return StringUtils.hasText(eventId) && StringUtils.hasText(subEventId)
                    ? new SubEventCounterScope(eventId, subEventId)
                    : null;
        }
        int groupMarker = normalizedOwnerId.indexOf(":group:");
        if (groupMarker <= 0) {
            return null;
        }
        String parentOwnerId = normalizedOwnerId.substring(0, groupMarker);
        int subEventSeparator = parentOwnerId.lastIndexOf(':');
        if (subEventSeparator <= 0 || subEventSeparator >= parentOwnerId.length() - 1) {
            return null;
        }
        String runtimeEventId = parentOwnerId.substring(0, subEventSeparator);
        String subEventId = parentOwnerId.substring(subEventSeparator + 1);
        return StringUtils.hasText(runtimeEventId) && StringUtils.hasText(subEventId)
                ? new SubEventCounterScope(runtimeEventId, subEventId)
                : null;
    }

    private List<ActivityEvent> upsertTrashedParticipationOverlays(
            Collection<String> eventSourceIds,
            String userId,
            String actorUserId,
            String nowIso) {
        Map<String, List<ActivityEvent>> documentsBySourceId =
                loadEventDocumentsBySourceId(eventSourceIds);
        List<ActivityEvent> overlaysToSave = new ArrayList<>();
        for (Map.Entry<String, List<ActivityEvent>> entry : documentsBySourceId.entrySet()) {
            ActivityEvent existingOverlay = preferredEventRecord(entry.getValue().stream()
                    .filter(document -> normalizeId(userId).equals(normalizeId(document.getOwnerUserId())))
                    .toList());
            ActivityEvent base = existingOverlay == null
                    ? preferredEventRecord(entry.getValue())
                    : existingOverlay;
            if (base == null) {
                continue;
            }
            ActivityEvent overlay = cloneEventDocument(base);
            if (existingOverlay == null) {
                overlay.setId(new ObjectId().toHexString());
                overlay.setSyncKey(UUID.randomUUID().toString());
            }
            overlay.setSourceId(entry.getKey());
            overlay.setOwnerUserId(normalizeId(userId));
            String currentStatus = safeText(overlay.getStatus());
            if (!ActivityEvent.STATUS_TRASHED.equals(currentStatus)) {
                overlay.setStatusBeforeSuppression(currentStatus);
            }
            overlay.setStatus(ActivityEvent.STATUS_TRASHED);
            overlay.setTrashedAtIso(nowIso);
            overlay.setUpdatedDate(nowIso);
            overlay.setUpdatedUser(normalizeId(actorUserId));
            overlaysToSave.add(overlay);
        }
        return overlaysToSave.isEmpty()
                ? List.of()
                : activityEventsRepository.saveAll(overlaysToSave);
    }

    private List<ActivityEvent> restoreTrashedParticipationOverlays(
            Map<String, List<ActivityEvent>> documentsBySourceId,
            String userId,
            String actorUserId,
            String nowIso,
            boolean allowMissingStatusBeforeSuppression) {
        List<ActivityEvent> overlaysToSave = new ArrayList<>();
        for (List<ActivityEvent> documents :
                documentsBySourceId == null ? List.<List<ActivityEvent>>of() : documentsBySourceId.values()) {
            ActivityEvent canonical = preferredCanonicalEventRecord(documents);
            if (canonical == null || ActivityEvent.STATUS_TRASHED.equals(safeText(canonical.getStatus()))) {
                continue;
            }
            for (ActivityEvent document : documents == null ? List.<ActivityEvent>of() : documents) {
                if (document == null
                        || !normalizeId(userId).equals(normalizeId(document.getOwnerUserId()))
                        || !ActivityEvent.STATUS_TRASHED.equals(safeText(document.getStatus()))
                        || (!allowMissingStatusBeforeSuppression
                                && !StringUtils.hasText(safeText(document.getStatusBeforeSuppression())))) {
                    continue;
                }
                ActivityEvent overlay = cloneEventDocument(document);
                String restoredStatus = safeText(overlay.getStatusBeforeSuppression());
                if (!StringUtils.hasText(restoredStatus) || isSuppressedEventLifecycleStatus(restoredStatus)) {
                    restoredStatus = ActivityEvent.STATUS_ACTIVE;
                }
                overlay.setStatus(restoredStatus);
                overlay.setStatusBeforeSuppression(null);
                overlay.setTrashedAtIso(null);
                overlay.setUpdatedDate(nowIso);
                overlay.setUpdatedUser(normalizeId(actorUserId));
                overlaysToSave.add(overlay);
            }
        }
        return overlaysToSave.isEmpty()
                ? List.of()
                : activityEventsRepository.saveAll(overlaysToSave);
    }

    private boolean isSafeLegacySelfDeletedRoot(
            ActivityMember rootMembership,
            String rootEventId,
            String userId,
            List<ActivityEvent> rootEventDocuments) {
        if (rootMembership == null
                || !STATUS_DELETED.equals(normalizeStatus(rootMembership.getStatus()))
                || StringUtils.hasText(normalizeId(rootMembership.getSuppressionRootOwnerId()))
                || !normalizeId(userId).equals(normalizeId(rootMembership.getUpdatedUser()))
                || !normalizeId(rootEventId).equals(normalizeId(rootMembership.getOwnerId()))) {
            return false;
        }
        return (rootEventDocuments == null ? List.<ActivityEvent>of() : rootEventDocuments).stream()
                .filter(Objects::nonNull)
                .anyMatch(document -> normalizeId(userId).equals(normalizeId(document.getOwnerUserId()))
                        && ActivityEvent.STATUS_TRASHED.equals(safeText(document.getStatus())));
    }

    private boolean isSafeLegacyInvitationTrashOverlay(
            ActivityMember rootMembership,
            String rootEventId,
            String userId,
            List<ActivityEvent> rootEventDocuments) {
        String membershipStatus = normalizeStatus(rootMembership == null ? null : rootMembership.getStatus());
        boolean activeInvitation = STATUS_INVITED.equals(membershipStatus)
                || (STATUS_PENDING.equals(membershipStatus) && isInvitationMembership(rootMembership));
        if (rootMembership == null
                || !activeInvitation
                || !normalizeId(userId).equals(normalizeId(rootMembership.getUserId()))
                || !normalizeId(rootEventId).equals(normalizeId(rootMembership.getOwnerId()))) {
            return false;
        }
        return (rootEventDocuments == null ? List.<ActivityEvent>of() : rootEventDocuments).stream()
                .filter(Objects::nonNull)
                .anyMatch(document -> normalizeId(userId).equals(normalizeId(document.getOwnerUserId()))
                        && ActivityEvent.STATUS_TRASHED.equals(safeText(document.getStatus())));
    }

    private Map<String, List<ActivityEvent>> loadEventDocumentsBySourceId(Collection<String> sourceIds) {
        LinkedHashSet<String> normalizedSourceIds = sourceIds == null
                ? new LinkedHashSet<>()
                : sourceIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (normalizedSourceIds.isEmpty()) {
            return Map.of();
        }
        Map<String, List<ActivityEvent>> documentsBySourceId = new LinkedHashMap<>();
        List<ActivityEvent> documents = activityEventsRepository.findBySourceIdIn(normalizedSourceIds);
        for (ActivityEvent document : documents == null ? List.<ActivityEvent>of() : documents) {
            String sourceId = normalizeId(document == null ? null : document.getSourceId());
            if (StringUtils.hasText(sourceId) && normalizedSourceIds.contains(sourceId)) {
                documentsBySourceId.computeIfAbsent(sourceId, ignored -> new ArrayList<>()).add(document);
            }
        }
        return documentsBySourceId;
    }

    private ActivityEvent preferredEventRecord(Collection<ActivityEvent> documents) {
        ActivityEvent preferred = null;
        for (ActivityEvent document : documents == null ? List.<ActivityEvent>of() : documents) {
            if (document != null && (preferred == null || preferEventRecord(document, preferred))) {
                preferred = document;
            }
        }
        return preferred;
    }

    private ActivityEvent preferredCanonicalEventRecord(Collection<ActivityEvent> documents) {
        return preferredEventRecord((documents == null ? List.<ActivityEvent>of() : documents).stream()
                .filter(Objects::nonNull)
                .filter(document -> StringUtils.hasText(normalizeId(document.getOwnerUserId()))
                        && Objects.equals(
                                normalizeId(document.getOwnerUserId()),
                                normalizeId(document.getCreatorUserId())))
                .toList());
    }

    private ActivityEvent cloneEventDocument(ActivityEvent source) {
        ActivityEvent clone = new ActivityEvent();
        BeanUtils.copyProperties(source, clone);
        return clone;
    }

    private boolean isSuppressedEventLifecycleStatus(String status) {
        String normalizedStatus = safeText(status);
        return ActivityEvent.STATUS_TRASHED.equals(normalizedStatus)
                || ActivityEvent.STATUS_UNDER_REVIEW.equals(normalizedStatus)
                || ActivityEvent.STATUS_BLOCKED.equals(normalizedStatus)
                || ActivityEvent.STATUS_DELETED.equals(normalizedStatus)
                || ActivityEvent.STATUS_INACTIVE.equals(normalizedStatus);
    }

    private Object eventJoinLock(String eventId) {
        return eventJoinLocks.computeIfAbsent(eventId, ignored -> new Object());
    }

    public boolean isTournamentAdmissionLocked(ActivityEvent eventRecord) {
        if (eventRecord == null || eventRecord.getSubEvents() == null) {
            return false;
        }
        SubEventItem firstTournamentStage = eventRecord.getSubEvents().stream()
                .filter(Objects::nonNull)
                .filter(this::isTournamentStage)
                .findFirst()
                .orElse(null);
        if (firstTournamentStage == null) {
            return false;
        }
        String status = safeText(firstTournamentStage.stageStatus()).toUpperCase(Locale.US);
        return STAGE_STATUS_ACTIVE.equals(status)
                || STAGE_STATUS_SCORE_REVIEW.equals(status)
                || STAGE_STATUS_FINALIZED.equals(status)
                || STAGE_STATUS_SUSPENDED.equals(status);
    }

    private boolean isTournamentStage(SubEventItem stage) {
        return stage != null
                && !Boolean.TRUE.equals(stage.optional())
                && ((stage.tournamentGroupCapacityMin() != null && stage.tournamentGroupCapacityMin() > 0)
                    || (stage.tournamentGroupCapacityMax() != null && stage.tournamentGroupCapacityMax() > 0)
                    || "Score".equalsIgnoreCase(safeText(stage.tournamentLeaderboardType()))
                    || "Fifa".equalsIgnoreCase(safeText(stage.tournamentLeaderboardType())));
    }

    private boolean isCapacityFullForJoin(ActivityEvent eventRecord, List<ActivityMember> existing, String joiningUserId) {
        int capacityTotal = Math.max(0, eventRecord == null || eventRecord.getCapacityTotal() == null ? 0 : eventRecord.getCapacityTotal());
        if (capacityTotal <= 0) {
            return false;
        }
        long occupiedCapacity = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> !joiningUserId.equals(normalizeId(member.getUserId())))
                .filter(this::occupiesEventCapacity)
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .count();
        return occupiedCapacity >= capacityTotal;
    }

    private boolean exceedsEventCapacity(
            ActivityEvent eventRecord,
            Collection<ActivityMember> members) {
        int capacityTotal = Math.max(
                0,
                eventRecord == null || eventRecord.getCapacityTotal() == null
                        ? 0
                        : eventRecord.getCapacityTotal());
        if (capacityTotal <= 0) {
            return false;
        }
        long occupiedCapacity =
                (members == null ? List.<ActivityMember>of() : members).stream()
                        .filter(Objects::nonNull)
                        .filter(this::occupiesEventCapacity)
                        .map(ActivityMember::getUserId)
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .count();
        return occupiedCapacity > capacityTotal;
    }

    private boolean occupiesEventCapacity(ActivityMember member) {
        if (Boolean.TRUE.equals(member == null ? null : member.getOrganizerOnly())) {
            return false;
        }
        String status = normalizeStatus(member == null ? null : member.getStatus());
        return ACCEPTED_STATUSES.contains(status)
                || STATUS_INVITED.equals(status)
                || (STATUS_PENDING.equals(status) && isInvitationMembership(member));
    }

    private String pendingJoinRequestKind(boolean waitingList, boolean approvalRequested) {
        if (waitingList) {
            return REQUEST_KIND_WAITLIST;
        }
        if (approvalRequested) {
            return REQUEST_KIND_APPROVAL;
        }
        return REQUEST_KIND_JOIN;
    }

    public ActivityMembersInviteResponseDto inviteEventMembers(ActivityMembersInviteRequestDto request) {
        String ownerType = normalizeOwnerType(request == null || request.owner() == null
                ? null
                : request.owner().ownerType());
        String eventId = normalizeId(request == null || request.owner() == null
                ? null
                : request.owner().ownerId());
        String actorUserId = resolveActorUserId(request == null ? null : request.actorUserId());
        if (!OWNER_TYPE_EVENT.equals(ownerType) || !StringUtils.hasText(eventId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event owner is required.");
        }
        if (!StringUtils.hasText(actorUserId)
                || !accessControlService.canInviteEventMembers(eventId, actorUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Authenticated user is not allowed to invite members to this event.");
        }

        ActivityEvent eventRecord = findPreferredEventRecord(eventId);
        EventInvitePersistenceResult result = persistEventInvites(
                eventId,
                actorUserId,
                request == null ? List.of() : request.userIds(),
                eventRecord);
        eventInviteNotificationService.notifyInvitees(
                eventRecord,
                result.invitedUserIds(),
                actorUserId);
        return new ActivityMembersInviteResponseDto(
                queryMembers(OWNER_TYPE_EVENT, eventId, false, null, null),
                result.invitedUserIds(),
                result.rejections());
    }

    public List<String> inviteUsers(String eventId, String inviterUserId, List<String> invitedUserIds, ActivityEvent eventRecord) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return List.of();
        }

        String actorUserId = resolveActorUserId(
                StringUtils.hasText(inviterUserId)
                        ? inviterUserId
                        : eventRecord == null ? null : eventRecord.getCreatorUserId());
        if (!accessControlService.canInviteEventMembers(normalizedEventId, actorUserId)) {
            return List.of();
        }
        return persistEventInvites(
                normalizedEventId,
                actorUserId,
                invitedUserIds,
                eventRecord == null ? findPreferredEventRecord(normalizedEventId) : eventRecord)
                .invitedUserIds();
    }

    private EventInvitePersistenceResult persistEventInvites(
            String eventId,
            String actorUserId,
            List<String> invitedUserIds,
            ActivityEvent eventRecord) {
        synchronized (eventJoinLock(eventId)) {
            return persistEventInvitesLocked(
                    eventId,
                    actorUserId,
                    invitedUserIds,
                    eventRecord);
        }
    }

    private EventInvitePersistenceResult persistEventInvitesLocked(
            String eventId,
            String actorUserId,
            List<String> invitedUserIds,
            ActivityEvent eventRecord) {
        String nowIso = Instant.now().toString();
        String metWhere = safeText(eventRecord == null ? null : eventRecord.getLocation());
        boolean organizerInvitation = canManageOwnerMembers(OWNER_TYPE_EVENT, eventId, actorUserId);

        List<ActivityMember> existing = loadOwnerDocuments(OWNER_TYPE_EVENT, eventId);
        Map<String, ActivityMember> existingByUserId = new LinkedHashMap<>();
        for (ActivityMember member : existing) {
            if (member != null && StringUtils.hasText(normalizeId(member.getUserId()))) {
                existingByUserId.put(normalizeId(member.getUserId()), member);
            }
        }

        List<ActivityMember> membersToSave = new ArrayList<>();
        List<String> newlyInvitedUserIds = new ArrayList<>();
        List<ActivityMemberInviteRejectionDto> rejections = new ArrayList<>();
        for (String userId : normalizeUserIds(invitedUserIds)) {
            ActivityMember current = existingByUserId.get(userId);
            if (current != null && !STATUS_DELETED.equals(normalizeStatus(current.getStatus()))) {
                rejections.add(new ActivityMemberInviteRejectionDto(userId, "already-member"));
                continue;
            }
            List<ActivityMember> occupancy = new ArrayList<>(existing);
            occupancy.addAll(membersToSave);
            if (isCapacityFullForJoin(eventRecord, occupancy, userId)) {
                rejections.add(new ActivityMemberInviteRejectionDto(userId, "capacity-full"));
                continue;
            }

            ActivityMember next = current == null ? new ActivityMember() : cloneMember(current);
            next.setId(current == null ? new ObjectId().toHexString() : current.getId());
            next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey())
                    ? current.getSyncKey().trim()
                    : UUID.randomUUID().toString());
            next.setOwnerType(OWNER_TYPE_EVENT);
            next.setOwnerId(eventId);
            next.setUserId(userId);
            next.setRole(normalizeRole(current == null ? null : current.getRole(), userId, OWNER_TYPE_EVENT, eventId));
            next.setStatus(STATUS_PENDING);
            next.setPendingSource("admin");
            next.setRequestKind("invite");
            next.setInvitedByUserId(StringUtils.hasText(actorUserId) ? actorUserId : null);
            EventVipInvitation.issue(next, organizerInvitation,
                    eventRecord == null ? null : eventRecord.getPricing(), nowIso);
            next.setActionAtIso(nowIso);
            next.setMetAtIso(current == null ? nowIso : normalizeDateTime(current.getMetAtIso(), nowIso));
            next.setMetWhere(StringUtils.hasText(safeText(next.getMetWhere())) ? safeText(next.getMetWhere()) : metWhere);
            next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
            next.setCreatedUser(current == null ? resolveCreatedUser(next, actorUserId) : safeText(current.getCreatedUser()));
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, current));
            membersToSave.add(next);
            newlyInvitedUserIds.add(userId);
        }

        if (!membersToSave.isEmpty()) {
            activityMembersRepository.saveAll(membersToSave);
            adminTelemetryService.record("event.member.invited", "events", eventId, actorUserId, membersToSave.size());
            refreshEmbeddedEventMembers(eventId, false);
            userActivityCountersService.refreshEventCountersForUsers(newlyInvitedUserIds);
        }
        return new EventInvitePersistenceResult(
                List.copyOf(newlyInvitedUserIds),
                List.copyOf(rejections));
    }

    private record EventInvitePersistenceResult(
            List<String> invitedUserIds,
            List<ActivityMemberInviteRejectionDto> rejections) {
    }

    public int sweepEventWaitlists() {
        LinkedHashSet<String> eventIds = new LinkedHashSet<>();
        activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(OWNER_TYPE_EVENT, STATUS_PENDING, REQUEST_KIND_WAITLIST).stream()
                .filter(Objects::nonNull)
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(eventIds::add);
        activityMembersRepository.findByOwnerTypeAndStatusAndRequestKind(OWNER_TYPE_EVENT, STATUS_PENDING, REQUEST_KIND_WAITLIST_INVITE).stream()
                .filter(Objects::nonNull)
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(eventIds::add);

        int invitedCount = 0;
        for (String eventId : eventIds) {
            invitedCount += processEventWaitlist(eventId, findPreferredEventRecord(eventId), false);
        }
        return invitedCount;
    }

    public List<String> syncGroupMembers(String groupId, String actorUserId, List<String> memberUserIds) {
        return syncAcceptedOwnerMembers(OWNER_TYPE_GROUP, groupId, actorUserId, memberUserIds);
    }

    public List<String> syncSystemEventMembers(String eventId, String actorUserId, List<String> memberUserIds) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return List.of();
        }
        List<ActivityMember> existingMembers = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId);
        List<String> syncedUserIds = syncAcceptedOwnerMembers(
                OWNER_TYPE_EVENT,
                normalizedEventId,
                actorUserId,
                memberUserIds,
                existingMembers);
        if (!StringUtils.hasText(normalizedEventId)) {
            return syncedUserIds;
        }
        refreshEmbeddedEventMembers(normalizedEventId, false);
        LinkedHashSet<String> affectedUserIds = new LinkedHashSet<>(normalizeUserIds(memberUserIds));
        existingMembers.stream()
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(affectedUserIds::add);
        userActivityCountersService.refreshEventCountersForUsers(new ArrayList<>(affectedUserIds));
        return syncedUserIds;
    }

    public List<String> syncMaterializedSystemEventMembers(
            ActivityEvent materializedEvent,
            String actorUserId,
            List<String> memberUserIds) {
        String eventId = normalizeId(materializedEvent == null ? null : materializedEvent.getSourceId());
        return syncMaterializedSystemEventMembers(
                materializedEvent,
                actorUserId,
                memberUserIds,
                StringUtils.hasText(eventId)
                        ? loadOwnerDocuments(OWNER_TYPE_EVENT, eventId)
                        : List.of());
    }

    public List<String> syncMaterializedSystemEventMembers(
            ActivityEvent materializedEvent,
            String actorUserId,
            List<String> memberUserIds,
            List<ActivityMember> existingMembers) {
        String eventId = normalizeId(materializedEvent == null ? null : materializedEvent.getSourceId());
        if (!StringUtils.hasText(eventId)) {
            return List.of();
        }
        List<ActivityMember> normalizedExistingMembers = existingMembers == null
                ? List.of()
                : existingMembers.stream().filter(Objects::nonNull).toList();
        LinkedHashSet<String> previousAcceptedUserIds = normalizedExistingMembers.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        List<String> syncedUserIds = syncAcceptedOwnerMembers(
                OWNER_TYPE_EVENT,
                eventId,
                actorUserId,
                memberUserIds,
                normalizedExistingMembers);
        List<String> normalizedSyncedUserIds = normalizeUserIds(syncedUserIds);
        materializedEvent.setAcceptedMembers(normalizedSyncedUserIds.size());
        materializedEvent.setPendingMembers(0);
        materializedEvent.setAcceptedMemberUserIds(normalizedSyncedUserIds);
        materializedEvent.setPendingMemberUserIds(List.of());
        materializedEvent.setInvitedMemberUserIds(List.of());
        materializedEvent.setPendingRequestMemberUserIds(List.of());
        materializedEvent.setAdmins(List.of());
        materializedEvent.setCapacityTotal(Math.max(
                normalizedSyncedUserIds.size(),
                materializedEvent.getCapacityTotal() == null ? 0 : materializedEvent.getCapacityTotal()));
        materializedEvent.setFull(resolveDirectEventFull(materializedEvent));
        activityEventsRepository.save(materializedEvent);
        LinkedHashSet<String> addedUserIds = new LinkedHashSet<>(normalizedSyncedUserIds);
        addedUserIds.removeAll(previousAcceptedUserIds);
        previousAcceptedUserIds.removeAll(new LinkedHashSet<>(normalizedSyncedUserIds));
        if (!StringUtils.hasText(normalizeId(materializedEvent.getParentEventId()))) {
            userActivityCountersService.applyActiveEventMembershipDeltas(
                    addedUserIds,
                    previousAcceptedUserIds);
        }
        return normalizedSyncedUserIds;
    }

    private List<String> syncAcceptedOwnerMembers(
            String ownerType,
            String ownerId,
            String actorUserId,
            List<String> memberUserIds) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }
        return syncAcceptedOwnerMembers(
                normalizedOwnerType,
                normalizedOwnerId,
                actorUserId,
                memberUserIds,
                loadOwnerDocuments(normalizedOwnerType, normalizedOwnerId));
    }

    private List<String> syncAcceptedOwnerMembers(
            String ownerType,
            String ownerId,
            String actorUserId,
            List<String> memberUserIds,
            List<ActivityMember> existingMembers) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }

        String normalizedActorUserId = resolveActorUserId(actorUserId);
        String nowIso = Instant.now().toString();
        List<ActivityMember> existing = existingMembers == null
                ? List.of()
                : existingMembers.stream().filter(Objects::nonNull).toList();
        Map<String, ActivityMember> existingByUserId = new LinkedHashMap<>();
        for (ActivityMember member : existing) {
            if (member != null && StringUtils.hasText(normalizeId(member.getUserId()))) {
                existingByUserId.put(normalizeId(member.getUserId()), member);
            }
        }

        List<ActivityMember> membersToSave = new ArrayList<>();
        List<String> syncedUserIds = new ArrayList<>();
        Set<String> retainedUserIds = new LinkedHashSet<>();
        for (String userId : normalizeUserIds(memberUserIds)) {
            retainedUserIds.add(userId);

            ActivityMember current = existingByUserId.get(userId);
            if (current != null && STATUS_SUPPRESSED.equals(normalizeStatus(current.getStatus()))) {
                continue;
            }
            ActivityMember next = current == null ? new ActivityMember() : cloneMember(current);
            next.setId(current == null ? new ObjectId().toHexString() : current.getId());
            next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey())
                    ? current.getSyncKey().trim()
                    : UUID.randomUUID().toString());
            next.setOwnerType(normalizedOwnerType);
            next.setOwnerId(normalizedOwnerId);
            next.setUserId(userId);
            next.setRole(normalizeRole(
                    current == null ? null : current.getRole(),
                    userId,
                    normalizedOwnerType,
                    normalizedOwnerId));
            next.setStatus(STATUS_ACCEPTED);
            next.setPendingSource(null);
            next.setRequestKind(null);
            next.setInvitedByUserId(null);
            next.setActionAtIso(nowIso);
            next.setMetAtIso(current == null ? nowIso : normalizeDateTime(current.getMetAtIso(), nowIso));
            next.setMetWhere(safeText(current == null ? null : current.getMetWhere()));
            next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
            next.setCreatedUser(current == null ? resolveCreatedUser(next, normalizedActorUserId) : safeText(current.getCreatedUser()));
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveUpdatedUser(normalizedActorUserId, next, current));
            membersToSave.add(next);
            syncedUserIds.add(userId);
        }

        for (ActivityMember member : existing) {
            String userId = normalizeId(member == null ? null : member.getUserId());
            if (!StringUtils.hasText(userId)
                    || retainedUserIds.contains(userId)
                    || isHiddenMembershipStatus(member == null ? null : member.getStatus())) {
                continue;
            }
            ActivityMember deletedMember = toDeletedMember(member, normalizedActorUserId, nowIso);
            if (deletedMember != null) {
                membersToSave.add(deletedMember);
            }
        }

        if (!membersToSave.isEmpty()) {
            activityMembersRepository.saveAll(membersToSave);
        }
        return syncedUserIds;
    }

    public boolean hasStoredOwnerMembers(String ownerType, String ownerId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return false;
        }
        return activityMembersRepository.findByOwnerTypeAndOwnerId(
                        normalizedOwnerType,
                        normalizedOwnerId)
                .stream()
                .anyMatch(Objects::nonNull);
    }

    private List<ActivityMember> loadOwnerDocuments(String ownerType, String ownerId) {
        return activityMembersRepository.findByOwnerTypeAndOwnerId(ownerType, ownerId).stream()
                .filter(Objects::nonNull)
                .toList();
    }

    private List<ActivityMember> loadOwnerDocuments(String ownerType, String ownerId, String status) {
        if (!StringUtils.hasText(status)) {
            return loadOwnerDocuments(ownerType, ownerId);
        }
        return activityMembersRepository.findByOwnerTypeAndOwnerIdAndStatus(ownerType, ownerId, status).stream()
                .filter(Objects::nonNull)
                .toList();
    }

    private ActivityMember findEventMember(String eventId, String userId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedUserId)) {
            return null;
        }
        return activityMembersRepository
                .findByOwnerTypeAndOwnerIdAndUserId(OWNER_TYPE_EVENT, normalizedEventId, normalizedUserId)
                .orElse(null);
    }

    private void validateEventMemberReplacement(
            String eventId,
            String actorUserId,
            List<ActivityMemberEntryDto> requestedMembers,
            Map<String, ActivityMember> existingByUserId) {
        ActivityEvent event = findPreferredEventRecord(eventId);
        String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
        String normalizedActorUserId = normalizeId(actorUserId);
        boolean actorIsOwner = StringUtils.hasText(creatorUserId) && creatorUserId.equals(normalizedActorUserId);
        boolean actorIsAdmin = isEventAdminUser(eventId, normalizedActorUserId);

        Map<String, ActivityMemberEntryDto> requestedByUserId = new LinkedHashMap<>();
        for (ActivityMemberEntryDto entry : safeMembers(requestedMembers)) {
            String userId = normalizeId(entry == null ? null : entry.userId());
            if (StringUtils.hasText(userId)) {
                requestedByUserId.put(userId, entry);
            }
        }

        for (Map.Entry<String, ActivityMember> existingEntry : existingByUserId.entrySet()) {
            String targetUserId = existingEntry.getKey();
            ActivityMember current = existingEntry.getValue();
            ActivityMemberEntryDto requested = requestedByUserId.get(targetUserId);
            if (current == null) {
                continue;
            }
            if (isInvitationMembership(current)
                    && requested != null
                    && STATUS_ACCEPTED.equals(normalizeStatus(requested.status()))) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "An invitation must be accepted by the invited member before admin approval.");
            }
            if (isInvitationMembership(current)
                    && requested == null
                    && !normalizedActorUserId.equals(targetUserId)
                    && !normalizedActorUserId.equals(normalizeId(current.getInvitedByUserId()))) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Only the inviter may cancel this invitation, or the invitee may reject it.");
            }
            boolean currentAdmin = STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                    && "Admin".equals(resolveStoredRole(current, OWNER_TYPE_EVENT, eventId));
            if (!currentAdmin || targetUserId.equals(creatorUserId)) {
                continue;
            }
            boolean removed = requested == null;
            boolean steppedDown = requested != null && !"Admin".equals(safeText(requested.role()));
            if (removed && !actorIsOwner) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Only the event owner may remove an admin.");
            }
            if (steppedDown && !actorIsOwner && !targetUserId.equals(normalizedActorUserId)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "An admin may only step down themselves unless the event owner changes the role.");
            }
        }

        for (Map.Entry<String, ActivityMemberEntryDto> requestedEntry : requestedByUserId.entrySet()) {
            String targetUserId = requestedEntry.getKey();
            ActivityMember current = existingByUserId.get(targetUserId);
            boolean currentAdmin = current != null
                    && STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                    && "Admin".equals(resolveStoredRole(current, OWNER_TYPE_EVENT, eventId));
            boolean requestedAdmin = "Admin".equals(safeText(requestedEntry.getValue().role()));
            if (requestedAdmin && !currentAdmin && !actorIsAdmin) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Only an event admin may promote another member to admin.");
            }
        }
    }

    private boolean isAcceptedMemberInvitationOnlyReplacement(
            String eventId,
            String actorUserId,
            List<ActivityMemberEntryDto> requestedMembers,
            Map<String, ActivityMember> existingByUserId) {
        String normalizedActorUserId = normalizeId(actorUserId);
        ActivityMember actor = existingByUserId == null
                ? null
                : existingByUserId.get(normalizedActorUserId);
        if (actor == null || !STATUS_ACCEPTED.equals(normalizeStatus(actor.getStatus()))) {
            return false;
        }

        Map<String, ActivityMemberEntryDto> requestedByUserId = new LinkedHashMap<>();
        for (ActivityMemberEntryDto entry : safeMembers(requestedMembers)) {
            String userId = normalizeId(entry == null ? null : entry.userId());
            if (StringUtils.hasText(userId)) {
                requestedByUserId.put(userId, entry);
            }
        }

        for (Map.Entry<String, ActivityMember> existingEntry :
                (existingByUserId == null ? Map.<String, ActivityMember>of() : existingByUserId).entrySet()) {
            ActivityMember current = existingEntry.getValue();
            if (current == null || STATUS_DELETED.equals(normalizeStatus(current.getStatus()))) {
                continue;
            }
            ActivityMemberEntryDto requested = requestedByUserId.get(existingEntry.getKey());
            if (requested == null
                    || !normalizeStatus(current.getStatus()).equals(normalizeStatus(requested.status()))
                    || !resolveStoredRole(current, OWNER_TYPE_EVENT, eventId).equals(safeText(requested.role()))
                    || !safeText(current.getPendingSource()).equals(safeText(requested.pendingSource()))
                    || !safeText(current.getRequestKind()).equals(safeText(requested.requestKind()))
                    || !normalizeId(current.getInvitedByUserId()).equals(normalizeId(requested.invitedByUserId()))) {
                return false;
            }
        }

        boolean invitationAdded = false;
        for (Map.Entry<String, ActivityMemberEntryDto> requestedEntry : requestedByUserId.entrySet()) {
            ActivityMember current = existingByUserId == null
                    ? null
                    : existingByUserId.get(requestedEntry.getKey());
            if (current != null && !STATUS_DELETED.equals(normalizeStatus(current.getStatus()))) {
                continue;
            }
            ActivityMemberEntryDto requested = requestedEntry.getValue();
            String status = normalizeStatus(requested == null ? null : requested.status());
            String pendingSource = resolvePendingSource(
                    requested == null ? null : requested.pendingSource(),
                    status);
            String requestKind = resolveRequestKind(
                    requested == null ? null : requested.requestKind(),
                    status,
                    pendingSource);
            String requestedRole = safeText(requested == null ? null : requested.role());
            String requestedInviterUserId = normalizeId(
                    requested == null ? null : requested.invitedByUserId());
            boolean isInvitation = STATUS_PENDING.equals(status)
                    && "admin".equals(pendingSource)
                    && (REQUEST_KIND_INVITE.equals(requestKind)
                        || REQUEST_KIND_WAITLIST_INVITE.equals(requestKind))
                    && !MANAGER_ROLES.contains(requestedRole)
                    && (!StringUtils.hasText(requestedInviterUserId)
                        || normalizedActorUserId.equals(requestedInviterUserId));
            if (!isInvitation) {
                return false;
            }
            invitationAdded = true;
        }
        return invitationAdded;
    }

    private void validateManagedOwnerMemberReplacement(
            String ownerType,
            String ownerId,
            String actorUserId,
            String eventId,
            List<ActivityMemberEntryDto> requestedMembers,
            Map<String, ActivityMember> existingByUserId) {
        String normalizedActorUserId = normalizeId(actorUserId);
        boolean actorCanManage = canManageOwnerMembers(
                ownerType,
                ownerId,
                normalizedActorUserId,
                eventId);
        boolean actorIsAcceptedMember = existingByUserId != null
                && existingByUserId.values().stream()
                    .filter(Objects::nonNull)
                    .anyMatch(member -> normalizedActorUserId.equals(normalizeId(member.getUserId()))
                            && STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())));
        Map<String, ActivityMemberEntryDto> requestedByUserId = new LinkedHashMap<>();
        for (ActivityMemberEntryDto entry : safeMembers(requestedMembers)) {
            String userId = normalizeId(entry == null ? null : entry.userId());
            if (StringUtils.hasText(userId)) {
                requestedByUserId.put(userId, entry);
            }
        }
        for (Map.Entry<String, ActivityMember> existingEntry :
                (existingByUserId == null ? Map.<String, ActivityMember>of() : existingByUserId).entrySet()) {
            String targetUserId = existingEntry.getKey();
            ActivityMember current = existingEntry.getValue();
            if (current == null || STATUS_DELETED.equals(normalizeStatus(current.getStatus()))) {
                continue;
            }
            ActivityMemberEntryDto requested = requestedByUserId.get(targetUserId);
            boolean initialInvitation = STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                    && isInvitationMembership(current);
            if (initialInvitation) {
                if (requested == null) {
                    boolean inviterCancelling = normalizedActorUserId.equals(normalizeId(current.getInvitedByUserId()));
                    boolean inviteeRejecting = normalizedActorUserId.equals(targetUserId);
                    if (!inviterCancelling && !inviteeRejecting) {
                        throw new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "Only the inviter may cancel this invitation, or the invitee may reject it.");
                    }
                    continue;
                }
                boolean invitationChanged = !STATUS_PENDING.equals(normalizeStatus(requested.status()))
                        || !safeText(current.getRequestKind()).equals(safeText(requested.requestKind()))
                        || !safeText(current.getPendingSource()).equals(safeText(requested.pendingSource()));
                if (invitationChanged) {
                    throw new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "Invitation responses must use the managed member action.");
                }
                continue;
            }

            boolean removed = requested == null;
            boolean protectedManager = STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                    && MANAGER_ROLES.contains(resolveStoredRole(current, ownerType, ownerId));
            boolean protectedManagerChanged = protectedManager && (
                    removed
                    || !STATUS_ACCEPTED.equals(normalizeStatus(requested.status()))
                    || !resolveStoredRole(current, ownerType, ownerId).equals(safeText(requested.role())));
            if (protectedManagerChanged) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "An admin or manager must use a managed step-down or ownership-transfer action.");
            }
            if (removed && !actorCanManage && !normalizedActorUserId.equals(targetUserId)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Only a manager may remove another member or pending request.");
            }
            if (removed) {
                continue;
            }

            boolean statusChanged = !normalizeStatus(current.getStatus()).equals(normalizeStatus(requested.status()));
            boolean roleChanged = requested != null
                    && !resolveStoredRole(current, ownerType, ownerId).equals(safeText(requested.role()));
            if ((statusChanged || roleChanged) && !actorCanManage) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Only a manager may change another member's status or role.");
            }
        }

        for (Map.Entry<String, ActivityMemberEntryDto> requestedEntry : requestedByUserId.entrySet()) {
            if (existingByUserId != null && existingByUserId.containsKey(requestedEntry.getKey())) {
                continue;
            }
            ActivityMemberEntryDto entry = requestedEntry.getValue();
            String status = normalizeStatus(entry == null ? null : entry.status());
            String pendingSource = resolvePendingSource(entry == null ? null : entry.pendingSource(), status);
            String requestKind = resolveRequestKind(
                    entry == null ? null : entry.requestKind(),
                    status,
                    pendingSource);
            boolean newInvitation = STATUS_PENDING.equals(status)
                    && (REQUEST_KIND_INVITE.equals(requestKind)
                        || REQUEST_KIND_WAITLIST_INVITE.equals(requestKind));
            if (newInvitation && (actorCanManage || actorIsAcceptedMember)) {
                continue;
            }
            if (!newInvitation && actorCanManage) {
                continue;
            }
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only an accepted member may invite someone, and only a manager may add an accepted member.");
        }
    }

    private Set<String> resolveEventAdminUserIds(ActivityEvent eventRecord) {
        LinkedHashSet<String> adminUserIds = new LinkedHashSet<>();
        String creatorUserId = eventRecord == null ? null : normalizeId(eventRecord.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId)) {
            adminUserIds.add(creatorUserId);
        }
        if (eventRecord != null && eventRecord.getAdmins() != null) {
            for (String adminUserId : eventRecord.getAdmins()) {
                String normalizedAdminUserId = normalizeId(adminUserId);
                if (StringUtils.hasText(normalizedAdminUserId)) {
                    adminUserIds.add(normalizedAdminUserId);
                }
            }
        }
        return adminUserIds;
    }

    private Map<String, String> resolveEventManagerActionAtByUserId(String eventId) {
        LinkedHashMap<String, String> managerActionAtByUserId = new LinkedHashMap<>();
        for (ActivitySubEventResource resource : loadEventResourceRecords(eventId)) {
            if (resource == null || !hasManagedEventAssets(resource)) {
                continue;
            }
            String actionAtIso = deriveManagedEventActionAt(resource);
            for (String managerUserId : resolveManagedUserIds(resource)) {
                String currentActionAtIso = managerActionAtByUserId.get(managerUserId);
                if (toSortableDate(actionAtIso) >= toSortableDate(currentActionAtIso)) {
                    managerActionAtByUserId.put(managerUserId, actionAtIso);
                }
            }
        }
        return managerActionAtByUserId;
    }

    private List<ActivitySubEventResource> loadEventResourceRecords(String eventId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return List.of();
        }
        return activitySubEventResourcesRepository.findByOwnerIdAndStatusNot(normalizedEventId, RESOURCE_STATUS_DELETED).stream()
                .filter(Objects::nonNull)
                .toList();
    }

    private boolean hasManagedEventAssets(ActivitySubEventResource resource) {
        return hasAnyAssignedAssetIds(resource.getAssetAssignmentIds())
                || hasAnyAssetSettings(resource.getAssetSettingsByType())
                || hasAnySupplyContributionEntries(resource.getSupplyContributionEntriesByAssetId());
    }

    private boolean hasAnyAssignedAssetIds(Map<String, List<String>> assignmentIds) {
        if (assignmentIds == null || assignmentIds.isEmpty()) {
            return false;
        }
        return assignmentIds.values().stream()
                .filter(Objects::nonNull)
                .flatMap(Collection::stream)
                .map(this::normalizeId)
                .anyMatch(StringUtils::hasText);
    }

    private boolean hasAnyAssetSettings(Map<String, Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>> settingsByType) {
        if (settingsByType == null || settingsByType.isEmpty()) {
            return false;
        }
        return settingsByType.values().stream()
                .filter(Objects::nonNull)
                .flatMap(settings -> settings.keySet().stream())
                .map(this::normalizeId)
                .anyMatch(StringUtils::hasText);
    }

    private boolean hasAnySupplyContributionEntries(Map<String, List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>> entriesByAssetId) {
        if (entriesByAssetId == null || entriesByAssetId.isEmpty()) {
            return false;
        }
        return entriesByAssetId.entrySet().stream()
                .filter(entry -> StringUtils.hasText(normalizeId(entry.getKey())))
                .anyMatch(entry -> entry.getValue() != null && !entry.getValue().isEmpty());
    }

    private Set<String> resolveManagedUserIds(ActivitySubEventResource resource) {
        LinkedHashSet<String> managerUserIds = new LinkedHashSet<>();
        if (resource != null && resource.getAssetSettingsByType() != null) {
            for (Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord> settingsByAssetId : resource.getAssetSettingsByType().values()) {
                if (settingsByAssetId == null) {
                    continue;
                }
                for (ActivitySubEventResource.SubEventAssignedAssetSettingsRecord settings : settingsByAssetId.values()) {
                    String addedByUserId = normalizeId(settings == null ? null : settings.addedByUserId());
                    if (StringUtils.hasText(addedByUserId)) {
                        managerUserIds.add(addedByUserId);
                    }
                }
            }
        }
        if (!managerUserIds.isEmpty()) {
            return managerUserIds;
        }
        String fallbackUserId = normalizeId(resource == null ? null : resource.getAssetOwnerUserId());
        if (hasManagedEventAssets(resource) && StringUtils.hasText(fallbackUserId)) {
            managerUserIds.add(fallbackUserId);
        }
        return managerUserIds;
    }

    private String deriveManagedEventActionAt(ActivitySubEventResource resource) {
        return normalizeDateTime(
                resource == null ? null : resource.getUpdatedDate(),
                normalizeDateTime(resource == null ? null : resource.getCreatedDate(), Instant.now().toString()));
    }

    private OwnerMembersSnapshot toOwnerSnapshot(String ownerType, String ownerId, List<ActivityMember> members) {
        List<ActivityMember> ordered = members.stream()
                .filter(Objects::nonNull)
                .filter(member -> !isHiddenMembershipStatus(member.getStatus()))
                .sorted(this::compareMembersForManagement)
                .toList();
        List<String> acceptedUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .filter(member -> !Boolean.TRUE.equals(member.getOrganizerOnly()))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        List<String> capacityOccupyingAcceptedUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .filter(member -> !Boolean.TRUE.equals(member.getOrganizerOnly()))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        List<String> pendingUserIds = ordered.stream()
                .filter(member -> "pending".equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        List<String> invitedUserIds = memberUserIds(ordered, member -> {
            String status = normalizeStatus(member.getStatus());
            return STATUS_INVITED.equals(status) || (STATUS_PENDING.equals(status) && isInvitationMembership(member));
        });
        List<String> pendingRequestUserIds = memberUserIds(ordered, member ->
                STATUS_PENDING.equals(normalizeStatus(member.getStatus())) && !isInvitationMembership(member));
        Set<String> adminUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .filter(member -> isAdminRoleForOwner(ownerType, resolveStoredRole(member, ownerType, ownerId)))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        return new OwnerMembersSnapshot(
                ownerType,
                ownerId,
                ordered,
                acceptedUserIds,
                capacityOccupyingAcceptedUserIds,
                pendingUserIds,
                invitedUserIds,
                pendingRequestUserIds,
                adminUserIds,
                resolveCapacityTotal(ownerType, ownerId),
                false);
    }

    private List<String> memberUserIds(List<ActivityMember> members, Predicate<ActivityMember> predicate) {
        return members.stream()
                .filter(Objects::nonNull)
                .filter(predicate)
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private List<ActivityMember> ensureOwnerAdminMembership(
            String ownerType,
            String ownerId,
            String scopedEventId,
            List<ActivityMember> nextDocuments,
            Map<String, ActivityMember> existingByUserId,
            String actorUserId,
            String nowIso) {
        if (!OWNER_TYPE_EVENT.equals(ownerType)
                && !OWNER_TYPE_SUB_EVENT.equals(ownerType)
                && !OWNER_TYPE_ASSET.equals(ownerType)) {
            return nextDocuments;
        }
        String eventSourceId = OWNER_TYPE_EVENT.equals(ownerType) ? ownerId : normalizeId(scopedEventId);
        ActivityEvent eventRecord = OWNER_TYPE_EVENT.equals(ownerType) || OWNER_TYPE_SUB_EVENT.equals(ownerType)
                ? (StringUtils.hasText(eventSourceId) ? findPreferredEventRecord(eventSourceId) : null)
                : null;
        Asset assetRecord = OWNER_TYPE_ASSET.equals(ownerType) ? assetsService.findAssetByAssetId(ownerId).orElse(null) : null;
        String creatorUserId = OWNER_TYPE_EVENT.equals(ownerType) || OWNER_TYPE_SUB_EVENT.equals(ownerType)
                ? (eventRecord == null ? null : normalizeId(eventRecord.getCreatorUserId()))
                : (assetRecord == null ? null : normalizeId(assetRecord.getOwnerUserId()));
        if (!StringUtils.hasText(creatorUserId)) {
            return nextDocuments;
        }
        final String creatorId = Objects.requireNonNull(creatorUserId);
        String ownerRole = OWNER_TYPE_EVENT.equals(ownerType) || OWNER_TYPE_SUB_EVENT.equals(ownerType)
                ? "Admin"
                : "Manager";
        boolean alreadyPresent = nextDocuments.stream().anyMatch(member -> creatorId.equals(normalizeId(member.getUserId())));
        if (alreadyPresent) {
            return nextDocuments.stream()
                    .map(member -> {
                        if (!creatorId.equals(normalizeId(member.getUserId()))) {
                            return member;
                        }
                        ActivityMember next = cloneMember(member);
                        next.setRole(ownerRole);
                        next.setStatus("accepted");
                        next.setPendingSource(null);
                        next.setRequestKind(null);
                        next.setInvitedByUserId(null);
                        next.setManagerGrantedByUserId(null);
                        next.setUpdatedDate(nowIso);
                        next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, member));
                        return next;
                    })
                    .toList();
        }

        ActivityMember current = existingByUserId.get(creatorUserId);
        ActivityMember creatorMembership = current == null ? new ActivityMember() : cloneMember(current);
        creatorMembership.setId(current == null ? new ObjectId().toHexString() : current.getId());
        creatorMembership.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
        creatorMembership.setOwnerType(ownerType);
        creatorMembership.setOwnerId(ownerId);
        creatorMembership.setUserId(creatorUserId);
        creatorMembership.setRole(ownerRole);
        creatorMembership.setStatus("accepted");
        creatorMembership.setPendingSource(null);
        creatorMembership.setRequestKind(null);
        creatorMembership.setInvitedByUserId(null);
        creatorMembership.setManagerGrantedByUserId(null);
        String ownerActionAtIso = OWNER_TYPE_EVENT.equals(ownerType) || OWNER_TYPE_SUB_EVENT.equals(ownerType)
                ? normalizeDateTime(eventRecord == null ? null : eventRecord.getStartAtIso(), nowIso)
                : normalizeDateTime(assetRecord == null ? null : assetRecord.getUpdatedDate(), normalizeDateTime(assetRecord == null ? null : assetRecord.getCreatedDate(), nowIso));
        String ownerMetWhere = OWNER_TYPE_EVENT.equals(ownerType) || OWNER_TYPE_SUB_EVENT.equals(ownerType)
                ? safeText(eventRecord == null ? null : eventRecord.getLocation())
                : firstNonBlank(assetRecord == null ? null : assetRecord.getCity(), assetRecord == null ? null : assetRecord.getTitle());
        creatorMembership.setActionAtIso(current == null ? ownerActionAtIso : normalizeDateTime(current.getActionAtIso(), nowIso));
        creatorMembership.setMetAtIso(current == null ? normalizeDateTime(ownerActionAtIso, nowIso) : normalizeDateTime(current.getMetAtIso(), creatorMembership.getActionAtIso()));
        creatorMembership.setMetWhere(current == null ? ownerMetWhere : safeText(current.getMetWhere()));
        creatorMembership.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
        creatorMembership.setCreatedUser(current == null ? creatorUserId : safeText(current.getCreatedUser()));
        creatorMembership.setUpdatedDate(nowIso);
        creatorMembership.setUpdatedUser(resolveUpdatedUser(actorUserId, creatorMembership, current));
        List<ActivityMember> merged = new ArrayList<>(nextDocuments);
        merged.add(creatorMembership);
        return merged;
    }

    private boolean isCanonicalEventCreatorAdminMembership(ActivityMember member) {
        return member != null
                && STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))
                && "Admin".equals(safeText(member.getRole()))
                && !StringUtils.hasText(safeText(member.getPendingSource()))
                && !StringUtils.hasText(safeText(member.getRequestKind()))
                && !StringUtils.hasText(normalizeId(member.getInvitedByUserId()));
    }

    private void cascadeRemovedEventMembersFromAssignedAssets(
            String eventId,
            List<ActivityMember> removedEventMembers,
            String actorUserId,
            String nowIso) {
        if (removedEventMembers == null || removedEventMembers.isEmpty()) {
            return;
        }

        Set<String> removedUserIds = removedEventMembers.stream()
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (removedUserIds.isEmpty()) {
            return;
        }

        List<ActivitySubEventResource> eventResourceRecords = loadEventResourceRecordsIncludingDescendants(eventId);
        Set<String> assignedAssetIds = resolveAssignedAssetIds(eventResourceRecords);
        if (assignedAssetIds.isEmpty()) {
            return;
        }

        Set<String> changedRequestAssetIds = assetsService.statusDeleteEventAssignmentRequestsForUsers(
                assignedAssetIds,
                removedUserIds,
                eventId,
                actorUserId,
                nowIso);
        refreshResourceScopesReferencingAssets(
                eventResourceRecords,
                changedRequestAssetIds,
                actorUserId);

        Map<String, String> assetOwnerUserIdByAssetId = new LinkedHashMap<>();
        for (String assetId : assignedAssetIds) {
            String ownerUserId = assetsService.findAssetByAssetId(assetId)
                    .map(Asset::getOwnerUserId)
                    .map(this::normalizeId)
                    .orElse(null);
            if (StringUtils.hasText(ownerUserId)) {
                assetOwnerUserIdByAssetId.put(assetId, ownerUserId);
            }
        }

        List<ActivityMember> storedAssetMembers = activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_ASSET, assignedAssetIds).stream()
                .filter(Objects::nonNull)
                .toList();
        if (storedAssetMembers.isEmpty()) {
            return;
        }

        List<ActivityMember> changedMembers = new ArrayList<>();
        Map<String, List<ActivityMember>> nextMembersByAssetId = new LinkedHashMap<>();
        for (ActivityMember member : storedAssetMembers) {
            String assetId = normalizeId(member.getOwnerId());
            if (!StringUtils.hasText(assetId)) {
                continue;
            }
            String memberUserId = normalizeId(member.getUserId());
            String assetOwnerUserId = assetOwnerUserIdByAssetId.get(assetId);
            ActivityMember next = member;
            if (StringUtils.hasText(memberUserId)
                    && removedUserIds.contains(memberUserId)
                    && !STATUS_DELETED.equals(normalizeStatus(member.getStatus()))
                    && !memberUserId.equals(assetOwnerUserId)) {
                next = toDeletedMember(member, actorUserId, nowIso);
                changedMembers.add(next);
            }
            nextMembersByAssetId.computeIfAbsent(assetId, ignored -> new ArrayList<>()).add(next);
        }

        if (changedMembers.isEmpty()) {
            return;
        }

        activityMembersRepository.saveAll(changedMembers);
        for (Map.Entry<String, List<ActivityMember>> entry : nextMembersByAssetId.entrySet()) {
            assetsService.syncRequestsFromMembers(entry.getKey(), entry.getValue());
        }
    }

    private void clearRemovedManagedAssetMembers(Set<String> assetIds, String actorUserId, String nowIso) {
        if (assetIds == null || assetIds.isEmpty()) {
            return;
        }

        Map<String, String> assetOwnerUserIdByAssetId = new LinkedHashMap<>();
        for (String assetId : assetIds) {
            String normalizedAssetId = normalizeId(assetId);
            if (!StringUtils.hasText(normalizedAssetId)) {
                continue;
            }
            String ownerUserId = assetsService.findAssetByAssetId(normalizedAssetId)
                    .map(Asset::getOwnerUserId)
                    .map(this::normalizeId)
                    .orElse(null);
            if (StringUtils.hasText(ownerUserId)) {
                assetOwnerUserIdByAssetId.put(normalizedAssetId, ownerUserId);
            }
        }
        if (assetOwnerUserIdByAssetId.isEmpty()) {
            return;
        }

        List<ActivityMember> storedAssetMembers = activityMembersRepository
                .findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_ASSET, assetOwnerUserIdByAssetId.keySet()).stream()
                .filter(Objects::nonNull)
                .toList();
        if (storedAssetMembers.isEmpty()) {
            return;
        }

        List<ActivityMember> changedMembers = new ArrayList<>();
        Set<String> changedAssetIds = new LinkedHashSet<>();
        Map<String, List<ActivityMember>> nextMembersByAssetId = new LinkedHashMap<>();
        for (ActivityMember member : storedAssetMembers) {
            String assetId = normalizeId(member.getOwnerId());
            if (!StringUtils.hasText(assetId)) {
                continue;
            }
            String memberUserId = normalizeId(member.getUserId());
            String assetOwnerUserId = assetOwnerUserIdByAssetId.get(assetId);
            ActivityMember next = member;
            if (StringUtils.hasText(memberUserId)
                    && !STATUS_DELETED.equals(normalizeStatus(member.getStatus()))
                    && !memberUserId.equals(assetOwnerUserId)) {
                next = toDeletedMember(member, actorUserId, nowIso);
                changedMembers.add(next);
                changedAssetIds.add(assetId);
            }
            nextMembersByAssetId.computeIfAbsent(assetId, ignored -> new ArrayList<>()).add(next);
        }

        if (changedMembers.isEmpty()) {
            return;
        }

        activityMembersRepository.saveAll(changedMembers);
        for (String assetId : changedAssetIds) {
            assetsService.syncRequestsFromMembers(assetId, nextMembersByAssetId.getOrDefault(assetId, List.of()));
        }
    }

    private List<ActivitySubEventResource> loadEventResourceRecordsIncludingDescendants(String eventId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return List.of();
        }
        List<ActivitySubEventResource> records = new ArrayList<>(
                activitySubEventResourcesRepository.findByOwnerIdAndStatusNot(
                        normalizedEventId,
                        RESOURCE_STATUS_DELETED));
        records.addAll(activitySubEventResourcesRepository.findByOwnerIdStartingWithAndStatusNot(
                normalizedEventId + ":",
                RESOURCE_STATUS_DELETED));
        return records.stream().filter(Objects::nonNull).toList();
    }

    private Set<String> resolveAssignedAssetIds(Collection<ActivitySubEventResource> records) {
        LinkedHashSet<String> assignedAssetIds = new LinkedHashSet<>();
        for (ActivitySubEventResource resource : records == null
                ? List.<ActivitySubEventResource>of()
                : records) {
            if (resource == null) {
                continue;
            }
            if (resource.getAssetAssignmentIds() != null) {
                for (List<String> assignmentIds : resource.getAssetAssignmentIds().values()) {
                    for (String assignmentId : assignmentIds == null ? List.<String>of() : assignmentIds) {
                        String normalizedAssignmentId = normalizeId(assignmentId);
                        if (StringUtils.hasText(normalizedAssignmentId)) {
                            assignedAssetIds.add(normalizedAssignmentId);
                        }
                    }
                }
            }
            if (resource.getAssetSettingsByType() != null) {
                for (Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord> settingsByAssetId : resource.getAssetSettingsByType().values()) {
                    if (settingsByAssetId == null) {
                        continue;
                    }
                    for (String assetId : settingsByAssetId.keySet()) {
                        String normalizedAssetId = normalizeId(assetId);
                        if (StringUtils.hasText(normalizedAssetId)) {
                            assignedAssetIds.add(normalizedAssetId);
                        }
                    }
                }
            }
            if (resource.getSupplyContributionEntriesByAssetId() != null) {
                for (String assetId : resource.getSupplyContributionEntriesByAssetId().keySet()) {
                    String normalizedAssetId = normalizeId(assetId);
                    if (StringUtils.hasText(normalizedAssetId)) {
                        assignedAssetIds.add(normalizedAssetId);
                    }
                }
            }
        }
        return assignedAssetIds;
    }

    private void refreshResourceScopesReferencingAssets(
            Collection<ActivitySubEventResource> records,
            Set<String> changedAssetIds,
            String actorUserId) {
        if (changedAssetIds == null || changedAssetIds.isEmpty()) {
            return;
        }
        Set<String> refreshedScopes = new LinkedHashSet<>();
        for (ActivitySubEventResource record : records == null
                ? List.<ActivitySubEventResource>of()
                : records) {
            if (record == null
                    || resolveAssignedAssetIds(List.of(record)).stream().noneMatch(changedAssetIds::contains)) {
                continue;
            }
            String ownerId = normalizeId(record.getOwnerId());
            String subEventId = normalizeId(record.getSubEventId());
            String scope = ownerId + "\n" + subEventId;
            if (!StringUtils.hasText(ownerId)
                    || !StringUtils.hasText(subEventId)
                    || !refreshedScopes.add(scope)) {
                continue;
            }
            activitiesResourcesService.refreshResourceMetricsForScope(
                    ownerId,
                    subEventId,
                    actorUserId);
        }
    }

    private void finalizeAcceptedEventReservations(
            String eventId,
            Collection<ActivityMember> acceptedMembers) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId) || acceptedMembers == null || acceptedMembers.isEmpty()) {
            return;
        }
        acceptedMembers.stream()
                .filter(Objects::nonNull)
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .forEach(userId -> {
                    eventCheckoutBasketService.finalizeAcceptedReservation(userId, normalizedEventId);
                    paymentService.finalizePendingEventJoin(userId, normalizedEventId);
                });
    }

    private int processEventWaitlist(String eventId, ActivityEvent eventRecord, boolean promoteSingle) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return 0;
        }
        synchronized (eventJoinLock(normalizedEventId)) {
            return processEventWaitlistLocked(
                    normalizedEventId,
                    eventRecord,
                    promoteSingle);
        }
    }

    private int processEventWaitlistLocked(
            String normalizedEventId,
            ActivityEvent eventRecord,
            boolean promoteSingle) {
        ActivityEvent preferredEventRecord = eventRecord == null ? findPreferredEventRecord(normalizedEventId) : eventRecord;
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        int capacityTotal = snapshot == null || snapshot.capacityTotal() == null
                ? Math.max(0, preferredEventRecord == null || preferredEventRecord.getCapacityTotal() == null ? 0 : preferredEventRecord.getCapacityTotal())
                : Math.max(0, snapshot.capacityTotal());
        if (capacityTotal <= 0) {
            return 0;
        }

        List<ActivityMember> storedMembers = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId);
        int acceptedMembers = snapshot == null ? 0 : Math.max(0, snapshot.acceptedMembers());
        if (acceptedMembers >= capacityTotal) {
            return demoteWaitlistInvitations(
                    normalizedEventId,
                    storedMembers,
                    Integer.MAX_VALUE);
        }
        Set<String> acceptedUserIds = snapshot == null
                ? Set.of()
                : new LinkedHashSet<>(snapshot.acceptedMemberUserIds());
        int reservedInvitations = snapshot == null || snapshot.invitedMemberUserIds() == null
                ? 0
                : (int) snapshot.invitedMemberUserIds().stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .filter(userId -> !acceptedUserIds.contains(userId))
                        .distinct()
                        .count();
        int excessReservations = Math.max(
                0,
                acceptedMembers + reservedInvitations - capacityTotal);
        if (excessReservations > 0) {
            return demoteWaitlistInvitations(
                    normalizedEventId,
                    storedMembers,
                    excessReservations);
        }
        int availableCapacity = Math.max(0, capacityTotal - acceptedMembers - reservedInvitations);
        if (availableCapacity <= 0) {
            return 0;
        }

        List<ActivityMember> waitingMembers = storedMembers.stream()
                .filter(Objects::nonNull)
                .filter(member -> STATUS_PENDING.equals(normalizeStatus(member.getStatus())))
                .filter(member -> REQUEST_KIND_WAITLIST.equals(resolveRequestKind(member.getRequestKind(), STATUS_PENDING, resolvePendingSource(member.getPendingSource(), STATUS_PENDING))))
                .sorted(Comparator
                        .comparing((ActivityMember member) -> toSortableDate(member.getActionAtIso()))
                        .thenComparing(member -> toSortableDate(member.getCreatedDate()))
                        .thenComparing(member -> safeText(member.getSyncKey()))
                        .thenComparing(member -> safeText(member.getId())))
                .toList();
        if (waitingMembers.isEmpty()) {
            return 0;
        }

        int promotionLimit = Math.min(
                availableCapacity,
                promoteSingle ? 1 : waitingMembers.size());
        String nowIso = Instant.now().toString();
        String inviterUserId = resolveWaitlistInviterUserId(preferredEventRecord);
        List<ActivityMember> membersToSave = new ArrayList<>();
        List<String> promotedUserIds = new ArrayList<>();
        for (ActivityMember waitingMember : waitingMembers) {
            if (promotedUserIds.size() >= promotionLimit) {
                break;
            }
            String userId = normalizeId(waitingMember.getUserId());
            if (!StringUtils.hasText(userId)) {
                continue;
            }
            ActivityMember invitedMember = cloneMember(waitingMember);
            invitedMember.setPendingSource("admin");
            invitedMember.setRequestKind(REQUEST_KIND_WAITLIST_INVITE);
            invitedMember.setInvitedByUserId(StringUtils.hasText(inviterUserId) ? inviterUserId : null);
            invitedMember.setUpdatedDate(nowIso);
            invitedMember.setUpdatedUser(StringUtils.hasText(inviterUserId) ? inviterUserId : userId);
            membersToSave.add(invitedMember);
            promotedUserIds.add(userId);
        }

        if (membersToSave.isEmpty()) {
            return 0;
        }

        activityMembersRepository.saveAll(membersToSave);
        enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, normalizedEventId, inviterUserId);
        refreshEmbeddedEventMembers(normalizedEventId);
        userActivityCountersService.refreshEventCountersForUsers(promotedUserIds);
        eventInviteNotificationService.notifyInvitees(
                preferredEventRecord,
                promotedUserIds,
                inviterUserId);
        return promotedUserIds.size();
    }

    private int demoteWaitlistInvitations(
            String eventId,
            List<ActivityMember> members,
            int maximumDemotions) {
        List<ActivityMember> membersToSave = new ArrayList<>();
        String nowIso = Instant.now().toString();
        List<ActivityMember> waitlistInvitations =
                (members == null ? List.<ActivityMember>of() : members).stream()
                        .filter(Objects::nonNull)
                        .filter(member -> STATUS_PENDING.equals(normalizeStatus(member.getStatus())))
                        .filter(member -> REQUEST_KIND_WAITLIST_INVITE.equals(resolveRequestKind(
                                member.getRequestKind(),
                                STATUS_PENDING,
                                resolvePendingSource(member.getPendingSource(), STATUS_PENDING))))
                        .sorted(Comparator
                                .comparing((ActivityMember member) -> toSortableDate(member.getActionAtIso()))
                                .thenComparing(member -> toSortableDate(member.getCreatedDate()))
                                .thenComparing(member -> safeText(member.getSyncKey()))
                                .thenComparing(member -> safeText(member.getId()))
                                .reversed())
                        .limit(Math.max(0, maximumDemotions))
                        .toList();
        for (ActivityMember member : waitlistInvitations) {
            ActivityMember next = cloneMember(member);
            next.setPendingSource("member");
            next.setRequestKind(REQUEST_KIND_WAITLIST);
            next.setInvitedByUserId(null);
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveWaitlistInviterUserId(findPreferredEventRecord(eventId)));
            membersToSave.add(next);
        }
        if (!membersToSave.isEmpty()) {
            activityMembersRepository.saveAll(membersToSave);
            enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, eventId, resolveWaitlistInviterUserId(findPreferredEventRecord(eventId)));
            refreshEmbeddedEventMembers(eventId);
        }
        return membersToSave.size();
    }

    private String resolveWaitlistInviterUserId(ActivityEvent eventRecord) {
        String creatorUserId = normalizeId(eventRecord == null ? null : eventRecord.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId)) {
            return creatorUserId;
        }
        return "system";
    }

    private ActivityEvent findPreferredEventRecord(String sourceId) {
        List<ActivityEvent> documents = activityEventsRepository.findBySourceId(sourceId);
        ActivityEvent preferred = null;
        for (ActivityEvent document : documents) {
            if (document == null) {
                continue;
            }
            if (preferred == null) {
                preferred = document;
                continue;
            }
            if (preferEventRecord(document, preferred)) {
                preferred = document;
            }
        }
        return preferred;
    }

    private boolean preferEventRecord(ActivityEvent next, ActivityEvent current) {
        if (next == null) {
            return false;
        }
        if (current == null) {
            return true;
        }
        boolean nextActive = "A".equals(safeText(next.getStatus()));
        boolean currentActive = "A".equals(safeText(current.getStatus()));
        if (nextActive != currentActive) {
            return nextActive;
        }
        return toSortableDate(next.getUpdatedDate()) >= toSortableDate(current.getUpdatedDate());
    }

    private Map<String, Users> memberUsersById(Collection<ActivityMember> members) {
        Set<String> userIds = new LinkedHashSet<>();
        for (ActivityMember member : members) {
            String userId = normalizeId(member == null ? null : member.getUserId());
            if (StringUtils.hasText(userId)) userIds.add(userId);
        }
        if (userIds.isEmpty()) return Map.of();
        Map<String, Users> usersById = new LinkedHashMap<>();
        for (Users user : usersRepository.findByUserIdIn(userIds)) {
            if (user != null) usersById.put(normalizeId(user.getUserId()), user);
        }
        return usersById;
    }

    private ActivityMemberEntryDto toEntryDto(ActivityMember member, String viewerUserId, Map<String, Users> usersById) {
        if (member == null || !StringUtils.hasText(normalizeId(member.getUserId()))) {
            return null;
        }
        Users user = usersById.get(normalizeId(member.getUserId()));
        String role = resolveStoredRole(member, member.getOwnerType(), member.getOwnerId());
        String status = normalizeStatus(member.getStatus());
        String pendingSource = resolvePendingSource(member.getPendingSource(), status);
        String requestKind = resolveRequestKind(member.getRequestKind(), status, pendingSource);
        String actionAtIso = normalizeDateTime(member.getActionAtIso(), Instant.now().toString());
        return new ActivityMemberEntryDto(
                StringUtils.hasText(member.getSyncKey()) ? member.getSyncKey().trim() : normalizeId(member.getId()),
                normalizeId(member.getUserId()),
                user == null ? normalizeId(member.getUserId()) : safeText(user.getName()),
                user == null ? initialsFromText(normalizeId(member.getUserId())) : safeText(user.getInitials()),
                user == null ? "man" : normalizeGender(user.getGender()),
                user == null ? "" : safeText(user.getCity()),
                defaultStatusText(status, requestKind, pendingSource, member.getOwnerType()),
                role,
                status,
                pendingSource,
                requestKind,
                normalizeId(member.getInvitedByUserId()),
                StringUtils.hasText(viewerUserId) && viewerUserId.equals(normalizeId(member.getInvitedByUserId())),
                normalizeDateTime(member.getMetAtIso(), actionAtIso),
                actionAtIso,
                safeText(member.getMetWhere()),
                resolveAvatarUrl(user),
                user == null ? null : homeUserProfileService.toGameCardUserDto(user),
                List.of(),
                memberRevision(member),
                nullableText(member.getAttendanceStatus()),
                nullableText(member.getCheckedInAtIso()),
                nullableText(member.getCheckedInByUserId()),
                nullableText(member.getCheckedInTicketId()),
                "Manager".equals(role) ? nullableText(member.getManagerGrantedByUserId()) : null,
                Boolean.TRUE.equals(member.getOrganizerOnly()));
    }

    private ActivityMemberEntryDto withInvolvements(
            ActivityMemberEntryDto entry,
            List<ActivityMemberInvolvementDto> involvements) {
        if (entry == null) {
            return null;
        }
        return new ActivityMemberEntryDto(
                entry.id(),
                entry.userId(),
                entry.name(),
                entry.initials(),
                entry.gender(),
                entry.city(),
                entry.statusText(),
                entry.role(),
                entry.status(),
                entry.pendingSource(),
                entry.requestKind(),
                entry.invitedByUserId(),
                entry.invitedByActiveUser(),
                entry.metAtIso(),
                entry.actionAtIso(),
                entry.metWhere(),
                entry.avatarUrl(),
                entry.profile(),
                involvements == null ? List.of() : List.copyOf(involvements),
                entry.revision(),
                entry.attendanceStatus(),
                entry.checkedInAtIso(),
                entry.checkedInByUserId(),
                entry.checkedInTicketId(),
                entry.managerGrantedByUserId(),
                entry.organizerOnly());
    }

    private Map<String, List<ActivityMemberInvolvementDto>> memberInvolvementsByUserId(
            String ownerType,
            String ownerId,
            List<ActivityMember> ownerMembers) {
        List<String> userIds = ownerMembers == null ? List.of() : ownerMembers.stream()
                .filter(Objects::nonNull)
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (userIds.isEmpty()) {
            return Map.of();
        }
        String ownerIdRegex = ownerInvolvementOwnerIdRegex(ownerType, ownerId);
        List<ActivityMember> storedInvolvementRecords = activityMembersRepository.findInvolvementRecordsByUserIdsAndOwnerScope(
                userIds,
                HIDDEN_MEMBERSHIP_STATUSES,
                ownerType,
                ownerId,
                ownerIdRegex);
        List<ActivityMember> involvementRecords = new ArrayList<>(
                storedInvolvementRecords == null ? List.of() : storedInvolvementRecords);
        involvementRecords.addAll(ownerMembers == null ? List.of() : ownerMembers);
        Map<String, List<ActivityMemberInvolvementDto>> result = new LinkedHashMap<>();
        Map<String, Set<String>> ownerKeysByUserId = new LinkedHashMap<>();
        involvementRecords.stream()
                .filter(Objects::nonNull)
                .filter(member -> isMemberInOwnerInvolvementScope(member, ownerType, ownerId))
                .sorted(Comparator
                        .comparing((ActivityMember member) -> toSortableDate(member.getActionAtIso()))
                        .thenComparing(member -> ownerKey(member.getOwnerType(), member.getOwnerId())))
                .forEach(member -> {
                    String userId = normalizeId(member.getUserId());
                    String key = ownerKey(member.getOwnerType(), member.getOwnerId());
                    if (!StringUtils.hasText(userId) || !ownerKeysByUserId.computeIfAbsent(userId, ignored -> new LinkedHashSet<>()).add(key)) {
                        return;
                    }
                    ActivityMemberInvolvementDto dto = toInvolvementDto(member);
                    if (dto != null) {
                        result.computeIfAbsent(userId, ignored -> new ArrayList<>()).add(dto);
                    }
                });
        return result;
    }

    private ActivityMemberInvolvementDto toInvolvementDto(ActivityMember member) {
        String ownerType = normalizeOwnerType(member == null ? null : member.getOwnerType());
        String ownerId = normalizeId(member == null ? null : member.getOwnerId());
        if (!StringUtils.hasText(ownerType) || !StringUtils.hasText(ownerId)) {
            return null;
        }
        String scope = ownerTypeLabel(ownerType);
        String slotDate = slotDateLabel(ownerId);
        String label = joinNonBlank(firstNonBlank(member.getMetWhere(), scope), slotDate);
        String role = resolveStoredRole(member, ownerType, ownerId);
        String status = normalizeStatus(member.getStatus());
        String detail = joinNonBlank(scope, statusLabel(status), role);
        return new ActivityMemberInvolvementDto(
                ownerKey(ownerType, ownerId),
                ownerType,
                ownerId,
                label,
                detail,
                status,
                role,
                normalizeDateTime(member.getActionAtIso(), Instant.now().toString()));
    }

    private boolean isMemberInOwnerInvolvementScope(ActivityMember member, String ownerType, String ownerId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String recordOwnerType = normalizeOwnerType(member == null ? null : member.getOwnerType());
        String recordOwnerId = normalizeId(member == null ? null : member.getOwnerId());
        if (!StringUtils.hasText(normalizedOwnerType)
                || !StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(recordOwnerType)
                || !StringUtils.hasText(recordOwnerId)) {
            return false;
        }
        if (normalizedOwnerType.equals(recordOwnerType) && normalizedOwnerId.equals(recordOwnerId)) {
            return true;
        }
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)) {
            return recordOwnerId.startsWith(normalizedOwnerId + ":");
        }
        if (OWNER_TYPE_SUB_EVENT.equals(normalizedOwnerType) || OWNER_TYPE_GROUP.equals(normalizedOwnerType)) {
            return recordOwnerId.startsWith(normalizedOwnerId + ":");
        }
        return false;
    }

    private String ownerInvolvementOwnerIdRegex(String ownerType, String ownerId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerId) || OWNER_TYPE_ASSET.equals(normalizedOwnerType)) {
            return "a^";
        }
        return "^" + Pattern.quote(normalizedOwnerId) + ":";
    }

    private String ownerKey(String ownerType, String ownerId) {
        return normalizeOwnerType(ownerType) + ":" + normalizeId(ownerId);
    }

    private String ownerTypeLabel(String ownerType) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)) {
            return "Event";
        }
        if (OWNER_TYPE_SUB_EVENT.equals(normalizedOwnerType)) {
            return "Sub event";
        }
        if (OWNER_TYPE_GROUP.equals(normalizedOwnerType)) {
            return "Group";
        }
        if (OWNER_TYPE_ASSET.equals(normalizedOwnerType)) {
            return "Asset";
        }
        return "Membership";
    }

    private String statusLabel(String status) {
        String normalizedStatus = normalizeStatus(status);
        if (STATUS_ACCEPTED.equals(normalizedStatus)) {
            return "Accepted";
        }
        if (STATUS_PENDING.equals(normalizedStatus)) {
            return "Pending";
        }
        if (STATUS_DISQUALIFIED.equals(normalizedStatus)) {
            return "Disqualified";
        }
        if (STATUS_DELETED.equals(normalizedStatus)) {
            return "Deleted";
        }
        if (STATUS_REMOVED.equals(normalizedStatus)) {
            return "Removed";
        }
        if (STATUS_SUPPRESSED.equals(normalizedStatus)) {
            return "Suppressed";
        }
        return safeText(status);
    }

    private String slotDateLabel(String ownerId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String marker = ":slot:";
        int markerIndex = normalizedOwnerId.indexOf(marker);
        if (markerIndex < 0) {
            return "";
        }
        String tail = normalizedOwnerId.substring(markerIndex + marker.length());
        int separatorIndex = tail.indexOf(':');
        String dateText = separatorIndex >= 0 ? tail.substring(separatorIndex + 1) : tail;
        try {
            return SLOT_DATE_FORMATTER.format(Instant.parse(dateText));
        } catch (RuntimeException ignored) {
            return "";
        }
    }

    private String joinNonBlank(String... values) {
        List<String> parts = new ArrayList<>();
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                parts.add(normalized);
            }
        }
        return String.join(" · ", parts);
    }

    private String resolveStoredRole(ActivityMember member, String ownerType, String ownerId) {
        String normalizedRole = safeText(member == null ? null : member.getRole());
        if ("Admin".equals(normalizedRole) || "Manager".equals(normalizedRole) || "Member".equals(normalizedRole)) {
            return normalizedRole;
        }
        return normalizeRole(normalizedRole, normalizeId(member == null ? null : member.getUserId()), ownerType, ownerId);
    }

    private boolean isAdminRoleForOwner(String ownerType, String role) {
        if (OWNER_TYPE_ASSET.equals(ownerType)) {
            return "Manager".equals(role) || ADMIN_ROLES.contains(role);
        }
        return ADMIN_ROLES.contains(role);
    }

    private List<ActivityMemberEntryDto> safeMembers(List<ActivityMemberEntryDto> members) {
        return members == null ? List.of() : members;
    }

    private List<String> normalizeUserIds(Collection<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }
        LinkedHashSet<String> next = new LinkedHashSet<>();
        for (String userId : userIds) {
            String normalizedUserId = normalizeId(userId);
            if (StringUtils.hasText(normalizedUserId)) {
                next.add(normalizedUserId);
            }
        }
        return new ArrayList<>(next);
    }

    private String normalizeOwnerType(String ownerType) {
        String normalizedOwnerType = safeText(ownerType);
        return OWNER_TYPES.contains(normalizedOwnerType) ? normalizedOwnerType : null;
    }

    private String normalizeRole(String role, String userId, String ownerType, String ownerId) {
        String normalizedRole = safeText(role);
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            if ("Admin".equals(normalizedRole) || "Manager".equals(normalizedRole)) {
                return normalizedRole;
            }
            ActivityEvent record = findPreferredEventRecord(ownerId);
            if (resolveEventAdminUserIds(record).contains(normalizeId(userId))) {
                return "Admin";
            }
            if (resolveEventManagerActionAtByUserId(ownerId).containsKey(normalizeId(userId))) {
                return "Manager";
            }
            return "Member";
        }
        if (OWNER_TYPE_ASSET.equals(ownerType)) {
            if ("Manager".equals(normalizedRole)) {
                return normalizedRole;
            }
            Asset asset = assetsService.findAssetByAssetId(ownerId).orElse(null);
            if (asset != null && normalizeId(asset.getOwnerUserId()).equals(normalizeId(userId))) {
                return "Manager";
            }
            return "Member";
        }
        if ("Admin".equals(normalizedRole) || "Manager".equals(normalizedRole) || "Member".equals(normalizedRole)) {
            return normalizedRole;
        }
        return "Member";
    }

    private Integer resolveCapacityTotal(String ownerType, String ownerId) {
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            ActivityEvent record = findPreferredEventRecord(ownerId);
            return record == null ? null : record.getCapacityTotal();
        }
        if (OWNER_TYPE_ASSET.equals(ownerType)) {
            return assetsService.findAssetByAssetId(ownerId)
                    .map(Asset::getCapacityTotal)
                    .orElse(null);
        }
        return null;
    }

    private String firstNonBlank(String first, String second) {
        String firstValue = safeText(first);
        if (StringUtils.hasText(firstValue)) {
            return firstValue;
        }
        return safeText(second);
    }

    private ActivityMember toDeletedMember(ActivityMember member, String actorUserId, String nowIso) {
        if (member == null) {
            return null;
        }
        ActivityMember next = cloneMember(member);
        next.setStatus(STATUS_DELETED);
        next.setStatusBeforeSuppression(null);
        next.setSuppressionRootOwnerId(null);
        next.setSuppressedAtIso(null);
        next.setPendingSource(null);
        next.setRequestKind(null);
        next.setActionAtIso(nowIso);
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, member));
        return next;
    }

    private ActivityMember toRemovedMember(ActivityMember member, String actorUserId, String nowIso) {
        if (member == null) {
            return null;
        }
        ActivityMember next = cloneMember(member);
        next.setStatus(STATUS_REMOVED);
        next.setStatusBeforeSuppression(null);
        next.setSuppressionRootOwnerId(null);
        next.setSuppressedAtIso(null);
        next.setPendingSource(null);
        next.setRequestKind(null);
        next.setActionAtIso(nowIso);
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, member));
        return next;
    }

    private void enqueueOwnerMembersChanged(String ownerType, String ownerId, String actorUserId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedActorUserId = resolveActorUserId(actorUserId);
        if (!StringUtils.hasText(normalizedOwnerId)) {
            return;
        }
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)) {
            affinityRecomputeTaskService.enqueueEventMembersChanged(normalizedOwnerId, normalizedActorUserId);
        } else if (OWNER_TYPE_ASSET.equals(normalizedOwnerType)) {
            affinityRecomputeTaskService.enqueueAssetRequestsChanged(normalizedOwnerId, normalizedActorUserId);
        }
    }

    private boolean canApplyEventMemberAction(String ownerId, String actorUserId, String targetUserId, String action) {
        if (ACTION_SET_ORGANIZER_ONLY.equals(action) || ACTION_SET_PARTICIPANT.equals(action)) {
            return normalizeId(actorUserId).equals(normalizeId(targetUserId))
                    && canManageOwnerMembers(OWNER_TYPE_EVENT, ownerId, actorUserId);
        }
        if (ACTION_ACCEPT.equals(action)) {
            return accessControlService.canAcceptEventMember(ownerId, actorUserId, targetUserId);
        }
        if (ACTION_REMOVE.equals(action)) {
            if (normalizeId(actorUserId).equals(normalizeId(targetUserId))) {
                return canSelfLeaveEvent(ownerId, targetUserId);
            }
            if (canCancelEventInvitation(ownerId, actorUserId, targetUserId)) {
                return true;
            }
            return accessControlService.canRemoveEventMember(ownerId, actorUserId, targetUserId)
                    || canOwnerRemoveEventAdmin(ownerId, actorUserId, targetUserId);
        }
        if (ACTION_DISQUALIFY.equals(action)) {
            return accessControlService.canDisqualifyEventMember(ownerId, actorUserId, targetUserId);
        }
        if (ACTION_REINSTATE.equals(action)) {
            return accessControlService.canReinstateEventMember(ownerId, actorUserId, targetUserId);
        }
        if (ACTION_PROMOTE_ADMIN.equals(action)) {
            return canPromoteEventAdmin(ownerId, actorUserId, targetUserId);
        }
        if (ACTION_STEP_DOWN_ADMIN.equals(action)) {
            return canStepDownEventAdmin(ownerId, actorUserId, targetUserId);
        }
        return false;
    }


    private boolean canCancelEventInvitation(String eventId, String actorUserId, String targetUserId) {
        ActivityMember target = findEventMember(eventId, targetUserId);
        return target != null
                && STATUS_PENDING.equals(normalizeStatus(target.getStatus()))
                && isInvitationMembership(target)
                && normalizeId(actorUserId).equals(normalizeId(target.getInvitedByUserId()));
    }

    private boolean canSelfLeaveEvent(String eventId, String userId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        List<ActivityMember> members = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId);
        ActivityMember current = members.stream()
                .filter(Objects::nonNull)
                .filter(member -> normalizedUserId.equals(normalizeId(member.getUserId())))
                .findFirst()
                .orElse(null);
        return current != null
                && resolveEventAdminLeavePlan(normalizedEventId, normalizedUserId, current, members).allowed();
    }

    private EventAdminLeavePlan resolveEventAdminLeavePlan(
            String eventId,
            String leavingUserId,
            ActivityMember leavingMember,
            List<ActivityMember> members) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedLeavingUserId = normalizeId(leavingUserId);
        String currentStatus = normalizeStatus(leavingMember == null ? null : leavingMember.getStatus());
        if (!STATUS_ACCEPTED.equals(currentStatus)) {
            return STATUS_PENDING.equals(currentStatus) || STATUS_INVITED.equals(currentStatus)
                    ? EventAdminLeavePlan.allowedWithoutTransfer()
                    : EventAdminLeavePlan.denied();
        }

        ActivityEvent event = findPreferredEventRecord(normalizedEventId);
        String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
        boolean leavingOwner = normalizedLeavingUserId.equals(creatorUserId);
        boolean leavingAdmin = leavingOwner
                || "Admin".equals(resolveStoredRole(leavingMember, OWNER_TYPE_EVENT, normalizedEventId));
        if (!leavingAdmin) {
            return EventAdminLeavePlan.allowedWithoutTransfer();
        }

        ActivityMember successor = (members == null ? List.<ActivityMember>of() : members).stream()
                .filter(Objects::nonNull)
                .filter(member -> !normalizedLeavingUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .filter(member -> "Admin".equals(resolveStoredRole(member, OWNER_TYPE_EVENT, normalizedEventId)))
                .min(Comparator
                        .comparingLong((ActivityMember member) -> memberJoiningTime(member))
                        .thenComparing(member -> normalizeId(member.getUserId())))
                .orElse(null);
        String successorUserId = normalizeId(successor == null ? null : successor.getUserId());
        if (!StringUtils.hasText(successorUserId) && StringUtils.hasText(creatorUserId) && !leavingOwner) {
            successorUserId = creatorUserId;
        }
        if (!StringUtils.hasText(successorUserId)) {
            return EventAdminLeavePlan.denied();
        }
        return leavingOwner
                ? EventAdminLeavePlan.allowedWithTransfer(successorUserId)
                : EventAdminLeavePlan.allowedWithoutTransfer();
    }

    private void transferEventOwnership(
            String eventId,
            String leavingOwnerUserId,
            String successorAdminUserId,
            String actorUserId,
            String nowIso) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedLeavingOwnerUserId = normalizeId(leavingOwnerUserId);
        String normalizedSuccessorAdminUserId = normalizeId(successorAdminUserId);
        List<ActivityEvent> documents = activityEventsRepository.findBySourceId(normalizedEventId).stream()
                .filter(Objects::nonNull)
                .toList();
        if (documents.isEmpty() || !StringUtils.hasText(normalizedSuccessorAdminUserId)) {
            return;
        }

        ActivityEvent canonical = documents.stream()
                .filter(document -> normalizedLeavingOwnerUserId.equals(normalizeId(document.getOwnerUserId())))
                .filter(document -> normalizedLeavingOwnerUserId.equals(normalizeId(document.getCreatorUserId())))
                .findFirst()
                .orElse(findPreferredEventRecord(normalizedEventId));
        Users successor = usersRepository.findByUserId(normalizedSuccessorAdminUserId).orElse(null);
        List<ActivityEvent> duplicateSuccessorOverlays = documents.stream()
                .filter(document -> document != canonical)
                .filter(document -> normalizedSuccessorAdminUserId.equals(normalizeId(document.getOwnerUserId())))
                .toList();
        Set<String> duplicateIds = duplicateSuccessorOverlays.stream()
                .map(ActivityEvent::getId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        List<ActivityEvent> documentsToSave = new ArrayList<>();
        for (ActivityEvent document : documents) {
            if (document == null || duplicateIds.contains(document.getId())) {
                continue;
            }
            document.setCreatorUserId(normalizedSuccessorAdminUserId);
            document.setCreatorName(successor == null
                    ? normalizedSuccessorAdminUserId
                    : firstNonBlank(successor.getName(), normalizedSuccessorAdminUserId));
            document.setCreatorInitials(successor == null ? "" : safeText(successor.getInitials()));
            document.setCreatorGender(successor == null ? "" : normalizeGender(successor.getGender()));
            document.setCreatorCity(successor == null ? "" : safeText(successor.getCity()));
            LinkedHashSet<String> adminUserIds = new LinkedHashSet<>(document.getAdmins() == null
                    ? List.of()
                    : document.getAdmins());
            adminUserIds.remove(normalizedLeavingOwnerUserId);
            adminUserIds.add(normalizedSuccessorAdminUserId);
            document.setAdmins(new ArrayList<>(adminUserIds));
            if (document == canonical) {
                document.setOwnerUserId(normalizedSuccessorAdminUserId);
            }
            document.setUpdatedDate(nowIso);
            document.setUpdatedUser(StringUtils.hasText(normalizeId(actorUserId))
                    ? normalizeId(actorUserId)
                    : "system");
            documentsToSave.add(document);
        }
        if (!duplicateSuccessorOverlays.isEmpty()) {
            activityEventsRepository.deleteAll(duplicateSuccessorOverlays);
        }
        if (!documentsToSave.isEmpty()) {
            List<ActivityEvent> savedDocuments = activityEventsRepository.saveAll(documentsToSave);
            eventSlotReadModelService.refreshForChangedEvents(savedDocuments);
        }
    }

    private int compareMembersForManagement(ActivityMember left, ActivityMember right) {
        int priorityComparison = Integer.compare(
                memberManagementPriority(
                        left == null ? null : normalizeStatus(left.getStatus()),
                        left == null ? null : resolveStoredRole(left, left.getOwnerType(), left.getOwnerId())),
                memberManagementPriority(
                        right == null ? null : normalizeStatus(right.getStatus()),
                        right == null ? null : resolveStoredRole(right, right.getOwnerType(), right.getOwnerId())));
        if (priorityComparison != 0) {
            return priorityComparison;
        }
        int actionComparison = Long.compare(
                toSortableDate(right == null ? null : right.getActionAtIso()),
                toSortableDate(left == null ? null : left.getActionAtIso()));
        if (actionComparison != 0) {
            return actionComparison;
        }
        return normalizeId(left == null ? null : left.getUserId())
                .compareTo(normalizeId(right == null ? null : right.getUserId()));
    }

    private int memberManagementPriority(String status, String role) {
        if (STATUS_PENDING.equals(normalizeStatus(status))) {
            return 0;
        }
        if (STATUS_ACCEPTED.equals(normalizeStatus(status)) && MANAGER_ROLES.contains(safeText(role))) {
            return 1;
        }
        if (STATUS_ACCEPTED.equals(normalizeStatus(status))) {
            return 2;
        }
        if (STATUS_DISQUALIFIED.equals(normalizeStatus(status))) {
            return 3;
        }
        return 4;
    }

    private long memberJoiningTime(ActivityMember member) {
        return toSortableDate(member == null ? null : member.getActionAtIso());
    }

    private String memberActionTelemetry(String action) {
        if (ACTION_ACCEPT.equals(action)) {
            return "event.member.accepted";
        }
        if (ACTION_REMOVE.equals(action)) {
            return "event.member.removed";
        }
        if (ACTION_DISQUALIFY.equals(action)) {
            return "event.member.disqualified";
        }
        if (ACTION_REINSTATE.equals(action)) {
            return "event.member.reinstated";
        }
        if (ACTION_PROMOTE_ADMIN.equals(action)) {
            return "event.member.admin-promoted";
        }
        if (ACTION_SET_ORGANIZER_ONLY.equals(action)) {
            return "event.member.organizer-only";
        }
        if (ACTION_SET_PARTICIPANT.equals(action)) {
            return "event.member.participant";
        }
        return "event.member.admin-stepped-down";
    }

    private boolean canOwnerRemoveEventAdmin(String eventId, String actorUserId, String targetUserId) {
        ActivityEvent event = findPreferredEventRecord(eventId);
        String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
        String normalizedActorUserId = normalizeId(actorUserId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        if (!StringUtils.hasText(creatorUserId)
                || !creatorUserId.equals(normalizedActorUserId)
                || creatorUserId.equals(normalizedTargetUserId)) {
            return false;
        }
        ActivityMember target = findEventMember(eventId, normalizedTargetUserId);
        return target != null
                && STATUS_ACCEPTED.equals(normalizeStatus(target.getStatus()))
                && "Admin".equals(resolveStoredRole(target, OWNER_TYPE_EVENT, eventId));
    }

    private boolean canPromoteEventAdmin(String eventId, String actorUserId, String targetUserId) {
        String normalizedActorUserId = normalizeId(actorUserId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        if (!StringUtils.hasText(normalizedActorUserId)
                || !StringUtils.hasText(normalizedTargetUserId)
                || normalizedActorUserId.equals(normalizedTargetUserId)
                || !isEventAdminUser(eventId, normalizedActorUserId)) {
            return false;
        }
        ActivityMember target = findEventMember(eventId, normalizedTargetUserId);
        return target != null
                && STATUS_ACCEPTED.equals(normalizeStatus(target.getStatus()))
                && !"Admin".equals(resolveStoredRole(target, OWNER_TYPE_EVENT, eventId));
    }

    private boolean canStepDownEventAdmin(String eventId, String actorUserId, String targetUserId) {
        String normalizedActorUserId = normalizeId(actorUserId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        ActivityEvent event = findPreferredEventRecord(eventId);
        String creatorUserId = normalizeId(event == null ? null : event.getCreatorUserId());
        if (!StringUtils.hasText(normalizedActorUserId)
                || !normalizedActorUserId.equals(normalizedTargetUserId)
                || normalizedTargetUserId.equals(creatorUserId)) {
            return false;
        }
        ActivityMember target = findEventMember(eventId, normalizedTargetUserId);
        return target != null
                && STATUS_ACCEPTED.equals(normalizeStatus(target.getStatus()))
                && "Admin".equals(resolveStoredRole(target, OWNER_TYPE_EVENT, eventId));
    }

    private boolean isEventAdminUser(String eventId, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        ActivityEvent event = findPreferredEventRecord(eventId);
        if (resolveEventAdminUserIds(event).contains(normalizedUserId)) {
            return true;
        }
        ActivityMember member = findEventMember(eventId, normalizedUserId);
        return member != null
                && STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))
                && "Admin".equals(resolveStoredRole(member, OWNER_TYPE_EVENT, eventId));
    }

    private boolean canManageOwnerMembers(String ownerType, String ownerId, String actorUserId) {
        return canManageOwnerMembers(ownerType, ownerId, actorUserId, null);
    }

    private boolean canManageOwnerMembers(
            String ownerType,
            String ownerId,
            String actorUserId,
            String eventId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedOwnerType)
                || !StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
        }
        String normalizedEventId = resolveManagedOwnerEventId(
                normalizedOwnerType,
                normalizedOwnerId,
                eventId);
        if (!OWNER_TYPE_EVENT.equals(normalizedOwnerType)
                && StringUtils.hasText(normalizedEventId)
                && isEventAdminUser(normalizedEventId, normalizedActorUserId)) {
            return true;
        }
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)) {
            ActivityEvent eventRecord = findPreferredEventRecord(normalizedOwnerId);
            if (eventRecord != null) {
                if (normalizedActorUserId.equals(normalizeId(eventRecord.getCreatorUserId()))
                        || normalizeIds(eventRecord.getAdmins()).contains(normalizedActorUserId)) {
                    return true;
                }
            }
        } else if (OWNER_TYPE_ASSET.equals(normalizedOwnerType)) {
            Asset asset = assetsService.findAssetByAssetId(normalizedOwnerId).orElse(null);
            if (asset != null && normalizedActorUserId.equals(normalizeId(asset.getOwnerUserId()))) {
                return true;
            }
        }
        return loadOwnerDocuments(normalizedOwnerType, normalizedOwnerId).stream()
                .filter(Objects::nonNull)
                .filter(member -> normalizedActorUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getRole)
                .map(this::safeText)
                .anyMatch(MANAGER_ROLES::contains);
    }

    private String resolveManagedOwnerEventId(
            String ownerType,
            String ownerId,
            String eventId) {
        String normalizedEventId = normalizeId(eventId);
        if (StringUtils.hasText(normalizedEventId)) {
            int slotMarker = normalizedEventId.indexOf(":slot:");
            return slotMarker > 0 ? normalizedEventId.substring(0, slotMarker) : normalizedEventId;
        }
        if (!OWNER_TYPE_SUB_EVENT.equals(normalizeOwnerType(ownerType))) {
            return "";
        }
        SubEventCounterScope scope = subEventCounterScope(ownerId);
        return scope == null ? "" : scope.eventId();
    }

    private boolean isProtectedOwnerMember(String ownerType, String ownerId, String targetUserId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        if (!StringUtils.hasText(normalizedTargetUserId)) {
            return true;
        }
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)) {
            ActivityEvent eventRecord = findPreferredEventRecord(normalizedOwnerId);
            if (eventRecord != null && normalizedTargetUserId.equals(normalizeId(eventRecord.getCreatorUserId()))) {
                return true;
            }
        } else if (OWNER_TYPE_ASSET.equals(normalizedOwnerType)) {
            Asset asset = assetsService.findAssetByAssetId(normalizedOwnerId).orElse(null);
            if (asset != null && normalizedTargetUserId.equals(normalizeId(asset.getOwnerUserId()))) {
                return true;
            }
        }
        return loadOwnerDocuments(normalizedOwnerType, normalizedOwnerId).stream()
                .filter(Objects::nonNull)
                .filter(member -> normalizedTargetUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getRole)
                .map(this::safeText)
                .anyMatch(MANAGER_ROLES::contains);
    }

    private boolean isAssetOwnerUser(String assetId, String userId) {
        String normalizedAssetId = normalizeId(assetId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedAssetId) || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return assetsService.findAssetByAssetId(normalizedAssetId)
                .map(Asset::getOwnerUserId)
                .map(this::normalizeId)
                .filter(normalizedUserId::equals)
                .isPresent();
    }

    private boolean hasAcceptedManagerSuccessor(
            List<ActivityMember> members,
            String targetUserId,
            String ownerType,
            String ownerId) {
        String normalizedTargetUserId = normalizeId(targetUserId);
        return (members == null ? List.<ActivityMember>of() : members).stream()
                .filter(Objects::nonNull)
                .filter(member -> !normalizedTargetUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .map(member -> resolveStoredRole(member, ownerType, ownerId))
                .anyMatch(MANAGER_ROLES::contains);
    }

    private void postMemberActionChatMessage(String eventId, String action, ActivityMember member) {
        if (!StringUtils.hasText(normalizeId(eventId)) || member == null) {
            return;
        }
        Users user = usersRepository.findByUserId(normalizeId(member.getUserId())).orElse(null);
        String displayName = firstNonBlank(user == null ? null : user.getName(), normalizeId(member.getUserId()));
        String text = ACTION_REINSTATE.equals(action)
                ? displayName + " was reinstated to the event."
                : displayName + " was disqualified from the event.";
        chatService.postSystemMessage(eventId, text, "member-" + action);
    }

    private List<ActivityMember> joinedAcceptedEventMembers(
            String ownerType,
            String ownerId,
            List<ActivityMember> nextDocuments,
            Map<String, ActivityMember> existingByUserId) {
        if (!OWNER_TYPE_EVENT.equals(ownerType) || nextDocuments == null || nextDocuments.isEmpty()) {
            return List.of();
        }
        return nextDocuments.stream()
                .filter(Objects::nonNull)
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .filter(member -> !isAdminRoleForOwner(ownerType, resolveStoredRole(member, ownerType, ownerId)))
                .filter(member -> {
                    String userId = normalizeId(member.getUserId());
                    ActivityMember existing = existingByUserId.get(userId);
                    return existing == null || !STATUS_ACCEPTED.equals(normalizeStatus(existing.getStatus()));
                })
                .toList();
    }

    private void postEventMembershipChangeMessages(
            String eventId,
            List<ActivityMember> joinedMembers,
            List<ActivityMember> removedMembers,
            String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId) || chatService == null) {
            return;
        }
        ActivityEvent event = findPreferredEventRecord(normalizedEventId);
        List<String> acceptedUserIds = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId).stream()
                .filter(Objects::nonNull)
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (event != null && !acceptedUserIds.isEmpty()) {
            chatService.ensureMainEventChat(event, acceptedUserIds);
        }
        for (ActivityMember member : joinedMembers == null ? List.<ActivityMember>of() : joinedMembers) {
            String displayName = memberDisplayName(member);
            if (StringUtils.hasText(displayName)) {
                chatService.postSystemMessage(normalizedEventId, displayName + " joined the event.", "member-joined");
            }
        }
        for (ActivityMember member : removedMembers == null ? List.<ActivityMember>of() : removedMembers) {
            if (member == null || !STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))) {
                continue;
            }
            String displayName = memberDisplayName(member);
            if (StringUtils.hasText(displayName)) {
                boolean removedByAnotherUser = !normalizeId(member.getUserId()).equals(normalizeId(actorUserId));
                chatService.postSystemMessage(
                        normalizedEventId,
                        removedByAnotherUser
                                ? displayName + " was removed from the event."
                                : displayName + " left the event.",
                        removedByAnotherUser ? "member-removed" : "member-left");
            }
        }
    }

    private void notifyRemovedEventMembers(
            String eventId,
            List<ActivityMember> removedMembers,
            String actorUserId,
            String removedAtIso) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)
                || removedMembers == null
                || removedMembers.isEmpty()) {
            return;
        }
        ActivityEvent event = findPreferredEventRecord(normalizedEventId);
        if (event == null) {
            return;
        }
        OwnerMembersSnapshot remainingMembers = queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        List<String> remainingAcceptedUserIds = remainingMembers == null
                ? List.of()
                : remainingMembers.acceptedMemberUserIds();
        for (ActivityMember member : removedMembers) {
            if (member == null || !STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))) {
                continue;
            }
            eventInviteNotificationService.notifyEventMemberRemoved(
                    event,
                    normalizeId(member.getUserId()),
                    memberDisplayName(member),
                    removedAtIso,
                    actorUserId,
                    remainingAcceptedUserIds);
        }
    }

    private void notifyEventMemberStatusChanged(
            String eventId,
            ActivityMember member,
            String action,
            String actorUserId,
            String changedAtIso) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId) || member == null) {
            return;
        }
        ActivityEvent event = findPreferredEventRecord(normalizedEventId);
        if (event == null) {
            return;
        }
        OwnerMembersSnapshot activeMembers = queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        eventInviteNotificationService.notifyEventMemberStatusChanged(
                event,
                normalizeId(member.getUserId()),
                memberDisplayName(member),
                ACTION_DISQUALIFY.equals(action) ? "disqualified" : "reinstated",
                changedAtIso,
                actorUserId,
                activeMembers == null ? List.of() : activeMembers.acceptedMemberUserIds());
    }

    private List<String> eventAcceptanceRecipientUserIds(
            String eventId,
            ActivityEvent event,
            String excludedUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedExcludedUserId = normalizeId(excludedUserId);
        LinkedHashSet<String> recipientUserIds = new LinkedHashSet<>(resolveEventAdminUserIds(event));
        boolean memberListOpen = event == null
                || !"Blind Event".equalsIgnoreCase(safeText(event.getBlindMode()));
        loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId).stream()
                .filter(Objects::nonNull)
                .filter(member -> !isHiddenMembershipStatus(member.getStatus()))
                .filter(member -> memberListOpen || MANAGER_ROLES.contains(resolveStoredRole(
                        member,
                        OWNER_TYPE_EVENT,
                        normalizedEventId)))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(recipientUserIds::add);
        recipientUserIds.remove(normalizedExcludedUserId);
        return List.copyOf(recipientUserIds);
    }

    private List<String> eventJoinedRecipientUserIds(
            String eventId,
            ActivityEvent event,
            String excludedUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedExcludedUserId = normalizeId(excludedUserId);
        LinkedHashSet<String> recipientUserIds = new LinkedHashSet<>(resolveEventAdminUserIds(event));
        boolean memberListOpen = event == null
                || !"Blind Event".equalsIgnoreCase(safeText(event.getBlindMode()));
        loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId).stream()
                .filter(Objects::nonNull)
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .filter(member -> memberListOpen || MANAGER_ROLES.contains(resolveStoredRole(
                        member,
                        OWNER_TYPE_EVENT,
                        normalizedEventId)))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(recipientUserIds::add);
        recipientUserIds.remove(normalizedExcludedUserId);
        return List.copyOf(recipientUserIds);
    }

    private String memberDisplayName(ActivityMember member) {
        String userId = normalizeId(member == null ? null : member.getUserId());
        if (!StringUtils.hasText(userId)) {
            return "";
        }
        Users user = usersRepository.findByUserId(userId).orElse(null);
        return firstNonBlank(user == null ? null : user.getName(), userId);
    }

    private void refreshEmbeddedEventMembers(String eventId) {
        refreshEmbeddedEventMembers(eventId, true);
    }

    private void refreshEmbeddedEventMembersBatch(Collection<String> eventIds) {
        LinkedHashSet<String> normalizedEventIds = eventIds == null
                ? new LinkedHashSet<>()
                : eventIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
        if (normalizedEventIds.isEmpty()) {
            return;
        }

        Map<String, List<ActivityEvent>> documentsBySourceId = new LinkedHashMap<>();
        List<ActivityEvent> documents = activityEventsRepository.findBySourceIdIn(normalizedEventIds);
        for (ActivityEvent document : documents == null ? List.<ActivityEvent>of() : documents) {
            String sourceId = normalizeId(document == null ? null : document.getSourceId());
            if (StringUtils.hasText(sourceId) && normalizedEventIds.contains(sourceId)) {
                documentsBySourceId.computeIfAbsent(sourceId, ignored -> new ArrayList<>()).add(document);
            }
        }
        if (documentsBySourceId.isEmpty()) {
            return;
        }

        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (Map.Entry<String, List<ActivityEvent>> entry : documentsBySourceId.entrySet()) {
            ActivityEvent preferred = preferredEventRecord(entry.getValue());
            if (preferred != null) {
                preferredBySourceId.put(entry.getKey(), preferred);
            }
        }
        Map<String, OwnerMembersSnapshot> snapshotsBySourceId =
                buildBatchEventSnapshots(preferredBySourceId);
        List<ActivityEvent> documentsToSave = new ArrayList<>();
        for (Map.Entry<String, List<ActivityEvent>> entry : documentsBySourceId.entrySet()) {
            OwnerMembersSnapshot snapshot = snapshotsBySourceId.get(entry.getKey());
            int acceptedMembers = snapshot == null ? 0 : snapshot.acceptedMembers();
            int pendingMembers = snapshot == null ? 0 : snapshot.pendingMembers();
            List<String> acceptedMemberUserIds =
                    snapshot == null ? List.of() : snapshot.acceptedMemberUserIds();
            List<String> pendingMemberUserIds =
                    snapshot == null ? List.of() : snapshot.pendingMemberUserIds();
            List<String> invitedMemberUserIds =
                    snapshot == null ? List.of() : snapshot.invitedMemberUserIds();
            List<String> pendingRequestMemberUserIds =
                    snapshot == null ? List.of() : snapshot.pendingRequestMemberUserIds();
            LinkedHashSet<String> adminUserIds = snapshot == null
                    ? new LinkedHashSet<>()
                    : new LinkedHashSet<>(snapshot.adminUserIds());

            for (ActivityEvent document : entry.getValue()) {
                if (document == null) {
                    continue;
                }
                document.setAcceptedMembers(acceptedMembers);
                document.setPendingMembers(pendingMembers);
                document.setAcceptedMemberUserIds(acceptedMemberUserIds);
                document.setPendingMemberUserIds(pendingMemberUserIds);
                document.setInvitedMemberUserIds(invitedMemberUserIds);
                document.setPendingRequestMemberUserIds(pendingRequestMemberUserIds);
                document.setAdmins(new ArrayList<>(adminUserIds));
                document.setCapacityTotal(Math.max(
                        acceptedMembers,
                        snapshot == null || snapshot.capacityTotal() == null
                                ? Math.max(
                                        acceptedMembers,
                                        document.getCapacityTotal() == null
                                                ? 0
                                                : document.getCapacityTotal())
                                : snapshot.capacityTotal()));
                document.setFull(resolveDirectEventFull(document));
                documentsToSave.add(document);
            }
        }
        if (documentsToSave.isEmpty()) {
            return;
        }
        List<ActivityEvent> savedDocuments = activityEventsRepository.saveAll(documentsToSave);
        eventSlotReadModelService.refreshForChangedEvents(savedDocuments);
        documentsBySourceId.keySet().forEach(
                eventId -> affinityRecomputeTaskService.enqueueEventMembersChanged(eventId, "system"));
    }

    private void refreshEmbeddedEventMembers(String eventId, boolean refreshDependentModels) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return;
        }

        List<ActivityEvent> documents = activityEventsRepository.findBySourceId(normalizedEventId).stream()
                .filter(Objects::nonNull)
                .toList();
        if (documents.isEmpty()) {
            return;
        }

        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        int acceptedMembers = snapshot == null ? 0 : snapshot.acceptedMembers();
        int pendingMembers = snapshot == null ? 0 : snapshot.pendingMembers();
        List<String> acceptedMemberUserIds = snapshot == null ? List.of() : snapshot.acceptedMemberUserIds();
        List<String> pendingMemberUserIds = snapshot == null ? List.of() : snapshot.pendingMemberUserIds();
        List<String> invitedMemberUserIds = snapshot == null ? List.of() : snapshot.invitedMemberUserIds();
        List<String> pendingRequestMemberUserIds = snapshot == null ? List.of() : snapshot.pendingRequestMemberUserIds();
        LinkedHashSet<String> adminUserIds = snapshot == null
                ? new LinkedHashSet<>()
                : new LinkedHashSet<>(snapshot.adminUserIds());

        List<ActivityEvent> documentsToSave = new ArrayList<>();
        for (ActivityEvent document : documents) {
            if (document == null) {
                continue;
            }
            document.setAcceptedMembers(acceptedMembers);
            document.setPendingMembers(pendingMembers);
            document.setAcceptedMemberUserIds(acceptedMemberUserIds);
            document.setPendingMemberUserIds(pendingMemberUserIds);
            document.setInvitedMemberUserIds(invitedMemberUserIds);
            document.setPendingRequestMemberUserIds(pendingRequestMemberUserIds);
            document.setAdmins(new ArrayList<>(adminUserIds));
            document.setCapacityTotal(Math.max(
                    acceptedMembers,
                    snapshot == null || snapshot.capacityTotal() == null
                            ? Math.max(acceptedMembers, document.getCapacityTotal() == null ? 0 : document.getCapacityTotal())
                            : snapshot.capacityTotal()));
            document.setFull(resolveDirectEventFull(document));
            documentsToSave.add(document);
        }
        if (!documentsToSave.isEmpty()) {
            List<ActivityEvent> savedDocuments = activityEventsRepository.saveAll(documentsToSave);
            if (refreshDependentModels) {
                eventSlotReadModelService.refreshForChangedEvents(savedDocuments);
                affinityRecomputeTaskService.enqueueEventMembersChanged(normalizedEventId, "system");
            }
        }
    }

    private record EventAdminLeavePlan(boolean allowed, String successorAdminUserId) {
        private static EventAdminLeavePlan denied() {
            return new EventAdminLeavePlan(false, null);
        }

        private static EventAdminLeavePlan allowedWithoutTransfer() {
            return new EventAdminLeavePlan(true, null);
        }

        private static EventAdminLeavePlan allowedWithTransfer(String successorAdminUserId) {
            return new EventAdminLeavePlan(true, successorAdminUserId);
        }
    }

    public void refreshSubEventParticipationProjection(String eventId, String subEventId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId)) {
            return;
        }
        refreshEmbeddedSubEventMembers(
                normalizedEventId,
                normalizedSubEventId,
                normalizedEventId + ":" + normalizedSubEventId);
    }

    private SubEventCounterScope subEventCounterScope(String ownerId) {
        String normalizedOwnerId = normalizeId(ownerId);
        int subEventSeparator = normalizedOwnerId.lastIndexOf(':');
        if (subEventSeparator <= 0 || subEventSeparator >= normalizedOwnerId.length() - 1) {
            return null;
        }
        String runtimeEventId = normalizedOwnerId.substring(0, subEventSeparator);
        String subEventId = normalizedOwnerId.substring(subEventSeparator + 1);
        int slotMarker = runtimeEventId.indexOf(":slot:");
        String eventId = slotMarker > 0
                ? runtimeEventId.substring(0, slotMarker)
                : runtimeEventId;
        return StringUtils.hasText(eventId) && StringUtils.hasText(subEventId)
                ? new SubEventCounterScope(eventId, subEventId)
                : null;
    }

    private void refreshEmbeddedSubEventMembers(String eventId, String subEventId, String ownerId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(normalizedOwnerId)) {
            return;
        }

        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(OWNER_TYPE_SUB_EVENT, normalizedOwnerId);
        int acceptedMembers = snapshot == null ? 0 : snapshot.acceptedMembers();
        int pendingMembers = snapshot == null ? 0 : snapshot.pendingMembers();
        List<ActivityEvent> documentsToSave = new ArrayList<>();
        for (ActivityEvent document : activityEventsRepository.findBySourceId(normalizedEventId)) {
            if (document == null || document.getSubEvents() == null) {
                continue;
            }
            boolean changed = false;
            List<SubEventItem> nextSubEvents = new ArrayList<>();
            for (SubEventItem item : document.getSubEvents()) {
                if (item != null && normalizedSubEventId.equals(normalizeId(item.id()))) {
                    nextSubEvents.add(item.withMemberCounts(acceptedMembers, pendingMembers));
                    changed = true;
                } else {
                    nextSubEvents.add(item);
                }
            }
            if (changed) {
                document.setSubEvents(nextSubEvents);
                documentsToSave.add(document);
            }
        }
        if (!documentsToSave.isEmpty()) {
            List<ActivityEvent> savedDocuments = activityEventsRepository.saveAll(documentsToSave);
            eventSlotReadModelService.refreshForChangedEvents(savedDocuments);
        }
    }

    private record SubEventCounterScope(String eventId, String subEventId) {
    }

    private boolean resolveDirectEventFull(ActivityEvent document) {
        if (document == null) {
            return false;
        }
        int capacityTotal = Math.max(0, document.getCapacityTotal() == null ? 0 : document.getCapacityTotal());
        int acceptedMembers = Math.max(0, document.getAcceptedMembers() == null ? 0 : document.getAcceptedMembers());
        return capacityTotal > 0 && acceptedMembers >= capacityTotal;
    }

    private String normalizeStatus(String status) {
        String normalizedStatus = safeText(status);
        if (STATUS_INVITED.equals(normalizedStatus)) {
            return STATUS_INVITED;
        }
        if (STATUS_PENDING.equals(normalizedStatus)) {
            return STATUS_PENDING;
        }
        if (STATUS_DELETED.equals(normalizedStatus)) {
            return STATUS_DELETED;
        }
        if (STATUS_REMOVED.equals(normalizedStatus)) {
            return STATUS_REMOVED;
        }
        if (STATUS_SUPPRESSED.equals(normalizedStatus)) {
            return STATUS_SUPPRESSED;
        }
        if (STATUS_DISQUALIFIED.equals(normalizedStatus)) {
            return STATUS_DISQUALIFIED;
        }
        return STATUS_ACCEPTED;
    }

    private boolean isHiddenMembershipStatus(String status) {
        return HIDDEN_MEMBERSHIP_STATUSES.contains(normalizeStatus(status));
    }

    private boolean isInvitationMembership(ActivityMember member) {
        String pendingSource = safeText(member == null ? null : member.getPendingSource());
        String requestKind = safeText(member == null ? null : member.getRequestKind());
        return "admin".equals(pendingSource)
                || REQUEST_KIND_INVITE.equals(requestKind)
                || REQUEST_KIND_WAITLIST_INVITE.equals(requestKind);
    }

    private boolean isAdminApprovalMembership(ActivityMember member) {
        if (member == null || !STATUS_PENDING.equals(normalizeStatus(member.getStatus()))) {
            return false;
        }
        return !isInvitationMembership(member);
    }

    private String normalizeMemberAction(String action) {
        String normalizedAction = safeText(action).toLowerCase(Locale.ROOT);
        if (ACTION_DISQUALIFY.equals(normalizedAction)) {
            return ACTION_DISQUALIFY;
        }
        if (ACTION_REINSTATE.equals(normalizedAction)) {
            return ACTION_REINSTATE;
        }
        if (ACTION_ACCEPT.equals(normalizedAction)) {
            return ACTION_ACCEPT;
        }
        if (ACTION_REMOVE.equals(normalizedAction)) {
            return ACTION_REMOVE;
        }
        if (ACTION_PROMOTE_ADMIN.equals(normalizedAction)) {
            return ACTION_PROMOTE_ADMIN;
        }
        if (ACTION_STEP_DOWN_ADMIN.equals(normalizedAction)) {
            return ACTION_STEP_DOWN_ADMIN;
        }
        if (ACTION_SET_ORGANIZER_ONLY.equals(normalizedAction)) {
            return ACTION_SET_ORGANIZER_ONLY;
        }
        if (ACTION_SET_PARTICIPANT.equals(normalizedAction)) {
            return ACTION_SET_PARTICIPANT;
        }
        return "";
    }

    private Set<String> normalizeIds(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return Set.of();
        }
        return values.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private String resolvePendingSource(String pendingSource, String status) {
        if (!STATUS_PENDING.equals(status)) {
            return null;
        }
        String normalizedPendingSource = safeText(pendingSource);
        return "member".equals(normalizedPendingSource) ? "member" : "admin";
    }

    private String resolveRequestKind(String requestKind, String status, String pendingSource) {
        if (!STATUS_PENDING.equals(status)) {
            return null;
        }
        String normalizedRequestKind = safeText(requestKind);
        if (REQUEST_KIND_JOIN.equals(normalizedRequestKind)) {
            return REQUEST_KIND_JOIN;
        }
        if (REQUEST_KIND_INVITE.equals(normalizedRequestKind)) {
            return REQUEST_KIND_INVITE;
        }
        if (REQUEST_KIND_APPROVAL.equals(normalizedRequestKind)) {
            return REQUEST_KIND_APPROVAL;
        }
        if (REQUEST_KIND_WAITLIST.equals(normalizedRequestKind)) {
            return REQUEST_KIND_WAITLIST;
        }
        if (REQUEST_KIND_WAITLIST_INVITE.equals(normalizedRequestKind)) {
            return REQUEST_KIND_WAITLIST_INVITE;
        }
        return "member".equals(pendingSource) ? REQUEST_KIND_JOIN : REQUEST_KIND_INVITE;
    }

    private String resolveInvitedByUserId(ActivityMemberEntryDto entry, ActivityMember current, String actorUserId) {
        if (entry == null) {
            return current != null && StringUtils.hasText(current.getInvitedByUserId())
                    ? current.getInvitedByUserId().trim()
                    : null;
        }
        String status = normalizeStatus(entry.status());
        String pendingSource = resolvePendingSource(entry.pendingSource(), status);
        String requestKind = resolveRequestKind(entry.requestKind(), status, pendingSource);
        if (!STATUS_PENDING.equals(status)) {
            return null;
        }
        if (current != null
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isInvitationMembership(current)
                && StringUtils.hasText(current.getInvitedByUserId())) {
            return current.getInvitedByUserId().trim();
        }
        if (REQUEST_KIND_APPROVAL.equals(requestKind)) {
            String explicitInvitedByUserId = normalizeId(entry.invitedByUserId());
            if (StringUtils.hasText(explicitInvitedByUserId)) {
                return explicitInvitedByUserId;
            }
            return current != null && StringUtils.hasText(current.getInvitedByUserId())
                    ? current.getInvitedByUserId().trim()
                    : null;
        }
        if (!(REQUEST_KIND_INVITE.equals(requestKind) || REQUEST_KIND_WAITLIST_INVITE.equals(requestKind))) {
            return null;
        }
        if (StringUtils.hasText(actorUserId)) {
            return actorUserId;
        }
        String explicitInvitedByUserId = normalizeId(entry.invitedByUserId());
        if (StringUtils.hasText(explicitInvitedByUserId)) {
            return explicitInvitedByUserId;
        }
        if (current != null && StringUtils.hasText(current.getInvitedByUserId())) {
            return current.getInvitedByUserId().trim();
        }
        return null;
    }

    private String resolveCreatedUser(ActivityMember member, String actorUserId) {
        if (StringUtils.hasText(actorUserId)) {
            return actorUserId;
        }
        return normalizeId(member == null ? null : member.getUserId());
    }

    private String resolveUpdatedUser(String actorUserId, ActivityMember member, ActivityMember current) {
        if (StringUtils.hasText(actorUserId)) {
            return actorUserId;
        }
        if (current != null && StringUtils.hasText(current.getUpdatedUser())) {
            return current.getUpdatedUser().trim();
        }
        return normalizeId(member == null ? null : member.getUserId());
    }

    private String resolveActorUserId(String preferredUserId) {
        String actorUserId = homeUserProfileService.resolveSelectedUserId(preferredUserId);
        return StringUtils.hasText(actorUserId) ? actorUserId : normalizeId(preferredUserId);
    }

    private ActivityMember cloneMember(ActivityMember source) {
        ActivityMember clone = new ActivityMember();
        clone.setId(source.getId());
        clone.setSyncKey(source.getSyncKey());
        clone.setOwnerType(source.getOwnerType());
        clone.setOwnerId(source.getOwnerId());
        clone.setUserId(source.getUserId());
        clone.setRole(source.getRole());
        clone.setStatus(source.getStatus());
        clone.setStatusBeforeSuppression(source.getStatusBeforeSuppression());
        clone.setSuppressionRootOwnerId(source.getSuppressionRootOwnerId());
        clone.setSuppressedAtIso(source.getSuppressedAtIso());
        clone.setPendingSource(source.getPendingSource());
        clone.setRequestKind(source.getRequestKind());
        clone.setInvitedByUserId(source.getInvitedByUserId());
        clone.setEventVipInvitation(source.getEventVipInvitation());
        clone.setEventVipAcceptedAtIso(source.getEventVipAcceptedAtIso());
        clone.setEventVipOfferedAtIso(source.getEventVipOfferedAtIso());
        clone.setEventVipOfferedPricing(source.getEventVipOfferedPricing());
        clone.setEventVipPriceAudit(source.getEventVipPriceAudit());
        clone.setManagerGrantedByUserId(source.getManagerGrantedByUserId());
        clone.setOrganizerOnly(source.getOrganizerOnly());
        clone.setMetAtIso(source.getMetAtIso());
        clone.setActionAtIso(source.getActionAtIso());
        clone.setMetWhere(source.getMetWhere());
        clone.setAttendanceStatus(source.getAttendanceStatus());
        clone.setCheckedInAtIso(source.getCheckedInAtIso());
        clone.setCheckedInByUserId(source.getCheckedInByUserId());
        clone.setCheckedInTicketId(source.getCheckedInTicketId());
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
    }

    private String memberRevision(ActivityMember member) {
        String updatedDate = safeText(member == null ? null : member.getUpdatedDate());
        if (StringUtils.hasText(updatedDate)) {
            return updatedDate;
        }
        String actionAtIso = safeText(member == null ? null : member.getActionAtIso());
        if (StringUtils.hasText(actionAtIso)) {
            return actionAtIso;
        }
        return safeText(member == null ? null : member.getId());
    }

    private String nullableText(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeGender(String value) {
        return "woman".equals(safeText(value)) ? "woman" : "man";
    }

    private String resolveAvatarUrl(Users user) {
        if (user == null || user.getImages() == null || user.getImages().isEmpty()) {
            return "";
        }
        return safeText(user.getImages().get(0));
    }

    private String initialsFromText(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return "";
        }
        String[] parts = normalizedValue.split("\\s+");
        StringBuilder initials = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(Character.toUpperCase(part.charAt(0)));
            }
            if (initials.length() >= 2) {
                break;
            }
        }
        return initials.toString();
    }

    private String defaultStatusText(
            String status,
            String requestKind,
            String pendingSource,
            String ownerType) {
        if (STATUS_ACCEPTED.equals(status)) {
            return "Recently Active";
        }
        if (STATUS_DELETED.equals(status)) {
            return "No longer active in this event.";
        }
        if (STATUS_REMOVED.equals(status)) {
            return "Removed from this tournament group.";
        }
        if (STATUS_DISQUALIFIED.equals(status)) {
            return "Disqualified from this event.";
        }
        if (REQUEST_KIND_WAITLIST.equals(requestKind)) {
            return "Waiting for a spot.";
        }
        if (REQUEST_KIND_WAITLIST_INVITE.equals(requestKind)) {
            return "Invitation pending.";
        }
        if (REQUEST_KIND_APPROVAL.equals(requestKind) || REQUEST_KIND_JOIN.equals(requestKind) || "member".equals(pendingSource)) {
            return OWNER_TYPE_ASSET.equals(normalizeOwnerType(ownerType))
                    ? "Waiting for owner approval."
                    : "Waiting for admin approval.";
        }
        return "Invitation pending.";
    }

    private String normalizeDateTime(String value, String fallback) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : fallback;
    }

    private long toSortableDate(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return 0L;
        }
        try {
            return Instant.parse(normalizedValue).toEpochMilli();
        } catch (Exception ignored) {
            return 0L;
        }
    }

    public record StoredMemberState(String status, String name) {
    }

    public record OwnerMembersSnapshot(
            String ownerType,
            String ownerId,
            List<ActivityMember> members,
            List<String> acceptedMemberUserIds,
            List<String> capacityOccupyingAcceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> invitedMemberUserIds,
            List<String> pendingRequestMemberUserIds,
            Set<String> adminUserIds,
            Integer capacityTotal,
            boolean mutationApplied) {
        public OwnerMembersSnapshot(
                String ownerType,
                String ownerId,
                List<ActivityMember> members,
                List<String> acceptedMemberUserIds,
                List<String> capacityOccupyingAcceptedMemberUserIds,
                List<String> pendingMemberUserIds,
                List<String> invitedMemberUserIds,
                List<String> pendingRequestMemberUserIds,
                Set<String> adminUserIds,
                Integer capacityTotal) {
            this(
                    ownerType,
                    ownerId,
                    members,
                    acceptedMemberUserIds,
                    capacityOccupyingAcceptedMemberUserIds,
                    pendingMemberUserIds,
                    invitedMemberUserIds,
                    pendingRequestMemberUserIds,
                    adminUserIds,
                    capacityTotal,
                    false);
        }

        public OwnerMembersSnapshot withMutationApplied(boolean applied) {
            if (mutationApplied == applied) {
                return this;
            }
            return new OwnerMembersSnapshot(
                    ownerType,
                    ownerId,
                    members,
                    acceptedMemberUserIds,
                    capacityOccupyingAcceptedMemberUserIds,
                    pendingMemberUserIds,
                    invitedMemberUserIds,
                    pendingRequestMemberUserIds,
                    adminUserIds,
                    capacityTotal,
                    applied);
        }

        public int acceptedMembers() {
            return capacityOccupyingAcceptedMemberUserIds.size();
        }

        public int pendingMembers() {
            return pendingMemberUserIds.size();
        }

        public boolean hasParticipation(String userId) {
            String normalizedUserId = userId == null ? "" : userId.trim();
            return acceptedMemberUserIds.contains(normalizedUserId) || pendingMemberUserIds.contains(normalizedUserId);
        }

        public boolean hasInvitation(String userId) {
            String normalizedUserId = userId == null ? "" : userId.trim();
            return invitedMemberUserIds.contains(normalizedUserId);
        }

        public boolean hasPendingRequest(String userId) {
            String normalizedUserId = userId == null ? "" : userId.trim();
            return pendingRequestMemberUserIds.contains(normalizedUserId);
        }

        public boolean hasAcceptedAdminRole(String userId) {
            String normalizedUserId = userId == null ? "" : userId.trim();
            return adminUserIds.contains(normalizedUserId);
        }

        public ActivityMembersSummaryDto toSummaryDto() {
            return new ActivityMembersSummaryDto(
                    ownerType,
                    ownerId,
                    acceptedMembers(),
                    pendingMembers(),
                    Math.max(acceptedMembers(), capacityTotal == null ? 0 : capacityTotal),
                    acceptedMemberUserIds,
                    pendingMemberUserIds);
        }
    }
}
