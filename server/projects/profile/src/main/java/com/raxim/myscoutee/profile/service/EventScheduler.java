package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.algo.dto.Edge;
import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Node;
import com.raxim.myscoutee.algo.dto.Range;
import com.raxim.myscoutee.algo.gen.EventGeneratorByPriority;
import com.raxim.myscoutee.algo.gen.EventGeneratorByRandom;
import com.raxim.myscoutee.algo.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.PriorityGeneratorRequest;
import com.raxim.myscoutee.algo.gen.GeneratorModels.RandomGeneratorRequest;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class EventScheduler {
    private static final String OWNER_TYPE_EVENT = "event";

    private final UsersRepository usersRepository;
    private final UserRatesRepository userRatesRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final ActivitiesEventLeaderboardService activitiesEventLeaderboardService;
    private final EventInviteNotificationService eventInviteNotificationService;
    private final EventGeneratorByRandom eventGeneratorByRandom = new EventGeneratorByRandom();
    private final EventGeneratorByPriority eventGeneratorByPriority = new EventGeneratorByPriority();

    @Value("${events.scheduler.enabled:false}")
    private boolean schedulerEnabled;

    public EventScheduler(
            UsersRepository usersRepository,
            UserRatesRepository userRatesRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivitiesMembersService activitiesMembersService,
            ActivitiesEventLeaderboardService activitiesEventLeaderboardService,
            EventInviteNotificationService eventInviteNotificationService) {
        this.usersRepository = usersRepository;
        this.userRatesRepository = userRatesRepository;
        this.activityEventsRepository = activityEventsRepository;
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
        FGraph graph = buildGraphSnapshot();
        if (graph.getNodes().isEmpty()) {
            return List.of();
        }
        return eventGeneratorByRandom.generate(new RandomGeneratorRequest(graph, Range.of(4, 6), List.of(), false));
    }

    public List<InviteBatchPlan> generatePriorityPlans() {
        FGraph graph = buildGraphSnapshot();
        if (graph.getNodes().isEmpty()) {
            return List.of();
        }

        List<InviteBatchPlan> plans = new ArrayList<>();
        for (ActivityEvent event : resolveCanonicalEvents()) {
            if (event == null || !Boolean.TRUE.equals(event.getAutoInviter()) || !Boolean.TRUE.equals(event.getPublished())) {
                continue;
            }
            String eventId = normalizeId(event.getSourceId());
            ActivitiesMembersService.OwnerMembersSnapshot snapshot = activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, eventId);
            int activeMembers = snapshot == null ? 0 : snapshot.acceptedMembers() + snapshot.pendingMembers();
            int openSpots = Math.max(0, safeCount(event.getCapacityTotal()) - activeMembers);
            if (!StringUtils.hasText(eventId) || openSpots <= 0) {
                continue;
            }

            Set<String> lockedUserIds = new LinkedHashSet<>();
            if (snapshot != null) {
                lockedUserIds.addAll(snapshot.acceptedMemberUserIds());
                lockedUserIds.addAll(snapshot.pendingMemberUserIds());
            }
            Set<String> candidateUserIds = new LinkedHashSet<>(graph.getNodes().keySet());
            candidateUserIds.removeAll(lockedUserIds);
            candidateUserIds.remove(normalizeId(event.getCreatorUserId()));

            InviteBatchPlan plan = eventGeneratorByPriority.generate(new PriorityGeneratorRequest(
                    eventId,
                    graph,
                    candidateUserIds,
                    lockedUserIds,
                    Range.of(openSpots, openSpots),
                    List.of(),
                    true,
                    0d));
            if (plan.invitedUserIds().isEmpty()) {
                continue;
            }

            List<String> persistedInviteUserIds = activitiesMembersService.inviteUsers(
                    eventId,
                    resolveInviterUserId(event),
                    plan.invitedUserIds(),
                    event);
            if (!persistedInviteUserIds.isEmpty()) {
                eventInviteNotificationService.notifyInvitees(event, persistedInviteUserIds);
                plans.add(new InviteBatchPlan(eventId, persistedInviteUserIds));
            }
        }
        return plans;
    }

    public List<EventLeaderboardStateDto> generateScorePlans() {
        List<EventLeaderboardStateDto> states = new ArrayList<>();
        for (ActivityEvent event : resolveCanonicalEvents()) {
            if (event == null || event.getSubEvents() == null) {
                continue;
            }
            String eventId = normalizeId(event.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            event.getSubEvents().stream()
                    .filter(Objects::nonNull)
                    .filter(subEvent -> StringUtils.hasText(normalizeId(subEvent.id())))
                    .filter(subEvent -> subEvent.groups() != null && !subEvent.groups().isEmpty() || safeCount(subEvent.tournamentGroupCount()) > 0)
                    .forEach(subEvent -> {
                        EventLeaderboardStateDto state = activitiesEventLeaderboardService.queryState(eventId, normalizeId(subEvent.id()));
                        if (state.groups().stream().anyMatch(group -> !group.advancingMemberIds().isEmpty())) {
                            states.add(state);
                        }
                    });
        }
        return states;
    }

    private FGraph buildGraphSnapshot() {
        Map<String, Node> nodesByUserId = new LinkedHashMap<>();
        for (Users user : usersRepository.findAll()) {
            if (user == null || !StringUtils.hasText(normalizeId(user.getId()))) {
                continue;
            }
            nodesByUserId.put(normalizeId(user.getId()), new Node(normalizeId(user.getId()), safeText(user.getGender())));
        }

        List<Edge> edges = new ArrayList<>();
        for (UserRate rate : userRatesRepository.findAll()) {
            if (rate == null) {
                continue;
            }
            String source = normalizeId(rate.getSource()).toLowerCase();
            if ("activity-rate".equals(source)) {
                addActivityRateEdges(edges, nodesByUserId, rate);
            }
        }
        return new FGraph(nodesByUserId, edges);
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
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : activityEventsRepository.findAll()) {
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
}
