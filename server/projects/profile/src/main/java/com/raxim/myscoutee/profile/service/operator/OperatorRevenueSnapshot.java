package com.raxim.myscoutee.profile.service.operator;

import java.time.Instant;
import java.util.List;

record OperatorRevenueSnapshot(
        Instant generatedAt,
        List<CurrencySnapshot> currencies,
        RevenueDiagnostics diagnostics) {

    record CurrencySnapshot(
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

    record AssetCategorySnapshot(
            String key,
            String label,
            long payableAssets,
            long projectedMinor) {
    }

    record TimelinePointSnapshot(
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

    record RevenueDiagnostics(
            long invalidCurrencyRecords,
            long invalidMonetaryRecords,
            long mismatchedRefundCurrencyRecords,
            long invalidRefundRecords,
            long invalidTimestampRecords,
            long excludedUnfinalizedPayments,
            long excludedPaymentRevisions,
            long excludedSimulatedPayments) {

        long rejectedRecordCount() {
            return invalidCurrencyRecords
                    + invalidMonetaryRecords
                    + mismatchedRefundCurrencyRecords
                    + invalidRefundRecords
                    + invalidTimestampRecords;
        }
    }
}
