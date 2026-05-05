package com.raxim.myscoutee.profile.service.notifications;

import java.time.DateTimeException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.repository.NotificationRuleConfigsRepository;

@Service
public class NotificationRuleRegistryService {
    public static final String RULE_CHAT_MESSAGE = "chat-message";
    public static final String RULE_EVENT_INVITATION = "event-invitation";
    public static final String RULE_EVENT_FEEDBACK_READY = "event-feedback-ready";
    public static final String RULE_PROMOTIONAL_EMAIL_PLANNER = "promotional-email-planner";
    public static final String RULE_EMAIL_OUTBOX_DELIVERY = "email-outbox-delivery";
    public static final String RULE_EVENT_RANDOM_GROUPS = "event-random-groups";
    public static final String RULE_EVENT_PRIORITY_INVITER = "event-priority-inviter";
    public static final String RULE_EVENT_SCORE_LEADERBOARD = "event-score-leaderboard";

    public static final String CHANNEL_PUSH = "push";
    public static final String CHANNEL_EMAIL = "email";
    public static final String CHANNEL_IN_APP = "in-app";
    public static final String CHANNEL_SUPPORT_CHAT = "support-chat";

    private static final String SYSTEM_USER = "notification-registry";
    private static final Set<String> SCHEDULED_EVENT_RULES = Set.of(
            RULE_EVENT_RANDOM_GROUPS,
            RULE_EVENT_PRIORITY_INVITER,
            RULE_EVENT_SCORE_LEADERBOARD);

    private final NotificationRuleConfigsRepository notificationRuleConfigsRepository;

    public NotificationRuleRegistryService(NotificationRuleConfigsRepository notificationRuleConfigsRepository) {
        this.notificationRuleConfigsRepository = notificationRuleConfigsRepository;
    }

    public List<NotificationRuleConfig> rules() {
        ensureDefaultRules();
        return sorted(notificationRuleConfigsRepository.findAll());
    }

    public Optional<NotificationRuleConfig> findRule(String ruleKey) {
        ensureDefaultRules();
        return notificationRuleConfigsRepository.findByRuleKey(safeText(ruleKey));
    }

    public boolean isActionChannelEnabled(String ruleKey, String channel) {
        NotificationRuleConfig rule = findRule(ruleKey).orElse(null);
        if (rule == null || !Boolean.TRUE.equals(rule.getEnabled())) {
            return false;
        }
        if (rule.getChannels() == null) {
            return false;
        }
        String normalizedChannel = safeText(channel).toLowerCase();
        return switch (normalizedChannel) {
            case CHANNEL_PUSH -> Boolean.TRUE.equals(rule.getChannels().getPushEnabled());
            case CHANNEL_EMAIL -> Boolean.TRUE.equals(rule.getChannels().getEmailEnabled());
            case CHANNEL_IN_APP -> Boolean.TRUE.equals(rule.getChannels().getInAppEnabled());
            case CHANNEL_SUPPORT_CHAT -> Boolean.TRUE.equals(rule.getChannels().getSupportChatEnabled());
            default -> false;
        };
    }

    public boolean shouldRunScheduledRule(String ruleKey, Instant now) {
        NotificationRuleConfig rule = findRule(ruleKey).orElse(null);
        if (rule == null || !Boolean.TRUE.equals(rule.getEnabled())) {
            return false;
        }
        String triggerKind = safeText(rule.getTriggerKind());
        if (!"scheduled_process".equals(triggerKind) && !"timed".equals(triggerKind)) {
            return false;
        }
        NotificationRuleConfig.Timing timing = rule.getTiming() == null ? new NotificationRuleConfig.Timing() : rule.getTiming();
        String mode = safeText(timing.getMode()).toLowerCase();
        Instant resolvedNow = now == null ? Instant.now() : now;
        if ("interval".equals(mode)) {
            int intervalMinutes = Math.max(1, valueOrDefault(timing.getIntervalMinutes(), 60));
            Instant lastRunAt = parseInstant(rule.getRunState() == null ? null : rule.getRunState().getLastRunAtIso());
            return lastRunAt == null || !resolvedNow.isBefore(lastRunAt.plusSeconds(intervalMinutes * 60L));
        }
        if ("yearly".equals(mode)) {
            Instant occurrence = yearlyOccurrence(timing, resolvedNow);
            if (occurrence == null || resolvedNow.isBefore(occurrence)) {
                return false;
            }
            Instant lastRunAt = parseInstant(rule.getRunState() == null ? null : rule.getRunState().getLastRunAtIso());
            return lastRunAt == null || lastRunAt.isBefore(occurrence);
        }
        return false;
    }

