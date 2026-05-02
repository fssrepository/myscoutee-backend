package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;

public interface NotificationRuleConfigsRepository extends MongoRepository<NotificationRuleConfig, String> {
    Optional<NotificationRuleConfig> findByRuleKey(String ruleKey);
}
