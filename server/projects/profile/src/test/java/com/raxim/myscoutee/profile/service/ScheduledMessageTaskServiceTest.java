package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.profile.data.document.EmailOutboxItem;
import com.raxim.myscoutee.profile.data.document.EmailTemplate;
import com.raxim.myscoutee.profile.data.document.NotificationTemplate;
import com.raxim.myscoutee.profile.data.document.ScheduledMessageTask;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.EmailOutboxRepository;
import com.raxim.myscoutee.profile.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.profile.repository.NotificationTemplatesRepository;
import com.raxim.myscoutee.profile.repository.ScheduledMessageTasksRepository;
import com.raxim.myscoutee.profile.repository.UserSessionActionsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.email.EmailProviderGateway;
import com.raxim.myscoutee.profile.service.email.EmailTemplateRenderer;
import com.raxim.myscoutee.profile.service.email.ScheduledMessageAuditService;
import com.raxim.myscoutee.profile.service.email.ScheduledNotificationDeliveryService;
import com.raxim.myscoutee.profile.service.operator.DeploymentBrandingResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentBrandingResolver.ResolvedDeploymentBranding;

@ExtendWith(MockitoExtension.class)
class ScheduledMessageTaskServiceTest {
    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private ScheduledMessageTasksRepository scheduledMessageTasksRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserSessionActionsRepository userSessionActionsRepository;
    @Mock
    private ScheduledMessageAuditService scheduledMessageAuditService;
    @Mock
    private EmailOutboxRepository emailOutboxRepository;
    @Mock
    private EmailTemplatesRepository emailTemplatesRepository;
    @Mock
    private NotificationTemplatesRepository notificationTemplatesRepository;
    @Mock
    private ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider;
    @Mock
    private ObjectProvider<ScheduledNotificationDeliveryService> scheduledNotificationDeliveryServiceProvider;
    @Mock
    private ObjectProvider<EmailTemplateRenderer> emailTemplateRendererProvider;
    @Mock
    private ObjectProvider<EmailProviderGateway> emailProviderGatewayProvider;
    @Mock
    private ObjectProvider<EmailProperties> emailPropertiesProvider;
    @Mock
    private ObjectProvider<ConfigProperties> configPropertiesProvider;
    @Mock
    private AffinityRecomputeTaskService affinityRecomputeTaskService;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private ScheduledNotificationDeliveryService scheduledNotificationDeliveryService;

    private final EmailTemplateRenderer emailTemplateRenderer = new EmailTemplateRenderer();
    private final EmailProperties emailProperties = new EmailProperties();
    private final ConfigProperties configProperties = new ConfigProperties();
    private ScheduledMessageTaskService service;
    private NotificationTemplate notificationTemplate;
    private EmailTemplate emailTemplate;
    private Users recipient;

