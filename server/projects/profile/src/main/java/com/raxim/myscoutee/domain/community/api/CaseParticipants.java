package com.raxim.myscoutee.domain.community.api;

import java.util.List;
import java.util.Optional;

public interface CaseParticipants {
    Optional<com.raxim.myscoutee.domain.community.dto.CaseConversation> conversation(String caseId);
    int visibleCount(String baseId, String accountId, java.util.Collection<String> managedGroups);
 Optional<List<String>> activeAccounts(String caseId); }
