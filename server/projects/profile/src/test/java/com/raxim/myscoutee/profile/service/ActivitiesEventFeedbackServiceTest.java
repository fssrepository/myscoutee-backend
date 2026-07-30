package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InOrder;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackCardDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackDetailDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackNoteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackToggleRequestDto;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.EventFeedbackAnswer;
import com.raxim.myscoutee.profile.data.document.EventFeedbackState;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.mapper.EventFeedbackStatMapper;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@ExtendWith(MockitoExtension.class)
class ActivitiesEventFeedbackServiceTest {
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private EventFeedbackStatesRepository eventFeedbackStatesRepository;
    @Mock
    private EventFeedbackAnswersRepository eventFeedbackAnswersRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private AffinityRecomputeTaskService affinityRecomputeTaskService;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AccessControlService accessControlService;
    @Mock
    private UserActivityCountersService userActivityCountersService;
    @Mock
    private EventFeedbackStatMapper eventFeedbackStatMapper;
    @Mock
    private NotificationOutboxService notificationOutboxService;

    private ActivitiesEventFeedbackService service;

    @BeforeEach
    void setUp() {
        service = new ActivitiesEventFeedbackService(
                homeUserProfileService,
                activityEventsRepository,
                eventFeedbackStatesRepository,
                eventFeedbackAnswersRepository,
                usersRepository,
                affinityRecomputeTaskService,
                adminTelemetryService,
                accessControlService,
                userActivityCountersService,
                eventFeedbackStatMapper,
                notificationOutboxService);
    }

    @Test
    void submitRejectsDeniedUserBeforeSavingFeedback() {
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
        when(accessControlService.canCurrentActorSubmitEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.submit(new EventFeedbackSubmitRequestDto(
                "u1",
                new EventFeedbackDetailDto(
                        "event-1",
                        "Event",
                        "2026-06-02T00:00:00Z",
                        List.of(new EventFeedbackCardDto(
                                "card-1",
                                "event-1",
                                "event",
                                null,
                                "host",
                                "Admin",
                                "Event",
                                "",
                                "",
                                "",
                                "",
                                "",
                                "Host",
                                null,
                                "",
                                "",
                                "",
                                "",
                                "great",
                                "clear",
                                List.of("reliable-one")))))))
                .hasMessageContaining("submit feedback");

        verifyNoInteractions(
                eventFeedbackStatesRepository,
                eventFeedbackAnswersRepository,
                affinityRecomputeTaskService,
                adminTelemetryService,
                notificationOutboxService);
    }

    @Test
    void loadDetailPrefersLaterCanonicalEventOverLargerMemberScopedCopy() {
        Users viewer = new Users();
        viewer.setUserId("viewer");
        viewer.setName("Viewer");
        Users host = new Users();
        host.setUserId("host");
        host.setName("Host");

        ActivityEvent canonical = new ActivityEvent();
        canonical.setSourceId("event-1");
        canonical.setTitle("Finished Event");
        canonical.setCreatorUserId("host");
        canonical.setOwnerUserId("host");
        canonical.setAcceptedMemberUserIds(List.of("viewer"));
        canonical.setStartAtIso("2020-01-01T10:00:00Z");

        ActivityEvent memberScoped = new ActivityEvent();
        memberScoped.setSourceId("event-1");
        memberScoped.setTitle("Finished Event");
        memberScoped.setCreatorUserId("host");
        memberScoped.setOwnerUserId("viewer");
        memberScoped.setAcceptedMemberUserIds(List.of("viewer", "participant-2", "participant-3"));
        memberScoped.setStartAtIso("2020-01-01T10:00:00Z");

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(memberScoped, canonical));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(Optional.empty());
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(List.of());

        EventFeedbackDetailDto detail = service.loadDetail(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackQueryDto("viewer", "event-1"));

