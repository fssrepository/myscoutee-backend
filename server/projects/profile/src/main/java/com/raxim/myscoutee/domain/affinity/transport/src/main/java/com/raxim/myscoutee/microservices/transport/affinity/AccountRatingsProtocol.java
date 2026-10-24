package com.raxim.myscoutee.microservices.transport.affinity;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.affinity.api.AccountRatings;

public final class AccountRatingsProtocol {
    public static final String SCORES = "/_internal/v1/affinity/account-ratings/scores";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AccountRatingsProtocol() {}
    public static String[] paths() { return new String[]{SCORES}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Query(Scope scope, String profileId) {}
    public static boolean valid(Query q) { return q != null && scope(q.scope()) && text(q.profileId(),512); }
}
