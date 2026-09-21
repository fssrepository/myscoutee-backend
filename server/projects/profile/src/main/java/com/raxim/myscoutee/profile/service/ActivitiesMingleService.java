package com.raxim.myscoutee.profile.service;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.algo.dto.Edge;
import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Node;
import com.raxim.myscoutee.algo.gen.EventGeneratorByMingle;
import com.raxim.myscoutee.algo.gen.GeneratorModels.MingleGeneratorRequest;
import com.raxim.myscoutee.algo.gen.GeneratorModels.MinglePreviousTable;
import com.raxim.myscoutee.algo.gen.GeneratorModels.MingleRoundPlan;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMingleRound;
import com.raxim.myscoutee.profile.data.document.ActivityMingleRound.TableAssignment;
import com.raxim.myscoutee.profile.data.document.ActivityMingleSession;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.MingleDtos.MingleActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.MingleDtos.MingleParticipantDto;
import com.raxim.myscoutee.profile.data.dto.events.MingleDtos.MingleStateDto;
import com.raxim.myscoutee.profile.data.dto.events.MingleDtos.MingleTableDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.MingleConfigurationDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMingleRoundsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMingleSessionsRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@Service
public class ActivitiesMingleService {
    static final String STATUS_ROUND = "ROUND";
    static final String STATUS_BREAK = "BREAK";
    static final String STATUS_PAUSED = "PAUSED";
    static final String STATUS_COMPLETED = "COMPLETED";
    static final String ROUND_ACTIVE = "ACTIVE";
    static final String ROUND_COMPLETED = "COMPLETED";

    private static final Set<String> LIVE_STATUSES = Set.of(STATUS_ROUND, STATUS_BREAK, STATUS_PAUSED);

    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMingleSessionsRepository activityMingleSessionsRepository;
    private final ActivityMingleRoundsRepository activityMingleRoundsRepository;
    private final UsersRepository usersRepository;
    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final AccessControlService accessControlService;
    private final NotificationOutboxService notificationOutboxService;
    private final EventGeneratorByMingle generator = new EventGeneratorByMingle();

    public ActivitiesMingleService(
            ActivityEventsRepository activityEventsRepository,
            ActivityMingleSessionsRepository activityMingleSessionsRepository,
            ActivityMingleRoundsRepository activityMingleRoundsRepository,
            UsersRepository usersRepository,
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            ActivitiesMembersService activitiesMembersService,
            AccessControlService accessControlService,
            NotificationOutboxService notificationOutboxService) {
        this.activityEventsRepository = activityEventsRepository;
        this.activityMingleSessionsRepository = activityMingleSessionsRepository;
        this.activityMingleRoundsRepository = activityMingleRoundsRepository;
        this.usersRepository = usersRepository;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.activitiesMembersService = activitiesMembersService;
        this.accessControlService = accessControlService;
        this.notificationOutboxService = notificationOutboxService;
    }

    public MingleStateDto queryState(String requestedUserId, String requestedEventId) {
        return queryState(requestedUserId, requestedEventId, null);
    }

    public MingleStateDto queryState(String requestedUserId, String requestedEventId, Integer requestedRoundNumber) {
        String actorUserId = effectiveActorUserId(requestedUserId);
        if (!StringUtils.hasText(actorUserId)) {
            return null;
        }
        String eventId = normalizeId(requestedEventId);
        if (StringUtils.hasText(eventId)) {
            ActivityMingleSession session = activityMingleSessionsRepository.findByEventId(eventId).orElse(null);
            return session == null ? null : visibleState(actorUserId, session, requestedRoundNumber);
        }
        for (ActivityMingleSession session : activityMingleSessionsRepository
                .findByStatusInOrderByUpdatedAtIsoDesc(LIVE_STATUSES)) {
            MingleStateDto state = visibleState(actorUserId, session, null);
            if (state != null) {
                return state;
            }
        }
        return null;
    }