        assertThat(detail.eventId()).isEqualTo("event-1");
        assertThat(detail.cards()).singleElement().satisfies(card -> {
            assertThat(card.kind()).isEqualTo("event");
            assertThat(card.targetUserId()).isEqualTo("host");
        });
    }

    @Test
    void loadDetailHydratesLegacyAnswerByKindAndTargetWhenCardIdChanged() {
        Users viewer = new Users();
        viewer.setUserId("viewer");
        viewer.setName("Viewer");
        Users host = new Users();
        host.setUserId("host");
        host.setName("Host");

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Finished Event");
        event.setCreatorUserId("host");
        event.setOwnerUserId("host");
        event.setAcceptedMemberUserIds(List.of("viewer"));
        event.setStartAtIso("2020-01-01T10:00:00Z");

        EventFeedbackState state = new EventFeedbackState();
        state.setViewerUserId("viewer");
        state.setEventId("event-1");
        state.setSubmittedAtIso("2026-07-23T18:00:00Z");

        EventFeedbackAnswer answer = new EventFeedbackAnswer();
        answer.setCardId("legacy-host-card");
        answer.setEventId("event-1");
        answer.setViewerUserId("viewer");
        answer.setKind("event");
        answer.setTargetUserId("host");
        answer.setPrimaryValue("excellent");
        answer.setSecondaryValue("resources");
        answer.setPersonalityTraitIds(List.of("reliable-one"));

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(java.util.Optional.of(state));
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(List.of(answer));

        EventFeedbackDetailDto detail = service.loadDetail(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackQueryDto("viewer", "event-1"));

        assertThat(detail.submittedAtIso()).isEqualTo("2026-07-23T18:00:00Z");
        assertThat(detail.cards()).hasSize(1);
        assertThat(detail.cards().getFirst().answerPrimary()).isEqualTo("excellent");
        assertThat(detail.cards().getFirst().answerSecondary()).isEqualTo("resources");
        assertThat(detail.cards().getFirst().selectedTraitIds()).containsExactly("reliable-one");
    }

    @Test
    void submitReturnsMongoReloadedDetailAfterAnswersAndStateAreSaved() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setUserId("viewer");
        viewer.setName("Viewer");
        Users host = new Users();
        host.setId("host");
        host.setUserId("host");
        host.setName("Host");

        ActivityEvent source = new ActivityEvent();
        source.setSourceId("event-1");
        source.setTitle("Finished Event");
        source.setCreatorUserId("host");
        source.setOwnerUserId("host");
        source.setAcceptedMemberUserIds(List.of("viewer"));
        source.setStartAtIso("2020-01-01T10:00:00Z");

        EventFeedbackCardDto card = new EventFeedbackCardDto(
                "feedback-event-event-1",
                "event-1",
                "event",
                null,
                "host",
                "Admin",
                "Finished Event",
                "",
                "",
                "",
                "2020-01-01T10:00:00Z",
                "",
                "Host",
                null,
                "",
                "man",
                "",
                "",
                "excellent",
                "resources",
                List.of("reliable-one"));
        AtomicReference<EventFeedbackState> persistedState = new AtomicReference<>();
        AtomicReference<List<EventFeedbackAnswer>> persistedAnswers = new AtomicReference<>(List.of());

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(accessControlService.canCurrentActorSubmitEventFeedback("viewer", "event-1")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(source));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(Optional.empty(), Optional.empty())
                .thenAnswer(ignored -> Optional.ofNullable(persistedState.get()));
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventIdAndCardId(
                "viewer",
                "event-1",
                "feedback-event-event-1"))
                .thenReturn(Optional.empty());
        when(eventFeedbackAnswersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<EventFeedbackAnswer> answers = List.copyOf(invocation.getArgument(0));
            persistedAnswers.set(answers);
            return answers;
        });
        when(eventFeedbackStatesRepository.save(any(EventFeedbackState.class))).thenAnswer(invocation -> {
            EventFeedbackState state = invocation.getArgument(0);
            persistedState.set(state);
            return state;
        });
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenAnswer(ignored -> persistedAnswers.get());

        EventFeedbackDetailDto persisted = service.submit(new EventFeedbackSubmitRequestDto(
                "viewer",
                new EventFeedbackDetailDto(
                        "event-1",
                        "Finished Event",
                        "2026-07-23T18:00:00Z",
                        List.of(card))));

        assertThat(persisted.submittedAtIso()).isEqualTo("2026-07-23T18:00:00Z");
        assertThat(persisted.cards()).hasSize(1);
        assertThat(persisted.cards().getFirst().answerPrimary()).isEqualTo("excellent");
        assertThat(persisted.cards().getFirst().answerSecondary()).isEqualTo("resources");

        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intentCaptor.capture());
        NotificationIntent intent = intentCaptor.getValue();
        assertThat(intent.type()).isEqualTo("event-feedback-submitted");
        assertThat(intent.entityType()).isEqualTo("event");
        assertThat(intent.entityId()).isEqualTo("event-1");
        assertThat(intent.recipientScope()).isEqualTo("feedback-targets");
        assertThat(intent.recipientUserIds()).containsExactly("host");
        assertThat(intent.recipientUserIds()).doesNotContain("viewer");
        assertThat(intent.clickUrl()).isEqualTo("/game");
        assertThat(intent.createdUser()).isEqualTo("viewer");
        assertThat(intent.payload())
                .containsEntry("eventId", "event-1")
                .containsEntry("eventTitle", "Finished Event")
                .containsEntry("senderUserId", "viewer");

        InOrder persistenceOrder = inOrder(
                eventFeedbackAnswersRepository,
                eventFeedbackStatesRepository,
                notificationOutboxService);
        persistenceOrder.verify(eventFeedbackAnswersRepository).saveAll(anyList());
        persistenceOrder.verify(eventFeedbackStatesRepository).save(any(EventFeedbackState.class));
        persistenceOrder.verify(notificationOutboxService).enqueue(any(NotificationIntent.class));
    }

    @Test
    void resubmittingAlreadySubmittedFeedbackDoesNotDuplicateBellNotification() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setUserId("viewer");
        Users host = new Users();
        host.setId("host");
        host.setUserId("host");

        ActivityEvent source = new ActivityEvent();
        source.setSourceId("event-1");
        source.setTitle("Finished Event");
        source.setCreatorUserId("host");
        source.setOwnerUserId("host");
        source.setAcceptedMemberUserIds(List.of("viewer"));
        source.setStartAtIso("2020-01-01T10:00:00Z");

        EventFeedbackState existingState = new EventFeedbackState();
        existingState.setViewerUserId("viewer");
        existingState.setEventId("event-1");
        existingState.setSubmittedAtIso("2026-07-23T17:00:00Z");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(accessControlService.canCurrentActorSubmitEventFeedback("viewer", "event-1")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(source));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(Optional.of(existingState));
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventIdAndCardId(
                "viewer",
                "event-1",
                "feedback-event-event-1"))
                .thenReturn(Optional.empty());
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(List.of());

        service.submit(new EventFeedbackSubmitRequestDto(
                "viewer",
                new EventFeedbackDetailDto(
                        "event-1",
                        "Finished Event",
                        "2026-07-23T18:00:00Z",
                        List.of(new EventFeedbackCardDto(
                                "feedback-event-event-1",
                                "event-1",
                                "event",
                                null,
                                "host",
                                "Admin",
                                "Finished Event",
                                "",
                                "",
                                "",
                                "2020-01-01T10:00:00Z",
                                "",
                                "Host",
                                null,
                                "",
                                "",
                                "",
                                "",
                                "excellent",
                                "resources",
                                List.of())))));

        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
    }

    @Test
    void saveNoteRejectsDeniedUserBeforeSavingState() {
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
        when(accessControlService.canCurrentActorSaveEventFeedbackNote("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.saveNote(new EventFeedbackNoteRequestDto("u1", "event-1", "Needs better timing.")))
                .hasMessageContaining("feedback note");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }

    @Test
    void removeRejectsDeniedUserBeforeSavingState() {
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
        when(accessControlService.canCurrentActorRemoveEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.markRemoved(new EventFeedbackToggleRequestDto("u1", "event-1"), true))
                .hasMessageContaining("feedback state");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }

    @Test
    void restoreRejectsDeniedUserBeforeSavingState() {
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
        when(accessControlService.canCurrentActorRestoreEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.markRemoved(new EventFeedbackToggleRequestDto("u1", "event-1"), false))
                .hasMessageContaining("feedback state");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }
}
