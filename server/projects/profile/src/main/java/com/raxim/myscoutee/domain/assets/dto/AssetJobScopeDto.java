package com.raxim.myscoutee.domain.assets.dto;

/** Stored job ownership only; the platform owner resolves its base-group scope. */
public record AssetJobScopeDto(String workspaceGroupId, String ownerUserId, String creatorUserId) {}
