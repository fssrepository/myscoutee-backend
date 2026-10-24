package com.raxim.myscoutee.microservices.transport.accounts;

public final class RatingSessionProtocol {
    public static final String PATH = "/_internal/v1/accounts/rating-session";
    public static final String AUDIENCE = "accounts:rating-session";
    public static final int MAX_REQUEST_BYTES = 16384;
    private RatingSessionProtocol() {}
    public record Query(String requestedUserId) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.accounts.dto.RatingSessionDto value) {}
    public record Error(String code) {}
    public static boolean valid(Query query) {
        return query != null && (query.requestedUserId() == null || query.requestedUserId().length() <= 512);
    }
}
