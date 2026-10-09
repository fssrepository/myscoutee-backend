package com.raxim.myscoutee.microservices.transport.affinity;

public final class RecomputeQueueProtocol {
    public static final String PATH = "/_internal/v1/affinity/recompute-queue/count";
    private RecomputeQueueProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{PATH}; }
}
