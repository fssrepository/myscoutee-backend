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
            PaymentMethodRegistrationDto pendingRegistration) {}

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
            String paymentMethodId,
            String provider,
            String status,
            Double amount,
            String currency,
            String bookingStatus,
            String auditKind,
            String fulfillmentKind,
            String checkoutSessionId,
            String createdAtIso,
            SavedPaymentMethodDto paymentMethod) {}

    public record PaymentHistoryPageDto(
            List<PaymentHistoryItemDto> items,
            long total,
            String nextCursor,
            Map<String, Double> spendingTotals) {}
}
