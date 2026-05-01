package com.raxim.myscoutee.profile.data.dto.help;

import java.util.List;

public final class HelpCenterDtos {
    private HelpCenterDtos() {}

    public record HelpCenterSectionDto(
            String id,
            String icon,
            String title,
            String blurb,
            String contentHtml,
            Boolean optional) {}

    public record HelpCenterRevisionDto(
            String id,
            String documentKind,
            Integer version,
            String title,
            String summary,
            String description,
            String headerColor,
            List<HelpCenterSectionDto> sections,
            Boolean active,
            String createdAtIso,
            String createdByUserId,
            String updatedAtIso,
            String updatedByUserId) {}

    public record HelpCenterAuditEntryDto(
            String id,
            String documentKind,
            String revisionId,
            Integer version,
            String action,
            String actorUserId,
            String createdAtIso,
            String message) {}

    public record HelpCenterStateDto(
            HelpCenterRevisionDto activeRevision,
            List<HelpCenterRevisionDto> revisions,
            List<HelpCenterAuditEntryDto> auditTrail) {}

    public record HelpCenterRevisionSaveRequestDto(
            String actorUserId,
            String baseRevisionId,
            String title,
            String summary,
            String description,
            String headerColor,
            List<HelpCenterSectionDto> sections) {}

    public record HelpCenterAdminActionRequestDto(String actorUserId) {}
}
