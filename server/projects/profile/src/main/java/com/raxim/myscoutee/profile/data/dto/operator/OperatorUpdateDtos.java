package com.raxim.myscoutee.profile.data.dto.operator;

import java.util.List;

public final class OperatorUpdateDtos {
    private OperatorUpdateDtos() {
    }

    public record OperatorUpdateApprovalDto(
            String announcementId) {
    }

    public record OperatorUpdateJobDto(
            int schemaVersion,
            String jobId,
            String phase,
            int percent,
            String message,
            String updatedAt,
            String requestedAt,
            String requestedBy,
            String manifestHash,
            String currentVersion,
            String targetVersion,
            String channel,
            String artifactSha256,
            String backupPath) {
    }

    public record OperatorUpdateOverviewDto(
            boolean enabled,
            String currentVersion,
            OperatorUpdateJobDto latestJob) {
    }

    public record OperatorUpdateEventDto(
            long sequence,
            OperatorUpdateJobDto status) {
    }

    public record OperatorUpdateEventPageDto(
            List<OperatorUpdateEventDto> items,
            long nextAfter,
            boolean terminal) {
    }
}