    public MingleStateDto applyAction(MingleActionRequestDto request) {
        String eventId = normalizeId(request == null ? null : request.eventId());
        String actorUserId = effectiveActorUserId(request == null ? null : request.actorUserId());
        ActivityEvent event = requireMingleEvent(eventId);
        requireManager(eventId, actorUserId);
        String action = safeText(request == null ? null : request.action()).toLowerCase();
        Instant now = Instant.now();

        ActivityMingleSession session = activityMingleSessionsRepository.findByEventId(eventId).orElse(null);
        if (request.expectedRevision() != null
                && request.expectedRevision() != (session == null ? 0 : count(session.getRevision()))) {
            throw new MingleActionException(HttpStatus.CONFLICT, "MINGLE_STATE_CHANGED");
        }
        session = switch (action) {
            case "start" -> startOrContinue(event, session, actorUserId, now);
            case "next", "advance" -> advance(event, requireSession(session), actorUserId, now, false);
            case "pause" -> pause(requireSession(session), actorUserId, now);
            case "resume" -> resume(requireSession(session), actorUserId, now);
            case "complete", "stop" -> complete(requireSession(session), actorUserId, now);
            default -> throw new MingleActionException(HttpStatus.BAD_REQUEST, "MINGLE_ACTION_UNSUPPORTED");
        };
        return toState(actorUserId, event, session);
    }

    ActivityMingleSession advanceDueSession(ActivityMingleSession session, Instant now) {
        if (session == null || !LIVE_STATUSES.contains(safeText(session.getStatus()))
                || STATUS_PAUSED.equals(safeText(session.getStatus()))) {
            return session;
        }
        Instant dueAt = parseInstant(session.getPhaseEndsAtIso());
        Instant effectiveNow = now == null ? Instant.now() : now;
        if (dueAt == null || dueAt.isAfter(effectiveNow)) {
            return session;
        }
        ActivityEvent event = resolveMingleEvent(session.getEventId());
        return event == null ? complete(session, "system", effectiveNow) : advance(event, session, "system", effectiveNow, true);
    }

    private ActivityMingleSession startOrContinue(
            ActivityEvent event,
            ActivityMingleSession existing,
            String actorUserId,
            Instant now) {
        if (existing != null && LIVE_STATUSES.contains(safeText(existing.getStatus()))) {
            return existing;
        }
        int nextRound = existing == null ? 1 : Math.max(1, count(existing.getCurrentRoundNumber()) + 1);
        MingleConfigurationDto config = mingleConfiguration(event);
        if (nextRound > config.plannedRounds()) {
            throw new MingleActionException(HttpStatus.CONFLICT, "MINGLE_ROUND_LIMIT_REACHED");
        }
        ActivityMingleRound round = createRound(event, nextRound, actorUserId, now, ROUND_ACTIVE);
        round.setStartedAtIso(now.toString());
        activityMingleRoundsRepository.save(round);
        syncRoundGroupMembers(round, actorUserId);

        ActivityMingleSession session = existing == null ? new ActivityMingleSession() : existing;
        if (session.getId() == null) {
            session.setId(new ObjectId().toHexString());
            session.setEventId(normalizeId(event.getSourceId()));
            session.setCreatedAtIso(now.toString());
            session.setCreatedByUserId(actorUserId);
            session.setRevision(0);
        }
        setPhase(session, STATUS_ROUND, nextRound, now, now.plus(Duration.ofMinutes(config.roundDurationMinutes())));
        touch(session, actorUserId, now);
        ActivityMingleSession saved = activityMingleSessionsRepository.save(session);
        enqueueAssignments(event, round, actorUserId);
        return saved;
    }

