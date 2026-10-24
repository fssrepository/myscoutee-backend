package com.raxim.myscoutee.microservices.transport.payments;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.payments.api.AssetPayments;

public final class AssetPaymentsProtocol {
    public static final String VALIDATE = "/_internal/v1/payments/asset-payments/validate";
    public static final String COMPLETE = "/_internal/v1/payments/asset-payments/complete";
    public static final String BOOKING = "/_internal/v1/payments/asset-payments/booking";
    public static final String REVISION = "/_internal/v1/payments/asset-payments/revision";
    public static final String CANCEL = "/_internal/v1/payments/asset-payments/cancel";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AssetPaymentsProtocol() {}
    public static String[] paths() { return new String[]{VALIDATE, COMPLETE, BOOKING, REVISION, CANCEL}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Receipt(Boolean completed) {}
    public record Validate(Scope scope, String predecessorSession, String successorSession, String predecessorUser, String successorUser, String assetId, String eventId, String subEventId) {}
    public record Complete(Scope scope, com.raxim.myscoutee.domain.payments.dto.AssetPaymentReplacement replacement, String successorUser, String eventId, String subEventId) {}
    public record Booking(Scope scope, String session, String userId, String sourceId, String slot, String start, String end, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy, String eventId, String subEventId) {}
    public record Revision(Scope scope, String session, String userId, String sourceId, String title, String timeframe, Integer previousQuantity, Integer nextQuantity, Double previousTotal, Double nextTotal, String currency) {}
    public record Cancel(Scope scope, String session, String start, com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto policy) {}
    public record Audit(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPaymentAuditDto value) {}
    private static boolean strings(String... values) { return java.util.Arrays.stream(values).allMatch(value -> text(value, 8192)); }
    public static boolean valid(Validate q) { return q != null && scope(q.scope()) && strings(q.predecessorSession(), q.successorSession(), q.predecessorUser(), q.successorUser(), q.assetId(), q.eventId(), q.subEventId()); }
    public static boolean valid(Complete q) { return q != null && scope(q.scope()) && strings(q.successorUser(), q.eventId(), q.subEventId()) && (q.replacement() == null || !q.replacement().paymentRequired() || q.replacement().predecessorPaymentId() != null && q.replacement().successorPaymentId() != null); }
    public static boolean valid(Booking q) { return q != null && scope(q.scope()) && strings(q.session(), q.userId(), q.sourceId(), q.slot(), q.start(), q.end(), q.eventId(), q.subEventId()); }
    public static boolean valid(Revision q) { return q != null && scope(q.scope()) && strings(q.session(), q.userId(), q.sourceId(), q.title(), q.timeframe(), q.currency()) && (q.previousTotal() == null || Double.isFinite(q.previousTotal())) && (q.nextTotal() == null || Double.isFinite(q.nextTotal())); }
    public static boolean valid(Cancel q) { return q != null && scope(q.scope()) && strings(q.session(), q.start()); }
}
