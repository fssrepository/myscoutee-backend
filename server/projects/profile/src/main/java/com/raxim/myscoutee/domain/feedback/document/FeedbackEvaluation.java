package com.raxim.myscoutee.domain.feedback.document;

import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

@Document("feedbackEvaluations")
@CompoundIndexes({
    @CompoundIndex(name="feedback_evaluation_viewer", def="{'viewerAccountId':1,'status':1,'createdAtIso':-1,'_id':1}"),
    @CompoundIndex(name="feedback_evaluation_provider", def="{'providerAccountId':1,'status':1,'createdAtIso':-1,'_id':1}")
})
public record FeedbackEvaluation(@Id String id, String baseGroupId, String caseId, String caseTitle,
        String serviceId, String providerAccountId, String viewerAccountId, String status,
        Map<String, Double> criteria, Double average, String comment, String createdAtIso, String submittedAtIso,
        @com.fasterxml.jackson.annotation.JsonIgnore CounterState counterState) {
    public record CounterState(long revision, String status, java.util.List<String> reviewerProfileIds,
            java.util.List<com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.Change> pending) {}
}
