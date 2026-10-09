package com.raxim.myscoutee.domain.accounts.dto;

import java.util.Map;
import java.util.Collections;
import java.util.LinkedHashMap;

/** Stored account payment projection; normalization remains in the payment presentation owner. */
public record AccountPaymentSummaryDto(Map<String, Double> spent, Map<String, Double> income, Integer pendingRefunds) {
    public AccountPaymentSummaryDto {
        if (spent != null) spent = Collections.unmodifiableMap(new LinkedHashMap<>(spent));
        if (income != null) income = Collections.unmodifiableMap(new LinkedHashMap<>(income));
    }
}
