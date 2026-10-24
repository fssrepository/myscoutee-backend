package com.raxim.myscoutee.microservices.transport.operator;

public final class OperatorReportsProtocol {
    public static final String MEASUREMENTS = "/_internal/v1/operator/reports/measurements";
    public static final String REVENUE = "/_internal/v1/operator/reports/revenue";
    public static final String AUDIENCE = "operator:integration-reports";
    public static final int MAX_REQUEST_BYTES = 16384, MAX_RESPONSE_BYTES = 4 * 1024 * 1024;
    private OperatorReportsProtocol() {}
    public static String[] paths() { return new String[]{MEASUREMENTS, REVENUE}; }
    public record Query(String status, Integer page, Integer size) {}
    public record Error(String code) {}
    public static boolean valid(Query q) {
        return q != null && q.page() != null && q.size() != null && (q.status() == null || q.status().length() <= 512);
    }
}