    private ActivityMingleSession advance(
            ActivityEvent event,
            ActivityMingleSession session,
            String actorUserId,
            Instant now,
            boolean automatic) {
        String status = safeText(session.getStatus());
        MingleConfigurationDto config = mingleConfiguration(event);
        if (STATUS_ROUND.equals(status)) {
            completeRound(session.getEventId(), session.getCurrentRoundNumber(), now);
            int nextRoundNumber = count(session.getCurrentRoundNumber()) + 1;
            if (nextRoundNumber > config.plannedRounds()) {
                return complete(session, actorUserId, now);
            }
            setPhase(session, STATUS_BREAK, session.getCurrentRoundNumber(), now,
                    now.plus(Duration.ofMinutes(config.breakDurationMinutes())));
            touch(session, actorUserId, now);
            return activityMingleSessionsRepository.save(session);
        }
        if (STATUS_BREAK.equals(status)) {
            int nextRoundNumber = count(session.getCurrentRoundNumber()) + 1;
            if (nextRoundNumber > config.plannedRounds()) {
                return complete(session, actorUserId, now);
            }
            ActivityMingleRound round = createRound(event, nextRoundNumber, actorUserId, now, ROUND_ACTIVE);
            round.setStartedAtIso(now.toString());
            activityMingleRoundsRepository.save(round);
            syncRoundGroupMembers(round, actorUserId);
            setPhase(session, STATUS_ROUND, nextRoundNumber, now,
                    now.plus(Duration.ofMinutes(config.roundDurationMinutes())));
            touch(session, actorUserId, now);
            ActivityMingleSession saved = activityMingleSessionsRepository.save(session);
            enqueueAssignments(event, round, actorUserId);
            return saved;
        }
        if (STATUS_COMPLETED.equals(status) && !automatic) {
            return startOrContinue(event, session, actorUserId, now);
        }
        throw new MingleActionException(HttpStatus.CONFLICT, "MINGLE_STATE_CANNOT_ADVANCE");
    }

    private ActivityMingleSession pause(ActivityMingleSession session, String actorUserId, Instant now) {
        String status = safeText(session.getStatus());
        if (!STATUS_ROUND.equals(status) && !STATUS_BREAK.equals(status)) {
            return session;
        }
        session.setPausedFromStatus(status);
        session.setPausedRemainingSeconds(remainingSeconds(session.getPhaseEndsAtIso(), now));
        session.setStatus(STATUS_PAUSED);
        session.setPhaseEndsAtIso(null);
        touch(session, actorUserId, now);
        return activityMingleSessionsRepository.save(session);
    }

    private ActivityMingleSession resume(ActivityMingleSession session, String actorUserId, Instant now) {
        if (!STATUS_PAUSED.equals(safeText(session.getStatus()))) {
            return session;
        }
        String resumedStatus = STATUS_BREAK.equals(safeText(session.getPausedFromStatus())) ? STATUS_BREAK : STATUS_ROUND;
        long remaining = Math.max(0L, session.getPausedRemainingSeconds() == null ? 0L : session.getPausedRemainingSeconds());
        session.setStatus(resumedStatus);
        session.setPhaseStartedAtIso(now.toString());
        session.setPhaseEndsAtIso(now.plusSeconds(remaining).toString());
        session.setPausedFromStatus(null);
        session.setPausedRemainingSeconds(null);
        touch(session, actorUserId, now);
        return activityMingleSessionsRepository.save(session);
    }

    private ActivityMingleSession complete(ActivityMingleSession session, String actorUserId, Instant now) {
        if (STATUS_COMPLETED.equals(session.getStatus())) return session;
        if (STATUS_ROUND.equals(safeText(session.getStatus()))
                || (STATUS_PAUSED.equals(session.getStatus()) && STATUS_ROUND.equals(session.getPausedFromStatus()))) {
            completeRound(session.getEventId(), session.getCurrentRoundNumber(), now);
        }
        session.setStatus(STATUS_COMPLETED);
        session.setEncountersPublished(false);
        session.setPhaseStartedAtIso(now.toString());
        session.setPhaseEndsAtIso(null);
        session.setPausedFromStatus(null);
        session.setPausedRemainingSeconds(null);
        touch(session, actorUserId, now);
        return activityMingleSessionsRepository.save(session);
    }

