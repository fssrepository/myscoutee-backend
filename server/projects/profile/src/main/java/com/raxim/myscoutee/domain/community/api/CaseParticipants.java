package com.raxim.myscoutee.domain.community.api;

import java.util.List;
import java.util.Optional;

public interface CaseParticipants {
    Optional<com.raxim.myscoutee.domain.community.dto.CaseConversation> conversation(String caseId);
    void groupAdminsChanged(String groupId, List<String> adminAccountIds);
 Optional<List<String>> activeAccounts(String caseId); }
