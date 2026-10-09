package com.raxim.myscoutee.microservices.transport.payments;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.payments.api.AssetPayments;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetPaymentsEndpoint {
    private final AssetPayments owner;
    private final ObjectMapper mapper;
    public AssetPaymentsEndpoint(AssetPayments owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AssetPaymentsProtocol.VALIDATE, produces = "application/json")
    public ResponseEntity<?> validate(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetPaymentsProtocol.Validate.class, AssetPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.validateAssetPaymentReplacement(command.predecessorSession(), command.successorSession(), command.predecessorUser(), command.successorUser(), command.assetId(), command.eventId(), command.subEventId())));
    }
    @PostMapping(value = AssetPaymentsProtocol.COMPLETE, produces = "application/json")
    public ResponseEntity<?> complete(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetPaymentsProtocol.Complete.class, AssetPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.completeAssetPaymentReplacement(command.replacement(), command.successorUser(), command.eventId(), command.subEventId()))));
    }
    @PostMapping(value = AssetPaymentsProtocol.BOOKING, produces = "application/json")
    public ResponseEntity<?> booking(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetPaymentsProtocol.Booking.class, AssetPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.recordAssetBooking(command.session(), command.userId(), command.sourceId(), command.slot(), command.start(), command.end(), command.policy(), command.eventId(), command.subEventId()))));
    }
    @PostMapping(value = AssetPaymentsProtocol.REVISION, produces = "application/json")
    public ResponseEntity<?> revision(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetPaymentsProtocol.Revision.class, AssetPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AssetPaymentsProtocol.Audit(true, owner.recordAssetBookingPriceRevision(command.session(), command.userId(), command.sourceId(), command.title(), command.timeframe(), command.previousQuantity(), command.nextQuantity(), command.previousTotal(), command.nextTotal(), command.currency()))));
    }
    @PostMapping(value = AssetPaymentsProtocol.CANCEL, produces = "application/json")
    public ResponseEntity<?> cancel(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetPaymentsProtocol.Cancel.class, AssetPaymentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.cancelAssetBooking(command.session(), command.start(), command.policy()))));
    }
    private AssetPaymentsProtocol.Receipt receipt(Runnable action) { action.run(); return new AssetPaymentsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetPaymentsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AssetPaymentsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new AssetPaymentsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AssetPaymentsProtocol.Error("ASSET_PAYMENTS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
