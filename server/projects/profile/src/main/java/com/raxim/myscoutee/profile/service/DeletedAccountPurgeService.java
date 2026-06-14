package com.raxim.myscoutee.profile.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import org.bson.Document;
import com.raxim.myscoutee.profile.data.document.AccountPurgeJob;
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.ActivityChatMessage;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageAttachmentRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageReactionRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageReplyRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatReadAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.IdeaPost;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AccountPurgeJobsRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class DeletedAccountPurgeService {
    private static final int DELETE_GRACE_DAYS = 30;
    private static final Duration PURGE_JOB_LEASE = Duration.ofMinutes(30);
    private static final Duration PURGE_RETRY_BASE = Duration.ofMinutes(15);
    private static final Duration PURGE_RETRY_MAX = Duration.ofHours(24);
    private static final String PROFILE_STATUS_DELETED = "deleted";
    private static final String PROFILE_STATUS_ONBOARDING = "onboarding";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";

    private final UsersRepository usersRepository;
    private final ActivityChatsRepository activityChatsRepository;
    private final ActivityChatMessagesRepository activityChatMessagesRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final AssetsRepository assetsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AccountPurgeJobsRepository accountPurgeJobsRepository;
    private final MediaStorageService mediaStorageService;
    private final MongoTemplate mongoTemplate;
    private final PlatformParametersService platformParametersService;

    public DeletedAccountPurgeService(
            UsersRepository usersRepository,
            ActivityChatsRepository activityChatsRepository,
            ActivityChatMessagesRepository activityChatMessagesRepository,
            ActivityEventsRepository activityEventsRepository,
            AssetsRepository assetsRepository,
            ActivityMembersRepository activityMembersRepository,
            AccountPurgeJobsRepository accountPurgeJobsRepository,
            MediaStorageService mediaStorageService,
            MongoTemplate mongoTemplate,
            PlatformParametersService platformParametersService) {
        this.usersRepository = usersRepository;
        this.activityChatsRepository = activityChatsRepository;
        this.activityChatMessagesRepository = activityChatMessagesRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.assetsRepository = assetsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.accountPurgeJobsRepository = accountPurgeJobsRepository;
        this.mediaStorageService = mediaStorageService;
        this.mongoTemplate = mongoTemplate;
        this.platformParametersService = platformParametersService;
    }

    @Scheduled(fixedDelayString = "${users.deleted-account-purge-delay-ms:3600000}")
    public void purgeExpiredDeletedAccounts() {
        Instant now = Instant.now();
        String purgeBeforeIso = now.minus(deleteGraceDays(), ChronoUnit.DAYS).toString();
        purgeExpiredUsers(PROFILE_STATUS_DELETED, purgeBeforeIso, now);
        purgeExpiredUsers(PROFILE_STATUS_ONBOARDING, purgeBeforeIso, now);
        resumeDuePurgeJobs(now);
    }

    private void purgeExpiredUsers(String profileStatus, String purgeBeforeIso, Instant now) {
        List<Users> users = usersRepository.findByProfileStatusAndDeletedAtIsoLessThanEqual(profileStatus, purgeBeforeIso);
        for (Users user : users == null ? List.<Users>of() : users) {
            purgeUser(user, null, now);
        }
    }

    private int deleteGraceDays() {
        return platformParametersService == null
                ? DELETE_GRACE_DAYS
                : platformParametersService.accountPurgeWindowDays(DELETE_GRACE_DAYS);
    }

    private void resumeDuePurgeJobs(Instant now) {
        List<AccountPurgeJob> jobs = accountPurgeJobsRepository.findByStatusIn(List.of(
                AccountPurgeJob.STATUS_PENDING,
                AccountPurgeJob.STATUS_RUNNING,
                AccountPurgeJob.STATUS_FAILED));
        for (AccountPurgeJob job : jobs == null ? List.<AccountPurgeJob>of() : jobs) {
            String userId = safeText(job == null ? null : job.getUserId());
            if (!StringUtils.hasText(userId) || !shouldRunPurgeJob(job, now)) {
                continue;
            }
            Users user = usersRepository.findById(userId).orElse(null);
            if (user == null) {
                completeJob(job, now);
                continue;
            }
            purgeUser(user, job, now);
        }
    }

    private void purgeUser(Users user, AccountPurgeJob existingJob, Instant now) {
        String userId = user == null ? "" : safeText(user.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        AccountPurgeJob job = existingJob == null ? loadOrCreatePurgeJob(userId, now) : existingJob;
        if (!shouldRunPurgeJob(job, now)) {
            return;
        }
        try {
            startJob(job, userId, now);

            markStage(job, "profile-media");
            purgeUserMedia(user);

            markStage(job, "owned-events");
            List<ActivityEvent> ownedEvents = findOwnedEventsForPurge(userId);
            job.setOwnedEventIds(mergeIds(job.getOwnedEventIds(), sourceIds(ownedEvents)));
            saveJob(job);
            purgeOwnedEvents(ownedEvents, job.getOwnedEventIds());

            markStage(job, "owned-assets");
            List<Asset> ownedAssets = assetsRepository.findByOwnerUserId(userId);
            job.setOwnedAssetIds(mergeIds(job.getOwnedAssetIds(), assetIds(ownedAssets)));
            saveJob(job);
            purgeOwnedAssets(ownedAssets, job.getOwnedAssetIds());

            markStage(job, "memberships");
            purgeActivityMemberships(userId);
            purgeManagedEventAdminReferences(userId);

            markStage(job, "asset-requests");
            purgeRemainingAssetRequests(userId);

            markStage(job, "activity-resources");
            purgeActivityResources(userId, job.getOwnedEventIds(), job.getOwnedAssetIds());

            markStage(job, "idea-posts");
            purgeIdeaPosts(userId);

            markStage(job, "chat-activity");
            purgeUserChatActivity(userId);

            markStage(job, "referenced-documents");
            purgeUserReferencedDocuments(userId);

            markStage(job, "delete-user");
            usersRepository.delete(user);

            completeJob(job, Instant.now());
        } catch (RuntimeException exception) {
            failJob(job, exception, Instant.now());
        }
    }

    private AccountPurgeJob loadOrCreatePurgeJob(String userId, Instant now) {
        java.util.Optional<AccountPurgeJob> existing = accountPurgeJobsRepository.findByUserId(userId);
        if (existing != null && existing.isPresent()) {
            return existing.get();
        }
        AccountPurgeJob job = new AccountPurgeJob();
        String nowIso = now.toString();
        job.setUserId(userId);
        job.setUserHash(hashUserId(userId));
        job.setStatus(AccountPurgeJob.STATUS_PENDING);
        job.setStage("queued");
        job.setRetryCount(0);
        job.setCreatedDate(nowIso);
        job.setUpdatedDate(nowIso);
        AccountPurgeJob saved = accountPurgeJobsRepository.save(job);
        return saved == null ? job : saved;
    }

    private boolean shouldRunPurgeJob(AccountPurgeJob job, Instant now) {
        if (job == null || AccountPurgeJob.STATUS_COMPLETED.equals(safeText(job.getStatus()))) {
            return false;
        }
        if (AccountPurgeJob.STATUS_RUNNING.equals(safeText(job.getStatus())) && isFuture(job.getLockedUntilIso(), now)) {
            return false;
        }
        return !AccountPurgeJob.STATUS_FAILED.equals(safeText(job.getStatus())) || !isFuture(job.getNextRetryAtIso(), now);
    }

    private void startJob(AccountPurgeJob job, String userId, Instant now) {
        String nowIso = now.toString();
        job.setUserId(userId);
        job.setUserHash(hashUserId(userId));
        job.setStatus(AccountPurgeJob.STATUS_RUNNING);
        job.setStage("start");
        job.setNextRetryAtIso(null);
        job.setLockedUntilIso(now.plus(PURGE_JOB_LEASE).toString());
        if (!StringUtils.hasText(safeText(job.getStartedAtIso()))) {
            job.setStartedAtIso(nowIso);
        }
        job.setLastError(null);
        job.setUpdatedDate(nowIso);
        saveJob(job);
    }

    private void markStage(AccountPurgeJob job, String stage) {
        Instant now = Instant.now();
        job.setStatus(AccountPurgeJob.STATUS_RUNNING);
        job.setStage(stage);
        job.setLockedUntilIso(now.plus(PURGE_JOB_LEASE).toString());
        job.setUpdatedDate(now.toString());
        saveJob(job);
    }

    private void completeJob(AccountPurgeJob job, Instant now) {
        job.setStatus(AccountPurgeJob.STATUS_COMPLETED);
        job.setStage("completed");
        job.setUserId(null);
        job.setOwnedEventIds(List.of());
        job.setOwnedAssetIds(List.of());
        job.setNextRetryAtIso(null);
        job.setLockedUntilIso(null);
        job.setCompletedAtIso(now.toString());
        job.setLastError(null);
        job.setUpdatedDate(now.toString());
        saveJob(job);
    }

    private void failJob(AccountPurgeJob job, RuntimeException exception, Instant now) {
        int retryCount = Math.max(0, job.getRetryCount() == null ? 0 : job.getRetryCount().intValue()) + 1;
        job.setStatus(AccountPurgeJob.STATUS_FAILED);
        job.setRetryCount(retryCount);
        job.setNextRetryAtIso(now.plus(retryDelay(retryCount)).toString());
        job.setLockedUntilIso(null);
        job.setLastError(truncateError(exception));
        job.setUpdatedDate(now.toString());
        saveJob(job);
    }

    private AccountPurgeJob saveJob(AccountPurgeJob job) {
        AccountPurgeJob saved = accountPurgeJobsRepository.save(job);
        return saved == null ? job : saved;
    }

    private Duration retryDelay(int retryCount) {
        long seconds = PURGE_RETRY_BASE.toSeconds();
        for (int index = 1; index < Math.min(retryCount, 8); index += 1) {
            seconds = Math.min(PURGE_RETRY_MAX.toSeconds(), seconds * 2L);
        }
        return Duration.ofSeconds(Math.min(PURGE_RETRY_MAX.toSeconds(), seconds));
    }

    private boolean isFuture(String iso, Instant now) {
        if (!StringUtils.hasText(safeText(iso))) {
            return false;
        }
        try {
            return Instant.parse(iso).isAfter(now);
        } catch (RuntimeException ignored) {
            return false;
        }
    }

    private String truncateError(RuntimeException exception) {
        String value = exception == null ? "" : safeText(exception.getMessage());
        if (!StringUtils.hasText(value) && exception != null) {
            value = exception.getClass().getSimpleName();
        }
        return value.length() <= 500 ? value : value.substring(0, 500);
    }

    private String hashUserId(String userId) {
        try {
            byte[] bytes = MessageDigest.getInstance("SHA-256")
                    .digest(("account-purge:" + safeText(userId)).getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(bytes.length * 2);
            for (byte value : bytes) {
                builder.append(String.format("%02x", value & 0xff));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }

    private void purgeUserMedia(Users user) {
        if (user == null) {
            return;
        }
        for (String imageUrl : user.getImages() == null ? List.<String>of() : user.getImages()) {
            deletePurgeMedia(imageUrl);
        }
    }

    private List<ActivityEvent> findOwnedEventsForPurge(String userId) {
        Map<String, ActivityEvent> eventsByKey = new LinkedHashMap<>();
        addEvents(eventsByKey, activityEventsRepository.findByOwnerUserId(userId));
        addEvents(eventsByKey, activityEventsRepository.findByCreatorUserId(userId));
        return new ArrayList<>(eventsByKey.values());
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

    private List<String> sourceIds(List<ActivityEvent> ownedEvents) {
        return (ownedEvents == null ? List.<ActivityEvent>of() : ownedEvents).stream()
                .filter(Objects::nonNull)
                .map(ActivityEvent::getSourceId)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private void purgeOwnedEvents(List<ActivityEvent> ownedEvents, Collection<String> sourceIds) {
        List<ActivityEvent> events = ownedEvents == null ? List.of() : ownedEvents;
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

    private List<String> assetIds(List<Asset> ownedAssets) {
        return (ownedAssets == null ? List.<Asset>of() : ownedAssets).stream()
                .filter(Objects::nonNull)
                .map(Asset::getAssetId)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private void purgeOwnedAssets(List<Asset> ownedAssets, Collection<String> assetIds) {
        List<Asset> assets = ownedAssets == null ? List.of() : ownedAssets;
        for (Asset asset : assets) {
            if (asset != null) {
                deletePurgeMedia(asset.getImageUrl());
            }
        }
        if (assetIds != null && !assetIds.isEmpty()) {
            List<ActivityMember> members = activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_ASSET, assetIds);
            if (members != null && !members.isEmpty()) {
                activityMembersRepository.deleteAll(members);
            }
        }
        if (!assets.isEmpty()) {
            assetsRepository.deleteAll(assets);
        }
    }

    private List<String> mergeIds(Collection<String> existing, Collection<String> discovered) {
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        for (String id : existing == null ? List.<String>of() : existing) {
            String normalized = safeText(id);
            if (StringUtils.hasText(normalized)) {
                ids.add(normalized);
            }
        }
        for (String id : discovered == null ? List.<String>of() : discovered) {
            String normalized = safeText(id);
            if (StringUtils.hasText(normalized)) {
                ids.add(normalized);
            }
        }
        return new ArrayList<>(ids);
    }

    private void deletePurgeMedia(String mediaUrlOrKey) {
        mediaStorageService.deletePublicObjectOrThrow(mediaUrlOrKey);
    }

    private void purgeActivityMemberships(String userId) {
        Map<String, ActivityMember> membershipsByKey = new LinkedHashMap<>();
        addMemberships(membershipsByKey, activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, userId));
        addMemberships(membershipsByKey, activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_ASSET, userId));
        if (!membershipsByKey.isEmpty()) {
            activityMembersRepository.deleteAll(membershipsByKey.values());
        }
    }

    private void purgeManagedEventAdminReferences(String userId) {
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

    private void purgeRemainingAssetRequests(String userId) {
        List<Asset> assetsWithRequests = mongoTemplate.find(
                Query.query(Criteria.where("requests.userId").is(userId)),
                Asset.class);
        List<Asset> changedAssets = new ArrayList<>();
        for (Asset asset : assetsWithRequests == null ? List.<Asset>of() : assetsWithRequests) {
            if (asset == null || asset.getRequests() == null || asset.getRequests().isEmpty()) {
                continue;
            }
            List<Asset.AssetRequestRecord> retainedRequests = asset.getRequests().stream()
                    .filter(request -> request != null && !userId.equals(safeText(request.userId())))
                    .toList();
            if (retainedRequests.size() != asset.getRequests().size()) {
                asset.setRequests(new ArrayList<>(retainedRequests));
                changedAssets.add(asset);
            }
        }
        if (!changedAssets.isEmpty()) {
            assetsRepository.saveAll(changedAssets);
        }
    }

    private void purgeActivityResources(String userId, Collection<String> ownedEventIds, Collection<String> ownedAssetIds) {
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

    private void purgeIdeaPosts(String userId) {
        List<IdeaPost> posts = mongoTemplate.find(
                Query.query(new Criteria().orOperator(
                        Criteria.where("createdUser").is(userId),
                        Criteria.where("updatedUser").is(userId),
                        Criteria.where("trashedByUserId").is(userId))),
                IdeaPost.class);
        for (IdeaPost post : posts == null ? List.<IdeaPost>of() : posts) {
            if (post == null) {
                continue;
            }
            deletePurgeMedia(post.getImageUrl());
            for (String imageUrl : post.getImageUrls() == null ? List.<String>of() : post.getImageUrls()) {
                deletePurgeMedia(imageUrl);
            }
        }
        if (posts != null && !posts.isEmpty()) {
            mongoTemplate.remove(Query.query(Criteria.where("_id").in(posts.stream().map(IdeaPost::getId).toList())), IdeaPost.class);
        }
    }

    private void purgeUserReferencedDocuments(String userId) {
        deleteDocumentsByAnyField("userRates", List.of("ownerUserId", "relatedUserId", "secondaryRelatedUserId", "bridgeUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("userAffinityEdges", List.of("leftUserId", "rightUserId"), userId);
        deleteDocumentsByAnyField("userExperienceProfiles", List.of("userId"), userId);
        deleteDocumentsByAnyField("userFilterPreferences", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("privacyConsents", List.of("userId"), userId);
        deleteDocumentsByAnyField("userFeedback", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("userReports", List.of("userId", "targetUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("userSessionActions", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("payments", List.of("userId"), userId);
        deleteDocumentsByAnyField("scheduledMessageTasks", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("scheduledMessageDeliveries", List.of("userId", "createdUser"), userId);
        deleteDocumentsByAnyField("scheduledMessageRuns", List.of("createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("emailOutbox", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("notificationOutbox", List.of("recipientUserIds", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("shareTokens", List.of("ownerUserId"), userId);
        deleteDocumentsByAnyField("eventFeedbackAnswers", List.of("viewerUserId", "targetUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("eventFeedbackStates", List.of("viewerUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("affinityRecomputeTasks", List.of("targetId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("affinityRecomputeTasks", List.of("targetId"), "USER:" + userId);
        deleteDocumentsByAnyField("eventLeaderboardEntries", List.of("memberId", "homeMemberId", "awayMemberId", "createdUser", "updatedUser"), userId);
        anonymizeUserFieldsByAnyField("helpCenterAudit", List.of("actorUserId"), userId);
        anonymizeUserFieldsByAnyField("helpCenterRevisions", List.of("createdUser", "updatedUser"), userId);
        anonymizeUserFieldsByAnyField("schedulerPlanMarkers", List.of("updatedUser"), userId);
        anonymizeUserFieldsByAnyField("emailTemplates", List.of("createdUser", "updatedUser"), userId);
        anonymizeUserFieldsByAnyField("emailCampaignRules", List.of("createdUser", "updatedUser"), userId);
        anonymizeUserFieldsByAnyField("notificationRuleConfigs", List.of("createdUser", "updatedUser"), userId);
        anonymizeUserFieldsByAnyField("affinityConfigs", List.of("changedUser"), userId);
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

    private void purgeUserChatActivity(String userId) {
        Map<String, ActivityChat> chatsByKey = new LinkedHashMap<>();
        addChats(chatsByKey, activityChatsRepository.findByOwnerUserId(userId));
        addChats(chatsByKey, activityChatsRepository.findByMemberIdsContaining(userId));
        Set<String> chatIds = new LinkedHashSet<>();
        addMessageChatIds(chatIds, activityChatMessagesRepository.findByMessageSenderUserId(userId));
        addMessageChatIds(chatIds, activityChatMessagesRepository.findByMessageReadByUserId(userId));
        addMessageChatIds(chatIds, activityChatMessagesRepository.findByMessageReactionUserId(userId));
        addMessageChatIds(chatIds, activityChatMessagesRepository.findByPollVoterUserId(userId));
        for (ActivityChat chat : chatsByKey.values()) {
            String chatId = safeText(chat == null ? null : chat.getChatId());
            if (StringUtils.hasText(chatId)) {
                chatIds.add(chatId);
            }
        }
        for (String chatId : chatIds) {
            addChats(chatsByKey, activityChatsRepository.findByChatId(chatId));
        }
        if (chatsByKey.isEmpty() && chatIds.isEmpty()) {
            return;
        }

        Map<String, List<ActivityChatMessage>> messagesByChatId = new LinkedHashMap<>();
        for (String chatId : chatIds) {
            String normalizedChatId = safeText(chatId);
            if (!StringUtils.hasText(normalizedChatId)) {
                continue;
            }
            messagesByChatId.put(normalizedChatId, activityChatMessagesRepository.findByChatIdOrderBySentAtIsoAsc(normalizedChatId));
        }

        String purgeAtIso = Instant.now().toString();
        List<ActivityChatMessage> changedMessages = new ArrayList<>();
        Set<String> summaryRefreshChatIds = new LinkedHashSet<>();
        for (Map.Entry<String, List<ActivityChatMessage>> entry : messagesByChatId.entrySet()) {
            Set<String> purgedMessageIds = collectSentMessageIds(entry.getValue(), userId);
            for (ActivityChatMessage message : entry.getValue()) {
                if (message == null) {
                    continue;
                }
                boolean changed = false;
                boolean sentByUser = isSentByUser(message, userId);
                if (sentByUser) {
                    purgeMessageMedia(message);
                    scrubSentMessage(message, userId, purgeAtIso);
                    changed = true;
                }
                changed = removeReadsByUser(message, userId) || changed;
                changed = removeReactionsByUser(message, userId) || changed;
                changed = removePollVotesByUser(message, userId) || changed;
                changed = scrubReplyToPurgedMessage(message, purgedMessageIds) || changed;
                changed = clearPinByUser(message, userId) || changed;
                if (userId.equals(safeText(message.getDeletedByUserId()))) {
                    message.setDeletedByName("Deleted user");
                    changed = true;
                }
                if (changed) {
                    message.refreshMessageSearchFields();
                    changedMessages.add(message);
                    summaryRefreshChatIds.add(entry.getKey());
                }
            }
        }

        List<ActivityChat> changedChats = new ArrayList<>();
        for (ActivityChat chat : chatsByKey.values()) {
            if (chat == null) {
                continue;
            }
            boolean changed = removeMember(chat, userId);
            if (userId.equals(safeText(chat.getOwnerUserId()))) {
                chat.setOwnerUserId("deleted-user");
                changed = true;
            }
            if (changed) {
                String chatId = safeText(chat.getChatId());
                if (StringUtils.hasText(chatId)) {
                    summaryRefreshChatIds.add(chatId);
                }
                changedChats.add(chat);
            }
        }
        if (!changedMessages.isEmpty()) {
            activityChatMessagesRepository.saveAll(changedMessages);
        }
        if (!changedChats.isEmpty()) {
            activityChatsRepository.saveAll(changedChats);
        }
        for (String chatId : summaryRefreshChatIds) {
            refreshChatSummary(chatId);
        }
    }

    private void addChats(Map<String, ActivityChat> chatsByKey, List<ActivityChat> chats) {
        for (ActivityChat chat : chats == null ? List.<ActivityChat>of() : chats) {
            if (chat == null) {
                continue;
            }
            String key = safeText(chat.getMongoId());
            if (!StringUtils.hasText(key)) {
                key = safeText(chat.getOwnerUserId()) + ":" + safeText(chat.getChatId());
            }
            if (StringUtils.hasText(key)) {
                chatsByKey.putIfAbsent(key, chat);
            }
        }
    }

    private void addMessageChatIds(Set<String> chatIds, List<ActivityChatMessage> messages) {
        if (chatIds == null) {
            return;
        }
        for (ActivityChatMessage message : messages == null ? List.<ActivityChatMessage>of() : messages) {
            String chatId = safeText(message == null ? null : message.getChatId());
            if (StringUtils.hasText(chatId)) {
                chatIds.add(chatId);
            }
        }
    }

    private Set<String> collectSentMessageIds(List<? extends ChatMessageRecord> messages, String userId) {
        Set<String> ids = new LinkedHashSet<>();
        for (ChatMessageRecord message : messages == null ? List.<ChatMessageRecord>of() : messages) {
            String messageId = safeText(message == null ? null : message.getId());
            if (StringUtils.hasText(messageId) && isSentByUser(message, userId)) {
                ids.add(messageId);
            }
        }
        return ids;
    }

    private boolean removeMember(ActivityChat chat, String userId) {
        List<String> members = chat.getMemberIds() == null ? List.of() : chat.getMemberIds();
        List<String> retained = members.stream()
                .filter(memberId -> !userId.equals(safeText(memberId)))
                .toList();
        if (retained.size() == members.size()) {
            return false;
        }
        chat.setMemberIds(new ArrayList<>(retained));
        return true;
    }

    private boolean isSentByUser(ChatMessageRecord message, String userId) {
        ChatAvatarRecord senderAvatar = message == null ? null : message.getSenderAvatar();
        return senderAvatar != null && userId.equals(safeText(senderAvatar.getId()));
    }

    private void purgeMessageMedia(ChatMessageRecord message) {
        for (ChatMessageAttachmentRecord attachment : message.getAttachments() == null ? List.<ChatMessageAttachmentRecord>of() : message.getAttachments()) {
            if (attachment == null) {
                continue;
            }
            String type = safeText(attachment.getType()).toLowerCase();
            if ("voice".equals(type) || "image".equals(type)) {
                deletePurgeMedia(attachment.getUrl());
                deletePurgeMedia(attachment.getPreviewUrl());
            }
        }
    }

    private void scrubSentMessage(ChatMessageRecord message, String userId, String purgeAtIso) {
        message.setSender("Deleted user");
        ChatAvatarRecord senderAvatar = message.getSenderAvatar();
        if (senderAvatar != null) {
            senderAvatar.setInitials("DU");
            senderAvatar.setGender("deleted");
        }
        message.setText("");
        message.setAttachments(new ArrayList<>());
        message.setReadBy(new ArrayList<>());
        message.setReactions(new ArrayList<>());
        message.setEditedAtIso(null);
        message.setPinnedAtIso(null);
        message.setPinnedByUserId(null);
        if (!StringUtils.hasText(message.getDeletedAtIso())) {
            message.setDeletedAtIso(purgeAtIso);
            message.setDeletedByUserId(userId);
        }
        message.setDeletedByName("Deleted user");
    }

    private boolean removeReadsByUser(ChatMessageRecord message, String userId) {
        List<ChatReadAvatarRecord> readBy = message.getReadBy() == null ? List.of() : message.getReadBy();
        List<ChatReadAvatarRecord> retained = readBy.stream()
                .filter(reader -> reader != null && !userId.equals(safeText(reader.getId())))
                .toList();
        if (retained.size() == readBy.size()) {
            return false;
        }
        message.setReadBy(new ArrayList<>(retained));
        return true;
    }

    private boolean removeReactionsByUser(ChatMessageRecord message, String userId) {
        List<ChatMessageReactionRecord> reactions = message.getReactions() == null ? List.of() : message.getReactions();
        List<ChatMessageReactionRecord> retained = reactions.stream()
                .filter(reaction -> reaction != null && !userId.equals(safeText(reaction.getUserId())))
                .toList();
        if (retained.size() == reactions.size()) {
            return false;
        }
        message.setReactions(new ArrayList<>(retained));
        return true;
    }

    private boolean removePollVotesByUser(ChatMessageRecord message, String userId) {
        boolean changed = false;
        for (ChatMessageAttachmentRecord attachment : message.getAttachments() == null ? List.<ChatMessageAttachmentRecord>of() : message.getAttachments()) {
            if (attachment == null || !"poll".equalsIgnoreCase(safeText(attachment.getType()))) {
                continue;
            }
            String nextDescription = removePollVotes(attachment.getDescription(), userId);
            if (nextDescription != null && !Objects.equals(safeText(attachment.getDescription()), nextDescription)) {
                attachment.setDescription(nextDescription);
                changed = true;
            }
        }
        return changed;
    }

    private String removePollVotes(String description, String userId) {
        String normalizedDescription = safeText(description);
        if (!StringUtils.hasText(normalizedDescription) || !normalizedDescription.contains(userId)) {
            return null;
        }
        try {
            Document root = Document.parse(normalizedDescription);
            Object optionsValue = root.get("options");
            if (!(optionsValue instanceof List<?> optionNodes)) {
                return null;
            }
            boolean changed = false;
            for (Object option : optionNodes) {
                if (!(option instanceof Document optionDocument)) {
                    continue;
                }
                Object votesValue = optionDocument.get("votes");
                if (!(votesValue instanceof List<?> voteNodes)) {
                    continue;
                }
                List<Object> mutableVotes = new ArrayList<>(voteNodes);
                int previousSize = mutableVotes.size();
                mutableVotes.removeIf(vote -> vote instanceof Document voteDocument
                        && userId.equals(safeText(Objects.toString(voteDocument.get("userId"), ""))));
                if (mutableVotes.size() != previousSize) {
                    optionDocument.put("votes", mutableVotes);
                    changed = true;
                }
            }
            return changed ? root.toJson() : null;
        } catch (Exception ignored) {
            return null;
        }
    }

    private boolean scrubReplyToPurgedMessage(ChatMessageRecord message, Set<String> purgedMessageIds) {
        ChatMessageReplyRecord replyTo = message.getReplyTo();
        if (replyTo == null || !purgedMessageIds.contains(safeText(replyTo.getId()))) {
            return false;
        }
        replyTo.setSender("Deleted user");
        replyTo.setText("Message unavailable");
        return true;
    }

    private boolean clearPinByUser(ChatMessageRecord message, String userId) {
        if (!userId.equals(safeText(message.getPinnedByUserId()))) {
            return false;
        }
        message.setPinnedAtIso(null);
        message.setPinnedByUserId(null);
        return true;
    }

    private void refreshChatSummary(String chatId) {
        String normalizedChatId = safeText(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            return;
        }
        ChatMessageRecord latest = latestMessage(activityChatMessagesRepository.findByChatIdOrderBySentAtIsoAsc(normalizedChatId));
        List<ActivityChat> changedChats = new ArrayList<>();
        for (ActivityChat chat : activityChatsRepository.findByChatId(normalizedChatId)) {
            if (chat == null) {
                continue;
            }
            if (latest == null) {
                chat.setLastMessage("");
                chat.setLastSenderId("");
            } else {
                ChatAvatarRecord senderAvatar = latest.getSenderAvatar();
                chat.setLastSenderId(senderAvatar == null ? "" : safeText(senderAvatar.getId()));
                chat.setLastMessage(messageSummary(latest));
            }
            changedChats.add(chat);
        }
        if (!changedChats.isEmpty()) {
            activityChatsRepository.saveAll(changedChats);
        }
    }

    private ChatMessageRecord latestMessage(List<? extends ChatMessageRecord> messages) {
        List<? extends ChatMessageRecord> safeMessages = messages == null ? List.of() : messages;
        return safeMessages.stream()
                .filter(Objects::nonNull)
                .reduce((first, second) -> second)
                .orElse(null);
    }

    private String messageSummary(ChatMessageRecord message) {
        if (StringUtils.hasText(message.getDeletedAtIso())) {
            return "Deleted a message";
        }
        String text = safeText(message.getText());
        if (StringUtils.hasText(text)) {
            return text;
        }
        ChatMessageAttachmentRecord attachment = message.getAttachments() == null || message.getAttachments().isEmpty()
                ? null
                : message.getAttachments().get(0);
        if (attachment == null) {
            return "";
        }
        return switch (safeText(attachment.getType()).toLowerCase()) {
            case "image" -> "Sent an image";
            case "event" -> "Shared an event";
            case "asset" -> "Shared an asset";
            case "voice" -> "Sent a voice clip";
            case "poll" -> "Created a poll";
            case "link" -> "Shared a link";
            default -> StringUtils.hasText(attachment.getTitle()) ? safeText(attachment.getTitle()) : "Shared an attachment";
        };
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
