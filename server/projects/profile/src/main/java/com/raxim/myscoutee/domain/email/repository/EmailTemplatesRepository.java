package com.raxim.myscoutee.domain.email.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.email.document.EmailTemplate;

public interface EmailTemplatesRepository extends MongoRepository<EmailTemplate, String> {
    List<EmailTemplate> findByBaseGroupId(String baseGroupId);
    Optional<EmailTemplate> findByBaseGroupIdAndTemplateKey(String baseGroupId, String templateKey);
    default Optional<EmailTemplate> findByTemplateKey(String templateKey) {
        return findByBaseGroupIdAndTemplateKey(com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId(), templateKey);
    }

    List<EmailTemplate> findByBaseGroupIdAndEnabledTrueOrderByTemplateKeyAsc(String baseGroupId);
    default List<EmailTemplate> findByEnabledTrueOrderByTemplateKeyAsc() {
        return findByBaseGroupIdAndEnabledTrueOrderByTemplateKeyAsc(com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId());
    }
}
