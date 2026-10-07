package com.raxim.myscoutee.domain.email.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.email.document.EmailOutboxItem;

public interface EmailOutboxRepository extends MongoRepository<EmailOutboxItem, String> {
    List<EmailOutboxItem> findByUserIdAndRuleKeyOrderByCreatedDateDesc(String userId, String ruleKey);
}
