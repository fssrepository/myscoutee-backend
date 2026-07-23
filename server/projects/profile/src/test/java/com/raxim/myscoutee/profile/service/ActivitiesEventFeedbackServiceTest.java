package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
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
                eventFeedbackStatMapper);
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

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository, affinityRecomputeTaskService, adminTelemetryService);
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
