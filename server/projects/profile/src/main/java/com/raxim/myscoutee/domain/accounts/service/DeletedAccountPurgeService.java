package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.media.api.MediaStorage;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;
import com.raxim.myscoutee.domain.platform.service.PlatformParametersService;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import org.bson.Document;
import com.raxim.myscoutee.domain.accounts.document.AccountPurgeJob;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.document.ChatMessage;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatAvatarRecord;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatMessageAttachmentRecord;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatMessageReactionRecord;
import com.raxim.myscoutee.domain.chat.document.ChatMessage;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatMessageReplyRecord;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatReadAvatarRecord;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.accounts.repository.AccountPurgeJobsRepository;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import com.raxim.myscoutee.domain.operator.service.OperatorGlobalIdentityService;

@Service
public class DeletedAccountPurgeService {
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.content.api.ContentPrivacy contentPrivacy;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.affinity.api.AffinityPrivacy affinityPrivacy;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationPrivacy notificationPrivacy;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.help.api.HelpPrivacy helpPrivacy;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.email.api.EmailPrivacy emailPrivacy;

    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobGroupScope;

    private static final int DELETE_GRACE_DAYS = 30;
    private static final Duration PURGE_JOB_LEASE = Duration.ofMinutes(30);
    private static final Duration PURGE_RETRY_BASE = Duration.ofMinutes(15);
    private static final Duration PURGE_RETRY_MAX = Duration.ofHours(24);
    private static final String PROFILE_STATUS_DELETED = "deleted";
    private static final String PROFILE_STATUS_ONBOARDING = "onboarding";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";

    private final UsersRepository usersRepository;
    private final ChatsRepository chatsRepository;
    private final ChatMessagesRepository chatMessagesRepository;
    private final ActivityEventsRepository activityEventsRepository;
    @Autowired private com.raxim.myscoutee.domain.assets.api.AssetPrivacy assetPrivacy;
    private final AssetOwnership assetsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AccountPurgeJobsRepository accountPurgeJobsRepository;
    private final MediaStorage mediaStorageService;
    private final MongoTemplate mongoTemplate;
    private final PlatformParametersService platformParametersService;
    private NotificationJobs notificationRuleRegistryService;
    private ScheduledMongoSessionRunner scheduledMongoSessionRunner;
    private OperatorGlobalIdentityService operatorGlobalIdentityService;

    public DeletedAccountPurgeService(
            UsersRepository usersRepository,
            ChatsRepository chatsRepository,
            ChatMessagesRepository chatMessagesRepository,
            ActivityEventsRepository activityEventsRepository,
            AssetOwnership assetsRepository,
            ActivityMembersRepository activityMembersRepository,
            AccountPurgeJobsRepository accountPurgeJobsRepository,
            MediaStorage mediaStorageService,
            MongoTemplate mongoTemplate,
            PlatformParametersService platformParametersService) {
        this.usersRepository = usersRepository;
        this.chatsRepository = chatsRepository;
        this.chatMessagesRepository = chatMessagesRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.assetsRepository = assetsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.accountPurgeJobsRepository = accountPurgeJobsRepository;
        this.mediaStorageService = mediaStorageService;
        this.mongoTemplate = mongoTemplate;
        this.platformParametersService = platformParametersService;
    }

    @Autowired(required = false)
    void setNotificationRuleRegistryService(NotificationJobs notificationRuleRegistryService) {
        this.notificationRuleRegistryService = notificationRuleRegistryService;
    }

    @Autowired(required = false)
    void setScheduledMongoSessionRunner(ScheduledMongoSessionRunner scheduledMongoSessionRunner) {
        this.scheduledMongoSessionRunner = scheduledMongoSessionRunner;
    }

    @Autowired(required = false)
    void setOperatorGlobalIdentityService(
            OperatorGlobalIdentityService operatorGlobalIdentityService) {
        this.operatorGlobalIdentityService = operatorGlobalIdentityService;
    }

