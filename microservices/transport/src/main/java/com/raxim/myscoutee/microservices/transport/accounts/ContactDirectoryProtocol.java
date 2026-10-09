package com.raxim.myscoutee.microservices.transport.accounts;

public final class ContactDirectoryProtocol {
    public static final String PATH = "/_internal/v1/accounts/contact-directory";
    public static final int MAX_REQUEST_BYTES = 16384;
    private ContactDirectoryProtocol() {}
    public record Query(String userId) {}
    public record Error(String code) {}
    public static boolean valid(Query value) { return value != null && (value.userId() == null || value.userId().length() <= 512); }
}