    public boolean hasEnabledScheduledEventRule() {
        ensureDefaultRules();
        for (NotificationRuleConfig rule : notificationRuleConfigsRepository.findAll()) {
            if (rule == null || !Boolean.TRUE.equals(rule.getEnabled())) {
                continue;
            }
            if (SCHEDULED_EVENT_RULES.contains(safeText(rule.getRuleKey()))) {
                return true;
            }
        }
        return false;
    }

    public NotificationRuleConfig recordRun(String ruleKey, int count, String status, String detail, String actorUserId) {
        NotificationRuleConfig rule = findRule(ruleKey).orElse(null);
        if (rule == null) {
            return null;
        }
        String nowIso = Instant.now().toString();
        NotificationRuleConfig.RunState runState = rule.getRunState() == null
                ? new NotificationRuleConfig.RunState()
                : rule.getRunState();
        runState.setLastRunAtIso(nowIso);
        runState.setLastRunCount(Math.max(0, count));
        runState.setLastRunStatus(firstNonBlank(status, "completed"));
        runState.setLastRunDetail(safeText(detail));
        runState.setLastRunUser(firstNonBlank(actorUserId, SYSTEM_USER));
        rule.setRunState(runState);
        rule.setUpdatedDate(nowIso);
        rule.setUpdatedUser(firstNonBlank(actorUserId, SYSTEM_USER));
        return notificationRuleConfigsRepository.save(rule);
    }

    public List<NotificationRuleConfig> saveRules(List<NotificationRuleConfig> incomingRules, String actorUserId) {
        ensureDefaultRules();
        if (incomingRules == null || incomingRules.isEmpty()) {
            return rules();
        }
        Map<String, NotificationRuleConfig> existingByKey = new LinkedHashMap<>();
        for (NotificationRuleConfig existing : notificationRuleConfigsRepository.findAll()) {
            if (existing != null && StringUtils.hasText(safeText(existing.getRuleKey()))) {
                existingByKey.put(safeText(existing.getRuleKey()), existing);
            }
        }
        String nowIso = Instant.now().toString();
        List<NotificationRuleConfig> nextRules = new ArrayList<>();
        for (NotificationRuleConfig incoming : incomingRules) {
            String ruleKey = safeText(incoming == null ? null : incoming.getRuleKey());
            if (!StringUtils.hasText(ruleKey)) {
                continue;
            }
            NotificationRuleConfig current = existingByKey.get(ruleKey);
            NotificationRuleConfig merged = current == null ? baseRule(ruleKey, nowIso) : current;
            mergeEditableFields(merged, incoming);
            if (!StringUtils.hasText(merged.getCreatedDate())) {
                merged.setCreatedDate(nowIso);
            }
            if (!StringUtils.hasText(merged.getCreatedUser())) {
                merged.setCreatedUser(firstNonBlank(actorUserId, SYSTEM_USER));
            }
            merged.setUpdatedDate(nowIso);
            merged.setUpdatedUser(firstNonBlank(actorUserId, SYSTEM_USER));
            nextRules.add(merged);
        }
        if (!nextRules.isEmpty()) {
            notificationRuleConfigsRepository.saveAll(nextRules);
        }
        return rules();
    }

