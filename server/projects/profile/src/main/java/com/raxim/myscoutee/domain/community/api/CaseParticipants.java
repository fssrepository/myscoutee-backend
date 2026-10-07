package com.raxim.myscoutee.domain.community.api;

import java.util.List;
import java.util.Optional;

public interface CaseParticipants { Optional<List<String>> activeAccounts(String caseId); }
