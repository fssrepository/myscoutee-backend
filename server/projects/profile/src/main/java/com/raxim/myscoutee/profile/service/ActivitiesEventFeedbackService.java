package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.EventFeedbackAnswer;
import com.raxim.myscoutee.profile.data.document.EventFeedbackState;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackAnswerDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackAnswerSubmitDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackNoteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackStateDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackToggleRequestDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackStatesRepository;

@Service
public class ActivitiesEventFeedbackService {
    private final HomeUserProfileService homeUserProfileService;
    private final ActivityEventsRepository activityEventsRepository;
    private final EventFeedbackStatesRepository eventFeedbackStatesRepository;
    private final EventFeedbackAnswersRepository eventFeedbackAnswersRepository;

    public ActivitiesEventFeedbackService(
            HomeUserProfileService homeUserProfileService,
            ActivityEventsRepository activityEventsRepository,
            EventFeedbackStatesRepository eventFeedbackStatesRepository,
            EventFeedbackAnswersRepository eventFeedbackAnswersRepository) {
        this.homeUserProfileService = homeUserProfileService;
        this.activityEventsRepository = activityEventsRepository;
        this.eventFeedbackStatesRepository = eventFeedbackStatesRepository;
        this.eventFeedbackAnswersRepository = eventFeedbackAnswersRepository;
    }

