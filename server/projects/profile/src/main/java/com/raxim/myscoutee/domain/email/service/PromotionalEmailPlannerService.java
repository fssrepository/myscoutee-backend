package com.raxim.myscoutee.domain.email.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.email.config.EmailProperties;
import com.raxim.myscoutee.domain.email.document.EmailCampaignRule;
import com.raxim.myscoutee.domain.email.document.EmailOutboxItem;
import com.raxim.myscoutee.domain.email.document.EmailTemplate;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog.Template;
import com.raxim.myscoutee.domain.accounts.api.EmailProfile;
import com.raxim.myscoutee.domain.email.repository.EmailCampaignRulesRepository;
import com.raxim.myscoutee.domain.email.repository.EmailOutboxRepository;
import com.raxim.myscoutee.domain.email.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog;
import com.raxim.myscoutee.domain.accounts.api.EmailProfiles;
import com.raxim.myscoutee.domain.events.api.MemberAudience;
import com.raxim.myscoutee.domain.platform.api.DeploymentBranding;
import com.raxim.myscoutee.domain.platform.api.DeploymentBranding.ResolvedDeploymentBranding;

import jakarta.annotation.PreDestroy;

@Service
public class PromotionalEmailPlannerService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.api.JobAudience jobGroupScope;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    private static final Logger LOGGER = LoggerFactory.getLogger(PromotionalEmailPlannerService.class);
    private static final String UPDATED_BY = "email-planner";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String SCHEDULE_ONE_TIME = "one_time";
    private static final String SCHEDULE_CRON = "cron";

    private final EmailProperties emailProperties;
    private final EmailTemplatesRepository emailTemplatesRepository;
    private final EmailCampaignRulesRepository emailCampaignRulesRepository;
    private final EmailOutboxRepository emailOutboxRepository;
    private final EmailProfiles profiles;
    private final NotificationCatalog notificationTemplatesRepository;
    private final MemberAudience activitiesMembersService;
    private final ScheduledNotificationDeliveryService scheduledNotificationDeliveryService;
    private final ScheduledMessageAuditService scheduledMessageAuditService;
    private final EmailTemplateRenderer emailTemplateRenderer;
    private final PromotionalEmailRuleEvaluator ruleEvaluator;
    private final EmailProviderGateway emailProviderGateway;
    private DeploymentBranding deploymentBrandingResolver;
    private final ExecutorService ruleExecutor = Executors.newVirtualThreadPerTaskExecutor();
    private final Map<String, Future<?>> runningRuleTasks = new ConcurrentHashMap<>();

    public PromotionalEmailPlannerService(
            EmailProperties emailProperties,
            EmailTemplatesRepository emailTemplatesRepository,
            EmailCampaignRulesRepository emailCampaignRulesRepository,
            EmailOutboxRepository emailOutboxRepository,
            EmailProfiles profiles,
            NotificationCatalog notificationTemplatesRepository,
            MemberAudience activitiesMembersService,
            ScheduledNotificationDeliveryService scheduledNotificationDeliveryService,
            ScheduledMessageAuditService scheduledMessageAuditService,
            EmailTemplateRenderer emailTemplateRenderer,
            PromotionalEmailRuleEvaluator ruleEvaluator,
            EmailProviderGateway emailProviderGateway) {
        this.emailProperties = emailProperties;
        this.emailTemplatesRepository = emailTemplatesRepository;
        this.emailCampaignRulesRepository = emailCampaignRulesRepository;
        this.emailOutboxRepository = emailOutboxRepository;
        this.profiles = profiles;
        this.notificationTemplatesRepository = notificationTemplatesRepository;
        this.activitiesMembersService = activitiesMembersService;
        this.scheduledNotificationDeliveryService = scheduledNotificationDeliveryService;
        this.scheduledMessageAuditService = scheduledMessageAuditService;
        this.emailTemplateRenderer = emailTemplateRenderer;
        this.ruleEvaluator = ruleEvaluator;
        this.emailProviderGateway = emailProviderGateway;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setDeploymentBrandingResolver(
            DeploymentBranding deploymentBrandingResolver) {
        this.deploymentBrandingResolver = deploymentBrandingResolver;
    }

    @PreDestroy
    public void shutdown() {
        runningRuleTasks.values().forEach(task -> task.cancel(true));
        ruleExecutor.shutdownNow();
    }

    @Scheduled(fixedDelayString = "${email.promotions.scheduler-poll-delay-ms:60000}")
    public void planScheduledPromotionalEmails() {
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.runScheduledGroups("promotional-email-planning", this::planScheduledPromotionalEmailsInGroup));
    }

    private void planScheduledPromotionalEmailsInGroup() {
        if (!promotionsEnabled()) {
            cancelAllRunningTasks("Email promotions are disabled.");
            return;
        }

        clearFinishedTasks();
        Instant now = Instant.now();
        List<EmailCampaignRule> rules = emailCampaignRulesRepository.findByBaseGroupId(JobGroupContext.groupId());
        cancelSuspendedRuleTasks(rules);
        for (EmailCampaignRule rule : emailCampaignRulesRepository.findByEnabledTrueOrderByPriorityDescRuleKeyAsc()) {
            if (rule == null || !isDue(rule, now)) {
                continue;
            }
            startRuleWorkerIfIdle(rule);
        }
    }

    public int planPendingPromotionalEmails() {
        if (!promotionsEnabled()) {
            return 0;
        }
        Instant now = Instant.now();
        int queued = 0;
        List<EmailCampaignRule> rules = emailCampaignRulesRepository.findByEnabledTrueOrderByPriorityDescRuleKeyAsc();
        for (EmailCampaignRule rule : rules) {
            if (isDue(rule, now)) {
                String runId = scheduledMessageAuditService.beginRun(rule);
                PlanningResult result = planRule(rule, runId);
                String detail = result.detail();
                scheduledMessageAuditService.finishRun(
                        runId,
                        result.affectedCount(),
                        result.notificationCount(),
                        result.emailQueuedCount(),
                        result.failedCount(),
                        "completed",
                        detail);
                markRuleFinished(safeText(rule.getRuleKey()), result.affectedCount(), "completed", detail);
                queued += result.affectedCount();
            }
        }
        return queued;
    }

    private synchronized boolean startRuleWorkerIfIdle(EmailCampaignRule rule) {
        String ruleKey = safeText(rule.getRuleKey());
        if (!StringUtils.hasText(ruleKey)) {
            return false;
        }
        Future<?> current = runningRuleTasks.get(workerKey(ruleKey));
        if (current != null && !current.isDone() && !current.isCancelled()) {
            return false;
        }
        markRuleRunning(ruleKey);
        String groupId = JobGroupContext.groupId();
        var mode = MongoSessionModeContext.currentMode();
        Future<?> task = ruleExecutor.submit(() -> {
            var previous = MongoSessionModeContext.currentMode();
            try { MongoSessionModeContext.set(mode); JobGroupContext.run(groupId, () -> runRuleWorker(ruleKey)); }
            finally { MongoSessionModeContext.set(previous); }
        });
        runningRuleTasks.put(workerKey(ruleKey), task);
        return true;
    }

    private String workerKey(String ruleKey) {
        return MongoSessionModeContext.currentMode().name() + ":" + JobGroupContext.key() + ":" + ruleKey;
    }

    private void runRuleWorker(String ruleKey) {
        PlanningResult result = PlanningResult.empty();
        String status = "completed";
        String detail = "Queued scheduled email campaign.";
        String runId = "";
        try {
            EmailCampaignRule rule = emailCampaignRulesRepository.findByRuleKey(ruleKey).orElse(null);
            if (!isActive(rule)) {
                status = "suspended";
                detail = "Rule is disabled or suspended.";
                return;
            }
            runId = scheduledMessageAuditService.beginRun(rule);
            result = planRule(rule, runId);
            detail = result.detail();
            if (result.affectedCount() > 0) {
                LOGGER.info("Affected {} user(s) for scheduled message rule {}.", result.affectedCount(), ruleKey);
            }
        } catch (Exception exception) {
            status = Thread.currentThread().isInterrupted() ? "cancelled" : "failed";
            detail = safeText(exception.getMessage());
            if (!"cancelled".equals(status)) {
                LOGGER.warn("Scheduled email campaign rule {} failed.", ruleKey, exception);
            }
        } finally {
            try {
                if (StringUtils.hasText(runId)) {
                    scheduledMessageAuditService.finishRun(
                            runId,
                            result.affectedCount(),
                            result.notificationCount(),
                            result.emailQueuedCount(),
                            result.failedCount(),
                            status,
                            detail);
                }
                markRuleFinished(ruleKey, result.affectedCount(), status, detail);
            } finally {
                runningRuleTasks.remove(workerKey(ruleKey));
            }
        }
    }

    private PlanningResult planRule(EmailCampaignRule rule, String runId) {
        if (!promotionsEnabled() || !isActive(rule)) {
            return PlanningResult.empty();
        }

        String nowIso = Instant.now().toString();
        EmailTemplate emailTemplate = resolveEmailTemplate(rule);
        Template notificationTemplate = resolveNotificationTemplate(rule);
        if (emailTemplate == null && notificationTemplate == null) {
            return PlanningResult.empty();
        }
        ResolvedDeploymentBranding branding = deploymentBranding();
        List<EmailOutboxItem> itemsToQueue = new ArrayList<>();
        int notificationCount = 0;
        int emailQueuedCount = 0;
        int failedCount = 0;
        for (EmailProfile user : resolveAudience(rule)) {
            if (!jobGroupScope.matchesWorkspace(user.getWorkspaceGroupId())) continue;
            if (Thread.currentThread().isInterrupted()) {
                throw new IllegalStateException("Scheduled email campaign was cancelled.");
            }
            if (user == null || !StringUtils.hasText(safeText(user.getId()))) {
                continue;
            }
            if (!ruleEvaluator.qualifies(user, rule)) {
                continue;
            }
            Map<String, String> variables = branding.enrich(
                    ruleEvaluator.buildTemplateVariables(
                            user,
                            rule,
                            emailProperties.getBaseUrl()));
            String ctaLabel = brandedCtaLabel(
                    variables,
                    branding.productName());
            variables.put("ctaLabel", ctaLabel);
            variables.put("cta_label", ctaLabel);
            if (notificationTemplate != null
                    && scheduledNotificationDeliveryService.send(user, notificationTemplate, variables, safeText(rule.getRuleKey()))) {
                notificationCount += 1;
                recordDelivery(runId, rule, user, "notification", "sent", "Firebase notification accepted.");
                continue;
            }
            if (emailTemplate == null || !StringUtils.hasText(safeText(user.getEmail()))) {
                failedCount += 1;
                recordDelivery(runId, rule, user, "none", "skipped", "No reachable email fallback for qualified user.");
                continue;
            }
            List<EmailOutboxItem> history = emailOutboxRepository.findByUserIdAndRuleKeyOrderByCreatedDateDesc(
                    safeText(user.getId()),
                    safeText(rule.getRuleKey()));
            if (hasReachedDeliveryLimit(rule, history) || isOnCooldown(rule, history, nowIso)) {
                continue;
            }
            String subject = emailTemplateRenderer.renderSubject(emailTemplate.getSubjectTemplate(), variables).trim();
            String htmlBody = emailTemplateRenderer.renderHtml(emailTemplate.getHtmlTemplate(), variables);
            String textBody = emailTemplateRenderer.renderText(emailTemplate.getTextTemplate(), variables);
            if (!StringUtils.hasText(subject) || (!StringUtils.hasText(htmlBody) && !StringUtils.hasText(textBody))) {
                failedCount += 1;
                recordDelivery(runId, rule, user, "email", "failed", "Email template rendered empty content.");
                continue;
            }
            itemsToQueue.add(buildOutboxItem(user, rule, emailTemplate, variables, subject, htmlBody, textBody, nowIso));
            emailQueuedCount += 1;
            recordDelivery(runId, rule, user, "email", "queued", "Email fallback queued.");
        }
        if (!itemsToQueue.isEmpty()) {
            emailOutboxRepository.saveAll(itemsToQueue);
        }
        return new PlanningResult(notificationCount, emailQueuedCount, failedCount);
    }

    private ResolvedDeploymentBranding deploymentBranding() {
        return deploymentBrandingResolver == null
                ? com.raxim.myscoutee.domain.platform.api.DeploymentBranding.fallback()
                : deploymentBrandingResolver.resolve();
    }

    static String brandedCtaLabel(
            Map<String, String> variables,
            String productName) {
        String snakeCase = safeText(variables.get("cta_label"));
        String camelCase = safeText(variables.get("ctaLabel"));
        if (StringUtils.hasText(snakeCase)
                && !"open".equalsIgnoreCase(snakeCase)) {
            return snakeCase;
        }
        if (StringUtils.hasText(camelCase)
                && !"open".equalsIgnoreCase(camelCase)) {
            return camelCase;
        }
        return "Open " + safeText(productName);
    }

    private EmailTemplate resolveEmailTemplate(EmailCampaignRule rule) {
        String templateKey = safeText(rule == null ? null : rule.getTemplateKey());
        if (!StringUtils.hasText(templateKey)) {
            return null;
        }
        return emailTemplatesRepository.findByTemplateKey(templateKey)
                .filter(template -> Boolean.TRUE.equals(template.getEnabled()))
                .orElse(null);
    }

    private Template resolveNotificationTemplate(EmailCampaignRule rule) {
        String templateKey = safeText(rule == null ? null : rule.getNotificationTemplateKey());
        if (!StringUtils.hasText(templateKey)) {
            return null;
        }
        return notificationTemplatesRepository.findByTemplateKey(templateKey)
                .filter(template -> Boolean.TRUE.equals(template.enabled()))
                .orElse(null);
    }

    private List<? extends EmailProfile> resolveAudience(EmailCampaignRule rule) {
        String eventId = safeText(rule == null ? null : rule.getEventId());
        if (!StringUtils.hasText(eventId)) {
            return profiles.findAll();
        }

        MemberAudience.Audience snapshot = activitiesMembersService.queryNotificationAudience(OWNER_TYPE_EVENT, eventId);
        if (snapshot == null) {
            return List.of();
        }
        String audienceScope = safeText(rule == null ? null : rule.getAudienceScope()).toLowerCase();
        Set<String> userIds = new LinkedHashSet<>();
        if (!"pending".equals(audienceScope)) {
            userIds.addAll(snapshot.acceptedMemberUserIds());
        }
        if (!"accepted".equals(audienceScope)) {
            userIds.addAll(snapshot.pendingMemberUserIds());
        }
        userIds.removeIf(userId -> !StringUtils.hasText(safeText(userId)));
        return userIds.isEmpty() ? List.of() : profiles.findByUserIdIn(userIds);
    }

    private boolean isDue(EmailCampaignRule rule, Instant now) {
        if (!isActive(rule)) {
            return false;
        }
        String scheduleType = normalizeScheduleType(rule);
        Instant resolvedNow = now == null ? Instant.now() : now;
        if (SCHEDULE_ONE_TIME.equals(scheduleType)) {
            Instant oneTimeAt = parseInstant(rule.getOneTimeAtIso());
            return oneTimeAt != null && parseInstant(rule.getLastRunAtIso()) == null && !resolvedNow.isBefore(oneTimeAt);
        }
        if (SCHEDULE_CRON.equals(scheduleType)) {
            Instant nextRun = resolveCronNextRun(rule, resolvedNow);
            return nextRun != null && !resolvedNow.isBefore(nextRun);
        }
        Instant nextRun = parseInstant(rule.getNextRunAtIso());
        if (nextRun == null) {
            Instant lastRun = parseInstant(rule.getLastRunAtIso());
            nextRun = lastRun == null
                    ? Instant.EPOCH
                    : lastRun.plusMillis(Math.max(60_000L, emailProperties.getPromotions().getPlanningDelayMs()));
        }
        return !resolvedNow.isBefore(nextRun);
    }

    private Instant resolveCronNextRun(EmailCampaignRule rule, Instant now) {
        Instant configuredNext = parseInstant(rule.getNextRunAtIso());
        if (configuredNext != null) {
            return configuredNext;
        }
        Instant base = firstPresent(
                parseInstant(rule.getLastRunAtIso()),
                parseInstant(rule.getCreatedDate()),
                now == null ? Instant.now() : now);
        return nextCronAfter(rule, base);
    }

    private Instant nextRunAfterCompletion(EmailCampaignRule rule, Instant finishedAt) {
        String scheduleType = normalizeScheduleType(rule);
        if (SCHEDULE_ONE_TIME.equals(scheduleType)) {
            return null;
        }
        if (SCHEDULE_CRON.equals(scheduleType)) {
            return nextCronAfter(rule, finishedAt);
        }
        return finishedAt.plusMillis(Math.max(60_000L, emailProperties.getPromotions().getPlanningDelayMs()));
    }

    private Instant nextCronAfter(EmailCampaignRule rule, Instant after) {
        String cronExpression = safeText(rule == null ? null : rule.getCronExpression());
        if (!StringUtils.hasText(cronExpression)) {
            return null;
        }
        try {
            ZoneId zoneId = ZoneId.of(firstNonBlank(rule == null ? null : rule.getTimezone(), "UTC"));
            ZonedDateTime next = CronExpression.parse(cronExpression).next((after == null ? Instant.now() : after).atZone(zoneId));
            return next == null ? null : next.toInstant();
        } catch (Exception exception) {
            return null;
        }
    }

    private void clearFinishedTasks() {
        runningRuleTasks.entrySet().removeIf(entry -> entry.getValue() == null || entry.getValue().isDone() || entry.getValue().isCancelled());
    }

    private void cancelSuspendedRuleTasks(Collection<EmailCampaignRule> rules) {
        if (rules == null || rules.isEmpty()) {
            return;
        }
        for (EmailCampaignRule rule : rules) {
            if (isActive(rule)) {
                continue;
            }
            String ruleKey = safeText(rule == null ? null : rule.getRuleKey());
            Future<?> task = runningRuleTasks.remove(workerKey(ruleKey));
            if (task != null) {
                task.cancel(true);
                markRuleFinished(ruleKey, 0, "suspended", "Rule was suspended while running.");
            }
        }
    }

    private void cancelAllRunningTasks(String detail) {
        String prefix = workerKey("");
        for (Map.Entry<String, Future<?>> entry : runningRuleTasks.entrySet()) {
            if (!entry.getKey().startsWith(prefix)) continue;
            Future<?> task = runningRuleTasks.remove(entry.getKey());
            if (task != null) task.cancel(true);
            markRuleFinished(entry.getKey().substring(prefix.length()), 0, "suspended", detail);
        }
    }

    private void markRuleRunning(String ruleKey) {
        EmailCampaignRule rule = emailCampaignRulesRepository.findByRuleKey(ruleKey).orElse(null);
        if (rule == null) {
            return;
        }
        String nowIso = Instant.now().toString();
        rule.setRunning(true);
        rule.setLastRunStatus("running");
        rule.setLastRunDetail("Scheduled rule worker started.");
        rule.setUpdatedDate(nowIso);
        rule.setUpdatedUser(UPDATED_BY);
        emailCampaignRulesRepository.save(rule);
    }

    private void markRuleFinished(String ruleKey, int count, String status, String detail) {
        EmailCampaignRule rule = emailCampaignRulesRepository.findByRuleKey(ruleKey).orElse(null);
        if (rule == null) {
            return;
        }
        Instant finishedAt = Instant.now();
        Instant nextRun = nextRunAfterCompletion(rule, finishedAt);
        rule.setRunning(false);
        rule.setLastRunAtIso(finishedAt.toString());
        rule.setNextRunAtIso(nextRun == null ? "" : nextRun.toString());
        rule.setLastRunStatus(firstNonBlank(status, "completed"));
        rule.setLastRunDetail(safeText(detail));
        rule.setLastRunCount(Math.max(0, count));
        rule.setUpdatedDate(finishedAt.toString());
        rule.setUpdatedUser(UPDATED_BY);
        emailCampaignRulesRepository.save(rule);
    }

    private boolean isActive(EmailCampaignRule rule) {
        return rule != null && Boolean.TRUE.equals(rule.getEnabled()) && !Boolean.TRUE.equals(rule.getSuspended());
    }

    private boolean promotionsEnabled() {
        return emailProperties.isEnabled() && emailProperties.getPromotions().isEnabled();
    }

    private String normalizeScheduleType(EmailCampaignRule rule) {
        String scheduleType = safeText(rule == null ? null : rule.getScheduleType()).toLowerCase();
        if (SCHEDULE_ONE_TIME.equals(scheduleType) || "one-time".equals(scheduleType) || "once".equals(scheduleType)) {
            return SCHEDULE_ONE_TIME;
        }
        if (SCHEDULE_CRON.equals(scheduleType) || StringUtils.hasText(safeText(rule == null ? null : rule.getCronExpression()))) {
            return SCHEDULE_CRON;
        }
        return "";
    }

    private void recordDelivery(
            String runId,
            EmailCampaignRule rule,
            EmailProfile user,
            String channel,
            String status,
            String detail) {
        if (!StringUtils.hasText(safeText(runId))) {
            return;
        }
        scheduledMessageAuditService.recordDelivery(runId, rule, user, channel, status, detail);
    }

    private record PlanningResult(
            int notificationCount,
            int emailQueuedCount,
            int failedCount) {
        static PlanningResult empty() {
            return new PlanningResult(0, 0, 0);
        }

        int affectedCount() {
            return notificationCount + emailQueuedCount;
        }

        String detail() {
            return "Notifications sent: " + notificationCount
                    + ", emails queued: " + emailQueuedCount
                    + ", failed/skipped: " + failedCount + ".";
        }
    }

    private EmailOutboxItem buildOutboxItem(
            EmailProfile user,
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
        item.setBaseGroupId(JobGroupContext.groupId());
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

    private Instant parseInstant(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        try {
            return Instant.parse(normalized);
        } catch (Exception exception) {
            return null;
        }
    }

    private Instant firstPresent(Instant first, Instant second, Instant third) {
        if (first != null) {
            return first;
        }
        if (second != null) {
            return second;
        }
        return third;
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : safeText(second);
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
