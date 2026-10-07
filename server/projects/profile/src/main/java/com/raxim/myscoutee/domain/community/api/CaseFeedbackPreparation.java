package com.raxim.myscoutee.domain.community.api;

public interface CaseFeedbackPreparation {
    java.util.Set<String> CRITERIA = java.util.Set.of("quality", "reliability", "communication", "value");
    int prepareSnapshot(String snapshot);
    record Request(String caseId, long version, String baseGroupId, String snapshot) {}
}
