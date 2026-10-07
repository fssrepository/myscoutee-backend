package com.raxim.myscoutee.domain.events.api;
import java.time.Instant;
import java.util.*;
import com.raxim.myscoutee.domain.accounts.api.FeedbackCounterChanges.FeedbackBucketDelta;
public interface FeedbackEligibility {
    record Projection(Map<String, FeedbackBucketDelta> deltas, List<String> projectedSources, List<String> waitingSources) {}
    Projection project(Collection<String> sourceIds, Instant now);
    void complete(Projection projection);
}
