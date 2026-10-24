package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.payments.api.PaymentSimulatorConfiguration;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class PaymentSimulatorConfigurationEndpoint {
    private final PaymentSimulatorConfiguration owner;
    private final ObjectMapper mapper;
    public PaymentSimulatorConfigurationEndpoint(PaymentSimulatorConfiguration owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = PaymentSimulatorConfigurationProtocol.ENABLED, produces = "application/json")
    public ResponseEntity<?> enabled(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentSimulatorConfigurationProtocol.Query.class, PaymentSimulatorConfigurationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new PaymentSimulatorConfigurationProtocol.Decision(owner.isEnabled())));
    }
    @PostMapping(value = PaymentSimulatorConfigurationProtocol.CONFIGURATION, produces = "application/json")
    public ResponseEntity<?> configuration(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentSimulatorConfigurationProtocol.Query.class, PaymentSimulatorConfigurationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new PaymentSimulatorConfigurationProtocol.Result(true, owner.configuration())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        return new ReadQueryBodies.CommandReader(PaymentSimulatorConfigurationProtocol.MAX_REQUEST_BYTES, "PAYMENT_SIMULATOR_CONFIGURATION_UNAVAILABLE")
                .read(request, mapper, type, valid, action);
    }

}