    @Scheduled(fixedDelayString = "${users.deleted-account-purge-delay-ms:3600000}")
    public void purgeExpiredDeletedAccounts() {
        if (scheduledMongoSessionRunner == null) {
            purgeExpiredDeletedAccountsForCurrentDatabase();
            return;
        }
        scheduledMongoSessionRunner.runAcrossConfiguredDatabases(this::purgeExpiredDeletedAccountsForCurrentDatabase);
    }

    private void purgeExpiredDeletedAccountsForCurrentDatabase() {
        var registry = notificationRuleRegistryService;
        if (registry != null) registry.forEachGroup(NotificationJobs.RULE_ACCOUNT_PURGE, this::purgeExpiredDeletedAccountsForCurrentDatabaseInGroup);
    }

    private void purgeExpiredDeletedAccountsForCurrentDatabaseInGroup() {
        Instant now = Instant.now();
        boolean ruleConfigured = notificationRuleRegistryService != null
                && notificationRuleRegistryService
                        .findRule(NotificationJobs.RULE_ACCOUNT_PURGE)
                        .isPresent();
        if (ruleConfigured && !notificationRuleRegistryService.shouldRunScheduledRule(
                NotificationJobs.RULE_ACCOUNT_PURGE,
                now)) {
            return;
        }
        if (ruleConfigured && notificationRuleRegistryService.beginScheduledRun(
                    NotificationJobs.RULE_ACCOUNT_PURGE,
                    "Scheduled deleted-account purge started.",
                    "account-purge",
                    now) == null) {
            return;
        }
        try {
            String purgeBeforeIso = now.minus(deleteGraceDays(), ChronoUnit.DAYS).toString();
            int purgedCount = purgeExpiredUsers(PROFILE_STATUS_DELETED, purgeBeforeIso, now)
                    + purgeExpiredUsers(PROFILE_STATUS_ONBOARDING, purgeBeforeIso, now)
                    + resumeDuePurgeJobs(now);
            if (ruleConfigured) {
                notificationRuleRegistryService.recordRun(
                        NotificationJobs.RULE_ACCOUNT_PURGE,
                        purgedCount,
                        "completed",
                        "Processed scheduled deleted-account purge work.",
                        "account-purge",
                        now);
            }
        } catch (RuntimeException exception) {
            if (ruleConfigured) {
                notificationRuleRegistryService.recordRun(
                        NotificationJobs.RULE_ACCOUNT_PURGE,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        "account-purge",
                        now);
            }
            throw exception;
        }
    }

    private int purgeExpiredUsers(String profileStatus, String purgeBeforeIso, Instant now) {
        int purgedCount = 0;
        List<Users> users = usersRepository.findByProfileStatusAndDeletedAtIsoLessThanEqual(profileStatus, purgeBeforeIso);
        for (Users user : users == null ? List.<Users>of() : users) {
            if (user != null && JobGroupContext.isActive() && !jobGroupScope.matchesWorkspace(user.getWorkspaceGroupId())) continue;
            if (purgeUser(user, null, now)) {
                purgedCount += 1;
            }
        }
        return purgedCount;
    }

    private int deleteGraceDays() {
        return platformParametersService == null
                ? DELETE_GRACE_DAYS
                : platformParametersService.accountPurgeWindowDays(DELETE_GRACE_DAYS);
    }

    private int resumeDuePurgeJobs(Instant now) {
        int purgedCount = 0;
        List<AccountPurgeJob> jobs = accountPurgeJobsRepository.findByStatusIn(List.of(
                AccountPurgeJob.STATUS_PENDING,
                AccountPurgeJob.STATUS_RUNNING,
                AccountPurgeJob.STATUS_FAILED));
        for (AccountPurgeJob job : jobs == null ? List.<AccountPurgeJob>of() : jobs) {
            if (job != null && !java.util.Objects.equals(job.getBaseGroupId(), JobGroupContext.groupId())) continue;
            String userId = safeText(job == null ? null : job.getUserId());
            if (!StringUtils.hasText(userId) || !shouldRunPurgeJob(job, now)) {
                continue;
            }
            Users user = usersRepository.findById(userId).orElse(null);
            if (user == null) {
                completeJob(job, now);
                continue;
            }
            if (purgeUser(user, job, now)) {
                purgedCount += 1;
            }
        }
        return purgedCount;
    }

