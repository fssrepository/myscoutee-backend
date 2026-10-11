package com.raxim.myscoutee.domain.content.service;

import com.raxim.myscoutee.domain.accounts.service.AccountChatCounterService;
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
    private AccountChatCounterService supportCaseCounters;
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
                new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(org.mockito.Mockito.mock(com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository.class)),
                new com.raxim.myscoutee.domain.administration.service.AdministrativeActorService(configProperties,
                        new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository), appSettingsService),
                reportsRepository,
                feedbackRepository,
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                new com.raxim.myscoutee.domain.chat.service.ChatDirectoryService(chatsRepository),
                new com.raxim.myscoutee.domain.chat.service.ChatReviewService(chatsRepository, chatMessagesRepository),
                chatService,
                supportCaseCounters,
                affinityRecomputeTaskService,
                adminTelemetryService,
                notificationOutboxService);
        var statusWork = new com.raxim.myscoutee.domain.accounts.service.ProfileStatusWork(usersRepository,
                org.mockito.Mockito.mock(org.springframework.data.mongodb.core.MongoTemplate.class), affinityRecomputeTaskService, null);
        org.springframework.test.util.ReflectionTestUtils.setField(statusWork, "supportMessages", chatService);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "profileModeration",
                new com.raxim.myscoutee.domain.accounts.service.ProfileModerationService(usersRepository, statusWork));
        org.springframework.test.util.ReflectionTestUtils.setField(supportCaseCounters, "usersRepository", usersRepository);
        org.mockito.Mockito.lenient().doCallRealMethod().when(supportCaseCounters).hasSupportCaseCounters(org.mockito.ArgumentMatchers.any());
    }

    @AfterEach
    void tearDown() {
        MongoSessionModeContext.clear();
    }

    @Test
    void dashboardUsesTheCounterOwnerWithoutFetchingTheSameAdminProfileFirst() {
        Users admin = new Users();
        admin.setUserId("admin-demo-ava");
        when(usersRepository.findByUserId(admin.getUserId())).thenReturn(Optional.of(admin));
        org.mockito.Mockito.doReturn(true).when(supportCaseCounters).hasSupportCaseCounters(admin.getUserId());

        var dashboard = service.dashboard(admin.getUserId());

        assertThat(dashboard.activeAdmin().id()).isEqualTo(admin.getUserId());
        verify(supportCaseCounters).hasSupportCaseCounters(admin.getUserId());
        verify(supportCaseCounters, never()).refreshSupportCaseCountersForAdmins();
        // Two unchanged identity reads and one workspace-scope read. No extra
        // profile read merely to ask the counter owner whether counters exist.
        verify(usersRepository, org.mockito.Mockito.times(3)).findByUserId(admin.getUserId());
    }

    @Test
    void dashboardStillInitializesMissingCountersWhenTheAdminProfileIsAbsent() {
        var dashboard = service.dashboard("admin-demo-ava");

        assertThat(dashboard.activeAdmin().id()).isEqualTo("admin-demo-ava");
        verify(supportCaseCounters).hasSupportCaseCounters("admin-demo-ava");
        verify(supportCaseCounters).refreshSupportCaseCountersForAdmins();
        // Includes the counter owner's real lookup of the absent profile.
        verify(usersRepository, org.mockito.Mockito.times(4)).findByUserId("admin-demo-ava");
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
    void warningWithoutReportIdUsesTheTargetWorkspaceAndSendsSupportMessage() {
        UserReportSubmission report = new UserReportSubmission();
        report.setTargetUserId("target");
        Users admin = new Users();
        admin.setUserId("admin-demo-ava");
        admin.setWorkspaceGroupId("myscoutee-work");
        Users target = new Users();
        target.setUserId("target");
        target.setWorkspaceGroupId("myscoutee-work");
        when(configProperties.isFirebaseEnabled()).thenReturn(false);
        when(reportsRepository.findByTargetUserIdOrderByCreatedDateDesc("target")).thenReturn(List.of(report));
        when(usersRepository.findByUserId("admin-demo-ava")).thenReturn(Optional.of(admin));
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));

        service.warn("target", new AdminActionRequestDto("admin-demo-ava", "Warning text", null));

        verify(chatService).sendAdminSupportMessage("target", "admin-demo-ava", "Ava Moderation", "AM", "Warning text", "warned");
        verify(reportsRepository, never()).save(any(UserReportSubmission.class));
        verify(adminTelemetryService).record("admin.user.warned", "moderation", "target", "admin-demo-ava");
    }

    @Test
    void warningWithoutReportIdStillRejectsAnotherWorkspace() {
        UserReportSubmission report = new UserReportSubmission();
        report.setTargetUserId("target");
        Users admin = new Users();
        admin.setUserId("admin-demo-ava");
        admin.setWorkspaceGroupId("myscoutee-work");
        Users target = new Users();
        target.setUserId("target");
        target.setWorkspaceGroupId("myscoutee-community");
        when(configProperties.isFirebaseEnabled()).thenReturn(false);
        when(reportsRepository.findByTargetUserIdOrderByCreatedDateDesc("target")).thenReturn(List.of(report));
        when(usersRepository.findByUserId("admin-demo-ava")).thenReturn(Optional.of(admin));
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));

        assertThatThrownBy(() -> service.warn("target", new AdminActionRequestDto("admin-demo-ava", "Warning text", null)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class)
                .hasMessageContaining("404")
                .hasMessageContaining("Case not found in this workspace");
        verify(chatService, never()).sendAdminSupportMessage(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
        verify(reportsRepository, never()).save(any(UserReportSubmission.class));
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
