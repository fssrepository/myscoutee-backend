package com.raxim.myscoutee.domain.community.api;

public interface CaseFeedbackPreparation {
    int prepareSnapshot(String snapshot);
    record Request(String caseId, long version, String baseGroupId, String snapshot) {}
}
