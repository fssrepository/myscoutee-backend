package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMembersSummariesRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.ActivitiesEventSyncPayloadDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMembersSummaryDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class ActivitiesMembersService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String STATUS_PENDING = "pending";
    private static final String STATUS_DELETED = "deleted";
    private static final Set<String> OWNER_TYPES = Set.of("event", "subEvent", "group", "asset");
    private static final Set<String> ACCEPTED_STATUSES = Set.of(STATUS_ACCEPTED);
    private static final Set<String> ADMIN_ROLES = Set.of("Admin");

    private final ActivityMembersRepository activityMembersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    private final UsersRepository usersRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final AssetsService assetsService;
    private final ActivitiesResourcesService activitiesResourcesService;
    private final EventParticipationTicketService eventParticipationTicketService;

    public ActivitiesMembersService(
            ActivityMembersRepository activityMembersRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivitySubEventResourcesRepository activitySubEventResourcesRepository,
            UsersRepository usersRepository,
            HomeUserProfileService homeUserProfileService,
            AssetsService assetsService,
            ActivitiesResourcesService activitiesResourcesService,
            EventParticipationTicketService eventParticipationTicketService) {
        this.activityMembersRepository = activityMembersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.assetsService = assetsService;
        this.activitiesResourcesService = activitiesResourcesService;
        this.eventParticipationTicketService = eventParticipationTicketService;
    }

    public List<ActivityMemberEntryDto> queryMembers(String ownerType, String ownerId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }

        String viewerUserId = homeUserProfileService.resolveSelectedUserId(null);
        return mergeDerivedOwnerMembers(normalizedOwnerType, normalizedOwnerId, loadOwnerDocuments(normalizedOwnerType, normalizedOwnerId)).stream()
                .filter(member -> !STATUS_DELETED.equals(normalizeStatus(member == null ? null : member.getStatus())))
                .map(member -> toEntryDto(member, viewerUserId))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(entry -> toSortableDate(entry.actionAtIso())))
                .toList();
    }

    public List<ActivityMembersSummaryDto> querySummaries(ActivityMembersSummariesRequestDto request) {
        if (request == null || request.owners() == null || request.owners().isEmpty()) {
            return List.of();
        }

        List<ActivityMembersSummaryDto> summaries = new ArrayList<>();
        for (ActivityMemberOwnerRefDto owner : request.owners()) {
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
                mergeDerivedOwnerMembers(normalizedOwnerType, normalizedOwnerId, loadOwnerDocuments(normalizedOwnerType, normalizedOwnerId)));
    }

    public boolean hasAcceptedAdminRole(String ownerType, String ownerId, String userId) {
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(ownerType, ownerId);
        return snapshot != null && snapshot.hasAcceptedAdminRole(userId);
    }

    public boolean hasParticipation(String ownerType, String ownerId, String userId) {
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(ownerType, ownerId);
        return snapshot != null && snapshot.hasParticipation(userId);
    }

    public void refreshEventParticipationProjection(String eventId) {
        refreshEmbeddedEventMembers(eventId);
    }

    public Set<String> findTrackedEventSourceIdsForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return Set.of();
        }
        return activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, normalizedUserId).stream()
                .filter(Objects::nonNull)
                .filter(member -> !STATUS_DELETED.equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
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
        for (ActivitySubEventResource resource : activitySubEventResourcesRepository.findByOwnerIdIn(allSourceIds)) {
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

            // Bootstrap if empty (matches loadOwnerDocuments behavior)
            if (rawMembers.isEmpty() && eventRecord != null) {
                List<ActivityMember> bootstrapped = bootstrapEventMembers(eventRecord);
                if (!bootstrapped.isEmpty()) {
                    activityMembersRepository.saveAll(bootstrapped);
                    rawMembers = bootstrapped;
                }
            }

            List<ActivitySubEventResource> resources = resourcesByOwnerId.getOrDefault(sourceId, List.of());
            List<ActivityMember> merged = mergeDerivedEventMembersBatch(sourceId, rawMembers, eventRecord, resources);
            result.put(sourceId, toOwnerSnapshotBatch(OWNER_TYPE_EVENT, sourceId, merged, eventRecord, resources));
        }
        return result;
    }

    private List<ActivityMember> mergeDerivedEventMembersBatch(
            String eventId,
            List<ActivityMember> members,
            ActivityEvent eventRecord,
            List<ActivitySubEventResource> resources) {
        String defaultActionAtIso = normalizeDateTime(
                eventRecord == null ? null : eventRecord.getStartAtIso(),
                Instant.now().toString());
        String metWhere = safeText(eventRecord == null ? null : eventRecord.getLocation());
        String createdByUserId = eventRecord == null ? null : normalizeId(eventRecord.getCreatorUserId());
        Map<String, ActivityMember> visibleByUserId = new LinkedHashMap<>();
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            if (member == null || STATUS_DELETED.equals(normalizeStatus(member.getStatus()))) {
                continue;
            }
            String memberUserId = normalizeId(member.getUserId());
            if (!StringUtils.hasText(memberUserId)) {
                continue;
            }
            visibleByUserId.put(memberUserId, cloneMember(member));
        }

        Set<String> adminUserIds = resolveEventAdminUserIds(eventRecord);
        for (String adminUserId : adminUserIds) {
            upsertDerivedEventMember(visibleByUserId, eventId, adminUserId, "Admin", defaultActionAtIso, metWhere, createdByUserId);
        }

        Map<String, String> managerActionAtByUserId = resolveEventManagerActionAtFromResources(resources);
        for (Map.Entry<String, String> managerEntry : managerActionAtByUserId.entrySet()) {
            if (adminUserIds.contains(managerEntry.getKey())) {
                continue;
            }
            upsertDerivedEventMember(
                    visibleByUserId,
                    eventId,
                    managerEntry.getKey(),
                    "Manager",
                    normalizeDateTime(managerEntry.getValue(), defaultActionAtIso),
                    metWhere,
                    createdByUserId);
        }

        return new ArrayList<>(visibleByUserId.values());
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
                .sorted(Comparator.comparing(ActivityMember::getActionAtIso, Comparator.nullsLast(String::compareTo)))
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

        String actorUserId = resolveActorUserId(null);
        String nowIso = Instant.now().toString();
        List<ActivityMember> existing = loadOwnerDocuments(ownerType, ownerId);
        List<ActivityMember> existingVisibleMembers = mergeDerivedOwnerMembers(ownerType, ownerId, existing);
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

        nextDocuments = ensureOwnerAdminMembership(ownerType, ownerId, nextDocuments, existingByUserId, actorUserId, nowIso);
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
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            cascadeRemovedEventMembersFromAssignedAssets(ownerId, removedVisibleMembers, actorUserId, nowIso);
            Set<String> removedManagedAssetIds = activitiesResourcesService
                    .removeManagedResourcesForRemovedEventMembers(ownerId, removedVisibleMembers, actorUserId, nowIso);
            clearRemovedManagedAssetMembers(removedManagedAssetIds, actorUserId, nowIso);
            eventParticipationTicketService.syncParticipationTicketsForEvent(ownerId);
            refreshEmbeddedEventMembers(ownerId);
        }
        if (OWNER_TYPE_ASSET.equals(ownerType)) {
            assetsService.syncRequestsFromMembers(ownerId, membersToSave);
        }
    }

    public void sync(ActivitiesEventSyncPayloadDto request) {
        if (request == null) {
            return;
        }
        String ownerId = normalizeId(request.id());
        if (!StringUtils.hasText(ownerId)) {
            return;
        }

        String ownerType = OWNER_TYPE_EVENT;
        String creatorUserId = resolveActorUserId(request.creatorUserId());
        String nowIso = Instant.now().toString();
        List<ActivityMember> existing = loadOwnerDocuments(ownerType, ownerId);
        Map<String, ActivityMember> existingByUserId = new LinkedHashMap<>();
        for (ActivityMember member : existing) {
            if (member != null && StringUtils.hasText(normalizeId(member.getUserId()))) {
                existingByUserId.put(normalizeId(member.getUserId()), member);
            }
        }

        LinkedHashSet<String> acceptedUserIds = new LinkedHashSet<>(normalizeUserIds(request.acceptedMemberUserIds()));
        LinkedHashSet<String> pendingUserIds = new LinkedHashSet<>(normalizeUserIds(request.pendingMemberUserIds()));
        if (StringUtils.hasText(creatorUserId)) {
            acceptedUserIds.add(creatorUserId);
            pendingUserIds.remove(creatorUserId);
        }

        List<ActivityMember> nextDocuments = new ArrayList<>();
        for (String userId : acceptedUserIds) {
            ActivityMember current = existingByUserId.get(userId);
            ActivityMember next = current == null ? new ActivityMember() : cloneMember(current);
            next.setId(current == null ? new ObjectId().toHexString() : current.getId());
            next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
            next.setOwnerType(ownerType);
            next.setOwnerId(ownerId);
            next.setUserId(userId);
            next.setRole(userId.equals(creatorUserId) ? "Admin" : normalizeRole(current == null ? null : current.getRole(), userId, ownerType, ownerId));
            next.setStatus("accepted");
            next.setPendingSource(null);
            next.setRequestKind(null);
            next.setInvitedByUserId(current == null ? null : current.getInvitedByUserId());
            String actionAtIso = current != null ? normalizeDateTime(current.getActionAtIso(), nowIso) : normalizeDateTime(request.startAt(), nowIso);
            next.setActionAtIso(actionAtIso);
            next.setMetAtIso(current != null ? normalizeDateTime(current.getMetAtIso(), actionAtIso) : actionAtIso);
            next.setMetWhere(current == null ? safeText(request.location()) : safeText(current.getMetWhere()));
            next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
            next.setCreatedUser(current == null ? resolveCreatedUser(next, creatorUserId) : safeText(current.getCreatedUser()));
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveUpdatedUser(creatorUserId, next, current));
            nextDocuments.add(next);
        }

        for (String userId : pendingUserIds) {
            ActivityMember current = existingByUserId.get(userId);
            ActivityMember next = current == null ? new ActivityMember() : cloneMember(current);
            next.setId(current == null ? new ObjectId().toHexString() : current.getId());
            next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
            next.setOwnerType(ownerType);
            next.setOwnerId(ownerId);
            next.setUserId(userId);
            next.setRole(normalizeRole(current == null ? null : current.getRole(), userId, ownerType, ownerId));
            next.setStatus("pending");
            next.setPendingSource(resolvePendingSource(current == null ? null : current.getPendingSource(), "pending"));
            next.setRequestKind(resolveRequestKind(current == null ? null : current.getRequestKind(), "pending", next.getPendingSource()));
            String invitedByUserId = current != null && StringUtils.hasText(current.getInvitedByUserId())
                    ? current.getInvitedByUserId().trim()
                    : safeText(creatorUserId);
            next.setInvitedByUserId(invitedByUserId);
            String requestedStartAt = request == null ? null : request.startAt();
            String requestedLocation = request == null ? null : request.location();
            String actionAtIso = current != null ? normalizeDateTime(current.getActionAtIso(), nowIso) : normalizeDateTime(requestedStartAt, nowIso);
            next.setActionAtIso(actionAtIso);
            next.setMetAtIso(current != null ? normalizeDateTime(current.getMetAtIso(), actionAtIso) : actionAtIso);
            next.setMetWhere(current == null ? safeText(requestedLocation) : safeText(current.getMetWhere()));
            next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
            next.setCreatedUser(current == null ? resolveCreatedUser(next, creatorUserId) : safeText(current.getCreatedUser()));
            next.setUpdatedDate(nowIso);
            next.setUpdatedUser(resolveUpdatedUser(creatorUserId, next, current));
            nextDocuments.add(next);
        }

        Set<String> retainedUserIds = nextDocuments.stream()
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        List<ActivityMember> removedMembers = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> !retainedUserIds.contains(normalizeId(member.getUserId())))
                .map(member -> toDeletedMember(member, creatorUserId, nowIso))
                .toList();
        List<ActivityMember> membersToSave = new ArrayList<>(nextDocuments);
        membersToSave.addAll(removedMembers);
        if (!membersToSave.isEmpty()) {
            activityMembersRepository.saveAll(membersToSave);
        }
        eventParticipationTicketService.syncParticipationTicketsForEvent(ownerId);
        refreshEmbeddedEventMembers(ownerId);
    }

    public OwnerMembersSnapshot requestJoin(String eventId, Users viewer, ActivityEvent eventRecord) {
        return requestJoin(eventId, viewer, eventRecord, false);
    }

    public OwnerMembersSnapshot requestJoin(String eventId, Users viewer, ActivityEvent eventRecord, boolean accepted) {
        String normalizedEventId = normalizeId(eventId);
        String viewerUserId = viewer == null ? null : normalizeId(viewer.getId());
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(viewerUserId)) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }

        List<ActivityMember> existing = mergeDerivedOwnerMembers(
                OWNER_TYPE_EVENT,
                normalizedEventId,
                loadStoredOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId));
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
        if (isDerivedMember(current)) {
            current = null;
        }
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
        if (accepted || !ACCEPTED_STATUSES.contains(normalizeStatus(current.getStatus()))) {
            String nowIso = Instant.now().toString();
            current.setRole(normalizeRole(current.getRole(), viewerUserId, OWNER_TYPE_EVENT, normalizedEventId));
            current.setStatus(accepted ? STATUS_ACCEPTED : "pending");
            current.setPendingSource(accepted ? null : "member");
            current.setRequestKind(accepted ? null : "join");
            current.setInvitedByUserId(null);
            current.setActionAtIso(nowIso);
            current.setMetAtIso(normalizeDateTime(current.getMetAtIso(), nowIso));
            current.setMetWhere(safeText(current.getMetWhere()));
            current.setUpdatedDate(nowIso);
            current.setUpdatedUser(viewerUserId);
            activityMembersRepository.save(current);
            refreshEmbeddedEventMembers(normalizedEventId);
        }
        return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
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
        String nowIso = Instant.now().toString();
        String metWhere = safeText(eventRecord == null ? null : eventRecord.getLocation());

        List<ActivityMember> existing = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId, eventRecord);
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
            eventParticipationTicketService.syncParticipationTicketsForEvent(normalizedEventId);
            refreshEmbeddedEventMembers(normalizedEventId);
        }
        return newlyInvitedUserIds;
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
        return loadOwnerDocuments(ownerType, ownerId, null);
    }

    private List<ActivityMember> loadOwnerDocuments(String ownerType, String ownerId, ActivityEvent fallbackEventRecord) {
        List<ActivityMember> stored = loadStoredOwnerDocuments(ownerType, ownerId);
        if (!stored.isEmpty()) {
            return stored;
        }

        if (OWNER_TYPE_ASSET.equals(ownerType)) {
            List<ActivityMember> bootstrapped = bootstrapAssetMembers(ownerId);
            if (!bootstrapped.isEmpty()) {
                activityMembersRepository.saveAll(bootstrapped);
                return bootstrapped;
            }
            return List.of();
        }

        if (!OWNER_TYPE_EVENT.equals(ownerType)) {
            return stored;
        }

        ActivityEvent bootstrapSource = fallbackEventRecord != null
                ? fallbackEventRecord
                : findPreferredEventRecord(ownerId);
        if (bootstrapSource == null) {
            return List.of();
        }
        List<ActivityMember> bootstrapped = bootstrapEventMembers(bootstrapSource);
        if (!bootstrapped.isEmpty()) {
            activityMembersRepository.saveAll(bootstrapped);
            return bootstrapped;
        }
        return List.of();
    }

    private List<ActivityMember> loadStoredOwnerDocuments(String ownerType, String ownerId) {
        return activityMembersRepository.findByOwnerTypeAndOwnerId(ownerType, ownerId).stream()
                .filter(Objects::nonNull)
                .toList();
    }

    private List<ActivityMember> mergeDerivedOwnerMembers(String ownerType, String ownerId, List<ActivityMember> members) {
        if (!OWNER_TYPE_EVENT.equals(ownerType)) {
            return members == null ? List.of() : members;
        }
        return mergeDerivedEventMembers(ownerId, members);
    }

    private List<ActivityMember> mergeDerivedEventMembers(String eventId, List<ActivityMember> members) {
        ActivityEvent eventRecord = findPreferredEventRecord(eventId);
        String defaultActionAtIso = normalizeDateTime(
                eventRecord == null ? null : eventRecord.getStartAtIso(),
                Instant.now().toString());
        String metWhere = safeText(eventRecord == null ? null : eventRecord.getLocation());
        String createdByUserId = eventRecord == null ? null : normalizeId(eventRecord.getCreatorUserId());
        Map<String, ActivityMember> visibleByUserId = new LinkedHashMap<>();
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            if (member == null || STATUS_DELETED.equals(normalizeStatus(member.getStatus()))) {
                continue;
            }
            String memberUserId = normalizeId(member.getUserId());
            if (!StringUtils.hasText(memberUserId)) {
                continue;
            }
            visibleByUserId.put(memberUserId, cloneMember(member));
        }

        Set<String> adminUserIds = resolveEventAdminUserIds(eventRecord);
        for (String adminUserId : adminUserIds) {
            upsertDerivedEventMember(visibleByUserId, eventId, adminUserId, "Admin", defaultActionAtIso, metWhere, createdByUserId);
        }

        for (Map.Entry<String, String> managerEntry : resolveEventManagerActionAtByUserId(eventId).entrySet()) {
            if (adminUserIds.contains(managerEntry.getKey())) {
                continue;
            }
            upsertDerivedEventMember(
                    visibleByUserId,
                    eventId,
                    managerEntry.getKey(),
                    "Manager",
                    normalizeDateTime(managerEntry.getValue(), defaultActionAtIso),
                    metWhere,
                    createdByUserId);
        }

        return new ArrayList<>(visibleByUserId.values());
    }

    private void upsertDerivedEventMember(
            Map<String, ActivityMember> membersByUserId,
            String eventId,
            String userId,
            String role,
            String actionAtIso,
            String metWhere,
            String createdByUserId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }

        ActivityMember existing = membersByUserId.get(normalizedUserId);
        if (existing != null) {
            String existingStatus = normalizeStatus(existing.getStatus());
            if (STATUS_PENDING.equals(existingStatus)) {
                existing.setActionAtIso(normalizeDateTime(existing.getActionAtIso(), actionAtIso));
                existing.setMetAtIso(normalizeDateTime(existing.getMetAtIso(), existing.getActionAtIso()));
                if (!StringUtils.hasText(safeText(existing.getMetWhere()))) {
                    existing.setMetWhere(metWhere);
                }
                return;
            }
            existing.setRole(role);
            existing.setStatus(STATUS_ACCEPTED);
            existing.setPendingSource(null);
            existing.setRequestKind(null);
            existing.setInvitedByUserId(null);
            existing.setActionAtIso(normalizeDateTime(existing.getActionAtIso(), actionAtIso));
            existing.setMetAtIso(normalizeDateTime(existing.getMetAtIso(), existing.getActionAtIso()));
            if (!StringUtils.hasText(safeText(existing.getMetWhere()))) {
                existing.setMetWhere(metWhere);
            }
            return;
        }

        ActivityMember derived = new ActivityMember();
        String derivedId = "derived:" + eventId + ":" + normalizedUserId;
        derived.setId(derivedId);
        derived.setSyncKey(derivedId);
        derived.setOwnerType(OWNER_TYPE_EVENT);
        derived.setOwnerId(eventId);
        derived.setUserId(normalizedUserId);
        derived.setRole(role);
        derived.setStatus(STATUS_ACCEPTED);
        derived.setPendingSource(null);
        derived.setRequestKind(null);
        derived.setInvitedByUserId(null);
        derived.setActionAtIso(actionAtIso);
        derived.setMetAtIso(actionAtIso);
        derived.setMetWhere(metWhere);
        derived.setCreatedDate(actionAtIso);
        derived.setCreatedUser(StringUtils.hasText(createdByUserId) ? createdByUserId : normalizedUserId);
        derived.setUpdatedDate(actionAtIso);
        derived.setUpdatedUser(StringUtils.hasText(createdByUserId) ? createdByUserId : normalizedUserId);
        membersByUserId.put(normalizedUserId, derived);
    }

    private boolean isDerivedMember(ActivityMember member) {
        if (member == null) {
            return false;
        }
        return safeText(member.getId()).startsWith("derived:")
                || safeText(member.getSyncKey()).startsWith("derived:");
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
        return activitySubEventResourcesRepository.findByOwnerId(normalizedEventId).stream()
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
                .sorted(Comparator.comparing(ActivityMember::getActionAtIso, Comparator.nullsLast(String::compareTo)))
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
        Set<String> adminUserIds = ordered.stream()
                .filter(member -> ACCEPTED_STATUSES.contains(normalizeStatus(member.getStatus())))
                .filter(member -> ADMIN_ROLES.contains(resolveStoredRole(member, ownerType, ownerId)))
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
                adminUserIds,
                resolveCapacityTotal(ownerType, ownerId));
    }

    private List<ActivityMember> ensureOwnerAdminMembership(
            String ownerType,
            String ownerId,
            List<ActivityMember> nextDocuments,
            Map<String, ActivityMember> existingByUserId,
            String actorUserId,
            String nowIso) {
        if (!OWNER_TYPE_EVENT.equals(ownerType)) {
            if (!OWNER_TYPE_ASSET.equals(ownerType)) {
                return nextDocuments;
            }
        }
        ActivityEvent eventRecord = OWNER_TYPE_EVENT.equals(ownerType) ? findPreferredEventRecord(ownerId) : null;
        Asset assetRecord = OWNER_TYPE_ASSET.equals(ownerType) ? assetsService.findAssetByAssetId(ownerId).orElse(null) : null;
        String creatorUserId = OWNER_TYPE_EVENT.equals(ownerType)
                ? (eventRecord == null ? null : normalizeId(eventRecord.getCreatorUserId()))
                : (assetRecord == null ? null : normalizeId(assetRecord.getOwnerUserId()));
        if (!StringUtils.hasText(creatorUserId)) {
            return nextDocuments;
        }
        final String creatorId = Objects.requireNonNull(creatorUserId);
        String ownerRole = OWNER_TYPE_EVENT.equals(ownerType) ? "Admin" : "Manager";
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
        String ownerActionAtIso = OWNER_TYPE_EVENT.equals(ownerType)
                ? normalizeDateTime(eventRecord == null ? null : eventRecord.getStartAtIso(), nowIso)
                : normalizeDateTime(assetRecord == null ? null : assetRecord.getUpdatedDate(), normalizeDateTime(assetRecord == null ? null : assetRecord.getCreatedDate(), nowIso));
        String ownerMetWhere = OWNER_TYPE_EVENT.equals(ownerType)
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

    private List<ActivityMember> bootstrapAssetMembers(String assetId) {
        Asset asset = assetsService.findAssetByAssetId(assetId).orElse(null);
        if (asset == null || !StringUtils.hasText(normalizeId(asset.getAssetId()))) {
            return List.of();
        }

        String ownerId = normalizeId(asset.getAssetId());
        String ownerUserId = normalizeId(asset.getOwnerUserId());
        if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(ownerUserId)) {
            return List.of();
        }

        String createdDate = normalizeDateTime(asset.getCreatedDate(), Instant.now().toString());
        String updatedDate = normalizeDateTime(asset.getUpdatedDate(), createdDate);
        String actionAtIso = normalizeDateTime(updatedDate, createdDate);
        String metWhere = firstNonBlank(asset.getCity(), asset.getTitle());

        List<ActivityMember> nextDocuments = new ArrayList<>();

        ActivityMember ownerMembership = new ActivityMember();
        ownerMembership.setId(new ObjectId().toHexString());
        ownerMembership.setSyncKey(UUID.randomUUID().toString());
        ownerMembership.setOwnerType(OWNER_TYPE_ASSET);
        ownerMembership.setOwnerId(ownerId);
        ownerMembership.setUserId(ownerUserId);
        ownerMembership.setRole("Manager");
        ownerMembership.setStatus("accepted");
        ownerMembership.setPendingSource(null);
        ownerMembership.setRequestKind(null);
        ownerMembership.setInvitedByUserId(null);
        ownerMembership.setActionAtIso(actionAtIso);
        ownerMembership.setMetAtIso(actionAtIso);
        ownerMembership.setMetWhere(metWhere);
        ownerMembership.setCreatedDate(createdDate);
        ownerMembership.setCreatedUser(ownerUserId);
        ownerMembership.setUpdatedDate(updatedDate);
        ownerMembership.setUpdatedUser(ownerUserId);
        nextDocuments.add(ownerMembership);

        for (AssetRequestRecord request : safeAssetRequests(asset.getRequests())) {
            String memberUserId = normalizeId(request.userId());
            if (!StringUtils.hasText(memberUserId) || ownerUserId.equals(memberUserId)) {
                continue;
            }

            boolean accepted = "accepted".equals(safeText(request.status()));
            ActivityMember member = new ActivityMember();
            member.setId(new ObjectId().toHexString());
            member.setSyncKey(UUID.randomUUID().toString());
            member.setOwnerType(OWNER_TYPE_ASSET);
            member.setOwnerId(ownerId);
            member.setUserId(memberUserId);
            member.setRole("Member");
            member.setStatus(accepted ? "accepted" : "pending");
            member.setPendingSource(accepted ? null : "member");
            member.setRequestKind(accepted ? null : "join");
            member.setInvitedByUserId(null);
            member.setActionAtIso(actionAtIso);
            member.setMetAtIso(actionAtIso);
            member.setMetWhere(metWhere);
            member.setCreatedDate(createdDate);
            member.setCreatedUser(memberUserId);
            member.setUpdatedDate(updatedDate);
            member.setUpdatedUser(accepted ? ownerUserId : memberUserId);
            nextDocuments.add(member);
        }
        return nextDocuments;
    }

    private List<ActivityMember> bootstrapEventMembers(ActivityEvent record) {
        if (record == null || !StringUtils.hasText(normalizeId(record.getSourceId()))) {
            return List.of();
        }
        String ownerId = normalizeId(record.getSourceId());
        String creatorUserId = normalizeId(record.getCreatorUserId());
        String createdDate = normalizeDateTime(record.getCreatedDate(), normalizeDateTime(record.getStartAtIso(), Instant.now().toString()));
        String updatedDate = normalizeDateTime(record.getUpdatedDate(), createdDate);
        LinkedHashSet<String> acceptedUserIds = new LinkedHashSet<>();
        LinkedHashSet<String> pendingUserIds = new LinkedHashSet<>();
        acceptedUserIds.addAll(normalizeUserIds(record.getAcceptedMemberUserIds()));
        pendingUserIds.addAll(normalizeUserIds(record.getPendingMemberUserIds()));
        if (StringUtils.hasText(creatorUserId)) {
            acceptedUserIds.add(creatorUserId);
            pendingUserIds.remove(creatorUserId);
        }
        pendingUserIds.removeAll(acceptedUserIds);

        List<ActivityMember> nextDocuments = new ArrayList<>();
        for (String userId : acceptedUserIds) {
            ActivityMember member = new ActivityMember();
            member.setId(new ObjectId().toHexString());
            member.setSyncKey(UUID.randomUUID().toString());
            member.setOwnerType(OWNER_TYPE_EVENT);
            member.setOwnerId(ownerId);
            member.setUserId(userId);
            member.setRole(userId.equals(creatorUserId) ? "Admin" : "Member");
            member.setStatus("accepted");
            member.setPendingSource(null);
            member.setRequestKind(null);
            member.setInvitedByUserId(null);
            member.setActionAtIso(normalizeDateTime(record.getStartAtIso(), createdDate));
            member.setMetAtIso(normalizeDateTime(record.getStartAtIso(), member.getActionAtIso()));
            member.setMetWhere(safeText(record.getLocation()));
            member.setCreatedDate(createdDate);
            member.setCreatedUser(StringUtils.hasText(creatorUserId) ? creatorUserId : userId);
            member.setUpdatedDate(updatedDate);
            member.setUpdatedUser(StringUtils.hasText(safeText(record.getUpdatedUser())) ? safeText(record.getUpdatedUser()) : member.getCreatedUser());
            nextDocuments.add(member);
        }
        for (String userId : pendingUserIds) {
            ActivityMember member = new ActivityMember();
            member.setId(new ObjectId().toHexString());
            member.setSyncKey(UUID.randomUUID().toString());
            member.setOwnerType(OWNER_TYPE_EVENT);
            member.setOwnerId(ownerId);
            member.setUserId(userId);
            member.setRole("Member");
            member.setStatus("pending");
            member.setPendingSource("admin");
            member.setRequestKind("invite");
            member.setInvitedByUserId(creatorUserId);
            member.setActionAtIso(normalizeDateTime(record.getStartAtIso(), createdDate));
            member.setMetAtIso(normalizeDateTime(record.getStartAtIso(), member.getActionAtIso()));
            member.setMetWhere(safeText(record.getLocation()));
            member.setCreatedDate(createdDate);
            member.setCreatedUser(StringUtils.hasText(creatorUserId) ? creatorUserId : userId);
            member.setUpdatedDate(updatedDate);
            member.setUpdatedUser(StringUtils.hasText(safeText(record.getUpdatedUser())) ? safeText(record.getUpdatedUser()) : member.getCreatedUser());
            nextDocuments.add(member);
        }
        return nextDocuments;
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
        int nextRank = eventTypeRank(next == null ? null : next.getType());
        int currentRank = eventTypeRank(current == null ? null : current.getType());
        if (nextRank != currentRank) {
            return nextRank > currentRank;
        }
        return toSortableDate(next == null ? null : next.getUpdatedDate()) >= toSortableDate(current == null ? null : current.getUpdatedDate());
    }

    private int eventTypeRank(String type) {
        String normalizedType = safeText(type);
        return switch (normalizedType) {
            case "hosting" -> 3;
            case "events" -> 2;
            case "invitations" -> 1;
            default -> 0;
        };
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
                user == null ? defaultStatusText(status, requestKind, pendingSource) : safeText(user.getStatusText()),
                role,
                status,
                pendingSource,
                requestKind,
                StringUtils.hasText(viewerUserId) && viewerUserId.equals(normalizeId(member.getInvitedByUserId())),
                normalizeDateTime(member.getMetAtIso(), actionAtIso),
                actionAtIso,
                safeText(member.getMetWhere()),
                user == null ? 0d : safeDouble(user.getAffinity()),
                resolveAvatarUrl(user));
    }

    private String resolveStoredRole(ActivityMember member, String ownerType, String ownerId) {
        String normalizedRole = safeText(member == null ? null : member.getRole());
        if ("Admin".equals(normalizedRole) || "Manager".equals(normalizedRole) || "Member".equals(normalizedRole)) {
            return normalizedRole;
        }
        return normalizeRole(normalizedRole, normalizeId(member == null ? null : member.getUserId()), ownerType, ownerId);
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

    private List<AssetRequestRecord> safeAssetRequests(List<AssetRequestRecord> requests) {
        return requests == null ? List.of() : requests;
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
        List<String> acceptedMemberUserIds = snapshot == null ? List.of() : snapshot.acceptedMemberUserIds();
        List<String> pendingMemberUserIds = snapshot == null ? List.of() : snapshot.pendingMemberUserIds();
        int acceptedMembers = snapshot == null ? 0 : snapshot.acceptedMembers();
        int pendingMembers = snapshot == null ? 0 : snapshot.pendingMembers();

        List<ActivityEvent> documentsToSave = new ArrayList<>();
        for (ActivityEvent document : documents) {
            if (document == null) {
                continue;
            }
            document.setAcceptedMemberUserIds(acceptedMemberUserIds);
            document.setPendingMemberUserIds(pendingMemberUserIds);
            document.setAcceptedMembers(acceptedMembers);
            document.setPendingMembers(pendingMembers);
            document.setCapacityTotal(Math.max(
                    acceptedMembers,
                    snapshot == null || snapshot.capacityTotal() == null
                            ? Math.max(acceptedMembers, document.getCapacityTotal() == null ? 0 : document.getCapacityTotal())
                            : snapshot.capacityTotal()));
            documentsToSave.add(document);
        }
        if (!documentsToSave.isEmpty()) {
            activityEventsRepository.saveAll(documentsToSave);
        }
    }

    private String normalizeStatus(String status) {
        String normalizedStatus = safeText(status);
        if (STATUS_PENDING.equals(normalizedStatus)) {
            return STATUS_PENDING;
        }
        if (STATUS_DELETED.equals(normalizedStatus)) {
            return STATUS_DELETED;
        }
        return STATUS_ACCEPTED;
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
        if ("join".equals(normalizedRequestKind)) {
            return "join";
        }
        if ("invite".equals(normalizedRequestKind)) {
            return "invite";
        }
        return "member".equals(pendingSource) ? "join" : "invite";
    }

    private String resolveInvitedByUserId(ActivityMemberEntryDto entry, ActivityMember current, String actorUserId) {
        if (entry != null && Boolean.TRUE.equals(entry.invitedByActiveUser()) && StringUtils.hasText(actorUserId)) {
            return actorUserId;
        }
        if (current != null && StringUtils.hasText(current.getInvitedByUserId())) {
            return current.getInvitedByUserId().trim();
        }
        if (entry != null && STATUS_PENDING.equals(normalizeStatus(entry.status())) && "invite".equals(resolveRequestKind(entry.requestKind(), normalizeStatus(entry.status()), resolvePendingSource(entry.pendingSource(), normalizeStatus(entry.status()))))) {
            return actorUserId;
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

    private double safeDouble(Double value) {
        return value == null ? 0d : Math.max(0d, value);
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
        if ("join".equals(requestKind) || "member".equals(pendingSource)) {
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
