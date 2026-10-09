package com.raxim.myscoutee.domain.notifications.api;

import java.util.Optional;

public interface NotificationCatalog {
    long countUnread(String userId);
    long failedJobs(String baseGroupId);
    long countOutbox(String baseGroupId, String status);
    Optional<Template> findByTemplateKey(String templateKey);

    record Template(String templateKey, Boolean enabled, String titleTemplate, String bodyTemplate,
                    String iconUrl, String badgeUrl, String ctaPath) {}
}
