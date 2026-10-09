package com.raxim.myscoutee.microservices.transport.assets;

public final class TicketReadsProtocol {
    public static final String PATH = "/_internal/v1/assets/tickets";
    public static final String AUDIENCE = "assets:tickets:read";
    public static final int MAX_REQUEST_BYTES = 4096;
    private TicketReadsProtocol() {}
    public record Query(String userId, Integer page, Integer pageSize, String order) {}
    public record Error(String code) {}
    public static boolean valid(Query query) {
        return query.userId() != null && !query.userId().isBlank() && query.userId().length() <= 512
                && (query.page() == null || query.page() >= 0 && query.page() <= 1_000_000)
                && (query.pageSize() == null || query.pageSize() >= 1 && query.pageSize() <= 1000)
                && (query.order() == null || query.order().length() <= 512);
    }
}
