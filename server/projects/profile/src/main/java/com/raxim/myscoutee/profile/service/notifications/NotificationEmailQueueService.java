package com.raxim.myscoutee.profile.service.notifications;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.profile.data.document.EmailOutboxItem;
import com.raxim.myscoutee.profile.data.document.EmailTemplate;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.EmailOutboxRepository;
import com.raxim.myscoutee.profile.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.email.EmailOutboxStatus;
import com.raxim.myscoutee.profile.service.email.EmailProviderGateway;
import com.raxim.myscoutee.profile.service.email.EmailTemplateRenderer;

@Service
public class NotificationEmailQueueService {
    private static final String UPDATED_BY = "notification-email-queue";

    private final EmailProperties emailProperties;
    private final UsersRepository usersRepository;
    private final EmailTemplatesRepository emailTemplatesRepository;
    private final EmailOutboxRepository emailOutboxRepository;
    private final EmailTemplateRenderer emailTemplateRenderer;
    private final EmailProviderGateway emailProviderGateway;
    private final NotificationRuleRegistryService notificationRuleRegistryService;

    public NotificationEmailQueueService(
            EmailProperties emailProperties,
            UsersRepository usersRepository,
            EmailTemplatesRepository emailTemplatesRepository,
            EmailOutboxRepository emailOutboxRepository,
            EmailTemplateRenderer emailTemplateRenderer,
            EmailProviderGateway emailProviderGateway,
            NotificationRuleRegistryService notificationRuleRegistryService) {
        this.emailProperties = emailProperties;
        this.usersRepository = usersRepository;
        this.emailTemplatesRepository = emailTemplatesRepository;
        this.emailOutboxRepository = emailOutboxRepository;
        this.emailTemplateRenderer = emailTemplateRenderer;
        this.emailProviderGateway = emailProviderGateway;
        this.notificationRuleRegistryService = notificationRuleRegistryService;
    }

    public boolean queueActionEmail(
            String ruleKey,
            String recipientUserId,
            Map<String, String> variables,
            String fallbackSubject,
            String fallbackTextBody) {
        if (!emailProperties.isEnabled()
                || !notificationRuleRegistryService.isActionChannelEnabled(ruleKey, NotificationRuleRegistryService.CHANNEL_EMAIL)) {
            return false;
        }
        Users recipient = usersRepository.findByUserId(safeText(recipientUserId)).orElse(null);
        if (recipient == null || !StringUtils.hasText(safeText(recipient.getEmail()))) {
            return false;
        }
        NotificationRuleConfig rule = notificationRuleRegistryService.findRule(ruleKey).orElse(null);
        if (rule == null) {
            return false;
        }
        NotificationRuleConfig.MessageTemplate message = rule.getMessage() == null
                ? new NotificationRuleConfig.MessageTemplate()
                : rule.getMessage();
        Map<String, String> mergedVariables = buildVariables(recipient, rule, variables);
        EmailTemplate template = resolveTemplate(message.getEmailTemplateKey());
        String subjectTemplate = firstNonBlank(
                template == null ? null : template.getSubjectTemplate(),
                firstNonBlank(message.getEmailSubject(), fallbackSubject));
        String textTemplate = firstNonBlank(
                template == null ? null : template.getTextTemplate(),
                firstNonBlank(message.getEmailBody(), fallbackTextBody));
        String htmlTemplate = firstNonBlank(
                template == null ? null : template.getHtmlTemplate(),
                toSimpleHtml(textTemplate));

        String subject = emailTemplateRenderer.renderSubject(subjectTemplate, mergedVariables).trim();
        String textBody = emailTemplateRenderer.renderText(textTemplate, mergedVariables);
        String htmlBody = emailTemplateRenderer.renderHtml(htmlTemplate, mergedVariables);
        if (!StringUtils.hasText(subject) || (!StringUtils.hasText(textBody) && !StringUtils.hasText(htmlBody))) {
            return false;
        }

        String nowIso = Instant.now().toString();
        EmailOutboxItem item = new EmailOutboxItem();
        item.setId(new ObjectId().toHexString());
        item.setSyncKey(UUID.randomUUID().toString());
        item.setUserId(safeText(recipient.getId()));
        item.setRecipientEmail(safeText(recipient.getEmail()));
        item.setRecipientName(safeText(recipient.getName()));
        item.setTemplateKey(template == null ? "" : safeText(template.getTemplateKey()));
        item.setRuleKey(safeText(rule.getRuleKey()));
        item.setCategory("notification");
        item.setProvider(emailProviderGateway.currentProviderKey());
        item.setStatus(EmailOutboxStatus.PENDING);
        item.setSubject(subject);
        item.setHtmlBody(htmlBody);
        item.setTextBody(textBody);
        item.setTemplateVariables(mergedVariables);
        item.setScheduledAt(scheduledAt(rule, nowIso));
        item.setAttemptCount(0);
        item.setCreatedDate(nowIso);
        item.setCreatedUser(UPDATED_BY);
        item.setUpdatedDate(nowIso);
        item.setUpdatedUser(UPDATED_BY);
        emailOutboxRepository.save(item);
        return true;
    }

