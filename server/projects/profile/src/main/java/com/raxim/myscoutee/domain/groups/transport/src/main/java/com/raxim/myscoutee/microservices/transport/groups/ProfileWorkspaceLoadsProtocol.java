package com.raxim.myscoutee.microservices.transport.groups;

import com.raxim.myscoutee.domain.groups.dto.ProfileWorkspaceDto;

public final class ProfileWorkspaceLoadsProtocol {
    public static final String PATH = "/_internal/v1/groups/profile-workspace";
    public static final String AUDIENCE = "groups:profile-workspace";
    public static final int MAX_REQUEST_BYTES = 4096;
    private ProfileWorkspaceLoadsProtocol() {}
    public record Command(String accountId, String currentGroupId, String requestedGroupId) {}
    public record Result(Boolean completed, ProfileWorkspaceDto context) {}
    public record Error(String code) {}
    public static boolean valid(Command command) {
        return command != null && command.accountId() != null && !command.accountId().isBlank()
                && bounded(command.accountId()) && bounded(command.currentGroupId()) && bounded(command.requestedGroupId());
    }
    private static boolean bounded(String value) { return value == null || value.length() <= 512; }
}
