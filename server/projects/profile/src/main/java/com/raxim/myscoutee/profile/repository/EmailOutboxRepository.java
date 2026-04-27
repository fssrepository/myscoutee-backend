package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.EmailOutboxItem;

public interface EmailOutboxRepository extends MongoRepository<EmailOutboxItem, String> {
    List<EmailOutboxItem> findByUserIdAndRuleKeyOrderByCreatedDateDesc(String userId, String ruleKey);
}
