package com.raxim.myscoutee.domain.operator.service;

import java.time.Instant;
import java.util.List;

public record OperatorRevenueSnapshot(
        Instant generatedAt,
        List<CurrencySnapshot> currencies,
        RevenueDiagnostics diagnostics) {

    public record CurrencySnapshot(
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
            List<AssetCategorySnapshot> assetCategories,
            List<TimelinePointSnapshot> timeline) {
    }

    public record AssetCategorySnapshot(
            String key,
            String label,
            long payableAssets,
            long projectedMinor) {
    }

    public record TimelinePointSnapshot(
            String dateKey,
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

    public record RevenueDiagnostics(
            long invalidCurrencyRecords,
            long invalidMonetaryRecords,
            long mismatchedRefundCurrencyRecords,
            long invalidRefundRecords,
            long invalidTimestampRecords,
            long excludedUnfinalizedPayments,
            long excludedPaymentRevisions,
            long excludedSimulatedPayments) {

        public long rejectedRecordCount() {
            return invalidCurrencyRecords
                    + invalidMonetaryRecords
                    + mismatchedRefundCurrencyRecords
                    + invalidRefundRecords
                    + invalidTimestampRecords;
        }
    }
}
