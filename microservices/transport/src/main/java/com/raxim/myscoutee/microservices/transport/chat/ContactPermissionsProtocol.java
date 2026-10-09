package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.ContactPermissions;

public final class ContactPermissionsProtocol {
    public static final String USER = "/_internal/v1/chat/contact-permissions/user";
    public static final String ENTRY = "/_internal/v1/chat/contact-permissions/entry";
    public static final String SAVE = "/_internal/v1/chat/contact-permissions/save";
    public static final String AUDIENCE = "chat:contact-permissions";
    public static final int MAX_REQUEST_BYTES = 16384;
    private ContactPermissionsProtocol() {}
    public record UserQuery(String userId) {}
    public record EntryQuery(String id) {}
    public record Save(ContactPermissions.Change change) {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{USER, ENTRY, SAVE}; }
    public static boolean id(String value, int limit) { return value != null && !value.isBlank() && value.length() <= limit; }
    private static boolean bounded(String value) { return value == null || value.length() <= 512; }
    public static boolean valid(ContactPermissions.Change value) {
        return value != null && id(value.leftUserId(), 512) && id(value.rightUserId(), 512)
                && value.leftUserId().compareTo(value.rightUserId()) < 0
                && ContactPermissions.canonicalPairId(value.leftUserId(), value.rightUserId()).equals(value.id())
                && (value.leftUserId().equals(value.requestedBy()) || value.rightUserId().equals(value.requestedBy()))
                && value.status() != null && java.util.List.of("pending", "approved", "rejected").contains(value.status())
                && bounded(value.requestedAtIso()) && bounded(value.decidedAtIso())
                && (value.version() == null || value.version() >= 0);
    }
    public static boolean participant(ContactPermissions.Permission value, String actor) {
        return value != null && (actor.equals(value.leftUserId()) || actor.equals(value.rightUserId()));
    }
}