    private ActivityMingleRound createRound(
            ActivityEvent event,
            int roundNumber,
            String actorUserId,
            Instant now,
            String status) {
        String eventId = normalizeId(event.getSourceId());
        Set<String> eligibleUserIds = acceptedParticipantIds(event);
        if (eligibleUserIds.size() < 2) {
            throw new MingleActionException(
                    HttpStatus.CONFLICT,
                    "MINGLE_MEMBERS_INSUFFICIENT",
                    Map.of("accepted", eligibleUserIds.size(), "required", 2));
        }
        MingleConfigurationDto config = mingleConfiguration(event);
        MingleRoundPlan plan = generator.generate(new MingleGeneratorRequest(
                buildPriorityGraph(eligibleUserIds),
                eligibleUserIds,
                config.groupSize(),
                roundNumber,
                List.of(),
                previousTables(eventId),
                userGenders(eligibleUserIds),
                config.requireGenderBalance()));
        if (plan.tables().isEmpty()) {
            throw new MingleActionException(
                    HttpStatus.CONFLICT,
                    config.requireGenderBalance()
                            ? "MINGLE_TABLE_ASSIGNMENT_UNAVAILABLE_GENDER_BALANCE"
                            : "MINGLE_TABLE_ASSIGNMENT_UNAVAILABLE",
                    Map.of("accepted", eligibleUserIds.size(), "groupSize", config.groupSize()));
        }

        ActivityMingleRound round = new ActivityMingleRound();
        round.setId(new ObjectId().toHexString());
        round.setEventId(eventId);
        round.setRoundNumber(roundNumber);
        round.setStatus(status);
        round.setTables(plan.tables().stream()
                .map(table -> new TableAssignment(table.tableNumber(), table.memberUserIds()))
                .toList());
        round.setAssignmentCreatedAtIso(now.toString());
        round.setCreatedByUserId(actorUserId);
        return round;
    }

    private void completeRound(String eventId, Integer roundNumber, Instant now) {
        activityMingleRoundsRepository.findByEventIdAndRoundNumber(eventId, roundNumber).ifPresent(round -> {
            if (ROUND_COMPLETED.equals(round.getStatus())) return;
            round.setTables(effectiveTables(round));
            round.setStatus(ROUND_COMPLETED);
            round.setCompletedAtIso(now.toString());
            activityMingleRoundsRepository.save(round);
        });
    }

    private MingleStateDto visibleState(
            String actorUserId,
            ActivityMingleSession session,
            Integer requestedRoundNumber) {
        ActivityEvent event = resolveMingleEvent(session == null ? null : session.getEventId());
        if (event == null) {
            return null;
        }
        boolean manager = accessControlService.canManageEvent(session.getEventId(), actorUserId);
        ActivityMingleRound round = requestedRound(session, requestedRoundNumber);
        if (!manager && !acceptedParticipantIds(event).contains(actorUserId)) {
            return null;
        }
        return toState(actorUserId, event, session, round);
    }

    private MingleStateDto toState(String actorUserId, ActivityEvent event, ActivityMingleSession session) {
        return toState(actorUserId, event, session, currentRound(session));
    }

    private MingleStateDto toState(
            String actorUserId,
            ActivityEvent event,
            ActivityMingleSession session,
            ActivityMingleRound round) {
        boolean manager = accessControlService.canManageEvent(session.getEventId(), actorUserId);
        List<TableAssignment> roundTables = effectiveTables(round);
        TableAssignment ownTable = roundTables.stream()
                .filter(table -> table.memberUserIds().contains(actorUserId)).findFirst().orElse(null);
        List<TableAssignment> visibleTables = manager
                ? roundTables
                : ownTable == null ? List.of() : List.of(ownTable);
        Set<String> visibleUserIds = visibleTables.stream()
                .flatMap(table -> table.memberUserIds().stream())
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        Map<String, Users> usersById = usersRepository.findByUserIdIn(visibleUserIds).stream()
                .filter(Objects::nonNull)
                .filter(user -> StringUtils.hasText(normalizeId(user.getUserId())))
                .collect(java.util.stream.Collectors.toMap(
                        user -> normalizeId(user.getUserId()),
                        user -> user,
                        (left, right) -> left,
                        LinkedHashMap::new));
        List<MingleTableDto> tables = visibleTables.stream()
                .map(table -> new MingleTableDto(
                        table.tableNumber(),
                        mingleSubEventId(round.getRoundNumber()),
                        mingleGroupId(session.getEventId(), round.getRoundNumber(), table.tableNumber()),
                        table.memberUserIds().stream()
                                .map(userId -> participant(userId, usersById.get(userId)))
                                .toList()))
                .toList();
        return new MingleStateDto(
                session.getEventId(),
                safeText(event.getTitle()),
                safeText(session.getStatus()),
                round == null ? count(session.getCurrentRoundNumber()) : count(round.getRoundNumber()),
                mingleConfiguration(event).plannedRounds(),
                session.getPhaseStartedAtIso(),
                session.getPhaseEndsAtIso(),
                STATUS_PAUSED.equals(safeText(session.getStatus()))
                        ? Math.max(0L, session.getPausedRemainingSeconds() == null ? 0L : session.getPausedRemainingSeconds())
                        : remainingSeconds(session.getPhaseEndsAtIso(), Instant.now()),
                ownTable == null ? null : ownTable.tableNumber(),
                tables,
                manager,
                ownTable == null && acceptedParticipantIds(event).contains(actorUserId),
                count(session.getRevision()));
    }

