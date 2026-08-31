package com.raxim.myscoutee.profile.service;

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
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.UserReportSubmission;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminActionRequestDto;
import com.raxim.myscoutee.profile.repository.ChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ChatsRepository;
import com.raxim.myscoutee.profile.repository.UserFeedbackSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.UserReportSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
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

    private AdminModerationService service;

    @BeforeEach
    void setUp() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        service = new AdminModerationService(
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
                appSettingsService);
    }

    @AfterEach
    void tearDown() {
        MongoSessionModeContext.clear();
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
}
