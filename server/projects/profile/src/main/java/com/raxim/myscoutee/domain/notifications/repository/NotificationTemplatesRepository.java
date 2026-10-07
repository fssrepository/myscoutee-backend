package com.raxim.myscoutee.domain.notifications.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.notifications.document.NotificationTemplate;

public interface NotificationTemplatesRepository extends MongoRepository<NotificationTemplate, String> {
    List<NotificationTemplate> findByBaseGroupId(String baseGroupId);
    Optional<NotificationTemplate> findByBaseGroupIdAndTemplateKey(String baseGroupId, String templateKey);
    default Optional<NotificationTemplate> findByTemplateKey(String templateKey) {
        return findByBaseGroupIdAndTemplateKey(com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId(), templateKey);
    }

    List<NotificationTemplate> findByBaseGroupIdAndEnabledTrueOrderByTemplateKeyAsc(String baseGroupId);
    default List<NotificationTemplate> findByEnabledTrueOrderByTemplateKeyAsc() {
        return findByBaseGroupIdAndEnabledTrueOrderByTemplateKeyAsc(com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId());
    }
}
