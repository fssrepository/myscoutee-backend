package com.raxim.myscoutee.domain.payments.dto;

public record ServiceSlotQuoteDto(
        @com.fasterxml.jackson.annotation.JsonProperty(required = true)
        @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) double amount,
        String currency, java.util.List<com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPricingSummaryRowDto> rows)
        implements com.raxim.myscoutee.domain.payments.api.ServiceSlotPricing.Quote {
    public static ServiceSlotQuoteDto from(com.raxim.myscoutee.domain.payments.api.ServiceSlotPricing.Quote q) {
        return q == null ? null : new ServiceSlotQuoteDto(q.amount(), q.currency(), q.rows());
    }
}