    public List<NotificationRuleConfig> defaultRules() {
        String nowIso = Instant.now().toString();
        return List.of(
                actionRule(
                        RULE_CHAT_MESSAGE,
                        "Chat message",
                        "Action",
                        "chat.message.created",
                        "Notify offline recipients when a chat message arrives.",
                        10,
                        true,
                        true,
                        false,
                        "New message from @sender_name",
                        "@sender_name sent a message in @chat_title.",
                        "/game"),
                actionRule(
                        RULE_EVENT_INVITATION,
                        "Event invitation",
                        "Action",
                        "event.invitation.created",
                        "Notify members when an organizer invites them to an event.",
                        20,
                        true,
                        true,
                        false,
                        "You were invited to @event_title",
                        "@event_title starts @event_start_at.",
                        "/game"),
                timedRule(
                        RULE_EVENT_FEEDBACK_READY,
                        "Event feedback ready",
                        "Timed",
                        "event.feedback.ready",
                        "Yearly or manual feedback reminder rule for post-event feedback windows.",
                        30,
                        false,
                        false,
                        true,
                        5,
                        1,
                        "09:00",
                        "UTC",
                        "Feedback is open for @event_title",
                        "Share feedback for @event_title while it is fresh.",
                        "/game"),
                scheduledRule(
                        RULE_PROMOTIONAL_EMAIL_PLANNER,
                        "Promotional email planner",
                        "Scheduled",
                        "email.promotional.plan",
                        "Builds eligible email outbox rows from campaign rules.",
                        100,
                        true,
                        true,
                        60,
                        nowIso),
                scheduledRule(
                        RULE_EMAIL_OUTBOX_DELIVERY,
                        "Email outbox delivery",
                        "Scheduled",
                        "email.outbox.deliver",
                        "Sends pending email outbox rows that are due.",
                        110,
                        true,
                        true,
                        1,
                        nowIso),
                scheduledRule(
                        RULE_EVENT_RANDOM_GROUPS,
                        "Random group planner",
                        "Scheduled",
                        "event.scheduler.random-groups",
                        "Assigns accepted members into generated event groups.",
                        200,
                        false,
                        false,
                        15,
                        nowIso),
                scheduledRule(
                        RULE_EVENT_PRIORITY_INVITER,
                        "Priority inviter",
                        "Scheduled",
                        "event.scheduler.priority-inviter",
                        "Fills open event capacity with priority-based invitation batches.",
                        210,
                        false,
                        false,
                        15,
                        nowIso),
                scheduledRule(
                        RULE_EVENT_SCORE_LEADERBOARD,
                        "Score leaderboard materializer",
                        "Scheduled",
                        "event.scheduler.score-leaderboard",
                        "Materializes generated groups for score and tournament stages.",
                        220,
                        false,
                        false,
                        15,
                        nowIso));
    }

    private void ensureDefaultRules() {
        Map<String, NotificationRuleConfig> existingByKey = new LinkedHashMap<>();
        for (NotificationRuleConfig existing : notificationRuleConfigsRepository.findAll()) {
            if (existing != null && StringUtils.hasText(safeText(existing.getRuleKey()))) {
                existingByKey.put(safeText(existing.getRuleKey()), existing);
            }
        }
        List<NotificationRuleConfig> missing = new ArrayList<>();
        for (NotificationRuleConfig defaultRule : defaultRules()) {
            if (!existingByKey.containsKey(safeText(defaultRule.getRuleKey()))) {
                missing.add(defaultRule);
            }
        }
        if (!missing.isEmpty()) {
            notificationRuleConfigsRepository.saveAll(missing);
        }
    }

    private NotificationRuleConfig actionRule(
            String ruleKey,
            String label,
            String category,
            String actionKey,
            String description,
            int priority,
            boolean enabled,
            boolean pushEnabled,
            boolean emailEnabled,
            String subject,
            String body,
            String ctaPath) {
        NotificationRuleConfig rule = baseRule(ruleKey, Instant.now().toString());
        rule.setLabel(label);
        rule.setCategory(category);
        rule.setDescription(description);
        rule.setActionKey(actionKey);
        rule.setTriggerKind("action");
        rule.setEnabled(enabled);
        rule.setManualRunEnabled(false);
        rule.setPriority(priority);
        NotificationRuleConfig.DeliveryChannels channels = new NotificationRuleConfig.DeliveryChannels();
        channels.setPushEnabled(pushEnabled);
        channels.setEmailEnabled(emailEnabled);
        channels.setInAppEnabled(false);
        channels.setSupportChatEnabled(false);
        rule.setChannels(channels);
        NotificationRuleConfig.Timing timing = new NotificationRuleConfig.Timing();
        timing.setMode("immediate");
        timing.setDelayMinutes(0);
        timing.setTimezone("UTC");
        rule.setTiming(timing);
        NotificationRuleConfig.MessageTemplate message = new NotificationRuleConfig.MessageTemplate();
        message.setPushTitle(subject);
        message.setPushBody(body);
        message.setEmailSubject(subject);
        message.setEmailBody(body);
        message.setCtaPath(ctaPath);
        rule.setMessage(message);
        return rule;
    }

