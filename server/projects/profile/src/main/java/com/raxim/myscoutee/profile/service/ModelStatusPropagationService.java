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

@Service
public class ModelStatusPropagationService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String ROLE_ADMIN = "Admin";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_UNDER_REVIEW = "UR";
    private static final String STATUS_BLOCKED = "B";
    private static final String STATUS_DELETED = "D";
    private static final String STATUS_INACTIVE = "I";
    private static final Set<String> SUPPRESSED_STATUSES = Set.of(STATUS_UNDER_REVIEW, STATUS_BLOCKED, STATUS_DELETED, STATUS_INACTIVE);

    private final UsersRepository usersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AssetsRepository assetsRepository;
    private final MongoTemplate mongoTemplate;

    public ModelStatusPropagationService(
            UsersRepository usersRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository,
            AssetsRepository assetsRepository,
            MongoTemplate mongoTemplate) {
        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
        this.mongoTemplate = mongoTemplate;
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
        RecomputeTargets assetTargets = applyAssetStatuses(normalizedUserId, suppressionStatusForUser(user));
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

    private RecomputeTargets applyAssetStatuses(String ownerUserId, String suppressionStatus) {
        List<Asset> assets = assetsRepository.findByOwnerUserId(ownerUserId).stream()
                .filter(asset -> asset != null)
                .toList();
        if (assets.isEmpty()) {
            return RecomputeTargets.empty();
        }

        LinkedHashSet<String> targetAssetIds = new LinkedHashSet<>();
        boolean conflict = false;
        for (Asset asset : assets) {
            String assetId = normalizeId(asset.getAssetId());
            if (StringUtils.hasText(assetId)) {
                targetAssetIds.add(assetId);
            }
            if (StringUtils.hasText(suppressionStatus)) {
                conflict = !suppressAsset(asset, suppressionStatus) || conflict;
            } else {
                conflict = !restoreAssetIfSuppressed(asset) || conflict;
            }
        }
        return new RecomputeTargets(new ArrayList<>(targetAssetIds), conflict);
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
        return updateEventStatusIfSnapshotCurrent(event, suppressionStatus, previousStatus);
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
        return updateEventStatusIfSnapshotCurrent(
                event,
                StringUtils.hasText(previousStatus) ? previousStatus : STATUS_ACTIVE,
                null);
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
        return updateAssetStatusIfSnapshotCurrent(asset, suppressionStatus, previousStatus);
    }

    private boolean restoreAssetIfSuppressed(Asset asset) {
        if (asset == null) {
            return true;
        }
        String currentStatus = safeText(asset.getStatus());
        if (!SUPPRESSED_STATUSES.contains(currentStatus)) {
            return true;
        }
        String previousStatus = safeText(asset.getStatusBeforeSuppression());
        return updateAssetStatusIfSnapshotCurrent(
                asset,
                StringUtils.hasText(previousStatus) ? previousStatus : STATUS_ACTIVE,
                null);
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
