package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.EventFeedbackAnswer;
import com.raxim.myscoutee.profile.data.document.EventFeedbackState;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackAnswerDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackAnswerSubmitDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackReceivedEntryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackReceivedEventDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackNoteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackStateDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackToggleRequestDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class ActivitiesEventFeedbackService {
    private final HomeUserProfileService homeUserProfileService;
    private final ActivityEventsRepository activityEventsRepository;
    private final EventFeedbackStatesRepository eventFeedbackStatesRepository;
    private final EventFeedbackAnswersRepository eventFeedbackAnswersRepository;
    private final UsersRepository usersRepository;

    public ActivitiesEventFeedbackService(
            HomeUserProfileService homeUserProfileService,
            ActivityEventsRepository activityEventsRepository,
            EventFeedbackStatesRepository eventFeedbackStatesRepository,
            EventFeedbackAnswersRepository eventFeedbackAnswersRepository,
            UsersRepository usersRepository) {
        this.homeUserProfileService = homeUserProfileService;
        this.activityEventsRepository = activityEventsRepository;
        this.eventFeedbackStatesRepository = eventFeedbackStatesRepository;
        this.eventFeedbackAnswersRepository = eventFeedbackAnswersRepository;
        this.usersRepository = usersRepository;
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

    public List<EventFeedbackReceivedEventDto> queryReceivedEvents(String requestedUserId) {
        String userId = homeUserProfileService.resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            return List.of();
        }

        Set<String> ownedEventIds = new LinkedHashSet<>();
        for (ActivityEvent record : activityEventsRepository.findByOwnerUserId(userId)) {
            if (record == null || Boolean.TRUE.equals(record.getIsInvitation()) || Boolean.TRUE.equals(record.getIsTrashed())) {
                continue;
            }
            boolean viewerIsAdmin = Boolean.TRUE.equals(record.getIsAdmin())
                    || Objects.equals(userId, normalizeId(record.getCreatorUserId()));
            if (!viewerIsAdmin) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                ownedEventIds.add(sourceId);
            }
        }
        if (ownedEventIds.isEmpty()) {
            return List.of();
        }

        Map<String, Map<String, ReceivedFeedbackEntryAccumulator>> entriesByEventId = new LinkedHashMap<>();
        Set<String> viewerUserIds = new LinkedHashSet<>();
        for (EventFeedbackState state : eventFeedbackStatesRepository.findByEventIdInOrderByEventIdAscUpdatedDateDesc(ownedEventIds)) {
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

        for (EventFeedbackAnswer answer : eventFeedbackAnswersRepository.findByEventIdInOrderByEventIdAscSubmittedAtIsoDesc(ownedEventIds)) {
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
        List<EventFeedbackReceivedEventDto> receivedEvents = new ArrayList<>();
        for (String eventId : ownedEventIds) {
            Map<String, ReceivedFeedbackEntryAccumulator> eventEntries = entriesByEventId.get(eventId);
            if (eventEntries == null || eventEntries.isEmpty()) {
                continue;
            }
            List<EventFeedbackReceivedEntryDto> entries = eventEntries.values().stream()
                    .map(entry -> toReceivedEntryDto(entry, viewerIdentitiesByUserId.get(entry.viewerUserId)))
                    .filter(entry -> StringUtils.hasText(entry.organizerNote()) || !entry.answers().isEmpty())
                    .sorted((left, right) -> receivedEntrySortIso(right).compareTo(receivedEntrySortIso(left)))
                    .toList();
            if (!entries.isEmpty()) {
                receivedEvents.add(new EventFeedbackReceivedEventDto(eventId, entries));
            }
        }
        return receivedEvents;
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
        for (Users user : usersRepository.findByUserIdIn(viewerUserIds)) {
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

    private EventFeedbackReceivedEntryDto toReceivedEntryDto(
            ReceivedFeedbackEntryAccumulator entry,
            ViewerIdentity viewerIdentity) {
        ViewerIdentity resolvedViewerIdentity = viewerIdentity == null
                ? new ViewerIdentity(
                        safeText(entry.viewerUserId),
                        initialsFromText(entry.viewerUserId),
                        "man",
                        "")
                : viewerIdentity;
        return new EventFeedbackReceivedEntryDto(
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

    private String receivedEntrySortIso(EventFeedbackReceivedEntryDto entry) {
        String updatedAtIso = safeText(entry.updatedAtIso());
        if (StringUtils.hasText(updatedAtIso)) {
            return updatedAtIso;
        }
        String submittedAtIso = safeText(entry.submittedAtIso());
        if (StringUtils.hasText(submittedAtIso)) {
            return submittedAtIso;
        }
        for (EventFeedbackAnswerDto answer : entry.answers()) {
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

    private String resolveUserImageUrl(Users user) {
        if (user == null || user.getImages() == null || user.getImages().isEmpty()) {
            return "";
        }
        return safeText(user.getImages().get(0));
    }

    private String resolveUserInitials(Users user, String fallbackUserId) {
        if (user != null && StringUtils.hasText(safeText(user.getInitials()))) {
            return safeText(user.getInitials());
        }
        String fallbackName = user == null ? "" : safeText(user.getName());
        return initialsFromText(StringUtils.hasText(fallbackName) ? fallbackName : fallbackUserId);
    }

    private String initialsFromText(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return "";
        }
        String[] parts = normalizedValue.split("\\s+");
        StringBuilder initials = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(Character.toUpperCase(part.charAt(0)));
            }
            if (initials.length() >= 2) {
                break;
            }
        }
        return initials.toString();
    }

    private static final class ReceivedFeedbackEntryAccumulator {
        private final String viewerUserId;
        private final String eventId;
        private String submittedAtIso = "";
        private String updatedAtIso = "";
        private String organizerNote = "";
        private final List<EventFeedbackAnswerDto> answers = new ArrayList<>();

        private ReceivedFeedbackEntryAccumulator(String viewerUserId, String eventId) {
            this.viewerUserId = viewerUserId;
            this.eventId = eventId;
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
