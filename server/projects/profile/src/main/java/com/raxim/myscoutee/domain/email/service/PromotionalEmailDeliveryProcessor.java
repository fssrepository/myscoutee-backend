package com.raxim.myscoutee.domain.email.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.email.config.EmailProperties;
import com.raxim.myscoutee.domain.email.document.EmailOutboxItem;
import com.raxim.myscoutee.domain.email.repository.EmailOutboxRepository;

@Service
public class PromotionalEmailDeliveryProcessor {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobGroupScope;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    private static final Logger LOGGER = LoggerFactory.getLogger(PromotionalEmailDeliveryProcessor.class);
    private static final String UPDATED_BY = "email-delivery";

    private final EmailProperties emailProperties;
    private final EmailOutboxRepository emailOutboxRepository;
    private final MongoTemplate mongoTemplate;
    private final EmailProviderGateway emailProviderGateway;

    public PromotionalEmailDeliveryProcessor(
            EmailProperties emailProperties,
            EmailOutboxRepository emailOutboxRepository,
            MongoTemplate mongoTemplate,
            EmailProviderGateway emailProviderGateway) {
        this.emailProperties = emailProperties;
        this.emailOutboxRepository = emailOutboxRepository;
        this.mongoTemplate = mongoTemplate;
        this.emailProviderGateway = emailProviderGateway;
    }

    @Scheduled(fixedDelayString = "${email.promotions.delivery-delay-ms:60000}")
    public void processScheduledPromotionalEmails() {
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.runScheduledGroups("promotional-email-delivery", this::processScheduledPromotionalEmailsInGroup));
    }

    private void processScheduledPromotionalEmailsInGroup() {
        if (!emailProperties.isEnabled()) {
            return;
        }
        int sent = processPendingDeliveries();
        if (sent > 0) {
            LOGGER.info("Sent {} promotional email(s).", sent);
        }
    }

    public int processPendingDeliveries() {
        if (!emailProperties.isEnabled()) {
            return 0;
        }

        List<EmailOutboxItem> pendingItems = loadPendingItems(
                Instant.now().toString(),
                Math.max(1, emailProperties.getPromotions().getDeliveryBatchSize()));
        int sentCount = 0;
        for (EmailOutboxItem item : pendingItems) {
            if (item == null) {
                continue;
            }
            String startedAtIso = Instant.now().toString();
            item.setStatus(EmailOutboxStatus.SENDING);
            item.setUpdatedDate(startedAtIso);
            item.setUpdatedUser(UPDATED_BY);
            emailOutboxRepository.save(item);

            EmailSendResult sendResult;
            try {
                sendResult = emailProviderGateway.send(new EmailSendRequest(
                        safeText(item.getRecipientEmail()),
                        safeText(item.getRecipientName()),
                        safeText(item.getSubject()),
                        item.getHtmlBody(),
                        item.getTextBody(),
                        emailProperties.getFromEmail(),
                        firstNonBlank(
                                item.getTemplateVariables() == null
                                        ? null
                                        : item.getTemplateVariables()
                                                .get("product_name"),
                                emailProperties.getFromName()),
                        emailProperties.getReplyTo(),
                        safeText(item.getCategory()),
                        Map.of(
                                "ruleKey", safeText(item.getRuleKey()),
                                "templateKey", safeText(item.getTemplateKey()),
                                "userId", safeText(item.getUserId()))));
            } catch (Exception exception) {
                sendResult = new EmailSendResult(false, null, exception.getMessage());
            }

            String finishedAtIso = Instant.now().toString();
            item.setProvider(emailProviderGateway.currentProviderKey());
            item.setAttemptCount(normalizeCount(item.getAttemptCount()) + 1);
            item.setUpdatedDate(finishedAtIso);
            item.setUpdatedUser(UPDATED_BY);
            if (sendResult.suppressed()) {
                item.setStatus(EmailOutboxStatus.UNSUBSCRIBED);
                item.setErrorMessage("");
            } else if (sendResult.accepted()) {
                item.setStatus(EmailOutboxStatus.SENT);
                item.setSentDate(finishedAtIso);
                item.setProviderMessageId(safeText(sendResult.providerMessageId()));
                item.setErrorMessage("");
                sentCount += 1;
            } else {
                item.setStatus(EmailOutboxStatus.FAILED);
                item.setErrorMessage(safeText(sendResult.errorMessage()));
            }
            emailOutboxRepository.save(item);
        }
        return sentCount;
    }

    private List<EmailOutboxItem> loadPendingItems(String nowIso, int batchSize) {
        Query query = Query.query(new Criteria().andOperator(
                Criteria.where("baseGroupId").is(com.raxim.myscoutee.domain.platform.service.JobGroupContext.groupId()),
                Criteria.where("status").is(EmailOutboxStatus.PENDING),
                Criteria.where("scheduledAt").lte(nowIso)))
                .with(Sort.by(Sort.Direction.ASC, "scheduledAt", "createdDate"))
                .limit(batchSize);
        return mongoTemplate.find(query, EmailOutboxItem.class);
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value.intValue());
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstNonBlank(String first, String second) {
        String normalized = safeText(first);
        return normalized.isEmpty() ? safeText(second) : normalized;
    }
}
