package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.affinity.api.CampaignGraphs;
import com.raxim.myscoutee.domain.chat.api.EventConversations;
import com.raxim.myscoutee.domain.payments.api.CheckoutBaskets;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;
import com.raxim.myscoutee.domain.platform.service.PlatformParametersService;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.events.algorithm.Algo;
import com.raxim.myscoutee.domain.events.algorithm.dto.Edge;
import com.raxim.myscoutee.domain.events.algorithm.dto.FGraph;
import com.raxim.myscoutee.domain.events.algorithm.dto.Node;
import com.raxim.myscoutee.domain.events.algorithm.dto.Range;
import com.raxim.myscoutee.domain.events.algorithm.gen.EventGeneratorByPriority;
import com.raxim.myscoutee.domain.events.algorithm.gen.EventGeneratorByRandom;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.PriorityGeneratorRequest;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.RandomGroupTarget;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.RandomTargetedGeneratorRequest;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.events.mapper.ActivityEventSubEventsMapper;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMainEventRuntime;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs.Configuration;
import com.raxim.myscoutee.domain.platform.document.SchedulerPlanMarker;
import com.raxim.myscoutee.domain.affinity.api.EdgeView;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.dto.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMainEventRuntimeRepository;
import com.raxim.myscoutee.domain.events.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.domain.platform.repository.SchedulerPlanMarkersRepository;
import com.raxim.myscoutee.domain.affinity.api.EdgeDirectory;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;

@Service
public class EventScheduler implements com.raxim.myscoutee.domain.events.api.RandomGroupAssignment {
    private static final Logger LOGGER = LoggerFactory.getLogger(EventScheduler.class);
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_GROUP = "group";
    private static final String MARKER_ACTION_GROUP_MEMBERS = "group-members";
    private static final String MARKER_ACTION_RANDOM_ROOM_MEMBERS = "random-room-members";
    private static final String MARKER_ACTION_INVITE_BATCH = "invite-batch";
    private static final String MARKER_UPDATED_BY = "scheduler";
    private static final String RANDOM_ROOM_EVENT_TYPE = "random-room";
    private static final String TOURNAMENT_ROOM_EVENT_TYPE = "tournament-room";
    private static final String RANDOM_ROOM_SYSTEM_NAME = "MyScoutee System";
    private static final String PUBLIC_PROFILE_STATUS = "public";
    private static final String RANDOM_ROOM_IMAGE_URL =
            "/media/public?key=images/system/random-room-default.png";
    private static final String TOURNAMENT_ROOM_IMAGE_URL =
            "/media/public?key=images/system/tournament-room/v1/large.webp";
    private static final String RANDOM_ROOM_SOURCE_EVENT_IDS_PARAMETER =
            "jobs.process.randomGroups.sourceEventIds";
    private static final String STAGE_STATUS_ACTIVE = "A";
    private static final String STAGE_STATUS_START_REVIEW = "RS";
    private static final String STAGE_STATUS_SCORE_REVIEW = "SR";
    private static final String STAGE_STATUS_FINALIZED = "F";
    private static final String STAGE_STATUS_SUSPENDED = "S";
    private static final String STAGE_STATUS_ERROR = "E";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";
    private static final String MEMBER_STATUS_DISQUALIFIED = "disqualified";
    private static final String APP_BADGE_URL = "/assets/logo/heart.webp";
    private static final String APP_FALLBACK_ICON_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_CLICK_URL = "/game";

    private final com.raxim.myscoutee.domain.groups.api.GroupDirectory communityGroups;
    private final com.raxim.myscoutee.domain.affinity.api.RatingDirectory userRatesRepository;
    private final CampaignGraphs affinityEdgeService;
    private final UsersRepository usersRepository;
    private final EdgeDirectory userAffinityEdgesRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMainEventRuntimeRepository activityMainEventRuntimeRepository;
    private final SchedulerPlanMarkersRepository schedulerPlanMarkersRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    private final ActivityTournamentGroupCounterService activityTournamentGroupCounterService;
    private final EventInviteNotificationService eventInviteNotificationService;
    private final EventCounterExpiryService eventCounterExpiryService;
    private final CheckoutBaskets eventCheckoutBasketService;
    private final EventConversations chatService;
    private final NotificationJobs notificationRuleRegistryService;
    private final PlatformParametersService platformParametersService;
    private final NotificationDelivery notificationOutboxService;
    private ScheduledMongoSessionRunner scheduledMongoSessionRunner;
    private ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    private final ActivityEventSubEventsMapper subEventsMapper;
    @org.springframework.beans.factory.annotation.Autowired
    private JobGroupScopeService jobGroupScope;

    private final Algo algo = new Algo();
    private final EventGeneratorByRandom eventGeneratorByRandom = new EventGeneratorByRandom();
    private final EventGeneratorByPriority eventGeneratorByPriority = new EventGeneratorByPriority();
    private volatile Instant lastStageSchedulerRunAt = Instant.EPOCH;
    private volatile Instant lastAutoInviterRunAt = Instant.EPOCH;

    @Value("${events.scheduler.enabled:false}")
    private boolean schedulerEnabled;

    @Value("${events.waitlist.inviter-enabled:true}")
    private boolean waitlistInviterEnabled;

