package com.raxim.myscoutee.domain.notifications.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.notifications.document.NotificationTemplate;
import com.raxim.myscoutee.domain.notifications.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.domain.notifications.repository.NotificationRuleConfigsRepository;
import com.raxim.myscoutee.domain.notifications.repository.NotificationTemplatesRepository;
import com.raxim.myscoutee.domain.notifications.repository.UserNotificationPageRepository;

@Tag("standard")
class NotificationCatalogServiceTest {
    private final UserNotificationPageRepository inbox = mock(UserNotificationPageRepository.class);
    private final NotificationRuleConfigsRepository rules = mock(NotificationRuleConfigsRepository.class);
    private final NotificationOutboxRepository outbox = mock(NotificationOutboxRepository.class);
    private final NotificationTemplatesRepository templates = mock(NotificationTemplatesRepository.class);
    private final NotificationCatalogService service = new NotificationCatalogService(inbox, rules, outbox, templates);

    @Test
    void countersPreserveScopeAndCountAFailedRuleOnceEvenWhenBothStatusesFail() {
        when(rules.findByBaseGroupId("work")).thenReturn(List.of(
                rule("failed", "timeout"), rule("ready", " MISSED "), rule("running", "completed")));
        when(outbox.countByBaseGroupIdAndStatus("work", "pending")).thenReturn(7L);
        when(inbox.countUnread("account")).thenReturn(4L);

        assertThat(service.failedJobs("work")).isEqualTo(2);
        assertThat(service.countOutbox("work", "pending")).isEqualTo(7);
        assertThat(service.countUnread("account")).isEqualTo(4);
        verify(rules).findByBaseGroupId("work");
        verify(outbox).countByBaseGroupIdAndStatus("work", "pending");
        verify(inbox).countUnread("account");
        verifyNoMoreInteractions(rules, outbox, inbox);
    }

    @Test
    void templateLookupReturnsDetachedRenderingValuesAndPreservesDisabledState() {
        var template = new NotificationTemplate();
        template.setTemplateKey("event");
        template.setEnabled(false);
        template.setTitleTemplate("Title");
        template.setBodyTemplate("Body");
        template.setIconUrl("icon");
        template.setBadgeUrl("badge");
        template.setCtaPath("/event");
        when(templates.findByTemplateKey("event")).thenReturn(Optional.of(template));

        var value = service.findByTemplateKey("event").orElseThrow();
        template.setTitleTemplate("Changed after lookup");

        assertThat(value).isEqualTo(new com.raxim.myscoutee.domain.notifications.api.NotificationCatalog.Template(
                "event", false, "Title", "Body", "icon", "badge", "/event"));
        verify(templates).findByTemplateKey("event");
        verifyNoMoreInteractions(templates);
    }

    private NotificationRuleConfig rule(String current, String previous) {
        var rule = new NotificationRuleConfig();
        var state = new NotificationRuleConfig.RunState();
        state.setCurrentStatus(current);
        state.setLastRunStatus(previous);
        rule.setRunState(state);
        return rule;
    }
}
