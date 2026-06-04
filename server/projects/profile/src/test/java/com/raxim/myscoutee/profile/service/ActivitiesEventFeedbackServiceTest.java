package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackAnswerSubmitDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackNoteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackToggleRequestDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

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
                userActivityCountersService);
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
    }

    @Test
    void submitRejectsDeniedUserBeforeSavingFeedback() {
        when(accessControlService.canCurrentActorSubmitEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.submit(new EventFeedbackSubmitRequestDto(
                "u1",
                "event-1",
                List.of(new EventFeedbackAnswerSubmitDto(
                        "card-1",
                        "event",
                        "host",
                        "Admin",
                        "great",
                        "clear",
                        List.of("reliable-one"),
                        List.of("organized"),
                        "2026-06-02T00:00:00Z")))))
                .hasMessageContaining("submit feedback");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository, affinityRecomputeTaskService, adminTelemetryService);
    }

    @Test
    void saveNoteRejectsDeniedUserBeforeSavingState() {
        when(accessControlService.canCurrentActorSaveEventFeedbackNote("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.saveNote(new EventFeedbackNoteRequestDto("u1", "event-1", "Needs better timing.")))
                .hasMessageContaining("feedback note");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }

    @Test
    void removeRejectsDeniedUserBeforeSavingState() {
        when(accessControlService.canCurrentActorRemoveEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.markRemoved(new EventFeedbackToggleRequestDto("u1", "event-1"), true))
                .hasMessageContaining("feedback state");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }

    @Test
    void restoreRejectsDeniedUserBeforeSavingState() {
        when(accessControlService.canCurrentActorRestoreEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.markRemoved(new EventFeedbackToggleRequestDto("u1", "event-1"), false))
                .hasMessageContaining("feedback state");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }
}
