package com.raxim.myscoutee.profile.service.email;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.profile.data.document.EmailCampaignRule;
import com.raxim.myscoutee.profile.data.document.EmailOutboxItem;
import com.raxim.myscoutee.profile.data.document.EmailTemplate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.EmailCampaignRulesRepository;
import com.raxim.myscoutee.profile.repository.EmailOutboxRepository;
import com.raxim.myscoutee.profile.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@Service
public class PromotionalEmailPlannerService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PromotionalEmailPlannerService.class);
    private static final String UPDATED_BY = "email-planner";

    private final EmailProperties emailProperties;
    private final EmailTemplatesRepository emailTemplatesRepository;
    private final EmailCampaignRulesRepository emailCampaignRulesRepository;
    private final EmailOutboxRepository emailOutboxRepository;
    private final UsersRepository usersRepository;
    private final EmailTemplateRenderer emailTemplateRenderer;
    private final PromotionalEmailRuleEvaluator ruleEvaluator;
    private final EmailProviderGateway emailProviderGateway;
    private final NotificationRuleRegistryService notificationRuleRegistryService;

    public PromotionalEmailPlannerService(
            EmailProperties emailProperties,
            EmailTemplatesRepository emailTemplatesRepository,
            EmailCampaignRulesRepository emailCampaignRulesRepository,
            EmailOutboxRepository emailOutboxRepository,
            UsersRepository usersRepository,
            EmailTemplateRenderer emailTemplateRenderer,
            PromotionalEmailRuleEvaluator ruleEvaluator,
            EmailProviderGateway emailProviderGateway,
            NotificationRuleRegistryService notificationRuleRegistryService) {
        this.emailProperties = emailProperties;
        this.emailTemplatesRepository = emailTemplatesRepository;
        this.emailCampaignRulesRepository = emailCampaignRulesRepository;
        this.emailOutboxRepository = emailOutboxRepository;
        this.usersRepository = usersRepository;
        this.emailTemplateRenderer = emailTemplateRenderer;
        this.ruleEvaluator = ruleEvaluator;
        this.emailProviderGateway = emailProviderGateway;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
    }

    @Scheduled(fixedDelayString = "${email.promotions.planning-delay-ms:3600000}")
    public void planScheduledPromotionalEmails() {
        if (!emailProperties.isEnabled()) {
            return;
        }
        Instant now = Instant.now();
        if (!notificationRuleRegistryService.shouldRunScheduledRule(NotificationRuleRegistryService.RULE_PROMOTIONAL_EMAIL_PLANNER, now)) {
            return;
        }
        int queued = planPendingPromotionalEmails();
        notificationRuleRegistryService.recordRun(
                NotificationRuleRegistryService.RULE_PROMOTIONAL_EMAIL_PLANNER,
                queued,
                "completed",
                "Queued promotional email outbox rows.",
                UPDATED_BY);
        if (queued > 0) {
            LOGGER.info("Queued {} promotional email(s).", queued);
        }
    }

    public int planPendingPromotionalEmails() {
        if (!emailProperties.isEnabled()) {
            return 0;
        }
        List<EmailCampaignRule> rules = emailCampaignRulesRepository.findByEnabledTrueOrderByPriorityDescRuleKeyAsc();
        if (rules.isEmpty()) {
            return 0;
        }
        Map<String, EmailTemplate> templatesByKey = new LinkedHashMap<>();
        for (EmailTemplate template : emailTemplatesRepository.findByEnabledTrueOrderByTemplateKeyAsc()) {
            if (template != null && StringUtils.hasText(template.getTemplateKey())) {
                templatesByKey.put(template.getTemplateKey().trim(), template);
            }
        }
        if (templatesByKey.isEmpty()) {
            return 0;
        }

        String nowIso = Instant.now().toString();
        List<EmailOutboxItem> itemsToQueue = new ArrayList<>();
        for (Users user : usersRepository.findAll()) {
            if (user == null || !StringUtils.hasText(safeText(user.getId())) || !StringUtils.hasText(safeText(user.getEmail()))) {
                continue;
            }
            for (EmailCampaignRule rule : rules) {
                EmailTemplate template = templatesByKey.get(safeText(rule.getTemplateKey()));
                if (template == null || !ruleEvaluator.qualifies(user, rule)) {
                    continue;
                }
                List<EmailOutboxItem> history = emailOutboxRepository.findByUserIdAndRuleKeyOrderByCreatedDateDesc(
                        safeText(user.getId()),
                        safeText(rule.getRuleKey()));
                if (hasReachedDeliveryLimit(rule, history) || isOnCooldown(rule, history, nowIso)) {
                    continue;
                }
                Map<String, String> variables = ruleEvaluator.buildTemplateVariables(user, rule, emailProperties.getBaseUrl());
                String subject = emailTemplateRenderer.renderSubject(template.getSubjectTemplate(), variables).trim();
                String htmlBody = emailTemplateRenderer.renderHtml(template.getHtmlTemplate(), variables);
                String textBody = emailTemplateRenderer.renderText(template.getTextTemplate(), variables);
                if (!StringUtils.hasText(subject) || (!StringUtils.hasText(htmlBody) && !StringUtils.hasText(textBody))) {
                    continue;
                }
                itemsToQueue.add(buildOutboxItem(user, rule, template, variables, subject, htmlBody, textBody, nowIso));
                break;
            }
        }
        if (!itemsToQueue.isEmpty()) {
            emailOutboxRepository.saveAll(itemsToQueue);
        }
        return itemsToQueue.size();
    }

    private EmailOutboxItem buildOutboxItem(
            Users user,
            EmailCampaignRule rule,
            EmailTemplate template,
            Map<String, String> variables,
            String subject,
            String htmlBody,
            String textBody,
            String nowIso) {
        EmailOutboxItem item = new EmailOutboxItem();
        item.setId(new ObjectId().toHexString());
        item.setSyncKey(UUID.randomUUID().toString());
        item.setUserId(safeText(user.getId()));
        item.setRecipientEmail(safeText(user.getEmail()));
        item.setRecipientName(safeText(user.getName()));
        item.setTemplateKey(safeText(template.getTemplateKey()));
        item.setRuleKey(safeText(rule.getRuleKey()));
        item.setCategory("promotional");
        item.setProvider(emailProviderGateway.currentProviderKey());
        item.setStatus(EmailOutboxStatus.PENDING);
        item.setSubject(subject);
        item.setHtmlBody(htmlBody);
        item.setTextBody(textBody);
        item.setTemplateVariables(variables);
        item.setScheduledAt(nowIso);
        item.setAttemptCount(0);
        item.setCreatedDate(nowIso);
        item.setCreatedUser(UPDATED_BY);
        item.setUpdatedDate(nowIso);
        item.setUpdatedUser(UPDATED_BY);
        return item;
    }

    private boolean hasReachedDeliveryLimit(EmailCampaignRule rule, List<EmailOutboxItem> history) {
        int deliveryLimit = rule == null || rule.getMaxDeliveriesPerUser() == null
                ? 0
                : Math.max(0, rule.getMaxDeliveriesPerUser().intValue());
        if (deliveryLimit <= 0) {
            return false;
        }
        long sentCount = history.stream()
                .filter(Objects::nonNull)
                .filter(item -> EmailOutboxStatus.SENT.equalsIgnoreCase(safeText(item.getStatus())))
                .count();
        return sentCount >= deliveryLimit;
    }

    private boolean isOnCooldown(EmailCampaignRule rule, List<EmailOutboxItem> history, String nowIso) {
        int cooldownHours = rule == null || rule.getCooldownHours() == null
                ? 0
                : Math.max(0, rule.getCooldownHours().intValue());
        if (cooldownHours <= 0 || history == null || history.isEmpty()) {
            return false;
        }
        EmailOutboxItem latest = history.stream()
                .filter(Objects::nonNull)
                .filter(item -> !EmailOutboxStatus.FAILED.equalsIgnoreCase(safeText(item.getStatus())))
                .findFirst()
                .orElse(null);
        if (latest == null || !StringUtils.hasText(latest.getCreatedDate())) {
            return false;
        }
        try {
            Instant cutoff = Instant.parse(latest.getCreatedDate()).plusSeconds(cooldownHours * 3600L);
            return Instant.parse(nowIso).isBefore(cutoff);
        } catch (Exception exception) {
            return false;
        }
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
