package com.raxim.myscoutee.domain.payments.api;
import com.raxim.myscoutee.domain.payments.dto.AssetPaymentReplacement;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPaymentAuditDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto;
public interface AssetPayments {
    /** The payment owner may have committed; callers must not infer rejection or compensate blindly. */
    final class OutcomeUnknown extends RuntimeException {
        public OutcomeUnknown(Throwable cause) { super("Asset payment outcome requires reconciliation", cause); }
    }

    AssetPaymentReplacement validateAssetPaymentReplacement(
            String predecessorPaymentSessionId,
            String successorPaymentSessionId,
            String predecessorUserId,
            String successorUserId,
            String assetId,
            String eventId,
            String subEventId);
    void completeAssetPaymentReplacement(
            AssetPaymentReplacement replacement,
            String successorUserId,
            String eventId,
            String subEventId);
    void recordAssetBooking(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            String bookingEndAtIso,
            PricingCancellationPolicyDto cancellationPolicy);
    void recordAssetBooking(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            String bookingEndAtIso,
            PricingCancellationPolicyDto cancellationPolicy,
            String eventId,
            String subEventId);
    EventCheckoutPaymentAuditDto recordAssetBookingPriceRevision(
            String paymentSessionId,
            String userId,
            String sourceId,
            String assetTitle,
            String timeframe,
            Integer previousQuantity,
            Integer nextQuantity,
            Double previousTotalAmount,
            Double nextTotalAmount,
            String currency);
    void cancelAssetBooking(
            String paymentSessionId,
            String fallbackBookingStartAtIso,
            PricingCancellationPolicyDto fallbackCancellationPolicy);
}
