package com.raxim.myscoutee.domain.notifications.api;

import com.raxim.myscoutee.domain.administration.dto.AdminDtos.*;

public interface NotificationAdministration {
    AdminNotificationCenterStateDto state(String adminUserId, String filter);
    AdminNotificationRuleDto ruleState(String ruleKey, String adminUserId);
    AdminNotificationCenterStateDto save(AdminNotificationRuleSaveRequestDto request, String filter);
    AdminNotificationRuleRunResultDto run(String ruleKey, AdminNotificationRuleRunRequestDto request);
}
