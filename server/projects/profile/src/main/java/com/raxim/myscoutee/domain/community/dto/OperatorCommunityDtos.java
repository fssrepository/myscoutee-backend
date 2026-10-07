package com.raxim.myscoutee.domain.community.dto;

public final class OperatorCommunityDtos {
    private OperatorCommunityDtos() {
    }

    public record CommunityProviderDto(
            String id,
            String name,
            String purpose,
            String url,
            boolean configured,
            boolean available) {
    }
}