    private MingleParticipantDto participant(String userId, Users user) {
        String normalizedUserId = normalizeId(userId);
        String name = user == null ? normalizedUserId : firstNonBlank(user.getName(), normalizedUserId);
        String initials = user == null ? initials(name) : firstNonBlank(user.getInitials(), initials(name));
        String avatar = user == null || user.getImages() == null || user.getImages().isEmpty()
                ? null
                : user.getImages().stream().filter(StringUtils::hasText).findFirst().orElse(null);
        return new MingleParticipantDto(normalizedUserId, name, initials, avatar);
    }

    private ActivityMingleRound currentRound(ActivityMingleSession session) {
        if (session == null || session.getCurrentRoundNumber() == null) {
            return null;
        }
        return activityMingleRoundsRepository
                .findByEventIdAndRoundNumber(session.getEventId(), session.getCurrentRoundNumber())
                .orElse(null);
    }

    private ActivityMingleRound requestedRound(ActivityMingleSession session, Integer requestedRoundNumber) {
        if (session == null || requestedRoundNumber == null || requestedRoundNumber <= 0) {
            return currentRound(session);
        }
        return activityMingleRoundsRepository
                .findByEventIdAndRoundNumber(session.getEventId(), requestedRoundNumber)
                .orElse(null);
    }

    private List<TableAssignment> effectiveTables(ActivityMingleRound round) {
        if (round == null || ROUND_COMPLETED.equals(round.getStatus())) return safeTables(round);
        List<String> groupIds = safeTables(round).stream()
                .map(table -> mingleGroupId(round.getEventId(), round.getRoundNumber(), table.tableNumber())).toList();
        Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshots =
                activitiesMembersService.buildBatchOwnerSnapshots("group", groupIds);
        return safeTables(round).stream().map(table -> {
            var snapshot = snapshots.get(mingleGroupId(round.getEventId(), round.getRoundNumber(), table.tableNumber()));
            return new TableAssignment(table.tableNumber(), snapshot == null ? List.of() : snapshot.acceptedMemberUserIds());
        }).toList();
    }

    private void syncRoundGroupMembers(ActivityMingleRound round, String actorUserId) {
        if (round == null) {
            return;
        }
        for (TableAssignment table : safeTables(round)) {
            String groupId = mingleGroupId(round.getEventId(), round.getRoundNumber(), table.tableNumber());
            if (StringUtils.hasText(groupId)) {
                activitiesMembersService.syncGroupMembers(groupId, actorUserId, table.memberUserIds());
            }
        }
    }

