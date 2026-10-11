package com.raxim.myscoutee.domain.chat.service;

import java.util.Set;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.groups.api.BaseGroups;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;

@Service
class CaseChatBroadcastAudience implements ChatBroadcastAudience {
    private final CaseParticipants cases;
    private final ProfileSummaries users;
    CaseChatBroadcastAudience(CaseParticipants cases, ProfileSummaries users) { this.cases = cases; this.users = users; }

    @Override
    public boolean supports(String chatId) { return chatId.startsWith("c-case-"); }

    @Override
    public Set<String> members(String chatId, MongoSessionMode mode) {
        MongoSessionMode previous = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(mode);
            var serviceCase = cases.conversation(chatId.substring("c-case-".length())).orElse(null);
            if (serviceCase == null || !BaseGroups.COMMUNITY_BASE_ID.equals(serviceCase.baseGroupId())) return Set.of();
            return users.findByWorkspaceGroupIdAndAccountUserIdIn(BaseGroups.COMMUNITY_BASE_ID, serviceCase.activeParticipantAccountIds())
                    .stream().map(u -> u.getUserId()).collect(java.util.stream.Collectors.toSet());
        } finally { MongoSessionModeContext.set(previous); }
    }

}
