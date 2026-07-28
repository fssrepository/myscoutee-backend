package com.raxim.myscoutee.profile.data.dto.operator;

import java.util.List;

public final class OperatorRevenueDtos {
    private OperatorRevenueDtos() {
    }

    public record OperatorRevenueDto(
            String generatedAtIso,
            String rulesetVersion,
            int commissionRateBasisPoints,
            List<OperatorRevenueCurrencyDto> currencies) {
    }

    public record OperatorRevenueCurrencyDto(
            String currencyCode,
            int fractionDigits,
            long payableEvents,
            long payableAssets,
            long projectedEventMinor,
            long projectedAssetMinor,
            long capturedPaymentMinor,
            long refundedPaymentMinor,
            long netPaymentMinor,
            long commissionBasisMinor,
            long estimatedCommissionMinor,
            long paymentCount,
            long payingUsers,
            long eventBuyers,
            long assetBorrowers,
            List<OperatorRevenueAssetCategoryDto> assetCategories,
            List<OperatorRevenueTimelinePointDto> timeline) {
    }

    public record OperatorRevenueAssetCategoryDto(
            String key,
            String labelKey,
            String label,
            String icon,
            String tone,
            long payableAssets,
            long projectedMinor) {
    }

    public record OperatorRevenueTimelinePointDto(
            String dateKey,
            String label,
            long payableEvents,
            long payableAssets,
            long projectedEventMinor,
            long projectedAssetMinor,
            long capturedPaymentMinor,
            long refundedPaymentMinor,
            long netPaymentMinor,
            long commissionBasisMinor,
            long estimatedCommissionMinor,
            long paymentCount,
            long payingUsers) {
    }
}
