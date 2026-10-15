package com.raxim.myscoutee.common.delivery;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.data.annotation.Id;

/** Shared execution model; each service stores tasks only in its own collection. No credentials or executable URLs. */
public record OutboundRetryTask(@Id String id, String operation, Map<String, Object> request,
        List<JobRun> jobs, String status, int attemptCount, Instant nextAttemptAt,
        String claim, String lastError, Instant finishedAt,
        Integer reportAttempts, Instant reportAt, String reportClaim, String lastReportError) {
    public OutboundRetryTask { if (reportAttempts == null) reportAttempts = 0; }
    public record JobRun(String ruleKey, String groupId, String startedAtIso) {}
}
