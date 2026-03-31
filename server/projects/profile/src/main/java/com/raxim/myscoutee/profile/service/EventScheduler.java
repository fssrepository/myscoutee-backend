package com.raxim.myscoutee.profile.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

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
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.SchedulerPlanMarker;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.SchedulerPlanMarkersRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class EventScheduler {
    private static final Logger LOGGER = LoggerFactory.getLogger(EventScheduler.class);
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_GROUP = "group";
    private static final String RATE_SOURCE_ACTIVITY = "activity-rate";
    private static final String MARKER_ACTION_GROUP_MEMBERS = "group-members";
    private static final String MARKER_ACTION_INVITE_BATCH = "invite-batch";
    private static final String MARKER_UPDATED_BY = "scheduler";

    private final UsersRepository usersRepository;
    private final UserRatesRepository userRatesRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final SchedulerPlanMarkersRepository schedulerPlanMarkersRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    private final EventInviteNotificationService eventInviteNotificationService;
    private final Algo algo = new Algo();
    private final EventGeneratorByRandom eventGeneratorByRandom = new EventGeneratorByRandom();
    private final EventGeneratorByPriority eventGeneratorByPriority = new EventGeneratorByPriority();

    @Value("${events.scheduler.enabled:false}")
    private boolean schedulerEnabled;

    public EventScheduler(
            UsersRepository usersRepository,
            UserRatesRepository userRatesRepository,
            ActivityEventsRepository activityEventsRepository,
            SchedulerPlanMarkersRepository schedulerPlanMarkersRepository,
            ActivitiesMembersService activitiesMembersService,
            ActivitiesEventLeaderboardService activitiesEventLeaderboardService,
            EventInviteNotificationService eventInviteNotificationService) {
        this.usersRepository = usersRepository;
        this.userRatesRepository = userRatesRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.schedulerPlanMarkersRepository = schedulerPlanMarkersRepository;
        this.activitiesMembersService = activitiesMembersService;
        this.activitiesEventLeaderboardService = activitiesEventLeaderboardService;
        this.eventInviteNotificationService = eventInviteNotificationService;
    }

    @Scheduled(fixedDelayString = "${events.scheduler.poll-delay-ms:900000}")
    public void runScheduledWrappers() {
        if (!schedulerEnabled) {
            return;
        }

        generateRandomPlans();
        generatePriorityPlans();
        generateScorePlans();
    }

    public List<GeneratedEventPlan> generateRandomPlans() {
        List<ActivityEvent> events = resolveCanonicalEvents();
        
        // --- PHASE 1: PRE-FETCH (Sequential) ---
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsByEventId = new LinkedHashMap<>();
        Set<String> requiredUserIds = new LinkedHashSet<>();
        
        for (ActivityEvent event : events) {
            if (event == null || !Boolean.TRUE.equals(event.getPublished()) || safeSubEvents(event).isEmpty()) {
                continue;
            }
            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, eventId);
            if (snapshot == null || snapshot.acceptedMembers() < 2) {
                continue;
            }
            snapshotsByEventId.put(eventId, snapshot);
            requiredUserIds.addAll(snapshot.acceptedMemberUserIds());
        }

        // Single DB/Graph construction
        FGraph graph = buildGraphSnapshot(requiredUserIds);
        if (graph.getNodes().isEmpty()) {
            return List.of();
        }

        // THREAD SAFETY: Synchronized list for parallel addition
        List<GeneratedEventPlan> plans = Collections.synchronizedList(new ArrayList<>());

        // --- PHASE 2: PARALLEL EXECUTION ---
        events.parallelStream().forEach(event -> {
            if (event == null || !Boolean.TRUE.equals(event.getPublished())) return; // Use return instead of continue in lambda

            String eventId = normalizeId(event.getSourceId());
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByEventId.get(eventId);
            if (snapshot == null) return;

            Set<String> acceptedUserIds = new LinkedHashSet<>(snapshot.acceptedMemberUserIds());
            FGraph eventGraph = graph.filter(acceptedUserIds, Set.of(), 0d);
            
            if (eventGraph.getNodes().isEmpty()) return;

            // Standard for-loop inside the lambda, so we use 'continue' here
            for (SubEventFormItemDto subEvent : safeSubEvents(event)) {
                String subEventId = normalizeId(subEvent == null ? null : subEvent.id());
                if (!StringUtils.hasText(subEventId)) continue; 

                List<GroupAssignmentTarget> targets = resolveGroupAssignmentTargets(
                        eventId, subEventId, subEvent, acceptedUserIds, true, "random");
                        
                if (targets.isEmpty()) continue;
                
                List<GeneratedEventPlan> assignedMembers = assignMembersToTargets(
                        event, eventGraph, acceptedUserIds, targets, "random", "random:" + eventId + ":" + subEventId);
                        
                // Thread-safe addition
                plans.addAll(assignedMembers);
            }
        });
        
        return plans;
    }

