package com.raxim.myscoutee.domain.email.service;

import java.time.Instant;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.email.document.EmailCampaignRule;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageDelivery;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageRun;
import com.raxim.myscoutee.domain.email.document.ScheduledMessageTask;
import com.raxim.myscoutee.domain.accounts.api.EmailProfile;
import com.raxim.myscoutee.domain.email.repository.ScheduledMessageDeliveriesRepository;
import com.raxim.myscoutee.domain.email.repository.ScheduledMessageRunsRepository;

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
        return beginRun(safeText(rule == null ? null : rule.getRuleKey()),
                safeText(rule == null ? null : rule.getScheduleType()), "Scheduled run started.");
    }

    public String beginRun(ScheduledMessageTask task) {
        return beginRun(safeText(task == null ? null : task.getTaskKey()),
                safeText(task == null ? null : task.getActionKey()), "Scheduled task started.");
    }

    public void recordDelivery(
            String runId,
            EmailCampaignRule rule,
            EmailProfile user,
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
            EmailProfile user,
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

    private String beginRun(String ruleKey, String scheduleType, String detail) {
        String nowIso = Instant.now().toString();
        ScheduledMessageRun run = new ScheduledMessageRun();
        run.setId(new ObjectId().toHexString());
        run.setRunId(UUID.randomUUID().toString());
        run.setRuleKey(ruleKey);
        run.setScheduleType(scheduleType);
        run.setStatus("running");
        run.setStartedAtIso(nowIso);
        run.setAffectedCount(0);
        run.setNotificationCount(0);
        run.setEmailQueuedCount(0);
        run.setFailedCount(0);
        run.setDetail(detail);
        run.setCreatedDate(nowIso);
        run.setCreatedUser(UPDATED_BY);
        run.setUpdatedDate(nowIso);
        run.setUpdatedUser(UPDATED_BY);
        return runsRepository.save(run).getRunId();
    }
}
