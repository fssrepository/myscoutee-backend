package com.raxim.myscoutee.domain.accounts.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.api.GroupAdministration;

/** Existing community case-menu calculation, kept outside the generic stored counter read. */
@Service
class CommunityProfileCounters implements ProfileCommunityCounters {
    private final CaseParticipants caseParticipants;
    private final GroupDirectory communityGroupsRepository;
    private final GroupAdministration groupAdministration;

    CommunityProfileCounters(CaseParticipants caseParticipants, GroupDirectory groups, GroupAdministration administration) {
        this.caseParticipants = caseParticipants;
        this.communityGroupsRepository = groups;
        this.groupAdministration = administration;
    }

    @Override public int count(Users user) {
        if (caseParticipants == null || user.getWorkspaceGroupId() == null) return 0;
        boolean community = com.raxim.myscoutee.domain.groups.api.BaseGroups.COMMUNITY_BASE_ID.equals(user.getWorkspaceGroupId())
                || communityGroupsRepository.findById(user.getWorkspaceGroupId()).map(g -> "community".equals(g.effectiveType())).orElse(false);
        if (!community) return 0;
        String account = StringUtils.hasText(user.getAccountUserId()) ? user.getAccountUserId() : user.getUserId();
        var managed = groupAdministration.managedGroups(account);
        return caseParticipants.visibleCount(com.raxim.myscoutee.domain.groups.api.BaseGroups.COMMUNITY_BASE_ID, account, managed);
    }
}
