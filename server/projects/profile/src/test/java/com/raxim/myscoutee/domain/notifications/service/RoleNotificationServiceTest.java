package com.raxim.myscoutee.domain.notifications.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.List;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import com.raxim.myscoutee.domain.accounts.api.AccountNotifications;
import com.raxim.myscoutee.domain.accounts.api.AccountNotifications.RoleRecipient;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;
import com.raxim.myscoutee.domain.notifications.api.RoleNotifications.MemberRegistration;
import com.raxim.myscoutee.domain.platform.api.AdministratorSettings;
import com.raxim.myscoutee.domain.platform.config.ConfigProperties;

@Tag("standard")
class RoleNotificationServiceTest {
    private final AccountNotifications accounts = mock(AccountNotifications.class);
    private final AdministratorSettings settings = mock(AdministratorSettings.class);
    private final ConfigProperties config = new ConfigProperties();
    private final NotificationOutboxService outbox = mock(NotificationOutboxService.class);
    private final RoleNotificationService service = new RoleNotificationService(accounts, config, settings, outbox);

    @Test
    void workspaceAndPrivilegedRegistrationsDoNotBecomeNewMemberAlerts() {
        when(settings.isAdminEmail("admin@test")).thenReturn(true);
        service.memberJoined(new MemberRegistration("operator", "operator@test", true, false));
        service.memberJoined(new MemberRegistration("admin", "admin@test", false, false));
        service.memberJoined(new MemberRegistration("workspace", "member@test", false, true));
        verifyNoInteractions(accounts, outbox);
    }

    @Test
    void releaseRetainsOperatorAudienceAndDurableIdentity() {
        config.setOperatorUser(" Operator@Test ");
        config.setOperatorBootstrapEmail("operator@test");
        when(accounts.roleRecipients(anyCollection())).thenReturn(List.of(
                new RoleRecipient("operator", "operator@test", true),
                new RoleRecipient("ordinary", "operator@test", false)));

        service.releaseAvailable("v-next");

        var intent = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(outbox).enqueueOnce(eq("role:release-available:v-next:operator"), intent.capture());
        assertThat(intent.getValue().recipientUserIds()).containsExactly("operator");
        assertThat(intent.getValue().clickUrl()).isEqualTo("/operator?notificationTarget=updates");
        verify(accounts).roleRecipients(java.util.Set.of("operator@test"));
        verifyNoMoreInteractions(outbox, accounts);
    }

    @Test
    void moderationRetainsAdminAudienceAndDoesNotExposeMemberProfileFields() {
        when(settings.adminEmails()).thenReturn(List.of("admin@test"));
        when(settings.isAdminEmail("admin@test")).thenReturn(true);
        when(accounts.roleRecipients(anyCollection())).thenReturn(List.of(new RoleRecipient("admin", "admin@test", false)));

        service.moderationSubmitted("report-submitted", "report-id");

        var intent = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(outbox).enqueueOnce(eq("role:report-submitted:report-id:admin"), intent.capture());
        assertThat(intent.getValue().entityType()).isEqualTo("app-admin");
        assertThat(intent.getValue().clickUrl()).isEqualTo("/admin?notificationTarget=reports");
        assertThat(intent.getValue().payload()).containsEntry("roleTarget", "reports")
                .doesNotContainKeys("email", "name", "userId");
        verify(accounts).roleRecipients(java.util.Set.of("admin@test"));
    }
}