    @BeforeEach
    void setUp() {
        emailProperties.setEnabled(true);
        emailProperties.setBaseUrl("https://myscoutee.test");
        configProperties.setFirebaseEnabled(false);
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(scheduledNotificationDeliveryServiceProvider.getIfAvailable())
                .thenReturn(scheduledNotificationDeliveryService);
        when(emailTemplateRendererProvider.getIfAvailable()).thenReturn(emailTemplateRenderer);
        when(emailPropertiesProvider.getIfAvailable()).thenReturn(emailProperties);
        when(configPropertiesProvider.getIfAvailable()).thenReturn(configProperties);

        service = new ScheduledMessageTaskService(
                mongoTemplate,
                scheduledMessageTasksRepository,
                usersRepository,
                userSessionActionsRepository,
                scheduledMessageAuditService,
                emailOutboxRepository,
                emailTemplatesRepository,
                notificationTemplatesRepository,
                activitiesMembersServiceProvider,
                scheduledNotificationDeliveryServiceProvider,
                emailTemplateRendererProvider,
                emailProviderGatewayProvider,
                emailPropertiesProvider,
                configPropertiesProvider,
                affinityRecomputeTaskService);

        notificationTemplate = new NotificationTemplate();
        notificationTemplate.setTemplateKey("notification-template");
        notificationTemplate.setEnabled(Boolean.TRUE);
        notificationTemplate.setTitleTemplate("Event update");
        notificationTemplate.setBodyTemplate("Open your event.");

        emailTemplate = new EmailTemplate();
        emailTemplate.setTemplateKey("email-template");
        emailTemplate.setEnabled(Boolean.TRUE);
        emailTemplate.setSubjectTemplate("Event update");
        emailTemplate.setHtmlTemplate("<p>Open your event.</p>");
        emailTemplate.setTextTemplate("Open your event.");

        recipient = new Users();
        recipient.setId("user-1");
        recipient.setUserId("user-1");
        recipient.setName("Ada Member");
        recipient.setEmail("ada@example.test");

        when(notificationTemplatesRepository.findByTemplateKey("notification-template"))
                .thenReturn(Optional.of(notificationTemplate));
        when(emailTemplatesRepository.findByTemplateKey("email-template"))
                .thenReturn(Optional.of(emailTemplate));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(recipient));
        when(scheduledNotificationDeliveryService.send(
                eq(recipient),
                eq(notificationTemplate),
                anyMap(),
                anyString()))
                .thenReturn(true);
    }

    @AfterEach
    void tearDown() {
        service.shutdown();
    }

    @Test
    void scheduledEventNotificationsReachOutboxWithoutFirebaseAndRetainEmailFallback() {
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("user-1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        1));

        Object stageResult = ReflectionTestUtils.invokeMethod(
                service,
                "markStageReminderDue",
                stageReminderTask(),
                "run-stage");
        Object eventChangeResult = ReflectionTestUtils.invokeMethod(
                service,
                "notifyEventDefinitionChanged",
                eventChangeTask(),
                "run-change");

        verify(scheduledNotificationDeliveryService, times(2)).send(
                eq(recipient),
                eq(notificationTemplate),
                anyMap(),
                anyString());
        verify(emailOutboxRepository, times(2)).saveAll(anyList());
        assertThat((Integer) ReflectionTestUtils.invokeMethod(stageResult, "count")).isEqualTo(1);
        assertThat((Integer) ReflectionTestUtils.invokeMethod(eventChangeResult, "count")).isEqualTo(1);
    }

    @Test
    void firebaseAcceptedNotificationDoesNotAlsoQueueEmailFallback() {
        configProperties.setFirebaseEnabled(true);
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("user-1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        1));

        ReflectionTestUtils.invokeMethod(service, "markStageReminderDue", stageReminderTask(), "run-stage");

        verify(scheduledNotificationDeliveryService).send(
                eq(recipient),
                eq(notificationTemplate),
                anyMap(),
                anyString());
        verify(emailOutboxRepository, never()).saveAll(anyList());
    }

    @Test
    void stageReminderResolvesBrandingOnceAndSnapshotsItForPushAndEmail() {
        DeploymentBrandingResolver brandingResolver =
                org.mockito.Mockito.mock(DeploymentBrandingResolver.class);
        when(brandingResolver.resolve()).thenReturn(
                new ResolvedDeploymentBranding(
                        "Community Hub",
                        "/media/public?key=community-logo",
                        31L));
        service.setDeploymentBrandingResolver(brandingResolver);
        notificationTemplate.setTitleTemplate(
                "@product_name event update");
        notificationTemplate.setIconUrl("@product_logo_url");
        notificationTemplate.setBadgeUrl("@product_logo_url");
        emailTemplate.setSubjectTemplate(
                "@product_name event update");
        List<EmailOutboxItem> savedEmails = new ArrayList<>();
        when(emailOutboxRepository.saveAll(anyList()))
                .thenAnswer(invocation -> {
                    List<EmailOutboxItem> items =
                            invocation.getArgument(0);
                    savedEmails.addAll(items);
                    return items;
                });
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("user-1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        1));

        ReflectionTestUtils.invokeMethod(
                service,
                "markStageReminderDue",
                stageReminderTask(),
                "run-stage");

        @SuppressWarnings({"rawtypes", "unchecked"})
        ArgumentCaptor<Map<String, String>> variablesCaptor =
                (ArgumentCaptor) ArgumentCaptor.forClass(Map.class);
        verify(scheduledNotificationDeliveryService).send(
                eq(recipient),
                eq(notificationTemplate),
                variablesCaptor.capture(),
                eq("stage-reminder"));
        verify(brandingResolver, times(1)).resolve();
        assertThat(variablesCaptor.getValue())
                .containsEntry("productName", "Community Hub")
                .containsEntry("product_name", "Community Hub")
                .containsEntry(
                        "productLogoUrl",
                        "/media/public?key=community-logo")
                .containsEntry(
                        "product_logo_url",
                        "/media/public?key=community-logo")
                .containsEntry("productBrandingRevision", "31")
                .containsEntry("product_branding_revision", "31");
        assertThat(savedEmails).hasSize(1);
        assertThat(savedEmails.get(0).getSubject())
                .isEqualTo("Community Hub event update");
        assertThat(savedEmails.get(0).getTemplateVariables())
                .containsEntry("product_name", "Community Hub")
                .containsEntry("product_branding_revision", "31");
    }

    private ScheduledMessageTask stageReminderTask() {
        ScheduledMessageTask task = commonTask("stage-reminder");
        task.setEventId("event-1");
        task.setPayload(Map.of(
                "eventTitle", "Board Game Night",
                "stageName", "Round 1"));
        return task;
    }

    private ScheduledMessageTask eventChangeTask() {
        ScheduledMessageTask task = commonTask("event-change");
        task.setEventId("event-1");
        task.setPayload(Map.of(
                "eventTitle", "Board Game Night",
                "audienceUserIds", "user-1",
                "changeReasons", "updated"));
        return task;
    }

    private ScheduledMessageTask commonTask(String taskKey) {
        ScheduledMessageTask task = new ScheduledMessageTask();
        task.setTaskKey(taskKey);
        task.setNotificationTemplateKey("notification-template");
        task.setEmailTemplateKey("email-template");
        return task;
    }
}