    public List<EventFeedbackStateDto> queryStates(String requestedUserId) {
        String userId = homeUserProfileService.resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            return List.of();
        }
        Map<String, Map<String, EventFeedbackAnswerDto>> answersByEventId = buildAnswersByEventId(userId);
        return eventFeedbackStatesRepository.findByViewerUserIdOrderByUpdatedDateDesc(userId).stream()
                .filter(Objects::nonNull)
                .map(state -> toDto(state, answersByEventId.get(normalizeId(state.getEventId()))))
                .toList();
    }

    public void submit(EventFeedbackSubmitRequestDto request) {
        String userId = resolveEligibleUserId(request == null ? null : request.userId(), request == null ? null : request.eventId());
        String eventId = normalizeId(request == null ? null : request.eventId());
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(eventId)) {
            return;
        }

        String nowIso = firstNonBlank(firstAnswerSubmittedAt(request == null ? null : request.answers()), Instant.now().toString());
        EventFeedbackState state = findOrCreateState(userId, eventId, nowIso);
        state.setRemoved(false);
        state.setSubmittedAtIso(nowIso);
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(userId);
        eventFeedbackStatesRepository.save(state);

        for (EventFeedbackAnswerSubmitDto answer : safeAnswers(request == null ? null : request.answers())) {
            String cardId = normalizeId(answer.cardId());
            if (!StringUtils.hasText(cardId)) {
                continue;
            }
            EventFeedbackAnswer document = eventFeedbackAnswersRepository
                    .findByViewerUserIdAndEventIdAndCardId(userId, eventId, cardId)
                    .orElseGet(() -> createAnswer(userId, eventId, cardId, nowIso));
            document.setKind(safeText(answer.kind()));
            document.setTargetUserId(normalizeId(answer.targetUserId()));
            document.setTargetRole(safeText(answer.targetRole()));
            document.setPrimaryValue(safeText(answer.primaryValue()));
            document.setSecondaryValue(safeText(answer.secondaryValue()));
            document.setPersonalityTraitIds(answer.personalityTraitIds() == null
                    ? List.of()
                    : answer.personalityTraitIds().stream().map(this::safeText).filter(StringUtils::hasText).toList());
            document.setTags(answer.tags() == null ? List.of() : answer.tags().stream().map(this::safeText).filter(StringUtils::hasText).toList());
            document.setSubmittedAtIso(firstNonBlank(answer.submittedAtIso(), nowIso));
            document.setUpdatedDate(nowIso);
            document.setUpdatedUser(userId);
            eventFeedbackAnswersRepository.save(document);
        }
    }

    public void saveNote(EventFeedbackNoteRequestDto request) {
        String userId = resolveEligibleUserId(request == null ? null : request.userId(), request == null ? null : request.eventId());
        String eventId = normalizeId(request == null ? null : request.eventId());
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(eventId)) {
            return;
        }
        String nowIso = Instant.now().toString();
        EventFeedbackState state = findOrCreateState(userId, eventId, nowIso);
        String organizerNote = request == null ? null : request.text();
        state.setOrganizerNote(safeText(organizerNote));
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(userId);
        eventFeedbackStatesRepository.save(state);
    }

    public void markRemoved(EventFeedbackToggleRequestDto request, boolean removed) {
        String userId = resolveEligibleUserId(request == null ? null : request.userId(), request == null ? null : request.eventId());
        String eventId = normalizeId(request == null ? null : request.eventId());
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(eventId)) {
            return;
        }
        String nowIso = Instant.now().toString();
        EventFeedbackState state = findOrCreateState(userId, eventId, nowIso);
        state.setRemoved(removed);
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(userId);
        eventFeedbackStatesRepository.save(state);
    }

    private String resolveEligibleUserId(String requestedUserId, String eventId) {
        String userId = homeUserProfileService.resolveSelectedUserId(requestedUserId);
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(normalizedEventId)) {
            return null;
        }
        boolean ownsEventRecord = activityEventsRepository.existsByOwnerUserIdAndSourceId(userId, normalizedEventId);
        return ownsEventRecord ? userId : null;
    }

    private EventFeedbackState findOrCreateState(String userId, String eventId, String nowIso) {
        return eventFeedbackStatesRepository.findByViewerUserIdAndEventId(userId, eventId)
                .orElseGet(() -> createState(userId, eventId, nowIso));
    }

    private EventFeedbackState createState(String userId, String eventId, String nowIso) {
        EventFeedbackState state = new EventFeedbackState();
        state.setId(new ObjectId().toHexString());
        state.setSyncKey(UUID.randomUUID().toString());
        state.setViewerUserId(userId);
        state.setEventId(eventId);
        state.setRemoved(false);
        state.setSubmittedAtIso(null);
        state.setOrganizerNote("");
        state.setCreatedDate(nowIso);
        state.setCreatedUser(userId);
        state.setUpdatedDate(nowIso);
        state.setUpdatedUser(userId);
        return state;
    }

    private EventFeedbackAnswer createAnswer(String userId, String eventId, String cardId, String nowIso) {
        EventFeedbackAnswer answer = new EventFeedbackAnswer();
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

    private String firstAnswerSubmittedAt(List<EventFeedbackAnswerSubmitDto> answers) {
        for (EventFeedbackAnswerSubmitDto answer : safeAnswers(answers)) {
            String submittedAtIso = safeText(answer.submittedAtIso());
            if (StringUtils.hasText(submittedAtIso)) {
                return submittedAtIso;
            }
        }
        return null;
    }

    private List<EventFeedbackAnswerSubmitDto> safeAnswers(List<EventFeedbackAnswerSubmitDto> answers) {
        return answers == null ? List.of() : answers;
    }

    private Map<String, Map<String, EventFeedbackAnswerDto>> buildAnswersByEventId(String userId) {
        Map<String, Map<String, EventFeedbackAnswerDto>> answersByEventId = new LinkedHashMap<>();
        for (EventFeedbackAnswer answer : eventFeedbackAnswersRepository.findByViewerUserIdOrderByEventIdAscSubmittedAtIsoDesc(userId)) {
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

    private EventFeedbackAnswerDto toAnswerDto(EventFeedbackAnswer answer) {
        return new EventFeedbackAnswerDto(
                normalizeId(answer.getCardId()),
                normalizeId(answer.getEventId()),
                safeText(answer.getKind()),
                normalizeId(answer.getTargetUserId()),
                safeText(answer.getTargetRole()),
                safeText(answer.getPrimaryValue()),
                safeText(answer.getSecondaryValue()),
                answer.getPersonalityTraitIds() == null
                        ? List.of()
                        : answer.getPersonalityTraitIds().stream().map(this::safeText).filter(StringUtils::hasText).toList(),
                answer.getTags() == null
                        ? List.of()
                        : answer.getTags().stream().map(this::safeText).filter(StringUtils::hasText).toList(),
                safeText(answer.getSubmittedAtIso()));
    }

    private EventFeedbackStateDto toDto(EventFeedbackState state, Map<String, EventFeedbackAnswerDto> answersByCardId) {
        return new EventFeedbackStateDto(
                normalizeId(state.getEventId()),
                Boolean.TRUE.equals(state.getRemoved()),
                safeText(state.getSubmittedAtIso()),
                safeText(state.getOrganizerNote()),
                answersByCardId == null ? Map.of() : Map.copyOf(answersByCardId));
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
}
