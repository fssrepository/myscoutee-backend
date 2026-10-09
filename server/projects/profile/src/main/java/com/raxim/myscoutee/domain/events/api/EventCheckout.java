package com.raxim.myscoutee.domain.events.api;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.domain.payments.api.PaymentFulfillment;
public interface EventCheckout {
    EventParticipationActionResultDto payEventCheckout(EventCheckoutStateChangeRequestDto request, String provider);
    EventParticipationActionResultDto finalizeAuthorizedPayment(PaymentFulfillment payment);
    /** A remote outcome is unknown; it must not be interpreted as a rejected place or trigger compensation. */
    final class OutcomeUnknown extends RuntimeException {
        public OutcomeUnknown(Throwable cause) { super("Event checkout outcome is not yet known", cause); }
    }
}
