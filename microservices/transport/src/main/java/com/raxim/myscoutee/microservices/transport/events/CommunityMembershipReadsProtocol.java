package com.raxim.myscoutee.microservices.transport.events;

public final class CommunityMembershipReadsProtocol {
    public static final String GROUP="/_internal/v1/events/community-memberships/group";
    public static final String MEMBER="/_internal/v1/events/community-memberships/member";
    public static final int MAX_RESPONSE_BYTES=2*1024*1024;
    private CommunityMembershipReadsProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{GROUP,MEMBER}; }
    static boolean validId(String id) { return id==null || id.length()<=512; }
}
