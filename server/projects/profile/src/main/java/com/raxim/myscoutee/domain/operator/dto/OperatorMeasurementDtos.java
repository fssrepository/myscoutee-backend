package com.raxim.myscoutee.domain.operator.dto;

import java.util.List;

public final class OperatorMeasurementDtos {
    private OperatorMeasurementDtos() {
    }

    public record OperatorMeasurementSyncDto(
            String state,
            String code,
            String message,
            int materialized,
            int submitted,
            int accepted,
            long pending,
            long blocked,
            String synchronizedAt) {
    }

    public record OperatorMeasurementReportDto(
            String id,
            String period,
            String windowStart,
            String windowEnd,
            long revision,
            String rulesetVersion,
            long qualifiedMauCount,
            long actionCount,
            String status,
            int attemptCount,
            String nextRetryAt,
            String failureCode,
            String failureMessage,
            String batchId,
            String acceptedAt,
            String createdAt,
            String updatedAt) {
    }

    public record OperatorMeasurementReportPageDto(
            List<OperatorMeasurementReportDto> items,
            int page,
            int size,
            long totalElements,
            int totalPages) {
        public OperatorMeasurementReportPageDto {
            items = items == null ? List.of() : List.copyOf(items);
        }
    }
}