    private NotificationRuleConfig timedRule(
            String ruleKey,
            String label,
            String category,
            String actionKey,
            String description,
            int priority,
            boolean enabled,
            boolean pushEnabled,
            boolean emailEnabled,
            int month,
            int dayOfMonth,
            String time,
            String timezone,
            String subject,
            String body,
            String ctaPath) {
        NotificationRuleConfig rule = actionRule(ruleKey, label, category, actionKey, description, priority, enabled,
                pushEnabled, emailEnabled, subject, body, ctaPath);
        rule.setTriggerKind("timed");
        rule.setManualRunEnabled(true);
        NotificationRuleConfig.Timing timing = new NotificationRuleConfig.Timing();
        timing.setMode("yearly");
        timing.setMonth(month);
        timing.setDayOfMonth(dayOfMonth);
        timing.setTime(time);
        timing.setTimezone(timezone);
        rule.setTiming(timing);
        return rule;
    }

    private NotificationRuleConfig scheduledRule(
            String ruleKey,
            String label,
            String category,
            String actionKey,
            String description,
            int priority,
            boolean enabled,
            boolean emailEnabled,
            int intervalMinutes,
            String nowIso) {
        NotificationRuleConfig rule = baseRule(ruleKey, nowIso);
        rule.setLabel(label);
        rule.setCategory(category);
        rule.setDescription(description);
        rule.setActionKey(actionKey);
        rule.setTriggerKind("scheduled_process");
        rule.setEnabled(enabled);
        rule.setManualRunEnabled(true);
        rule.setPriority(priority);
        NotificationRuleConfig.DeliveryChannels channels = new NotificationRuleConfig.DeliveryChannels();
        channels.setPushEnabled(false);
        channels.setEmailEnabled(emailEnabled);
        channels.setInAppEnabled(false);
        channels.setSupportChatEnabled(false);
        rule.setChannels(channels);
        NotificationRuleConfig.Timing timing = new NotificationRuleConfig.Timing();
        timing.setMode("interval");
        timing.setIntervalMinutes(intervalMinutes);
        timing.setTimezone("UTC");
        rule.setTiming(timing);
        return rule;
    }

    private NotificationRuleConfig baseRule(String ruleKey, String nowIso) {
        NotificationRuleConfig rule = new NotificationRuleConfig();
        rule.setId(new ObjectId().toHexString());
        rule.setSyncKey(UUID.randomUUID().toString());
        rule.setRuleKey(safeText(ruleKey));
        rule.setCreatedDate(nowIso);
        rule.setCreatedUser(SYSTEM_USER);
        rule.setUpdatedDate(nowIso);
        rule.setUpdatedUser(SYSTEM_USER);
        return rule;
    }

    private void mergeEditableFields(NotificationRuleConfig target, NotificationRuleConfig source) {
        target.setRuleKey(firstNonBlank(source.getRuleKey(), target.getRuleKey()));
        target.setLabel(firstNonBlank(source.getLabel(), target.getLabel()));
        target.setCategory(firstNonBlank(source.getCategory(), target.getCategory()));
        target.setDescription(safeText(source.getDescription()));
        target.setActionKey(firstNonBlank(source.getActionKey(), target.getActionKey()));
        target.setTriggerKind(firstNonBlank(source.getTriggerKind(), target.getTriggerKind()));
        target.setEnabled(Boolean.TRUE.equals(source.getEnabled()));
        target.setManualRunEnabled(Boolean.TRUE.equals(source.getManualRunEnabled()));
        target.setPriority(valueOrDefault(source.getPriority(), valueOrDefault(target.getPriority(), 1000)));
        target.setChannels(normalizeChannels(source.getChannels()));
        target.setTiming(normalizeTiming(source.getTiming(), source.getTriggerKind()));
        target.setMessage(normalizeMessage(source.getMessage()));
    }

