package com.raxim.myscoutee.domain.chat.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.community.dto.CaseConversation;
import com.raxim.myscoutee.domain.groups.api.BaseGroups;

/** The existing case/offer participant restriction, independent of generic chat storage. */
@Service
class CaseChatAccessRestriction implements ChatAccessRestriction {
    private final CaseParticipants cases;
    private final ProfileSummaries profiles;

    CaseChatAccessRestriction(CaseParticipants cases, ProfileSummaries profiles) {
        this.cases = cases; this.profiles = profiles;
    }

    @Override
    public boolean allows(Chat chat, String actorUserId) {
        if (!"case".equals(chat.getChannelType())) return true;
        return caseChatAccess(cases.conversation(chat.getOwnerId()).orElse(null),
                profiles.findByUserId(actorUserId).orElse(null), chat.getCaseOfferId());
    }

    static boolean caseChatAccess(CaseConversation serviceCase, ProfileSummary actor, String caseOfferId) {
        return serviceCase != null && actor != null
                && BaseGroups.COMMUNITY_BASE_ID.equals(actor.getWorkspaceGroupId())
                && BaseGroups.COMMUNITY_BASE_ID.equals(serviceCase.baseGroupId())
                && (StringUtils.hasText(caseOfferId) ? serviceCase.offerChatParticipantAccountIds(caseOfferId) : serviceCase.chatParticipantAccountIds()).contains(
                        StringUtils.hasText(actor.getAccountUserId()) ? actor.getAccountUserId() : actor.getUserId());
    }

}
