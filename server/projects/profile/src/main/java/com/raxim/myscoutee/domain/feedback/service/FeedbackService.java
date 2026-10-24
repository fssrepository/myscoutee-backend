package com.raxim.myscoutee.domain.feedback.service;

import com.raxim.myscoutee.domain.accounts.api.SelectedProfile;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.MingleEncounters;
import com.raxim.myscoutee.domain.feedback.document.FeedbackAnswer;
import com.raxim.myscoutee.domain.feedback.document.FeedbackState;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackAnswerDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackCardDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackQueryDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackDetailDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackReceivedEntryDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackReceivedEventDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackNoteRequestDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackPageCountsDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackPageQueryDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackPageResultDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackPageStateSnapshotDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackStateDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackStatDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackStatQueryDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackSubmitRequestDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackToggleRequestDto;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;

import com.raxim.myscoutee.domain.feedback.repository.FeedbackAnswersRepository;
import com.raxim.myscoutee.domain.feedback.repository.FeedbackStatesRepository;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.domain.feedback.mapper.FeedbackStatMapper;
import com.raxim.myscoutee.domain.feedback.mapper.FeedbackStatMapper.FeedbackStatRecord;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

@Service
public class FeedbackService {
    private static final long FEEDBACK_UNLOCK_DELAY_MS = 2L * 60L * 60L * 1000L;
    private static final int EVENT_COMMENT_MAX_CODE_POINTS = 160;
    private static final DateTimeFormatter FEEDBACK_LABEL_FORMATTER =
            DateTimeFormatter.ofPattern("EEE, MMM d HH:mm", Locale.US).withZone(ZoneOffset.UTC);

    private final FeedbackEvaluationService evaluations;
    private final com.raxim.myscoutee.domain.groups.api.GroupDirectory groups;
    private final com.raxim.myscoutee.domain.groups.api.CommunityAuthority authority;
    private final SelectedProfile homeUserProfileService;
    private final com.raxim.myscoutee.domain.accounts.api.FeedbackSession feedbackSession;
    private final EventOwnershipReads activityEventsRepository;
    private final MingleEncounters mingleRoundsRepository;
    private final FeedbackCounterWork counterWork;
    private final FeedbackStatesRepository feedbackStatesRepository;
    private final FeedbackAnswersRepository feedbackAnswersRepository;
    private final ProfileSummaries usersRepository;
    private final AffinityStatusChanges affinityRecomputeTaskService;
    private final OperationalTelemetry adminTelemetryService;
    private final AccessPermissions accessControlService;
    private final ActivityCounters userActivityCountersService;
    private final FeedbackStatMapper feedbackStatMapper;
    private final NotificationDelivery notificationOutboxService;

    public FeedbackService(
            SelectedProfile homeUserProfileService,
            com.raxim.myscoutee.domain.accounts.api.FeedbackSession feedbackSession,
            EventOwnershipReads activityEventsRepository,
            MingleEncounters mingleRoundsRepository,
            FeedbackStatesRepository feedbackStatesRepository,
            FeedbackAnswersRepository feedbackAnswersRepository,
            ProfileSummaries usersRepository,
            AffinityStatusChanges affinityRecomputeTaskService,
            OperationalTelemetry adminTelemetryService,
            AccessPermissions accessControlService,
            ActivityCounters userActivityCountersService,
            FeedbackStatMapper feedbackStatMapper,
            NotificationDelivery notificationOutboxService,
            FeedbackEvaluationService evaluations,
            com.raxim.myscoutee.domain.groups.api.GroupDirectory groups,
            com.raxim.myscoutee.domain.groups.api.CommunityAuthority authority,
            FeedbackCounterWork counterWork) {
        this.evaluations = evaluations;
        this.groups = groups;
        this.authority = authority;
        this.counterWork = counterWork;

        this.homeUserProfileService = homeUserProfileService;
        this.feedbackSession = feedbackSession;
        this.activityEventsRepository = activityEventsRepository;
        this.mingleRoundsRepository = mingleRoundsRepository;
        this.feedbackStatesRepository = feedbackStatesRepository;
        this.feedbackAnswersRepository = feedbackAnswersRepository;
        this.usersRepository = usersRepository;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.accessControlService = accessControlService;
        this.userActivityCountersService = userActivityCountersService;
        this.feedbackStatMapper = feedbackStatMapper;
        this.notificationOutboxService = notificationOutboxService;
    }

