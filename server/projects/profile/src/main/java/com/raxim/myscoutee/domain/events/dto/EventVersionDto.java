package com.raxim.myscoutee.domain.events.dto;

/** The exact optimistic-write identity; no reconstructed event document crosses the boundary. */
public record EventVersionDto(String id, String updatedDate) {}
