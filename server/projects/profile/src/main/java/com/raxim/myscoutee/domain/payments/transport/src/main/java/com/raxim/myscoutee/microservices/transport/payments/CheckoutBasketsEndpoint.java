package com.raxim.myscoutee.microservices.transport.payments;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.payments.api.CheckoutBaskets;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CheckoutBasketsEndpoint {
    private final CheckoutBaskets owner;
    private final ObjectMapper mapper;
    public CheckoutBasketsEndpoint(CheckoutBaskets owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = CheckoutBasketsProtocol.BASKET, produces = "application/json")
    public ResponseEntity<?> basket(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.UserEvent.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CheckoutBasketsProtocol.Result(true, owner.loadBasketByEvent(command.userId(), command.sourceId()))));
    }
    @PostMapping(value = CheckoutBasketsProtocol.CARDS, produces = "application/json")
    public ResponseEntity<?> cards(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.UserEvents.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.loadCardStatesByEvent(command.userId(), command.sourceIds())));
    }
    @PostMapping(value = CheckoutBasketsProtocol.SLOTS, produces = "application/json")
    public ResponseEntity<?> slots(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.Source.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.activeSlotReservationCountsByEvent(command.sourceId())));
    }
    @PostMapping(value = CheckoutBasketsProtocol.OPTIONAL, produces = "application/json")
    public ResponseEntity<?> optional(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.Source.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.activeOptionalReservationCountsByEvent(command.sourceId())));
    }
    @PostMapping(value = CheckoutBasketsProtocol.SAVE, produces = "application/json")
    public ResponseEntity<?> save(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.Save.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CheckoutBasketsProtocol.Result(true, owner.saveBasket(command.request()))));
    }
    @PostMapping(value = CheckoutBasketsProtocol.UPDATE, produces = "application/json")
    public ResponseEntity<?> update(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.Update.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CheckoutBasketsProtocol.Result(true, owner.updateBasketState(command.request()))));
    }
    @PostMapping(value = CheckoutBasketsProtocol.RETIRE, produces = "application/json")
    public ResponseEntity<?> retire(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.Retire.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.retireCancelledEventReservations(command.sourceId(), command.participantIds()))));
    }
    @PostMapping(value = CheckoutBasketsProtocol.FINALIZE, produces = "application/json")
    public ResponseEntity<?> finalizeCheckout(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.UserEvent.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.finalizeAcceptedReservation(command.userId(), command.sourceId()))));
    }
    @PostMapping(value = CheckoutBasketsProtocol.EXPIRED, produces = "application/json")
    public ResponseEntity<?> expired(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.Expired.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CheckoutBasketsProtocol.Decision(owner.wasCheckoutExpired(command.userId(), command.sourceId(), command.requestAtIso()))));
    }
    @PostMapping(value = CheckoutBasketsProtocol.PURGE, produces = "application/json")
    public ResponseEntity<?> purge(HttpServletRequest request) throws java.io.IOException {
        return read(request, CheckoutBasketsProtocol.Purge.class, CheckoutBasketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CheckoutBasketsProtocol.Count(owner.purgeExpiredDraftBasketsScheduled(command.now()))));
    }
    private CheckoutBasketsProtocol.Receipt receipt(Runnable action) { action.run(); return new CheckoutBasketsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, CheckoutBasketsProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CheckoutBasketsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new CheckoutBasketsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new CheckoutBasketsProtocol.Error("CHECKOUT_BASKETS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
