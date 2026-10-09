package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces;

public final class AccountWorkspacesProtocol {
    public static final String SELECT = "/_internal/v1/accounts/account-workspaces/select";
    public static final String ACTIVATE = "/_internal/v1/accounts/account-workspaces/activate";
    public static final String ADMIT = "/_internal/v1/accounts/account-workspaces/admit";
    public static final String POLICY = "/_internal/v1/accounts/account-workspaces/policy";
    public static final String CLEAR = "/_internal/v1/accounts/account-workspaces/clear";
    public static final String ROSTER = "/_internal/v1/accounts/account-workspaces/roster";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AccountWorkspacesProtocol() {}
    public static String[] paths() { return new String[]{SELECT, ACTIVATE, ADMIT, POLICY, CLEAR, ROSTER}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto value) {}
    public record Select(Scope scope, String accountId, String groupId) {}
    public record Policy(Scope scope, com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto group, String accountId) {}
    public record Roster(Scope scope, String accountId) {}
    public static boolean valid(Select q) { return q != null && scope(q.scope()) && text(q.accountId(), 512) && text(q.groupId(), 512); }
    public static boolean valid(Policy q) { return q != null && scope(q.scope()) && q.group() != null && q.group().id() != null && q.group().policy() != null && text(q.group().id(), 512) && text(q.accountId(), 512); }
    public static boolean valid(Roster q) { return q != null && scope(q.scope()) && text(q.accountId(), 512); }
}
