package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.dto.UserAffinityInputDto;

public final class UserAffinityScoresProtocol {
    public static final String PATH = "/_internal/v1/affinity/user-affinity";
    public static final int MAX_REQUEST_BYTES = 64 * 1024;
    private UserAffinityScoresProtocol() {}
    public record Query(UserAffinityInputDto user, String workspaceGroupId) {}
    public record Score(Double affinity) {}
    public record Error(String code) {}
}
