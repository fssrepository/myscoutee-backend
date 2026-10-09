package com.raxim.myscoutee.microservices.transport.content;

public final class AdministrativeActorsProtocol {
    public static final String ACTOR = "/_internal/v1/content/administrative-actors/actor";
    public static final String GROUP = "/_internal/v1/content/administrative-actors/group";
    public static final String AUDIENCE = "content:administrative-actors";
    public static final int MAX_REQUEST_BYTES = 16384;
    private AdministrativeActorsProtocol() {}
    public static String[] paths() { return new String[]{ACTOR, GROUP}; }
    public record Query(String adminUserId) {}
    public record GroupResult(Boolean resolved, String groupId) {}
    public record Error(String code) {}
    public static boolean valid(Query query) { return query != null && (query.adminUserId() == null || query.adminUserId().length() <= 512); }
}
