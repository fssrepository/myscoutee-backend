package com.raxim.myscoutee.domain.events.dto;

/** Stored job ownership only; the platform owner resolves its base-group scope. */
public record EventJobScopeDto(String workspaceGroupId, String ownerUserId, String creatorUserId) {}
