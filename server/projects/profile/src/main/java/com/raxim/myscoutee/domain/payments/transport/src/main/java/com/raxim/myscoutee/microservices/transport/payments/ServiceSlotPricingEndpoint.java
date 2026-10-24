package com.raxim.myscoutee.microservices.transport.payments;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.payments.api.ServiceSlotPricing;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ServiceSlotPricingEndpoint {
    private final ServiceSlotPricing owner;
    private final ObjectMapper mapper;
    public ServiceSlotPricingEndpoint(ServiceSlotPricing owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ServiceSlotPricingProtocol.QUOTE, produces = "application/json")
    public ResponseEntity<?> quote(HttpServletRequest request) throws java.io.IOException {
        return read(request, ServiceSlotPricingProtocol.Query.class, ServiceSlotPricingProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ServiceSlotPricingProtocol.Result(true, com.raxim.myscoutee.domain.payments.dto.ServiceSlotQuoteDto.from(owner.quoteServiceSlot(command.pricing(), command.templateId(), command.startAtIso(), command.occupied())))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ServiceSlotPricingProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ServiceSlotPricingProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new ServiceSlotPricingProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new ServiceSlotPricingProtocol.Error("SERVICE_SLOT_PRICING_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