    public EventScheduler(
            com.raxim.myscoutee.domain.affinity.api.RatingDirectory userRatesRepository,
            CampaignGraphs affinityEdgeService,
            com.raxim.myscoutee.domain.groups.api.GroupDirectory communityGroups,
            UsersRepository usersRepository,
            EdgeDirectory userAffinityEdgesRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMainEventRuntimeRepository activityMainEventRuntimeRepository,
            SchedulerPlanMarkersRepository schedulerPlanMarkersRepository,
            ActivitiesMembersService activitiesMembersService,
            ActivitiesEventLeaderboardService activitiesEventLeaderboardService,
            ActivityTournamentGroupCounterService activityTournamentGroupCounterService,
            EventInviteNotificationService eventInviteNotificationService,
            EventCounterExpiryService eventCounterExpiryService,
            CheckoutBaskets eventCheckoutBasketService,
            EventConversations chatService,
            NotificationJobs notificationRuleRegistryService,
            PlatformParametersService platformParametersService,
            NotificationDelivery notificationOutboxService,
            ActivityEventSubEventsMapper subEventsMapper) {
        this.userRatesRepository = userRatesRepository;
        this.affinityEdgeService = affinityEdgeService;
        this.communityGroups = communityGroups;
        this.usersRepository = usersRepository;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMainEventRuntimeRepository = activityMainEventRuntimeRepository;
        this.schedulerPlanMarkersRepository = schedulerPlanMarkersRepository;
        this.activitiesMembersService = activitiesMembersService;
        this.activitiesEventLeaderboardService = activitiesEventLeaderboardService;
        this.activityTournamentGroupCounterService = activityTournamentGroupCounterService;
        this.eventInviteNotificationService = eventInviteNotificationService;
        this.eventCounterExpiryService = eventCounterExpiryService;
        this.eventCheckoutBasketService = eventCheckoutBasketService;
        this.chatService = chatService;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
        this.platformParametersService = platformParametersService;
        this.notificationOutboxService = notificationOutboxService;
        this.subEventsMapper = subEventsMapper;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setScheduledMongoSessionRunner(ScheduledMongoSessionRunner scheduledMongoSessionRunner) {
        this.scheduledMongoSessionRunner = scheduledMongoSessionRunner;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setActivitySubEventStageRuntimeRepository(
            ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository) {
        this.activitySubEventStageRuntimeRepository = activitySubEventStageRuntimeRepository;
    }

    @Scheduled(fixedDelayString = "${events.scheduler.check-delay-ms:60000}")
    public void runScheduledWrappers() {
        if (scheduledMongoSessionRunner == null) {
            runScheduledWrappersForCurrentDatabase();
            return;
        }
        scheduledMongoSessionRunner.runAcrossConfiguredDatabases(this::runScheduledWrappersForCurrentDatabase);
    }

    private void runScheduledWrappersForCurrentDatabase() {
        var registry = notificationRuleRegistryService;
        if (registry != null) registry.forEachGroup(Set.of(NotificationJobs.RULE_EVENT_TOURNAMENT_REVIEW, NotificationJobs.RULE_EVENT_RANDOM_GROUPS, NotificationJobs.RULE_EVENT_COUNTER_EXPIRY, NotificationJobs.RULE_EVENT_CHECKOUT_BASKET_PURGE), this::runScheduledWrappersForCurrentDatabaseInGroup);
    }

    private void runScheduledWrappersForCurrentDatabaseInGroup() {
        if (!schedulerEnabled && !notificationRuleRegistryService.hasEnabledScheduledEventRule()) {
            return;
        }

        Instant now = Instant.now();
        boolean tournamentRuleConfigured = notificationRuleRegistryService
                .findRule(NotificationJobs.RULE_EVENT_TOURNAMENT_REVIEW)
                .isPresent();
        boolean tournamentReviewDue = tournamentRuleConfigured
                && notificationRuleRegistryService.shouldRunScheduledRule(
                        NotificationJobs.RULE_EVENT_TOURNAMENT_REVIEW,
                        now);
        if (tournamentReviewDue) {
            runTournamentReview(now, tournamentRuleConfigured);
        }
        if (notificationRuleRegistryService.shouldRunScheduledRule(NotificationJobs.RULE_EVENT_RANDOM_GROUPS, now)) {
            runScheduledRandomGroups();
        }
        if (notificationRuleRegistryService.shouldRunScheduledRule(NotificationJobs.RULE_EVENT_COUNTER_EXPIRY, now)) {
            int expiredCount = eventCounterExpiryService.runScheduledExpiryPass(now);
            if (expiredCount > 0) {
                LOGGER.info("Processed {} due event counter source(s).", expiredCount);
            }
        }
        if (notificationRuleRegistryService.shouldRunScheduledRule(NotificationJobs.RULE_EVENT_CHECKOUT_BASKET_PURGE, now)) {
            int purgedCount = eventCheckoutBasketService.purgeExpiredDraftBasketsScheduled(now);
            if (purgedCount > 0) {
                LOGGER.info("Purged {} checkout basket item(s).", purgedCount);
            }
        }
    }

    @Scheduled(fixedDelayString = "${events.waitlist.inviter-check-delay-ms:60000}")
    public void runWaitlistInviter() {
        if (scheduledMongoSessionRunner == null) {
            runWaitlistInviterForCurrentDatabase();
            return;
        }
        scheduledMongoSessionRunner.runAcrossConfiguredDatabases(this::runWaitlistInviterForCurrentDatabase);
    }

    private void runWaitlistInviterForCurrentDatabase() {
        var registry = notificationRuleRegistryService;
        if (registry != null) registry.forEachGroup(NotificationJobs.RULE_EVENT_AUTO_INVITER, this::runWaitlistInviterForCurrentDatabaseInGroup);
    }

    private void runWaitlistInviterForCurrentDatabaseInGroup() {
        if (!waitlistInviterEnabled) {
            return;
        }
        Instant now = Instant.now();
        boolean ruleConfigured = notificationRuleRegistryService
                .findRule(NotificationJobs.RULE_EVENT_AUTO_INVITER)
                .isPresent();
        boolean due = ruleConfigured
                && notificationRuleRegistryService.shouldRunScheduledRule(
                        NotificationJobs.RULE_EVENT_AUTO_INVITER,
                        now);
        if (!due) {
            return;
        }
        if (ruleConfigured && notificationRuleRegistryService.beginScheduledRun(
                NotificationJobs.RULE_EVENT_AUTO_INVITER,
                "Scheduled event auto-inviter started.",
                MARKER_UPDATED_BY,
                now) == null) {
            return;
        }
        int claimedPendingCount = ruleConfigured
                ? notificationRuleRegistryService.claimPendingCount(
                        NotificationJobs.RULE_EVENT_AUTO_INVITER)
                : 0;
        try {
            int waitlistChangedCount = activitiesMembersService.sweepEventWaitlists();
            if (waitlistChangedCount > 0) {
                LOGGER.info("Adjusted {} event wait-list invitation(s).", waitlistChangedCount);
            }
            List<InviteBatchPlan> autoInvitePlans = generatePriorityPlans();
            int autoInvitedCount = autoInvitePlans.stream()
                    .mapToInt(plan -> plan == null || plan.invitedUserIds() == null ? 0 : plan.invitedUserIds().size())
                    .sum();
            if (autoInvitedCount > 0) {
                LOGGER.info("Auto-invited {} event candidate(s) across {} event(s).", autoInvitedCount, autoInvitePlans.size());
            }
            if (ruleConfigured) {
                notificationRuleRegistryService.recordRun(
                        NotificationJobs.RULE_EVENT_AUTO_INVITER,
                        waitlistChangedCount + autoInvitedCount,
                        "completed",
                        "Processed scheduled wait-list and automatic invitations.",
                        MARKER_UPDATED_BY,
                        now);
            }
        } catch (RuntimeException exception) {
            if (ruleConfigured) {
                notificationRuleRegistryService.restoreClaimedPendingCount(
                        NotificationJobs.RULE_EVENT_AUTO_INVITER,
                        claimedPendingCount,
                        "admin.jobs.table.affected");
                notificationRuleRegistryService.recordRun(
                        NotificationJobs.RULE_EVENT_AUTO_INVITER,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        MARKER_UPDATED_BY,
                        now);
            }
            LOGGER.warn("Scheduled event auto-inviter failed.", exception);
        }
    }

    private void runScheduledRandomGroups() {
        Instant startedAt = Instant.now();
        if (notificationRuleRegistryService.beginScheduledRun(
                NotificationJobs.RULE_EVENT_RANDOM_GROUPS,
                "Scheduled random grouping started.",
                MARKER_UPDATED_BY,
                startedAt) == null) {
            return;
        }
        int claimedPendingCount = notificationRuleRegistryService.claimPendingCount(
                NotificationJobs.RULE_EVENT_RANDOM_GROUPS);
        try {
            List<GeneratedEventPlan> plans = generateRandomPlans();
            notificationRuleRegistryService.recordRun(
                    NotificationJobs.RULE_EVENT_RANDOM_GROUPS,
                    affectedUsers(plans),
                    "completed",
                    "Generated random event group plans.",
                    MARKER_UPDATED_BY,
                    startedAt);
        } catch (RuntimeException exception) {
            notificationRuleRegistryService.restoreClaimedPendingCount(
                    NotificationJobs.RULE_EVENT_RANDOM_GROUPS,
                    claimedPendingCount,
                    NotificationJobs.PENDING_COUNT_UNIT_USERS);
            notificationRuleRegistryService.recordRun(
                    NotificationJobs.RULE_EVENT_RANDOM_GROUPS,
                    0,
                    "failed",
                    safeText(exception.getMessage()),
                    MARKER_UPDATED_BY,
                    startedAt);
            LOGGER.warn("Scheduled random grouping failed.", exception);
        }
    }

    private static int affectedUsers(List<GeneratedEventPlan> plans) {
        Set<String> userIds = new LinkedHashSet<>();
        for (GeneratedEventPlan plan : plans == null ? List.<GeneratedEventPlan>of() : plans) {
            if (plan == null || plan.memberUserIds() == null) {
                continue;
            }
            plan.memberUserIds().stream()
                    .filter(StringUtils::hasText)
                    .map(String::trim)
                    .forEach(userIds::add);
        }
        return userIds.size();
    }

    private void runTournamentReview(Instant now, boolean ruleConfigured) {
        Instant startedAt = now == null ? Instant.now() : now;
        if (ruleConfigured && notificationRuleRegistryService.beginScheduledRun(
                NotificationJobs.RULE_EVENT_TOURNAMENT_REVIEW,
                "Scheduled tournament review started.",
                MARKER_UPDATED_BY,
                startedAt) == null) {
            return;
        }
        int claimedPendingCount = ruleConfigured
                ? notificationRuleRegistryService.claimPendingCount(
                        NotificationJobs.RULE_EVENT_TOURNAMENT_REVIEW)
                : 0;
        try {
            int startReviewCount = moveTournamentFirstStagesToStartReview(startedAt);
            if (startReviewCount > 0) {
                LOGGER.info("Moved {} tournament first stage(s) to start review.", startReviewCount);
            }
            int reviewCount = closeEndedTournamentStagesForReview(startedAt);
            if (reviewCount > 0) {
                LOGGER.info("Moved {} tournament stage(s) to score review.", reviewCount);
            }
            ScorePlanRunResult scorePlanRun = generateScorePlanRunForEvents(null, true);
            if (scorePlanRun.changedGroupCount() > 0) {
                LOGGER.info(
                        "Synchronized advancing members in {} tournament group(s).",
                        scorePlanRun.changedGroupCount());
            }
            if (scorePlanRun.processedResultRevisionCount() > 0) {
                LOGGER.info(
                        "Published participant outcomes for {} tournament result revision(s).",
                        scorePlanRun.processedResultRevisionCount());
            }
            if (ruleConfigured) {
                notificationRuleRegistryService.recordRun(
                        NotificationJobs.RULE_EVENT_TOURNAMENT_REVIEW,
                        startReviewCount + reviewCount + scorePlanRun.changedGroupCount()
                                + scorePlanRun.processedResultRevisionCount(),
                        "completed",
                        "Reviewed scheduled tournament stages and synchronized advancing members.",
                        MARKER_UPDATED_BY,
                        startedAt);
            }
        } catch (RuntimeException exception) {
            if (ruleConfigured) {
                notificationRuleRegistryService.restoreClaimedPendingCount(
                        NotificationJobs.RULE_EVENT_TOURNAMENT_REVIEW,
                        claimedPendingCount,
                        "admin.jobs.table.affected");
                notificationRuleRegistryService.recordRun(
                        NotificationJobs.RULE_EVENT_TOURNAMENT_REVIEW,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        MARKER_UPDATED_BY,
                        startedAt);
            }
            LOGGER.warn("Scheduled tournament review failed.", exception);
        }
    }

    private synchronized boolean claimStageSchedulerRun(Instant now) {
        Instant effectiveNow = now == null ? Instant.now() : now;
        long delayMs = platformParametersService == null
                ? 1_800_000L
                : platformParametersService.eventSchedulerPollDelayMs(1_800_000L);
        if (lastStageSchedulerRunAt != Instant.EPOCH
                && effectiveNow.toEpochMilli() - lastStageSchedulerRunAt.toEpochMilli() < delayMs) {
            return false;
        }
        lastStageSchedulerRunAt = effectiveNow;
        return true;
    }

    private synchronized boolean claimAutoInviterRun(Instant now) {
        Instant effectiveNow = now == null ? Instant.now() : now;
        long delayMs = platformParametersService == null
                ? 7_200_000L
                : platformParametersService.autoInviterCadenceMs(7_200_000L);
        if (lastAutoInviterRunAt != Instant.EPOCH
                && effectiveNow.toEpochMilli() - lastAutoInviterRunAt.toEpochMilli() < delayMs) {
            return false;
        }
        lastAutoInviterRunAt = effectiveNow;
        return true;
    }

    public int closeEndedTournamentStagesForReview() {
        return closeEndedTournamentStagesForReview(Instant.now());
    }

    int closeEndedTournamentStagesForReview(Instant now) {
        Instant effectiveNow = now == null ? Instant.now() : now;
        String nowIso = effectiveNow.toString();
        List<ActivityEvent> changedRecords = new ArrayList<>();
        Set<String> changedStageKeys = new LinkedHashSet<>();

        List<ActivityEvent> events = scopedEvents(activityEventsRepository.findAll());
        Map<String, Map<String, ActivitySubEventStageRuntime>> runtimes = stageRuntimesByOwner(events);
        Set<ActivitySubEventStageRuntime> changedRuntimes = new LinkedHashSet<>();
        for (ActivityEvent event : events) {
            if (!shouldReviewTournamentStages(event)) {
                continue;
            }
            List<SubEventItem> currentSubEvents = safeSubEvents(event);
            if (currentSubEvents.isEmpty()) {
                continue;
            }
            List<SubEventItem> updatedSubEvents = new ArrayList<>(currentSubEvents.size());
            boolean changed = false;
            Map<String, ActivitySubEventStageRuntime> eventRuntimes =
                    runtimes.getOrDefault(normalizeId(event.getSourceId()), Map.of());
            for (SubEventItem original : currentSubEvents) {
                ActivitySubEventStageRuntime runtime = eventRuntimes.get(normalizeId(original == null ? null : original.id()));
                SubEventItem subEvent = withStageRuntime(original, runtime);
                SubEventItem updated;
                try {
                    updated = closeStageForReviewIfDue(subEvent, effectiveNow, nowIso);
                } catch (RuntimeException exception) {
                    LOGGER.error(
                            "Failed to close tournament stage for event {} stage {}.",
                            normalizeId(event.getSourceId()),
                            normalizeId(subEvent == null ? null : subEvent.id()),
                            exception);
                    updated = copySubEventWithStageError(subEvent, "scheduler-close-stage-error", nowIso, exception);
                }
                updatedSubEvents.add(updated);
                if (updated != subEvent) {
                    changed = true;
                    if (runtime != null) {
                        runtime.setStageStatus(updated.stageStatus());
                        runtime.setStageStatusReason(updated.stageStatusReason());
                        runtime.setStageStatusUpdatedAt(updated.stageStatusUpdatedAt());
                        runtime.setUpdatedDate(nowIso);
                        runtime.setUpdatedUser(MARKER_UPDATED_BY);
                        changedRuntimes.add(runtime);
                    }
                    changedStageKeys.add(normalizeId(event.getSourceId()) + ":" + normalizeId(subEvent == null ? null : subEvent.id()));
                }
            }
            if (changed && event.getSubEvents() != null && !event.getSubEvents().isEmpty()) {
                event.setSubEvents(updatedSubEvents);
                event.refreshTournamentCurrentStage();
                event.setUpdatedDate(nowIso);
                event.setUpdatedUser(MARKER_UPDATED_BY);
                changedRecords.add(event);
            }
        }

        if (!changedRuntimes.isEmpty()) {
            activitySubEventStageRuntimeRepository.saveAll(changedRuntimes);
        }
        if (!changedRecords.isEmpty()) {
            activityEventsRepository.saveAll(changedRecords);
        }
        return changedStageKeys.size();
    }

    int moveTournamentFirstStagesToStartReview(Instant now) {
        Instant effectiveNow = now == null ? Instant.now() : now;
        String nowIso = effectiveNow.toString();
        List<ActivityEvent> changedRecords = new ArrayList<>();
        Set<String> changedStageKeys = new LinkedHashSet<>();

        for (ActivityEvent event : scopedEvents(activityEventsRepository.findAll())) {
            if (event == null || !shouldReviewTournamentStages(event)) {
                continue;
            }
            List<SubEventItem> subEvents = safeSubEvents(event);
            if (subEvents.isEmpty()) {
                continue;
            }
            List<SubEventItem> updatedSubEvents = new ArrayList<>(subEvents);
            boolean changed = false;
            for (int index = 0; index < subEvents.size(); index += 1) {
                SubEventItem stage = subEvents.get(index);
                try {
                    if (!isStageStartAllowed(subEvents, index) || !shouldMoveStageToStartReview(stage, effectiveNow)) {
                        continue;
                    }
                    updatedSubEvents.set(index, copySubEventWithStageStatus(
                            stage,
                            STAGE_STATUS_START_REVIEW,
                            "awaiting-tournament-start",
                            nowIso,
                            null,
                            null));
                } catch (RuntimeException exception) {
                    LOGGER.error(
                            "Failed to move tournament stage to start review for event {} stage {}.",
                            normalizeId(event.getSourceId()),
                            normalizeId(stage == null ? null : stage.id()),
                            exception);
                    updatedSubEvents.set(index, copySubEventWithStageError(stage, "scheduler-start-stage-error", nowIso, exception));
                }
                changed = true;
                changedStageKeys.add(normalizeId(event.getSourceId()) + ":" + normalizeId(stage == null ? null : stage.id()));
            }
            if (changed) {
                event.setSubEvents(updatedSubEvents);
                event.refreshTournamentCurrentStage();
                event.setUpdatedDate(nowIso);
                event.setUpdatedUser(MARKER_UPDATED_BY);
                changedRecords.add(event);
            }
        }

        if (!changedRecords.isEmpty()) {
            activityEventsRepository.saveAll(changedRecords);
        }
        return changedStageKeys.size();
    }

    private boolean shouldMoveStageToStartReview(SubEventItem stage, Instant now) {
        if (stage == null || !isTournamentStage(stage)) {
            return false;
        }
        if (!STAGE_STATUS_ACTIVE.equals(normalizeStageStatus(stage.stageStatus()))) {
            return false;
        }
        if (StringUtils.hasText(safeText(stage.stageStatusUpdatedAt()))
                || StringUtils.hasText(safeText(stage.stageFinalizedAt()))) {
            return false;
        }
        Instant startAt = parseStageInstant(stage.startAt());
        return startAt != null && startAt.isAfter(now);
    }

    private boolean shouldReviewTournamentStages(ActivityEvent event) {
        if (event == null || !Boolean.TRUE.equals(event.getPublished())) {
            return false;
        }
        String status = normalizeId(event.getStatus()).toUpperCase(Locale.ROOT);
        if ("T".equals(status) || "B".equals(status) || "D".equals(status) || "I".equals(status)) {
            return false;
        }
        if ("TOURNAMENT".equalsIgnoreCase(safeText(event.getMode()))) {
            return true;
        }
        return safeSubEvents(event).stream().anyMatch(this::isTournamentStage);
    }

    private boolean isTournamentStage(SubEventItem subEvent) {
        return subEvent != null
                && (autoTournamentGroupCount(subEvent) > 0
                        || "Score".equalsIgnoreCase(safeText(subEvent.tournamentLeaderboardType()))
                        || "Fifa".equalsIgnoreCase(safeText(subEvent.tournamentLeaderboardType())));
    }

    private int autoTournamentGroupCount(SubEventItem subEvent) {
        if (subEvent == null) {
            return 0;
        }
        int groupMin = safeCount(subEvent.tournamentGroupCapacityMin());
        int groupMax = Math.max(groupMin, safeCount(subEvent.tournamentGroupCapacityMax()));
        if (groupMin > 0 || groupMax > 0) {
            int divisor = Math.max(1, groupMax > 0 ? groupMax : groupMin);
            int stageMax = safeCount(subEvent.capacityMax());
            int groupsNeededForMaximum = stageMax > 0
                    ? (int) Math.ceil((double) stageMax / divisor)
                    : 0;
            int groupsAllowedByMinimum = groupMin > 0
                    ? Math.max(1, stageMax / groupMin)
                    : groupsNeededForMaximum;
            return Math.min(groupsNeededForMaximum, groupsAllowedByMinimum);
        }
        return 0;
    }

    private SubEventItem closeStageForReviewIfDue(
            SubEventItem subEvent,
            Instant now,
            String nowIso) {
        if (subEvent == null || !isTournamentStage(subEvent)) {
            return subEvent;
        }
        if (!STAGE_STATUS_ACTIVE.equals(normalizeStageStatus(subEvent.stageStatus()))) {
            return subEvent;
        }
        Instant endAt = parseStageInstant(subEvent.endAt());
        if (endAt == null || endAt.isAfter(now)) {
            return subEvent;
        }
        return copySubEventWithStageStatus(
                subEvent,
                STAGE_STATUS_SCORE_REVIEW,
                "stage-ended",
                nowIso,
                null,
                null);
    }

    private SubEventItem copySubEventWithStageStatus(
            SubEventItem subEvent,
            String stageStatus,
            String stageStatusReason,
            String stageStatusUpdatedAt,
            String stageFinalizedAt,
            String stageFinalizedByUserId) {
        return copySubEventWithStageStatus(
                subEvent,
                stageStatus,
                stageStatusReason,
                stageStatusUpdatedAt,
                stageFinalizedAt,
                stageFinalizedByUserId,
                subEvent.stageResultRevision());
    }

    private SubEventItem copySubEventWithStageStatus(
            SubEventItem subEvent,
            String stageStatus,
            String stageStatusReason,
            String stageStatusUpdatedAt,
            String stageFinalizedAt,
            String stageFinalizedByUserId,
            Integer stageResultRevision) {
        return new SubEventItem(
                subEvent.id(),
                subEvent.name(),
                subEvent.description(),
                subEvent.startAt(),
                subEvent.endAt(),
                subEvent.location(),
                subEvent.createdByUserId(),
                subEvent.tournamentGroupCapacityMin(),
                subEvent.tournamentGroupCapacityMax(),
                subEvent.tournamentLeaderboardType(),
                subEvent.tournamentAdvancePerGroup(),
                subEvent.optional(),
                subEvent.pricing(),
                subEvent.capacityMin(),
                subEvent.capacityMax(),
                subEvent.membersAccepted(),
                subEvent.membersPending(),
                subEvent.groupsPending(),
                subEvent.carsPending(),
                subEvent.accommodationPending(),
                subEvent.suppliesPending(),
                subEvent.carsAccepted(),
                subEvent.accommodationAccepted(),
                subEvent.suppliesAccepted(),
                subEvent.carsCapacityMin(),
                subEvent.carsCapacityMax(),
                subEvent.accommodationCapacityMin(),
                subEvent.accommodationCapacityMax(),
                subEvent.suppliesCapacityMin(),
                subEvent.suppliesCapacityMax(),
                subEvent.slotStartOffsetMinutes(),
                subEvent.slotDurationMinutes(),
                stageStatus,
                stageStatusReason,
                stageStatusUpdatedAt,
                stageFinalizedAt,
                stageFinalizedByUserId,
                stageResultRevision,
                subEvent.groups());
    }

    private SubEventItem copySubEventWithStageError(
            SubEventItem subEvent,
            String reason,
            String nowIso,
            RuntimeException exception) {
        if (subEvent == null) {
            return null;
        }
        return copySubEventWithStageStatus(
                subEvent,
                STAGE_STATUS_ERROR,
                schedulerStageErrorReason(reason, exception),
                firstNonBlank(nowIso, Instant.now().toString()),
                null,
                null);
    }

    private String schedulerStageErrorReason(String reason, RuntimeException exception) {
        String normalizedReason = firstNonBlank(reason, "scheduler-stage-error");
        if (exception == null) {
            return normalizedReason;
        }
        String detail = firstNonBlank(exception.getMessage(), exception.getClass().getSimpleName());
        String value = normalizedReason + ":" + safeText(detail);
        return value.length() <= 180 ? value : value.substring(0, 180);
    }

    private List<ActivityEvent> scopedEvents(List<ActivityEvent> events) {
        return events.stream().filter(Objects::nonNull)
                .filter(event -> !JobGroupContext.isActive() || jobGroupScope.matchesWorkspace(event.getWorkspaceGroupId())).toList();
    }

    @Override
    public Result assignRandomGroups(Consumer<Progress> progress) {
        List<GeneratedEventPlan> plans = generateRandomPlans(progress == null ? null
                : update -> progress.accept(new Progress(update.progressPercent(), update.detail())));
        return new Result(plans.size(), affectedUsers(plans));
    }

    public List<GeneratedEventPlan> generateRandomPlans() {
        return generateRandomPlans(null, configuredRandomRoomSourceEventIds());
    }

    public List<GeneratedEventPlan> generateRandomPlans(Consumer<RandomPlanProgress> progressConsumer) {
        return generateRandomPlans(progressConsumer, configuredRandomRoomSourceEventIds());
    }

    public List<GeneratedEventPlan> generateRandomPlansForEvents(Collection<String> sourceIds) {
        return generateRandomPlans(null, sourceIds, false, false);
    }

    public List<GeneratedEventPlan> generateTournamentStagePlansForEvents(Collection<String> sourceIds) {
        return generateRandomPlans(null, sourceIds, true, true);
    }

    public List<GeneratedEventPlan> generateTournamentStagePlansForEvents(
            Collection<String> sourceIds,
            Runnable beforeRoomNotifications) {
        Runnable notificationBarrier = runOnce(beforeRoomNotifications);
        List<GeneratedEventPlan> plans = generateRandomPlans(
                null,
                sourceIds,
                true,
                true,
                notificationBarrier);
        if (notificationBarrier != null) {
            notificationBarrier.run();
        }
        return plans;
    }

    private List<String> configuredRandomRoomSourceEventIds() {
        Configuration rule = notificationRuleRegistryService
                .findRule(NotificationJobs.RULE_EVENT_RANDOM_GROUPS)
                .orElse(null);
        if (rule == null || rule.getParameters() == null) {
            return List.of();
        }
        return rule.getParameters().stream()
                .filter(Objects::nonNull)
                .filter(parameter -> RANDOM_ROOM_SOURCE_EVENT_IDS_PARAMETER.equals(
                        safeText(parameter.getKey())))
                .map(NotificationJobs.Parameter::getTextValue)
                .filter(StringUtils::hasText)
                .flatMap(value -> List.of(value.split("[,;\\s]+")).stream())
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private List<GeneratedEventPlan> generateRandomPlans(
            Consumer<RandomPlanProgress> progressConsumer,
            Collection<String> sourceIds) {
        return generateRandomPlans(progressConsumer, sourceIds, false, false);
    }

    private List<GeneratedEventPlan> generateRandomPlans(
            Consumer<RandomPlanProgress> progressConsumer,
            Collection<String> sourceIds,
            boolean includeAllAcceptedMembers,
            boolean requireExactTargetCoverage) {
        return generateRandomPlans(
                progressConsumer,
                sourceIds,
                includeAllAcceptedMembers,
                requireExactTargetCoverage,
                null);
    }

    private List<GeneratedEventPlan> generateRandomPlans(
            Consumer<RandomPlanProgress> progressConsumer,
            Collection<String> sourceIds,
            boolean includeAllAcceptedMembers,
            boolean requireExactTargetCoverage,
            Runnable beforeRoomNotifications) {
        Set<String> sourceIdFilter = new LinkedHashSet<>(normalizeUserIds(sourceIds));
        List<ActivityEvent> eventRecords = sourceIdFilter.isEmpty()
                ? activityEventsRepository.findAll()
                : activityEventsRepository.findBySourceIdIn(sourceIdFilter);
        List<ActivityEvent> events = applyStageRuntimeOverlays(resolveCanonicalEvents(scopedEvents(eventRecords)));
        Set<String> groupIds = events.stream().map(ActivityEvent::getWorkspaceGroupId).filter(StringUtils::hasText)
            .collect(Collectors.toSet());
        Set<String> campaignOrServiceGroupIds = groupIds.isEmpty() ? Set.of() : communityGroups.findByIdIn(groupIds).stream()
            .filter(group -> !"dating".equals(group.effectiveType())).map(com.raxim.myscoutee.domain.groups.api.GroupView::id)
            .collect(Collectors.toSet());
        if (!includeAllAcceptedMembers) events = events.stream().filter(event -> !campaignOrServiceGroupIds.contains(normalizeId(event.getWorkspaceGroupId()))).toList();
        Map<String, List<ActivityEvent>> eventDocumentsById = eventDocumentsBySourceId(eventRecords);
        AtomicInteger observedQueries = new AtomicInteger(1);
        publishRandomProgress(progressConsumer, 0, 0, events.size(), 0, observedQueries.get(), "Loaded " + events.size() + " event record(s).");

        // --- PHASE 1: PRE-FETCH (Sequential) ---
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByEventId = new LinkedHashMap<>();
        Map<String, Set<String>> existingTournamentUserIdsByEventId = new LinkedHashMap<>();
        Set<String> requiredUserIds = new LinkedHashSet<>();
        Map<String, ActivityEvent> candidateEventsById = new LinkedHashMap<>();
        for (ActivityEvent event : events) {
            if (event == null || !Boolean.TRUE.equals(event.getPublished()) || safeSubEvents(event).isEmpty()) {
                continue;
            }
            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            if (!sourceIdFilter.isEmpty() && !sourceIdFilter.contains(eventId)) {
                continue;
            }
            candidateEventsById.put(eventId, event);
        }
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> batchSnapshotsByEventId =
                activitiesMembersService.buildBatchEventSnapshots(candidateEventsById);
        if (batchSnapshotsByEventId == null) {
            batchSnapshotsByEventId = Map.of();
        }
        if (!candidateEventsById.isEmpty()) {
            observedQueries.addAndGet(2);
        }

        for (ActivityEvent event : events) {
            String eventId = normalizeId(event == null ? null : event.getSourceId());
            if (!candidateEventsById.containsKey(eventId)) {
                continue;
            }
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = batchSnapshotsByEventId.get(eventId);
            Set<String> existingTournamentUserIds = existingTournamentUserIds(eventId, event);
            int queryCount = observedQueries.get();
            if (snapshot == null || (snapshot.acceptedMembers() < 2 && existingTournamentUserIds.isEmpty())) {
                publishRandomProgress(progressConsumer, 6, snapshotsByEventId.size(), events.size(), requiredUserIds.size(), queryCount,
                        "Queried " + queryCount + " backend lookup(s); event has no eligible accepted members.");
                continue;
            }
            snapshotsByEventId.put(eventId, snapshot);
            existingTournamentUserIdsByEventId.put(eventId, existingTournamentUserIds);
            requiredUserIds.addAll(snapshot.acceptedMemberUserIds());
            requiredUserIds.addAll(existingTournamentUserIds);
            publishRandomProgress(progressConsumer, 10, snapshotsByEventId.size(), events.size(), requiredUserIds.size(), queryCount,
                    "Queried " + queryCount + " backend lookup(s); found " + requiredUserIds.size() + " candidate user(s).");
        }
        Set<String> eligibleUserIds;
        if (includeAllAcceptedMembers) {
            eligibleUserIds = new LinkedHashSet<>(requiredUserIds);
        } else {
            eligibleUserIds = new LinkedHashSet<>(resolvePublicUserIds(requiredUserIds));
            incrementObservedQueries(observedQueries);
            // Each tournament stage is its own participation scope. Existing
            // stage members therefore stay eligible for that stage even when
            // the root Event's participation flag changes later.
            existingTournamentUserIdsByEventId.values().forEach(eligibleUserIds::addAll);
            requiredUserIds.retainAll(eligibleUserIds);
        }
        publishRandomProgress(progressConsumer, 20, 0, snapshotsByEventId.size(), requiredUserIds.size(), observedQueries.get(), "Loaded eligible random events.");
        int totalSubEvents = Math.max(1, events.stream()
                .filter(event -> event != null && Boolean.TRUE.equals(event.getPublished()))
                .mapToInt(event -> {
            String eventId = normalizeId(event.getSourceId());
            return snapshotsByEventId.containsKey(eventId) ? safeSubEvents(event).size() : 0;
                })
                .sum());
        AtomicInteger processedSubEvents = new AtomicInteger(0);

        Set<String> priorityOffGroups=priorityOffGroups(events);
        FGraph graph=events.stream().allMatch(e->priorityOffGroups.contains(normalizeId(e.getWorkspaceGroupId())))
            ? participantGraph(requiredUserIds):buildGraphSnapshot(requiredUserIds, observedQueries);
        Map<String, FGraph> campaignGraphs = buildCampaignGraphs(events);
        if (graph.getNodes().isEmpty()) {
            publishRandomProgress(progressConsumer, 100, 0, snapshotsByEventId.size(), requiredUserIds.size(), observedQueries.get(),
                    "No candidate user graph was available after " + observedQueries.get() + " backend lookup(s).");
            return List.of();
        }
        publishRandomProgress(progressConsumer, 30, 0, snapshotsByEventId.size(), requiredUserIds.size(), observedQueries.get(),
                "Built candidate user graph after " + observedQueries.get() + " backend lookup(s).");

        // THREAD SAFETY: Synchronized list for parallel addition
        List<GeneratedEventPlan> plans = Collections.synchronizedList(new ArrayList<>());
        int totalEvents = Math.max(1, snapshotsByEventId.size());
        AtomicInteger processedEvents = new AtomicInteger(0);
        publishRandomProgress(progressConsumer, 34, 0, snapshotsByEventId.size(), requiredUserIds.size(),
                observedQueries.get(), "Starting random assignment for " + totalSubEvents + " sub-event(s).");

        // --- PHASE 2: PARALLEL EXECUTION ---
        MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
        events.parallelStream().forEach(event -> withMongoSessionMode(sessionMode, () -> {
            if (event == null || !Boolean.TRUE.equals(event.getPublished())) return; // Use return instead of continue in lambda

            String eventId = normalizeId(event.getSourceId());
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByEventId.get(eventId);
            if (snapshot == null) return;

            Set<String> acceptedUserIds = new LinkedHashSet<>(snapshot.acceptedMemberUserIds());
            acceptedUserIds.retainAll(eligibleUserIds);
            Set<String> existingTournamentUserIds = new LinkedHashSet<>(
                    existingTournamentUserIdsByEventId.getOrDefault(eventId, Set.of()));
            existingTournamentUserIds.retainAll(eligibleUserIds);
            Set<String> tournamentUserIds = new LinkedHashSet<>(acceptedUserIds);
            tournamentUserIds.addAll(existingTournamentUserIds);
            if (acceptedUserIds.size() < 2 && existingTournamentUserIds.isEmpty()) {
                return;
            }
            FGraph eventGraph = eventGraph(event, graph, campaignGraphs, tournamentUserIds, priorityOffGroups);

            if (eventGraph.getNodes().isEmpty()) return;

            // Standard for-loop inside the lambda, so we use 'continue' here
            List<SubEventItem> subEvents = safeSubEvents(event);
            for (int subEventIndex = 0; subEventIndex < subEvents.size(); subEventIndex += 1) {
                SubEventItem subEvent = subEvents.get(subEventIndex);
                String subEventId = normalizeId(subEvent == null ? null : subEvent.id());
                if (!StringUtils.hasText(subEventId)) continue;
                int currentSubEvent = processedSubEvents.get() + 1;
                publishRandomProgress(
                        progressConsumer,
                        progressPercent(34, 88, Math.max(0, currentSubEvent - 1), totalSubEvents),
                        processedEvents.get(),
                        snapshotsByEventId.size(),
                        requiredUserIds.size(),
                        observedQueries.get(),
                        "Processing sub-event " + currentSubEvent + "/" + totalSubEvents + ".");

                if (!isStageAssignmentOpen(subEvents, subEventIndex)) {
                    processedSubEvents.incrementAndGet();
                    continue;
                }

                Set<String> stageEligibleUserIds = resolveStageAssignmentUserIds(
                        eventId,
                        subEvents,
                        subEventIndex,
                        acceptedUserIds);
                if (stageEligibleUserIds.isEmpty()) {
                    logDiagnostic(
                            "random",
                            eventId,
                            subEventId,
                            subEventIndex == 0
                                    ? "No accepted users are eligible for the first stage."
                                    : "The finalized previous stage has no advancing users.");
                    processedSubEvents.incrementAndGet();
                    continue;
                }
                FGraph stageGraph = eventGraph.filter(stageEligibleUserIds, Set.of(), 0d);
                if (stageGraph.getNodes().isEmpty()) {
                    processedSubEvents.incrementAndGet();
                    continue;
                }

                List<GroupAssignmentTarget> targets = resolveGroupAssignmentTargets(
                        eventId, subEventId, subEvent, stageEligibleUserIds, true, "random", observedQueries, eventDocumentsById);

                if (targets.isEmpty()) {
                    int processedSubEvent = processedSubEvents.incrementAndGet();
                    publishRandomProgress(
                            progressConsumer,
                            progressPercent(34, 88, processedSubEvent, totalSubEvents),
                            processedEvents.get(),
                            snapshotsByEventId.size(),
                            requiredUserIds.size(),
                            observedQueries.get(),
                            "Skipped sub-event " + processedSubEvent + "/" + totalSubEvents + "; no target groups.");
                    continue;
                }

                List<GeneratedEventPlan> assignedMembers = assignMembersToTargets(
                        event,
                        stageGraph,
                        stageEligibleUserIds,
                        targets,
                        "random",
                        "random:" + eventId + ":" + subEventId,
                        observedQueries,
                        requireExactTargetCoverage,
                        includeAllAcceptedMembers && requireExactTargetCoverage,
                        beforeRoomNotifications);

                // Thread-safe addition
                plans.addAll(assignedMembers);
                int processedSubEvent = processedSubEvents.incrementAndGet();
                publishRandomProgress(
                        progressConsumer,
                        progressPercent(34, 88, processedSubEvent, totalSubEvents),
                        processedEvents.get(),
                        snapshotsByEventId.size(),
                        requiredUserIds.size(),
                        observedQueries.get(),
                        "Processed sub-event " + processedSubEvent + "/" + totalSubEvents + ", "
                                + requiredUserIds.size() + " candidate user(s), "
                                + observedQueries.get() + " backend lookup(s).");
            }
            int processed = processedEvents.incrementAndGet();
            int percent = Math.max(progressPercent(34, 88, processedSubEvents.get(), totalSubEvents),
                    progressPercent(34, 90, processed, totalEvents));
            publishRandomProgress(
                    progressConsumer,
                    percent,
                    processed,
                    snapshotsByEventId.size(),
                    requiredUserIds.size(),
                    observedQueries.get(),
                    "Processed " + processed + "/" + snapshotsByEventId.size() + " random event(s), "
                            + requiredUserIds.size() + " candidate user(s), "
                            + observedQueries.get() + " backend lookup(s).");
        }));
        publishRandomProgress(progressConsumer, 96, snapshotsByEventId.size(), snapshotsByEventId.size(), requiredUserIds.size(),
                observedQueries.get(), "Finalizing random event groups after " + observedQueries.get() + " backend lookup(s).");

        return plans;
    }

    private Set<String> resolvePublicUserIds(Collection<String> candidateUserIds) {
        Set<String> normalizedCandidateUserIds = new LinkedHashSet<>(normalizeUserIds(candidateUserIds));
        if (normalizedCandidateUserIds.isEmpty()) {
            return Set.of();
        }
        Set<String> publicUserIds = new LinkedHashSet<>();
        for (Users user : usersRepository.findByUserIdIn(normalizedCandidateUserIds)) {
            String userId = normalizeId(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)
                    && PUBLIC_PROFILE_STATUS.equalsIgnoreCase(safeText(user.getProfileStatus()))) {
                publicUserIds.add(userId);
            }
        }
        return publicUserIds;
    }

    public record RandomPlanProgress(
            int progressPercent,
            int processedEvents,
            int totalEvents,
            int candidateUsers,
            int observedQueries,
            String detail) {}

    private void publishRandomProgress(
            Consumer<RandomPlanProgress> progressConsumer,
            int progressPercent,
            int processedEvents,
            int totalEvents,
            int candidateUsers,
            int observedQueries,
            String detail) {
        if (progressConsumer == null) {
            return;
        }
        progressConsumer.accept(new RandomPlanProgress(progressPercent, processedEvents, totalEvents, candidateUsers, observedQueries, detail));
    }

    private int progressPercent(int startPercent, int endPercent, int processed, int total) {
        int safeTotal = Math.max(1, total);
        int safeProcessed = Math.max(0, Math.min(processed, safeTotal));
        return Math.max(startPercent, Math.min(endPercent,
                startPercent + Math.round(((endPercent - startPercent) * safeProcessed) / (float) safeTotal)));
    }

    public List<InviteBatchPlan> generatePriorityPlans() {
        return generatePriorityPlansForEvents(null);
    }

    public List<InviteBatchPlan> generatePriorityPlansForEvents(Collection<String> sourceIds) {
        Set<String> requestedSourceIds = new LinkedHashSet<>(normalizeUserIds(sourceIds));
        List<ActivityEvent> records = requestedSourceIds.isEmpty()
                ? activityEventsRepository.findByAutoInviterTrue()
                : activityEventsRepository.findBySourceIdIn(requestedSourceIds);
        List<ActivityEvent> events = resolveCanonicalEvents(scopedEvents(records));
        if (!requestedSourceIds.isEmpty()) {
            events = events.stream()
                    .filter(event -> requestedSourceIds.contains(normalizeId(event == null ? null : event.getSourceId())))
                    .toList();
        }

        Set<String> priorityOffGroups = priorityOffGroups(events);
        events = events.stream().filter(event -> !priorityOffGroups.contains(normalizeId(event.getWorkspaceGroupId()))).toList();
        if (events.isEmpty()) return List.of();

        // --- PHASE 1: PRE-FETCH (Sequential) ---
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByEventId = new LinkedHashMap<>();
        Set<String> requiredUserIds = new LinkedHashSet<>();

        for (ActivityEvent event : events) {
            if (event == null || !Boolean.TRUE.equals(event.getAutoInviter()) || !Boolean.TRUE.equals(event.getPublished())) {
                continue;
            }
            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) continue;

            ActivitiesMembersService.OwnerMembersSnapshot snapshot = activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, eventId);
            snapshotsByEventId.put(eventId, snapshot);
            requiredUserIds.add(normalizeId(event.getCreatorUserId()));

            if (snapshot != null) {
                requiredUserIds.addAll(snapshot.acceptedMemberUserIds());
                requiredUserIds.addAll(snapshot.pendingMemberUserIds());
            }
        }

        Map<String, FGraph> campaignGraphs = buildCampaignGraphs(events);

        // Single DB/Graph construction
        FGraph graph = buildGraphSnapshot(requiredUserIds);
        if (graph.getNodes().isEmpty() && campaignGraphs.values().stream().allMatch(value -> value.getNodes().isEmpty())) {
            return List.of();
        }
        Set<String> graphUserIds = new LinkedHashSet<>(graph.getNodes().keySet());
        campaignGraphs.values().forEach(value -> graphUserIds.addAll(value.getNodes().keySet()));
        Map<String, Users> graphUsers = usersRepository.findAllById(graphUserIds).stream()
                .collect(Collectors.toMap(Users::getUserId, user -> user, (first, second) -> first));

        // THREAD SAFETY: Synchronized list for parallel addition
        List<InviteBatchPlan> plans = Collections.synchronizedList(new ArrayList<>());

        // --- PHASE 2: PARALLEL EXECUTION ---
        MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
        events.parallelStream().forEach(event -> withMongoSessionMode(sessionMode, () -> {
            if (event == null || !Boolean.TRUE.equals(event.getAutoInviter()) || !Boolean.TRUE.equals(event.getPublished())) return;

            String eventId = normalizeId(event.getSourceId());
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByEventId.get(eventId);

            int acceptedMembers = snapshot == null ? 0 : snapshot.acceptedMembers();
            int reservedInvitations = reservedInvitationCount(snapshot);
            int openSpots = Math.max(
                    0,
                    safeCount(event.getCapacityTotal()) - acceptedMembers - reservedInvitations);

            if (!StringUtils.hasText(eventId) || openSpots <= 0) return;

            Set<String> lockedUserIds = new LinkedHashSet<>();
            String creatorUserId = normalizeId(event.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                lockedUserIds.add(creatorUserId);
            }
            if (snapshot != null) {
                lockedUserIds.addAll(snapshot.acceptedMemberUserIds());
                lockedUserIds.addAll(snapshot.pendingMemberUserIds());
                snapshot.members().stream()
                        .filter(Objects::nonNull)
                        .filter(member -> MEMBER_STATUS_DISQUALIFIED.equals(safeText(member.getStatus())))
                        .map(ActivityMember::getUserId)
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .forEach(lockedUserIds::add);
            }

            FGraph eventGraph = StringUtils.hasText(event.getCampaignId())
                    ? campaignGraphs.getOrDefault(event.getCampaignId(), new FGraph()) : graph;
            Set<String> candidateUserIds = new LinkedHashSet<>(eventGraph.getNodes().keySet());
            candidateUserIds.removeAll(lockedUserIds);
            candidateUserIds.removeIf(id -> {
                Users user = graphUsers.get(id);
                return user == null || !Objects.equals(event.getWorkspaceGroupId(), user.getWorkspaceGroupId())
                        || Set.of("inactive", "blocked", "deleted").contains(safeText(user.getProfileStatus()));
            });

            InviteBatchPlan plan = eventGeneratorByPriority.generate(new PriorityGeneratorRequest(
                    eventId, eventGraph, candidateUserIds, lockedUserIds, Range.of(openSpots, openSpots), List.of(), true, 0d));

            if (plan.invitedUserIds().isEmpty()) return;

            // These DB writes now execute concurrently across cores
            List<String> persistedInviteUserIds = activitiesMembersService.inviteUsers(
                    eventId, resolveInviterUserId(event), plan.invitedUserIds(), event);

            if (!persistedInviteUserIds.isEmpty()) {
                recordPlanMarker("priority", MARKER_ACTION_INVITE_BATCH, eventId, eventId, persistedInviteUserIds);
                eventInviteNotificationService.notifyInvitees(
                        event,
                        persistedInviteUserIds,
                        resolveInviterUserId(event));

                // Thread-safe addition
                plans.add(new InviteBatchPlan(eventId, persistedInviteUserIds));
            }
        }));

        return plans;
    }

