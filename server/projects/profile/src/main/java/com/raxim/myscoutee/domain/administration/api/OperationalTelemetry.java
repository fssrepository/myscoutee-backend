package com.raxim.myscoutee.domain.administration.api;

import java.util.Map;

public interface OperationalTelemetry {
    enum ProjectionInput { DERIVED, QUEUES }
    /** Coalesced owner-job notification; acknowledged only after the admin signal is persisted. */
    record ProjectionSignal(String producer, java.util.Map<ProjectionInput, Long> revisions) {}
    void signalProjectionInputs(ProjectionSignal signal);
    void record(String eventKey, String domain, String entityId, String actorUserId);
    void record(String eventKey, String domain, String entityId, String actorUserId, long amount);
    void record(String eventKey, String domain, String entityId, String actorUserId, long amount, Map<String, String> tags);
}
