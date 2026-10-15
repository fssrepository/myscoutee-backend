package com.raxim.myscoutee.domain.community.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;

@Service
public class CaseParticipantsService implements CaseParticipants {
    @Override public Optional<com.raxim.myscoutee.domain.community.dto.CaseConversation> conversation(String caseId) {
        return cases.findById(caseId).map(com.raxim.myscoutee.domain.community.mapper.CaseConversationMapper::toConversation);
    }
    @org.springframework.beans.factory.annotation.Autowired
    private CommunityCaseCounterWork counterWork;
    @org.springframework.beans.factory.annotation.Autowired
    private CommunityVoteCounterWork votes;
    @Override public void groupAdminsChanged(String groupId, List<String> adminAccountIds) {
        counterWork.groupAdminsChanged(groupId, adminAccountIds);
        votes.membersChanged(groupId);
    }
    private final ServiceCasesRepository cases;
    public CaseParticipantsService(ServiceCasesRepository cases) { this.cases = cases; }
    @Override public Optional<List<String>> activeAccounts(String caseId) { return cases.findById(caseId).map(c -> c.activeParticipantAccountIds()); }
}
