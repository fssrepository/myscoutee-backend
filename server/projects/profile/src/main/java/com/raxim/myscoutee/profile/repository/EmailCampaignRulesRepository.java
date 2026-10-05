package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.EmailCampaignRule;

public interface EmailCampaignRulesRepository extends MongoRepository<EmailCampaignRule, String> {
    List<EmailCampaignRule> findByBaseGroupId(String baseGroupId);
    Optional<EmailCampaignRule> findByBaseGroupIdAndRuleKey(String baseGroupId, String ruleKey);
    default Optional<EmailCampaignRule> findByRuleKey(String ruleKey) {
        return findByBaseGroupIdAndRuleKey(com.raxim.myscoutee.profile.service.JobGroupContext.groupId(), ruleKey);
    }

    List<EmailCampaignRule> findByBaseGroupIdAndEnabledTrueOrderByPriorityDescRuleKeyAsc(String baseGroupId);
    default List<EmailCampaignRule> findByEnabledTrueOrderByPriorityDescRuleKeyAsc() {
        return findByBaseGroupIdAndEnabledTrueOrderByPriorityDescRuleKeyAsc(com.raxim.myscoutee.profile.service.JobGroupContext.groupId());
    }
}