    private boolean purgeUser(Users user, AccountPurgeJob existingJob, Instant now) {
        String userId = user == null ? "" : safeText(user.getId());
        if (!StringUtils.hasText(userId)) {
            return false;
        }
        AccountPurgeJob job = existingJob == null ? loadOrCreatePurgeJob(userId, now) : existingJob;
        if (!shouldRunPurgeJob(job, now)) {
            return false;
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
            List<? extends Asset> ownedAssets = assetsRepository.findByOwnerUserId(userId);
            job.setOwnedAssetIds(mergeIds(job.getOwnedAssetIds(), assetIds(ownedAssets)));
            saveJob(job);
            purgeOwnedAssets(ownedAssets, job.getOwnedAssetIds());

            markStage(job, "memberships");
            purgeActivityMemberships(userId);
            purgeManagedEventAdminReferences(userId);

            markStage(job, "asset-requests");
            assetPrivacy.purgeRemainingAssetRequests(userId);

            markStage(job, "activity-resources");
            purgeActivityResources(userId, job.getOwnedEventIds(), job.getOwnedAssetIds());

            markStage(job, "idea-posts");
            contentPrivacy.purgeIdeaPosts(userId);

            markStage(job, "chat-activity");
            purgeUserChatActivity(userId);

            markStage(job, "referenced-documents");
            purgeUserReferencedDocuments(userId);

            markStage(job, "global-identity-unlink");
            if (operatorGlobalIdentityService != null) {
                operatorGlobalIdentityService.preparePurgeUnlink(userId);
            }

            markStage(job, "delete-user");
            boolean pendingCounterTracked = Boolean.TRUE.equals(user.getAccountPurgePendingCounterTracked());
            usersRepository.delete(user);
            if (pendingCounterTracked && notificationRuleRegistryService != null) {
                notificationRuleRegistryService.adjustPendingCount(
                        NotificationJobs.RULE_ACCOUNT_PURGE,
                        -1,
                        "admin.jobs.table.affected");
            }

            completeJob(job, Instant.now());
            return true;
        } catch (RuntimeException exception) {
            failJob(job, exception, Instant.now());
            return false;
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
        job.setBaseGroupId(JobGroupContext.groupId());
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
        job.setBaseGroupId(JobGroupContext.groupId());
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

    private List<String> assetIds(List<? extends Asset> ownedAssets) {
        return (ownedAssets == null ? List.<Asset>of() : ownedAssets).stream()
                .filter(Objects::nonNull)
                .map(Asset::getAssetId)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private void purgeOwnedAssets(List<? extends Asset> ownedAssets, Collection<String> assetIds) {
        List<? extends Asset> assets = ownedAssets == null ? List.of() : ownedAssets;
        assetPrivacy.purgeOwnedMedia(assets);
        if (assetIds != null && !assetIds.isEmpty()) {
            List<ActivityMember> members = activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_ASSET, assetIds);
            if (members != null && !members.isEmpty()) {
                activityMembersRepository.deleteAll(members);
            }
        }
        if (!assets.isEmpty()) {
            assetPrivacy.deleteOwnedRecords(assets);
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

    private void purgeUserReferencedDocuments(String userId) {
        affinityPrivacy.purgeRatings(userId);
        affinityPrivacy.purgeEdges(userId);
        deleteDocumentsByAnyField("userFriendships", List.of("leftUserId", "rightUserId"), userId);
        deleteDocumentsByAnyField("userExperienceProfiles", List.of("userId"), userId);
        deleteDocumentsByAnyField("userFilterPreferences", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("userPageFilterPreferences", List.of("userId"), userId);
        deleteDocumentsByAnyField("integrationParticipantInvites", List.of("ownerUserId", "claimedUserId"), userId);
        deleteDocumentsByAnyField("mcpEventSubscriptions", List.of("ownerUserId"), userId);
        deleteDocumentsByAnyField("integrationWebhookDeliveries", List.of("ownerUserId"), userId);
        deleteDocumentsByAnyField("integrationExternalIds", List.of("ownerUserId"), userId);
        mongoTemplate.remove(Query.query(Criteria.where("resourceType").is("participant").and("internalId").is(userId)), "integrationExternalIds");
        deleteDocumentsByAnyField("privacyConsents", List.of("userId"), userId);
        contentPrivacy.purgeFeedback(userId);
        contentPrivacy.purgeReports(userId);
        deleteDocumentsByAnyField("userSessionActions", List.of("userId", "createdUser", "updatedUser"), userId);
        contentPrivacy.purgeFeedViews(userId);
        deleteDocumentsByAnyField("payments", List.of("userId"), userId);
        emailPrivacy.purgeDeliveryData(userId);
        notificationPrivacy.purgeDeliveryData(userId);
        anonymizeUserFieldsByAnyField(
                "eventTicketAudit",
                List.of("holderUserId", "actorUserId", "originalUsedByUserId"),
                userId);
        contentPrivacy.purgeShareTokens(userId);
        deleteDocumentsByAnyField("eventFeedbackAnswers", List.of("viewerUserId", "targetUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("eventFeedbackStates", List.of("viewerUserId", "createdUser", "updatedUser"), userId);
        affinityPrivacy.purgeTasks(userId);
        deleteDocumentsByAnyField("eventLeaderboardEntries", List.of("memberId", "homeMemberId", "awayMemberId", "createdUser", "updatedUser"), userId);
        helpPrivacy.anonymizeAuthors(userId);
        anonymizeUserFieldsByAnyField("schedulerPlanMarkers", List.of("updatedUser"), userId);
        emailPrivacy.anonymizeAuthors(userId);
        notificationPrivacy.anonymizeRuleAuthors(userId);
        affinityPrivacy.anonymizeAuthors(userId);
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
        Map<String, Chat> chatsByKey = new LinkedHashMap<>();
        addChats(chatsByKey, chatsRepository.findByOwnerUserId(userId));
        addChats(chatsByKey, chatsRepository.findByMemberIdsContaining(userId));
        Set<String> chatIds = new LinkedHashSet<>();
        addMessageChatIds(chatIds, chatMessagesRepository.findByMessageSenderUserId(userId));
        addMessageChatIds(chatIds, chatMessagesRepository.findByMessageReadByUserId(userId));
        addMessageChatIds(chatIds, chatMessagesRepository.findByMessageReactionUserId(userId));
        addMessageChatIds(chatIds, chatMessagesRepository.findByPollVoterUserId(userId));
        for (Chat chat : chatsByKey.values()) {
            String chatId = safeText(chat == null ? null : chat.getChatId());
            if (StringUtils.hasText(chatId)) {
                chatIds.add(chatId);
            }
        }
        for (String chatId : chatIds) {
            addChats(chatsByKey, chatsRepository.findByChatId(chatId));
        }
        if (chatsByKey.isEmpty() && chatIds.isEmpty()) {
            return;
        }

        String purgeAtIso = Instant.now().toString();
        Set<String> summaryRefreshChatIds = new LinkedHashSet<>();
        for (String chatId : chatIds) {
            String normalizedChatId = safeText(chatId);
            if (StringUtils.hasText(normalizedChatId)
                    && purgeChatMessagesInBatches(normalizedChatId, userId, purgeAtIso)) {
                summaryRefreshChatIds.add(normalizedChatId);
            }
        }

        List<Chat> changedChats = new ArrayList<>();
        for (Chat chat : chatsByKey.values()) {
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
        if (!changedChats.isEmpty()) {
            chatsRepository.saveAll(changedChats);
        }
        for (String chatId : summaryRefreshChatIds) {
            refreshChatSummary(chatId);
        }
    }

    private void addChats(Map<String, Chat> chatsByKey, List<Chat> chats) {
        for (Chat chat : chats == null ? List.<Chat>of() : chats) {
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

    private void addMessageChatIds(Set<String> chatIds, List<ChatMessage> messages) {
        if (chatIds == null) {
            return;
        }
        for (ChatMessage message : messages == null ? List.<ChatMessage>of() : messages) {
            String chatId = safeText(message == null ? null : message.getChatId());
            if (StringUtils.hasText(chatId)) {
                chatIds.add(chatId);
            }
        }
    }

    private boolean purgeChatMessagesInBatches(String chatId, String userId, String purgeAtIso) {
        int pageSize = 100;
        long total = chatMessagesRepository.countByChatId(chatId);
        Set<String> purgedMessageIds = new LinkedHashSet<>();
        for (int offset = 0; offset < total; offset += pageSize) {
            List<ChatMessage> page = chatMessagesRepository.findByChatIdOrderBySentAtIsoDesc(
                    chatId,
                    PageRequest.of(offset / pageSize, pageSize));
            for (ChatMessage message : page) {
                String messageId = safeText(message == null ? null : message.getId());
                if (StringUtils.hasText(messageId) && isSentByUser(message, userId)) {
                    purgedMessageIds.add(messageId);
                }
            }
        }

        boolean changedAny = false;
        for (int offset = 0; offset < total; offset += pageSize) {
            List<ChatMessage> page = chatMessagesRepository.findByChatIdOrderBySentAtIsoDesc(
                    chatId,
                    PageRequest.of(offset / pageSize, pageSize));
            List<ChatMessage> changedMessages = new ArrayList<>();
            for (ChatMessage message : page) {
                if (message == null) {
                    continue;
                }
                boolean changed = false;
                if (isSentByUser(message, userId)) {
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
                }
            }
            if (!changedMessages.isEmpty()) {
                chatMessagesRepository.saveAll(changedMessages);
                changedAny = true;
            }
        }
        return changedAny;
    }

    private boolean removeMember(Chat chat, String userId) {
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

    private boolean isSentByUser(ChatMessage message, String userId) {
        ChatAvatarRecord senderAvatar = message == null ? null : message.getSenderAvatar();
        return senderAvatar != null && userId.equals(safeText(senderAvatar.getId()));
    }

    private void purgeMessageMedia(ChatMessage message) {
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

    private void scrubSentMessage(ChatMessage message, String userId, String purgeAtIso) {
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

    private boolean removeReadsByUser(ChatMessage message, String userId) {
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

    private boolean removeReactionsByUser(ChatMessage message, String userId) {
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

    private boolean removePollVotesByUser(ChatMessage message, String userId) {
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

    private boolean scrubReplyToPurgedMessage(ChatMessage message, Set<String> purgedMessageIds) {
        ChatMessageReplyRecord replyTo = message.getReplyTo();
        if (replyTo == null || !purgedMessageIds.contains(safeText(replyTo.getId()))) {
            return false;
        }
        replyTo.setSender("Deleted user");
        replyTo.setText("Message unavailable");
        return true;
    }

    private boolean clearPinByUser(ChatMessage message, String userId) {
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
        ChatMessage latest = chatMessagesRepository
                .findByChatIdOrderBySentAtIsoDesc(normalizedChatId, PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .orElse(null);
        List<Chat> changedChats = new ArrayList<>();
        for (Chat chat : chatsRepository.findByChatId(normalizedChatId)) {
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
            chatsRepository.saveAll(changedChats);
        }
    }

    private String messageSummary(ChatMessage message) {
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
