package com.raxim.myscoutee.profile.service;

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

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.algo.Algo;
import com.raxim.myscoutee.algo.dto.Edge;
import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Node;
import com.raxim.myscoutee.algo.dto.Range;
import com.raxim.myscoutee.algo.gen.EventGeneratorByPriority;
import com.raxim.myscoutee.algo.gen.EventGeneratorByRandom;
import com.raxim.myscoutee.algo.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.PriorityGeneratorRequest;
import com.raxim.myscoutee.algo.gen.GeneratorModels.RandomGroupTarget;
import com.raxim.myscoutee.algo.gen.GeneratorModels.RandomTargetedGeneratorRequest;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.SchedulerPlanMarker;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.SchedulerPlanMarkersRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@Service
public class EventScheduler {
    private static final Logger LOGGER = LoggerFactory.getLogger(EventScheduler.class);
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_GROUP = "group";
    private static final String MARKER_ACTION_GROUP_MEMBERS = "group-members";
    private static final String MARKER_ACTION_INVITE_BATCH = "invite-batch";
    private static final String MARKER_UPDATED_BY = "scheduler";
    private static final String STAGE_STATUS_ACTIVE = "A";
    private static final String STAGE_STATUS_START_REVIEW = "RS";
    private static final String STAGE_STATUS_SCORE_REVIEW = "SR";
    private static final String STAGE_STATUS_FINALIZED = "F";
    private static final String STAGE_STATUS_SUSPENDED = "S";
    private static final String MEMBER_STATUS_DISQUALIFIED = "disqualified";

