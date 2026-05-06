package com.raxim.myscoutee.profile.service.email;

import java.time.Instant;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.document.EmailCampaignRule;
import com.raxim.myscoutee.profile.data.document.ScheduledMessageDelivery;
import com.raxim.myscoutee.profile.data.document.ScheduledMessageRun;
import com.raxim.myscoutee.profile.data.document.ScheduledMessageTask;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ScheduledMessageDeliveriesRepository;
import com.raxim.myscoutee.profile.repository.ScheduledMessageRunsRepository;

@Service
public class ScheduledMessageAuditService {
    private static final String UPDATED_BY = "scheduled-message-audit";

    private final ScheduledMessageRunsRepository runsRepository;
    private final ScheduledMessageDeliveriesRepository deliveriesRepository;

    public ScheduledMessageAuditService(
            ScheduledMessageRunsRepository runsRepository,
            ScheduledMessageDeliveriesRepository deliveriesRepository) {
        this.runsRepository = runsRepository;
        this.deliveriesRepository = deliveriesRepository;
    }

    public String beginRun(EmailCampaignRule rule) {
        String nowIso = Instant.now().toString();
        ScheduledMessageRun run = new ScheduledMessageRun();
        run.setId(new ObjectId().toHexString());
        run.setRunId(UUID.randomUUID().toString());
        run.setRuleKey(safeText(rule == null ? null : rule.getRuleKey()));
        run.setScheduleType(safeText(rule == null ? null : rule.getScheduleType()));
        run.setStatus("running");
        run.setStartedAtIso(nowIso);
        run.setAffectedCount(0);
        run.setNotificationCount(0);
        run.setEmailQueuedCount(0);
        run.setFailedCount(0);
        run.setDetail("Scheduled run started.");
        run.setCreatedDate(nowIso);
        run.setCreatedUser(UPDATED_BY);
        run.setUpdatedDate(nowIso);
        run.setUpdatedUser(UPDATED_BY);
        return runsRepository.save(run).getRunId();
    }

    public String beginRun(ScheduledMessageTask task) {
        String nowIso = Instant.now().toString();
        ScheduledMessageRun run = new ScheduledMessageRun();
        run.setId(new ObjectId().toHexString());
        run.setRunId(UUID.randomUUID().toString());
        run.setRuleKey(safeText(task == null ? null : task.getTaskKey()));
        run.setScheduleType(safeText(task == null ? null : task.getActionKey()));
        run.setStatus("running");
        run.setStartedAtIso(nowIso);
        run.setAffectedCount(0);
        run.setNotificationCount(0);
        run.setEmailQueuedCount(0);
        run.setFailedCount(0);
        run.setDetail("Scheduled task started.");
        run.setCreatedDate(nowIso);
        run.setCreatedUser(UPDATED_BY);
        run.setUpdatedDate(nowIso);
        run.setUpdatedUser(UPDATED_BY);
        return runsRepository.save(run).getRunId();
    }

    public void recordDelivery(
            String runId,
            EmailCampaignRule rule,
            Users user,
            String channel,
            String status,
            String detail) {
        String nowIso = Instant.now().toString();
        ScheduledMessageDelivery delivery = new ScheduledMessageDelivery();
        delivery.setId(new ObjectId().toHexString());
        delivery.setRunId(safeText(runId));
        delivery.setRuleKey(safeText(rule == null ? null : rule.getRuleKey()));
        delivery.setUserId(safeText(user == null ? null : user.getId()));
        delivery.setRecipientEmail(safeText(user == null ? null : user.getEmail()));
        delivery.setNotificationTemplateKey(safeText(rule == null ? null : rule.getNotificationTemplateKey()));
        delivery.setEmailTemplateKey(safeText(rule == null ? null : rule.getTemplateKey()));
        delivery.setChannel(safeText(channel));
        delivery.setStatus(safeText(status));
        delivery.setDetail(safeText(detail));
        delivery.setCreatedDate(nowIso);
        delivery.setCreatedUser(UPDATED_BY);
        deliveriesRepository.save(delivery);
    }

    public void recordDelivery(
            String runId,
            ScheduledMessageTask task,
            Users user,
            String channel,
            String status,
            String detail) {
        String nowIso = Instant.now().toString();
        ScheduledMessageDelivery delivery = new ScheduledMessageDelivery();
        delivery.setId(new ObjectId().toHexString());
        delivery.setRunId(safeText(runId));
        delivery.setRuleKey(safeText(task == null ? null : task.getTaskKey()));
        delivery.setUserId(safeText(user == null ? null : user.getId()));
        delivery.setRecipientEmail(safeText(user == null ? null : user.getEmail()));
        delivery.setNotificationTemplateKey(safeText(task == null ? null : task.getNotificationTemplateKey()));
        delivery.setEmailTemplateKey(safeText(task == null ? null : task.getEmailTemplateKey()));
        delivery.setChannel(safeText(channel));
        delivery.setStatus(safeText(status));
        delivery.setDetail(safeText(detail));
        delivery.setCreatedDate(nowIso);
        delivery.setCreatedUser(UPDATED_BY);
        deliveriesRepository.save(delivery);
    }

    public void finishRun(
            String runId,
            int affectedCount,
            int notificationCount,
            int emailQueuedCount,
            int failedCount,
            String status,
            String detail) {
        ScheduledMessageRun run = runsRepository.findByRunId(safeText(runId)).orElse(null);
        if (run == null) {
            return;
        }
        String nowIso = Instant.now().toString();
        run.setStatus(safeText(status));
        run.setFinishedAtIso(nowIso);
        run.setAffectedCount(Math.max(0, affectedCount));
        run.setNotificationCount(Math.max(0, notificationCount));
        run.setEmailQueuedCount(Math.max(0, emailQueuedCount));
        run.setFailedCount(Math.max(0, failedCount));
        run.setDetail(safeText(detail));
        run.setUpdatedDate(nowIso);
        run.setUpdatedUser(UPDATED_BY);
        runsRepository.save(run);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
