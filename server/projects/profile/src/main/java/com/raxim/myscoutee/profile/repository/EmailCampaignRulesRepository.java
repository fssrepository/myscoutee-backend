package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.EmailCampaignRule;

public interface EmailCampaignRulesRepository extends MongoRepository<EmailCampaignRule, String> {
    Optional<EmailCampaignRule> findByRuleKey(String ruleKey);

    List<EmailCampaignRule> findByEnabledTrueOrderByPriorityDescRuleKeyAsc();
}