    private Map<String, String> buildVariables(
            Users recipient,
            NotificationRuleConfig rule,
            Map<String, String> variables) {
        Map<String, String> merged = new LinkedHashMap<>();
        String fullName = safeText(recipient.getName());
        String firstName = firstName(fullName);
        put(merged, "user_id", safeText(recipient.getId()));
        put(merged, "user_name", fullName);
        put(merged, "user_first_name", firstName);
        put(merged, "user_email", safeText(recipient.getEmail()));
        put(merged, "user_city", firstNonBlank(recipient.getCity(), "your area"));
        put(merged, "rule_key", safeText(rule == null ? null : rule.getRuleKey()));
        put(merged, "cta_url", buildCtaUrl(rule));
        put(merged, "cta_label", "Open MyScoutee");
        if (variables != null) {
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                put(merged, entry.getKey(), entry.getValue());
            }
        }
        return merged;
    }

    private EmailTemplate resolveTemplate(String templateKey) {
        String normalized = safeText(templateKey);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        return emailTemplatesRepository.findByTemplateKey(normalized)
                .filter(template -> Boolean.TRUE.equals(template.getEnabled()))
                .orElse(null);
    }

    private String scheduledAt(NotificationRuleConfig rule, String nowIso) {
        NotificationRuleConfig.Timing timing = rule == null ? null : rule.getTiming();
        if (timing != null && "delay".equalsIgnoreCase(safeText(timing.getMode()))) {
            int delayMinutes = Math.max(0, timing.getDelayMinutes() == null ? 0 : timing.getDelayMinutes().intValue());
            return Instant.parse(nowIso).plusSeconds(delayMinutes * 60L).toString();
        }
        return nowIso;
    }

    private String buildCtaUrl(NotificationRuleConfig rule) {
        String baseUrl = safeText(emailProperties.getBaseUrl());
        if (!StringUtils.hasText(baseUrl)) {
            baseUrl = "http://localhost:4200";
        }
        String ctaPath = safeText(rule == null || rule.getMessage() == null ? null : rule.getMessage().getCtaPath());
        if (!StringUtils.hasText(ctaPath)) {
            ctaPath = "/game";
        }
        String url = ctaPath.startsWith("http://") || ctaPath.startsWith("https://")
                ? ctaPath
                : baseUrl.replaceAll("/+$", "") + (ctaPath.startsWith("/") ? ctaPath : "/" + ctaPath);
        String separator = url.contains("?") ? "&" : "?";
        return url + separator + "utm_source=email&utm_medium=notification&utm_campaign=" + safeText(rule == null ? null : rule.getRuleKey());
    }

    private String toSimpleHtml(String text) {
        String escaped = HtmlUtils.htmlEscape(firstNonBlank(text, "Open MyScoutee for the latest update."));
        return "<html><body><p>" + escaped.replace("\n", "<br>") + "</p><p><a href=\"@cta_url\">@cta_label</a></p></body></html>";
    }

    private void put(Map<String, String> target, String key, String value) {
        String normalizedKey = safeText(key);
        if (!StringUtils.hasText(normalizedKey)) {
            return;
        }
        if (normalizedKey.startsWith("@")) {
            normalizedKey = normalizedKey.substring(1);
        }
        target.put(normalizedKey, safeText(value));
    }

    private String firstName(String fullName) {
        String normalized = safeText(fullName);
        if (!StringUtils.hasText(normalized)) {
            return "there";
        }
        int separator = normalized.indexOf(' ');
        return separator > 0 ? normalized.substring(0, separator) : normalized;
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : safeText(second);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
