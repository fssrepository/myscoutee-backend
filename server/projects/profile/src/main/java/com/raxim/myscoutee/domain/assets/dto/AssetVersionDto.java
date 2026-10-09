package com.raxim.myscoutee.domain.assets.dto;

/** The exact optimistic-write identity; no reconstructed asset document crosses the boundary. */
public record AssetVersionDto(String id, String updatedDate) {}
