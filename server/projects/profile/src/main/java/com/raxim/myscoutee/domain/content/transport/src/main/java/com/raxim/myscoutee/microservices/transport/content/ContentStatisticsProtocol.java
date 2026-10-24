package com.raxim.myscoutee.microservices.transport.content;

public final class ContentStatisticsProtocol {
    public static final String REPORTS = "/_internal/v1/content/statistics/unresolved-reports";
    public static final String FEEDBACK = "/_internal/v1/content/statistics/unresolved-feedback";
    public static final String FEED = "/_internal/v1/content/statistics/feed";
    public static final int MAX_REQUEST_BYTES = 4096;
    private ContentStatisticsProtocol() {}
    public record Query(String userId) {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{REPORTS, FEEDBACK, FEED}; }
    public static boolean valid(Query query) { return query != null && query.userId() != null && !query.userId().isBlank() && query.userId().length() <= 512; }
}
