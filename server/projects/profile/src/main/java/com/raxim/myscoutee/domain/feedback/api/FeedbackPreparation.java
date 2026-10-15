package com.raxim.myscoutee.domain.feedback.api;

public interface FeedbackPreparation {
    java.util.Set<String> CRITERIA = java.util.Set.of("quality", "reliability", "communication", "value");
    int prepareSnapshot(String snapshot);
    record Provider(String accountId, String serviceId) {}
    record Context(String id, String title, String updatedAtIso, java.util.List<String> reviewers, java.util.List<Provider> providers) {}
    record Request(String caseId, long version, String baseGroupId, String snapshot) {}
}
