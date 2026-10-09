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
    @Override public int visibleCount(String baseId, String accountId, java.util.Collection<String> managedGroups) {
        long total = cases.bucketCounts(baseId, accountId, managedGroups).stream()
                .filter(bucket -> !"trash".equals(bucket.status())).mapToLong(bucket -> bucket.count()).sum();
        return (int) Math.min(Integer.MAX_VALUE, total);
    }
    private final ServiceCasesRepository cases;
    public CaseParticipantsService(ServiceCasesRepository cases) { this.cases = cases; }
    @Override public Optional<List<String>> activeAccounts(String caseId) { return cases.findById(caseId).map(c -> c.activeParticipantAccountIds()); }
}
