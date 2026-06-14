package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class ModelStatusPropagationService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";
    private static final String ROLE_ADMIN = "Admin";
    private static final String ROLE_MANAGER = "Manager";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_UNDER_REVIEW = "UR";
    private static final String STATUS_BLOCKED = "B";
    private static final String STATUS_DELETED = "D";
    private static final String STATUS_INACTIVE = "I";
    private static final String STATUS_TRASHED = "T";
    private static final Set<String> SUPPRESSED_STATUSES = Set.of(STATUS_UNDER_REVIEW, STATUS_BLOCKED, STATUS_DELETED, STATUS_INACTIVE);

    private final UsersRepository usersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AssetsRepository assetsRepository;
    private final MongoTemplate mongoTemplate;
    private final NotificationOutboxService notificationOutboxService;
    private final ChatAttachmentLifecycleService chatAttachmentLifecycleService;

    public ModelStatusPropagationService(
            UsersRepository usersRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository,
            AssetsRepository assetsRepository,
            MongoTemplate mongoTemplate,
            NotificationOutboxService notificationOutboxService,
            ChatAttachmentLifecycleService chatAttachmentLifecycleService) {
        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
        this.mongoTemplate = mongoTemplate;
        this.notificationOutboxService = notificationOutboxService;
        this.chatAttachmentLifecycleService = chatAttachmentLifecycleService;
    }

    public ModelStatusPropagationOutcome applyForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return ModelStatusPropagationOutcome.empty();
        }
        Users user = usersRepository.findByUserId(normalizedUserId).orElse(null);
        if (user == null) {
            return ModelStatusPropagationOutcome.empty();
        }

        LinkedHashMap<String, ActivityEvent> affectedEventsById = affectedAdminEventsByDocumentId(normalizedUserId);
        RecomputeTargets eventTargets = applyEventStatuses(affectedEventsById.values());
        RecomputeTargets assetTargets = applyAssetStatuses(normalizedUserId);
        return new ModelStatusPropagationOutcome(
                eventTargets.targetIds(),
                assetTargets.targetIds(),
                eventTargets.hasConflicts() || assetTargets.hasConflicts());
    }

    private LinkedHashMap<String, ActivityEvent> affectedAdminEventsByDocumentId(String userId) {
        LinkedHashMap<String, ActivityEvent> eventsById = new LinkedHashMap<>();
        addEvents(eventsById, activityEventsRepository.findByCreatorUserId(userId));
        addEvents(eventsById, activityEventsRepository.findByAdminsContaining(userId));

        List<String> adminMemberEventIds = activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, userId).stream()
                .filter(member -> MEMBER_STATUS_ACCEPTED.equals(normalizeStatus(member == null ? null : member.getStatus())))
                .filter(member -> ROLE_ADMIN.equals(safeText(member == null ? null : member.getRole())))
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (!adminMemberEventIds.isEmpty()) {
            addEvents(eventsById, activityEventsRepository.findBySourceIdIn(adminMemberEventIds));
        }
        return eventsById;
    }

    private RecomputeTargets applyEventStatuses(Collection<ActivityEvent> events) {
        List<ActivityEvent> eventList = events == null
                ? List.of()
                : events.stream().filter(event -> event != null).toList();
        if (eventList.isEmpty()) {
            return RecomputeTargets.empty();
        }

        Map<String, Set<String>> adminIdsBySourceId = resolveAdminIdsBySourceId(eventList);
        LinkedHashSet<String> sourceIds = eventList.stream()
                .map(event -> normalizeId(event.getSourceId()))
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Map<String, Integer> acceptedMemberCountsBySourceId = acceptedMemberCountsBySourceId(sourceIds);
        Set<String> allAdminIds = adminIdsBySourceId.values().stream()
                .flatMap(Collection::stream)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Map<String, Users> usersById = indexUsers(usersRepository.findByUserIdIn(allAdminIds));

        LinkedHashSet<String> targetSourceIds = new LinkedHashSet<>();
        boolean conflict = false;
        for (ActivityEvent event : eventList) {
            if (!isOperationalEvent(event)) {
                continue;
            }
            String sourceId = normalizeId(event.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                targetSourceIds.add(sourceId);
            }
            AdminStatusSnapshot adminStatus = adminStatusSnapshot(adminIdsBySourceId.get(sourceId), usersById);
            String nextStatus = eventSuppressionStatus(adminStatus);
            if (StringUtils.hasText(nextStatus)) {
                conflict = !suppressEvent(event, nextStatus) || conflict;
            } else {
                conflict = !restoreEventIfSuppressed(event, acceptedMemberCountsBySourceId) || conflict;
            }
        }
        return new RecomputeTargets(new ArrayList<>(targetSourceIds), conflict);
    }

    private RecomputeTargets applyAssetStatuses(String userId) {
        List<Asset> assets = new ArrayList<>(affectedResponsibleAssetsByDocumentId(userId).values());
        if (assets.isEmpty()) {
            return RecomputeTargets.empty();
        }

        Map<String, Set<String>> responsibleUserIdsByAssetId = resolveResponsibleUserIdsByAssetId(assets);
        Set<String> allResponsibleUserIds = responsibleUserIdsByAssetId.values().stream()
                .flatMap(Collection::stream)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        Map<String, Users> usersById = indexUsers(usersRepository.findByUserIdIn(allResponsibleUserIds));

        LinkedHashSet<String> targetAssetIds = new LinkedHashSet<>();
        boolean conflict = false;
        for (Asset asset : assets) {
            if (!isOperationalAsset(asset)) {
                continue;
            }
            String assetId = normalizeId(asset.getAssetId());
            if (StringUtils.hasText(assetId)) {
                targetAssetIds.add(assetId);
            }
            AdminStatusSnapshot responsibleStatus = adminStatusSnapshot(responsibleUserIdsByAssetId.get(assetId), usersById);
            String nextStatus = eventSuppressionStatus(responsibleStatus);
            if (StringUtils.hasText(nextStatus)) {
                conflict = !suppressAsset(asset, nextStatus) || conflict;
            } else {
                conflict = !restoreAssetIfSuppressed(asset, responsibleStatus) || conflict;
            }
        }
        return new RecomputeTargets(new ArrayList<>(targetAssetIds), conflict);
    }

    private LinkedHashMap<String, Asset> affectedResponsibleAssetsByDocumentId(String userId) {
        LinkedHashMap<String, Asset> assetsById = new LinkedHashMap<>();
        addAssets(assetsById, assetsRepository.findByOwnerUserId(userId));

        List<ActivityMember> managerMemberships = activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_ASSET, userId);
        List<String> managedAssetIds = (managerMemberships == null ? List.<ActivityMember>of() : managerMemberships).stream()
                .filter(member -> MEMBER_STATUS_ACCEPTED.equals(normalizeStatus(member == null ? null : member.getStatus())))
                .filter(member -> isManagerRole(member == null ? null : member.getRole()))
                .map(ActivityMember::getOwnerId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (!managedAssetIds.isEmpty()) {
            addAssets(assetsById, assetsRepository.findByAssetIdIn(managedAssetIds));
        }
        return assetsById;
    }

    private boolean suppressEvent(ActivityEvent event, String suppressionStatus) {
        if (event == null) {
            return false;
        }
        String currentStatus = safeText(event.getStatus());
        if (suppressionStatus.equals(currentStatus)
                && StringUtils.hasText(safeText(event.getStatusBeforeSuppression()))) {
            return true;
        }
        String previousStatus = SUPPRESSED_STATUSES.contains(currentStatus)
                ? safeText(event.getStatusBeforeSuppression())
                : currentStatus;
        if (!StringUtils.hasText(previousStatus)) {
            previousStatus = STATUS_ACTIVE;
        }
        boolean updated = updateEventStatusIfSnapshotCurrent(event, suppressionStatus, previousStatus);
        if (updated) {
            enqueueEventStatusNotification(event, suppressionStatus, previousStatus);
            markEventAttachmentUnavailable(event, suppressionStatus);
        }
        return updated;
    }

    private boolean restoreEventIfSuppressed(ActivityEvent event, Map<String, Integer> acceptedMemberCountsBySourceId) {
        if (event == null) {
            return true;
        }
        String currentStatus = safeText(event.getStatus());
        if (!SUPPRESSED_STATUSES.contains(currentStatus)) {
            return true;
        }
        if (!canRestoreEvent(event, acceptedMemberCountsBySourceId)) {
            return true;
        }
        String previousStatus = safeText(event.getStatusBeforeSuppression());
        String restoredStatus = StringUtils.hasText(previousStatus) ? previousStatus : STATUS_ACTIVE;
        boolean updated = updateEventStatusIfSnapshotCurrent(
                event,
                restoredStatus,
                null);
        if (updated) {
            enqueueEventStatusNotification(event, restoredStatus, currentStatus);
            markEventAttachmentAvailable(event);
        }
        return updated;
    }

    private boolean suppressAsset(Asset asset, String suppressionStatus) {
        if (asset == null) {
            return false;
        }
        String currentStatus = safeText(asset.getStatus());
        if (suppressionStatus.equals(currentStatus)
                && StringUtils.hasText(safeText(asset.getStatusBeforeSuppression()))) {
            return true;
        }
        String previousStatus = SUPPRESSED_STATUSES.contains(currentStatus)
                ? safeText(asset.getStatusBeforeSuppression())
                : currentStatus;
        if (!StringUtils.hasText(previousStatus)) {
            previousStatus = STATUS_ACTIVE;
        }
        boolean updated = updateAssetStatusIfSnapshotCurrent(asset, suppressionStatus, previousStatus);
        if (updated) {
            enqueueAssetStatusNotification(asset, suppressionStatus, previousStatus);
            markAssetAttachmentUnavailable(asset, suppressionStatus);
        }
        return updated;
    }

    private boolean restoreAssetIfSuppressed(Asset asset, AdminStatusSnapshot responsibleStatus) {
        if (asset == null) {
            return true;
        }
        String currentStatus = safeText(asset.getStatus());
        if (!SUPPRESSED_STATUSES.contains(currentStatus)) {
            return true;
        }
        if (responsibleStatus == null || !responsibleStatus.hasActiveAdmin() || !isOperationalAsset(asset)) {
            return true;
        }
        String previousStatus = safeText(asset.getStatusBeforeSuppression());
        String restoredStatus = StringUtils.hasText(previousStatus) ? previousStatus : STATUS_ACTIVE;
        boolean updated = updateAssetStatusIfSnapshotCurrent(
                asset,
                restoredStatus,
                null);
        if (updated) {
            enqueueAssetStatusNotification(asset, restoredStatus, currentStatus);
            markAssetAttachmentAvailable(asset);
        }
        return updated;
    }

    private void markEventAttachmentUnavailable(ActivityEvent event, String reason) {
        String sourceId = normalizeId(event == null ? null : event.getSourceId());
        if (chatAttachmentLifecycleService != null && StringUtils.hasText(sourceId)) {
            chatAttachmentLifecycleService.markEventUnavailable(sourceId, reason);
        }
    }

    private void markEventAttachmentAvailable(ActivityEvent event) {
        String sourceId = normalizeId(event == null ? null : event.getSourceId());
        if (chatAttachmentLifecycleService != null && StringUtils.hasText(sourceId)) {
            chatAttachmentLifecycleService.markEventAvailable(sourceId);
        }
    }

    private void markAssetAttachmentUnavailable(Asset asset, String reason) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        if (chatAttachmentLifecycleService != null && StringUtils.hasText(assetId)) {
            chatAttachmentLifecycleService.markAssetUnavailable(assetId, reason);
        }
    }

    private void markAssetAttachmentAvailable(Asset asset) {
        String assetId = normalizeId(asset == null ? null : asset.getAssetId());
        if (chatAttachmentLifecycleService != null && StringUtils.hasText(assetId)) {
            chatAttachmentLifecycleService.markAssetAvailable(assetId);
        }
    }

    private void enqueueAssetStatusNotification(Asset asset, String nextStatus, String previousStatus) {
        if (asset == null || notificationOutboxService == null) {
            return;
        }
        String assetId = normalizeId(asset.getAssetId());
        if (!StringUtils.hasText(assetId)) {
            return;
        }
        String normalizedNextStatus = safeText(nextStatus);
        String title;
        String body;
        String type;
        String scope;
        List<String> recipients;
        if (STATUS_UNDER_REVIEW.equals(normalizedNextStatus)) {
            recipients = activeResponsibleAssetUserIds(asset);
            title = "Asset needs review";
            body = assetTitle(asset) + " needs review. You can take over or make it unavailable.";
            type = "asset-review";
            scope = "asset-active-managers";
        } else if (STATUS_BLOCKED.equals(normalizedNextStatus)
                || STATUS_DELETED.equals(normalizedNextStatus)
                || STATUS_INACTIVE.equals(normalizedNextStatus)) {
            recipients = assetRequesterUserIds(asset);
            title = "Asset unavailable";
            body = assetTitle(asset) + " is no longer available.";
            type = "asset-unavailable";
            scope = "asset-requesters";
        } else if (STATUS_ACTIVE.equals(normalizedNextStatus)) {
            recipients = activeResponsibleAssetUserIds(asset);
            title = "Asset restored";
            body = assetTitle(asset) + " is available again.";
            type = "asset-restored";
            scope = "asset-active-managers";
        } else {
            return;
        }
        if (recipients.isEmpty()) {
            return;
        }
        notificationOutboxService.enqueue(new NotificationIntent(
                type,
                "asset",
                assetId,
                scope,
                recipients,
                title,
                body,
                "/game",
                firstNonBlank(asset.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                type + "-" + assetId,
                Map.of(
                        "assetId", assetId,
                        "assetTitle", assetTitle(asset),
                        "assetStatus", normalizedNextStatus,
                        "previousStatus", safeText(previousStatus)),
                safeText(asset.getUpdatedUser())));
    }

    private void enqueueEventStatusNotification(ActivityEvent event, String nextStatus, String previousStatus) {
        if (event == null || notificationOutboxService == null) {
            return;
        }
        String sourceId = normalizeId(event.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return;
        }
        String normalizedNextStatus = safeText(nextStatus);
        String title;
        String body;
        String type;
        String scope;
        List<String> recipients;
        if (STATUS_UNDER_REVIEW.equals(normalizedNextStatus)) {
            recipients = activeEventAdminUserIds(event);
            title = "Event needs review";
            body = eventTitle(event) + " needs review. An active admin can take over or cancel it.";
            type = "event-review";
            scope = "event-active-admins";
        } else if (STATUS_BLOCKED.equals(normalizedNextStatus)
                || STATUS_DELETED.equals(normalizedNextStatus)
                || STATUS_INACTIVE.equals(normalizedNextStatus)) {
            recipients = eventMemberUserIds(event);
            title = "Event unavailable";
            body = eventTitle(event) + " is no longer available.";
            type = "event-unavailable";
            scope = "event-members";
        } else if (STATUS_ACTIVE.equals(normalizedNextStatus)) {
            recipients = activeEventAdminUserIds(event);
            title = "Event restored";
            body = eventTitle(event) + " is available again.";
            type = "event-restored";
            scope = "event-active-admins";
        } else {
            return;
        }
        if (recipients.isEmpty()) {
            return;
        }
        notificationOutboxService.enqueue(new NotificationIntent(
                type,
                "event",
                sourceId,
                scope,
                recipients,
                title,
                body,
                "/game",
                firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                type + "-" + sourceId,
                Map.of(
                        "eventId", sourceId,
                        "eventTitle", eventTitle(event),
                        "eventStatus", normalizedNextStatus,
                        "previousStatus", safeText(previousStatus)),
                safeText(event.getUpdatedUser())));
    }

    private boolean updateEventStatusIfSnapshotCurrent(ActivityEvent event, String nextStatus, String previousStatus) {
        if (event == null) {
            return false;
        }
        String id = normalizeId(event.getId());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(event.getUpdatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        Update update = new Update().set("status", nextStatus);
        if (StringUtils.hasText(previousStatus)) {
            update.set("statusBeforeSuppression", previousStatus);
        } else {
            update.unset("statusBeforeSuppression");
        }
        UpdateResult result = mongoTemplate.updateFirst(new Query(criteria), update, ActivityEvent.class);
        return result.getMatchedCount() > 0;
    }

    private boolean updateAssetStatusIfSnapshotCurrent(Asset asset, String nextStatus, String previousStatus) {
        if (asset == null) {
            return false;
        }
        String id = normalizeId(asset.getId());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(asset.getUpdatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        Update update = new Update().set("status", nextStatus);
        if (StringUtils.hasText(previousStatus)) {
            update.set("statusBeforeSuppression", previousStatus);
        } else {
            update.unset("statusBeforeSuppression");
        }
        UpdateResult result = mongoTemplate.updateFirst(new Query(criteria), update, Asset.class);
        return result.getMatchedCount() > 0;
    }

    private boolean canRestoreEvent(ActivityEvent event, Map<String, Integer> acceptedMemberCountsBySourceId) {
        if (!isOperationalEvent(event)) {
            return false;
        }
        int capacityTotal = normalizeCount(event.getCapacityTotal());
        if (capacityTotal <= 0) {
            return true;
        }
        String sourceId = normalizeId(event.getSourceId());
        int acceptedMembers = Math.max(
                normalizeCount(event.getAcceptedMembers()),
                acceptedMemberCountsBySourceId == null ? 0 : acceptedMemberCountsBySourceId.getOrDefault(sourceId, 0));
        return acceptedMembers < capacityTotal;
    }

    private Map<String, Integer> acceptedMemberCountsBySourceId(Collection<String> sourceIds) {
        if (sourceIds == null || sourceIds.isEmpty()) {
            return Map.of();
        }
        LinkedHashMap<String, Integer> result = new LinkedHashMap<>();
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, sourceIds)) {
            if (member == null || !MEMBER_STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))) {
                continue;
            }
            String sourceId = normalizeId(member.getOwnerId());
            if (StringUtils.hasText(sourceId)) {
                result.put(sourceId, result.getOrDefault(sourceId, 0) + 1);
            }
        }
        return result;
    }

    private Map<String, Set<String>> resolveAdminIdsBySourceId(Collection<ActivityEvent> events) {
        LinkedHashMap<String, Set<String>> result = new LinkedHashMap<>();
        LinkedHashSet<String> sourceIds = new LinkedHashSet<>();
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            if (event == null) {
                continue;
            }
            String sourceId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            sourceIds.add(sourceId);
            Set<String> adminIds = result.computeIfAbsent(sourceId, ignored -> new LinkedHashSet<>());
            adminIds.addAll(normalizeIds(event.getAdmins()));
            String creatorUserId = normalizeId(event.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                adminIds.add(creatorUserId);
            }
        }

        if (!sourceIds.isEmpty()) {
            for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, sourceIds)) {
                if (member == null
                        || !MEMBER_STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))
                        || !ROLE_ADMIN.equals(safeText(member.getRole()))) {
                    continue;
                }
                String sourceId = normalizeId(member.getOwnerId());
                String userId = normalizeId(member.getUserId());
                if (StringUtils.hasText(sourceId) && StringUtils.hasText(userId)) {
                    result.computeIfAbsent(sourceId, ignored -> new LinkedHashSet<>()).add(userId);
                }
            }
        }
        return result;
    }

    private Map<String, Set<String>> resolveResponsibleUserIdsByAssetId(Collection<Asset> assets) {
        LinkedHashMap<String, Set<String>> result = new LinkedHashMap<>();
        LinkedHashSet<String> assetIds = new LinkedHashSet<>();
        for (Asset asset : assets == null ? List.<Asset>of() : assets) {
            if (asset == null) {
                continue;
            }
            String assetId = normalizeId(asset.getAssetId());
            if (!StringUtils.hasText(assetId)) {
                continue;
            }
            assetIds.add(assetId);
            Set<String> userIds = result.computeIfAbsent(assetId, ignored -> new LinkedHashSet<>());
            String ownerUserId = normalizeId(asset.getOwnerUserId());
            if (StringUtils.hasText(ownerUserId)) {
                userIds.add(ownerUserId);
            }
        }

        if (!assetIds.isEmpty()) {
            List<ActivityMember> assetMembers = activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_ASSET, assetIds);
            for (ActivityMember member : assetMembers == null ? List.<ActivityMember>of() : assetMembers) {
                if (member == null
                        || !MEMBER_STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))
                        || !isManagerRole(member.getRole())) {
                    continue;
                }
                String assetId = normalizeId(member.getOwnerId());
                String userId = normalizeId(member.getUserId());
                if (StringUtils.hasText(assetId) && StringUtils.hasText(userId)) {
                    result.computeIfAbsent(assetId, ignored -> new LinkedHashSet<>()).add(userId);
                }
            }
        }
        return result;
    }

    private List<String> activeResponsibleAssetUserIds(Asset asset) {
        if (asset == null) {
            return List.of();
        }
        String assetId = normalizeId(asset.getAssetId());
        if (!StringUtils.hasText(assetId)) {
            return List.of();
        }
        LinkedHashSet<String> candidateIds = new LinkedHashSet<>();
        String ownerUserId = normalizeId(asset.getOwnerUserId());
        if (StringUtils.hasText(ownerUserId)) {
            candidateIds.add(ownerUserId);
        }
        List<ActivityMember> assetMembers = activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_ASSET, assetId);
        for (ActivityMember member : assetMembers == null ? List.<ActivityMember>of() : assetMembers) {
            if (member == null
                    || !MEMBER_STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))
                    || !isManagerRole(member.getRole())) {
                continue;
            }
            String userId = normalizeId(member.getUserId());
            if (StringUtils.hasText(userId)) {
                candidateIds.add(userId);
            }
        }
        if (candidateIds.isEmpty()) {
            return List.of();
        }
        Map<String, Users> usersById = indexUsers(usersRepository.findByUserIdIn(candidateIds));
        return candidateIds.stream()
                .filter(userId -> isActiveUser(usersById.get(userId)))
                .toList();
    }

    private List<String> activeEventAdminUserIds(ActivityEvent event) {
        if (event == null) {
            return List.of();
        }
        String sourceId = normalizeId(event.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return List.of();
        }
        LinkedHashSet<String> candidateIds = new LinkedHashSet<>();
        candidateIds.addAll(normalizeIds(event.getAdmins()));
        String creatorUserId = normalizeId(event.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId)) {
            candidateIds.add(creatorUserId);
        }
        List<ActivityMember> members = activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_EVENT, sourceId);
        for (ActivityMember member : members == null ? List.<ActivityMember>of() : members) {
            if (member == null
                    || !MEMBER_STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus()))
                    || !ROLE_ADMIN.equals(safeText(member.getRole()))) {
                continue;
            }
            String userId = normalizeId(member.getUserId());
            if (StringUtils.hasText(userId)) {
                candidateIds.add(userId);
            }
        }
        if (candidateIds.isEmpty()) {
            return List.of();
        }
        Map<String, Users> usersById = indexUsers(usersRepository.findByUserIdIn(candidateIds));
        return candidateIds.stream()
                .filter(userId -> isActiveUser(usersById.get(userId)))
                .toList();
    }

    private List<String> eventMemberUserIds(ActivityEvent event) {
        if (event == null) {
            return List.of();
        }
        String sourceId = normalizeId(event.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return List.of();
        }
        LinkedHashSet<String> adminUserIds = new LinkedHashSet<>(normalizeIds(event.getAdmins()));
        String creatorUserId = normalizeId(event.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId)) {
            adminUserIds.add(creatorUserId);
        }
        List<ActivityMember> members = activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_EVENT, sourceId);
        return (members == null ? List.<ActivityMember>of() : members).stream()
                .filter(member -> member != null && MEMBER_STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !adminUserIds.contains(userId))
                .distinct()
                .toList();
    }

    private List<String> assetRequesterUserIds(Asset asset) {
        if (asset == null || asset.getRequests() == null || asset.getRequests().isEmpty()) {
            return List.of();
        }
        String ownerUserId = normalizeId(asset.getOwnerUserId());
        return asset.getRequests().stream()
                .map(Asset.AssetRequestRecord::userId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(ownerUserId))
                .distinct()
                .toList();
    }

    private AdminStatusSnapshot adminStatusSnapshot(Collection<String> userIds, Map<String, Users> usersById) {
        String strongest = "";
        boolean hasSuppressedAdmin = false;
        boolean hasActiveAdmin = false;
        for (String userId : userIds == null ? List.<String>of() : userIds) {
            String candidate = suppressionStatusForUser(usersById.get(normalizeId(userId)));
            if (STATUS_DELETED.equals(candidate)) {
                hasSuppressedAdmin = true;
                strongest = STATUS_DELETED;
                continue;
            }
            if (STATUS_BLOCKED.equals(candidate)) {
                hasSuppressedAdmin = true;
                strongest = STATUS_BLOCKED;
            } else if (STATUS_INACTIVE.equals(candidate) && !STATUS_BLOCKED.equals(strongest)) {
                hasSuppressedAdmin = true;
                strongest = STATUS_INACTIVE;
            } else if (!StringUtils.hasText(candidate)) {
                hasActiveAdmin = true;
            }
        }
        return new AdminStatusSnapshot(strongest, hasSuppressedAdmin, hasActiveAdmin);
    }

    private String eventSuppressionStatus(AdminStatusSnapshot snapshot) {
        if (snapshot == null || !snapshot.hasSuppressedAdmin()) {
            return "";
        }
        return snapshot.hasActiveAdmin() ? STATUS_UNDER_REVIEW : snapshot.strongestSuppressionStatus();
    }

    private String suppressionStatusForUser(Users user) {
        String profileStatus = safeText(user == null ? null : user.getProfileStatus());
        String status = safeText(user == null ? null : user.getStatus());
        if ("deleted".equals(profileStatus) || STATUS_DELETED.equalsIgnoreCase(status)) {
            return STATUS_DELETED;
        }
        if ("blocked".equals(profileStatus) || STATUS_BLOCKED.equalsIgnoreCase(status)) {
            return STATUS_BLOCKED;
        }
        if ("inactive".equals(profileStatus) || STATUS_INACTIVE.equalsIgnoreCase(status)) {
            return STATUS_INACTIVE;
        }
        return "";
    }

    private boolean isActiveUser(Users user) {
        return !StringUtils.hasText(suppressionStatusForUser(user));
    }

    private String assetTitle(Asset asset) {
        String title = safeText(asset == null ? null : asset.getTitle());
        return StringUtils.hasText(title) ? title : "This asset";
    }

    private String eventTitle(ActivityEvent event) {
        String title = safeText(event == null ? null : event.getTitle());
        return StringUtils.hasText(title) ? title : "This event";
    }

    private String firstNonBlank(String first, String second) {
        String normalizedFirst = safeText(first);
        return StringUtils.hasText(normalizedFirst) ? normalizedFirst : safeText(second);
    }

    private boolean isOperationalEvent(ActivityEvent event) {
        if (event == null) {
            return false;
        }
        Instant now = Instant.now();
        Instant endAt = parseInstant(event.getEndAtIso());
        if (endAt != null) {
            return !endAt.isBefore(now);
        }
        Instant startAt = parseInstant(event.getStartAtIso());
        return startAt == null || !startAt.isBefore(now);
    }

    private boolean isOperationalAsset(Asset asset) {
        return asset != null && !STATUS_TRASHED.equals(safeText(asset.getStatus()));
    }

    private Instant parseInstant(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        try {
            return Instant.parse(normalized);
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private void addEvents(Map<String, ActivityEvent> target, List<ActivityEvent> events) {
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            String documentId = normalizeId(event == null ? null : event.getId());
            if (StringUtils.hasText(documentId)) {
                target.put(documentId, event);
            }
        }
    }

    private void addAssets(Map<String, Asset> target, List<Asset> assets) {
        for (Asset asset : assets == null ? List.<Asset>of() : assets) {
            String documentId = normalizeId(asset == null ? null : asset.getId());
            if (StringUtils.hasText(documentId)) {
                target.put(documentId, asset);
            }
        }
    }

    private Map<String, Users> indexUsers(List<Users> users) {
        LinkedHashMap<String, Users> result = new LinkedHashMap<>();
        for (Users user : users == null ? List.<Users>of() : users) {
            String userId = normalizeId(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)) {
                result.put(userId, user);
            }
        }
        return result;
    }

    private List<String> normalizeIds(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private boolean isManagerRole(String role) {
        String normalizedRole = safeText(role);
        return ROLE_MANAGER.equals(normalizedRole) || ROLE_ADMIN.equals(normalizedRole);
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeStatus(String value) {
        return value == null ? "" : value.trim();
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record RecomputeTargets(List<String> targetIds, boolean hasConflicts) {
        private static RecomputeTargets empty() {
            return new RecomputeTargets(List.of(), false);
        }
    }

    private record AdminStatusSnapshot(String strongestSuppressionStatus, boolean hasSuppressedAdmin, boolean hasActiveAdmin) {
    }

    public record ModelStatusPropagationOutcome(List<String> eventSourceIds, List<String> assetIds, boolean hasConflicts) {
        public ModelStatusPropagationOutcome {
            eventSourceIds = compact(eventSourceIds);
            assetIds = compact(assetIds);
        }

        public static ModelStatusPropagationOutcome empty() {
            return new ModelStatusPropagationOutcome(List.of(), List.of(), false);
        }

        private static List<String> compact(Collection<String> values) {
            if (values == null || values.isEmpty()) {
                return List.of();
            }
            return values.stream()
                    .map(value -> value == null ? "" : value.trim())
                    .filter(StringUtils::hasText)
                    .distinct()
                    .toList();
        }
    }
}
