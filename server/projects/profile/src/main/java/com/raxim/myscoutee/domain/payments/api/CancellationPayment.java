package com.raxim.myscoutee.domain.payments.api;

/** Routing and actor facts needed by the existing event cancellation worker. */
public interface CancellationPayment {
    String getId();
    String getUserId();
    String getSourceId();
    String getContextEventId();
    String getFulfillmentKind();
    String getCancellationSessionMode();
    String getCancellationReason();
    String getCancellationRequestedBy();
}
