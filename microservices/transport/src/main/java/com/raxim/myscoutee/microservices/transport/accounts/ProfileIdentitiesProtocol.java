package com.raxim.myscoutee.microservices.transport.accounts;

public final class ProfileIdentitiesProtocol {
    public static final String PROFILE_PATH = "/_internal/v1/accounts/identities/profile";
    public static final String FIRST_PROFILE_PATH = "/_internal/v1/accounts/identities/profile/first";
    public static final String EXISTS_PATH = "/_internal/v1/accounts/identities/exists";
    public static final String WORKSPACE_PATH = "/_internal/v1/accounts/identities/workspace";
    public static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private ProfileIdentitiesProtocol() {}
    public record Error(String code) {}
}
