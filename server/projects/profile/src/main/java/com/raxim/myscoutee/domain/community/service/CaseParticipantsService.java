package com.raxim.myscoutee.domain.community.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;

@Service
public class CaseParticipantsService implements CaseParticipants {
    private final ServiceCasesRepository cases;
    public CaseParticipantsService(ServiceCasesRepository cases) { this.cases = cases; }
    @Override public Optional<List<String>> activeAccounts(String caseId) { return cases.findById(caseId).map(c -> c.activeParticipantAccountIds()); }
}