    private final UsersRepository usersRepository;
    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final SchedulerPlanMarkersRepository schedulerPlanMarkersRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    private final EventInviteNotificationService eventInviteNotificationService;
    private final EventCounterExpiryService eventCounterExpiryService;
    private final NotificationRuleRegistryService notificationRuleRegistryService;
    private final PlatformParametersService platformParametersService;
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
            UsersRepository usersRepository,
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            ActivityEventsRepository activityEventsRepository,
            SchedulerPlanMarkersRepository schedulerPlanMarkersRepository,
            ActivitiesMembersService activitiesMembersService,
            ActivitiesEventLeaderboardService activitiesEventLeaderboardService,
            EventInviteNotificationService eventInviteNotificationService,
            EventCounterExpiryService eventCounterExpiryService,
            NotificationRuleRegistryService notificationRuleRegistryService,
            PlatformParametersService platformParametersService) {
        this.usersRepository = usersRepository;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.schedulerPlanMarkersRepository = schedulerPlanMarkersRepository;
        this.activitiesMembersService = activitiesMembersService;
        this.activitiesEventLeaderboardService = activitiesEventLeaderboardService;
        this.eventInviteNotificationService = eventInviteNotificationService;
        this.eventCounterExpiryService = eventCounterExpiryService;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
        this.platformParametersService = platformParametersService;
    }

    @Scheduled(fixedDelayString = "${events.scheduler.check-delay-ms:60000}")
    public void runScheduledWrappers() {
        if (!schedulerEnabled && !notificationRuleRegistryService.hasEnabledScheduledEventRule()) {
            return;
        }

        Instant now = Instant.now();
        if (schedulerEnabled && claimStageSchedulerRun(now)) {
            int startReviewCount = moveTournamentFirstStagesToStartReview(now);
            if (startReviewCount > 0) {
                LOGGER.info("Moved {} tournament first stage(s) to start review.", startReviewCount);
            }
            int reviewCount = closeEndedTournamentStagesForReview(now);
            if (reviewCount > 0) {
                LOGGER.info("Moved {} tournament stage(s) to score review.", reviewCount);
            }
        }
        if (notificationRuleRegistryService.shouldRunScheduledRule(NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS, now)) {
            notificationRuleRegistryService.beginRun(
                    NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS,
                    "Scheduled random grouping started.",
                    MARKER_UPDATED_BY);
            List<GeneratedEventPlan> plans = generateRandomPlans();
            notificationRuleRegistryService.recordRun(
                    NotificationRuleRegistryService.RULE_EVENT_RANDOM_GROUPS,
                    plans.size(),
                    "completed",
                    "Generated random event group plans.",
                    MARKER_UPDATED_BY);
        }
        if (notificationRuleRegistryService.shouldRunScheduledRule(NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY, now)) {
            int expiredCount = eventCounterExpiryService.runExpiryPassNow();
            if (expiredCount > 0) {
                LOGGER.info("Expired {} event counter source(s).", expiredCount);
            }
        }
    }

    @Scheduled(fixedDelayString = "${events.waitlist.inviter-check-delay-ms:60000}")
    public void runWaitlistInviter() {
        if (!waitlistInviterEnabled) {
            return;
        }
        if (!claimAutoInviterRun(Instant.now())) {
            return;
        }
        int invitedCount = activitiesMembersService.sweepEventWaitlists();
        if (invitedCount > 0) {
            LOGGER.info("Promoted {} event wait-list member(s) to invitations.", invitedCount);
        }
        List<InviteBatchPlan> autoInvitePlans = generatePriorityPlans();
        int autoInvitedCount = autoInvitePlans.stream()
                .mapToInt(plan -> plan == null || plan.invitedUserIds() == null ? 0 : plan.invitedUserIds().size())
                .sum();
        if (autoInvitedCount > 0) {
            LOGGER.info("Auto-invited {} event candidate(s) across {} event(s).", autoInvitedCount, autoInvitePlans.size());
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

        for (ActivityEvent event : activityEventsRepository.findAll()) {
            if (!shouldReviewTournamentStages(event)) {
                continue;
            }
            List<SubEventItem> currentSubEvents = safeSubEvents(event);
            if (currentSubEvents.isEmpty()) {
                continue;
            }
            List<SubEventItem> updatedSubEvents = new ArrayList<>(currentSubEvents.size());
            boolean changed = false;
            for (SubEventItem subEvent : currentSubEvents) {
                SubEventItem updated = closeStageForReviewIfDue(subEvent, effectiveNow, nowIso);
                updatedSubEvents.add(updated);
                if (updated != subEvent) {
                    changed = true;
                    changedStageKeys.add(normalizeId(event.getSourceId()) + ":" + normalizeId(subEvent.id()));
                }
            }
            if (changed) {
                event.setSubEvents(updatedSubEvents);
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

    int moveTournamentFirstStagesToStartReview(Instant now) {
        Instant effectiveNow = now == null ? Instant.now() : now;
        String nowIso = effectiveNow.toString();
        List<ActivityEvent> changedRecords = new ArrayList<>();
        Set<String> changedStageKeys = new LinkedHashSet<>();

        for (ActivityEvent event : activityEventsRepository.findAll()) {
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
                changed = true;
                changedStageKeys.add(normalizeId(event.getSourceId()) + ":" + normalizeId(stage.id()));
            }
            if (changed) {
                event.setSubEvents(updatedSubEvents);
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
                && ((subEvent.groups() != null && !subEvent.groups().isEmpty())
                        || safeCount(subEvent.tournamentGroupCount()) > 0);
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
        return new SubEventItem(
                subEvent.id(),
                subEvent.name(),
                subEvent.description(),
                subEvent.startAt(),
                subEvent.endAt(),
                subEvent.location(),
                subEvent.createdByUserId(),
                subEvent.groups(),
                subEvent.tournamentGroupCount(),
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
                stageFinalizedByUserId);
    }

    public List<GeneratedEventPlan> generateRandomPlans() {
        return generateRandomPlans(null, null);
    }

    public List<GeneratedEventPlan> generateRandomPlans(Consumer<RandomPlanProgress> progressConsumer) {
        return generateRandomPlans(progressConsumer, null);
    }

    public List<GeneratedEventPlan> generateRandomPlansForEvents(Collection<String> sourceIds) {
        return generateRandomPlans(null, sourceIds);
    }

    private List<GeneratedEventPlan> generateRandomPlans(Consumer<RandomPlanProgress> progressConsumer, Collection<String> sourceIds) {
        Set<String> sourceIdFilter = new LinkedHashSet<>(normalizeUserIds(sourceIds));
        List<ActivityEvent> eventRecords = activityEventsRepository.findAll();
        List<ActivityEvent> events = resolveCanonicalEvents(eventRecords);
        Map<String, List<ActivityEvent>> eventDocumentsById = eventDocumentsBySourceId(eventRecords);
        AtomicInteger observedQueries = new AtomicInteger(1);
        publishRandomProgress(progressConsumer, 0, 0, events.size(), 0, observedQueries.get(), "Loaded " + events.size() + " event record(s).");
        
        // --- PHASE 1: PRE-FETCH (Sequential) ---
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByEventId = new LinkedHashMap<>();
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
            int queryCount = observedQueries.get();
            if (snapshot == null || snapshot.acceptedMembers() < 2) {
                publishRandomProgress(progressConsumer, 6, snapshotsByEventId.size(), events.size(), requiredUserIds.size(), queryCount,
                        "Queried " + queryCount + " backend lookup(s); event has no eligible accepted members.");
                continue;
            }
            snapshotsByEventId.put(eventId, snapshot);
            requiredUserIds.addAll(snapshot.acceptedMemberUserIds());
            publishRandomProgress(progressConsumer, 10, snapshotsByEventId.size(), events.size(), requiredUserIds.size(), queryCount,
                    "Queried " + queryCount + " backend lookup(s); found " + requiredUserIds.size() + " candidate user(s).");
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

        // Single DB/Graph construction
        FGraph graph = buildGraphSnapshot(requiredUserIds, observedQueries);
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
            FGraph eventGraph = graph.filter(acceptedUserIds, Set.of(), 0d);
            
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

                List<GroupAssignmentTarget> targets = resolveGroupAssignmentTargets(
                        eventId, subEventId, subEvent, acceptedUserIds, true, "random", observedQueries, eventDocumentsById);
                        
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
                        event, eventGraph, acceptedUserIds, targets, "random", "random:" + eventId + ":" + subEventId, observedQueries);
                        
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
        List<ActivityEvent> events = resolveCanonicalEvents(activityEventsRepository.findByAutoInviterTrue());
        if (!requestedSourceIds.isEmpty()) {
            events = events.stream()
                    .filter(event -> requestedSourceIds.contains(normalizeId(event == null ? null : event.getSourceId())))
                    .toList();
        }
        
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

        // Single DB/Graph construction
        FGraph graph = buildGraphSnapshot(requiredUserIds);
        if (graph.getNodes().isEmpty()) {
            return List.of();
        }

        // THREAD SAFETY: Synchronized list for parallel addition
        List<InviteBatchPlan> plans = Collections.synchronizedList(new ArrayList<>());

        // --- PHASE 2: PARALLEL EXECUTION ---
        MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
        events.parallelStream().forEach(event -> withMongoSessionMode(sessionMode, () -> {
            if (event == null || !Boolean.TRUE.equals(event.getAutoInviter()) || !Boolean.TRUE.equals(event.getPublished())) return;
            
            String eventId = normalizeId(event.getSourceId());
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByEventId.get(eventId);
            
            int acceptedMembers = snapshot == null ? 0 : snapshot.acceptedMembers();
            int openSpots = Math.max(0, safeCount(event.getCapacityTotal()) - acceptedMembers);
            
            if (!StringUtils.hasText(eventId) || openSpots <= 0) return;

            Set<String> lockedUserIds = new LinkedHashSet<>();
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
            
            Set<String> candidateUserIds = new LinkedHashSet<>(graph.getNodes().keySet());
            candidateUserIds.removeAll(lockedUserIds);
            candidateUserIds.remove(normalizeId(event.getCreatorUserId()));

            InviteBatchPlan plan = eventGeneratorByPriority.generate(new PriorityGeneratorRequest(
                    eventId, graph, candidateUserIds, lockedUserIds, Range.of(openSpots, openSpots), List.of(), true, 0d));
                    
            if (plan.invitedUserIds().isEmpty()) return;

            // These DB writes now execute concurrently across cores
            List<String> persistedInviteUserIds = activitiesMembersService.inviteUsers(
                    eventId, resolveInviterUserId(event), plan.invitedUserIds(), event);
                    
            if (!persistedInviteUserIds.isEmpty()) {
                recordPlanMarker("priority", MARKER_ACTION_INVITE_BATCH, eventId, eventId, persistedInviteUserIds);
                eventInviteNotificationService.notifyInvitees(event, persistedInviteUserIds);
                
                // Thread-safe addition
                plans.add(new InviteBatchPlan(eventId, persistedInviteUserIds));
            }
        }));
        
        return plans;
    }

    public List<EventLeaderboardStateDto> generateScorePlans() {
        // THREAD SAFETY: We must use a synchronized list because multiple CPU threads will add to this simultaneously
        List<EventLeaderboardStateDto> states = Collections.synchronizedList(new ArrayList<>());
        List<ActivityEvent> events = resolveCanonicalEvents();
        
        // --- PHASE 1: PRE-FETCH (Runs Sequentially) ---
        // Gather all users and snapshots up front to eliminate N+1 database queries
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByEventId = new LinkedHashMap<>();
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
        }
        
        FGraph globalGraph = allRequiredUserIds.isEmpty() ? new FGraph() : buildGraphSnapshot(allRequiredUserIds);

        // --- PHASE 2: PARALLEL EXECUTION ---
        // Process every event concurrently across all available CPU cores!
        MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
        events.parallelStream().forEach(event -> withMongoSessionMode(sessionMode, () -> {
            if (event == null || event.getSubEvents() == null) return; // 'return' replaces 'continue' in lambdas
            
            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) return;
            
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByEventId.get(eventId);
            
            FGraph eventGraph = snapshot == null || snapshot.acceptedMemberUserIds().isEmpty()
                    ? new FGraph()
                    : globalGraph.filter(new LinkedHashSet<>(snapshot.acceptedMemberUserIds()), Set.of(), 0d);

            List<SubEventItem> subEvents = safeSubEvents(event);
            for (int index = 0; index < subEvents.size(); index += 1) {
                SubEventItem subEvent = subEvents.get(index);
                if (subEvent == null || !StringUtils.hasText(normalizeId(subEvent.id()))) continue; // We are inside a standard for-loop here, so continue is fine
                String stageStatus = normalizeStageStatus(subEvent.stageStatus());
                if (STAGE_STATUS_START_REVIEW.equals(stageStatus) || STAGE_STATUS_SUSPENDED.equals(stageStatus)) {
                    continue;
                }
                if (!(subEvent.groups() != null && !subEvent.groups().isEmpty() || safeCount(subEvent.tournamentGroupCount()) > 0)) {
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
                if (advancingUserIds.isEmpty()) continue;

                if (eventGraph.getNodes().isEmpty()) {
                    eventGraph = globalGraph.filter(advancingUserIds, Set.of(), 0d);
                }

                SubEventItem nextSubEvent = subEvents.get(index + 1);
                String nextSubEventId = normalizeId(nextSubEvent == null ? null : nextSubEvent.id());
                if (!StringUtils.hasText(nextSubEventId)) {
                    logDiagnostic("score", eventId, subEventId, "Skipping next-stage materialization because the next subevent is missing an id.");
                    continue;
                }

                List<GroupAssignmentTarget> nextTargets = resolveGroupAssignmentTargets(
                        eventId, nextSubEventId, nextSubEvent, advancingUserIds, true, "score");
                
                if (nextTargets.isEmpty()) continue;

                assignMembersToTargets(
                        event, eventGraph, advancingUserIds, nextTargets, "score", 
                        "score:" + eventId + ":" + subEventId + "->" + nextSubEventId);
            }
        })); // End of parallel stream

        return states;
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

        List<UserAffinityEdge> affinityEdges = resolveRelevantEdges(discoveredUserIds);
        incrementObservedQueries(observedQueries);
        for (UserAffinityEdge edge : affinityEdges) {
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

        for (UserAffinityEdge edge : affinityEdges) {
            if (edge == null) {
                continue;
            }
            addUserAffinityEdge(edges, nodesByUserId, edge);
        }
        return new FGraph(nodesByUserId, edges);
    }

    private List<UserAffinityEdge> resolveRelevantEdges(Set<String> requiredUserIds) {
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

    private void collectAffinityEdgeUserIds(Set<String> userIds, UserAffinityEdge edge) {
        String leftUserId = normalizeId(edge == null ? null : edge.getLeftUserId());
        String rightUserId = normalizeId(edge == null ? null : edge.getRightUserId());
        if (StringUtils.hasText(leftUserId)) {
            userIds.add(leftUserId);
        }
        if (StringUtils.hasText(rightUserId)) {
            userIds.add(rightUserId);
        }
    }

    private void addUserAffinityEdge(List<Edge> edges, Map<String, Node> nodesByUserId, UserAffinityEdge affinityEdge) {
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
        return resolveCanonicalEvents(activityEventsRepository.findAll());
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
        List<SubEventGroupItemDto> groups = subEvent != null && subEvent.groups() != null && !subEvent.groups().isEmpty()
                ? subEvent.groups().stream().filter(Objects::nonNull).toList()
                : eventDocuments == null
                        ? activitiesEventLeaderboardService.materializeGeneratedGroups(eventId, subEventId)
                        : activitiesEventLeaderboardService.materializeGeneratedGroups(eventId, subEventId, eventDocuments);
        if ((subEvent == null || subEvent.groups() == null || subEvent.groups().isEmpty()) && eventDocuments == null) {
            incrementObservedQueries(observedQueries);
        }
        if (groups.isEmpty()) {
            logDiagnostic(wrapperType, eventId, subEventId, "No group targets are available for materialization.");
            return List.of();
        }

        Set<String> eligibleUserIdSet = new LinkedHashSet<>(normalizeUserIds(eligibleUserIds));
        List<GroupAssignmentTarget> targets = new ArrayList<>();
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByGroupId = preserveAnchors
                ? activitiesMembersService.buildBatchOwnerSnapshots(OWNER_TYPE_GROUP, groups.stream()
                        .map(group -> normalizeId(group == null ? null : group.id()))
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
                ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByGroupId.get(groupId);
                lockedUserIds = snapshot == null
                        ? List.of()
                        : snapshot.acceptedMemberUserIds().stream()
                                .map(this::normalizeId)
                                .filter(eligibleUserIdSet::contains)
                                .distinct()
                                .toList();
            }
            targets.add(new GroupAssignmentTarget(groupId, groupRange, lockedUserIds));
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

    private boolean hasSameAcceptedMembers(ActivitiesMembersService.OwnerMembersSnapshot snapshot, List<String> plannedUserIds) {
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
        return currentUserIds.equals(normalizedPlannedUserIds);
    }

    private List<GeneratedEventPlan> assignMembersToTargets(
            ActivityEvent event,
            FGraph graph,
            Collection<String> poolUserIds,
            List<GroupAssignmentTarget> targets,
            String wrapperType,
            String context) {
        return assignMembersToTargets(event, graph, poolUserIds, targets, wrapperType, context, null);
    }

    private List<GeneratedEventPlan> assignMembersToTargets(
            ActivityEvent event,
            FGraph graph,
            Collection<String> poolUserIds,
            List<GroupAssignmentTarget> targets,
            String wrapperType,
            String context,
            AtomicInteger observedQueries) {
        Set<String> normalizedPoolUserIds = new LinkedHashSet<>(normalizeUserIds(poolUserIds));
        normalizedPoolUserIds.retainAll(graph.getNodes().keySet());
        if (normalizedPoolUserIds.isEmpty() || targets.isEmpty()) {
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
            normalizedTargets.add(new GroupAssignmentTarget(target.groupId(), target.range(), dedupedLockedUserIds));
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
            if (fillUserIds.size() < openMin) {
                logDiagnostic("random", target.groupId(), context, "Unable to fill anchored group to its minimum capacity.");
            } else {
                remainingUserIds.removeAll(fillUserIds);
            }
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
            } else {
                plannedGroups.addAll(generatedPlans);
            }
        }

        List<GeneratedEventPlan> syncedGroups = new ArrayList<>();
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByPlannedGroupId =
                activitiesMembersService.buildBatchOwnerSnapshots(OWNER_TYPE_GROUP, plannedGroups.stream()
                        .map(GeneratedEventPlan::seedId)
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
            ActivitiesMembersService.OwnerMembersSnapshot groupSnapshot = snapshotsByPlannedGroupId.get(normalizeId(plannedGroup.seedId()));
            if (hasSameAcceptedMembers(groupSnapshot, normalizedPlannedUserIds)) {
                rememberPlanMarkerIfMissing(
                        wrapperType,
                        MARKER_ACTION_GROUP_MEMBERS,
                        plannedGroup.seedId(),
                        context,
                        normalizedPlannedUserIds);
                continue;
            }
            List<String> syncedUserIds = activitiesMembersService.syncGroupMembers(
                    plannedGroup.seedId(),
                    resolveInviterUserId(event),
                    normalizedPlannedUserIds);
            incrementObservedQueries(observedQueries);
            if (!syncedUserIds.isEmpty()) {
                recordPlanMarker(
                        wrapperType,
                        MARKER_ACTION_GROUP_MEMBERS,
                        plannedGroup.seedId(),
                        context,
                        syncedUserIds);
                syncedGroups.add(new GeneratedEventPlan(plannedGroup.seedId(), syncedUserIds));
            }
        }
        return syncedGroups;
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
            case STAGE_STATUS_START_REVIEW, STAGE_STATUS_SCORE_REVIEW, STAGE_STATUS_FINALIZED, STAGE_STATUS_SUSPENDED -> normalized;
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

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private List<SubEventItem> safeSubEvents(ActivityEvent event) {
        return event == null || event.getSubEvents() == null ? List.of() : event.getSubEvents();
    }

    private record GroupAssignmentTarget(
            String groupId,
            Range range,
            List<String> lockedUserIds) {
    }
}