    private NotificationRuleConfig.DeliveryChannels normalizeChannels(NotificationRuleConfig.DeliveryChannels source) {
        NotificationRuleConfig.DeliveryChannels channels = new NotificationRuleConfig.DeliveryChannels();
        channels.setPushEnabled(Boolean.TRUE.equals(source == null ? null : source.getPushEnabled()));
        channels.setEmailEnabled(Boolean.TRUE.equals(source == null ? null : source.getEmailEnabled()));
        channels.setInAppEnabled(Boolean.TRUE.equals(source == null ? null : source.getInAppEnabled()));
        channels.setSupportChatEnabled(Boolean.TRUE.equals(source == null ? null : source.getSupportChatEnabled()));
        return channels;
    }

    private NotificationRuleConfig.Timing normalizeTiming(NotificationRuleConfig.Timing source, String triggerKind) {
        NotificationRuleConfig.Timing timing = new NotificationRuleConfig.Timing();
        String mode = safeText(source == null ? null : source.getMode()).toLowerCase();
        if (!Set.of("immediate", "delay", "interval", "yearly", "manual").contains(mode)) {
            mode = "scheduled_process".equals(safeText(triggerKind)) ? "interval" : "immediate";
        }
        timing.setMode(mode);
        timing.setDelayMinutes(Math.max(0, valueOrDefault(source == null ? null : source.getDelayMinutes(), 0)));
        timing.setIntervalMinutes(Math.max(1, valueOrDefault(source == null ? null : source.getIntervalMinutes(), 60)));
        timing.setMonth(clamp(valueOrDefault(source == null ? null : source.getMonth(), 1), 1, 12));
        timing.setDayOfMonth(clamp(valueOrDefault(source == null ? null : source.getDayOfMonth(), 1), 1, 31));
        timing.setTime(normalizeTime(source == null ? null : source.getTime()));
        timing.setTimezone(firstNonBlank(source == null ? null : source.getTimezone(), "UTC"));
        return timing;
    }

    private NotificationRuleConfig.MessageTemplate normalizeMessage(NotificationRuleConfig.MessageTemplate source) {
        NotificationRuleConfig.MessageTemplate message = new NotificationRuleConfig.MessageTemplate();
        message.setPushTitle(safeText(source == null ? null : source.getPushTitle()));
        message.setPushBody(safeText(source == null ? null : source.getPushBody()));
        message.setEmailTemplateKey(safeText(source == null ? null : source.getEmailTemplateKey()));
        message.setEmailSubject(safeText(source == null ? null : source.getEmailSubject()));
        message.setEmailBody(safeText(source == null ? null : source.getEmailBody()));
        message.setCtaPath(firstNonBlank(source == null ? null : source.getCtaPath(), "/game"));
        return message;
    }

    private List<NotificationRuleConfig> sorted(List<NotificationRuleConfig> rules) {
        return rules.stream()
                .filter(rule -> rule != null && StringUtils.hasText(safeText(rule.getRuleKey())))
                .sorted(Comparator
                        .comparing((NotificationRuleConfig rule) -> valueOrDefault(rule.getPriority(), 1000))
                        .thenComparing(rule -> safeText(rule.getRuleKey())))
                .toList();
    }

    private Instant yearlyOccurrence(NotificationRuleConfig.Timing timing, Instant now) {
        try {
            ZoneId zoneId = ZoneId.of(firstNonBlank(timing.getTimezone(), "UTC"));
            ZonedDateTime zonedNow = now.atZone(zoneId);
            int month = clamp(valueOrDefault(timing.getMonth(), 1), 1, 12);
            int dayOfMonth = clamp(valueOrDefault(timing.getDayOfMonth(), 1), 1, 31);
            LocalDate date = safeDate(zonedNow.getYear(), month, dayOfMonth);
            LocalTime time = LocalTime.parse(normalizeTime(timing.getTime()));
            return ZonedDateTime.of(date, time, zoneId).toInstant();
        } catch (Exception exception) {
            return null;
        }
    }

    private LocalDate safeDate(int year, int month, int dayOfMonth) {
        int day = dayOfMonth;
        while (day >= 1) {
            try {
                return LocalDate.of(year, month, day);
            } catch (DateTimeException exception) {
                day -= 1;
            }
        }
        return LocalDate.of(year, month, 1);
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

    private String normalizeTime(String value) {
        String normalized = safeText(value);
        if (!normalized.matches("\\d{2}:\\d{2}")) {
            return "09:00";
        }
        return normalized;
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : safeText(second);
    }

    private int valueOrDefault(Integer value, int fallback) {
        return value == null ? fallback : value.intValue();
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