    private int reservedInvitationCount(ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        if (snapshot == null || snapshot.invitedMemberUserIds() == null) {
            return 0;
        }
        Set<String> acceptedUserIds = new LinkedHashSet<>(normalizeUserIds(snapshot.acceptedMemberUserIds()));
        return (int) snapshot.invitedMemberUserIds().stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !acceptedUserIds.contains(userId))
                .distinct()
                .count();
    }

    public List<EventLeaderboardStateDto> generateScorePlans() {
        return generateScorePlansForEvents(null);
    }

    public List<EventLeaderboardStateDto> generateScorePlansForEvents(Collection<String> sourceIds) {
        return generateScorePlanRunForEvents(sourceIds, false).states();
    }

    private ScorePlanRunResult generateScorePlanRunForEvents(
            Collection<String> sourceIds,
            boolean advancementOnly) {
        // THREAD SAFETY: We must use a synchronized list because multiple CPU threads will add to this simultaneously
        List<EventLeaderboardStateDto> states = Collections.synchronizedList(new ArrayList<>());
        AtomicInteger changedGroupCount = new AtomicInteger(0);
        AtomicInteger processedResultRevisionCount = new AtomicInteger(0);
        Set<String> requestedSourceIds = new LinkedHashSet<>(normalizeUserIds(sourceIds));
        List<ActivityEvent> events = requestedSourceIds.isEmpty()
                ? resolveCanonicalEvents()
                : resolveCanonicalEvents(activityEventsRepository.findBySourceIdIn(requestedSourceIds));
        if (!requestedSourceIds.isEmpty()) {
            events = events.stream()
                    .filter(event -> requestedSourceIds.contains(normalizeId(event == null ? null : event.getSourceId())))
                    .toList();
        }
        events = applyStageRuntimeOverlays(events);
        events = events.stream()
                .filter(this::shouldReviewTournamentStages)
                .filter(event -> !advancementOnly || hasFinalizedTournamentTransition(event))
                .toList();

        // --- PHASE 1: PRE-FETCH (Runs Sequentially) ---
        // Gather all users and snapshots up front to eliminate N+1 database queries
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByEventId = new LinkedHashMap<>();
        Map<String, Set<String>> existingTournamentUserIdsByEventId = new LinkedHashMap<>();
        Set<String> allRequiredUserIds = new LinkedHashSet<>();

        for (ActivityEvent event : events) {
            if (event == null || event.getSubEvents() == null) continue;

            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) continue;

            ActivitiesMembersService.OwnerMembersSnapshot snapshot = activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, eventId);
            snapshotsByEventId.put(eventId, snapshot);

            if (snapshot != null && snapshot.acceptedMemberUserIds() != null) {
                allRequiredUserIds.addAll(snapshot.acceptedMemberUserIds());
            }
            Set<String> existingTournamentUserIds = existingTournamentUserIds(eventId, event);
            existingTournamentUserIdsByEventId.put(eventId, existingTournamentUserIds);
            allRequiredUserIds.addAll(existingTournamentUserIds);
        }

        Set<String> priorityOffGroups=priorityOffGroups(events);
        FGraph globalGraph=allRequiredUserIds.isEmpty()||events.stream().allMatch(e->priorityOffGroups.contains(normalizeId(e.getWorkspaceGroupId())))
            ? participantGraph(allRequiredUserIds):buildGraphSnapshot(allRequiredUserIds);
        Map<String, FGraph> campaignGraphs = buildCampaignGraphs(events);

        // --- PHASE 2: PARALLEL EXECUTION ---
        // Process every event concurrently across all available CPU cores!
        MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
        events.parallelStream().forEach(event -> withMongoSessionMode(sessionMode, () -> {
            if (event == null || event.getSubEvents() == null || !shouldReviewTournamentStages(event)) {
                return;
            }

            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) return;

            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByEventId.get(eventId);
            Set<String> acceptedUserIds = snapshot == null
                    ? new LinkedHashSet<>()
                    : new LinkedHashSet<>(normalizeUserIds(snapshot.acceptedMemberUserIds()));
            Set<String> tournamentUserIds = new LinkedHashSet<>(acceptedUserIds);
            tournamentUserIds.addAll(existingTournamentUserIdsByEventId.getOrDefault(eventId, Set.of()));

            FGraph eventGraph = tournamentUserIds.isEmpty()
                    ? new FGraph()
                    : eventGraph(event, globalGraph, campaignGraphs, tournamentUserIds, priorityOffGroups);

            List<SubEventItem> subEvents = safeSubEvents(event);
            for (int index = 0; index < subEvents.size(); index += 1) {
                SubEventItem subEvent = subEvents.get(index);
                if (subEvent == null || !StringUtils.hasText(normalizeId(subEvent.id()))) continue; // We are inside a standard for-loop here, so continue is fine
                String stageStatus = normalizeStageStatus(subEvent.stageStatus());
                if (STAGE_STATUS_START_REVIEW.equals(stageStatus) || STAGE_STATUS_SUSPENDED.equals(stageStatus)) {
                    continue;
                }
                if (!isTournamentStage(subEvent)) {
                    continue;
                }

                String subEventId = normalizeId(subEvent.id());

                activitiesEventLeaderboardService.materializeGeneratedGroups(eventId, subEventId);
                EventLeaderboardStateDto state = activitiesEventLeaderboardService.queryState(eventId, subEventId);

                if (state == null) {
                    logDiagnostic("score", eventId, subEventId, "Leaderboard state lookup returned no data.");
                    continue;
                }

                if (state.groups().stream().anyMatch(group -> !group.advancingMemberIds().isEmpty())) {
                    states.add(state); // Thread-safe addition
                }

                if (index + 1 >= subEvents.size()) continue;
                if (!STAGE_STATUS_FINALIZED.equals(stageStatus)) continue;

                Set<String> advancingUserIds = resolveAdvancingUserIds(state);

                SubEventItem nextSubEvent = subEvents.get(index + 1);
                String nextSubEventId = normalizeId(nextSubEvent == null ? null : nextSubEvent.id());
                if (!StringUtils.hasText(nextSubEventId)) {
                    logDiagnostic("score", eventId, subEventId, "Skipping next-stage materialization because the next subevent is missing an id.");
                    continue;
                }
                if (!isTournamentStage(nextSubEvent)) {
                    logDiagnostic(
                            "score",
                            eventId,
                            subEventId,
                            "Skipping next-stage materialization because the adjacent subevent is not a tournament stage.");
                    continue;
                }
                if (!isNextStageMembershipMutable(nextSubEvent)) {
                    logDiagnostic(
                            "score",
                            eventId,
                            subEventId,
                            "Skipping next-stage membership synchronization because the next stage is already in progress or closed.");
                    continue;
                }

                List<GroupAssignmentTarget> nextTargets = resolveGroupAssignmentTargets(
                        eventId, nextSubEventId, nextSubEvent, advancingUserIds, false, "score");
                if (nextTargets.isEmpty() && !advancingUserIds.isEmpty()) continue;

                List<GeneratedEventPlan> changedGroups = nextTargets.isEmpty()
                        ? List.of()
                        : assignMembersToTargets(
                                event, eventGraph, advancingUserIds, nextTargets, "score",
                                "score:" + eventId + ":" + subEventId + "->" + nextSubEventId,
                                null,
                                true,
                                false,
                                null);
                if (!changedGroups.isEmpty()) {
                    activityTournamentGroupCounterService.syncParent(eventId, nextSubEventId);
                }

                Set<String> outcomeUserIds = resolveStageParticipantUserIds(state);
                int resultRevision = safeCount(subEvent.stageResultRevision());
                if (resultRevision <= 0) {
                    changedGroupCount.addAndGet(changedGroups.size());
                    continue;
                }
                String resultRevisionScope = subEventId + ":result-revision:" + resultRevision;
                String resultFingerprint = fingerprintUserIds(outcomeUserIds);
                boolean unpublishedResultRevision = notificationOutboxService != null
                        && !outcomeUserIds.isEmpty()
                        && !hasPlanMarker(
                                "score",
                                "score-outcome",
                                eventId,
                                resultRevisionScope,
                                resultFingerprint);
                if (unpublishedResultRevision) {
                    notifyTournamentStageOutcomes(
                            event,
                            subEvent,
                            nextSubEvent,
                            state,
                            tournamentUserIds,
                            advancingUserIds);
                    recordPlanMarker(
                            "score",
                            "score-outcome",
                            eventId,
                            resultRevisionScope,
                            outcomeUserIds);
                    processedResultRevisionCount.incrementAndGet();
                }
                changedGroupCount.addAndGet(changedGroups.size());
            }
        })); // End of parallel stream

        return new ScorePlanRunResult(
                List.copyOf(states),
                changedGroupCount.get(),
                processedResultRevisionCount.get());
    }

    private void notifyTournamentStageOutcomes(
            ActivityEvent event,
            SubEventItem completedStage,
            SubEventItem nextStage,
            EventLeaderboardStateDto completedStageState,
            Collection<String> acceptedUserIds,
            Collection<String> advancingUserIds) {
        if (notificationOutboxService == null) {
            return;
        }
        List<String> recipients = normalizeUserIds(advancingUserIds);
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        if (!StringUtils.hasText(eventId)) {
            return;
        }
        String eventTitle = firstNonBlank(event == null ? null : event.getTitle(), "your tournament");
        String stageTitle = firstNonBlank(completedStage == null ? null : completedStage.name(), "Tournament stage");
        String nextStageTitle = firstNonBlank(nextStage == null ? null : nextStage.name(), "the next stage");
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", eventTitle);
        payload.put("eventScope", "tournament-advancement");
        payload.put("stageTitle", stageTitle);
        payload.put("nextStageTitle", nextStageTitle);
        payload.put("senderName", RANDOM_ROOM_SYSTEM_NAME);
        payload.put("notification_title_key", "notification.event.stage.advanced.title");
        payload.put("notification_message_key", "notification.event.stage.advanced.message");
        payload.put("notification_tone", "success");
        payload.put("notification_avatar_tone", "stage");
        payload.put("notification_avatar_icon", "emoji_events");
        int resultRevision = Math.max(1, safeCount(completedStage == null ? null : completedStage.stageResultRevision()));
        if (resultRevision > 1) {
            payload.put("stageResultRevision", Integer.toString(resultRevision));
        }
        putTournamentStagePosition(payload, event, nextStage);
        if (!recipients.isEmpty()) {
            notificationOutboxService.enqueue(new NotificationIntent(
                    "event-stage-advanced",
                    OWNER_TYPE_EVENT,
                    eventId,
                    "event-stage-advancers",
                    recipients,
                    "Advanced to " + nextStageTitle,
                    "You advanced from " + stageTitle + " to " + nextStageTitle + ".",
                    DEFAULT_CLICK_URL,
                    TOURNAMENT_ROOM_IMAGE_URL,
                    APP_BADGE_URL,
                    "event-stage-advanced-" + eventId + "-"
                            + normalizeId(completedStage == null ? null : completedStage.id())
                            + (resultRevision > 1 ? "-r" + resultRevision : ""),
                    payload,
                    MARKER_UPDATED_BY));
        }

        Set<String> notAdvancingUserIds = resolveStageParticipantUserIds(completedStageState);
        notAdvancingUserIds.retainAll(normalizeUserIds(acceptedUserIds));
        notAdvancingUserIds.removeAll(recipients);
        if (notAdvancingUserIds.isEmpty()) {
            return;
        }
        Map<String, String> notAdvancedPayload = new LinkedHashMap<>();
        notAdvancedPayload.put("eventId", eventId);
        notAdvancedPayload.put("eventTitle", eventTitle);
        notAdvancedPayload.put("eventScope", "tournament-advancement");
        notAdvancedPayload.put("stageTitle", stageTitle);
        notAdvancedPayload.put("nextStageTitle", nextStageTitle);
        notAdvancedPayload.put("senderName", RANDOM_ROOM_SYSTEM_NAME);
        notAdvancedPayload.put("notification_title_key", "notification.event.stage.not-advanced.title");
        notAdvancedPayload.put("notification_message_key", "notification.event.stage.not-advanced.message");
        notAdvancedPayload.put("notification_tone", "warning");
        notAdvancedPayload.put("notification_avatar_tone", "stage");
        notAdvancedPayload.put("notification_avatar_icon", "emoji_events");
        if (resultRevision > 1) {
            notAdvancedPayload.put("stageResultRevision", Integer.toString(resultRevision));
        }
        putTournamentStagePosition(notAdvancedPayload, event, completedStage);
        notificationOutboxService.enqueue(new NotificationIntent(
                "event-stage-not-advanced",
                OWNER_TYPE_EVENT,
                eventId,
                "event-stage-non-advancers",
                List.copyOf(notAdvancingUserIds),
                "Did not advance from " + stageTitle,
                "You did not advance from " + stageTitle + " to " + nextStageTitle + ".",
                DEFAULT_CLICK_URL,
                TOURNAMENT_ROOM_IMAGE_URL,
                APP_BADGE_URL,
                "event-stage-not-advanced-" + eventId + "-"
                        + normalizeId(completedStage == null ? null : completedStage.id())
                        + (resultRevision > 1 ? "-r" + resultRevision : ""),
                notAdvancedPayload,
                MARKER_UPDATED_BY));
    }

    private Set<String> resolveStageParticipantUserIds(EventLeaderboardStateDto state) {
        Set<String> participantUserIds = new LinkedHashSet<>();
        if (state == null || state.groups() == null) {
            return participantUserIds;
        }
        state.groups().stream()
                .filter(Objects::nonNull)
                .flatMap(group -> group.members() == null ? java.util.stream.Stream.empty() : group.members().stream())
                .filter(Objects::nonNull)
                .map(member -> normalizeId(member.memberId()))
                .filter(StringUtils::hasText)
                .forEach(participantUserIds::add);
        return participantUserIds;
    }

    private void putTournamentStagePosition(
            Map<String, String> payload,
            ActivityEvent event,
            SubEventItem stage) {
        if (payload == null) {
            return;
        }
        List<SubEventItem> tournamentStages = safeSubEvents(event).stream()
                .filter(this::isTournamentStage)
                .toList();
        String stageId = normalizeId(stage == null ? null : stage.id());
        int stageIndex = 0;
        for (int index = 0; index < tournamentStages.size(); index += 1) {
            if (stageId.equals(normalizeId(tournamentStages.get(index).id()))) {
                stageIndex = index + 1;
                break;
            }
        }
        payload.put("stageIndex", Integer.toString(Math.max(1, stageIndex)));
        payload.put("stageTotal", Integer.toString(Math.max(1, tournamentStages.size())));
    }

    private boolean isNextStageMembershipMutable(SubEventItem stage) {
        if (stage == null) {
            return false;
        }
        String status = normalizeStageStatus(stage.stageStatus());
        if (STAGE_STATUS_START_REVIEW.equals(status)) {
            return true;
        }
        return STAGE_STATUS_ACTIVE.equals(status)
                && !StringUtils.hasText(safeText(stage.stageStatusUpdatedAt()))
                && !StringUtils.hasText(safeText(stage.stageFinalizedAt()));
    }

    private Map<String, Map<String, ActivitySubEventStageRuntime>> stageRuntimesByOwner(
            List<ActivityEvent> safeEvents) {
        if (safeEvents.isEmpty() || activitySubEventStageRuntimeRepository == null) return Map.of();
        List<String> ownerIds = safeEvents.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (ownerIds.isEmpty()) {
            return Map.of();
        }
        List<ActivitySubEventStageRuntime> runtimes =
                activitySubEventStageRuntimeRepository.findByOwnerIdIn(ownerIds);
        Map<String, Map<String, ActivitySubEventStageRuntime>> runtimesByOwnerAndStage =
                new LinkedHashMap<>();
        for (ActivitySubEventStageRuntime runtime :
                runtimes == null ? List.<ActivitySubEventStageRuntime>of() : runtimes) {
            String ownerId = normalizeId(runtime == null ? null : runtime.getOwnerId());
            String stageId = normalizeId(runtime == null ? null : runtime.getSubEventId());
            if (!StringUtils.hasText(ownerId)
                    || !StringUtils.hasText(stageId)
                    || "D".equalsIgnoreCase(safeText(runtime.getStatus()))) {
                continue;
            }
            runtimesByOwnerAndStage
                    .computeIfAbsent(ownerId, ignored -> new LinkedHashMap<>())
                    .put(stageId, runtime);
        }
        return runtimesByOwnerAndStage;
    }

    private SubEventItem withStageRuntime(SubEventItem stage, ActivitySubEventStageRuntime runtime) {
        return stage == null || runtime == null ? stage : copySubEventWithStageStatus(
                stage,
                firstNonBlank(runtime.getStageStatus(), stage.stageStatus()),
                firstNonBlank(runtime.getStageStatusReason(), stage.stageStatusReason()),
                firstNonBlank(runtime.getStageStatusUpdatedAt(), stage.stageStatusUpdatedAt()),
                firstNonBlank(runtime.getStageFinalizedAt(), stage.stageFinalizedAt()),
                firstNonBlank(runtime.getStageFinalizedByUserId(), stage.stageFinalizedByUserId()),
                runtime.getStageResultRevision() == null ? stage.stageResultRevision() : runtime.getStageResultRevision());
    }

    private List<ActivityEvent> applyStageRuntimeOverlays(List<ActivityEvent> events) {
        List<ActivityEvent> safeEvents = events == null ? List.of() : events.stream().filter(Objects::nonNull).toList();
        Map<String, Map<String, ActivitySubEventStageRuntime>> runtimes = stageRuntimesByOwner(safeEvents);
        for (ActivityEvent event : safeEvents) {
            Map<String, ActivitySubEventStageRuntime> stages = runtimes.get(normalizeId(event.getSourceId()));
            if (stages == null || stages.isEmpty()) continue;
            event.setSubEvents(safeSubEvents(event).stream()
                    .map(stage -> withStageRuntime(stage, stages.get(normalizeId(stage == null ? null : stage.id()))))
                    .toList());
        }
        return safeEvents;
    }

    private boolean hasFinalizedTournamentTransition(ActivityEvent event) {
        List<SubEventItem> stages = safeSubEvents(event);
        for (int index = 0; index + 1 < stages.size(); index += 1) {
            SubEventItem current = stages.get(index);
            SubEventItem next = stages.get(index + 1);
            if (isTournamentStage(current)
                    && isTournamentStage(next)
                    && STAGE_STATUS_FINALIZED.equals(normalizeStageStatus(current.stageStatus()))) {
                return true;
            }
        }
        return false;
    }

    private Set<String> resolveStageAssignmentUserIds(
            String eventId,
            List<SubEventItem> stages,
            int stageIndex,
            Collection<String> acceptedUserIds) {
        Set<String> accepted = new LinkedHashSet<>(normalizeUserIds(acceptedUserIds));
        if (stageIndex <= 0) {
            return accepted;
        }
        if (stages == null || stageIndex >= stages.size()) {
            return Set.of();
        }
        SubEventItem previousStage = stages.get(stageIndex - 1);
        SubEventItem currentStage = stages.get(stageIndex);
        if (!isTournamentStage(previousStage) || !isTournamentStage(currentStage)) {
            return accepted;
        }
        String previousStageId = normalizeId(previousStage == null ? null : previousStage.id());
        if (!StringUtils.hasText(previousStageId)) {
            return Set.of();
        }
        EventLeaderboardStateDto previousState = activitiesEventLeaderboardService.queryState(eventId, previousStageId);
        Set<String> advancingUserIds = resolveAdvancingUserIds(previousState);
        return advancingUserIds;
    }

    private Set<String> existingTournamentUserIds(String eventId, ActivityEvent event) {
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        for (SubEventItem stage : safeSubEvents(event)) {
            if (!isTournamentStage(stage)) {
                continue;
            }
            String stageId = normalizeId(stage == null ? null : stage.id());
            if (!StringUtils.hasText(stageId)) {
                continue;
            }
            EventLeaderboardStateDto state = activitiesEventLeaderboardService.queryState(eventId, stageId);
            userIds.addAll(resolveStageParticipantUserIds(state));
        }
        return userIds;
    }

    private void withMongoSessionMode(MongoSessionMode sessionMode, Runnable action) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(sessionMode);
            action.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    /** One batched read per scheduler run; campaign evidence never crosses event contexts. */
    private Map<String, FGraph> buildCampaignGraphs(List<ActivityEvent> events) {
        Set<String> campaignIds = events.stream().filter(Objects::nonNull).map(ActivityEvent::getCampaignId)
                .filter(StringUtils::hasText).collect(Collectors.toSet());
        Map<String, FGraph> graphs = new LinkedHashMap<>();
        if (campaignIds.isEmpty()) return graphs;
        var snapshots = affinityEdgeService.campaignGraphs(campaignIds);
        for (String campaignId : campaignIds) {
            var snapshot = snapshots.getOrDefault(campaignId, new CampaignGraphs.Snapshot(List.of(), List.of()));
            Map<String, Node> nodes = new LinkedHashMap<>();
            List<Edge> edges = new ArrayList<>();
            for (String userId : snapshot.userIds()) {
                String id = normalizeId(userId);
                if (StringUtils.hasText(id)) nodes.putIfAbsent(id, new Node(id));
            }
            for (EdgeView edge : snapshot.edges()) addUserAffinityEdge(edges, nodes, edge);
            graphs.put(campaignId, new FGraph(nodes, edges));
        }
        return graphs;
    }

    private Set<String> priorityOffGroups(List<ActivityEvent> events) {
        var ids=events.stream().map(ActivityEvent::getWorkspaceGroupId).filter(StringUtils::hasText).collect(Collectors.toSet());
        return ids.isEmpty()?Set.of():communityGroups.findByIdIn(ids).stream().filter(g->!g.priorityEnabled()).map(com.raxim.myscoutee.domain.groups.api.GroupView::id).collect(Collectors.toSet());
    }
    private FGraph participantGraph(Set<String> participants) {
        Map<String,Node> nodes=new LinkedHashMap<>();if(participants!=null)participants.forEach(id->nodes.put(id,new Node(id)));return new FGraph(nodes,List.of());
    }
    private FGraph eventGraph(ActivityEvent event, FGraph global, Map<String, FGraph> campaigns, Set<String> participants, Set<String> priorityOffGroups) {
        if(priorityOffGroups.contains(normalizeId(event.getWorkspaceGroupId())))return participantGraph(participants);
        FGraph selected = StringUtils.hasText(event.getCampaignId())
                ? campaigns.getOrDefault(event.getCampaignId(), new FGraph()) : global;
        if (participants == null) return selected;
        // Accepted participants remain eligible even when they have no mutual score.
        Map<String, Node> nodes = new LinkedHashMap<>(selected.getNodes());
        participants.forEach(id -> nodes.putIfAbsent(id, new Node(id)));
        return new FGraph(nodes, selected.getEdges()).filter(participants, Set.of(), 0d);
    }

    private FGraph buildGraphSnapshot(Set<String> requiredUserIds) {
        return buildGraphSnapshot(requiredUserIds, null);
    }

    private FGraph buildGraphSnapshot(Set<String> requiredUserIds, AtomicInteger observedQueries) {
        List<Edge> edges = new ArrayList<>();
        Set<String> discoveredUserIds = new LinkedHashSet<>();
        if (requiredUserIds != null) {
            requiredUserIds.stream()
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .forEach(discoveredUserIds::add);
        }

        List<? extends EdgeView> affinityEdges = resolveRelevantEdges(discoveredUserIds);
        incrementObservedQueries(observedQueries);
        for (EdgeView edge : affinityEdges) {
            if (edge == null) {
                continue;
            }
            collectAffinityEdgeUserIds(discoveredUserIds, edge);
        }

        Map<String, Node> nodesByUserId = new LinkedHashMap<>();
        for (Users user : usersRepository.findAllById(discoveredUserIds)) {
            incrementObservedQueries(observedQueries);
            if (user == null || !StringUtils.hasText(normalizeId(user.getId()))) {
                continue;
            }
            nodesByUserId.put(normalizeId(user.getId()), new Node(normalizeId(user.getId()), safeText(user.getGender())));
        }
        for (String userId : discoveredUserIds) {
            nodesByUserId.putIfAbsent(userId, new Node(userId));
        }

        for (EdgeView edge : affinityEdges) {
            if (edge == null) {
                continue;
            }
            addUserAffinityEdge(edges, nodesByUserId, edge);
        }
        return new FGraph(nodesByUserId, edges);
    }

    private List<? extends EdgeView> resolveRelevantEdges(Set<String> requiredUserIds) {
        List<String> normalizedUserIds = requiredUserIds == null
                ? List.of()
                : requiredUserIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
        if (normalizedUserIds.isEmpty()) {
            return userAffinityEdgesRepository.findAll();
        }
        return userAffinityEdgesRepository.findRelevantByUserIds(normalizedUserIds);
    }

    private void collectAffinityEdgeUserIds(Set<String> userIds, EdgeView edge) {
        String leftUserId = normalizeId(edge == null ? null : edge.getLeftUserId());
        String rightUserId = normalizeId(edge == null ? null : edge.getRightUserId());
        if (StringUtils.hasText(leftUserId)) {
            userIds.add(leftUserId);
        }
        if (StringUtils.hasText(rightUserId)) {
            userIds.add(rightUserId);
        }
    }

    private void addUserAffinityEdge(List<Edge> edges, Map<String, Node> nodesByUserId, EdgeView affinityEdge) {
        String leftUserId = normalizeId(affinityEdge.getLeftUserId());
        String rightUserId = normalizeId(affinityEdge.getRightUserId());
        double weight = affinityEdge.getEdgeWeight() == null ? 0d : Math.max(0d, affinityEdge.getEdgeWeight());
        if (weight <= 0d) {
            return;
        }
        addEdge(edges, nodesByUserId, leftUserId, rightUserId, weight);
    }

    private void addEdge(List<Edge> edges, Map<String, Node> nodesByUserId, String leftUserId, String rightUserId, double weight) {
        if (!StringUtils.hasText(leftUserId) || !StringUtils.hasText(rightUserId) || leftUserId.equals(rightUserId)) {
            return;
        }
        Node left = nodesByUserId.computeIfAbsent(leftUserId, key -> new Node(key));
        Node right = nodesByUserId.computeIfAbsent(rightUserId, key -> new Node(key));
        edges.add(new Edge(left, right, weight));
    }

    private List<ActivityEvent> resolveCanonicalEvents() {
        return resolveCanonicalEvents(scopedEvents(activityEventsRepository.findAll()));
    }

    private List<ActivityEvent> resolveCanonicalEvents(List<ActivityEvent> records) {
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : records) {
            if (record == null || !StringUtils.hasText(normalizeId(record.getSourceId()))) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            ActivityEvent current = preferredBySourceId.get(sourceId);
            if (current == null || prefer(record, current)) {
                preferredBySourceId.put(sourceId, record);
            }
        }
        return new ArrayList<>(preferredBySourceId.values());
    }

    private Map<String, List<ActivityEvent>> eventDocumentsBySourceId(List<ActivityEvent> records) {
        Map<String, List<ActivityEvent>> documentsBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            String sourceId = normalizeId(record == null ? null : record.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                documentsBySourceId.computeIfAbsent(sourceId, key -> new ArrayList<>()).add(record);
            }
        }
        return documentsBySourceId;
    }

    private List<GroupAssignmentTarget> resolveGroupAssignmentTargets(
            String eventId,
            String subEventId,
            SubEventItem subEvent,
            Collection<String> eligibleUserIds,
            boolean preserveAnchors,
            String wrapperType) {
        return resolveGroupAssignmentTargets(eventId, subEventId, subEvent, eligibleUserIds, preserveAnchors, wrapperType, null);
    }

    private List<GroupAssignmentTarget> resolveGroupAssignmentTargets(
            String eventId,
            String subEventId,
            SubEventItem subEvent,
            Collection<String> eligibleUserIds,
            boolean preserveAnchors,
            String wrapperType,
            AtomicInteger observedQueries) {
        return resolveGroupAssignmentTargets(eventId, subEventId, subEvent, eligibleUserIds, preserveAnchors, wrapperType, observedQueries, null);
    }

    private List<GroupAssignmentTarget> resolveGroupAssignmentTargets(
            String eventId,
            String subEventId,
            SubEventItem subEvent,
            Collection<String> eligibleUserIds,
            boolean preserveAnchors,
            String wrapperType,
            AtomicInteger observedQueries,
            Map<String, List<ActivityEvent>> eventDocumentsById) {
        List<ActivityEvent> eventDocuments = eventDocumentsById == null ? null : eventDocumentsById.get(normalizeId(eventId));
        List<SubEventGroupItemDto> groups = eventDocuments == null
                ? activitiesEventLeaderboardService.materializeGeneratedGroups(eventId, subEventId)
                : activitiesEventLeaderboardService.materializeGeneratedGroups(eventId, subEventId, eventDocuments);
        if (eventDocuments == null) {
            incrementObservedQueries(observedQueries);
        }
        if (groups.isEmpty()) {
            logDiagnostic(wrapperType, eventId, subEventId, "No group targets are available for materialization.");
            return List.of();
        }

        Set<String> eligibleUserIdSet = new LinkedHashSet<>(normalizeUserIds(eligibleUserIds));
        List<GroupAssignmentTarget> targets = new ArrayList<>();
        boolean randomRoomTargets = "random".equals(normalizeId(wrapperType));
        String membershipOwnerType = randomRoomTargets ? OWNER_TYPE_EVENT : OWNER_TYPE_GROUP;
        Map<String, String> memberOwnerIdByGroupId = groups.stream()
                .filter(Objects::nonNull)
                .collect(LinkedHashMap::new, (map, group) -> {
                    String groupId = normalizeId(group.id());
                    if (StringUtils.hasText(groupId)) {
                        map.put(
                                groupId,
                                randomRoomTargets
                                        ? randomRoomEventId(eventId, subEventId, groupId)
                                        : canonicalGroupOwnerId(eventId, subEventId, groupId));
                    }
                }, Map::putAll);
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByGroupId = preserveAnchors
                ? activitiesMembersService.buildBatchOwnerSnapshots(membershipOwnerType, groups.stream()
                        .map(group -> memberOwnerIdByGroupId.get(normalizeId(group == null ? null : group.id())))
                        .filter(StringUtils::hasText)
                        .toList())
                : Map.of();
        if (snapshotsByGroupId == null) {
            snapshotsByGroupId = Map.of();
        }
        if (preserveAnchors && !snapshotsByGroupId.isEmpty()) {
            incrementObservedQueries(observedQueries);
        }
        for (SubEventGroupItemDto group : groups) {
            String groupId = normalizeId(group == null ? null : group.id());
            Range groupRange = resolveGroupRange(subEvent, group);
            if (!StringUtils.hasText(groupId) || groupRange == null) {
                logDiagnostic(wrapperType, eventId, subEventId, "Skipping group materialization because the group config is incomplete.");
                return List.of();
            }
            List<String> lockedUserIds = List.of();
            if (preserveAnchors) {
                ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByGroupId.get(memberOwnerIdByGroupId.get(groupId));
                lockedUserIds = snapshot == null
                        ? List.of()
                        : snapshot.acceptedMemberUserIds().stream()
                                .map(this::normalizeId)
                                .filter(eligibleUserIdSet::contains)
                                .distinct()
                                .toList();
            }
            targets.add(new GroupAssignmentTarget(
                    groupId,
                    memberOwnerIdByGroupId.get(groupId),
                    groupRange,
                    lockedUserIds,
                    targets.size() + 1));
        }
        return targets;
    }

    private Range resolveGroupRange(SubEventItem subEvent, SubEventGroupItemDto group) {
        int min = safeCount(group == null ? null : group.capacityMin());
        int max = safeCount(group == null ? null : group.capacityMax());
        if (min <= 0) {
            min = safeCount(subEvent == null ? null : subEvent.tournamentGroupCapacityMin());
        }
        if (max <= 0) {
            max = safeCount(subEvent == null ? null : subEvent.tournamentGroupCapacityMax());
        }
        if (min <= 0 || max <= 0) {
            return null;
        }
        return Range.of(Math.min(min, max), Math.max(min, max));
    }

    private boolean hasExactAcceptedMembership(
            ActivitiesMembersService.OwnerMembersSnapshot snapshot,
            List<String> plannedUserIds) {
        List<String> currentUserIds = snapshot == null
                ? List.of()
                : snapshot.acceptedMemberUserIds().stream().sorted().toList();
        List<String> normalizedPlannedUserIds = plannedUserIds == null
                ? List.of()
                : plannedUserIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .sorted()
                        .toList();
        if (!currentUserIds.equals(normalizedPlannedUserIds)) {
            return false;
        }
        if (snapshot == null) {
            return normalizedPlannedUserIds.isEmpty();
        }
        if (snapshot.pendingMemberUserIds() != null && !snapshot.pendingMemberUserIds().isEmpty()) {
            return false;
        }
        if (snapshot.members() == null || snapshot.members().isEmpty()) {
            return true;
        }
        List<String> visibleAcceptedUserIds = snapshot.members().stream()
                .filter(Objects::nonNull)
                .filter(member -> MEMBER_STATUS_ACCEPTED.equalsIgnoreCase(safeText(member.getStatus())))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .sorted()
                .toList();
        return visibleAcceptedUserIds.equals(normalizedPlannedUserIds)
                && snapshot.members().size() == visibleAcceptedUserIds.size();
    }

    private List<GeneratedEventPlan> assignMembersToTargets(
            ActivityEvent event,
            FGraph graph,
            Collection<String> poolUserIds,
            List<GroupAssignmentTarget> targets,
            String wrapperType,
            String context) {
        return assignMembersToTargets(event, graph, poolUserIds, targets, wrapperType, context, null, false, false, null);
    }

    private List<GeneratedEventPlan> assignMembersToTargets(
            ActivityEvent event,
            FGraph graph,
            Collection<String> poolUserIds,
            List<GroupAssignmentTarget> targets,
            String wrapperType,
            String context,
            AtomicInteger observedQueries) {
        return assignMembersToTargets(
                event,
                graph,
                poolUserIds,
                targets,
                wrapperType,
                context,
                observedQueries,
                false,
                false,
                null);
    }

    private List<GeneratedEventPlan> assignMembersToTargets(
            ActivityEvent event,
            FGraph graph,
            Collection<String> poolUserIds,
            List<GroupAssignmentTarget> targets,
            String wrapperType,
            String context,
            AtomicInteger observedQueries,
            boolean reconcileAllTargets,
            boolean tournamentRoomPresentation,
            Runnable beforeRoomNotifications) {
        Set<String> normalizedPoolUserIds = new LinkedHashSet<>(normalizeUserIds(poolUserIds));
        if (graph != null) {
            normalizedPoolUserIds.retainAll(graph.getNodes().keySet());
        } else {
            normalizedPoolUserIds.clear();
        }
        if (targets == null || targets.isEmpty() || (normalizedPoolUserIds.isEmpty() && !reconcileAllTargets)) {
            return List.of();
        }

        Map<String, String> lockedUserIdToGroupId = new LinkedHashMap<>();
        List<GroupAssignmentTarget> normalizedTargets = new ArrayList<>();
        for (GroupAssignmentTarget target : targets) {
            if (target == null || target.range() == null || !StringUtils.hasText(target.groupId())) {
                continue;
            }
            List<String> dedupedLockedUserIds = new ArrayList<>();
            for (String lockedUserId : target.lockedUserIds()) {
                String normalizedUserId = normalizeId(lockedUserId);
                if (!normalizedPoolUserIds.contains(normalizedUserId)) {
                    continue;
                }
                String existingGroupId = lockedUserIdToGroupId.putIfAbsent(normalizedUserId, target.groupId());
                if (existingGroupId != null && !existingGroupId.equals(target.groupId())) {
                    logDiagnostic("random", target.groupId(), context, "User " + normalizedUserId + " is already anchored in group " + existingGroupId + ".");
                    continue;
                }
                dedupedLockedUserIds.add(normalizedUserId);
            }
            normalizedTargets.add(new GroupAssignmentTarget(
                    target.groupId(),
                    target.memberOwnerId(),
                    target.range(),
                    dedupedLockedUserIds,
                    target.roomOrdinal()));
        }

        Set<String> remainingUserIds = new LinkedHashSet<>(normalizedPoolUserIds);
        remainingUserIds.removeAll(lockedUserIdToGroupId.keySet());

        List<GeneratedEventPlan> plannedGroups = new ArrayList<>();
        List<GroupAssignmentTarget> emptyTargets = new ArrayList<>();
        for (GroupAssignmentTarget target : normalizedTargets) {
            int lockedCount = target.lockedUserIds().size();
            if (lockedCount > target.range().getMax()) {
                logDiagnostic("random", target.groupId(), context, "Locked members exceed the group's maximum capacity.");
                continue;
            }

            if (lockedCount == target.range().getMax()) {
                plannedGroups.add(new GeneratedEventPlan(target.groupId(), normalizeUserIds(target.lockedUserIds())));
                continue;
            }

            if (target.lockedUserIds().isEmpty()) {
                emptyTargets.add(target);
                continue;
            }

            int openMin = Math.max(0, target.range().getMin() - lockedCount);
            int openMax = Math.max(0, target.range().getMax() - lockedCount);
            Set<Node> selectedNodes = openMax <= 0
                    ? Set.of()
                    : algo.selectInviteBatch(
                            graph,
                            new LinkedHashSet<>(remainingUserIds),
                            new LinkedHashSet<>(target.lockedUserIds()),
                            Range.of(openMin, openMax),
                            List.of(),
                            openMin == 0,
                            0d);
            List<String> fillUserIds = selectedNodes.stream().map(Node::getId).toList();
            if (fillUserIds.size() < openMin && reconcileAllTargets) {
                fillUserIds = remainingUserIds.stream()
                        .sorted()
                        .limit(openMax)
                        .toList();
            }
            if (fillUserIds.size() < openMin) {
                logDiagnostic("random", target.groupId(), context, "Unable to fill anchored group to its minimum capacity.");
                continue;
            }
            remainingUserIds.removeAll(fillUserIds);
            plannedGroups.add(new GeneratedEventPlan(target.groupId(), mergeUserIds(target.lockedUserIds(), fillUserIds)));
        }

        if (!emptyTargets.isEmpty()) {
            FGraph remainingGraph = graph.filter(remainingUserIds, Set.of(), 0d);
            List<GeneratedEventPlan> generatedPlans = eventGeneratorByRandom.generateTargets(new RandomTargetedGeneratorRequest(
                    remainingGraph,
                    emptyTargets.stream().map(target -> new RandomGroupTarget(target.groupId(), target.range())).toList(),
                    List.of(),
                    false));
            if (generatedPlans.size() != emptyTargets.size()) {
                logDiagnostic("random", normalizeId(event == null ? null : event.getSourceId()), context, "Unable to assign all empty groups from the remaining pool.");
                if (reconcileAllTargets) {
                    plannedGroups.addAll(buildDeterministicTargetPlans(remainingUserIds, emptyTargets));
                } else {
                    plannedGroups.addAll(generatedPlans);
                }
            } else {
                plannedGroups.addAll(generatedPlans);
            }
        }

        Map<String, String> memberOwnerIdByGroupId = normalizedTargets.stream()
                .collect(LinkedHashMap::new,
                        (map, target) -> map.put(target.groupId(), target.memberOwnerId()),
                        Map::putAll);
        if (reconcileAllTargets) {
            Map<String, GeneratedEventPlan> planByGroupId = plannedGroups.stream()
                    .filter(Objects::nonNull)
                    .collect(
                            LinkedHashMap::new,
                            (map, plan) -> map.putIfAbsent(normalizeId(plan.seedId()), plan),
                            Map::putAll);
            plannedGroups = normalizedTargets.stream()
                    .map(target -> planByGroupId.getOrDefault(
                            target.groupId(),
                            new GeneratedEventPlan(target.groupId(), List.of())))
                    .toList();
            if (!hasExactTargetCoverage(normalizedPoolUserIds, normalizedTargets, plannedGroups)) {
                logDiagnostic(
                        wrapperType,
                        normalizeId(event == null ? null : event.getSourceId()),
                        context,
                        "Skipping membership synchronization because configured target capacity cannot preserve the exact advancing-user set.");
                throw new IllegalStateException(
                        "Configured target capacity cannot preserve the exact advancing-user set for "
                                + context + ".");
            }
        }

        boolean randomRoomAssignment = "random".equals(normalizeId(wrapperType));
        String membershipOwnerType = randomRoomAssignment ? OWNER_TYPE_EVENT : OWNER_TYPE_GROUP;
        String markerActionType = randomRoomAssignment
                ? MARKER_ACTION_RANDOM_ROOM_MEMBERS
                : MARKER_ACTION_GROUP_MEMBERS;
        Map<String, GroupAssignmentTarget> targetByGroupId = normalizedTargets.stream()
                .collect(
                        LinkedHashMap::new,
                        (map, target) -> map.putIfAbsent(normalizeId(target.groupId()), target),
                        Map::putAll);
        List<GeneratedEventPlan> syncedGroups = new ArrayList<>();
        List<RandomRoomAssignment> changedRandomRooms = new ArrayList<>();
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByPlannedGroupId =
                activitiesMembersService.buildBatchOwnerSnapshots(membershipOwnerType, plannedGroups.stream()
                        .map(plan -> memberOwnerIdByGroupId.get(plan.seedId()))
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .toList());
        if (snapshotsByPlannedGroupId == null) {
            snapshotsByPlannedGroupId = Map.of();
        }
        if (!snapshotsByPlannedGroupId.isEmpty()) {
            incrementObservedQueries(observedQueries);
        }
        for (GeneratedEventPlan plannedGroup : plannedGroups) {
            List<String> normalizedPlannedUserIds = normalizeUserIds(plannedGroup.memberUserIds());
            String memberOwnerId = memberOwnerIdByGroupId.getOrDefault(
                    normalizeId(plannedGroup.seedId()),
                    normalizeId(plannedGroup.seedId()));
            GroupAssignmentTarget assignmentTarget = targetByGroupId.get(normalizeId(plannedGroup.seedId()));
            ActivityEvent randomRoom = null;
            if (randomRoomAssignment) {
                if (assignmentTarget == null) {
                    throw new IllegalStateException(
                            "Missing random-room target for " + normalizeId(plannedGroup.seedId()) + ".");
                }
                randomRoom = materializeRandomRoomEvent(event, assignmentTarget, tournamentRoomPresentation);
            }
            ActivitiesMembersService.OwnerMembersSnapshot groupSnapshot = snapshotsByPlannedGroupId.get(memberOwnerId);
            if (hasExactAcceptedMembership(groupSnapshot, normalizedPlannedUserIds)) {
                if (randomRoomAssignment) {
                    activityEventsRepository.save(randomRoom);
                    syncRandomRoomMainEventRuntime(randomRoom, tournamentRoomPresentation);
                    String randomRoomChatId = chatService.ensureMainEventChat(randomRoom, normalizedPlannedUserIds);
                    chatService.ensureInitialSystemMessage(
                            randomRoomChatId,
                            roomWelcomeMessage(event, tournamentRoomPresentation),
                            roomWelcomeMessageType(tournamentRoomPresentation));
                }
                rememberPlanMarkerIfMissing(
                        wrapperType,
                        markerActionType,
                        randomRoomAssignment ? memberOwnerId : plannedGroup.seedId(),
                        context,
                        normalizedPlannedUserIds);
                continue;
            }
            List<String> syncedUserIds = randomRoomAssignment
                    ? activitiesMembersService.syncMaterializedSystemEventMembers(
                            randomRoom,
                            MARKER_UPDATED_BY,
                            normalizedPlannedUserIds,
                            groupSnapshot == null ? List.of() : groupSnapshot.members())
                    : activitiesMembersService.syncGroupMembers(
                            memberOwnerId,
                            resolveInviterUserId(event),
                            normalizedPlannedUserIds);
            incrementObservedQueries(observedQueries);
            List<String> normalizedSyncedUserIds = normalizeUserIds(syncedUserIds).stream().sorted().toList();
            List<String> expectedSyncedUserIds = normalizedPlannedUserIds.stream().sorted().toList();
            if (!normalizedSyncedUserIds.equals(expectedSyncedUserIds)) {
                logDiagnostic(
                        wrapperType,
                        plannedGroup.seedId(),
                        context,
                        "Membership synchronization did not return the exact requested accepted-member set.");
                throw new IllegalStateException(
                        "Membership synchronization failed for " + plannedGroup.seedId()
                                + ": expected " + expectedSyncedUserIds
                                + " but persisted " + normalizedSyncedUserIds + ".");
            }
            if (randomRoomAssignment) {
                syncRandomRoomMainEventRuntime(randomRoom, tournamentRoomPresentation);
                String randomRoomChatId = chatService.ensureMainEventChat(randomRoom, normalizedPlannedUserIds);
                chatService.ensureInitialSystemMessage(
                        randomRoomChatId,
                        roomWelcomeMessage(event, tournamentRoomPresentation),
                        roomWelcomeMessageType(tournamentRoomPresentation));
            }
            recordPlanMarker(
                    wrapperType,
                    markerActionType,
                    randomRoomAssignment ? memberOwnerId : plannedGroup.seedId(),
                    context,
                    expectedSyncedUserIds);
            String resultOwnerId = randomRoomAssignment ? memberOwnerId : plannedGroup.seedId();
            syncedGroups.add(new GeneratedEventPlan(resultOwnerId, expectedSyncedUserIds));
            if (randomRoomAssignment) {
                changedRandomRooms.add(new RandomRoomAssignment(randomRoom, expectedSyncedUserIds));
            }
        }
        if (!changedRandomRooms.isEmpty() && beforeRoomNotifications != null) {
            beforeRoomNotifications.run();
        }
        notifyChangedRandomRoomAssignments(event, context, changedRandomRooms);
        return syncedGroups;
    }

    private Runnable runOnce(Runnable delegate) {
        if (delegate == null) {
            return null;
        }
        return new Runnable() {
            private boolean completed;
            private RuntimeException failure;

            @Override
            public synchronized void run() {
                if (failure != null) {
                    throw failure;
                }
                if (completed) {
                    return;
                }
                try {
                    delegate.run();
                    completed = true;
                } catch (RuntimeException exception) {
                    failure = exception;
                    throw exception;
                }
            }
        };
    }

    private boolean hasExactTargetCoverage(
            Set<String> expectedUserIds,
            List<GroupAssignmentTarget> targets,
            List<GeneratedEventPlan> plans) {
        Map<String, GroupAssignmentTarget> targetById = targets == null
                ? Map.of()
                : targets.stream()
                        .filter(Objects::nonNull)
                        .filter(target -> StringUtils.hasText(normalizeId(target.groupId())))
                        .collect(
                                LinkedHashMap::new,
                                (map, target) -> map.putIfAbsent(normalizeId(target.groupId()), target),
                                Map::putAll);
        if (plans == null || plans.size() != targetById.size()) {
            return false;
        }
        List<String> assignedUserIds = new ArrayList<>();
        Set<String> plannedTargetIds = new LinkedHashSet<>();
        for (GeneratedEventPlan plan : plans) {
            String targetId = normalizeId(plan == null ? null : plan.seedId());
            GroupAssignmentTarget target = targetById.get(targetId);
            if (target == null || !plannedTargetIds.add(targetId)) {
                return false;
            }
            List<String> memberUserIds = normalizeUserIds(plan.memberUserIds());
            if (!memberUserIds.isEmpty()
                    && (memberUserIds.size() < target.range().getMin()
                            || memberUserIds.size() > target.range().getMax())) {
                return false;
            }
            assignedUserIds.addAll(memberUserIds);
        }
        Set<String> assignedUserIdSet = new LinkedHashSet<>(assignedUserIds);
        return assignedUserIds.size() == assignedUserIdSet.size()
                && assignedUserIdSet.equals(new LinkedHashSet<>(normalizeUserIds(expectedUserIds)));
    }

    private List<GeneratedEventPlan> buildDeterministicTargetPlans(
            Collection<String> poolUserIds,
            List<GroupAssignmentTarget> targets) {
        List<String> userIds = normalizeUserIds(poolUserIds).stream().sorted().toList();
        List<GroupAssignmentTarget> usableTargets = targets == null
                ? List.of()
                : targets.stream()
                        .filter(Objects::nonNull)
                        .filter(target -> target.range() != null && StringUtils.hasText(target.groupId()))
                        .toList();
        if (userIds.isEmpty() || usableTargets.isEmpty()) {
            return List.of();
        }

        int feasibleTargetCount = usableTargets.size();
        while (feasibleTargetCount > 0
                && minimumCapacity(usableTargets.subList(0, feasibleTargetCount)) > userIds.size()) {
            feasibleTargetCount -= 1;
        }
        if (feasibleTargetCount == 0) {
            return List.of();
        }

        List<GroupAssignmentTarget> feasibleTargets = usableTargets.subList(0, feasibleTargetCount);
        int assignableUserCount = Math.min(userIds.size(), maximumCapacity(feasibleTargets));
        List<GeneratedEventPlan> plans = new ArrayList<>();
        int cursor = 0;
        for (int index = 0; index < feasibleTargets.size(); index += 1) {
            GroupAssignmentTarget target = feasibleTargets.get(index);
            int remainingMinimum = minimumCapacity(feasibleTargets.subList(index + 1, feasibleTargets.size()));
            int size = Math.min(
                    target.range().getMax(),
                    Math.max(target.range().getMin(), assignableUserCount - cursor - remainingMinimum));
            if (size < target.range().getMin() || cursor + size > assignableUserCount) {
                break;
            }
            plans.add(new GeneratedEventPlan(
                    target.groupId(),
                    new ArrayList<>(userIds.subList(cursor, cursor + size))));
            cursor += size;
        }
        return plans;
    }

    private int minimumCapacity(List<GroupAssignmentTarget> targets) {
        return targets == null
                ? 0
                : targets.stream()
                        .filter(Objects::nonNull)
                        .filter(target -> target.range() != null)
                        .mapToInt(target -> Math.max(0, target.range().getMin()))
                        .sum();
    }

    private int maximumCapacity(List<GroupAssignmentTarget> targets) {
        return targets == null
                ? 0
                : targets.stream()
                        .filter(Objects::nonNull)
                        .filter(target -> target.range() != null)
                        .mapToInt(target -> Math.max(0, target.range().getMax()))
                        .sum();
    }

    private ActivityEvent materializeRandomRoomEvent(
            ActivityEvent sourceEvent,
            GroupAssignmentTarget assignmentTarget,
            boolean tournamentRoomPresentation) {
        String roomEventId = normalizeId(assignmentTarget == null ? null : assignmentTarget.memberOwnerId());
        if (!StringUtils.hasText(roomEventId)) {
            throw new IllegalStateException("A generated random room requires a stable event id.");
        }
        // Keep the legacy scheduler identity stable: it is an internal assignment key,
        // not the room's user-facing semantic type.
        String syncKey = "scheduler:" + RANDOM_ROOM_EVENT_TYPE + ":" + roomEventId;
        ActivityEvent existing = activityEventsRepository.findBySyncKey(syncKey).orElse(null);
        ActivityEvent room = existing == null ? new ActivityEvent() : existing;
        String nowIso = Instant.now().toString();
        int roomOrdinal = Math.max(1, assignmentTarget.roomOrdinal());
        String roomTitle = (tournamentRoomPresentation ? "Tournament Group R" : "Random Room R")
                + roomOrdinal;
        int capacityMin = assignmentTarget.range() == null
                ? 0
                : Math.max(0, assignmentTarget.range().getMin());
        int capacityMax = assignmentTarget.range() == null
                ? capacityMin
                : Math.max(capacityMin, assignmentTarget.range().getMax());

        room.setId(existing == null ? new ObjectId().toHexString() : existing.getId());
        room.setSyncKey(syncKey);
        room.setSourceId(roomEventId);
        room.setOwnerUserId(null);
        room.setWorkspaceGroupId(sourceEvent == null ? null : sourceEvent.getWorkspaceGroupId());
        room.setCampaignId(sourceEvent == null ? null : sourceEvent.getCampaignId());
        room.setStatus(ActivityEvent.STATUS_ACTIVE);
        room.setAdmins(List.of());
        room.setAvatar(tournamentRoomPresentation ? TOURNAMENT_ROOM_IMAGE_URL : "SY");
        room.setTitle(roomTitle);
        room.setSubtitle(tournamentRoomPresentation
                ? "Tournament group for " + firstNonBlank(
                        sourceEvent == null ? null : sourceEvent.getTitle(),
                        "the parent event") + "."
                : "System-generated affinity room.");
        room.setTimeframe(safeText(sourceEvent == null ? null : sourceEvent.getTimeframe()));
        room.setInviter(null);
        room.setUnread(existing == null ? 0 : safeCount(existing.getUnread()));
        room.setActivity(existing == null ? 0 : safeCount(existing.getActivity()));
        room.setIsExpired(false);
        // Organizer presentation/navigation must not make a generated group
        // membership an organizer-owned event.
        room.setCreatorUserId(null);
        room.setOrganizerUserId(tournamentRoomPresentation
                ? normalizeId(sourceEvent == null ? null : sourceEvent.getCreatorUserId())
                : null);
        room.setCreatorName(tournamentRoomPresentation
                ? firstNonBlank(
                        sourceEvent == null ? null : sourceEvent.getCreatorName(),
                        RANDOM_ROOM_SYSTEM_NAME)
                : RANDOM_ROOM_SYSTEM_NAME);
        room.setCreatorInitials(tournamentRoomPresentation
                ? safeText(sourceEvent == null ? null : sourceEvent.getCreatorInitials())
                : "SY");
        room.setCreatorGender(tournamentRoomPresentation
                ? safeText(sourceEvent == null ? null : sourceEvent.getCreatorGender())
                : null);
        room.setCreatorCity(tournamentRoomPresentation
                ? safeText(sourceEvent == null ? null : sourceEvent.getCreatorCity())
                : null);
        room.setVisibility("Invitation only");
        room.setBlindMode("Open Event");
        room.setStartAtIso(firstNonBlank(
                sourceEvent == null ? null : sourceEvent.getStartAtIso(),
                nowIso));
        room.setEndAtIso(firstNonBlank(
                sourceEvent == null ? null : sourceEvent.getEndAtIso(),
                room.getStartAtIso()));
        room.setDistanceKm(sourceEvent == null ? null : sourceEvent.getDistanceKm());
        room.setImageUrl(tournamentRoomPresentation
                ? TOURNAMENT_ROOM_IMAGE_URL
                : RANDOM_ROOM_IMAGE_URL);
        room.setSourceLink(null);
        room.setLocation(safeText(sourceEvent == null ? null : sourceEvent.getLocation()));
        room.setLocationCoordinates(sourceEvent == null ? null : sourceEvent.getLocationCoordinates());
        room.setLocationGeo(sourceEvent == null ? null : sourceEvent.getLocationGeo());
        room.setCapacityMin(capacityMin);
        room.setCapacityMax(capacityMax);
        room.setCapacityTotal(Math.max(
                capacityMax,
                existing == null ? 0 : safeCount(existing.getAcceptedMembers())));
        room.setFull(existing != null && Boolean.TRUE.equals(existing.getFull()));
        room.setAutoInviter(false);
        room.setFrequency("One-time");
        room.setTicketing(false);
        room.setApprovalRequired(false);
        room.setPricing(null);
        room.setPoliciesEnabled(false);
        room.setPolicies(List.of());
        room.setSlotsEnabled(false);
        room.setSlotTemplates(List.of());
        // Affinity rooms are standalone events. Tournament rooms are generated
        // children of the tournament and must stay inside its stage/group UI.
        room.setParentEventId(tournamentRoomPresentation
                ? normalizeId(sourceEvent == null ? null : sourceEvent.getSourceId())
                : null);
        room.setSlotTemplateId(null);
        room.setGenerated(tournamentRoomPresentation);
        room.setEventType(tournamentRoomPresentation
                ? TOURNAMENT_ROOM_EVENT_TYPE
                : RANDOM_ROOM_EVENT_TYPE);
        room.setUpcomingSlots(List.of());
        room.setAcceptedMembers(existing == null ? 0 : safeCount(existing.getAcceptedMembers()));
        room.setPendingMembers(existing == null ? 0 : safeCount(existing.getPendingMembers()));
        room.setAcceptedMemberUserIds(existing == null ? List.of() : existing.getAcceptedMemberUserIds());
        room.setPendingMemberUserIds(existing == null ? List.of() : existing.getPendingMemberUserIds());
        room.setInvitedMemberUserIds(List.of());
        room.setPendingRequestMemberUserIds(List.of());
        room.setTopics(tournamentRoomPresentation
                ? List.of("#Tournament", "#Competition")
                : List.of("#RandomRoom", "#System"));
        room.setSubEventsEnabled(false);
        room.setSubEventDefinitions(List.of());
        room.setSubEvents(List.of());
        room.setMode(tournamentRoomPresentation ? "Tournament" : "Casual");
        room.setRating(existing == null ? 0d : existing.getRating());
        room.setBoost(existing == null ? 0d : existing.getBoost());
        room.setAffinity(existing == null ? 0d : existing.getAffinity());
        room.setCreatedDate(existing == null
                ? nowIso
                : firstNonBlank(existing.getCreatedDate(), nowIso));
        room.setCreatedUser(existing == null
                ? MARKER_UPDATED_BY
                : firstNonBlank(existing.getCreatedUser(), MARKER_UPDATED_BY));
        room.setUpdatedDate(nowIso);
        room.setUpdatedUser(MARKER_UPDATED_BY);
        return room;
    }

    private void syncRandomRoomMainEventRuntime(
            ActivityEvent room,
            boolean tournamentRoomPresentation) {
        if (room == null || tournamentRoomPresentation) {
            return;
        }
        String eventId = normalizeId(room.getSourceId());
        if (!StringUtils.hasText(eventId)) {
            throw new IllegalStateException("A standalone random room requires a stable runtime event id.");
        }
        ActivityMainEventRuntime runtime = activityMainEventRuntimeRepository
                .findByEventIdAndRuntimeKind(eventId, ActivityMainEventRuntime.RUNTIME_KIND_MAIN_EVENT)
                .orElseGet(ActivityMainEventRuntime::new);
        String nowIso = Instant.now().toString();
        if (!StringUtils.hasText(runtime.getId())) {
            runtime.setId(new ObjectId().toHexString());
        }
        if (!StringUtils.hasText(runtime.getRecordId())) {
            runtime.setRecordId("main-event:" + eventId);
        }
        if (!StringUtils.hasText(runtime.getSyncKey())) {
            runtime.setSyncKey("scheduler:main-event-runtime:" + eventId);
        }
        if (!StringUtils.hasText(runtime.getCreatedDate())) {
            runtime.setCreatedDate(nowIso);
            runtime.setCreatedUser(MARKER_UPDATED_BY);
        }
        runtime.setStatus(ActivityEvent.STATUS_ACTIVE);
        runtime.setRuntimeKind(ActivityMainEventRuntime.RUNTIME_KIND_MAIN_EVENT);
        runtime.setEventId(eventId);
        runtime.setOwnerId(eventId);
        runtime.setSubEventId(null);
        runtime.setTitle(safeText(room.getTitle()));
        runtime.setDescription(safeText(room.getSubtitle()));
        runtime.setTimeframe(safeText(room.getTimeframe()));
        runtime.setStartAtIso(safeText(room.getStartAtIso()));
        runtime.setEndAtIso(safeText(room.getEndAtIso()));
        runtime.setLocation(safeText(room.getLocation()));
        runtime.setCreatedByUserId(normalizeId(room.getCreatorUserId()));
        runtime.setUpdatedDate(nowIso);
        runtime.setUpdatedUser(MARKER_UPDATED_BY);
        activityMainEventRuntimeRepository.save(runtime);
    }

    private void notifyChangedRandomRoomAssignments(
            ActivityEvent sourceEvent,
            String assignmentScope,
            List<RandomRoomAssignment> changedRooms) {
        if (notificationOutboxService == null
                || changedRooms == null
                || changedRooms.isEmpty()) {
            return;
        }
        String parentEventId = normalizeId(sourceEvent == null ? null : sourceEvent.getSourceId());
        String parentEventTitle = firstNonBlank(
                sourceEvent == null ? null : sourceEvent.getTitle(),
                "your event");
        for (RandomRoomAssignment changedRoom : changedRooms) {
            ActivityEvent room = changedRoom == null ? null : changedRoom.room();
            String roomEventId = normalizeId(room == null ? null : room.getSourceId());
            List<String> recipientUserIds = normalizeUserIds(
                    changedRoom == null ? null : changedRoom.memberUserIds());
            if (!StringUtils.hasText(roomEventId) || recipientUserIds.isEmpty()) {
                continue;
            }
            boolean tournamentRoom = TOURNAMENT_ROOM_EVENT_TYPE.equals(normalizeId(room.getEventType()));
            String roomTitle = firstNonBlank(
                    room.getTitle(),
                    tournamentRoom ? "Tournament Group" : "Random Room");
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("eventId", roomEventId);
            payload.put("eventTitle", roomTitle);
            payload.put("eventScope", tournamentRoom
                    ? TOURNAMENT_ROOM_EVENT_TYPE
                    : RANDOM_ROOM_EVENT_TYPE);
            payload.put("parentEventId", parentEventId);
            payload.put("parentEventTitle", parentEventTitle);
            payload.put("assignmentScope", safeText(assignmentScope));
            payload.put("assignmentFingerprint", fingerprintUserIds(recipientUserIds));
            payload.put("senderName", RANDOM_ROOM_SYSTEM_NAME);

            notificationOutboxService.enqueue(new NotificationIntent(
                    NotificationJobs.RULE_EVENT_RANDOM_GROUPS,
                    OWNER_TYPE_EVENT,
                    roomEventId,
                    "random-room-participants",
                    recipientUserIds,
                    roomTitle + " is ready",
                    tournamentRoom
                            ? "Your tournament group for " + parentEventTitle + " is ready."
                            : "Your system-generated room for " + parentEventTitle + " is ready.",
                    DEFAULT_CLICK_URL,
                    firstNonBlank(
                            room.getImageUrl(),
                            tournamentRoom ? TOURNAMENT_ROOM_IMAGE_URL : RANDOM_ROOM_IMAGE_URL),
                    APP_BADGE_URL,
                    "event-random-room-" + roomEventId,
                    payload,
                    MARKER_UPDATED_BY));
        }
    }

    private String roomWelcomeMessage(ActivityEvent sourceEvent, boolean tournamentRoomPresentation) {
        if (!tournamentRoomPresentation) {
            return EventConversations.RANDOM_ROOM_WELCOME_MESSAGE;
        }
        String eventTitle = firstNonBlank(
                sourceEvent == null ? null : sourceEvent.getTitle(),
                "your tournament");
        return "Welcome to your tournament group for " + eventTitle
                + ". Use this chat to coordinate with your group and follow stage updates.";
    }

    private String roomWelcomeMessageType(boolean tournamentRoomPresentation) {
        return tournamentRoomPresentation
                ? EventConversations.TOURNAMENT_ROOM_WELCOME_MESSAGE_TYPE
                : EventConversations.RANDOM_ROOM_WELCOME_MESSAGE_TYPE;
    }

    private int incrementObservedQueries(AtomicInteger observedQueries) {
        return observedQueries == null ? 0 : observedQueries.incrementAndGet();
    }

    private void rememberPlanMarkerIfMissing(
            String wrapperType,
            String actionType,
            String ownerId,
            String scopeId,
            Collection<String> userIds) {
        String fingerprint = fingerprintUserIds(userIds);
        if (hasPlanMarker(wrapperType, actionType, ownerId, scopeId, fingerprint)) {
            return;
        }
        recordPlanMarker(wrapperType, actionType, ownerId, scopeId, userIds);
    }

    private boolean hasPlanMarker(
            String wrapperType,
            String actionType,
            String ownerId,
            String scopeId,
            String fingerprint) {
        if (!StringUtils.hasText(fingerprint)) {
            return false;
        }
        SchedulerPlanMarker marker = schedulerPlanMarkersRepository
                .findBySyncKey(buildPlanMarkerSyncKey(wrapperType, actionType, ownerId, scopeId))
                .orElse(null);
        return marker != null && fingerprint.equals(normalizeId(marker.getFingerprint()));
    }

    private void recordPlanMarker(
            String wrapperType,
            String actionType,
            String ownerId,
            String scopeId,
            Collection<String> userIds) {
        String syncKey = buildPlanMarkerSyncKey(wrapperType, actionType, ownerId, scopeId);
        List<String> normalizedUserIds = normalizeUserIds(userIds).stream().sorted().toList();
        String fingerprint = fingerprintUserIds(normalizedUserIds);
        SchedulerPlanMarker marker = schedulerPlanMarkersRepository.findBySyncKey(syncKey).orElseGet(SchedulerPlanMarker::new);
        if (fingerprint.equals(normalizeId(marker.getFingerprint())) && normalizedUserIds.equals(marker.getUserIds())) {
            return;
        }

        marker.setId(StringUtils.hasText(marker.getId()) ? marker.getId() : new ObjectId().toHexString());
        marker.setSyncKey(syncKey);
        marker.setWrapperType(normalizeId(wrapperType));
        marker.setActionType(normalizeId(actionType));
        marker.setOwnerId(normalizeId(ownerId));
        marker.setScopeId(normalizeId(scopeId));
        marker.setFingerprint(fingerprint);
        marker.setUserIds(normalizedUserIds);
        marker.setUpdatedDate(Instant.now().toString());
        marker.setUpdatedUser(MARKER_UPDATED_BY);
        schedulerPlanMarkersRepository.save(marker);
    }

    private Set<String> resolveAdvancingUserIds(EventLeaderboardStateDto state) {
        Set<String> advancingUserIds = new LinkedHashSet<>();
        if (state == null || state.groups() == null) {
            return advancingUserIds;
        }
        state.groups().stream()
                .filter(Objects::nonNull)
                .flatMap(group -> group.advancingMemberIds().stream())
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .forEach(advancingUserIds::add);
        return advancingUserIds;
    }

    private List<String> normalizeUserIds(Collection<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }
        // OPTIMIZATION: .distinct() uses a HashSet internally for O(1) lookups
        return userIds.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private List<String> mergeUserIds(Collection<String> left, Collection<String> right) {
        if (left == null) left = List.of();
        if (right == null) right = List.of();

        // OPTIMIZATION: LinkedHashSet guarantees O(1) inserts while preventing duplicates
        Set<String> merged = new LinkedHashSet<>(normalizeUserIds(left));
        merged.addAll(normalizeUserIds(right));

        return merged.stream().sorted().toList();
    }

    private String buildPlanMarkerSyncKey(String wrapperType, String actionType, String ownerId, String scopeId) {
        return String.join(":",
                "scheduler",
                normalizeId(wrapperType),
                normalizeId(actionType),
                normalizeId(ownerId),
                normalizeId(scopeId));
    }

    private String fingerprintUserIds(Collection<String> userIds) {
        String normalized = String.join("|", normalizeUserIds(userIds).stream().sorted().toList());
        return fingerprintText(normalized);
    }

    private String fingerprintAssignments(Collection<GeneratedEventPlan> plans) {
        if (plans == null || plans.isEmpty()) {
            return "";
        }
        List<String> normalizedAssignments = plans.stream()
                .filter(Objects::nonNull)
                .map(plan -> normalizeId(plan.seedId())
                        + "="
                        + String.join(",", normalizeUserIds(plan.memberUserIds()).stream().sorted().toList()))
                .sorted()
                .toList();
        return fingerprintText(String.join("|", normalizedAssignments));
    }

    private String fingerprintText(String normalized) {
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(normalized.getBytes(StandardCharsets.UTF_8));

            // OPTIMIZATION: Replaces the slow, memory-heavy String.format loop
            return java.util.HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Missing SHA-256 support for scheduler plan markers.", exception);
        }
    }

    private void logDiagnostic(String wrapperType, String ownerId, String scopeId, String message) {
        LOGGER.warn("[scheduler:{}] owner={} scope={} {}", normalizeId(wrapperType), normalizeId(ownerId), normalizeId(scopeId), message);
    }

    private Instant parseStageInstant(String value) {
        String text = safeText(value);
        if (!StringUtils.hasText(text)) {
            return null;
        }
        try {
            return Instant.parse(text);
        } catch (Exception ignored) {
            // Fall through to local date-time parsing because editor values are often offset-free.
        }
        try {
            return LocalDateTime.parse(text).atZone(ZoneId.systemDefault()).toInstant();
        } catch (Exception ignored) {
            return null;
        }
    }

    private String normalizeStageStatus(String status) {
        String normalized = safeText(status).toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case STAGE_STATUS_START_REVIEW, STAGE_STATUS_SCORE_REVIEW, STAGE_STATUS_FINALIZED, STAGE_STATUS_SUSPENDED, STAGE_STATUS_ERROR -> normalized;
            default -> STAGE_STATUS_ACTIVE;
        };
    }

    private boolean isStageAssignmentOpen(List<SubEventItem> stages, int stageIndex) {
        if (stages == null || stageIndex < 0 || stageIndex >= stages.size()) {
            return false;
        }
        String status = normalizeStageStatus(stages.get(stageIndex) == null ? null : stages.get(stageIndex).stageStatus());
        if (!STAGE_STATUS_ACTIVE.equals(status)) {
            return false;
        }
        if (stageIndex == 0) {
            return true;
        }
        String previousStatus = normalizeStageStatus(stages.get(stageIndex - 1) == null ? null : stages.get(stageIndex - 1).stageStatus());
        return STAGE_STATUS_FINALIZED.equals(previousStatus);
    }

    private boolean isStageStartAllowed(List<SubEventItem> stages, int stageIndex) {
        if (stages == null || stageIndex < 0 || stageIndex >= stages.size()) {
            return false;
        }
        if (stageIndex == 0) {
            return true;
        }
        String previousStatus = normalizeStageStatus(stages.get(stageIndex - 1) == null ? null : stages.get(stageIndex - 1).stageStatus());
        return STAGE_STATUS_FINALIZED.equals(previousStatus);
    }

    private boolean prefer(ActivityEvent next, ActivityEvent current) {
        if (Boolean.TRUE.equals(next.getPublished()) != Boolean.TRUE.equals(current.getPublished())) {
            return Boolean.TRUE.equals(next.getPublished());
        }
        return safeCount(next.getAcceptedMembers()) >= safeCount(current.getAcceptedMembers());
    }

    private int safeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private String resolveInviterUserId(ActivityEvent event) {
        return normalizeId(event == null ? null : event.getCreatorUserId());
    }

    private String canonicalGroupOwnerId(String eventId, String subEventId, String groupId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedGroupId = normalizeId(groupId);
        if (!StringUtils.hasText(normalizedGroupId)) {
            return "";
        }
        if (StringUtils.hasText(normalizedEventId)
                && (normalizedGroupId.equals(normalizedEventId)
                        || normalizedGroupId.startsWith(normalizedEventId + ":"))) {
            return normalizedGroupId;
        }
        return StringUtils.hasText(normalizedEventId) && StringUtils.hasText(normalizedSubEventId)
                ? normalizedEventId + ":" + normalizedSubEventId + ":" + normalizedGroupId
                : normalizedGroupId;
    }

    private String randomRoomEventId(String eventId, String subEventId, String groupId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedGroupId = normalizeId(groupId);
        if (!StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(normalizedGroupId)) {
            throw new IllegalStateException("Unable to build a stable random-room identity.");
        }
        return String.join(
                ":",
                RANDOM_ROOM_EVENT_TYPE,
                normalizedEventId,
                normalizedSubEventId,
                normalizedGroupId);
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstNonBlank(String... values) {
        if (values == null) {
            return "";
        }
        for (String value : values) {
            String text = safeText(value);
            if (StringUtils.hasText(text)) {
                return text;
            }
        }
        return "";
    }

    private List<SubEventItem> safeSubEvents(ActivityEvent event) {
        return subEventsMapper.runtimeStages(event);
    }

    private record GroupAssignmentTarget(
            String groupId,
            String memberOwnerId,
            Range range,
            List<String> lockedUserIds,
            int roomOrdinal) {
    }

    private record RandomRoomAssignment(
            ActivityEvent room,
            List<String> memberUserIds) {
    }

    private record ScorePlanRunResult(
            List<EventLeaderboardStateDto> states,
            int changedGroupCount,
            int processedResultRevisionCount) {
    }
}
