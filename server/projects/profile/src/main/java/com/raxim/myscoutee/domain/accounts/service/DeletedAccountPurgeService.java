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
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;
import com.raxim.myscoutee.domain.accounts.document.Users;
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
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.integrations.api.IntegrationPrivacy integrationPrivacy;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.payments.api.PaymentPrivacy paymentPrivacy;
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
    private final com.raxim.myscoutee.domain.chat.api.ChatPrivacy chatPrivacy;
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
            com.raxim.myscoutee.domain.chat.api.ChatPrivacy chatPrivacy,
            ActivityEventsRepository activityEventsRepository,
            AssetOwnership assetsRepository,
            ActivityMembersRepository activityMembersRepository,
            AccountPurgeJobsRepository accountPurgeJobsRepository,
            MediaStorage mediaStorageService,
            MongoTemplate mongoTemplate,
            PlatformParametersService platformParametersService) {
        this.usersRepository = usersRepository;
        this.chatPrivacy = chatPrivacy;
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
            chatPrivacy.purgeUserChatActivity(userId);

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
        integrationPrivacy.purgeParticipantData(userId);
        deleteDocumentsByAnyField("privacyConsents", List.of("userId"), userId);
        contentPrivacy.purgeFeedback(userId);
        contentPrivacy.purgeReports(userId);
        deleteDocumentsByAnyField("userSessionActions", List.of("userId", "createdUser", "updatedUser"), userId);
        contentPrivacy.purgeFeedViews(userId);
        paymentPrivacy.purgePayerRecords(userId);
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

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
