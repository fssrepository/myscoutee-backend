package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.AccountInactivity;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class AccountInactivityProtocol {
    public static final String INACTIVATE = "/_internal/v1/accounts/account-inactivity/inactivate";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 16 * 1024 * 1024;
    private AccountInactivityProtocol() {}
    public static String[] paths() { return new String[]{INACTIVATE}; }
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(JobGroupContext.isActive(), JobGroupContext.groupId()); }
    }
    public record Receipt(Boolean completed) {}
    public record Error(String code) {}
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Inactivate(Scope scope, String userId, Integer inactiveDays, java.time.Instant now) {}
    public record Result(String status, Integer count, String detail, com.raxim.myscoutee.domain.accounts.dto.EmailProfileDto profile, java.time.Instant nextDueAt) {
        public Result(AccountInactivity.Outcome outcome) {
            this(outcome.status(), outcome.count(), outcome.detail(), outcome.profile() == null ? null : com.raxim.myscoutee.domain.accounts.dto.EmailProfileDto.from(outcome.profile()), outcome.nextDueAt());
        }
        public AccountInactivity.Outcome outcome() { return new AccountInactivity.Outcome(status, count, detail, profile, nextDueAt); }
    }
    public static boolean valid(Inactivate value) { return value != null && scope(value.scope()) && text(value.userId(), 512) && value.inactiveDays() != null && value.now() != null; }
}
