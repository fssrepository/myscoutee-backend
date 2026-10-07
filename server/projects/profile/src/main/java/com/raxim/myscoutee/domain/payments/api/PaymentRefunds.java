package com.raxim.myscoutee.domain.payments.api;

import com.raxim.myscoutee.domain.payments.dto.PaymentDtos.*;

public interface PaymentRefunds {
    PaymentHistoryMutationDto requestChangedTermsRefund(String paymentId, String actorUserId);
}
