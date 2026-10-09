package com.raxim.myscoutee.domain.payments.dto;

import com.raxim.myscoutee.domain.payments.api.RevenuePayment;

public record RevenuePaymentDto(
        String status,
        String createdDate,
        String currency,
        String userId,
        String sourceId,
        String refundCurrency,
        String auditKind,
        String provider,
        String checkoutSessionId,
        String gatewaySessionId,
        Double amount,
        Double refundedAmount) implements RevenuePayment {
    public static RevenuePaymentDto from(RevenuePayment payment) {
        return new RevenuePaymentDto(payment.getStatus(), payment.getCreatedDate(), payment.getCurrency(), payment.getUserId(), payment.getSourceId(), payment.getRefundCurrency(), payment.getAuditKind(), payment.getProvider(), payment.getCheckoutSessionId(), payment.getGatewaySessionId(), payment.getAmount(), payment.getRefundedAmount());
    }
    @Override public String getStatus() { return status; }
    @Override public String getCreatedDate() { return createdDate; }
    @Override public String getCurrency() { return currency; }
    @Override public String getUserId() { return userId; }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getRefundCurrency() { return refundCurrency; }
    @Override public String getAuditKind() { return auditKind; }
    @Override public String getProvider() { return provider; }
    @Override public String getCheckoutSessionId() { return checkoutSessionId; }
    @Override public String getGatewaySessionId() { return gatewaySessionId; }
    @Override public Double getAmount() { return amount; }
    @Override public Double getRefundedAmount() { return refundedAmount; }
}