    private String mingleGroupId(String eventId, Integer roundNumber, Integer tableNumber) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = mingleSubEventId(roundNumber);
        int normalizedTableNumber = count(tableNumber);
        return !StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId) || normalizedTableNumber <= 0
                ? ""
                : normalizedEventId + ":" + normalizedSubEventId + ":table:" + normalizedTableNumber;
    }

    private String mingleSubEventId(Integer roundNumber) {
        int normalizedRoundNumber = count(roundNumber);
        return normalizedRoundNumber <= 0 ? "" : "mingle-round-" + normalizedRoundNumber;
    }

    private List<TableAssignment> safeTables(ActivityMingleRound round) {
        return round == null || round.getTables() == null ? List.of() : round.getTables();
    }

    private Set<String> acceptedParticipantIds(ActivityEvent event) {
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        LinkedHashSet<String> acceptedUserIds = new LinkedHashSet<>();
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = StringUtils.hasText(eventId)
                ? activitiesMembersService.queryOwnerSnapshot("event", eventId)
                : null;
        List<String> participantUserIds = snapshot != null
                ? snapshot.acceptedMemberUserIds()
                : event == null ? List.of() : event.getAcceptedMemberUserIds();
        if (participantUserIds != null) {
            participantUserIds.stream()
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .forEach(acceptedUserIds::add);
        }
        return acceptedUserIds;
    }

    private List<MinglePreviousTable> previousTables(String eventId) {
        List<MinglePreviousTable> history = new ArrayList<>();
        for (ActivityMingleRound round : activityMingleRoundsRepository.findByEventIdOrderByRoundNumberAsc(eventId)) {
            if (round == null || !ROUND_COMPLETED.equals(safeText(round.getStatus()))) {
                continue;
            }
            for (TableAssignment table : safeTables(round)) {
                history.add(new MinglePreviousTable(
                        count(round.getRoundNumber()),
                        count(table.tableNumber()),
                        table.memberUserIds()));
            }
        }
        return history;
    }

    private FGraph buildPriorityGraph(Set<String> eligibleUserIds) {
        Map<String, Node> nodes = new LinkedHashMap<>();
        eligibleUserIds.forEach(userId -> nodes.put(userId, new Node(userId)));
        List<Edge> edges = new ArrayList<>();
        for (UserAffinityEdge affinity : userAffinityEdgesRepository.findRelevantByUserIds(List.copyOf(eligibleUserIds))) {
            String left = normalizeId(affinity == null ? null : affinity.getLeftUserId());
            String right = normalizeId(affinity == null ? null : affinity.getRightUserId());
            if (!eligibleUserIds.contains(left) || !eligibleUserIds.contains(right) || left.equals(right)) {
                continue;
            }
            double weight = affinity.getEdgeWeight() == null ? 0d : Math.max(0d, affinity.getEdgeWeight());
            if (weight > 0d) {
                edges.add(new Edge(nodes.get(left), nodes.get(right), weight));
            }
        }
        return new FGraph(nodes, edges);
    }

    private Map<String, String> userGenders(Set<String> eligibleUserIds) {
        Map<String, String> genders = new LinkedHashMap<>();
        for (Users user : usersRepository.findByUserIdIn(eligibleUserIds)) {
            String userId = normalizeId(user == null ? null : user.getUserId());
            String gender = safeText(user == null ? null : user.getGender()).toLowerCase();
            if (eligibleUserIds.contains(userId) && StringUtils.hasText(gender)) {
                genders.put(userId, gender);
            }
        }
        return genders;
    }

    private void enqueueAssignments(ActivityEvent event, ActivityMingleRound round, String actorUserId) {
        if (notificationOutboxService == null || round == null) {
            return;
        }
        for (TableAssignment table : safeTables(round)) {
            if (table.memberUserIds().isEmpty()) {
                continue;
            }
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("eventId", normalizeId(event.getSourceId()));
            payload.put("roundNumber", Integer.toString(count(round.getRoundNumber())));
            payload.put("tableNumber", Integer.toString(count(table.tableNumber())));
            payload.put("mingle", "true");
            notificationOutboxService.enqueue(new NotificationIntent(
                    "mingle-table-assignment",
                    "event",
                    normalizeId(event.getSourceId()),
                    "mingle-table",
                    table.memberUserIds(),
                    "Your Speed meeting table is ready",
                    "Go to Table " + count(table.tableNumber()) + " for round " + count(round.getRoundNumber()) + ".",
                    "/game?mingleEventId=" + normalizeId(event.getSourceId()),
                    firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"),
                    "/assets/logo/heart.webp",
                    "mingle-table-" + normalizeId(event.getSourceId()) + "-" + count(round.getRoundNumber()),
                    payload,
                    actorUserId));
        }
        Set<String> waiting = new LinkedHashSet<>(acceptedParticipantIds(event));
        for (TableAssignment table : safeTables(round)) waiting.removeAll(table.memberUserIds());
        if (!waiting.isEmpty()) {
            notificationOutboxService.enqueue(new NotificationIntent(
                    "mingle-table-waiting", "event", event.getSourceId(), "mingle-table", List.copyOf(waiting),
                    "Speed meeting round started", "Waiting for a table assignment.",
                    "/game?mingleEventId=" + normalizeId(event.getSourceId()),
                    firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"), "/assets/logo/heart.webp",
                    "mingle-waiting-" + event.getSourceId() + "-" + round.getRoundNumber(),
                    Map.of("eventId", event.getSourceId(), "roundNumber", round.getRoundNumber().toString(), "mingle", "true"),
                    actorUserId));
        }
    }

    private ActivityEvent requireMingleEvent(String eventId) {
        ActivityEvent event = resolveMingleEvent(eventId);
        if (event == null) {
            throw new MingleActionException(HttpStatus.NOT_FOUND, "MINGLE_EVENT_NOT_FOUND");
        }
        return event;
    }

    private ActivityEvent resolveMingleEvent(String eventId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return null;
        }
        return activityEventsRepository.findBySourceId(normalizedEventId).stream()
                .filter(Objects::nonNull)
                .filter(event -> !Boolean.TRUE.equals(event.getGenerated()))
                .filter(event -> "Mingle".equals(event.getMode()))
                .max(Comparator
                        .comparing((ActivityEvent event) -> normalizeId(event.getOwnerUserId())
                                .equals(normalizeId(event.getCreatorUserId())))
                        .thenComparing(event -> ActivityEvent.STATUS_ACTIVE.equals(event.getStatus()))
                        .thenComparing(event -> safeText(event.getUpdatedDate())))
                .orElse(null);
    }

    private void requireManager(String eventId, String actorUserId) {
        if (!accessControlService.canManageEvent(eventId, actorUserId)) {
            throw new MingleActionException(HttpStatus.FORBIDDEN, "MINGLE_MANAGE_FORBIDDEN");
        }
    }

    private String effectiveActorUserId(String requestedUserId) {
        if (!accessControlService.requiresAuthenticatedActor()) {
            return normalizeId(requestedUserId);
        }
        return normalizeId(accessControlService.resolveActorUserId(
                SecurityContextHolder.getContext().getAuthentication()));
    }

    private ActivityMingleSession requireSession(ActivityMingleSession session) {
        if (session == null) {
            throw new MingleActionException(HttpStatus.CONFLICT, "MINGLE_SESSION_NOT_STARTED");
        }
        return session;
    }

    private MingleConfigurationDto mingleConfiguration(ActivityEvent event) {
        MingleConfigurationDto source = event == null ? null : event.getMingleConfiguration();
        if (source == null) {
            throw new MingleActionException(HttpStatus.CONFLICT, "MINGLE_CONFIGURATION_REQUIRED");
        }
        return new MingleConfigurationDto(
                clamp(source.groupSize(), 2, 20, 4),
                clamp(source.plannedRounds(), 1, 100, 4),
                clamp(source.roundDurationMinutes(), 1, 240, 20),
                clamp(source.breakDurationMinutes(), 0, 60, 5),
                source.requireGenderBalance() == null || source.requireGenderBalance());
    }

    private void setPhase(ActivityMingleSession session, String status, Integer roundNumber, Instant start, Instant end) {
        session.setStatus(status);
        session.setCurrentRoundNumber(roundNumber);
        session.setPhaseStartedAtIso(start.toString());
        session.setPhaseEndsAtIso(end.toString());
        session.setPausedFromStatus(null);
        session.setPausedRemainingSeconds(null);
    }

    private void touch(ActivityMingleSession session, String actorUserId, Instant now) {
        session.setRevision(count(session.getRevision()) + 1);
        session.setUpdatedAtIso(now.toString());
        session.setUpdatedByUserId(actorUserId);
    }

    private long remainingSeconds(String endsAtIso, Instant now) {
        Instant endsAt = parseInstant(endsAtIso);
        return endsAt == null ? 0L : Math.max(0L, Duration.between(now, endsAt).getSeconds());
    }

    private Instant parseInstant(String value) {
        try {
            return StringUtils.hasText(value) ? Instant.parse(value.trim()) : null;
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private int clamp(Integer value, int min, int max, int fallback) {
        int normalized = value == null ? fallback : value;
        return Math.max(min, Math.min(max, normalized));
    }

    private int count(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstNonBlank(String... values) {
        if (values != null) {
            for (String value : values) {
                if (StringUtils.hasText(value)) {
                    return value.trim();
                }
            }
        }
        return "";
    }

    private String initials(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return "?";
        }
        String[] words = normalized.split("\\s+");
        return words.length == 1
                ? words[0].substring(0, Math.min(2, words[0].length())).toUpperCase()
                : ("" + words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
}
