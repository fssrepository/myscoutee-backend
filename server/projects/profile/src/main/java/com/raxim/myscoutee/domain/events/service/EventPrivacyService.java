package com.raxim.myscoutee.domain.events.service;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.events.api.EventPrivacy;
import com.raxim.myscoutee.domain.events.dto.EventPurgeTargetDto;
import com.raxim.myscoutee.domain.events.document.*;
import com.raxim.myscoutee.domain.events.repository.*;
import com.raxim.myscoutee.domain.media.api.MediaCleanup;
@Service
public class EventPrivacyService implements EventPrivacy {
    private static final String OWNER_TYPE_EVENT = "event", OWNER_TYPE_ASSET = "asset";
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final MongoTemplate mongoTemplate;
    private final MediaCleanup mediaStorageService;
    public EventPrivacyService(ActivityEventsRepository events, ActivityMembersRepository members, MongoTemplate mongo, MediaCleanup media) { activityEventsRepository = events; activityMembersRepository = members; mongoTemplate = mongo; mediaStorageService = media; }
    public List<EventPurgeTargetDto> findOwnedEventsForPurge(String userId) {
        Map<String, ActivityEvent> eventsByKey = new LinkedHashMap<>();
        addEvents(eventsByKey, activityEventsRepository.findByOwnerUserId(userId));
        addEvents(eventsByKey, activityEventsRepository.findByCreatorUserId(userId));
        return eventsByKey.values().stream().map(event -> new EventPurgeTargetDto(event.getId(), event.getSourceId())).toList();
    }
    private void addEvents(Map<String, ActivityEvent> eventsByKey, List<ActivityEvent> events) {
        for (ActivityEvent event : events == null ? List.<ActivityEvent>of() : events) {
            if (event == null) {
                continue;
            }
            String key = safeText(event.getId());
            if (!StringUtils.hasText(key)) {
                key = safeText(event.getOwnerUserId()) + ":" + safeText(event.getSourceId());
            }
            if (StringUtils.hasText(key)) {
                eventsByKey.putIfAbsent(key, event);
            }
        }
    }
    public void purgeOwnedEvents(Collection<String> documentIds, Collection<String> sourceIds) {
        List<ActivityEvent> events = documentIds == null || documentIds.isEmpty() ? List.of()
                : activityEventsRepository.findAllById(documentIds);
        for (ActivityEvent event : events) {
            if (event != null) {
                deletePurgeMedia(event.getImageUrl());
            }
        }
        if (sourceIds != null && !sourceIds.isEmpty()) {
            List<ActivityMember> members = activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, sourceIds);
            if (members != null && !members.isEmpty()) {
                activityMembersRepository.deleteAll(members);
            }
        }
        if (!events.isEmpty()) {
            activityEventsRepository.deleteAll(events);
        }
    }
    public void purgeActivityMemberships(String userId) {
        Map<String, ActivityMember> membershipsByKey = new LinkedHashMap<>();
        addMemberships(membershipsByKey, activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, userId));
        addMemberships(membershipsByKey, activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_ASSET, userId));
        if (!membershipsByKey.isEmpty()) {
            activityMembersRepository.deleteAll(membershipsByKey.values());
        }
    }
    public void purgeManagedEventAdminReferences(String userId) {
        List<ActivityEvent> managedEvents = activityEventsRepository.findByAdminsContaining(userId);
        List<ActivityEvent> changedEvents = new ArrayList<>();
        for (ActivityEvent event : managedEvents == null ? List.<ActivityEvent>of() : managedEvents) {
            if (event == null || event.getAdmins() == null || event.getAdmins().isEmpty()) {
                continue;
            }
            List<String> retainedAdmins = event.getAdmins().stream()
                    .filter(adminId -> !userId.equals(safeText(adminId)))
                    .toList();
            if (retainedAdmins.size() != event.getAdmins().size()) {
                event.setAdmins(new ArrayList<>(retainedAdmins));
                changedEvents.add(event);
            }
        }
        if (!changedEvents.isEmpty()) {
            activityEventsRepository.saveAll(changedEvents);
        }
    }
    private void addMemberships(Map<String, ActivityMember> membershipsByKey, List<ActivityMember> memberships) {
        for (ActivityMember membership : memberships == null ? List.<ActivityMember>of() : memberships) {
            if (membership == null) {
                continue;
            }
            String key = safeText(membership.getId());
            if (!StringUtils.hasText(key)) {
                key = safeText(membership.getOwnerType()) + ":" + safeText(membership.getOwnerId()) + ":" + safeText(membership.getUserId());
            }
            if (StringUtils.hasText(key)) {
                membershipsByKey.putIfAbsent(key, membership);
            }
        }
    }
    public void purgeActivityResources(String userId, Collection<String> ownedEventIds, Collection<String> ownedAssetIds) {
        deleteDocumentsByAnyField(
                "activityResources",
                List.of("assetOwnerUserId", "createdUser", "updatedUser"),
                userId);
        if (ownedEventIds != null && !ownedEventIds.isEmpty()) {
            mongoTemplate.remove(Query.query(Criteria.where("ownerId").in(ownedEventIds)), "activityResources");
        }
        List<ActivitySubEventResource> resources = mongoTemplate.find(
                Query.query(new Criteria().orOperator(
                        Criteria.where("supplyContributionEntriesByAssetId").exists(true),
                        Criteria.where("assetSettingsByType").exists(true),
                        Criteria.where("assetAssignmentIds").exists(true))),
                ActivitySubEventResource.class);
        List<ActivitySubEventResource> changedResources = new ArrayList<>();
        LinkedHashSet<String> ownedAssetIdSet = new LinkedHashSet<>(ownedAssetIds == null ? List.<String>of() : ownedAssetIds);
        for (ActivitySubEventResource resource : resources == null ? List.<ActivitySubEventResource>of() : resources) {
            if (resource == null) {
                continue;
            }
            boolean changed = removeSupplyContributionsByUser(resource, userId);
            changed = removeSettingsByUser(resource, userId) || changed;
            if (!ownedAssetIdSet.isEmpty()) {
                changed = removeOwnedAssetReferences(resource, ownedAssetIdSet) || changed;
            }
            if (changed) {
                changedResources.add(resource);
            }
        }
        if (!changedResources.isEmpty()) {
            for (ActivitySubEventResource resource : changedResources) {
                mongoTemplate.save(resource);
            }
        }
    }
    private boolean removeSupplyContributionsByUser(ActivitySubEventResource resource, String userId) {
        Map<String, List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>> entriesByAssetId =
                resource.getSupplyContributionEntriesByAssetId();
        if (entriesByAssetId == null || entriesByAssetId.isEmpty()) {
            return false;
        }
        boolean changed = false;
        Map<String, List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>> next = new LinkedHashMap<>();
        for (Map.Entry<String, List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>> entry : entriesByAssetId.entrySet()) {
            List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord> retained = (entry.getValue() == null
                    ? List.<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>of()
                    : entry.getValue()).stream()
                    .filter(item -> item != null && !userId.equals(safeText(item.userId())))
                    .toList();
            if (retained.size() != (entry.getValue() == null ? 0 : entry.getValue().size())) {
                changed = true;
            }
            if (!retained.isEmpty()) {
                next.put(entry.getKey(), new ArrayList<>(retained));
            } else if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                changed = true;
            }
        }
        if (changed) {
            resource.setSupplyContributionEntriesByAssetId(next);
        }
        return changed;
    }
    private boolean removeSettingsByUser(ActivitySubEventResource resource, String userId) {
        Map<String, Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>> settingsByType =
                resource.getAssetSettingsByType();
        if (settingsByType == null || settingsByType.isEmpty()) {
            return false;
        }
        boolean changed = false;
        Map<String, Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>> next = new LinkedHashMap<>();
        for (Map.Entry<String, Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>> typeEntry : settingsByType.entrySet()) {
            Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord> retainedByAsset = new LinkedHashMap<>();
            for (Map.Entry<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord> assetEntry
                    : (typeEntry.getValue() == null ? Map.<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>of() : typeEntry.getValue()).entrySet()) {
                ActivitySubEventResource.SubEventAssignedAssetSettingsRecord settings = assetEntry.getValue();
                if (settings != null && userId.equals(safeText(settings.addedByUserId()))) {
                    changed = true;
                    continue;
                }
                retainedByAsset.put(assetEntry.getKey(), settings);
            }
            if (!retainedByAsset.isEmpty()) {
                next.put(typeEntry.getKey(), retainedByAsset);
            } else if (typeEntry.getValue() != null && !typeEntry.getValue().isEmpty()) {
                changed = true;
            }
        }
        if (changed) {
            resource.setAssetSettingsByType(next);
        }
        return changed;
    }
    private boolean removeOwnedAssetReferences(ActivitySubEventResource resource, Collection<String> ownedAssetIds) {
        Map<String, List<String>> assignments = resource.getAssetAssignmentIds();
        if (assignments == null || assignments.isEmpty()) {
            return false;
        }
        boolean changed = false;
        Map<String, List<String>> next = new LinkedHashMap<>();
        for (Map.Entry<String, List<String>> entry : assignments.entrySet()) {
            List<String> retained = (entry.getValue() == null ? List.<String>of() : entry.getValue()).stream()
                    .filter(assetId -> !ownedAssetIds.contains(safeText(assetId)))
                    .toList();
            if (retained.size() != (entry.getValue() == null ? 0 : entry.getValue().size())) {
                changed = true;
            }
            if (!retained.isEmpty()) {
                next.put(entry.getKey(), new ArrayList<>(retained));
            }
        }
        if (changed) {
            resource.setAssetAssignmentIds(next);
        }
        return changed;
    }

    public void anonymizeTicketAudit(String userId) { anonymizeUserFieldsByAnyField("eventTicketAudit", List.of("holderUserId", "actorUserId", "originalUsedByUserId"), userId); }
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.feedback.api.FeedbackPrivacy feedback;
    public void purgeFeedback(String userId) { feedback.purgeFeedback(userId); }
    public void purgeLeaderboard(String userId) { deleteDocumentsByAnyField("eventLeaderboardEntries", List.of("memberId", "homeMemberId", "awayMemberId", "createdUser", "updatedUser"), userId); }
    public void anonymizeSchedulerMarkers(String userId) { anonymizeUserFieldsByAnyField("schedulerPlanMarkers", List.of("updatedUser"), userId); }

    private void deletePurgeMedia(String mediaUrlOrKey) {
        mediaStorageService.deletePublicObjectOrThrow(mediaUrlOrKey);
    }
    private void deleteDocumentsByAnyField(String collectionName, List<String> fields, String userId) {
        if (!StringUtils.hasText(collectionName) || fields == null || fields.isEmpty() || !StringUtils.hasText(userId)) {
            return;
        }
        List<Criteria> criteria = fields.stream()
                .filter(StringUtils::hasText)
                .map(field -> Criteria.where(field).is(userId))
                .toList();
        if (criteria.isEmpty()) {
            return;
        }
        mongoTemplate.remove(Query.query(new Criteria().orOperator(criteria.toArray(Criteria[]::new))), collectionName);
    }
    private void anonymizeUserFieldsByAnyField(String collectionName, List<String> fields, String userId) {
        if (!StringUtils.hasText(collectionName) || fields == null || fields.isEmpty() || !StringUtils.hasText(userId)) {
            return;
        }
        List<String> fieldNames = fields.stream()
                .filter(StringUtils::hasText)
                .toList();
        if (fieldNames.isEmpty()) {
            return;
        }
        for (String field : fieldNames) {
            Update update = new Update();
            update.set(field, "deleted-user");
            mongoTemplate.updateMulti(Query.query(Criteria.where(field).is(userId)), update, collectionName);
        }
    }
    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
    public void purgeAssetMemberships(Collection<String> assetIds) {
        if (assetIds == null || assetIds.isEmpty()) return;
        var members = activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_ASSET, assetIds);
        if (members != null && !members.isEmpty()) activityMembersRepository.deleteAll(members);
    }
}
