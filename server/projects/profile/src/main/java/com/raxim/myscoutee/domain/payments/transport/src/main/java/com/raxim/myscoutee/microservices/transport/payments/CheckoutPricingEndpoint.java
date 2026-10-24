package com.raxim.myscoutee.microservices.transport.payments;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.payments.api.CheckoutPricing;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CheckoutPricingEndpoint {
    private final CheckoutPricing owner;
    private final ObjectMapper mapper;
    public CheckoutPricingEndpoint(CheckoutPricing owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = CheckoutPricingProtocol.VIP, produces = "application/json")
    public ResponseEntity<?> vip(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutPricingProtocol.Vip.class, CheckoutPricingProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CheckoutPricingProtocol.Offer(true, owner.vipPricingOffer(command.sourceId(), command.userId()))));
    }
    @PostMapping(value = CheckoutPricingProtocol.REPRICE, produces = "application/json")
    public ResponseEntity<?> reprice(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutPricingProtocol.Reprice.class, CheckoutPricingProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CheckoutPricingProtocol.Result(true, owner.reprice(command.request()))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, CheckoutPricingProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CheckoutPricingProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new CheckoutPricingProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new CheckoutPricingProtocol.Error("CHECKOUT_PRICING_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
