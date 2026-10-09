package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.dto.AccountPaymentSummaryDto;
import com.raxim.myscoutee.domain.accounts.dto.PaymentParticipantDto;

/** Account-owned facts required by payments, without broad profile access. */
public interface AccountPaymentReads {
    Optional<AccountPaymentSummaryDto> paymentSummary(String userId);
    Optional<com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserPaymentTotalsDto> paymentTotals(String userId);
    List<PaymentParticipantDto> paymentParticipants(Collection<String> userIds);
}
