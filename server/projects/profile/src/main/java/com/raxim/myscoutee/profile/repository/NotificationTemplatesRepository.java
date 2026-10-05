package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.NotificationTemplate;

public interface NotificationTemplatesRepository extends MongoRepository<NotificationTemplate, String> {
    List<NotificationTemplate> findByBaseGroupId(String baseGroupId);
    Optional<NotificationTemplate> findByBaseGroupIdAndTemplateKey(String baseGroupId, String templateKey);
    default Optional<NotificationTemplate> findByTemplateKey(String templateKey) {
        return findByBaseGroupIdAndTemplateKey(com.raxim.myscoutee.profile.service.JobGroupContext.groupId(), templateKey);
    }

    List<NotificationTemplate> findByBaseGroupIdAndEnabledTrueOrderByTemplateKeyAsc(String baseGroupId);
    default List<NotificationTemplate> findByEnabledTrueOrderByTemplateKeyAsc() {
        return findByBaseGroupIdAndEnabledTrueOrderByTemplateKeyAsc(com.raxim.myscoutee.profile.service.JobGroupContext.groupId());
    }
}
