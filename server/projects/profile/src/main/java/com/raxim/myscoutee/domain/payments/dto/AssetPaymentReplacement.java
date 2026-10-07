package com.raxim.myscoutee.domain.payments.dto;
public record AssetPaymentReplacement(
            String predecessorPaymentId,
            String successorPaymentId,
            boolean paymentRequired) {
        public static AssetPaymentReplacement free() {
            return new AssetPaymentReplacement(null, null, false);
        }
    }