public List<InviteBatchPlan> generatePriorityPlans() {
        List<ActivityEvent> events = resolveCanonicalEvents(activityEventsRepository.findByAutoInviterTrue());
        
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
        events.parallelStream().forEach(event -> {
            if (event == null || !Boolean.TRUE.equals(event.getAutoInviter()) || !Boolean.TRUE.equals(event.getPublished())) return;
            
            String eventId = normalizeId(event.getSourceId());
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByEventId.get(eventId);
            
            int activeMembers = snapshot == null ? 0 : snapshot.acceptedMembers() + snapshot.pendingMembers();
            int openSpots = Math.max(0, safeCount(event.getCapacityTotal()) - activeMembers);
            
            if (!StringUtils.hasText(eventId) || openSpots <= 0) return;

            Set<String> lockedUserIds = new LinkedHashSet<>();
            if (snapshot != null) {
                lockedUserIds.addAll(snapshot.acceptedMemberUserIds());
                lockedUserIds.addAll(snapshot.pendingMemberUserIds());
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
        });
        
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
        events.parallelStream().forEach(event -> {
            if (event == null || event.getSubEvents() == null) return; // 'return' replaces 'continue' in lambdas
            
            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) return;
            
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = snapshotsByEventId.get(eventId);
            
            FGraph eventGraph = snapshot == null || snapshot.acceptedMemberUserIds().isEmpty()
                    ? new FGraph()
                    : globalGraph.filter(new LinkedHashSet<>(snapshot.acceptedMemberUserIds()), Set.of(), 0d);

            List<SubEventFormItemDto> subEvents = safeSubEvents(event);
            for (int index = 0; index < subEvents.size(); index += 1) {
                SubEventFormItemDto subEvent = subEvents.get(index);
                if (subEvent == null || !StringUtils.hasText(normalizeId(subEvent.id()))) continue; // We are inside a standard for-loop here, so continue is fine
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

                Set<String> advancingUserIds = resolveAdvancingUserIds(state);
                if (advancingUserIds.isEmpty()) continue;

                if (eventGraph.getNodes().isEmpty()) {
                    eventGraph = globalGraph.filter(advancingUserIds, Set.of(), 0d);
                }

                SubEventFormItemDto nextSubEvent = subEvents.get(index + 1);
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
        }); // End of parallel stream

        return states;
    }

    private FGraph buildGraphSnapshot(Set<String> requiredUserIds) {
        List<Edge> edges = new ArrayList<>();
        Set<String> discoveredUserIds = new LinkedHashSet<>();
        if (requiredUserIds != null) {
            requiredUserIds.stream()
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .forEach(discoveredUserIds::add);
        }

        List<UserRate> rates = resolveRelevantRates(discoveredUserIds);
        for (UserRate rate : rates) {
            if (rate == null) {
                continue;
            }
            collectRateUserIds(discoveredUserIds, rate);
        }

        Map<String, Node> nodesByUserId = new LinkedHashMap<>();
        for (Users user : usersRepository.findAllById(discoveredUserIds)) {
            if (user == null || !StringUtils.hasText(normalizeId(user.getId()))) {
                continue;
            }
            nodesByUserId.put(normalizeId(user.getId()), new Node(normalizeId(user.getId()), safeText(user.getGender())));
        }
        for (String userId : discoveredUserIds) {
            nodesByUserId.putIfAbsent(userId, new Node(userId));
        }

        for (UserRate rate : rates) {
            if (rate == null) {
                continue;
            }
            addActivityRateEdges(edges, nodesByUserId, rate);
        }
        return new FGraph(nodesByUserId, edges);
    }

    private List<UserRate> resolveRelevantRates(Set<String> requiredUserIds) {
        List<String> normalizedUserIds = requiredUserIds == null
                ? List.of()
                : requiredUserIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
        if (normalizedUserIds.isEmpty()) {
            return userRatesRepository.findBySource(RATE_SOURCE_ACTIVITY);
        }
        return userRatesRepository.findRelevantBySourceAndUserIds(RATE_SOURCE_ACTIVITY, normalizedUserIds);
    }

    private void collectRateUserIds(Set<String> userIds, UserRate rate) {
        String ownerUserId = normalizeId(rate == null ? null : rate.getOwnerUserId());
        String relatedUserId = normalizeId(rate == null ? null : rate.getRelatedUserId());
        String secondaryRelatedUserId = normalizeId(rate == null ? null : rate.getSecondaryRelatedUserId());
        if (StringUtils.hasText(ownerUserId)) {
            userIds.add(ownerUserId);
        }
        if (StringUtils.hasText(relatedUserId)) {
            userIds.add(relatedUserId);
        }
        if (StringUtils.hasText(secondaryRelatedUserId)) {
            userIds.add(secondaryRelatedUserId);
        }
    }

    private void addActivityRateEdges(List<Edge> edges, Map<String, Node> nodesByUserId, UserRate rate) {
        String ownerUserId = normalizeId(rate.getOwnerUserId());
        String relatedUserId = normalizeId(rate.getRelatedUserId());
        String secondaryRelatedUserId = normalizeId(rate.getSecondaryRelatedUserId());
        String mode = normalizeId(rate.getMode()).toLowerCase();
        double weight = rate.getAffinityScore() == null ? 0d : Math.max(0d, rate.getAffinityScore());

        if ("pair".equals(mode) && StringUtils.hasText(relatedUserId) && StringUtils.hasText(secondaryRelatedUserId)) {
            addEdge(edges, nodesByUserId, relatedUserId, secondaryRelatedUserId, weight);
        }
        if (StringUtils.hasText(ownerUserId) && StringUtils.hasText(relatedUserId)) {
            addEdge(edges, nodesByUserId, ownerUserId, relatedUserId, weight);
        }
        if (StringUtils.hasText(ownerUserId) && StringUtils.hasText(secondaryRelatedUserId)) {
            addEdge(edges, nodesByUserId, ownerUserId, secondaryRelatedUserId, weight);
        }
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

    private List<GroupAssignmentTarget> resolveGroupAssignmentTargets(
            String eventId,
            String subEventId,
            SubEventFormItemDto subEvent,
            Collection<String> eligibleUserIds,
            boolean preserveAnchors,
            String wrapperType) {
        List<SubEventGroupItemDto> groups = subEvent != null && subEvent.groups() != null && !subEvent.groups().isEmpty()
                ? subEvent.groups().stream().filter(Objects::nonNull).toList()
                : activitiesEventLeaderboardService.materializeGeneratedGroups(eventId, subEventId);
        if (groups.isEmpty()) {
            logDiagnostic(wrapperType, eventId, subEventId, "No group targets are available for materialization.");
            return List.of();
        }

        Set<String> eligibleUserIdSet = new LinkedHashSet<>(normalizeUserIds(eligibleUserIds));
        List<GroupAssignmentTarget> targets = new ArrayList<>();
        for (SubEventGroupItemDto group : groups) {
            String groupId = normalizeId(group == null ? null : group.id());
            Range groupRange = resolveGroupRange(subEvent, group);
            if (!StringUtils.hasText(groupId) || groupRange == null) {
                logDiagnostic(wrapperType, eventId, subEventId, "Skipping group materialization because the group config is incomplete.");
                return List.of();
            }
            List<String> lockedUserIds = List.of();
            if (preserveAnchors) {
                ActivitiesMembersService.OwnerMembersSnapshot snapshot = activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_GROUP, groupId);
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

    private Range resolveGroupRange(SubEventFormItemDto subEvent, SubEventGroupItemDto group) {
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
        for (GeneratedEventPlan plannedGroup : plannedGroups) {
            List<String> normalizedPlannedUserIds = normalizeUserIds(plannedGroup.memberUserIds());
            ActivitiesMembersService.OwnerMembersSnapshot groupSnapshot = activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_GROUP, plannedGroup.seedId());
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

    private boolean prefer(ActivityEvent next, ActivityEvent current) {
        if (Boolean.TRUE.equals(next.getIsHosting()) != Boolean.TRUE.equals(current.getIsHosting())) {
            return Boolean.TRUE.equals(next.getIsHosting());
        }
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

    private List<SubEventFormItemDto> safeSubEvents(ActivityEvent event) {
        return event == null || event.getSubEvents() == null ? List.of() : event.getSubEvents();
    }

    private record GroupAssignmentTarget(
            String groupId,
            Range range,
            List<String> lockedUserIds) {
    }
}
