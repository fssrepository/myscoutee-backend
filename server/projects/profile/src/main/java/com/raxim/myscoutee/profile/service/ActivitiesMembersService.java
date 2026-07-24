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

import org.bson.types.ObjectId;
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
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersSummariesRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberInvolvementDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMembersSummaryDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@Service
public class ActivitiesMembersService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_SUB_EVENT = "subEvent";
    private static final String OWNER_TYPE_GROUP = "group";
    private static final String OWNER_TYPE_ASSET = "asset";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String STATUS_PENDING = "pending";
    private static final String STATUS_INVITED = "I";
    private static final String STATUS_DELETED = "deleted";
    private static final String RESOURCE_STATUS_DELETED = "D";
    private static final String STATUS_DISQUALIFIED = "disqualified";
    private static final String ACTION_ACCEPT = "accept";
    private static final String ACTION_REMOVE = "remove";
    private static final String ACTION_DISQUALIFY = "disqualify";
    private static final String ACTION_REINSTATE = "reinstate";
    private static final String ACTION_PROMOTE_ADMIN = "promote-admin";
    private static final String ACTION_STEP_DOWN_ADMIN = "step-down-admin";
    private static final String REQUEST_KIND_JOIN = "join";
    private static final String REQUEST_KIND_INVITE = "invite";
    private static final String REQUEST_KIND_APPROVAL = "approval";
    private static final String REQUEST_KIND_WAITLIST = "waitlist";
    private static final String REQUEST_KIND_WAITLIST_INVITE = "waitlist-invite";
    private static final Set<String> OWNER_TYPES = Set.of("event", "subEvent", "group", "asset");
    private static final Set<String> ACCEPTED_STATUSES = Set.of(STATUS_ACCEPTED);
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
    private final EventInviteNotificationService eventInviteNotificationService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;
    private final ChatService chatService;
    private final EventSlotReadModelService eventSlotReadModelService;
    private final AccessControlService accessControlService;
    private final UserActivityCountersService userActivityCountersService;
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
            EventInviteNotificationService eventInviteNotificationService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService,
            ChatService chatService,
            EventSlotReadModelService eventSlotReadModelService,
            AccessControlService accessControlService,
            UserActivityCountersService userActivityCountersService) {
        this.activityMembersRepository = activityMembersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.assetsService = assetsService;
        this.activitiesResourcesService = activitiesResourcesService;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.eventInviteNotificationService = eventInviteNotificationService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.chatService = chatService;
        this.eventSlotReadModelService = eventSlotReadModelService;
        this.accessControlService = accessControlService;
        this.userActivityCountersService = userActivityCountersService;
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
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)
                && !accessControlService.canCurrentActorViewEventMembers(normalizedOwnerId)) {
            return List.of();
        }

        String viewerUserId = homeUserProfileService.resolveSelectedUserId(null);
        boolean scopedAssetMembers = OWNER_TYPE_ASSET.equals(normalizedOwnerType)
                && StringUtils.hasText(normalizeId(eventId))
                && StringUtils.hasText(normalizeId(subEventId));
        List<ActivityMember> ownerMembers;
        if (scopedAssetMembers) {
            ownerMembers = loadScopedAssetDocuments(normalizedOwnerId, eventId, subEventId, pendingOnly);
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
                .filter(member -> !STATUS_DELETED.equals(normalizeStatus(member == null ? null : member.getStatus())))
                .toList();
        Map<String, List<ActivityMemberInvolvementDto>> involvementsByUserId = memberInvolvementsByUserId(
                normalizedOwnerType,
                normalizedOwnerId,
                ownerMembers);
        return ownerMembers.stream()
                .map(member -> toEntryDto(member, viewerUserId))
                .filter(Objects::nonNull)
                .map(entry -> withInvolvements(entry, involvementsByUserId.getOrDefault(normalizeId(entry.userId()), List.of())))
                .toList();
    }

    private List<ActivityMember> loadScopedAssetDocuments(
            String assetId,
            String eventId,
            String subEventId,
            Boolean pendingOnly) {
        Asset asset = assetsService.findAssetByAssetIdWithScopedRequests(
                assetId,
                eventId,
                subEventId,
                Boolean.TRUE.equals(pendingOnly) ? STATUS_PENDING : null).orElse(null);
        if (asset == null) {
            return List.of();
        }

        Map<String, ActivityMember> membersByUserId = new LinkedHashMap<>();
        if (!Boolean.TRUE.equals(pendingOnly)) {
            ActivityMember owner = scopedAssetOwnerMember(asset, eventId, subEventId);
            if (owner != null) {
                membersByUserId.put(normalizeId(owner.getUserId()), owner);
            }
        }
        for (Asset.AssetRequestRecord request : asset.getRequests() == null ? List.<Asset.AssetRequestRecord>of() : asset.getRequests()) {
            ActivityMember member = scopedAssetRequestMember(asset, request);
            String memberUserId = normalizeId(member == null ? null : member.getUserId());
            if (StringUtils.hasText(memberUserId) && !memberUserId.equals(normalizeId(asset.getOwnerUserId()))) {
                membersByUserId.put(memberUserId, member);
            }
        }
        return membersByUserId.values().stream()
                .sorted(this::compareMembersForManagement)
                .toList();
    }

    private ActivityMember scopedAssetOwnerMember(Asset asset, String eventId, String subEventId) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        String ownerUserId = normalizeId(asset == null ? null : asset.getOwnerUserId());
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(ownerUserId)) {
            return null;
        }
        ActivityMember member = new ActivityMember();
        member.setSyncKey("asset-scope-owner:" + assetId + ":" + normalizeId(eventId) + ":" + normalizeId(subEventId));
        member.setOwnerType(OWNER_TYPE_ASSET);
        member.setOwnerId(assetId);
        member.setUserId(ownerUserId);
        member.setRole("Manager");
        member.setStatus(STATUS_ACCEPTED);
        member.setActionAtIso(normalizeDateTime(asset.getUpdatedDate(), normalizeDateTime(asset.getCreatedDate(), Instant.now().toString())));
        member.setMetAtIso(member.getActionAtIso());
        member.setMetWhere(firstNonBlank(asset.getCity(), asset.getTitle()));
        return member;
    }

    private ActivityMember scopedAssetRequestMember(Asset asset, Asset.AssetRequestRecord request) {
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
        member.setRole("Member");
        member.setStatus(status);
        if (STATUS_PENDING.equals(status)) {
            boolean borrowerInitiated = "borrow".equalsIgnoreCase(safeText(request.requestKind()));
            member.setPendingSource(borrowerInitiated ? "member" : "admin");
            member.setRequestKind(borrowerInitiated ? REQUEST_KIND_JOIN : REQUEST_KIND_INVITE);
        }
        String requestedAtIso = normalizeDateTime(request.requestedAtIso(), Instant.now().toString());
        member.setActionAtIso(requestedAtIso);
        member.setMetAtIso(requestedAtIso);
        member.setMetWhere(safeText(asset.getTitle()));
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
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, normalizedUserId)) {
            if (member == null) {
                continue;
            }
            String status = normalizeStatus(member.getStatus());
            if (!STATUS_ACCEPTED.equals(status)
                    && !STATUS_PENDING.equals(status)
                    && !STATUS_INVITED.equals(status)
                    && !(includeDeleted && STATUS_DELETED.equals(status))) {
                continue;
            }
            String ownerId = normalizeId(member.getOwnerId());
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
                .filter(member -> !STATUS_DELETED.equals(normalizeStatus(member.getStatus())))
                .sorted(this::compareMembersForManagement)
                .toList();
        List<String> acceptedUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
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
                pendingUserIds,
                invitedUserIds,
                pendingRequestUserIds,
                adminUserIds,
                capacityTotal);
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
            String assetOwnerUserId = assetsService.syncScopedRequestsFromMemberEntries(
                    ownerId,
                    scopedEventId,
                    scopedSubEventId,
                    safeMembers(request.members()));
            if (StringUtils.hasText(assetOwnerUserId)) {
                activitiesResourcesService.refreshGroupRuntimeResourceMetrics(
                        scopedEventId,
                        scopedSubEventId,
                        assetOwnerUserId,
                        actorUserId);
            }
            return;
        }
        if (OWNER_TYPE_EVENT.equals(ownerType) && !accessControlService.canManageEventMembers(ownerId, actorUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Authenticated user is not allowed to replace members for this event.");
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
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            validateEventMemberReplacement(ownerId, actorUserId, request.members(), existingByUserId);
        } else {
            validateManagedOwnerMemberReplacement(ownerType, ownerId, request.members(), existingByUserId);
        }

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
                .filter(member -> !STATUS_DELETED.equals(normalizeStatus(member.getStatus())))
                .toList();
        List<ActivityMember> removedMembers = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> !retainedUserIds.contains(normalizeId(member.getUserId())))
                .map(member -> toDeletedMember(member, actorUserId, nowIso))
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
            eventParticipationTicketService.syncParticipationTicketsForEvent(ownerId);
            refreshEmbeddedEventMembers(ownerId);
            postEventMembershipChangeMessages(ownerId, joinedEventMembers, removedVisibleMembers);
            userActivityCountersService.refreshEventCountersForSourceIds(List.of(ownerId));
        }
        if (OWNER_TYPE_SUB_EVENT.equals(ownerType)
                && StringUtils.hasText(scopedEventId)
                && StringUtils.hasText(scopedSubEventId)) {
            refreshEmbeddedSubEventMembers(scopedEventId, scopedSubEventId, ownerId);
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
        if (!StringUtils.hasText(ownerType)
                || !StringUtils.hasText(ownerId)
                || !StringUtils.hasText(actorUserId)
                || !StringUtils.hasText(targetUserId)
                || !StringUtils.hasText(action)) {
            return queryMembers(ownerType, ownerId);
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            if (!canApplyEventMemberAction(ownerId, actorUserId, targetUserId, action)) {
                return queryMembers(ownerType, ownerId);
            }
            if (ACTION_REMOVE.equals(action) && actorUserId.equals(targetUserId)) {
                removeEventParticipation(ownerId, targetUserId, actorUserId);
                return queryMembers(ownerType, ownerId);
            }
        }
        List<ActivityMember> existing = loadOwnerDocuments(ownerType, ownerId);
        ActivityMember current = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> targetUserId.equals(normalizeId(member.getUserId())))
                .findFirst()
                .orElse(null);
        if (current == null || STATUS_DELETED.equals(normalizeStatus(current.getStatus()))) {
            return queryMembers(ownerType, ownerId);
        }
        String currentRole = resolveStoredRole(current, ownerType, ownerId);
        boolean acceptingOwnManagedInvitation = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_ACCEPT.equals(action)
                && actorUserId.equals(targetUserId)
                && STATUS_PENDING.equals(normalizeStatus(current.getStatus()))
                && isInvitationMembership(current);
        boolean steppingDownOwnManagedRole = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_STEP_DOWN_ADMIN.equals(action)
                && actorUserId.equals(targetUserId)
                && STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                && MANAGER_ROLES.contains(currentRole)
                && hasAcceptedManagerSuccessor(existing, targetUserId, ownerType, ownerId);
        boolean leavingOwnManagedMembership = !OWNER_TYPE_EVENT.equals(ownerType)
                && ACTION_REMOVE.equals(action)
                && actorUserId.equals(targetUserId)
                && STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                && !MANAGER_ROLES.contains(currentRole)
                && !isProtectedOwnerMember(ownerType, ownerId, targetUserId);
        if (!OWNER_TYPE_EVENT.equals(ownerType)
                && !acceptingOwnManagedInvitation
                && !steppingDownOwnManagedRole
                && !leavingOwnManagedMembership
                && (!canManageOwnerMembers(ownerType, ownerId, actorUserId)
                    || actorUserId.equals(targetUserId)
                    || isProtectedOwnerMember(ownerType, ownerId, targetUserId))) {
            return queryMembers(ownerType, ownerId);
        }

        String currentStatus = normalizeStatus(current.getStatus());
        String nextStatus;
        if (ACTION_ACCEPT.equals(action)) {
            if (!STATUS_PENDING.equals(currentStatus)
                    || (!acceptingOwnManagedInvitation && !isAdminApprovalMembership(current))) {
                return queryMembers(ownerType, ownerId);
            }
            nextStatus = STATUS_ACCEPTED;
        } else if (ACTION_REMOVE.equals(action)) {
            nextStatus = STATUS_DELETED;
        } else if (ACTION_DISQUALIFY.equals(action)) {
            if (!STATUS_ACCEPTED.equals(currentStatus)) {
                return queryMembers(ownerType, ownerId);
            }
            nextStatus = STATUS_DISQUALIFIED;
        } else if (ACTION_REINSTATE.equals(action)) {
            if (!STATUS_DISQUALIFIED.equals(currentStatus)) {
                return queryMembers(ownerType, ownerId);
            }
            nextStatus = STATUS_ACCEPTED;
        } else if (ACTION_PROMOTE_ADMIN.equals(action)) {
            if (!STATUS_ACCEPTED.equals(currentStatus) || "Admin".equals(safeText(current.getRole()))) {
                return queryMembers(ownerType, ownerId);
            }
            nextStatus = STATUS_ACCEPTED;
        } else if (ACTION_STEP_DOWN_ADMIN.equals(action)) {
            if (!STATUS_ACCEPTED.equals(currentStatus) || !MANAGER_ROLES.contains(currentRole)) {
                return queryMembers(ownerType, ownerId);
            }
            nextStatus = STATUS_ACCEPTED;
        } else {
            return queryMembers(ownerType, ownerId);
        }

        String nowIso = Instant.now().toString();
        ActivityMember next = STATUS_DELETED.equals(nextStatus)
                ? toDeletedMember(current, actorUserId, nowIso)
                : cloneMember(current);
        if (!STATUS_DELETED.equals(nextStatus)) {
            next.setStatus(nextStatus);
            next.setPendingSource(null);
            next.setRequestKind(null);
            next.setInvitedByUserId(null);
            next.setActionAtIso(nowIso);
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveUpdatedUser(actorUserId, next, current));
        }
        if (ACTION_PROMOTE_ADMIN.equals(action)) {
            next.setRole("Admin");
        } else if (ACTION_STEP_DOWN_ADMIN.equals(action)) {
            next.setRole("Member");
        }
        activityMembersRepository.save(next);

        enqueueOwnerMembersChanged(ownerType, ownerId, actorUserId);
        adminTelemetryService.record(
                memberActionTelemetry(action),
                ownerType,
                ownerId,
                actorUserId,
                1L,
                Map.of("targetUserId", targetUserId));

        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            if (ACTION_REMOVE.equals(action)) {
                cascadeRemovedEventMembersFromAssignedAssets(ownerId, List.of(current), actorUserId, nowIso);
                Set<String> removedManagedAssetIds = activitiesResourcesService
                        .removeManagedResourcesForRemovedEventMembers(ownerId, List.of(current), actorUserId, nowIso);
                clearRemovedManagedAssetMembers(removedManagedAssetIds, actorUserId, nowIso);
                processEventWaitlist(ownerId, findPreferredEventRecord(ownerId), true);
            }
            eventParticipationTicketService.syncParticipationTicketsForEvent(ownerId);
            refreshEmbeddedEventMembers(ownerId);
            if (ACTION_ACCEPT.equals(action)) {
                postEventMembershipChangeMessages(ownerId, List.of(next), List.of());
            } else if (ACTION_REMOVE.equals(action)) {
                postEventMembershipChangeMessages(ownerId, List.of(), List.of(current));
            } else if (ACTION_DISQUALIFY.equals(action) || ACTION_REINSTATE.equals(action)) {
                postMemberActionChatMessage(ownerId, action, next);
            }
            userActivityCountersService.refreshEventCountersForSourceIds(List.of(ownerId));
        } else if (OWNER_TYPE_SUB_EVENT.equals(ownerType)) {
            SubEventCounterScope scope = subEventCounterScope(ownerId);
            if (scope != null) {
                refreshEmbeddedSubEventMembers(scope.eventId(), scope.subEventId(), ownerId);
            }
        } else if (OWNER_TYPE_ASSET.equals(ownerType)) {
            assetsService.syncRequestsFromMembers(ownerId, List.of(next));
        }

        return queryMembers(ownerType, ownerId);
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
        if (current != null && ACCEPTED_STATUSES.contains(normalizeStatus(current.getStatus()))) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }
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
            current.setRole(normalizeRole(current.getRole(), viewerUserId, OWNER_TYPE_EVENT, normalizedEventId));
            current.setStatus(accepted ? STATUS_ACCEPTED : "pending");
            current.setPendingSource(accepted ? null : "member");
            current.setRequestKind(accepted ? null : pendingJoinRequestKind(waitingList, approvalRequested));
            current.setInvitedByUserId(null);
            current.setActionAtIso(nowIso);
            current.setMetAtIso(normalizeDateTime(current.getMetAtIso(), nowIso));
            current.setMetWhere(safeText(current.getMetWhere()));
            current.setUpdatedDate(nowIso);
            current.setUpdatedUser(viewerUserId);
            activityMembersRepository.save(current);
            enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, normalizedEventId, viewerUserId);
            adminTelemetryService.record("event.member.joined", "events", normalizedEventId, viewerUserId);
            if (accepted) {
                processEventWaitlist(normalizedEventId, eventRecord, true);
            }
            eventParticipationTicketService.syncParticipationTicketsForEvent(normalizedEventId);
            refreshEmbeddedEventMembers(normalizedEventId);
            userActivityCountersService.refreshEventCountersForSourceIds(List.of(normalizedEventId));
        }
        return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }
    }

    public OwnerMembersSnapshot removeEventParticipation(String eventId, String userId, String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
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
            if (current == null || STATUS_DELETED.equals(normalizeStatus(current.getStatus()))) {
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
            ActivityMember deletedMember = toDeletedMember(current, normalizedActorUserId, nowIso);
            activityMembersRepository.save(deletedMember);
            enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, normalizedEventId, normalizedActorUserId);
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
                processEventWaitlist(normalizedEventId, findPreferredEventRecord(normalizedEventId), true);
                postEventMembershipChangeMessages(normalizedEventId, List.of(), List.of(current));
            }
            eventParticipationTicketService.syncParticipationTicketsForEvent(normalizedEventId);
            refreshEmbeddedEventMembers(normalizedEventId);
            userActivityCountersService.refreshEventCountersForSourceIds(List.of(normalizedEventId));
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }
    }

    private Object eventJoinLock(String eventId) {
        return eventJoinLocks.computeIfAbsent(eventId, ignored -> new Object());
    }

    private boolean isCapacityFullForJoin(ActivityEvent eventRecord, List<ActivityMember> existing, String joiningUserId) {
        int capacityTotal = Math.max(0, eventRecord == null || eventRecord.getCapacityTotal() == null ? 0 : eventRecord.getCapacityTotal());
        if (capacityTotal <= 0) {
            return false;
        }
        long acceptedMembers = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> !joiningUserId.equals(normalizeId(member.getUserId())))
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .count();
        return acceptedMembers >= capacityTotal;
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
        String nowIso = Instant.now().toString();
        String metWhere = safeText(eventRecord == null ? null : eventRecord.getLocation());

        List<ActivityMember> existing = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId);
        Map<String, ActivityMember> existingByUserId = new LinkedHashMap<>();
        for (ActivityMember member : existing) {
            if (member != null && StringUtils.hasText(normalizeId(member.getUserId()))) {
                existingByUserId.put(normalizeId(member.getUserId()), member);
            }
        }

        List<ActivityMember> membersToSave = new ArrayList<>();
        List<String> newlyInvitedUserIds = new ArrayList<>();
        for (String userId : normalizeUserIds(invitedUserIds)) {
            ActivityMember current = existingByUserId.get(userId);
            if (current != null && !STATUS_DELETED.equals(normalizeStatus(current.getStatus()))) {
                continue;
            }

            ActivityMember next = current == null ? new ActivityMember() : cloneMember(current);
            next.setId(current == null ? new ObjectId().toHexString() : current.getId());
            next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey())
                    ? current.getSyncKey().trim()
                    : UUID.randomUUID().toString());
            next.setOwnerType(OWNER_TYPE_EVENT);
            next.setOwnerId(normalizedEventId);
            next.setUserId(userId);
            next.setRole(normalizeRole(current == null ? null : current.getRole(), userId, OWNER_TYPE_EVENT, normalizedEventId));
            next.setStatus(STATUS_PENDING);
            next.setPendingSource("admin");
            next.setRequestKind("invite");
            next.setInvitedByUserId(StringUtils.hasText(actorUserId) ? actorUserId : null);
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
            enqueueOwnerMembersChanged(OWNER_TYPE_EVENT, normalizedEventId, actorUserId);
            adminTelemetryService.record("event.member.invited", "events", normalizedEventId, actorUserId, membersToSave.size());
            eventParticipationTicketService.syncParticipationTicketsForEvent(normalizedEventId);
            refreshEmbeddedEventMembers(normalizedEventId);
            userActivityCountersService.refreshEventCountersForSourceIds(List.of(normalizedEventId));
        }
        return newlyInvitedUserIds;
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
        String normalizedGroupId = normalizeId(groupId);
        if (!StringUtils.hasText(normalizedGroupId)) {
            return List.of();
        }

        String normalizedActorUserId = resolveActorUserId(actorUserId);
        String nowIso = Instant.now().toString();
        List<ActivityMember> existing = loadOwnerDocuments("group", normalizedGroupId);
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
            ActivityMember next = current == null ? new ActivityMember() : cloneMember(current);
            next.setId(current == null ? new ObjectId().toHexString() : current.getId());
            next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey())
                    ? current.getSyncKey().trim()
                    : UUID.randomUUID().toString());
            next.setOwnerType("group");
            next.setOwnerId(normalizedGroupId);
            next.setUserId(userId);
            next.setRole(normalizeRole(current == null ? null : current.getRole(), userId, "group", normalizedGroupId));
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
                    || STATUS_DELETED.equals(normalizeStatus(member == null ? null : member.getStatus()))) {
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

    private void validateManagedOwnerMemberReplacement(
            String ownerType,
            String ownerId,
            List<ActivityMemberEntryDto> requestedMembers,
            Map<String, ActivityMember> existingByUserId) {
        if (existingByUserId == null || existingByUserId.isEmpty()) {
            return;
        }
        Map<String, ActivityMemberEntryDto> requestedByUserId = new LinkedHashMap<>();
        for (ActivityMemberEntryDto entry : safeMembers(requestedMembers)) {
            String userId = normalizeId(entry == null ? null : entry.userId());
            if (StringUtils.hasText(userId)) {
                requestedByUserId.put(userId, entry);
            }
        }
        for (Map.Entry<String, ActivityMember> existingEntry : existingByUserId.entrySet()) {
            ActivityMember current = existingEntry.getValue();
            if (current == null
                    || !STATUS_ACCEPTED.equals(normalizeStatus(current.getStatus()))
                    || !MANAGER_ROLES.contains(resolveStoredRole(current, ownerType, ownerId))) {
                continue;
            }
            ActivityMemberEntryDto requested = requestedByUserId.get(existingEntry.getKey());
            boolean removed = requested == null
                    || !STATUS_ACCEPTED.equals(normalizeStatus(requested.status()));
            boolean roleChanged = requested != null
                    && !resolveStoredRole(current, ownerType, ownerId).equals(safeText(requested.role()));
            if (removed || roleChanged) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "An admin or manager must use a managed step-down or ownership-transfer action.");
            }
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
                .filter(member -> !STATUS_DELETED.equals(normalizeStatus(member.getStatus())))
                .sorted(this::compareMembersForManagement)
                .toList();
        List<String> acceptedUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
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
                pendingUserIds,
                invitedUserIds,
                pendingRequestUserIds,
                adminUserIds,
                resolveCapacityTotal(ownerType, ownerId));
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

        Set<String> assignedAssetIds = resolveAssignedAssetIdsForEvent(eventId);
        if (assignedAssetIds.isEmpty()) {
            return;
        }

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

    private Set<String> resolveAssignedAssetIdsForEvent(String eventId) {
        LinkedHashSet<String> assignedAssetIds = new LinkedHashSet<>();
        for (ActivitySubEventResource resource : loadEventResourceRecords(eventId)) {
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

    private int processEventWaitlist(String eventId, ActivityEvent eventRecord, boolean promoteSingle) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return 0;
        }

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
            demoteWaitlistInvitations(normalizedEventId, storedMembers);
            return 0;
        }

        List<ActivityMember> waitingMembers = storedMembers.stream()
                .filter(Objects::nonNull)
                .filter(member -> STATUS_PENDING.equals(normalizeStatus(member.getStatus())))
                .filter(member -> REQUEST_KIND_WAITLIST.equals(resolveRequestKind(member.getRequestKind(), STATUS_PENDING, resolvePendingSource(member.getPendingSource(), STATUS_PENDING))))
                .sorted(Comparator
                        .comparing((ActivityMember member) -> toSortableDate(member.getActionAtIso()))
                        .thenComparing(member -> toSortableDate(member.getCreatedDate()))
                        .thenComparing(member -> safeText(member.getSyncKey())))
                .toList();
        if (waitingMembers.isEmpty()) {
            return 0;
        }

        int promotionLimit = promoteSingle ? 1 : waitingMembers.size();
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
        eventInviteNotificationService.notifyInvitees(preferredEventRecord, promotedUserIds);
        refreshEmbeddedEventMembers(normalizedEventId);
        return promotedUserIds.size();
    }

    private void demoteWaitlistInvitations(String eventId, List<ActivityMember> members) {
        List<ActivityMember> membersToSave = new ArrayList<>();
        String nowIso = Instant.now().toString();
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            if (member == null || !STATUS_PENDING.equals(normalizeStatus(member.getStatus()))) {
                continue;
            }
            String pendingSource = resolvePendingSource(member.getPendingSource(), STATUS_PENDING);
            String requestKind = resolveRequestKind(member.getRequestKind(), STATUS_PENDING, pendingSource);
            if (!REQUEST_KIND_WAITLIST_INVITE.equals(requestKind)) {
                continue;
            }
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

    private ActivityMemberEntryDto toEntryDto(ActivityMember member, String viewerUserId) {
        if (member == null || !StringUtils.hasText(normalizeId(member.getUserId()))) {
            return null;
        }
        Users user = usersRepository.findByUserId(normalizeId(member.getUserId())).orElse(null);
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
                defaultStatusText(status, requestKind, pendingSource),
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
                List.of());
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
                involvements == null ? List.of() : List.copyOf(involvements));
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
        List<ActivityMember> involvementRecords = activityMembersRepository.findInvolvementRecordsByUserIdsAndOwnerScope(
                userIds,
                STATUS_DELETED,
                ownerType,
                ownerId,
                ownerIdRegex);
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
        if (ACTION_ACCEPT.equals(action)) {
            return accessControlService.canAcceptEventMember(ownerId, actorUserId, targetUserId);
        }
        if (ACTION_REMOVE.equals(action)) {
            if (normalizeId(actorUserId).equals(normalizeId(targetUserId))) {
                return canSelfLeaveEvent(ownerId, targetUserId);
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
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedOwnerType)
                || !StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
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
            List<ActivityMember> removedMembers) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId) || chatService == null) {
            return;
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
                chatService.postSystemMessage(normalizedEventId, displayName + " left the event.", "member-left");
            }
        }
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
            String creatorUserId = normalizeId(document.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                adminUserIds.add(creatorUserId);
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
            eventSlotReadModelService.refreshForChangedEvents(savedDocuments);
            affinityRecomputeTaskService.enqueueEventMembersChanged(normalizedEventId, "system");
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
        if (STATUS_DISQUALIFIED.equals(normalizedStatus)) {
            return STATUS_DISQUALIFIED;
        }
        return STATUS_ACCEPTED;
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
        if (!STATUS_PENDING.equals(status)
                || !(REQUEST_KIND_INVITE.equals(requestKind) || REQUEST_KIND_WAITLIST_INVITE.equals(requestKind))) {
            return null;
        }
        String explicitInvitedByUserId = normalizeId(entry.invitedByUserId());
        if (StringUtils.hasText(explicitInvitedByUserId)) {
            return explicitInvitedByUserId;
        }
        if (Boolean.TRUE.equals(entry.invitedByActiveUser()) && StringUtils.hasText(actorUserId)) {
            return actorUserId;
        }
        if (current != null && StringUtils.hasText(current.getInvitedByUserId())) {
            return current.getInvitedByUserId().trim();
        }
        return StringUtils.hasText(actorUserId) ? actorUserId : null;
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
        clone.setPendingSource(source.getPendingSource());
        clone.setRequestKind(source.getRequestKind());
        clone.setInvitedByUserId(source.getInvitedByUserId());
        clone.setMetAtIso(source.getMetAtIso());
        clone.setActionAtIso(source.getActionAtIso());
        clone.setMetWhere(source.getMetWhere());
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
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

    private String defaultStatusText(String status, String requestKind, String pendingSource) {
        if (STATUS_ACCEPTED.equals(status)) {
            return "Recently Active";
        }
        if (STATUS_DELETED.equals(status)) {
            return "No longer active in this event.";
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
            return "Waiting for admin approval.";
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

    public record OwnerMembersSnapshot(
            String ownerType,
            String ownerId,
            List<ActivityMember> members,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> invitedMemberUserIds,
            List<String> pendingRequestMemberUserIds,
            Set<String> adminUserIds,
            Integer capacityTotal) {
        public int acceptedMembers() {
            return acceptedMemberUserIds.size();
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
