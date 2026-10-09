package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import com.raxim.myscoutee.domain.events.api.EventCheckout;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;
import com.raxim.myscoutee.domain.payments.api.PaymentFulfillment;
import com.raxim.myscoutee.domain.payments.dto.PaymentFulfillmentDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEventCheckout extends RemoteReadTransport implements EventCheckout {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer signer;
    public RemoteEventCheckout(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public EventParticipationActionResultDto payEventCheckout(EventCheckoutStateChangeRequestDto request, String provider) {
        if (request == null) return null;
        var command = new EventCheckoutProtocol.Pay(EventCheckoutProtocol.Scope.current(), request, provider);
        byte[] bytes = encode(command, EventCheckoutProtocol.valid(command));
        return invoke(EventCheckoutProtocol.PAY, bytes, Map.of(ActorDelegation.HEADER,
                signer.issueForCurrent(EventCheckoutProtocol.AUDIENCE, "POST", EventCheckoutProtocol.PAY, bytes)));
    }
    @Override public EventParticipationActionResultDto finalizeAuthorizedPayment(PaymentFulfillment payment) {
        if (payment == null) return null;
        try {
            var command = new EventCheckoutProtocol.Finalize(EventCheckoutProtocol.Scope.current(), PaymentFulfillmentDto.from(payment));
            return invoke(EventCheckoutProtocol.FINALIZE, encode(command, EventCheckoutProtocol.valid(command)), Map.of());
        } catch (EventCheckout.OutcomeUnknown unknown) { throw unknown; }
        catch (RuntimeException unavailable) { throw new EventCheckout.OutcomeUnknown(unavailable); }
    }
    private EventParticipationActionResultDto invoke(String path, byte[] bytes, Map<String, String> proof) {
        try {
            return exchangeAuthorized(path, bytes, new TypeReference<EventCheckoutProtocol.Result>() {},
                    "events.event-checkout." + (path.equals(EventCheckoutProtocol.PAY) ? "pay" : "finalize"),
                    EventCheckoutProtocol.MAX_RESPONSE_BYTES, result -> Boolean.TRUE.equals(result.resolved()), proof).value();
        } catch (RemoteReadException unknown) { throw new EventCheckout.OutcomeUnknown(unknown); }
    }
    private byte[] encode(Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid event checkout request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventCheckoutProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event checkout request exceeds size bound");
        return bytes;
    }
}
