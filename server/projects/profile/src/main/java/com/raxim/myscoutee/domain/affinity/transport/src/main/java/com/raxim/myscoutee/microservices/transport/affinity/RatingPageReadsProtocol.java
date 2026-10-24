package com.raxim.myscoutee.microservices.transport.affinity;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.affinity.api.RatingPageReads;

public final class RatingPageReadsProtocol {
    public static final String PAGE = "/_internal/v1/affinity/rating-page-reads/page";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "affinity:rating-page-reads";
    private RatingPageReadsProtocol() {}
    public static String[] paths() { return new String[]{PAGE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Query(Scope scope, String userId, String mode, String direction, String sort, String sortDirection, String secondary, Boolean badge, String cursor, Integer limit, String rangeStart, String rangeEnd, String campaignId) {}
    public static boolean valid(Query q) { return q != null && scope(q.scope()) && q.userId()!=null && q.badge()!=null && java.util.Arrays.asList(q.userId(),q.mode(),q.direction(),q.sort(),q.sortDirection(),q.secondary(),q.cursor(),q.rangeStart(),q.rangeEnd(),q.campaignId()).stream().allMatch(v -> text(v,8192)); }
}