    public List<FeedbackStateDto> queryStates(String requestedUserId) {
        String userId = homeUserProfileService.resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            return List.of();
        }
        return queryStateDtos(userId);
    }

    public List<FeedbackReceivedEventDto> queryReceivedEvents(String requestedUserId) {
        String userId = homeUserProfileService.resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            return List.of();
        }
        return queryReceivedEventsByOwnedEventIds(userId, eventSourceIds(queryOrganizerFeedbackEvents(userId)));
    }

    public FeedbackPageResultDto loadPage(FeedbackPageQueryDto request) {
        var session = feedbackSession.resolveFeedbackSession(request == null ? null : request.userId());
        ProfileSummary activeUser = session == null ? null : session.profile();
        String userId = normalizeId(activeUser == null ? null : activeUser.getUserId());
        String filter = normalizeFeedbackFilter(request == null ? null : request.filter());
        if (!StringUtils.hasText(userId) || activeUser == null) {
            return emptyPageResult();
        }

        List<Event> feedbackEvents = queryFeedbackCandidateEvents(userId).stream()
            .filter(event -> request == null || !StringUtils.hasText(request.campaignId()) || request.campaignId().equals(event.getCampaignId())).toList();
        List<Event> organizerEvents = queryOrganizerFeedbackEvents(userId).stream()
            .filter(event -> request == null || !StringUtils.hasText(request.campaignId()) || request.campaignId().equals(event.getCampaignId())).toList();
        Map<String, Set<String>> minglePeers = completedMinglePeers(userId, feedbackEvents);
        Map<String, ProfileSummary> usersById = buildFeedbackUsersById(activeUser, feedbackEvents, organizerEvents, minglePeers);
        FeedbackPageStateSnapshotDto state = pageStateSnapshot(queryStateDtos(userId));
        List<FeedbackReceivedEventDto> receivedEvents = queryReceivedEventsByOwnedEventIds(userId, eventSourceIds(organizerEvents));
        Map<String, List<FeedbackReceivedEntryDto>> receivedByEventId = receivedEntriesByEventId(receivedEvents);
        Map<String, List<FeedbackCardDto>> cardsByEventId = feedbackCardsByEventId(feedbackEvents, usersById, activeUser, minglePeers);
        List<FeedbackDto> allItems = buildFeedbackPageItems(feedbackEvents, cardsByEventId, state, userId);
        List<FeedbackDto> organizerItems = buildOrganizerPageItems(organizerEvents, receivedByEventId);
        List<FeedbackDto> filteredItems = filterPageItems(filter, allItems, organizerItems);
        int page = normalizePage(request == null ? null : request.page());
        int pageSize = normalizePageSize(request == null ? null : request.pageSize());
        int fromIndex = Math.min(filteredItems.size(), page * pageSize);
        int toIndex = Math.min(filteredItems.size(), fromIndex + pageSize);
        var evaluationItems=List.<com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.EvaluationItem>of();
        Map<String,Long> evaluationCounts=Map.of();
        long evaluationTotal=0;
        if ((request==null || !StringUtils.hasText(request.campaignId())) && communityWorkspace(activeUser.getWorkspaceGroupId())) {
            var window=evaluations.window(authority.actor(userId),"own-events".equals(filter)?"received":filter,
                Math.max(0L,(long)page*pageSize-filteredItems.size()),pageSize-(toIndex-fromIndex));
            evaluationItems=window.items().stream().map(item -> {
                var row=item.feedback();
                return new com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.EvaluationItem(
                    new com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.Evaluation(row.id(),row.baseGroupId(),row.caseId(),row.caseTitle(),row.serviceId(),
                        row.providerAccountId(),row.viewerAccountId(),row.status(),row.criteria(),row.average(),row.comment(),row.createdAtIso(),row.submittedAtIso()),
                    item.providerName(),item.reviewerName(),item.serviceTitle(),item.serviceImageUrl());
            }).toList();
            evaluationCounts=window.context();evaluationTotal=window.total();
        }


        return new FeedbackPageResultDto(
                List.copyOf(filteredItems.subList(fromIndex, toIndex)),
                Math.toIntExact(filteredItems.size()+evaluationTotal),
                List.copyOf(allItems),
                List.copyOf(organizerItems),
                List.copyOf(receivedEvents),
                state,
                counts(session == null ? null : session.feedback()),evaluationItems,evaluationCounts);
    }

    private boolean communityWorkspace(String id) {
        if (!StringUtils.hasText(id)) return false;
        if (com.raxim.myscoutee.domain.groups.api.BaseGroups.isBaseId(id))
            return com.raxim.myscoutee.domain.groups.api.BaseGroups.COMMUNITY_BASE_ID.equals(id);
        return groups.type(id).map(group -> "community".equals(group.effectiveType())).orElse(false);
    }

    public FeedbackStatDto loadStatById(FeedbackStatQueryDto request) {
        var session = feedbackSession.resolveFeedbackSession(request == null ? null : request.userId());
        ProfileSummary activeUser = session == null ? null : session.profile();
        String userId = normalizeId(activeUser == null ? null : activeUser.getUserId());
        String eventId = normalizeId(request == null ? null : request.eventId());
        if (!StringUtils.hasText(userId) || activeUser == null || !StringUtils.hasText(eventId)) {
            return emptyStatResult(eventId);
        }
        List<String> ownedEventIds = eventSourceIds(queryOrganizerFeedbackEvents(userId));
        if (!ownedEventIds.contains(eventId)) {
            return emptyStatResult(eventId);
        }
        return feedbackStatMapper.toDto(eventId, queryFeedbackStatRecords(userId, eventId));
    }

    public FeedbackDetailDto loadDetail(FeedbackQueryDto request) {
        var session = feedbackSession.resolveFeedbackSession(request == null ? null : request.userId());
        ProfileSummary activeUser = session == null ? null : session.profile();
        String userId = normalizeId(activeUser == null ? null : activeUser.getUserId());
        String eventId = normalizeId(request == null ? null : request.eventId());
        if (!StringUtils.hasText(userId) || activeUser == null || !StringUtils.hasText(eventId)) {
            return emptyDetailResult(eventId);
        }
        return loadDetailForUser(activeUser, userId, eventId);
    }

    private FeedbackDetailDto loadDetailForUser(ProfileSummary activeUser, String userId, String eventId) {
        Event record = findFeedbackEventForDetail(userId, eventId);
        if (record == null) {
            return emptyDetailResult(eventId);
        }
        Map<String, Set<String>> minglePeers = completedMinglePeers(userId, List.of(record));
        Map<String, ProfileSummary> usersById = buildFeedbackUsersById(activeUser, List.of(record), List.of(), minglePeers);
        FeedbackState state = feedbackStatesRepository
                .findByViewerUserIdAndEventId(userId, eventId)
                .orElse(null);
        List<FeedbackAnswer> persistedAnswers =
                feedbackAnswersRepository.findByViewerUserIdAndEventId(userId, eventId);
        Map<String, FeedbackAnswer> answersByCardId = new LinkedHashMap<>();
        for (FeedbackAnswer answer : persistedAnswers) {
            String cardId = normalizeId(answer == null ? null : answer.getCardId());
            if (StringUtils.hasText(cardId)) {
                answersByCardId.put(cardId, answer);
            }
        }
        return new FeedbackDetailDto(
                eventId,
                safeText(record.getTitle()),
                safeText(state == null ? null : state.getSubmittedAtIso()),
                safeText(state == null ? null : state.getOrganizerNote()),
                buildFeedbackCards(record, usersById, activeUser, minglePeers).stream()
                        .map(card -> mergeFeedbackAnswer(
                                card,
                                findFeedbackAnswer(card, answersByCardId, persistedAnswers)))
                        .toList());
    }

    public FeedbackDetailDto submit(FeedbackSubmitRequestDto request) {
        String userId = homeUserProfileService.resolveSelectedUserId(request == null ? null : request.userId());
        FeedbackDetailDto feedback = request == null ? null : request.feedback();
        String eventId = normalizeId(feedback == null ? null : feedback.eventId());
        if (feedback == null || !StringUtils.hasText(userId) || !StringUtils.hasText(eventId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A feedback user and event are required.");
        }
        if (!accessControlService.canCurrentActorSubmitFeedback(userId, eventId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to submit feedback for this event.");
        }
        var session = feedbackSession.resolveFeedbackSession(userId);
        ProfileSummary activeUser = session == null ? null : session.profile();
        Event feedbackEvent = findFeedbackEventForDetail(userId, eventId);
        if (activeUser == null || feedbackEvent == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The feedback event is not available for this user.");
        }
        Map<String, Set<String>> minglePeers = completedMinglePeers(userId, List.of(feedbackEvent));
        List<FeedbackCardDto> allowedCards = buildFeedbackCards(
                feedbackEvent,
                buildFeedbackUsersById(activeUser, List.of(feedbackEvent), List.of(), minglePeers),
                activeUser, minglePeers);
        if (isMingleEvent(feedbackEvent)) {
            Map<String, FeedbackCardDto> cardsById = new LinkedHashMap<>();
            allowedCards.forEach(card -> cardsById.put(card.id(), card));
            for (FeedbackCardDto submitted : safeDetailCards(feedback.cards())) {
                FeedbackCardDto allowed = submitted == null ? null : cardsById.get(normalizeId(submitted.id()));
                if (allowed == null || !Objects.equals(allowed.kind(), submitted.kind())
                        || !Objects.equals(normalizeId(allowed.targetUserId()), normalizeId(submitted.targetUserId()))) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid feedback target for this event.");
                }
            }
        }
        Set<String> allowedTargetUserIds = allowedCards.stream()
                        .map(FeedbackCardDto::targetUserId)
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);

        String nowIso = firstNonBlank(feedback.submittedAtIso(), Instant.now().toString());
        FeedbackState previousState = feedbackStatesRepository.findByViewerUserIdAndEventId(userId, eventId).orElse(null);
        boolean wasSubmitted = StringUtils.hasText(previousState == null ? null : previousState.getSubmittedAtIso());
        boolean wasRemoved = Boolean.TRUE.equals(previousState == null ? null : previousState.getRemoved());
        FeedbackState state = counterWork.finish(previousState == null ? createState(userId, eventId, nowIso) : previousState);
        state.setRemoved(false);
        state.setSubmittedAtIso(nowIso);
        state.setRemovedAtIso(null);
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(userId);

        LinkedHashSet<String> changedTargetUserIds = new LinkedHashSet<>();
        List<FeedbackAnswer> answers = new ArrayList<>();
        for (FeedbackCardDto card : safeDetailCards(feedback.cards())) {
            String cardId = normalizeId(card.id());
            if (!StringUtils.hasText(cardId)) {
                continue;
            }
            FeedbackAnswer document = feedbackAnswersRepository
                    .findByViewerUserIdAndEventIdAndCardId(userId, eventId, cardId)
                    .orElseGet(() -> createAnswer(userId, eventId, cardId, nowIso));
            document.setKind(safeText(card.kind()));
            document.setTargetUserId(normalizeId(card.targetUserId()));
            document.setTargetRole(safeText(card.targetRole()));
            document.setPrimaryValue(safeText(card.answerPrimary()));
            document.setSecondaryValue(safeText(card.answerSecondary()));
            document.setEventComment("event".equals(safeText(card.kind()))
                    ? normalizeEventComment(card.eventComment())
                    : "");
            document.setPersonalityTraitIds(card.selectedTraitIds() == null
                    ? List.of()
                    : card.selectedTraitIds().stream().map(this::safeText).filter(StringUtils::hasText).toList());
            document.setTags(List.of());
            document.setSubmittedAtIso(nowIso);
            document.setUpdatedDate(nowIso);
            document.setUpdatedUser(userId);
            answers.add(document);
            String targetUserId = normalizeId(document.getTargetUserId());
            if (StringUtils.hasText(targetUserId)) {
                changedTargetUserIds.add(targetUserId);
            }
        }
        if (answers.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one feedback answer is required.");
        }
        feedbackAnswersRepository.saveAll(answers);
        counterWork.prepareTransition(state, com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto.from(feedbackEvent),
                wasSubmitted, wasRemoved, true, false);
        counterWork.finish(feedbackStatesRepository.save(state));
        LinkedHashSet<String> notificationTargetUserIds = new LinkedHashSet<>(changedTargetUserIds);
        notificationTargetUserIds.retainAll(allowedTargetUserIds);
        notificationTargetUserIds.remove(userId);
        enqueueFeedbackNotification(
                feedbackEvent,
                userId,
                notificationTargetUserIds,
                wasSubmitted,
                wasRemoved);
        for (String targetUserId : changedTargetUserIds) {
            affinityRecomputeTaskService.enqueueUserChanged(targetUserId);
        }
        adminTelemetryService.record("feedback.submitted", "events", eventId, userId);
        return loadDetailForUser(activeUser, userId, eventId);
    }

    private void enqueueFeedbackNotification(
            Event event,
            String actorUserId,
            Collection<String> targetUserIds,
            boolean wasSubmitted,
            boolean wasRemoved) {
        if (notificationOutboxService == null
                || event == null
                || (wasSubmitted && !wasRemoved)) {
            return;
        }
        LinkedHashSet<String> recipients = normalizeIds(targetUserIds).stream()
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        String normalizedActorUserId = normalizeId(actorUserId);
        recipients.remove(normalizedActorUserId);
        if (recipients.isEmpty()) {
            return;
        }
        String eventId = normalizeId(event.getSourceId());
        String eventTitle = firstNonBlank(event.getTitle(), "Event");
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", eventTitle);
        payload.put("senderUserId", normalizedActorUserId);
        notificationOutboxService.enqueue(new NotificationIntent(
                "feedback-submitted",
                "event",
                eventId,
                "feedback-targets",
                recipients,
                "New feedback",
                "You received feedback for " + eventTitle + ".",
                "/game",
                firstNonBlank(event.getImageUrl(), "/assets/logo/heart.webp"),
                "/assets/logo/heart.webp",
                "feedback-submitted-" + eventId + "-" + normalizedActorUserId,
                payload,
                normalizedActorUserId));
    }

    public void saveNote(FeedbackNoteRequestDto request) {
        String userId = homeUserProfileService.resolveSelectedUserId(request == null ? null : request.userId());
        String eventId = normalizeId(request == null ? null : request.eventId());
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(eventId)) {
            return;
        }
        if (!accessControlService.canCurrentActorSaveFeedbackNote(userId, eventId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to save feedback note for this event.");
        }
        String nowIso = Instant.now().toString();
        FeedbackState state = findOrCreateState(userId, eventId, nowIso);
        String organizerNote = request == null ? null : request.text();
        state.setOrganizerNote(safeText(organizerNote));
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(userId);
        feedbackStatesRepository.save(state);
    }

    public void markRemoved(FeedbackToggleRequestDto request, boolean removed) {
        String userId = homeUserProfileService.resolveSelectedUserId(request == null ? null : request.userId());
        String eventId = normalizeId(request == null ? null : request.eventId());
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(eventId)) {
            return;
        }
        boolean allowed = removed
                ? accessControlService.canCurrentActorRemoveFeedback(userId, eventId)
                : accessControlService.canCurrentActorRestoreFeedback(userId, eventId);
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to change feedback state for this event.");
        }
        String nowIso = Instant.now().toString();
        FeedbackState previousState = feedbackStatesRepository.findByViewerUserIdAndEventId(userId, eventId).orElse(null);
        boolean wasSubmitted = StringUtils.hasText(previousState == null ? null : previousState.getSubmittedAtIso());
        boolean wasRemoved = Boolean.TRUE.equals(previousState == null ? null : previousState.getRemoved());
        Event feedbackEvent = findFeedbackEventForDetail(userId, eventId);
        if (feedbackEvent == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The feedback event is not available for this user.");
        }
        FeedbackState state = counterWork.finish(previousState == null ? createState(userId, eventId, nowIso) : previousState);
        state.setRemoved(removed);
        state.setRemovedAtIso(removed ? nowIso : null);
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(userId);
        counterWork.prepareTransition(state, com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto.from(feedbackEvent),
                wasSubmitted, wasRemoved, StringUtils.hasText(state.getSubmittedAtIso()), removed);
        counterWork.finish(feedbackStatesRepository.save(state));
    }

    private List<FeedbackStateDto> queryStateDtos(String userId) {
        if (!StringUtils.hasText(userId)) {
            return List.of();
        }
        Map<String, Map<String, FeedbackAnswerDto>> answersByEventId = buildAnswersByEventId(userId);
        return feedbackStatesRepository.findByViewerUserIdOrderByUpdatedDateDesc(userId).stream()
                .filter(Objects::nonNull)
                .sorted((left, right) -> stateSortIso(right).compareTo(stateSortIso(left)))
                .map(state -> toDto(state, answersByEventId.get(normalizeId(state.getEventId()))))
                .toList();
    }

    private List<FeedbackReceivedEventDto> queryReceivedEventsByOwnedEventIds(
            String userId,
            Collection<String> ownedEventIdsInput) {
        List<String> ownedEventIds = normalizeIds(ownedEventIdsInput);
        if (!StringUtils.hasText(userId) || ownedEventIds.isEmpty()) {
            return List.of();
        }

        Map<String, Map<String, ReceivedFeedbackEntryAccumulator>> entriesByEventId = new LinkedHashMap<>();
        Set<String> viewerUserIds = new LinkedHashSet<>();
        for (FeedbackState state : feedbackStatesRepository.findByEventIdInOrderByEventIdAscUpdatedDateDesc(ownedEventIds)) {
            if (state == null) {
                continue;
            }
            String eventId = normalizeId(state.getEventId());
            String viewerUserId = normalizeId(state.getViewerUserId());
            if (!StringUtils.hasText(eventId) || !StringUtils.hasText(viewerUserId) || Objects.equals(userId, viewerUserId)) {
                continue;
            }
            viewerUserIds.add(viewerUserId);
            ReceivedFeedbackEntryAccumulator entry = ensureReceivedFeedbackEntry(entriesByEventId, eventId, viewerUserId);
            entry.submittedAtIso = firstNonBlank(entry.submittedAtIso, state.getSubmittedAtIso());
            entry.updatedAtIso = firstNonBlank(entry.updatedAtIso, state.getUpdatedDate());
            entry.organizerNote = safeText(state.getOrganizerNote());
        }

        for (FeedbackAnswer answer : feedbackAnswersRepository.findByEventIdInOrderByEventIdAscSubmittedAtIsoDesc(ownedEventIds)) {
            if (answer == null) {
                continue;
            }
            String eventId = normalizeId(answer.getEventId());
            String viewerUserId = normalizeId(answer.getViewerUserId());
            if (!StringUtils.hasText(eventId) || !StringUtils.hasText(viewerUserId) || Objects.equals(userId, viewerUserId)) {
                continue;
            }
            viewerUserIds.add(viewerUserId);
            ReceivedFeedbackEntryAccumulator entry = ensureReceivedFeedbackEntry(entriesByEventId, eventId, viewerUserId);
            String submittedAtIso = safeText(answer.getSubmittedAtIso());
            entry.submittedAtIso = firstNonBlank(entry.submittedAtIso, submittedAtIso);
            entry.updatedAtIso = firstNonBlank(entry.updatedAtIso, submittedAtIso);
            entry.answers.add(toAnswerDto(answer));
        }

        Map<String, ViewerIdentity> viewerIdentitiesByUserId = buildViewerIdentities(viewerUserIds);
        List<FeedbackReceivedEventDto> receivedEvents = new ArrayList<>();
        for (String eventId : ownedEventIds) {
            Map<String, ReceivedFeedbackEntryAccumulator> eventEntries = entriesByEventId.get(eventId);
            if (eventEntries == null || eventEntries.isEmpty()) {
                continue;
            }
            List<FeedbackReceivedEntryDto> entries = eventEntries.values().stream()
                    .map(entry -> toReceivedEntryDto(entry, viewerIdentitiesByUserId.get(entry.viewerUserId)))
                    .filter(entry -> StringUtils.hasText(entry.organizerNote()) || !entry.answers().isEmpty())
                    .sorted((left, right) -> receivedEntrySortIso(right).compareTo(receivedEntrySortIso(left)))
                    .toList();
            if (!entries.isEmpty()) {
                receivedEvents.add(new FeedbackReceivedEventDto(eventId, entries));
            }
        }
        return receivedEvents;
    }

    private List<FeedbackStatRecord> queryFeedbackStatRecords(String userId, String eventId) {
        String normalizedUserId = normalizeId(userId);
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedEventId)) {
            return List.of();
        }

        Map<String, FeedbackStatAccumulator> entriesByViewerUserId = new LinkedHashMap<>();
        for (FeedbackState state : feedbackStatesRepository.findByEventIdInOrderByEventIdAscUpdatedDateDesc(List.of(normalizedEventId))) {
            if (state == null) {
                continue;
            }
            String viewerUserId = normalizeId(state.getViewerUserId());
            String stateEventId = normalizeId(state.getEventId());
            if (!Objects.equals(normalizedEventId, stateEventId)
                    || !StringUtils.hasText(viewerUserId)
                    || Objects.equals(normalizedUserId, viewerUserId)) {
                continue;
            }
            FeedbackStatAccumulator entry = ensureFeedbackStatEntry(entriesByViewerUserId, normalizedEventId, viewerUserId);
            entry.submittedAtIso = firstNonBlank(entry.submittedAtIso, state.getSubmittedAtIso());
            entry.updatedAtIso = firstNonBlank(entry.updatedAtIso, state.getUpdatedDate());
            if (StringUtils.hasText(state.getOrganizerNote())) {
                entry.visible = true;
            }
        }

        for (FeedbackAnswer answer : feedbackAnswersRepository.findByEventIdInOrderByEventIdAscSubmittedAtIsoDesc(List.of(normalizedEventId))) {
            if (answer == null) {
                continue;
            }
            String viewerUserId = normalizeId(answer.getViewerUserId());
            String answerEventId = normalizeId(answer.getEventId());
            if (!Objects.equals(normalizedEventId, answerEventId)
                    || !StringUtils.hasText(viewerUserId)
                    || Objects.equals(normalizedUserId, viewerUserId)) {
                continue;
            }
            FeedbackStatAccumulator entry = ensureFeedbackStatEntry(entriesByViewerUserId, normalizedEventId, viewerUserId);
            String submittedAtIso = safeText(answer.getSubmittedAtIso());
            entry.submittedAtIso = firstNonBlank(entry.submittedAtIso, submittedAtIso);
            entry.updatedAtIso = firstNonBlank(entry.updatedAtIso, submittedAtIso);
            entry.visible = true;
            if ("event".equalsIgnoreCase(safeText(answer.getKind()))) {
                entry.overallValue = firstNonBlank(entry.overallValue, answer.getPrimaryValue());
                entry.improveValue = firstNonBlank(entry.improveValue, answer.getSecondaryValue());
                if (entry.personalityTraitIds.isEmpty()) {
                    entry.personalityTraitIds.addAll(normalizeIds(answer.getPersonalityTraitIds()));
                }
            }
        }

        return entriesByViewerUserId.values().stream()
                .filter(entry -> entry.visible)
                .map(entry -> new FeedbackStatRecord(
                        entry.eventId,
                        entry.viewerUserId,
                        safeText(entry.submittedAtIso),
                        safeText(entry.updatedAtIso),
                        safeText(entry.overallValue),
                        safeText(entry.improveValue),
                        List.copyOf(entry.personalityTraitIds)))
                .sorted((left, right) -> firstNonBlank(right.updatedAtIso(), right.submittedAtIso())
                        .compareTo(firstNonBlank(left.updatedAtIso(), left.submittedAtIso())))
                .toList();
    }

    private FeedbackStatAccumulator ensureFeedbackStatEntry(
            Map<String, FeedbackStatAccumulator> entriesByViewerUserId,
            String eventId,
            String viewerUserId) {
        return entriesByViewerUserId.computeIfAbsent(
                viewerUserId,
                key -> new FeedbackStatAccumulator(eventId, viewerUserId));
    }

    private List<Event> queryFeedbackCandidateEvents(String userId) {
        return uniqueFeedbackEvents(activityEventsRepository.findAcceptedMembershipEvents(userId)).stream()
                .filter(record -> canUserFeedbackEvent(userId, record))
                .filter(this::isFeedbackUnlocked)
                .sorted(Comparator
                        .comparing((Event record) -> eventStartAtMs(record), Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(record -> safeText(record.getTitle()))
                        .thenComparing(record -> safeText(record.getSourceId())))
                .toList();
    }

    private List<Event> queryOrganizerFeedbackEvents(String userId) {
        return uniqueFeedbackEvents(activityEventsRepository.findAdminVisibleEvents(userId)).stream()
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .filter(record -> isEventAdmin(record, userId))
                .filter(this::isFeedbackUnlocked)
                .sorted(Comparator
                        .comparing((Event record) -> eventStartAtMs(record), Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(record -> safeText(record.getTitle()))
                        .thenComparing(record -> safeText(record.getSourceId())))
                .toList();
    }

    private Event findFeedbackEventForDetail(String userId, String eventId) {
        return uniqueFeedbackEvents(activityEventsRepository.findBySourceId(eventId)).stream()
                .filter(record -> canUserFeedbackEvent(userId, record))
                .filter(this::isFeedbackUnlocked)
                .findFirst()
                .orElse(null);
    }

    private boolean canUserFeedbackEvent(String userId, Event record) {
        if (record == null || !StringUtils.hasText(userId) || Boolean.TRUE.equals(record.getIsTrashed())) {
            return false;
        }
        String eventId = normalizeId(record.getSourceId());
        if (!StringUtils.hasText(eventId) || isEventAdmin(record, userId)) {
            return false;
        }
        return normalizeIds(record.getAcceptedMemberUserIds()).contains(userId);
    }

    private boolean isEventAdmin(Event record, String userId) {
        if (record == null || !StringUtils.hasText(userId)) {
            return false;
        }
        if (userId.equals(normalizeId(record.getCreatorUserId())) || userId.equals(normalizeId(record.getOwnerUserId()))) {
            return true;
        }
        return normalizeIds(record.getAdmins()).contains(userId);
    }

    private List<Event> uniqueFeedbackEvents(Collection<? extends Event> records) {
        Map<String, Event> bySourceId = new LinkedHashMap<>();
        for (Event record : records == null ? List.<Event>of() : records) {
            String eventId = normalizeId(record == null ? null : record.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            Event current = bySourceId.get(eventId);
            if (current == null || shouldPreferFeedbackEvent(record, current)) {
                bySourceId.put(eventId, record);
            }
        }
        return new ArrayList<>(bySourceId.values());
    }

    private boolean shouldPreferFeedbackEvent(Event next, Event current) {
        boolean nextCanonical = isCanonicalFeedbackEvent(next);
        boolean currentCanonical = isCanonicalFeedbackEvent(current);
        if (nextCanonical != currentCanonical) {
            return nextCanonical;
        }
        return acceptedMemberCount(next) >= acceptedMemberCount(current);
    }

    private boolean isCanonicalFeedbackEvent(Event record) {
        String creatorUserId = normalizeId(record == null ? null : record.getCreatorUserId());
        return record != null && StringUtils.hasText(creatorUserId)
                && creatorUserId.equals(normalizeId(record.getOwnerUserId()));
    }

    private boolean isMingleEvent(Event event) {
        return event != null && "Mingle".equalsIgnoreCase(event.getMode());
    }

    private Map<String, Set<String>> completedMinglePeers(String viewerId, Collection<Event> events) {
        Set<String> eventIds = new LinkedHashSet<>();
        for (Event event : events) {
            if (isMingleEvent(event)) addNormalizedId(eventIds, event.getSourceId());
        }
        Map<String, Set<String>> peers = new LinkedHashMap<>();
        if (eventIds.isEmpty()) return peers;
        for (MingleEncounters.Round round : mingleRoundsRepository
                .completedRounds(eventIds)) {
            for (MingleEncounters.Table table : round.getTables()) {
                if (table == null || table.memberUserIds() == null) continue;
                Set<String> participants = new LinkedHashSet<>();
                table.memberUserIds().forEach(id -> addNormalizedId(participants, id));
                if (participants.remove(viewerId)) {
                    peers.computeIfAbsent(normalizeId(round.getEventId()), ignored -> new LinkedHashSet<>())
                            .addAll(participants);
                }
            }
        }
        return peers;
    }

    private Map<String, ProfileSummary> buildFeedbackUsersById(
            ProfileSummary activeUser,
            Collection<Event> feedbackEvents,
            Collection<Event> organizerEvents,
            Map<String, Set<String>> minglePeers) {
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        String activeUserId = normalizeId(activeUser == null ? null : activeUser.getUserId());
        if (StringUtils.hasText(activeUserId)) {
            userIds.add(activeUserId);
        }
        collectEventUserIds(userIds, feedbackEvents);
        collectEventUserIds(userIds, organizerEvents);
        minglePeers.values().forEach(userIds::addAll);
        Map<String, ProfileSummary> usersById = new LinkedHashMap<>();
        if (!userIds.isEmpty()) {
            for (ProfileSummary user : usersRepository.findByUserIdIn(userIds)) {
                String userId = normalizeId(user == null ? null : user.getUserId());
                if (StringUtils.hasText(userId)) {
                    usersById.put(userId, user);
                }
            }
        }
        if (StringUtils.hasText(activeUserId) && activeUser != null) {
            usersById.put(activeUserId, activeUser);
        }
        return usersById;
    }

    private void collectEventUserIds(Set<String> userIds, Collection<? extends Event> records) {
        for (Event record : records == null ? List.<Event>of() : records) {
            addNormalizedId(userIds, record == null ? null : record.getCreatorUserId());
            addNormalizedId(userIds, record == null ? null : record.getOwnerUserId());
            if (isMingleEvent(record)) {
                continue;
            }
            for (String userId : record == null ? List.<String>of() : record.getAcceptedMemberUserIds()) {
                addNormalizedId(userIds, userId);
            }
            for (String userId : record == null ? List.<String>of() : record.getPendingMemberUserIds()) {
                addNormalizedId(userIds, userId);
            }
        }
    }

    private void addNormalizedId(Set<String> userIds, String value) {
        String userId = normalizeId(value);
        if (StringUtils.hasText(userId)) {
            userIds.add(userId);
        }
    }

    private Map<String, List<FeedbackCardDto>> feedbackCardsByEventId(
            Collection<? extends Event> records,
            Map<String, ProfileSummary> usersById,
            ProfileSummary activeUser,
            Map<String, Set<String>> minglePeers) {
        Map<String, List<FeedbackCardDto>> cardsByEventId = new LinkedHashMap<>();
        for (Event record : records == null ? List.<Event>of() : records) {
            for (FeedbackCardDto card : buildFeedbackCards(record, usersById, activeUser, minglePeers)) {
                cardsByEventId.computeIfAbsent(card.eventId(), ignored -> new ArrayList<>()).add(card);
            }
        }
        return cardsByEventId;
    }

    private List<FeedbackCardDto> buildFeedbackCards(
            Event record,
            Map<String, ProfileSummary> usersById,
            ProfileSummary activeUser,
            Map<String, Set<String>> minglePeers) {
        String eventId = normalizeId(record == null ? null : record.getSourceId());
        if (record == null || !StringUtils.hasText(eventId) || !isFeedbackUnlocked(record)) {
            return List.of();
        }
        String activeUserId = normalizeId(activeUser == null ? null : activeUser.getUserId());
        ProfileSummary host = feedbackHostUser(record, usersById, activeUser);
        String hostId = normalizeId(host == null ? null : host.getUserId());
        if (!StringUtils.hasText(hostId) || host == null) {
            return List.of();
        }

        List<FeedbackCardDto> cards = new ArrayList<>();
        cards.add(new FeedbackCardDto(
                "feedback-event-" + eventId,
                eventId,
                "event",
                null,
                hostId,
                "Admin",
                safeText(record.getTitle()),
                safeText(record.getSubtitle()),
                safeText(record.getImageUrl()),
                safeText(record.getTimeframe()),
                safeText(record.getStartAtIso()),
                feedbackWhenLabel(record),
                feedbackUserName(host, hostId),
                positiveInteger(host.getAge()),
                safeText(host.getCity()),
                normalizeGender(host.getGender()),
                safeText(host.getTraitLabel()),
                firstImageUrl(host),
                "",
                "",
                "",
                List.of()));

        for (ProfileSummary attendee : feedbackAttendeesForEvent(record, usersById, activeUserId, hostId, minglePeers)) {
            String attendeeUserId = normalizeId(attendee.getUserId());
            if (!StringUtils.hasText(attendeeUserId)) {
                continue;
            }
            cards.add(new FeedbackCardDto(
                    "feedback-attendee-" + eventId + "-" + attendeeUserId,
                    eventId,
                    "attendee",
                    attendeeUserId,
                    attendeeUserId,
                    "Member",
                    safeText(record.getTitle()),
                    safeText(record.getSubtitle()),
                    safeText(record.getImageUrl()),
                    safeText(record.getTimeframe()),
                    safeText(record.getStartAtIso()),
                    feedbackWhenLabel(record),
                    feedbackUserName(attendee, attendeeUserId),
                    positiveInteger(attendee.getAge()),
                    safeText(attendee.getCity()),
                    normalizeGender(attendee.getGender()),
                    safeText(attendee.getTraitLabel()),
                    firstImageUrl(attendee),
                    "",
                    "",
                    "",
                    List.of()));
        }
        return cards;
    }

    private ProfileSummary feedbackHostUser(Event record, Map<String, ProfileSummary> usersById, ProfileSummary activeUser) {
        String creatorUserId = normalizeId(record == null ? null : record.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId) && usersById.containsKey(creatorUserId)) {
            return usersById.get(creatorUserId);
        }
        String ownerUserId = normalizeId(record == null ? null : record.getOwnerUserId());
        if (StringUtils.hasText(ownerUserId) && usersById.containsKey(ownerUserId)) {
            return usersById.get(ownerUserId);
        }
        return activeUser;
    }

    private List<ProfileSummary> feedbackAttendeesForEvent(
            Event record,
            Map<String, ProfileSummary> usersById,
            String activeUserId,
            String hostId,
            Map<String, Set<String>> minglePeers) {
        LinkedHashSet<String> attendeeIds = new LinkedHashSet<>();
        boolean mingle = isMingleEvent(record);
        if (mingle) {
            attendeeIds.addAll(minglePeers.getOrDefault(normalizeId(record.getSourceId()), Set.of()));
        } else {
            for (String userId : record == null ? List.<String>of() : record.getAcceptedMemberUserIds()) {
                addNormalizedId(attendeeIds, userId);
            }
            for (String userId : record == null ? List.<String>of() : record.getPendingMemberUserIds()) {
                addNormalizedId(attendeeIds, userId);
            }
        }
        attendeeIds.remove(activeUserId);
        attendeeIds.remove(hostId);
        List<ProfileSummary> attendees = new ArrayList<>();
        for (String attendeeId : attendeeIds) {
            ProfileSummary attendee = usersById.get(attendeeId);
            if (attendee != null) {
                attendees.add(attendee);
            }
            if (!mingle && attendees.size() >= 5) {
                break;
            }
        }
        return attendees;
    }

    private List<FeedbackDto> buildFeedbackPageItems(
            Collection<? extends Event> records,
            Map<String, List<FeedbackCardDto>> cardsByEventId,
            FeedbackPageStateSnapshotDto state,
            String activeUserId) {
        List<FeedbackDto> items = new ArrayList<>();
        for (Event record : records == null ? List.<Event>of() : records) {
            if (record == null) { continue; }
            String eventId = normalizeId(record.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            List<FeedbackCardDto> cards = cardsByEventId.getOrDefault(eventId, List.of()).stream()
                    .filter(card -> !("attendee".equals(card.kind()) && Objects.equals(activeUserId, card.attendeeUserId())))
                    .toList();
            if (cards.isEmpty()) {
                continue;
            }
            boolean eventSubmitted = state.submittedEventsById().containsKey(eventId);
            int pendingCards = eventSubmitted
                    ? 0
                    : (int) cards.stream().filter(card -> !state.submittedCardsById().containsKey(card.id())).count();
            boolean isRemoved = state.removedEventsById().containsKey(eventId);
            Long startAtMs = eventStartAtMs(record);
            items.add(new FeedbackDto(
                    eventId,
                    safeText(record.getTitle()),
                    safeText(record.getSubtitle()),
                    safeText(record.getTimeframe()),
                    safeText(record.getImageUrl()),
                    startAtMs == null ? 0L : startAtMs,
                    pendingCards,
                    cards.size(),
                    isRemoved,
                    !isRemoved && pendingCards == 0,
                    isoToMs(state.submittedEventsById().get(eventId)),
                    isoToMs(state.removedEventDatesById().get(eventId)),
                    false));
        }
        return sortPendingItems(items);
    }

    private List<FeedbackDto> buildOrganizerPageItems(
            Collection<? extends Event> records,
            Map<String, List<FeedbackReceivedEntryDto>> receivedByEventId) {
        List<FeedbackDto> items = new ArrayList<>();
        for (Event record : records == null ? List.<Event>of() : records) {
            if (record == null) { continue; }
            String eventId = normalizeId(record.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            List<FeedbackReceivedEntryDto> entries = receivedByEventId.getOrDefault(eventId, List.of());
            Long startAtMs = eventStartAtMs(record);
            items.add(new FeedbackDto(
                    eventId,
                    safeText(record.getTitle()),
                    safeText(record.getSubtitle()),
                    safeText(record.getTimeframe()),
                    safeText(record.getImageUrl()),
                    startAtMs == null ? 0L : startAtMs,
                    entries.size(),
                    entries.size(),
                    false,
                    false,
                    entriesLatestAtMs(entries),
                    null,
                    true));
        }
        return items.stream()
                .sorted(this::compareOrganizerItems)
                .toList();
    }

    private List<FeedbackDto> filterPageItems(
            String filter,
            List<FeedbackDto> allItems,
            List<FeedbackDto> organizerItems) {
        return switch (filter) {
            case "own-events" -> List.copyOf(organizerItems);
            case "feedbacked" -> allItems.stream()
                    .filter(item -> Boolean.TRUE.equals(item.isFeedbacked()))
                    .sorted(this::compareFeedbackedItems)
                    .toList();
            case "removed" -> allItems.stream()
                    .filter(item -> Boolean.TRUE.equals(item.isRemoved()))
                    .sorted(this::compareRemovedItems)
                    .toList();
            case "pending" -> sortPendingItems(allItems.stream()
                    .filter(item -> !Boolean.TRUE.equals(item.isRemoved()) && positiveCount(item.pendingCards()) > 0)
                    .toList());
            default -> sortPendingItems(allItems.stream()
                    .filter(item -> !Boolean.TRUE.equals(item.isRemoved()) && positiveCount(item.pendingCards()) > 0)
                    .toList());
        };
    }

    private List<FeedbackDto> sortPendingItems(Collection<FeedbackDto> items) {
        return (items == null ? List.<FeedbackDto>of() : items).stream()
                .sorted(this::comparePendingItems)
                .toList();
    }

    private int comparePendingItems(FeedbackDto left, FeedbackDto right) {
        int delta = compareDates(left.startAtMs(), right.startAtMs(), true);
        if (delta != 0) {
            return delta;
        }
        return safeText(left.title()).compareTo(safeText(right.title()));
    }

    private int compareOrganizerItems(FeedbackDto left, FeedbackDto right) {
        int delta = comparePendingItems(left, right);
        if (delta != 0) {
            return delta;
        }
        delta = Integer.compare(positiveCount(right.totalCards()), positiveCount(left.totalCards()));
        if (delta != 0) {
            return delta;
        }
        return compareDates(left.feedbackedAtMs(), right.feedbackedAtMs(), false);
    }

    private int compareFeedbackedItems(FeedbackDto left, FeedbackDto right) {
        int delta = compareDates(
                firstPositive(left.feedbackedAtMs(), left.startAtMs()),
                firstPositive(right.feedbackedAtMs(), right.startAtMs()),
                false);
        if (delta != 0) {
            return delta;
        }
        return safeText(right.title()).compareTo(safeText(left.title()));
    }

    private int compareRemovedItems(FeedbackDto left, FeedbackDto right) {
        int delta = compareDates(
                firstPositive(left.removedAtMs(), left.feedbackedAtMs(), left.startAtMs()),
                firstPositive(right.removedAtMs(), right.feedbackedAtMs(), right.startAtMs()),
                false);
        if (delta != 0) {
            return delta;
        }
        return safeText(right.title()).compareTo(safeText(left.title()));
    }

    private int compareDates(Long leftMs, Long rightMs, boolean ascending) {
        Long left = positiveLong(leftMs);
        Long right = positiveLong(rightMs);
        if (left == null && right == null) {
            return 0;
        }
        if (left == null) {
            return 1;
        }
        if (right == null) {
            return -1;
        }
        return ascending ? Long.compare(left, right) : Long.compare(right, left);
    }

    private FeedbackPageCountsDto counts(com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserFeedbackCountersDto feedback) {
        return new FeedbackPageCountsDto(
                positiveCount(feedback == null ? null : feedback.ownEvents()),
                positiveCount(feedback == null ? null : feedback.pending()),
                positiveCount(feedback == null ? null : feedback.feedbacked()),
                positiveCount(feedback == null ? null : feedback.removed()));
    }

    private FeedbackPageStateSnapshotDto pageStateSnapshot(List<FeedbackStateDto> states) {
        Map<String, Boolean> submittedCardsById = new LinkedHashMap<>();
        Map<String, FeedbackAnswerDto> submittedAnswersByCardId = new LinkedHashMap<>();
        Map<String, String> submittedEventsById = new LinkedHashMap<>();
        Map<String, Boolean> removedEventsById = new LinkedHashMap<>();
        Map<String, String> removedEventDatesById = new LinkedHashMap<>();
        Map<String, String> organizerNotesByEventId = new LinkedHashMap<>();
        for (FeedbackStateDto state : states == null ? List.<FeedbackStateDto>of() : states) {
            if (state == null) { continue; }
            String eventId = normalizeId(state.eventId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            if (Boolean.TRUE.equals(state.removed())) {
                removedEventsById.put(eventId, true);
                String removedAtIso = safeText(state.removedAtIso());
                if (StringUtils.hasText(removedAtIso)) {
                    removedEventDatesById.put(eventId, removedAtIso);
                }
            }
            String submittedAtIso = safeText(state.submittedAtIso());
            if (StringUtils.hasText(submittedAtIso)) {
                submittedEventsById.put(eventId, submittedAtIso);
            }
            String organizerNote = safeText(state.organizerNote());
            if (StringUtils.hasText(organizerNote)) {
                organizerNotesByEventId.put(eventId, organizerNote);
            }
            for (Map.Entry<String, FeedbackAnswerDto> answerEntry : (state.answersByCardId() == null ? Map.<String, FeedbackAnswerDto>of() : state.answersByCardId()).entrySet()) {
                String cardId = normalizeId(answerEntry.getKey());
                FeedbackAnswerDto answer = answerEntry.getValue();
                if (!StringUtils.hasText(cardId) || answer == null) {
                    continue;
                }
                submittedCardsById.put(cardId, true);
                submittedAnswersByCardId.put(cardId, answer);
            }
        }
        return new FeedbackPageStateSnapshotDto(
                submittedCardsById,
                submittedAnswersByCardId,
                submittedEventsById,
                removedEventsById,
                removedEventDatesById,
                organizerNotesByEventId);
    }

    private FeedbackPageResultDto emptyPageResult() {
        FeedbackPageStateSnapshotDto state = new FeedbackPageStateSnapshotDto(
                Map.of(),
                Map.of(),
                Map.of(),
                Map.of(),
                Map.of(),
                Map.of());
        return new FeedbackPageResultDto(
                List.of(),
                0,
                List.of(),
                List.of(),
                List.of(),
                state,
                new FeedbackPageCountsDto(0, 0, 0, 0));
    }

    private FeedbackDetailDto emptyDetailResult(String eventId) {
        return new FeedbackDetailDto(safeText(eventId), "", "", "", List.of());
    }

    private FeedbackStatDto emptyStatResult(String eventId) {
        return new FeedbackStatDto(safeText(eventId), 0, List.of());
    }

    private Map<String, List<FeedbackReceivedEntryDto>> receivedEntriesByEventId(
            List<FeedbackReceivedEventDto> receivedEvents) {
        Map<String, List<FeedbackReceivedEntryDto>> entriesByEventId = new LinkedHashMap<>();
        for (FeedbackReceivedEventDto event : receivedEvents == null ? List.<FeedbackReceivedEventDto>of() : receivedEvents) {
            if (event == null) { continue; }
            String eventId = normalizeId(event.eventId());
            if (StringUtils.hasText(eventId)) {
                entriesByEventId.put(eventId, event.entries() == null ? List.of() : List.copyOf(event.entries()));
            }
        }
        return entriesByEventId;
    }

    private List<String> eventSourceIds(Collection<? extends Event> records) {
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        for (Event record : records == null ? List.<Event>of() : records) {
            addNormalizedId(ids, record == null ? null : record.getSourceId());
        }
        return new ArrayList<>(ids);
    }

    private boolean isFeedbackUnlocked(Event record) {
        Long endAtMs = eventEndAtMs(record);
        return endAtMs != null && Instant.now().toEpochMilli() >= endAtMs + FEEDBACK_UNLOCK_DELAY_MS;
    }

    private Long eventEndAtMs(Event record) {
        String endAtIso = safeText(record == null ? null : record.getEndAtIso());
        if (!StringUtils.hasText(endAtIso)) {
            return null;
        }
        try {
            return Instant.parse(endAtIso).toEpochMilli();
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private Long eventStartAtMs(Event record) {
        String startAtIso = safeText(record == null ? null : record.getStartAtIso());
        if (!StringUtils.hasText(startAtIso)) {
            return null;
        }
        try {
            return Instant.parse(startAtIso).toEpochMilli();
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private String feedbackWhenLabel(Event record) {
        Long startAtMs = eventStartAtMs(record);
        if (startAtMs == null) {
            return "Recent event";
        }
        return FEEDBACK_LABEL_FORMATTER.format(Instant.ofEpochMilli(startAtMs));
    }

    private Long entriesLatestAtMs(Collection<FeedbackReceivedEntryDto> entries) {
        Long latestAtMs = null;
        for (FeedbackReceivedEntryDto entry : entries == null ? List.<FeedbackReceivedEntryDto>of() : entries) {
            Long candidate = receivedEntryTimestampMs(entry);
            if (candidate == null || candidate <= 0L) {
                continue;
            }
            latestAtMs = latestAtMs == null ? candidate : Math.max(latestAtMs, candidate);
        }
        return latestAtMs;
    }

    private Long receivedEntryTimestampMs(FeedbackReceivedEntryDto entry) {
        Long updatedAtMs = isoToMs(entry == null ? null : entry.updatedAtIso());
        if (updatedAtMs != null) {
            return updatedAtMs;
        }
        Long submittedAtMs = isoToMs(entry == null ? null : entry.submittedAtIso());
        if (submittedAtMs != null) {
            return submittedAtMs;
        }
        for (FeedbackAnswerDto answer : entry == null || entry.answers() == null ? List.<FeedbackAnswerDto>of() : entry.answers()) {
            Long answerAtMs = isoToMs(answer == null ? null : answer.submittedAtIso());
            if (answerAtMs != null) {
                return answerAtMs;
            }
        }
        return null;
    }

    private Long isoToMs(String iso) {
        String normalizedIso = safeText(iso);
        if (!StringUtils.hasText(normalizedIso)) {
            return null;
        }
        try {
            return Instant.parse(normalizedIso).toEpochMilli();
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private int normalizePage(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private int normalizePageSize(Integer value) {
        return Math.max(1, Math.min(50,value == null ? 1 : value));
    }

    private String normalizeFeedbackFilter(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "own-events", "feedbacked", "removed" -> normalized;
            default -> "pending";
        };
    }

    private int acceptedMemberCount(Event record) {
        return normalizeIds(record == null ? null : record.getAcceptedMemberUserIds()).size();
    }

    private int positiveCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private Integer positiveInteger(Integer value) {
        return value == null || value <= 0 ? null : value;
    }

    private Long positiveLong(Long value) {
        return value == null || value <= 0L ? null : value;
    }

    private Long firstPositive(Long... values) {
        for (Long value : values == null ? new Long[0] : values) {
            if (value != null && value > 0L) {
                return value;
            }
        }
        return null;
    }

    private List<String> normalizeIds(Collection<String> values) {
        if (values == null) {
            return List.of();
        }
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String value : values) {
            String id = normalizeId(value);
            if (StringUtils.hasText(id)) {
                normalized.add(id);
            }
        }
        return new ArrayList<>(normalized);
    }

    private String feedbackUserName(ProfileSummary user, String fallbackUserId) {
        String name = safeText(user == null ? null : user.getName());
        return StringUtils.hasText(name) ? name : safeText(fallbackUserId);
    }

    private String firstImageUrl(ProfileSummary user) {
        if (user == null || user.getImages() == null) {
            return "";
        }
        for (String imageUrl : user.getImages()) {
            String normalizedImageUrl = safeText(imageUrl);
            if (StringUtils.hasText(normalizedImageUrl)) {
                return normalizedImageUrl;
            }
        }
        return "";
    }

    private FeedbackState findOrCreateState(String userId, String eventId, String nowIso) {
        return counterWork.finish(feedbackStatesRepository.findByViewerUserIdAndEventId(userId, eventId)
                .orElseGet(() -> createState(userId, eventId, nowIso)));
    }

    private FeedbackState createState(String userId, String eventId, String nowIso) {
        FeedbackState state = new FeedbackState();
        state.setId(new ObjectId().toHexString());
        state.setSyncKey(UUID.randomUUID().toString());
        state.setViewerUserId(userId);
        state.setEventId(eventId);
        state.setRemoved(false);
        state.setSubmittedAtIso(null);
        state.setRemovedAtIso(null);
        state.setOrganizerNote("");
        state.setCreatedDate(nowIso);
        state.setCreatedUser(userId);
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(userId);
        return state;
    }

    private FeedbackAnswer createAnswer(String userId, String eventId, String cardId, String nowIso) {
        FeedbackAnswer answer = new FeedbackAnswer();
        answer.setId(new ObjectId().toHexString());
        answer.setSyncKey(UUID.randomUUID().toString());
        answer.setViewerUserId(userId);
        answer.setEventId(eventId);
        answer.setCardId(cardId);
        answer.setCreatedDate(nowIso);
        answer.setCreatedUser(userId);
        answer.setUpdatedDate(nowIso);
        answer.setUpdatedUser(userId);
        return answer;
    }

    private List<FeedbackCardDto> safeDetailCards(List<FeedbackCardDto> cards) {
        return cards == null ? List.of() : cards;
    }

    private FeedbackCardDto mergeFeedbackAnswer(
            FeedbackCardDto card,
            FeedbackAnswer answer) {
        if (card == null || answer == null) {
            return card;
        }
        return new FeedbackCardDto(
                card.id(),
                card.eventId(),
                card.kind(),
                card.attendeeUserId(),
                card.targetUserId(),
                card.targetRole(),
                card.eventTitle(),
                card.eventSubtitle(),
                card.eventImageUrl(),
                card.eventTimeframe(),
                card.eventStartAtIso(),
                card.eventLabel(),
                card.targetName(),
                card.targetAge(),
                card.targetCity(),
                card.targetGender(),
                card.targetTraitLabel(),
                card.targetImageUrl(),
                safeText(answer.getPrimaryValue()),
                safeText(answer.getSecondaryValue()),
                safeText(answer.getEventComment()),
                answer.getPersonalityTraitIds() == null
                        ? List.of()
                        : answer.getPersonalityTraitIds().stream()
                                .map(this::safeText)
                                .filter(StringUtils::hasText)
                                .toList());
    }

    private FeedbackAnswer findFeedbackAnswer(
            FeedbackCardDto card,
            Map<String, FeedbackAnswer> answersByCardId,
            List<FeedbackAnswer> answers) {
        if (card == null) {
            return null;
        }
        FeedbackAnswer directAnswer = answersByCardId.get(normalizeId(card.id()));
        if (directAnswer != null) {
            return directAnswer;
        }
        String kind = safeText(card.kind());
        String targetUserId = normalizeId(card.targetUserId());
        return (answers == null ? List.<FeedbackAnswer>of() : answers).stream()
                .filter(Objects::nonNull)
                .filter(answer -> kind.equals(safeText(answer.getKind())))
                .filter(answer -> "event".equals(kind)
                        || targetUserId.equals(normalizeId(answer.getTargetUserId())))
                .findFirst()
                .orElse(null);
    }

    private Map<String, Map<String, FeedbackAnswerDto>> buildAnswersByEventId(String userId) {
        Map<String, Map<String, FeedbackAnswerDto>> answersByEventId = new LinkedHashMap<>();
        for (FeedbackAnswer answer : feedbackAnswersRepository.findByViewerUserIdOrderByEventIdAscSubmittedAtIsoDesc(userId)) {
            if (answer == null) {
                continue;
            }
            String eventId = normalizeId(answer.getEventId());
            String cardId = normalizeId(answer.getCardId());
            if (!StringUtils.hasText(eventId) || !StringUtils.hasText(cardId)) {
                continue;
            }
            answersByEventId
                    .computeIfAbsent(eventId, ignored -> new LinkedHashMap<>())
                    .put(cardId, toAnswerDto(answer));
        }
        return answersByEventId;
    }

    private FeedbackAnswerDto toAnswerDto(FeedbackAnswer answer) {
        return new FeedbackAnswerDto(
                normalizeId(answer.getCardId()),
                normalizeId(answer.getEventId()),
                safeText(answer.getKind()),
                normalizeId(answer.getTargetUserId()),
                safeText(answer.getTargetRole()),
                safeText(answer.getPrimaryValue()),
                safeText(answer.getSecondaryValue()),
                safeText(answer.getEventComment()),
                answer.getPersonalityTraitIds() == null
                        ? List.of()
                        : answer.getPersonalityTraitIds().stream().map(this::safeText).filter(StringUtils::hasText).toList(),
                answer.getTags() == null
                        ? List.of()
                        : answer.getTags().stream().map(this::safeText).filter(StringUtils::hasText).toList(),
                safeText(answer.getSubmittedAtIso()));
    }

    private String normalizeEventComment(String value) {
        String normalized = safeText(value);
        if (normalized.codePointCount(0, normalized.length()) > EVENT_COMMENT_MAX_CODE_POINTS) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Event feedback comments may contain at most 160 characters.");
        }
        return normalized;
    }

    private FeedbackStateDto toDto(FeedbackState state, Map<String, FeedbackAnswerDto> answersByCardId) {
        return new FeedbackStateDto(
                normalizeId(state.getEventId()),
                Boolean.TRUE.equals(state.getRemoved()),
                safeText(state.getSubmittedAtIso()),
                safeText(state.getRemovedAtIso()),
                safeText(state.getOrganizerNote()),
                answersByCardId == null ? Map.of() : Map.copyOf(answersByCardId));
    }

    private String stateSortIso(FeedbackState state) {
        if (state == null) {
            return "";
        }
        if (Boolean.TRUE.equals(state.getRemoved())) {
            return firstNonBlank(
                    state.getRemovedAtIso(),
                    firstNonBlank(state.getUpdatedDate(), firstNonBlank(state.getSubmittedAtIso(), state.getCreatedDate())));
        }
        return firstNonBlank(state.getSubmittedAtIso(), firstNonBlank(state.getUpdatedDate(), state.getCreatedDate()));
    }

    private ReceivedFeedbackEntryAccumulator ensureReceivedFeedbackEntry(
            Map<String, Map<String, ReceivedFeedbackEntryAccumulator>> entriesByEventId,
            String eventId,
            String viewerUserId) {
        return entriesByEventId
                .computeIfAbsent(eventId, ignored -> new LinkedHashMap<>())
                .computeIfAbsent(viewerUserId, ignored -> new ReceivedFeedbackEntryAccumulator(viewerUserId, eventId));
    }

    private Map<String, ViewerIdentity> buildViewerIdentities(Set<String> viewerUserIds) {
        if (viewerUserIds == null || viewerUserIds.isEmpty()) {
            return Map.of();
        }
        Map<String, ViewerIdentity> identitiesByUserId = new LinkedHashMap<>();
        for (ProfileSummary user : usersRepository.findByUserIdIn(viewerUserIds)) {
            if (user == null || !StringUtils.hasText(normalizeId(user.getUserId()))) {
                continue;
            }
            String viewerUserId = normalizeId(user.getUserId());
            String viewerName = safeText(user.getName());
            identitiesByUserId.put(viewerUserId, new ViewerIdentity(
                    StringUtils.hasText(viewerName) ? viewerName : viewerUserId,
                    resolveUserInitials(user, viewerUserId),
                    normalizeGender(user.getGender()),
                    resolveUserImageUrl(user)));
        }
        for (String viewerUserId : viewerUserIds) {
            if (!StringUtils.hasText(viewerUserId) || identitiesByUserId.containsKey(viewerUserId)) {
                continue;
            }
            identitiesByUserId.put(viewerUserId, new ViewerIdentity(
                    viewerUserId,
                    initialsFromText(viewerUserId),
                    "man",
                    ""));
        }
        return identitiesByUserId;
    }

    private FeedbackReceivedEntryDto toReceivedEntryDto(
            ReceivedFeedbackEntryAccumulator entry,
            ViewerIdentity viewerIdentity) {
        ViewerIdentity resolvedViewerIdentity = viewerIdentity == null
                ? new ViewerIdentity(
                        safeText(entry.viewerUserId),
                        initialsFromText(entry.viewerUserId),
                        "man",
                        "")
                : viewerIdentity;
        return new FeedbackReceivedEntryDto(
                safeText(entry.viewerUserId),
                safeText(resolvedViewerIdentity.name),
                safeText(resolvedViewerIdentity.initials),
                safeText(resolvedViewerIdentity.gender),
                safeText(resolvedViewerIdentity.imageUrl),
                safeText(entry.eventId),
                safeText(entry.submittedAtIso),
                safeText(entry.updatedAtIso),
                safeText(entry.organizerNote),
                List.copyOf(entry.answers));
    }

    private String receivedEntrySortIso(FeedbackReceivedEntryDto entry) {
        String updatedAtIso = safeText(entry.updatedAtIso());
        if (StringUtils.hasText(updatedAtIso)) {
            return updatedAtIso;
        }
        String submittedAtIso = safeText(entry.submittedAtIso());
        if (StringUtils.hasText(submittedAtIso)) {
            return submittedAtIso;
        }
        for (FeedbackAnswerDto answer : entry.answers()) {
            String answerIso = safeText(answer.submittedAtIso());
            if (StringUtils.hasText(answerIso)) {
                return answerIso;
            }
        }
        return "";
    }

    private String firstNonBlank(String first, String fallback) {
        String firstValue = safeText(first);
        if (StringUtils.hasText(firstValue)) {
            return firstValue;
        }
        return safeText(fallback);
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeGender(String value) {
        return "woman".equals(safeText(value)) ? "woman" : "man";
    }

    private String resolveUserImageUrl(ProfileSummary user) {
        if (user == null || user.getImages() == null || user.getImages().isEmpty()) {
            return "";
        }
        return safeText(user.getImages().get(0));
    }

    private String resolveUserInitials(ProfileSummary user, String fallbackUserId) {
        if (user != null && StringUtils.hasText(safeText(user.getInitials()))) {
            return safeText(user.getInitials());
        }
        String fallbackName = user == null ? "" : safeText(user.getName());
        return initialsFromText(StringUtils.hasText(fallbackName) ? fallbackName : fallbackUserId);
    }

    private String initialsFromText(String value) {
        return com.raxim.myscoutee.common.util.TextValues.firstTwoInitials(value);
    }

    private static final class ReceivedFeedbackEntryAccumulator {
        private final String viewerUserId;
        private final String eventId;
        private String submittedAtIso = "";
        private String updatedAtIso = "";
        private String organizerNote = "";
        private final List<FeedbackAnswerDto> answers = new ArrayList<>();

        private ReceivedFeedbackEntryAccumulator(String viewerUserId, String eventId) {
            this.viewerUserId = viewerUserId;
            this.eventId = eventId;
        }
    }

    private static final class FeedbackStatAccumulator {
        private final String eventId;
        private final String viewerUserId;
        private String submittedAtIso = "";
        private String updatedAtIso = "";
        private String overallValue = "";
        private String improveValue = "";
        private boolean visible = false;
        private final List<String> personalityTraitIds = new ArrayList<>();

        private FeedbackStatAccumulator(String eventId, String viewerUserId) {
            this.eventId = eventId;
            this.viewerUserId = viewerUserId;
        }
    }

    private static final class ViewerIdentity {
        private final String name;
        private final String initials;
        private final String gender;
        private final String imageUrl;

        private ViewerIdentity(String name, String initials, String gender, String imageUrl) {
            this.name = name;
            this.initials = initials;
            this.gender = gender;
            this.imageUrl = imageUrl;
        }
    }
}
