package com.raxim.myscoutee.microservices.transport.accounts;

public final class AccountJobScopesProtocol {
    public static final String PATH = "/_internal/v1/accounts/job-scopes/matching-owners";
    public static final int MAX_REQUEST_BYTES = 2097152;
    private AccountJobScopesProtocol() {}
    public record Query(java.util.Collection<String> ids, com.raxim.myscoutee.domain.platform.api.JobAudience.WorkspaceScope scope) {}
    public record Error(String code) {}
    public static boolean valid(Query value) { return value != null && (ids(value.ids(), 4096) && value.scope() != null && ids(value.scope().ids(), 1024)); }

    private static boolean ids(java.util.Collection<String> ids, int limit) {
        return ids != null && ids.size() <= limit && ids.stream().allMatch(id -> id != null && !id.isBlank() && id.length() <= 512);
    }
}
