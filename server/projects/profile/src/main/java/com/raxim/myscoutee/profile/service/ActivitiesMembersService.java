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
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.mongo.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityMember;
import com.raxim.myscoutee.profile.data.document.mongo.Asset;
import com.raxim.myscoutee.profile.data.document.mongo.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.activities.ActivityMembersDtos.ActivityMembersReplaceRequestDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityMembersDtos.ActivityMembersSummariesRequestDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.ActivitiesEventSyncPayloadDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivityMembersSummaryDto;
import com.raxim.myscoutee.profile.repository.mongo.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.mongo.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;

@Service
public class ActivitiesMembersService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";
    private static final Set<String> OWNER_TYPES = Set.of("event", "subEvent", "group", "asset");
    private static final Set<String> ACCEPTED_STATUSES = Set.of("accepted");
    private static final Set<String> ADMIN_ROLES = Set.of("Admin");

    private final ActivityMembersRepository activityMembersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final UsersRepository usersRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final AssetsService assetsService;

    public ActivitiesMembersService(
            ActivityMembersRepository activityMembersRepository,
            ActivityEventsRepository activityEventsRepository,
            UsersRepository usersRepository,
            HomeUserProfileService homeUserProfileService,
            AssetsService assetsService) {
        this.activityMembersRepository = activityMembersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.assetsService = assetsService;
    }

    public List<ActivityMemberEntryDto> queryMembers(String ownerType, String ownerId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerType) || !StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }

        String viewerUserId = homeUserProfileService.resolveSelectedUserId(null);
        return loadOwnerDocuments(normalizedOwnerType, normalizedOwnerId).stream()
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
        return toOwnerSnapshot(normalizedOwnerType, normalizedOwnerId, loadOwnerDocuments(normalizedOwnerType, normalizedOwnerId));
    }

    public boolean hasAcceptedAdminRole(String ownerType, String ownerId, String userId) {
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(ownerType, ownerId);
        return snapshot != null && snapshot.hasAcceptedAdminRole(userId);
    }

    public boolean hasParticipation(String ownerType, String ownerId, String userId) {
        OwnerMembersSnapshot snapshot = queryOwnerSnapshot(ownerType, ownerId);
        return snapshot != null && snapshot.hasParticipation(userId);
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
        Set<String> retainedIds = new LinkedHashSet<>();
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
            if (StringUtils.hasText(next.getId())) {
                retainedIds.add(next.getId());
            }
        }

        nextDocuments = ensureOwnerAdminMembership(ownerType, ownerId, nextDocuments, existingByUserId, actorUserId, nowIso);
        retainedIds = nextDocuments.stream()
                .map(ActivityMember::getId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        Set<String> retainedMemberIds = retainedIds;
        List<ActivityMember> toDelete = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> !retainedMemberIds.contains(member.getId()))
                .toList();
        if (!toDelete.isEmpty()) {
            activityMembersRepository.deleteAll(toDelete);
        }
        if (!nextDocuments.isEmpty()) {
            activityMembersRepository.saveAll(nextDocuments);
        }
        if (OWNER_TYPE_ASSET.equals(ownerType)) {
            assetsService.syncRequestsFromMembers(ownerId, nextDocuments);
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
            next.setInvitedByUserId(StringUtils.hasText(current == null ? null : current.getInvitedByUserId())
                    ? current.getInvitedByUserId().trim()
                    : creatorUserId);
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

        Set<String> retainedUserIds = nextDocuments.stream()
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        List<ActivityMember> toDelete = existing.stream()
                .filter(Objects::nonNull)
                .filter(member -> !retainedUserIds.contains(normalizeId(member.getUserId())))
                .toList();
        if (!toDelete.isEmpty()) {
            activityMembersRepository.deleteAll(toDelete);
        }
        if (!nextDocuments.isEmpty()) {
            activityMembersRepository.saveAll(nextDocuments);
        }
    }

    public OwnerMembersSnapshot requestJoin(String eventId, Users viewer, ActivityEvent eventRecord) {
        String normalizedEventId = normalizeId(eventId);
        String viewerUserId = viewer == null ? null : normalizeId(viewer.getId());
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(viewerUserId)) {
            return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
        }

        List<ActivityMember> existing = loadOwnerDocuments(OWNER_TYPE_EVENT, normalizedEventId, eventRecord);
        Map<String, ActivityMember> existingByUserId = new LinkedHashMap<>();
        for (ActivityMember member : existing) {
            if (member != null && StringUtils.hasText(normalizeId(member.getUserId()))) {
                existingByUserId.put(normalizeId(member.getUserId()), member);
            }
        }

        ActivityMember current = existingByUserId.get(viewerUserId);
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
        if (!ACCEPTED_STATUSES.contains(normalizeStatus(current.getStatus()))) {
            String nowIso = Instant.now().toString();
            current.setRole(normalizeRole(current.getRole(), viewerUserId, OWNER_TYPE_EVENT, normalizedEventId));
            current.setStatus("pending");
            current.setPendingSource("member");
            current.setRequestKind("join");
            current.setInvitedByUserId(null);
            current.setActionAtIso(nowIso);
            current.setMetAtIso(normalizeDateTime(current.getMetAtIso(), nowIso));
            current.setMetWhere(safeText(current.getMetWhere()));
            current.setUpdatedDate(nowIso);
            current.setUpdatedUser(viewerUserId);
            activityMembersRepository.save(current);
        }
        return queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizedEventId);
    }

    private List<ActivityMember> loadOwnerDocuments(String ownerType, String ownerId) {
        return loadOwnerDocuments(ownerType, ownerId, null);
    }

    private List<ActivityMember> loadOwnerDocuments(String ownerType, String ownerId, ActivityEvent fallbackEventRecord) {
        List<ActivityMember> stored = activityMembersRepository.findByOwnerTypeAndOwnerId(ownerType, ownerId).stream()
                .filter(Objects::nonNull)
                .toList();
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

    private OwnerMembersSnapshot toOwnerSnapshot(String ownerType, String ownerId, List<ActivityMember> members) {
        List<ActivityMember> ordered = members.stream()
                .filter(Objects::nonNull)
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
                .filter(member -> ADMIN_ROLES.contains(normalizeRole(member.getRole(), normalizeId(member.getUserId()), ownerType, ownerId)))
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
        String ownerRole = OWNER_TYPE_EVENT.equals(ownerType) ? "Admin" : "Manager";
        boolean alreadyPresent = nextDocuments.stream().anyMatch(member -> creatorUserId.equals(normalizeId(member.getUserId())));
        if (alreadyPresent) {
            return nextDocuments.stream()
                    .map(member -> {
                        if (!creatorUserId.equals(normalizeId(member.getUserId()))) {
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
        LinkedHashSet<String> acceptedUserIds = new LinkedHashSet<>(normalizeUserIds(record.getAcceptedMemberUserIds()));
        LinkedHashSet<String> pendingUserIds = new LinkedHashSet<>(normalizeUserIds(record.getPendingMemberUserIds()));
        if (StringUtils.hasText(creatorUserId)) {
            acceptedUserIds.add(creatorUserId);
            pendingUserIds.remove(creatorUserId);
        }

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
        Users user = usersRepository.findById(normalizeId(member.getUserId())).orElse(null);
        String role = normalizeRole(member.getRole(), normalizeId(member.getUserId()), member.getOwnerType(), member.getOwnerId());
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
        if ("Admin".equals(normalizedRole) || "Manager".equals(normalizedRole) || "Member".equals(normalizedRole)) {
            return normalizedRole;
        }
        if (OWNER_TYPE_EVENT.equals(ownerType)) {
            ActivityEvent record = findPreferredEventRecord(ownerId);
            if (record != null && normalizeId(record.getCreatorUserId()).equals(normalizeId(userId))) {
                return "Admin";
            }
        }
        if (OWNER_TYPE_ASSET.equals(ownerType)) {
            Asset asset = assetsService.findAssetByAssetId(ownerId).orElse(null);
            if (asset != null && normalizeId(asset.getOwnerUserId()).equals(normalizeId(userId))) {
                return "Manager";
            }
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

    private String normalizeStatus(String status) {
        return "pending".equals(safeText(status)) ? "pending" : "accepted";
    }

    private String resolvePendingSource(String pendingSource, String status) {
        if (!"pending".equals(status)) {
            return null;
        }
        String normalizedPendingSource = safeText(pendingSource);
        return "member".equals(normalizedPendingSource) ? "member" : "admin";
    }

    private String resolveRequestKind(String requestKind, String status, String pendingSource) {
        if (!"pending".equals(status)) {
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
        if (entry != null && "pending".equals(normalizeStatus(entry.status())) && "invite".equals(resolveRequestKind(entry.requestKind(), normalizeStatus(entry.status()), resolvePendingSource(entry.pendingSource(), normalizeStatus(entry.status()))))) {
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
        if ("accepted".equals(status)) {
            return "Recently Active";
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
