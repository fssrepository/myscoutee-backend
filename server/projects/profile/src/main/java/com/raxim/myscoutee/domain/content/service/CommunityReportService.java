package com.raxim.myscoutee.domain.content.service;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.content.api.CommunityReports;
import com.raxim.myscoutee.domain.content.document.UserReportSubmission;
import com.raxim.myscoutee.domain.content.repository.UserReportSubmissionsRepository;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
@Service
public class CommunityReportService implements CommunityReports {
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
}
