package com.raxim.myscoutee.domain.feedback.api;
import java.time.Instant;
import java.util.*;
import com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.FeedbackBucketDelta;
public interface FeedbackEligibility {
    record Projection(Map<String, FeedbackBucketDelta> deltas, List<String> projectedSources, List<String> waitingSources,
            List<com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.Change> changes) {}
    Projection project(Collection<String> sourceIds, Instant now);
    void complete(Projection projection);
}
