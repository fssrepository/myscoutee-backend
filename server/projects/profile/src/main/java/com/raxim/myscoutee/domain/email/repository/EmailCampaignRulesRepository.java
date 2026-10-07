package com.raxim.myscoutee.domain.email.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.email.document.EmailCampaignRule;

public interface EmailCampaignRulesRepository extends MongoRepository<EmailCampaignRule, String> {
    List<EmailCampaignRule> findByBaseGroupId(String baseGroupId);
    Optional<EmailCampaignRule> findByBaseGroupIdAndRuleKey(String baseGroupId, String ruleKey);
    default Optional<EmailCampaignRule> findByRuleKey(String ruleKey) {
        return findByBaseGroupIdAndRuleKey(com.raxim.myscoutee.domain.platform.service.JobGroupContext.groupId(), ruleKey);
    }

    List<EmailCampaignRule> findByBaseGroupIdAndEnabledTrueOrderByPriorityDescRuleKeyAsc(String baseGroupId);
    default List<EmailCampaignRule> findByEnabledTrueOrderByPriorityDescRuleKeyAsc() {
        return findByBaseGroupIdAndEnabledTrueOrderByPriorityDescRuleKeyAsc(com.raxim.myscoutee.domain.platform.service.JobGroupContext.groupId());
    }
}
