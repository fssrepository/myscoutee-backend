package com.raxim.myscoutee.domain.payments.dto;
public record AssetPaymentReplacement(
            String predecessorPaymentId,
            String successorPaymentId,
            @com.fasterxml.jackson.annotation.JsonProperty(required = true)
            @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL)
            boolean paymentRequired) {
        public static AssetPaymentReplacement free() {
            return new AssetPaymentReplacement(null, null, false);
        }
    }
