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

    public record OperatorRevenueSyncDto(
            String state,
            String code,
            String message,
            int materialized,
            int submitted,
            int accepted,
            long pending,
            long blocked,
            String synchronizedAtIso) {
    }

    public record OperatorRevenueReportPageDto(
            List<OperatorRevenueReportDto> items,
            int page,
            int size,
            long totalElements,
            int totalPages) {
    }

    public record OperatorRevenueReportDto(
            String id,
            String period,
            long revision,
            String supersedesBatchId,
            String rulesetVersion,
            int commissionRateBasisPoints,
            List<OperatorRevenueReportCurrencyDto> currencies,
            String payloadHash,
            String status,
            int attemptCount,
            String nextRetryAt,
            String failureCode,
            String failureMessage,
            Boolean failureRetryable,
            String failedAt,
            String acceptedBatchId,
            String acceptedAt,
            String createdAt,
            String updatedAt) {
    }

    public record OperatorRevenueReportCurrencyDto(
            String currencyCode,
            int fractionDigits,
            long capturedMinor,
            long refundedMinor,
            long netMinor,
            long commissionBasisMinor,
            long estimatedCommissionMinor,
            long paymentCount) {
    }
}
