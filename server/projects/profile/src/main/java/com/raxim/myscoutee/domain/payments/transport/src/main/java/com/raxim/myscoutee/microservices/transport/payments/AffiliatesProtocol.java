package com.raxim.myscoutee.microservices.transport.payments;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.payments.api.Affiliates;

public final class AffiliatesProtocol {
    public static final String LINK = "/_internal/v1/payments/affiliates/link";
    public static final String SUMMARY = "/_internal/v1/payments/affiliates/summary";
    public static final String PARTICIPANTS = "/_internal/v1/payments/affiliates/participants";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AffiliatesProtocol() {}
    public static String[] paths() { return new String[]{LINK, SUMMARY, PARTICIPANTS}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Query(Scope scope, String owner) {}
    public record Link(Boolean resolved, String value) {}
    public static boolean valid(Query q) { return q!=null && scope(q.scope()) && text(q.owner(),512); }
}
