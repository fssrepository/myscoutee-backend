package com.raxim.myscoutee.profile.service.email;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.NotificationTemplate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

class ScheduledNotificationDeliveryServiceTest {
    @Test
    void rendersDeploymentBrandingIntoTheNotificationIntent() {
        NotificationOutboxService outboxService =
                org.mockito.Mockito.mock(NotificationOutboxService.class);
        when(outboxService.enqueue(any(NotificationIntent.class)))
                .thenReturn(Optional.of(new NotificationOutboxItem()));
        EmailProperties emailProperties = new EmailProperties();
        emailProperties.setBaseUrl("https://community.example");
        ScheduledNotificationDeliveryService service =
                new ScheduledNotificationDeliveryService(
                        emailProperties,
                        new EmailTemplateRenderer(),
                        outboxService);
        NotificationTemplate template = new NotificationTemplate();
        template.setTemplateKey("profile-reminder");
        template.setTitleTemplate(
                "Finish your @product_name profile");
        template.setBodyTemplate("Welcome back, @user_first_name.");
        template.setIconUrl("@product_logo_url");
        template.setBadgeUrl("@product_logo_url");
        template.setCtaPath("/game");
        Users user = new Users();
        user.setUserId("user-1");

        boolean accepted = service.send(
                user,
                template,
                Map.of(
                        "product_name",
                        "Community Hub",
                        "product_logo_url",
                        "/api/assets/community.webp",
                        "product_branding_revision",
                        "23",
                        "user_first_name",
                        "Ada"),
                "profile-rule");

        assertThat(accepted).isTrue();
        ArgumentCaptor<NotificationIntent> intent =
                ArgumentCaptor.forClass(NotificationIntent.class);
        verify(outboxService).enqueue(intent.capture());
        assertThat(intent.getValue().title())
                .isEqualTo("Finish your Community Hub profile");
        assertThat(intent.getValue().body())
                .isEqualTo("Welcome back, Ada.");
        assertThat(intent.getValue().iconUrl())
                .isEqualTo("/api/assets/community.webp");
        assertThat(intent.getValue().badgeUrl())
                .isEqualTo("/api/assets/community.webp");
        assertThat(intent.getValue().clickUrl())
                .isEqualTo("https://community.example/game");
        assertThat(intent.getValue().payload())
                .containsEntry("product_name", "Community Hub")
                .containsEntry(
                        "product_logo_url",
                        "/api/assets/community.webp")
                .containsEntry("product_branding_revision", "23");
    }
}
