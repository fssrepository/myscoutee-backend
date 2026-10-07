package com.raxim.myscoutee.domain.events.api;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.domain.payments.api.PaymentView;
public interface EventCheckout {
    EventParticipationActionResultDto payEventCheckout(EventCheckoutStateChangeRequestDto request, String provider);
    EventParticipationActionResultDto finalizeAuthorizedPayment(PaymentView payment);
}
