package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.raxim.myscoutee.domain.accounts.controller.ModerationSubmissionController;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserReportUserSubmitRequestDto;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.chat.api.ChatReview;
import com.raxim.myscoutee.domain.content.api.UserFeedback;
import com.raxim.myscoutee.domain.content.api.UserReports;
import com.raxim.myscoutee.domain.events.api.EventHomeReads;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.notifications.api.RoleNotifications;

@Tag("standard")
@ExtendWith(MockitoExtension.class)
class ModerationSubmissionServiceTest {
    @Mock UsersRepository users;
    @Mock ChatReview chat;
    @Mock EventHomeReads events;
    @Mock MemberDirectory members;
    @Mock UserFeedback feedback;
    @Mock UserReports reports;
    @Mock OperationalTelemetry telemetry;
    @Mock RoleNotifications notifications;
    private ModerationSubmissionService service;

    @BeforeEach
    void setUp() {
        service = new ModerationSubmissionService(new SelectedProfileService(users), chat,
                events, members, feedback, reports, telemetry);
        service.bindRoleNotifications(notifications);
    }

    @Test
    void feedbackKeepsItsHttpContractAndDeliveryOrder() throws Exception {
        reporter();
        when(feedback.submit("reporter", "General", "Subject", "Details")).thenReturn("feedback-1");
        var mvc = MockMvcBuilders.standaloneSetup(new ModerationSubmissionController(service)).build();
        mvc.perform(post("/auth/me/feedback").contentType(MediaType.APPLICATION_JSON).content("""
                {"userId":"reporter","category":" General ","subject":" Subject ","details":" Details "}
                """))
                .andExpect(status().isOk()).andExpect(jsonPath("$.submitted").value(true));
        var order = inOrder(feedback, notifications, telemetry);
        order.verify(feedback).submit("reporter", "General", "Subject", "Details");
        order.verify(notifications).moderationSubmitted("feedback-submitted", "feedback-1");
        order.verify(telemetry).record("feedback.submitted", "moderation", "feedback-1", "reporter");
        verifyNoInteractions(events, members, chat, reports);
    }

    @Test
    void reportRouteRetainsEventEligibilityBeforeAnyEvidenceOrWrite() throws Exception {
        reporter();
        var mvc = MockMvcBuilders.standaloneSetup(new ModerationSubmissionController(service)).build();
        mvc.perform(post("/auth/me/report-user").contentType(MediaType.APPLICATION_JSON).content("""
                {"userId":"reporter","targetUserId":"organizer","chatId":"chat-1"}
                """))
                .andExpect(status().isOk()).andExpect(jsonPath("$.submitted").value(false))
                .andExpect(jsonPath("$.message").value("Reports can only be submitted for an event organizer or a member you shared an event with."));
        verifyNoInteractions(events, members, chat, reports, notifications, telemetry);
    }

    @Test
    void missingActorCannotSubmitFeedbackOrReport() {
        assertThat(service.submitFeedback(null).submitted()).isFalse();
        assertThat(service.submitReport(null).submitted()).isFalse();
        verifyNoInteractions(users, events, members, chat, feedback, reports, notifications, telemetry);
    }

    @Test
    void inaccessibleChatEvidenceCannotReachTheReportQueue() {
        eligibleOrganizer();
        assertThat(service.submitReport(request()).submitted()).isFalse();
        verify(chat).reportEvidence("reporter", "organizer", "chat-1", "message-1");
        verifyNoInteractions(reports, notifications, telemetry);
    }

    @Test
    void reportUsesVerifiedEvidenceAndOneReadPerExistingBoundary() {
        eligibleOrganizer();
        when(chat.reportEvidence("reporter", "organizer", "chat-1", "message-1"))
                .thenReturn(new ChatReview.ReportEvidence("chat-1", "message-1", "Verified text"));
        when(reports.submit(any())).thenReturn(new UserReports.Receipt("report-1", false));
        assertThat(service.submitReport(request()).submitted()).isTrue();
        var draft = ArgumentCaptor.forClass(UserReports.ReportDraft.class);
        verify(reports).submit(draft.capture());
        assertThat(draft.getValue().sourceText()).isEqualTo("Verified text");
        assertThat(draft.getValue().eventTitle()).isEqualTo("Canonical event");
        assertThat(draft.getValue().sourceId()).isEqualTo("message-1");
        verify(users).findByUserId("reporter");
        verify(events).findBySourceId("event-1");
        verify(members).findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "reporter");
        verify(members).findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "organizer");
        verify(chat).reportEvidence("reporter", "organizer", "chat-1", "message-1");
        verifyNoMoreInteractions(users, events, members, chat);
        var order = inOrder(reports, notifications, telemetry);
        order.verify(reports).exists(draft.getValue().syncKey());
        order.verify(reports).submit(draft.getValue());
        order.verify(notifications).moderationSubmitted("report-submitted", "report-1");
        order.verify(telemetry).record("report.submitted", "moderation", "report-1", "reporter");
    }

    @Test
    void retryDoesNotRepeatReportNotificationOrTelemetry() {
        eligibleOrganizer();
        when(chat.reportEvidence(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(new ChatReview.ReportEvidence("chat-1", "message-1", "Verified text"));
        when(reports.exists(anyString())).thenReturn(true);
        var response = service.submitReport(request());
        assertThat(response.submitted()).isTrue();
        assertThat(response.message()).isEqualTo("Report already submitted.");
        verify(reports, never()).submit(any());
        verifyNoInteractions(notifications, telemetry);
    }

    @Test
    void concurrentDuplicateReceiptDoesNotRepeatNotificationOrTelemetry() {
        eligibleOrganizer();
        when(chat.reportEvidence(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(new ChatReview.ReportEvidence("chat-1", "message-1", "Verified text"));
        when(reports.submit(any())).thenReturn(new UserReports.Receipt("report-1", true));
        assertThat(service.submitReport(request()).message()).isEqualTo("Report already submitted.");
        verifyNoInteractions(notifications, telemetry);
    }

    private void reporter() {
        Users user = new Users();
        user.setId("reporter");
        user.setName("Reporter");
        when(users.findByUserId("reporter")).thenReturn(Optional.of(user));
    }

    private void eligibleOrganizer() {
        reporter();
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setOwnerUserId("organizer");
        event.setTitle("Canonical event");
        doReturn(List.of(event)).when(events).findBySourceId("event-1");
    }

    private UserReportUserSubmitRequestDto request() {
        return new UserReportUserSubmitRequestDto("reporter", "Organizer", "Harassment", "Details",
                "organizer", null, "event-1", "Stale title", null, "chat", null, null,
                "chat-1", "message-1", null, null);
    }
}
