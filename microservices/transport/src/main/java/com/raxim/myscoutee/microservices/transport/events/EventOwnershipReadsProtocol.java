package com.raxim.myscoutee.microservices.transport.events;

import java.util.Collection;
import com.raxim.myscoutee.domain.events.dto.EventOwnershipDto;

public final class EventOwnershipReadsProtocol {
    public static final String ROOT = "/_internal/v1/events/ownership";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 16 * 1024 * 1024;
    private EventOwnershipReadsProtocol() {}
    public static final String OWNED = ROOT + "/owned";
    public static final String OWNED_EXISTS = ROOT + "/owned-exists";
    public static final String STORED_FAMILY = ROOT + "/stored-family";
    public static final String BY_ID = ROOT + "/by-id";
    public static final String BY_SOURCE_IDS = ROOT + "/by-source-ids";
    public static final String BY_CREATOR = ROOT + "/by-creator";
    public static final String ALL = ROOT + "/all";
    public static final String BY_SOURCE_ID = ROOT + "/by-source-id";
    public static final String ID_OR_SOURCE_ID = ROOT + "/id-or-source-id";
    public static final String CHAT_NAVIGATION = ROOT + "/chat-navigation";
    public static final String DIRECT_OWNER = ROOT + "/direct-owner";
    public static final String ADMIN_VISIBLE = ROOT + "/admin-visible";
    public static final String ACCEPTED_MEMBERSHIP = ROOT + "/accepted-membership";
    public static final String ACTIVE_INVITATION = ROOT + "/active-invitation";
    public static final String PENDING_REQUEST = ROOT + "/pending-request";
    public static final String BY_OWNER = ROOT + "/by-owner";
    public static final String BY_ADMIN = ROOT + "/by-admin";
    public static final String HOME_GAME_MEMBERS = ROOT + "/home-game-members";
    public static final String ACTIVE_ORIGINALS = ROOT + "/active-originals";
    public static final String STORED_SOURCES = ROOT + "/stored-sources";
    public static String[] paths() { return new String[]{OWNED, OWNED_EXISTS, STORED_FAMILY, BY_ID, BY_SOURCE_IDS, BY_CREATOR, ALL, BY_SOURCE_ID, ID_OR_SOURCE_ID, CHAT_NAVIGATION, DIRECT_OWNER, ADMIN_VISIBLE, ACCEPTED_MEMBERSHIP, ACTIVE_INVITATION, PENDING_REQUEST, BY_OWNER, BY_ADMIN, HOME_GAME_MEMBERS, ACTIVE_ORIGINALS, STORED_SOURCES}; }
    public record IdQuery(String id) {}
    public record IdsQuery(Collection<String> ids) {}
    public record OwnedQuery(String owner, String id) {}
    public record EmptyQuery() {}
    public record SingleResult(Boolean resolved, EventOwnershipDto value) {}
    public record Decision(Boolean value) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    private static boolean ids(Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(EventOwnershipReadsProtocol::id); }
    public static boolean valid(IdQuery q) { return q != null && id(q.id()); }
    public static boolean valid(IdsQuery q) { return q != null && ids(q.ids()); }
    public static boolean valid(OwnedQuery q) { return q != null && id(q.owner()) && id(q.id()); }
    public static boolean valid(EmptyQuery q) { return q != null; }
}
