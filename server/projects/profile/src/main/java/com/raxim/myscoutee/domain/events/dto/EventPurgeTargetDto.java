package com.raxim.myscoutee.domain.events.dto;

/** Stored document identity and membership source retained by the account purge job. */
public record EventPurgeTargetDto(String id, String sourceId) {}
