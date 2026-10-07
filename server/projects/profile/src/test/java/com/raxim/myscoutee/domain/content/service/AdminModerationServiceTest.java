package com.raxim.myscoutee.domain.content.service;

import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.administration.api.AdminTelemetryEvent;
import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;
import com.raxim.myscoutee.domain.affinity.service.AffinityRecomputeTaskService;
import com.raxim.myscoutee.domain.chat.service.ChatService;
import com.raxim.myscoutee.domain.platform.service.AppSettingsService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.platform.config.ConfigProperties;
import com.raxim.myscoutee.domain.content.document.UserFeedbackSubmission;
import com.raxim.myscoutee.domain.content.document.UserReportSubmission;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminActionRequestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminReviewResolveRequestDto;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.content.repository.UserFeedbackSubmissionsRepository;
import com.raxim.myscoutee.domain.content.repository.UserReportSubmissionsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class AdminModerationServiceTest {
    @Mock
    private ConfigProperties configProperties;
    @Mock
    private UserReportSubmissionsRepository reportsRepository;
    @Mock
    private UserFeedbackSubmissionsRepository feedbackRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private ChatsRepository chatsRepository;
    @Mock
    private ChatMessagesRepository chatMessagesRepository;
    @Mock
    private ChatService chatService;
    @Mock
    private UserActivityCountersService userActivityCountersService;
    @Mock
    private AffinityRecomputeTaskService affinityRecomputeTaskService;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AppSettingsService appSettingsService;
    @Mock
    private NotificationOutboxService notificationOutboxService;

    private AdminModerationService service;

    @BeforeEach
    void setUp() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        service = new AdminModerationService(
                org.mockito.Mockito.mock(com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository.class),
                configProperties,
                reportsRepository,
                feedbackRepository,
                usersRepository,
                chatsRepository,
                chatMessagesRepository,
                chatService,
                userActivityCountersService,
                affinityRecomputeTaskService,
                adminTelemetryService,
                appSettingsService,
                notificationOutboxService);
    }

    @AfterEach
    void tearDown() {
        MongoSessionModeContext.clear();
    }

    @Test
    void baseStatisticsExcludeIndependentWorkspaceActivityEvenWhenTaggedByAJob() {
        var member = new Users(); member.setUserId("private-member"); member.setWorkspaceGroupId("private-workspace");
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(member));
        var tags = java.util.Map.of("baseGroupId", "myscoutee-work");
        var activity = new AdminTelemetryEvent("event.synced", "events", "event", member.getUserId(), 1L, "2026-10-05T00:00:00Z", tags);
        var job = new AdminTelemetryEvent("jobs.run.completed", "jobs", "job", "worker", 1L, "2026-10-05T00:00:00Z", tags);
        assertThat(service.baseProfileEvents(List.of(activity, job)).get("myscoutee-work")).containsExactly(job);
    }

    @Test
    void warnDoesNotMarkTheReportWhenTheSupportMessageFails() {
        String targetUserId = "target";
        String reportId = "report-1";
        UserReportSubmission report = new UserReportSubmission();
        report.setId(reportId);
        report.setTargetUserId(targetUserId);
        Users admin = new Users();
        admin.setUserId("admin-demo-ava");
        admin.setName("Ava Moderation");
        admin.setInitials("AM");

        when(configProperties.isFirebaseEnabled()).thenReturn(false);
        when(reportsRepository.findByTargetUserIdOrderByCreatedDateDesc(targetUserId))
                .thenReturn(List.of(report));
        when(reportsRepository.findById(reportId)).thenReturn(Optional.of(report));
        when(usersRepository.findByUserId("admin-demo-ava")).thenReturn(Optional.of(admin));
        when(chatService.sendAdminSupportMessage(
                targetUserId,
                "admin-demo-ava",
                "Ava Moderation",
                "AM",
                "Warning text",
                "warned"))
                .thenThrow(new IllegalStateException("support write failed"));

        assertThatThrownBy(() -> service.warn(
                targetUserId,
                new AdminActionRequestDto("admin-demo-ava", "Warning text", reportId)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("support write failed");

        verify(reportsRepository, never()).save(any(UserReportSubmission.class));
        verify(adminTelemetryService, never()).record(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    void resolvingFeedbackEnqueuesOneNotificationWithoutWritingAChat() {
        UserFeedbackSubmission feedback = new UserFeedbackSubmission();
        feedback.setId("feedback-1");
        feedback.setUserId("target");
        feedback.setSubject("Faster review");

        when(configProperties.isFirebaseEnabled()).thenReturn(false);
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.of(feedback));
        when(reportsRepository.findAllByOrderByCreatedDateDesc()).thenReturn(List.of());
        when(feedbackRepository.findAllByOrderByCreatedDateDesc()).thenReturn(List.of(feedback));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of());
        when(usersRepository.findByProfileStatus("blocked")).thenReturn(List.of());

        service.resolveFeedback(
                "feedback-1",
                new AdminReviewResolveRequestDto("admin-demo-ava", true));

        verify(feedbackRepository).save(feedback);
        verify(chatService, never()).sendAdminSupportMessage(
                anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intentCaptor.capture());
        NotificationIntent intent = intentCaptor.getValue();
        assertThat(intent.type()).isEqualTo("feedback-resolved");
        assertThat(intent.entityType()).isEqualTo("feedback");
        assertThat(intent.entityId()).isEqualTo("feedback-1");
        assertThat(intent.recipientUserIds()).containsExactly("target");
        assertThat(intent.body()).isEqualTo(
                "Your feedback \"Faster review\" has been reviewed by MyScoutee. Thank you for helping improve the app.");
        assertThat(intent.payload())
                .containsEntry("feedbackId", "feedback-1")
                .containsEntry("senderUserId", "admin-demo-ava")
                .containsEntry("notification_tone", "success");
    }
}
