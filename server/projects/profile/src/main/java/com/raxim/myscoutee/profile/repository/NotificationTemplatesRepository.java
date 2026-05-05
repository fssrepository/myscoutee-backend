package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.NotificationTemplate;

public interface NotificationTemplatesRepository extends MongoRepository<NotificationTemplate, String> {
    Optional<NotificationTemplate> findByTemplateKey(String templateKey);

    List<NotificationTemplate> findByEnabledTrueOrderByTemplateKeyAsc();
}
