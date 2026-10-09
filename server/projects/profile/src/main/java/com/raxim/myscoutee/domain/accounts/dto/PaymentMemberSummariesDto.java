package com.raxim.myscoutee.domain.accounts.dto;

import java.util.List;

/** Payment picker roster; excludes balances, credentials and devices. */
public record PaymentMemberSummariesDto(List<ProfileSummaryDto> items,
        @com.fasterxml.jackson.annotation.JsonProperty(required = true)
        @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) long total) {}
