package com.raxim.myscoutee.domain.payments.api;

/** Only the payment facts consumed by existing operator revenue validation. */
public interface RevenuePayment {
    String getStatus();
    String getCreatedDate();
    String getCurrency();
    String getUserId();
    String getSourceId();
    String getRefundCurrency();
    String getAuditKind();
    String getProvider();
    String getCheckoutSessionId();
    String getGatewaySessionId();
    Double getAmount();
    Double getRefundedAmount();
}
