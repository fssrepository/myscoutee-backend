package com.raxim.myscoutee.domain.assets.dto;
import java.util.List;
public final class AssetDetails {
    private AssetDetails() {}
    public record AssetRequestRecord(
            String id,
            String userId,
            String name,
            String initials,
            String gender,
            String status,
            String note,
            String requestKind,
            String requestedAtIso,
            AssetRequestBookingRecord booking) implements com.raxim.myscoutee.domain.assets.api.AssetOwnership.Request {
    }

    public record AssetRequestBookingRecord(
            String eventId,
            String eventTitle,
            String subEventId,
            String subEventTitle,
            String slotKey,
            String slotLabel,
            String timeframe,
            String startAtIso,
            String endAtIso,
            Integer quantity,
            Double totalAmount,
            Double previousTotalAmount,
            String currency,
            List<String> acceptedPolicyIds,
            String paymentSessionId,
            Boolean inventoryApplied) {
        public AssetRequestBookingRecord(
                String eventId,
                String eventTitle,
                String subEventId,
                String subEventTitle,
                String slotKey,
                String slotLabel,
                String timeframe,
                String startAtIso,
                String endAtIso,
                Integer quantity,
                Double totalAmount,
                String currency,
                List<String> acceptedPolicyIds,
                String paymentSessionId,
                Boolean inventoryApplied) {
            this(
                    eventId,
                    eventTitle,
                    subEventId,
                    subEventTitle,
                    slotKey,
                    slotLabel,
                    timeframe,
                    startAtIso,
                    endAtIso,
                    quantity,
                    totalAmount,
                    null,
                    currency,
                    acceptedPolicyIds,
                    paymentSessionId,
                    inventoryApplied);
        }
    }

    public record AssetPolicyRecord(
            String id,
            String title,
            String description,
            Boolean required) implements com.raxim.myscoutee.domain.assets.api.AssetOwnership.Policy {
    }

}
