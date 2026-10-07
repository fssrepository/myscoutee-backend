package com.raxim.myscoutee.domain.email.service;

import com.raxim.myscoutee.domain.affinity.service.AffinityRecomputeTaskService;
import com.raxim.myscoutee.domain.events.service.ActivitiesMembersService;

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

import com.raxim.myscoutee.domain.platform.config.ConfigProperties;
import com.raxim.myscoutee.domain.email.config.EmailProperties;
import com.raxim.myscoutee.domain.email.document.EmailOutboxItem;
import com.raxim.myscoutee.domain.email.document.EmailTemplate;
import com.raxim.myscoutee.domain.notifications.document.NotificationTemplate;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageTask;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.email.repository.EmailOutboxRepository;
import com.raxim.myscoutee.domain.email.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog;
import com.raxim.myscoutee.domain.email.repository.ScheduledMessageTasksRepository;
import com.raxim.myscoutee.domain.accounts.repository.UserSessionActionsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.email.service.EmailProviderGateway;
import com.raxim.myscoutee.domain.email.service.EmailTemplateRenderer;
import com.raxim.myscoutee.domain.email.service.ScheduledMessageAuditService;
import com.raxim.myscoutee.domain.email.service.ScheduledNotificationDeliveryService;
import com.raxim.myscoutee.domain.platform.service.DeploymentBrandingResolver;
import com.raxim.myscoutee.domain.platform.api.DeploymentBranding.ResolvedDeploymentBranding;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class ScheduledMessageTaskServiceTest {
    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private ScheduledMessageTasksRepository scheduledMessageTasksRepository;
    @Mock
    private UsersRepository profiles;
    @Mock
    private UserSessionActionsRepository userSessionActionsRepository;
    @Mock
    private ScheduledMessageAuditService scheduledMessageAuditService;
    @Mock
    private EmailOutboxRepository emailOutboxRepository;
    @Mock
    private EmailTemplatesRepository emailTemplatesRepository;
    @Mock
    private NotificationCatalog notificationTemplatesRepository;
    @Mock
    private ObjectProvider<com.raxim.myscoutee.domain.events.api.MemberAudience> activitiesMembersServiceProvider;
    @Mock
    private ObjectProvider<ScheduledNotificationDeliveryService> scheduledNotificationDeliveryServiceProvider;
    @Mock
    private ObjectProvider<EmailTemplateRenderer> emailTemplateRendererProvider;
    @Mock
    private ObjectProvider<EmailProviderGateway> emailProviderGatewayProvider;
    @Mock
    private ObjectProvider<EmailProperties> emailPropertiesProvider;
    @Mock
    private ObjectProvider<com.raxim.myscoutee.domain.platform.api.RuntimeConfiguration> configPropertiesProvider;
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
        org.mockito.Mockito.lenient().doCallRealMethod().when(activitiesMembersService)
                .queryNotificationAudience(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.anyString());
        emailProperties.setEnabled(true);
        emailProperties.setBaseUrl("https://myscoutee.test");
        configProperties.setFirebaseEnabled(false);
        service = new ScheduledMessageTaskService(
                mongoTemplate,
                scheduledMessageTasksRepository,
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(profiles),
                new com.raxim.myscoutee.domain.accounts.service.AccountInactivityService(profiles, userSessionActionsRepository, affinityRecomputeTaskService),
                scheduledMessageAuditService,
                emailOutboxRepository,
                emailTemplatesRepository,
                notificationTemplatesRepository,
                activitiesMembersServiceProvider,
                scheduledNotificationDeliveryServiceProvider,
                emailTemplateRendererProvider,
                emailProviderGatewayProvider,
                emailPropertiesProvider,
                configPropertiesProvider);

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

    }

    @AfterEach
    void tearDown() {
        service.shutdown();
    }

    @Test
    void scheduledEventNotificationsReachOutboxWithoutFirebaseAndRetainEmailFallback() {
        prepareNotificationDelivery();
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("user-1"),
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
                eq(com.raxim.myscoutee.domain.notifications.service.NotificationCatalogService.templateSnapshot(notificationTemplate)),
                anyMap(),
                anyString());
        verify(emailOutboxRepository, times(2)).saveAll(anyList());
        assertThat((Integer) ReflectionTestUtils.invokeMethod(stageResult, "count")).isEqualTo(1);
        assertThat((Integer) ReflectionTestUtils.invokeMethod(eventChangeResult, "count")).isEqualTo(1);
    }

    @Test
    void firebaseAcceptedNotificationDoesNotAlsoQueueEmailFallback() {
        prepareNotificationDelivery();
        configProperties.setFirebaseEnabled(true);
        when(activitiesMembersService.queryOwnerSnapshot("event", "event-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(),
                        List.of("user-1"),
                        List.of("user-1"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        1));

        ReflectionTestUtils.invokeMethod(service, "markStageReminderDue", stageReminderTask(), "run-stage");

        verify(scheduledNotificationDeliveryService).send(
                eq(recipient),
                eq(com.raxim.myscoutee.domain.notifications.service.NotificationCatalogService.templateSnapshot(notificationTemplate)),
                anyMap(),
                anyString());
        verify(emailOutboxRepository, never()).saveAll(anyList());
    }

    @Test
    void eventLifecycleVariablesCarryContextualNotificationTones() {
        ScheduledMessageTask underReview = eventChangeTask();
        underReview.setPayload(Map.of(
                "eventTitle", "Board Game Night",
                "audienceUserIds", "user-1",
                "changeReasons", "under-review"));
        ScheduledMessageTask modified = eventChangeTask();
        modified.setPayload(Map.of(
                "eventTitle", "Board Game Night",
                "audienceUserIds", "user-1",
                "changeReasons", "modified"));
        ScheduledMessageTask watcherUpdate = eventChangeTask();
        watcherUpdate.setPayload(Map.of(
                "eventTitle", "Board Game Night",
                "audienceUserIds", "user-1",
                "changeReasons", "schedule",
                "recipientScope", "event-watchers"));

        @SuppressWarnings("unchecked")
        Map<String, String> underReviewVariables = ReflectionTestUtils.invokeMethod(
                service,
                "eventDefinitionChangedVariables",
                underReview,
                recipient);
        @SuppressWarnings("unchecked")
        Map<String, String> modifiedVariables = ReflectionTestUtils.invokeMethod(
                service,
                "eventDefinitionChangedVariables",
                modified,
                recipient);
        @SuppressWarnings("unchecked")
        Map<String, String> watcherVariables = ReflectionTestUtils.invokeMethod(
                service,
                "eventDefinitionChangedVariables",
                watcherUpdate,
                recipient);

        assertThat(underReviewVariables)
                .containsEntry("change_summary", "The event is under review.")
                .containsEntry("notification_tone", "warning")
                .containsEntry("notification_kind", "event-under-review")
                .containsEntry("notification_source_type", "event")
                .containsEntry("notification_source_id", "event-1")
                .containsEntry("notification_recipient_scope", "event-participants");
        assertThat(modifiedVariables)
                .containsEntry("change_summary", "The event is available again.")
                .containsEntry("notification_message_key", "notification.event.available.again.message")
                .containsEntry("notification_tone", "success")
                .containsEntry("notification_kind", "event-modified");
        assertThat(watcherVariables)
                .containsEntry("change_summary", "The event schedule changed.")
                .containsEntry("notification_recipient_scope", "event-watchers")
                .containsEntry("notification_kind", "event-details-changed");
    }

    @Test
    void lifecycleTransitionsUseDistinctTaskOccurrences() {
        String first = ReflectionTestUtils.invokeMethod(
                service,
                "eventLifecycleChangedTaskKey",
                "event-1");
        String second = ReflectionTestUtils.invokeMethod(
                service,
                "eventLifecycleChangedTaskKey",
                "event-1");

        assertThat(first).startsWith("event-lifecycle-changed:event-1:");
        assertThat(second).startsWith("event-lifecycle-changed:event-1:");
        assertThat(second).isNotEqualTo(first);
    }

    @Test
    void stageReminderResolvesBrandingOnceAndSnapshotsItForPushAndEmail() {
        prepareNotificationDelivery();
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
                eq(com.raxim.myscoutee.domain.notifications.service.NotificationCatalogService.templateSnapshot(notificationTemplate)),
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

    private void prepareNotificationDelivery() {
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(scheduledNotificationDeliveryServiceProvider.getIfAvailable())
                .thenReturn(scheduledNotificationDeliveryService);
        when(emailTemplateRendererProvider.getIfAvailable()).thenReturn(emailTemplateRenderer);
        when(emailPropertiesProvider.getIfAvailable()).thenReturn(emailProperties);
        when(configPropertiesProvider.getIfAvailable()).thenReturn(configProperties);
        when(notificationTemplatesRepository.findByTemplateKey("notification-template"))
                .thenAnswer(call -> Optional.of(com.raxim.myscoutee.domain.notifications.service.NotificationCatalogService.templateSnapshot(notificationTemplate)));
        when(emailTemplatesRepository.findByTemplateKey("email-template"))
                .thenReturn(Optional.of(emailTemplate));
        when(profiles.findByUserIdIn(anyCollection())).thenReturn(List.of(recipient));
        when(scheduledNotificationDeliveryService.send(
                eq(recipient),
                org.mockito.ArgumentMatchers.argThat(template -> template.equals(
                        com.raxim.myscoutee.domain.notifications.service.NotificationCatalogService.templateSnapshot(notificationTemplate))),
                anyMap(),
                anyString()))
                .thenReturn(true);
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
