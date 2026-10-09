package com.raxim.myscoutee.domain.assets.dto;

import com.raxim.myscoutee.domain.assets.api.AssetMembershipFacts;

public record AssetMembershipRequestDto(String userId, String status) implements AssetMembershipFacts.Request {}
