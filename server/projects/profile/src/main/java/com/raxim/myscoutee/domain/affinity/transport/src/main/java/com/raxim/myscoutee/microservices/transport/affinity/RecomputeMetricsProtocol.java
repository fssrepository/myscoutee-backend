package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.RecomputeMetrics;

public final class RecomputeMetricsProtocol {
    public static final String PATH = "/_internal/v1/affinity/recompute/metrics";
    private RecomputeMetricsProtocol() {}
    public record Result(Boolean resolved, RecomputeMetrics.Snapshot value) {}
    public record Error(String code) {}
}
