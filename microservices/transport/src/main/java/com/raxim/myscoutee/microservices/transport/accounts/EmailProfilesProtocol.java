package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.Collection;
import com.raxim.myscoutee.domain.accounts.dto.EmailProfileDto;

public final class EmailProfilesProtocol {
    public static final String SINGLE = "/_internal/v1/accounts/email-profiles/single";
    public static final String BATCH = "/_internal/v1/accounts/email-profiles/batch";
    public static final String ALL = "/_internal/v1/accounts/email-profiles/all";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024;
    public static final int MAX_RESPONSE_BYTES = 16 * 1024 * 1024;
    private EmailProfilesProtocol() {}
    public static String[] paths() { return new String[]{SINGLE, BATCH, ALL}; }
    public record SingleQuery(String userId) {}
    public record BatchQuery(Collection<String> userIds) {}
    public record AllQuery() {}
    public record SingleResult(Boolean resolved, EmailProfileDto value) {}
    public record Error(String code) {}
    public static boolean valid(SingleQuery query) { return query != null && id(query.userId()); }
    public static boolean valid(BatchQuery query) {
        return query != null && query.userIds() != null && query.userIds().size() <= 4096 && query.userIds().stream().allMatch(EmailProfilesProtocol::id);
    }
    private static boolean id(String value) { return value == null || value.length() <= 512; }
}
