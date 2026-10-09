package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.GraphScience;

public final class GraphScienceProtocol {
    public static final String REFRESH = "/_internal/v1/affinity/graph-science/refresh";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private GraphScienceProtocol() {}
    public static String[] paths() { return new String[]{REFRESH}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Query(Scope scope, String key, java.util.Map<String, java.util.Map<String, Long>> existing) {}
    public static boolean valid(Query q) { return q!=null && scope(q.scope()) && text(q.key(),512) && (q.existing()==null || q.existing().size()<=4096); }
}
