package com.raxim.myscoutee.domain.access.security;

import com.raxim.myscoutee.domain.chat.api.ChatDirectory.Chat;
import com.raxim.myscoutee.domain.accounts.api.ProfileDirectory;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import org.springframework.stereotype.Component;

/** Existing case active-account check, retaining its owner read and profile lookup. */
@Component
public class CaseChatPolicyRestriction implements ChatPolicyRestriction {
    private final CaseParticipants cases;
    private final ProfileDirectory usersRepository;

    public CaseChatPolicyRestriction(CaseParticipants cases, ProfileDirectory usersRepository) {
        this.cases = cases; this.usersRepository = usersRepository;
    }

    @Override
    public boolean allows(Chat chat, String normalizedActorUserId) {
        if ("case".equals(chat.getChannelType())) {
            var c = cases.activeAccounts(chat.getOwnerId()).orElse(null);
            var profile = usersRepository.findByUserId(normalizedActorUserId).orElse(null);
            if (c == null || profile == null || !"myscoutee-community".equals(profile.getWorkspaceGroupId())
                    || !c.contains(profile.getAccountUserId() == null ? normalizedActorUserId : profile.getAccountUserId())) return false;
        }
        return true;
    }
}
