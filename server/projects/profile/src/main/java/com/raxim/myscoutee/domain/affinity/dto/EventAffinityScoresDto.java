package com.raxim.myscoutee.domain.affinity.dto;

public record EventAffinityScoresDto(
        @com.fasterxml.jackson.annotation.JsonProperty(required = true)
        @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) double affinity,
        @com.fasterxml.jackson.annotation.JsonProperty(required = true)
        @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) double boost) {}
