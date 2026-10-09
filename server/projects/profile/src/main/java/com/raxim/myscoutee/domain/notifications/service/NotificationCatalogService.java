package com.raxim.myscoutee.domain.notifications.service;

import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog;
import com.raxim.myscoutee.domain.notifications.document.NotificationTemplate;
import com.raxim.myscoutee.domain.notifications.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.domain.notifications.repository.NotificationRuleConfigsRepository;
import com.raxim.myscoutee.domain.notifications.repository.NotificationTemplatesRepository;
import com.raxim.myscoutee.domain.notifications.repository.UserNotificationPageRepository;

@Service
public class NotificationCatalogService implements NotificationCatalog {
    private final UserNotificationPageRepository inbox;
    private final NotificationRuleConfigsRepository rules;
    private final NotificationOutboxRepository outbox;
    private final NotificationTemplatesRepository templates;

    public NotificationCatalogService(UserNotificationPageRepository inbox, NotificationRuleConfigsRepository rules,
            NotificationOutboxRepository outbox, NotificationTemplatesRepository templates) {
        this.inbox = inbox;
        this.rules = rules;
        this.outbox = outbox;
        this.templates = templates;
    }

    @Override
    public long countUnread(String userId) { return inbox.countUnread(userId); }

    @Override
    public long countOutbox(String baseGroupId, String status) {
        return outbox.countByBaseGroupIdAndStatus(baseGroupId, status);
    }

    @Override
    public long failedJobs(String baseGroupId) {
        return rules.findByBaseGroupId(baseGroupId).stream()
                .filter(rule -> rule != null && rule.getRunState() != null)
                .filter(rule -> failed(rule.getRunState().getCurrentStatus()) || failed(rule.getRunState().getLastRunStatus()))
                .count();
    }

    private boolean failed(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        return normalized.contains("failed") || normalized.contains("error")
                || normalized.contains("missed") || normalized.contains("timeout");
    }

    @Override
    public Optional<Template> findByTemplateKey(String templateKey) {
        return templates.findByTemplateKey(templateKey).map(NotificationCatalogService::templateSnapshot);
    }

    public static Template templateSnapshot(NotificationTemplate template) {
        return new Template(template.getTemplateKey(), template.getEnabled(), template.getTitleTemplate(),
                template.getBodyTemplate(), template.getIconUrl(), template.getBadgeUrl(), template.getCtaPath());
    }
}
