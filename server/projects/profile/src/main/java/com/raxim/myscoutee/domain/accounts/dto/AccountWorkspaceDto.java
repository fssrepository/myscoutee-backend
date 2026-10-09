package com.raxim.myscoutee.domain.accounts.dto;

public record AccountWorkspaceDto(String profileId,
        @com.fasterxml.jackson.annotation.JsonProperty(required = true)
        @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) long attention) {}
