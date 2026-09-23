package com.raxim.myscoutee.profile.data.dto.payment;

import java.util.List;
import java.util.Map;

public final class PaymentDtos {
    private PaymentDtos() {}

    public record SavedPaymentMethodDto(
            String id,
            String provider,
            String brand,
            String last4,
            Integer expiryMonth,
            Integer expiryYear,
            String cardholderName,
            String artworkKey,
            String artworkUrl,
            String status,
            String createdAtIso,
            String updatedAtIso) {}

    public record SavedPaymentMethodsPageDto(
            List<SavedPaymentMethodDto> items,
            long total,
            String nextCursor,
            boolean canAdd,
            PaymentMethodRegistrationDto pendingRegistration,
            String currentProvider) {}

    public record PaymentMethodRegistrationRequestDto(
            String provider,
            String replacesPaymentMethodId) {}

    public record PaymentMethodRegistrationDto(
            String id,
            String provider,
            String status,
            String paymentUrl,
            String expiresAtIso,
            String replacesPaymentMethodId,
            SavedPaymentMethodDto paymentMethod) {}

    public record PaymentMethodRegistrationCallbackDto(
            String registrationId,
            String status) {}

    public record PaymentHistoryItemDto(
            String id,
            String sourceId,
            String direction,
            String paymentMethodId,
            String provider,
            String status,
            String failureReason,
            Double amount,
            String currency,
            String bookingStatus,
            String auditKind,
            String fulfillmentKind,
            String checkoutSessionId,
            String createdAtIso,
            String recipientUserId,
            String serviceContext,
            String contextEventId,
            String contextSubEventId,
            String contextAssetId,
            String refundRequestStatus,
            String refundRequestedAtIso,
            Boolean canRequestRefund,
            Boolean canApproveRefund,
            PaymentRefundPreviewDto refundPreview,
            SavedPaymentMethodDto paymentMethod) {}

    public record PaymentRefundPreviewDto(
            Double paidAmount,
            Double refundableAmount,
            Double retainedAmount,
            String currency,
            String status,
            String ruleId,
            String ruleOffsetUnit,
            Integer ruleOffsetValue,
            String refundKind,
            Double refundValue,
            String ruleDescription) {}

    public record PaymentHistoryPageDto(
            List<PaymentHistoryItemDto> items,
            long total,
            String nextCursor,
            Map<String, Double> spendingTotals,
            Map<String, Double> incomeTotals,
            Integer pendingRefundCount,
            com.raxim.myscoutee.profile.data.dto.payment.ExchangeRateDtos.Summary euroSummary) {
        public PaymentHistoryPageDto(List<PaymentHistoryItemDto> items, long total, String nextCursor, Map<String, Double> spendingTotals, Map<String, Double> incomeTotals, Integer pendingRefundCount) {
            this(items, total, nextCursor, spendingTotals, incomeTotals, pendingRefundCount, null);
        }
    }

    public record PaymentHistoryMutationDto(
            PaymentHistoryItemDto item,
            Map<String, Double> spendingTotals,
            Map<String, Double> incomeTotals,
            Integer pendingRefundCount,
            com.raxim.myscoutee.profile.data.dto.payment.ExchangeRateDtos.Summary euroSummary) {
        public PaymentHistoryMutationDto(PaymentHistoryItemDto item, Map<String, Double> spendingTotals, Map<String, Double> incomeTotals, Integer pendingRefundCount) {
            this(item, spendingTotals, incomeTotals, pendingRefundCount, null);
        }
    }
}
