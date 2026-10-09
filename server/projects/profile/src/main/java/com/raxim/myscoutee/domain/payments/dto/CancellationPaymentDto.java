package com.raxim.myscoutee.domain.payments.dto;

import com.raxim.myscoutee.domain.payments.api.CancellationPayment;

public record CancellationPaymentDto(String id, String userId, String sourceId, String contextEventId,
        String fulfillmentKind, String cancellationSessionMode, String cancellationReason, String cancellationRequestedBy)
        implements CancellationPayment {
    public static CancellationPaymentDto from(CancellationPayment p) {
        return new CancellationPaymentDto(p.getId(), p.getUserId(), p.getSourceId(), p.getContextEventId(),
                p.getFulfillmentKind(), p.getCancellationSessionMode(), p.getCancellationReason(), p.getCancellationRequestedBy());
    }
    @Override public String getId() { return id; }
    @Override public String getUserId() { return userId; }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getContextEventId() { return contextEventId; }
    @Override public String getFulfillmentKind() { return fulfillmentKind; }
    @Override public String getCancellationSessionMode() { return cancellationSessionMode; }
    @Override public String getCancellationReason() { return cancellationReason; }
    @Override public String getCancellationRequestedBy() { return cancellationRequestedBy; }
}
