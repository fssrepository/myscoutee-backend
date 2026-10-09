package com.raxim.myscoutee.domain.content.service;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.content.api.CommunityReports;
import com.raxim.myscoutee.domain.content.document.UserReportSubmission;
import com.raxim.myscoutee.domain.content.repository.UserReportSubmissionsRepository;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
@Service
public class CommunityReportService implements CommunityReports, com.raxim.myscoutee.domain.content.api.UserReports {
    private final UserReportSubmissionsRepository reports;
    private final OperationalTelemetry telemetry;
    public CommunityReportService(UserReportSubmissionsRepository reports, OperationalTelemetry telemetry) { this.reports = reports; this.telemetry = telemetry; }
    @Override public void submitGroupReport(String actorId, String ownerId, String groupId, String groupName, String details) {
        String key = "community:" + UUID.nameUUIDFromBytes((actorId + "\n" + groupId + "\n" + details).getBytes(java.nio.charset.StandardCharsets.UTF_8));
        if (reports.findBySyncKey(key).isPresent()) return;
        var report = new UserReportSubmission();
        String now = Instant.now().toString();
        report.setId(UUID.randomUUID().toString()); report.setSyncKey(key); report.setUserId(actorId);
        report.setTargetUserId(ownerId); report.setHandle(groupName);
        report.setReason("groups.report"); report.setDetails(details);
        report.setSourceType("community"); report.setSourceId(groupId); report.setSourceText(groupName);
        report.setCreatedDate(now); report.setUpdatedDate(now); report.setCreatedUser(actorId); report.setUpdatedUser(actorId);
        try { reports.save(report); } catch (org.springframework.dao.DuplicateKeyException duplicate) { return; }
        telemetry.record("report.submitted", "moderation", report.getId(), actorId);
    }
    public boolean exists(String syncKey) { return reports.findBySyncKey(syncKey).isPresent(); }
    public Receipt submit(ReportDraft request) {
        var document = new UserReportSubmission();
        document.setId(new org.bson.types.ObjectId().toHexString());
        document.setSyncKey(request.syncKey());
        document.setUserId(request.userId());
        document.setHandle(request.handle());
        document.setReason(request.reason());
        document.setDetails(request.details());
        document.setTargetUserId(request.targetUserId());
        document.setMemberEntryId(request.memberEntryId());
        document.setEventId(request.eventId());
        document.setEventTitle(request.eventTitle());
        document.setEventStartAtIso(request.eventStartAtIso());
        document.setSourceType(request.sourceType());
        document.setSourceId(request.sourceId());
        document.setSourceText(request.sourceText());
        document.setChatId(request.chatId());
        document.setMessageId(request.messageId());
        document.setAssetId(request.assetId());
        document.setAssetType(request.assetType());
        String now = Instant.now().toString();
        document.setCreatedDate(now); document.setUpdatedDate(now);
        document.setCreatedUser(request.userId()); document.setUpdatedUser(request.userId());
        try { reports.save(document); }
        catch (org.springframework.dao.DuplicateKeyException duplicate) { return new Receipt(null, true); }
        return new Receipt(document.getId(), false);
    }
}
