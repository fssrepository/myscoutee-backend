package com.raxim.myscoutee.profile.service.notifications;

import java.time.DateTimeException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.DayOfWeek;
import java.time.temporal.ChronoUnit;
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
    public static final String RULE_EVENT_RANDOM_GROUPS = "event-random-groups";
    public static final String RULE_EVENT_AUTO_INVITER = "event-auto-inviter";
    public static final String RULE_EVENT_TOURNAMENT_REVIEW = "event-tournament-review";

    private static final String SYSTEM_USER = "notification-registry";
    private static final String INTERVAL_UNIT_SECONDS = "seconds";
    private static final String INTERVAL_UNIT_MINUTES = "minutes";
    private static final String INTERVAL_UNIT_HOURS = "hours";
    private static final String INTERVAL_UNIT_DAYS = "days";
    private static final String INTERVAL_UNIT_WEEKS = "weeks";
    private static final String INTERVAL_UNIT_MONTHS = "months";
    private static final String INTERVAL_UNIT_YEARS = "years";
    private static final int RUN_HISTORY_LIMIT = 12;
    private static final Set<String> SCHEDULED_EVENT_RULES = Set.of(
            RULE_EVENT_RANDOM_GROUPS,
            RULE_EVENT_AUTO_INVITER,
            RULE_EVENT_TOURNAMENT_REVIEW);
    private static final Set<String> OBSOLETE_PARAMETER_KEYS = Set.of(
            "jobs.process.randomGroups.historyPenalty");

    private final NotificationRuleConfigsRepository notificationRuleConfigsRepository;
    private final AdminNotificationSocketSessionRegistry socketSessionRegistry;

    private record IntervalSpec(int amount, String unit, int seconds, int minutes) {}

    public NotificationRuleRegistryService(
            NotificationRuleConfigsRepository notificationRuleConfigsRepository,
            AdminNotificationSocketSessionRegistry socketSessionRegistry) {
        this.notificationRuleConfigsRepository = notificationRuleConfigsRepository;
        this.socketSessionRegistry = socketSessionRegistry;
    }

    public List<NotificationRuleConfig> rules() {
        ensureDefaultRules();
        return sorted(notificationRuleConfigsRepository.findAll());
    }

    public Optional<NotificationRuleConfig> findRule(String ruleKey) {
        ensureDefaultRules();
        return notificationRuleConfigsRepository.findByRuleKey(safeText(ruleKey));
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
        Instant resolvedNow = now == null ? Instant.now() : now;
        List<NotificationRuleConfig.ScheduleSlot> slots = normalizeScheduleSlots(rule.getScheduleSlots(), timing);
        if (!slots.isEmpty()) {
            Instant lastRunAt = parseInstant(rule.getRunState() == null ? null : rule.getRunState().getLastRunAtIso());
            for (NotificationRuleConfig.ScheduleSlot slot : slots) {
                Instant occurrence = slotOccurrence(slot, resolvedNow);
                if (occurrence != null && !resolvedNow.isBefore(occurrence) && (lastRunAt == null || lastRunAt.isBefore(occurrence))) {
                    return true;
                }
            }
            return false;
        }

        String mode = safeText(timing.getMode()).toLowerCase();
        if ("interval".equals(mode)) {
            Instant lastRunAt = parseInstant(rule.getRunState() == null ? null : rule.getRunState().getLastRunAtIso());
            return isIntervalDue(timing, lastRunAt, resolvedNow);
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

    public NotificationRuleConfig beginRun(String ruleKey, String detail, String actorUserId) {
        return beginRun(ruleKey, detail, actorUserId, Instant.now());
    }

    public NotificationRuleConfig beginRun(String ruleKey, String detail, String actorUserId, Instant startedAt) {
        NotificationRuleConfig rule = findRule(ruleKey).orElse(null);
        if (rule == null) {
            return null;
        }
        String nowIso = Instant.now().toString();
        String startedAtIso = (startedAt == null ? Instant.now() : startedAt).toString();
        NotificationRuleConfig.RunState runState = rule.getRunState() == null
                ? new NotificationRuleConfig.RunState()
                : rule.getRunState();
        runState.setCurrentStatus("running");
        runState.setProgressPercent(0);
        runState.setProgressDetail(firstNonBlank(detail, "Starting scheduled process."));
        runState.setStartedAtIso(startedAtIso);
        runState.setFinishedAtIso("");
        runState.setDurationMillis(0L);
        rule.setRunState(runState);
        rule.setUpdatedDate(nowIso);
        rule.setUpdatedUser(firstNonBlank(actorUserId, SYSTEM_USER));
        NotificationRuleConfig saved = notificationRuleConfigsRepository.save(rule);
        socketSessionRegistry.broadcastRuleRuntime(saved);
        return saved;
    }

    public NotificationRuleConfig recordRun(String ruleKey, int count, String status, String detail, String actorUserId) {
        return recordRun(ruleKey, count, status, detail, actorUserId, null);
    }

    public NotificationRuleConfig recordRun(
            String ruleKey,
            int count,
            String status,
            String detail,
            String actorUserId,
            Instant startedAtOverride) {
        NotificationRuleConfig rule = findRule(ruleKey).orElse(null);
        if (rule == null) {
            return null;
        }
        String finishedAtIso = Instant.now().toString();
        NotificationRuleConfig.RunState runState = rule.getRunState() == null
                ? new NotificationRuleConfig.RunState()
                : rule.getRunState();
        String startedAtIso = startedAtOverride == null
                ? firstNonBlank(runState.getStartedAtIso(), finishedAtIso)
                : startedAtOverride.toString();
        Instant startedAt = parseInstant(startedAtIso);
        Instant finishedAt = parseInstant(finishedAtIso);
        long durationMillis = startedAt == null || finishedAt == null
                ? 0L
                : Math.max(0L, finishedAt.toEpochMilli() - startedAt.toEpochMilli());
        runState.setCurrentStatus(firstNonBlank(status, "completed"));
        runState.setProgressPercent(100);
        runState.setProgressDetail(safeText(detail));
        runState.setFinishedAtIso(finishedAtIso);
        runState.setDurationMillis(durationMillis);
        runState.setLastRunAtIso(finishedAtIso);
        runState.setLastRunCount(Math.max(0, count));
        runState.setLastRunStatus(firstNonBlank(status, "completed"));
        runState.setLastRunDetail(safeText(detail));
        runState.setLastRunUser(firstNonBlank(actorUserId, SYSTEM_USER));
        rule.setRunState(runState);
        appendRunHistory(rule, startedAtIso, finishedAtIso, durationMillis, count, status, detail, actorUserId);
        rule.setUpdatedDate(finishedAtIso);
        rule.setUpdatedUser(firstNonBlank(actorUserId, SYSTEM_USER));
        NotificationRuleConfig saved = notificationRuleConfigsRepository.save(rule);
        socketSessionRegistry.broadcastRuleRuntime(saved);
        return saved;
    }

    public NotificationRuleConfig updateRunProgress(String ruleKey, int progressPercent, String detail, String actorUserId) {
        NotificationRuleConfig rule = findRule(ruleKey).orElse(null);
        if (rule == null) {
            return null;
        }
        String nowIso = Instant.now().toString();
        NotificationRuleConfig.RunState runState = rule.getRunState() == null
                ? new NotificationRuleConfig.RunState()
                : rule.getRunState();
        runState.setCurrentStatus("running");
        runState.setProgressPercent(clamp(progressPercent, 0, 99));
        runState.setProgressDetail(firstNonBlank(detail, "Scheduled process is running."));
        if (!StringUtils.hasText(runState.getStartedAtIso())) {
            runState.setStartedAtIso(nowIso);
        }
        runState.setFinishedAtIso("");
        runState.setDurationMillis(0L);
        rule.setRunState(runState);
        rule.setUpdatedDate(nowIso);
        rule.setUpdatedUser(firstNonBlank(actorUserId, SYSTEM_USER));
        NotificationRuleConfig saved = notificationRuleConfigsRepository.save(rule);
        socketSessionRegistry.broadcastRuleRuntime(saved);
        return saved;
    }

    public void broadcastRunProgress(
            String ruleKey,
            NotificationRuleConfig.RunState runState,
            List<NotificationRuleConfig.RunHistoryEntry> runHistory,
            String actorUserId) {
        socketSessionRegistry.broadcastRuleRuntime(
                ruleKey,
                runState,
                runHistory,
                Instant.now().toString(),
                firstNonBlank(actorUserId, SYSTEM_USER));
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
                scheduledRule(
                        RULE_EVENT_RANDOM_GROUPS,
                        "admin.jobs.rule.event.random.groups",
                        "admin.jobs.category.scheduled",
                        "event.scheduler.random-groups",
                        "admin.jobs.rule.event.random.groups.description",
                        200,
                        false,
                        true,
                        false,
                        1440,
                        nowIso,
                        randomGroupParameters()),
                scheduledRule(
                        RULE_EVENT_AUTO_INVITER,
                        "admin.jobs.rule.event.auto.inviter",
                        "admin.jobs.category.scheduled",
                        "event.scheduler.auto-inviter",
                        "admin.jobs.rule.event.auto.inviter.description",
                        210,
                        true,
                        false,
                        false,
                        120,
                        nowIso,
                        autoInviterParameters()),
                scheduledRule(
                        RULE_EVENT_TOURNAMENT_REVIEW,
                        "admin.jobs.rule.event.tournament.review",
                        "admin.jobs.category.scheduled",
                        "event.scheduler.tournament-review",
                        "admin.jobs.rule.event.tournament.review.description",
                        220,
                        true,
                        false,
                        false,
                        30,
                        nowIso,
                        tournamentReviewParameters()),
                scheduledRule(
                        "notification-outbox",
                        "admin.jobs.rule.notification.outbox",
                        "admin.jobs.category.scheduled",
                        "notifications.outbox.worker",
                        "admin.jobs.rule.notification.outbox.description",
                        230,
                        true,
                        false,
                        false,
                        1,
                        nowIso,
                        List.of()),
                scheduledRule(
                        "affinity-recompute",
                        "admin.jobs.rule.affinity.recompute",
                        "admin.jobs.category.scheduled",
                        "affinity.recompute.worker",
                        "admin.jobs.rule.affinity.recompute.description",
                        240,
                        true,
                        false,
                        false,
                        1,
                        nowIso,
                        List.of()),
                scheduledRule(
                        "scheduled-messages",
                        "admin.jobs.rule.scheduled.messages",
                        "admin.jobs.category.scheduled",
                        "scheduled.messages.worker",
                        "admin.jobs.rule.scheduled.messages.description",
                        250,
                        true,
                        false,
                        false,
                        30,
                        nowIso,
                        List.of()),
                scheduledRule(
                        "account-purge",
                        "admin.jobs.rule.account.purge",
                        "admin.jobs.category.scheduled",
                        "users.deleted-account-purge",
                        "admin.jobs.rule.account.purge.description",
                        260,
                        true,
                        false,
                        false,
                        1440,
                        nowIso,
                        List.of()));
    }

    private void ensureDefaultRules() {
        Map<String, NotificationRuleConfig> existingByKey = new LinkedHashMap<>();
        for (NotificationRuleConfig existing : notificationRuleConfigsRepository.findAll()) {
            if (existing != null && StringUtils.hasText(safeText(existing.getRuleKey()))) {
                existingByKey.put(safeText(existing.getRuleKey()), existing);
            }
        }
        List<NotificationRuleConfig> missing = new ArrayList<>();
        List<NotificationRuleConfig> updated = new ArrayList<>();
        for (NotificationRuleConfig defaultRule : defaultRules()) {
            NotificationRuleConfig existing = existingByKey.get(safeText(defaultRule.getRuleKey()));
            if (existing == null) {
                missing.add(defaultRule);
            } else {
                boolean changed = mergeDefaultParameters(existing, defaultRule);
                changed = mergeDefaultScheduleSlots(existing, defaultRule) || changed;
                if (changed) {
                    updated.add(existing);
                }
            }
        }
        if (!missing.isEmpty()) {
            notificationRuleConfigsRepository.saveAll(missing);
        }
        if (!updated.isEmpty()) {
            notificationRuleConfigsRepository.saveAll(updated);
        }
    }

    private boolean mergeDefaultScheduleSlots(NotificationRuleConfig existing, NotificationRuleConfig defaultRule) {
        if (existing == null || defaultRule == null) {
            return false;
        }
        List<NotificationRuleConfig.ScheduleSlot> defaultSlots = defaultRule.getScheduleSlots() == null
                ? List.of()
                : defaultRule.getScheduleSlots();
        List<NotificationRuleConfig.ScheduleSlot> existingSlots = existing.getScheduleSlots() == null
                ? List.of()
                : existing.getScheduleSlots();
        if (!defaultSlots.isEmpty() && existingSlots.isEmpty()) {
            existing.setScheduleSlots(defaultSlots);
            return true;
        }
        if (!defaultSlots.isEmpty()
                && !existingSlots.isEmpty()
                && existingSlots.stream().allMatch(this::isGeneratedDefaultRunWindow)) {
            existing.setScheduleSlots(defaultSlots);
            return true;
        }
        if (!defaultSlots.isEmpty()) {
            return false;
        }
        if (existingSlots.isEmpty()) {
            return false;
        }
        existing.setScheduleSlots(List.of());
        return true;
    }

    private boolean isGeneratedDefaultRunWindow(NotificationRuleConfig.ScheduleSlot slot) {
        return slot != null
                && "run-window-default".equals(safeText(slot.getId()))
                && "daily".equals(safeText(slot.getFrequency()))
                && "09:00".equals(safeText(slot.getTime()))
                && !StringUtils.hasText(safeText(slot.getDate()))
                && valueOrDefault(slot.getDayOfWeek(), 1) == 1;
    }

    private boolean mergeDefaultParameters(NotificationRuleConfig existing, NotificationRuleConfig defaultRule) {
        if (defaultRule == null || defaultRule.getParameters() == null || defaultRule.getParameters().isEmpty()) {
            if (existing != null && existing.getParameters() != null && !existing.getParameters().isEmpty()) {
                existing.setParameters(List.of());
                return true;
            }
            return false;
        }
        Map<String, NotificationRuleConfig.ParameterField> existingByKey = new LinkedHashMap<>();
        List<NotificationRuleConfig.ParameterField> existingParameters = existing.getParameters() == null
                ? List.of()
                : existing.getParameters();
        boolean changed = false;
        for (NotificationRuleConfig.ParameterField field : existingParameters) {
            String key = safeText(field == null ? null : field.getKey());
            if (StringUtils.hasText(key)) {
                if (OBSOLETE_PARAMETER_KEYS.contains(key)) {
                    changed = true;
                    continue;
                }
                existingByKey.put(key, field);
            }
        }
        changed = changed || existingByKey.size() != existingParameters.size();
        List<NotificationRuleConfig.ParameterField> merged = new ArrayList<>();
        for (NotificationRuleConfig.ParameterField defaultField : defaultRule.getParameters()) {
            String key = safeText(defaultField == null ? null : defaultField.getKey());
            if (!StringUtils.hasText(key)) {
                continue;
            }
            NotificationRuleConfig.ParameterField existingField = existingByKey.remove(key);
            if (existingField == null) {
                merged.add(defaultField);
                changed = true;
                continue;
            }
            NotificationRuleConfig.ParameterField next = copyParameterDefinition(defaultField, existingField);
            merged.add(next);
            changed = changed || !safeText(existingField.getLabelKey()).equals(safeText(next.getLabelKey()));
        }
        merged.addAll(existingByKey.values());
        if (changed) {
            existing.setParameters(merged);
        }
        return changed;
    }

    private NotificationRuleConfig.ParameterField copyParameterDefinition(
            NotificationRuleConfig.ParameterField defaultField,
            NotificationRuleConfig.ParameterField valueField) {
        NotificationRuleConfig.ParameterField next = new NotificationRuleConfig.ParameterField();
        next.setKey(defaultField.getKey());
        next.setLabel(defaultField.getLabel());
        next.setLabelKey(defaultField.getLabelKey());
        next.setGroup(defaultField.getGroup());
        next.setGroupKey(defaultField.getGroupKey());
        next.setValueType(defaultField.getValueType());
        next.setNumberValue("number".equals(safeText(defaultField.getValueType()))
                ? valueOrDefault(valueField.getNumberValue(), valueOrDefault(defaultField.getNumberValue(), 0.0d))
                : null);
        next.setTextValue("text".equals(safeText(defaultField.getValueType()))
                ? firstNonBlank(valueField.getTextValue(), defaultField.getTextValue())
                : null);
        next.setUnit(defaultField.getUnit());
        next.setOptions(defaultField.getOptions());
        next.setStrategy(defaultField.getStrategy());
        next.setStrategyKey(defaultField.getStrategyKey());
        next.setReadOnly(Boolean.TRUE.equals(defaultField.getReadOnly()));
        return next;
    }

    private NotificationRuleConfig scheduledRule(
            String ruleKey,
            String label,
            String category,
            String actionKey,
            String description,
            int priority,
            boolean enabled,
            boolean manualRunEnabled,
            boolean emailEnabled,
            int intervalMinutes,
            String nowIso,
            List<NotificationRuleConfig.ParameterField> parameters) {
        NotificationRuleConfig rule = baseRule(ruleKey, nowIso);
        rule.setLabel(label);
        rule.setCategory(category);
        rule.setDescription(description);
        rule.setActionKey(actionKey);
        rule.setTriggerKind("scheduled_process");
        rule.setEnabled(enabled);
        rule.setManualRunEnabled(manualRunEnabled);
        rule.setAdminManageable(Boolean.TRUE);
        rule.setPriority(priority);
        NotificationRuleConfig.DeliveryChannels channels = new NotificationRuleConfig.DeliveryChannels();
        channels.setPushEnabled(false);
        channels.setEmailEnabled(emailEnabled);
        channels.setInAppEnabled(false);
        channels.setSupportChatEnabled(false);
        rule.setChannels(channels);
        NotificationRuleConfig.Timing timing = new NotificationRuleConfig.Timing();
        IntervalSpec interval = intervalSpec(null, null, null, intervalMinutes);
        timing.setMode("interval");
        timing.setIntervalMinutes(interval.minutes());
        timing.setIntervalSeconds(interval.seconds());
        timing.setIntervalAmount(interval.amount());
        timing.setIntervalUnit(interval.unit());
        timing.setCronExpression(toIntervalExpression(interval, defaultStartTime(ruleKey)));
        timing.setTime(defaultStartTime(ruleKey));
        timing.setTimezone("UTC");
        rule.setTiming(timing);
        NotificationRuleConfig.RunState runState = new NotificationRuleConfig.RunState();
        runState.setCurrentStatus(enabled ? "idle" : "suspended");
        runState.setProgressPercent(0);
        runState.setProgressDetail(enabled ? "Ready for the next scheduled slot." : "Suspended by default.");
        rule.setRunState(runState);
        rule.setParameters(parameters);
        return rule;
    }

    private String defaultStartTime(String ruleKey) {
        return switch (safeText(ruleKey)) {
            case RULE_EVENT_RANDOM_GROUPS -> "09:00";
            case "account-purge" -> "02:00";
            default -> "00:00";
        };
    }

    private List<NotificationRuleConfig.ParameterField> randomGroupParameters() {
        return List.of(
                numberParameter("jobs.process.randomGroups.minRoomSize", "Min room size", "Matched rooms", 2, ""),
                numberParameter("jobs.process.randomGroups.maxRoomSize", "Max room size", "Matched rooms", 4, ""));
    }

    private List<NotificationRuleConfig.ParameterField> autoInviterParameters() {
        return List.of(
                numberParameter("jobs.process.autoInviter.batchSize", "Invite batch size", "Auto inviter", 4, ""),
                numberParameter("jobs.process.autoInviter.responseWindowHours", "Response window", "Auto inviter", 2, "h"),
                numberParameter("jobs.process.autoInviter.candidateLookahead", "Candidate lookahead", "Auto inviter", 24, "h"));
    }

    private List<NotificationRuleConfig.ParameterField> tournamentReviewParameters() {
        return List.of(
                numberParameter("jobs.process.tournament.adminReminderHours", "Admin reminder", "Tournament", 2, "h"),
                numberParameter("jobs.process.tournament.scoreReviewHours", "Score review window", "Tournament", 2, "h"));
    }

    private NotificationRuleConfig.ParameterField numberParameter(
            String key,
            String label,
            String group,
            double numberValue,
            String unit) {
        NotificationRuleConfig.ParameterField field = new NotificationRuleConfig.ParameterField();
        field.setKey(key);
        field.setLabel(label);
        field.setLabelKey("admin.params.field." + safeText(key));
        field.setGroup(group);
        field.setGroupKey("admin.params.group." + i18nSegment(group));
        field.setValueType("number");
        field.setNumberValue(numberValue);
        field.setTextValue(null);
        field.setUnit(unit);
        field.setOptions(List.of());
        field.setStrategy("");
        field.setStrategyKey("");
        field.setReadOnly(false);
        return field;
    }

    private String i18nSegment(String value) {
        return safeText(value)
                .replaceAll("([a-z0-9])([A-Z])", "$1.$2")
                .replaceAll("[^a-zA-Z0-9]+", ".")
                .replaceAll("^\\.+|\\.+$", "")
                .toLowerCase();
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
        target.setAdminManageable(resolveAdminManageable(source, target));
        target.setPriority(valueOrDefault(source.getPriority(), valueOrDefault(target.getPriority(), 1000)));
        target.setChannels(normalizeChannels(source.getChannels()));
        target.setTiming(normalizeTiming(source.getTiming(), source.getTriggerKind()));
        target.setScheduleSlots(normalizeScheduleSlots(source.getScheduleSlots(), target.getTiming()));
        if (source.getParameters() != null && !source.getParameters().isEmpty()) {
            target.setParameters(normalizeParameters(source.getParameters()));
        }
        target.setMessage(normalizeMessage(source.getMessage()));
    }

    private List<NotificationRuleConfig.ParameterField> normalizeParameters(List<NotificationRuleConfig.ParameterField> source) {
        List<NotificationRuleConfig.ParameterField> fields = new ArrayList<>();
        for (NotificationRuleConfig.ParameterField field : source == null ? List.<NotificationRuleConfig.ParameterField>of() : source) {
            if (field == null) {
                continue;
            }
            String key = safeText(field.getKey());
            if (!StringUtils.hasText(key)) {
                continue;
            }
            NotificationRuleConfig.ParameterField normalized = new NotificationRuleConfig.ParameterField();
            normalized.setKey(key);
            normalized.setLabel(firstNonBlank(field.getLabel(), key));
            normalized.setLabelKey(firstNonBlank(field.getLabelKey(), "admin.params.field." + key));
            normalized.setGroup(firstNonBlank(field.getGroup(), "General"));
            normalized.setGroupKey(firstNonBlank(field.getGroupKey(), "admin.params.group." + i18nSegment(field.getGroup())));
            String valueType = "text".equals(safeText(field.getValueType())) ? "text" : "number";
            normalized.setValueType(valueType);
            normalized.setNumberValue("number".equals(valueType) ? valueOrDefault(field.getNumberValue(), 0.0d) : null);
            normalized.setTextValue("text".equals(valueType) ? safeText(field.getTextValue()) : null);
            normalized.setUnit(safeText(field.getUnit()));
            normalized.setOptions(field.getOptions() == null ? List.of() : field.getOptions());
            normalized.setStrategy(safeText(field.getStrategy()));
            normalized.setStrategyKey(safeText(field.getStrategyKey()));
            normalized.setReadOnly(Boolean.TRUE.equals(field.getReadOnly()));
            fields.add(normalized);
        }
        return fields;
    }

    private NotificationRuleConfig.DeliveryChannels normalizeChannels(NotificationRuleConfig.DeliveryChannels source) {
        NotificationRuleConfig.DeliveryChannels channels = new NotificationRuleConfig.DeliveryChannels();
        channels.setPushEnabled(Boolean.TRUE.equals(source == null ? null : source.getPushEnabled()));
        channels.setEmailEnabled(Boolean.TRUE.equals(source == null ? null : source.getEmailEnabled()));
        channels.setInAppEnabled(Boolean.TRUE.equals(source == null ? null : source.getInAppEnabled()));
        channels.setSupportChatEnabled(Boolean.TRUE.equals(source == null ? null : source.getSupportChatEnabled()));
        return channels;
    }

    private Boolean resolveAdminManageable(NotificationRuleConfig source, NotificationRuleConfig target) {
        if (source != null && source.getAdminManageable() != null) {
            return Boolean.TRUE.equals(source.getAdminManageable());
        }
        if (target != null && target.getAdminManageable() != null) {
            return Boolean.TRUE.equals(target.getAdminManageable());
        }
        String ruleKey = safeText(source == null ? null : source.getRuleKey());
        if (!StringUtils.hasText(ruleKey)) {
            ruleKey = safeText(target == null ? null : target.getRuleKey());
        }
        return SCHEDULED_EVENT_RULES.contains(ruleKey);
    }

    private NotificationRuleConfig.Timing normalizeTiming(NotificationRuleConfig.Timing source, String triggerKind) {
        NotificationRuleConfig.Timing timing = new NotificationRuleConfig.Timing();
        String mode = safeText(source == null ? null : source.getMode()).toLowerCase();
        if (!Set.of("immediate", "delay", "interval", "yearly", "manual").contains(mode)) {
            mode = "scheduled_process".equals(safeText(triggerKind)) ? "interval" : "immediate";
        }
        timing.setMode(mode);
        timing.setDelayMinutes(Math.max(0, valueOrDefault(source == null ? null : source.getDelayMinutes(), 0)));
        IntervalSpec interval = intervalSpec(
                source == null ? null : source.getIntervalAmount(),
                source == null ? null : source.getIntervalUnit(),
                source == null ? null : source.getIntervalSeconds(),
                source == null ? null : source.getIntervalMinutes());
        timing.setIntervalMinutes(interval.minutes());
        timing.setIntervalSeconds(interval.seconds());
        timing.setIntervalAmount(interval.amount());
        timing.setIntervalUnit(interval.unit());
        timing.setMonth(clamp(valueOrDefault(source == null ? null : source.getMonth(), 1), 1, 12));
        timing.setDayOfMonth(clamp(valueOrDefault(source == null ? null : source.getDayOfMonth(), 1), 1, 31));
        timing.setTime(normalizeTime(source == null ? null : source.getTime()));
        timing.setTimezone(firstNonBlank(source == null ? null : source.getTimezone(), "UTC"));
        timing.setCronExpression(firstNonBlank(
                source == null ? null : source.getCronExpression(),
                toIntervalExpression(interval, timing.getTime())));
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

    private List<NotificationRuleConfig.ScheduleSlot> normalizeScheduleSlots(
            List<NotificationRuleConfig.ScheduleSlot> source,
            NotificationRuleConfig.Timing fallbackTiming) {
        List<NotificationRuleConfig.ScheduleSlot> slots = new ArrayList<>();
        if (source != null) {
            int index = 0;
            for (NotificationRuleConfig.ScheduleSlot item : source) {
                if (item == null) {
                    continue;
                }
                NotificationRuleConfig.ScheduleSlot slot = new NotificationRuleConfig.ScheduleSlot();
                String frequency = normalizeFrequency(item.getFrequency());
                slot.setId(firstNonBlank(item.getId(), "run-window-" + (++index)));
                slot.setFrequency(frequency);
                slot.setDate(safeText(item.getDate()));
                slot.setDayOfWeek(clamp(valueOrDefault(item.getDayOfWeek(), 1), 1, 7));
                slot.setTime(normalizeTime(item.getTime()));
                slot.setTimezone(firstNonBlank(item.getTimezone(), "UTC"));
                slot.setCronExpression(firstNonBlank(item.getCronExpression(), toSlotCron(slot)));
                slot.setActionKey(safeText(item.getActionKey()));
                slot.setEnabled(!Boolean.FALSE.equals(item.getEnabled()));
                slots.add(slot);
            }
        }
        if (slots.isEmpty() && usesFallbackRunWindow(fallbackTiming)) {
            NotificationRuleConfig.ScheduleSlot slot = new NotificationRuleConfig.ScheduleSlot();
            slot.setId("run-window-default");
            slot.setFrequency("daily");
            slot.setDate("");
            slot.setDayOfWeek(1);
            slot.setTime(normalizeTime(fallbackTiming.getTime()));
            slot.setTimezone(firstNonBlank(fallbackTiming.getTimezone(), "UTC"));
            slot.setCronExpression(toSlotCron(slot));
            slot.setActionKey("");
            slot.setEnabled(true);
            slots.add(slot);
        }
        return slots;
    }

    private boolean usesFallbackRunWindow(NotificationRuleConfig.Timing timing) {
        if (timing == null) {
            return false;
        }
        String mode = safeText(timing.getMode()).toLowerCase();
        return !"interval".equals(mode) && !"yearly".equals(mode) && !"manual".equals(mode);
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

    private Instant slotOccurrence(NotificationRuleConfig.ScheduleSlot slot, Instant now) {
        if (slot == null || Boolean.FALSE.equals(slot.getEnabled())) {
            return null;
        }
        try {
            ZoneId zoneId = ZoneId.of(firstNonBlank(slot.getTimezone(), "UTC"));
            ZonedDateTime zonedNow = now.atZone(zoneId);
            LocalTime time = LocalTime.parse(normalizeTime(slot.getTime()));
            String frequency = normalizeFrequency(slot.getFrequency());
            if ("one-time".equals(frequency)) {
                LocalDate date = parseLocalDate(slot.getDate());
                return date == null ? null : ZonedDateTime.of(date, time, zoneId).toInstant();
            }
            if ("weekly".equals(frequency)) {
                int dayOfWeek = clamp(valueOrDefault(slot.getDayOfWeek(), 1), 1, 7);
                LocalDate date = zonedNow.toLocalDate().with(DayOfWeek.of(dayOfWeek));
                ZonedDateTime occurrence = ZonedDateTime.of(date, time, zoneId);
                if (occurrence.isAfter(zonedNow)) {
                    occurrence = occurrence.minusWeeks(1);
                }
                return occurrence.toInstant();
            }
            if ("bi-weekly".equals(frequency)) {
                int dayOfWeek = clamp(valueOrDefault(slot.getDayOfWeek(), 1), 1, 7);
                LocalDate anchor = parseLocalDate(slot.getDate());
                if (anchor == null) {
                    anchor = LocalDate.of(2026, 1, 5);
                }
                LocalDate date = zonedNow.toLocalDate().with(DayOfWeek.of(dayOfWeek));
                ZonedDateTime occurrence = ZonedDateTime.of(date, time, zoneId);
                if (occurrence.isAfter(zonedNow)) {
                    occurrence = occurrence.minusWeeks(1);
                }
                if (Math.floorMod(ChronoUnit.WEEKS.between(anchor.with(DayOfWeek.of(dayOfWeek)), occurrence.toLocalDate()), 2) != 0) {
                    occurrence = occurrence.minusWeeks(1);
                }
                return occurrence.toInstant();
            }
            if ("monthly".equals(frequency)) {
                int dayOfMonth = parseLocalDate(slot.getDate()) == null ? 1 : parseLocalDate(slot.getDate()).getDayOfMonth();
                LocalDate date = safeDate(zonedNow.getYear(), zonedNow.getMonthValue(), dayOfMonth);
                ZonedDateTime occurrence = ZonedDateTime.of(date, time, zoneId);
                if (occurrence.isAfter(zonedNow)) {
                    ZonedDateTime previousMonth = zonedNow.minusMonths(1);
                    occurrence = ZonedDateTime.of(safeDate(previousMonth.getYear(), previousMonth.getMonthValue(), dayOfMonth), time, zoneId);
                }
                return occurrence.toInstant();
            }
            if ("yearly".equals(frequency)) {
                LocalDate parsedDate = parseLocalDate(slot.getDate());
                int month = parsedDate == null ? 1 : parsedDate.getMonthValue();
                int dayOfMonth = parsedDate == null ? 1 : parsedDate.getDayOfMonth();
                LocalDate date = safeDate(zonedNow.getYear(), month, dayOfMonth);
                ZonedDateTime occurrence = ZonedDateTime.of(date, time, zoneId);
                if (occurrence.isAfter(zonedNow)) {
                    occurrence = ZonedDateTime.of(safeDate(zonedNow.getYear() - 1, month, dayOfMonth), time, zoneId);
                }
                return occurrence.toInstant();
            }
            ZonedDateTime occurrence = ZonedDateTime.of(zonedNow.toLocalDate(), time, zoneId);
            if (occurrence.isAfter(zonedNow)) {
                occurrence = occurrence.minusDays(1);
            }
            return occurrence.toInstant();
        } catch (Exception exception) {
            return null;
        }
    }

    private boolean isIntervalDue(NotificationRuleConfig.Timing timing, Instant lastRunAt, Instant now) {
        ZoneId zoneId;
        ZonedDateTime zonedNow;
        try {
            zoneId = ZoneId.of(firstNonBlank(timing == null ? null : timing.getTimezone(), "UTC"));
            zonedNow = now.atZone(zoneId);
            LocalTime startTime = LocalTime.parse(normalizeTime(timing == null ? null : timing.getTime()));
            if (zonedNow.toLocalTime().isBefore(startTime)) {
                return false;
            }
        } catch (DateTimeException exception) {
            return false;
        }
        if (lastRunAt == null) {
            return true;
        }
        IntervalSpec interval = intervalSpec(timing);
        ZonedDateTime due = plusInterval(lastRunAt.atZone(zoneId), interval);
        return !zonedNow.isBefore(due);
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

    private void appendRunHistory(
            NotificationRuleConfig rule,
            String startedAtIso,
            String finishedAtIso,
            long durationMillis,
            int processedCount,
            String status,
            String detail,
            String actorUserId) {
        List<NotificationRuleConfig.RunHistoryEntry> history = new ArrayList<>();
        NotificationRuleConfig.RunHistoryEntry entry = new NotificationRuleConfig.RunHistoryEntry();
        entry.setId(UUID.randomUUID().toString());
        entry.setTrigger("scheduler".equals(safeText(actorUserId)) ? "scheduled" : "manual");
        entry.setRunnerUser(firstNonBlank(actorUserId, SYSTEM_USER));
        entry.setStartedAtIso(startedAtIso);
        entry.setFinishedAtIso(finishedAtIso);
        entry.setDurationMillis(durationMillis);
        entry.setProcessedCount(Math.max(0, processedCount));
        entry.setStatus(firstNonBlank(status, "completed"));
        entry.setDetail(safeText(detail));
        history.add(entry);
        if (rule.getRunHistory() != null) {
            history.addAll(rule.getRunHistory().stream()
                    .filter(existing -> existing != null && StringUtils.hasText(safeText(existing.getId())))
                    .limit(RUN_HISTORY_LIMIT - 1L)
                    .toList());
        }
        rule.setRunHistory(history);
    }

    private IntervalSpec intervalSpec(NotificationRuleConfig.Timing timing) {
        return intervalSpec(
                timing == null ? null : timing.getIntervalAmount(),
                timing == null ? null : timing.getIntervalUnit(),
                timing == null ? null : timing.getIntervalSeconds(),
                timing == null ? null : timing.getIntervalMinutes());
    }

    private IntervalSpec intervalSpec(Integer amountValue, String unitValue, Integer secondsValue, Integer minutesValue) {
        int amount = Math.max(1, valueOrDefault(amountValue, 0));
        String unit = normalizeIntervalUnit(unitValue);
        if (valueOrDefault(amountValue, 0) > 0 && StringUtils.hasText(unit)) {
            int seconds = Math.max(1, amount * intervalUnitSeconds(unit));
            return new IntervalSpec(amount, unit, seconds, Math.max(1, (int) Math.ceil(seconds / 60.0d)));
        }
        int fallbackMinutes = intervalMinutesFromValues(secondsValue, minutesValue);
        int seconds = Math.max(1, valueOrDefault(secondsValue, fallbackMinutes * 60));
        String fallbackUnit = fixedIntervalUnit(seconds);
        int fallbackAmount = Math.max(1, seconds / intervalUnitSeconds(fallbackUnit));
        return new IntervalSpec(fallbackAmount, fallbackUnit, seconds, Math.max(1, (int) Math.ceil(seconds / 60.0d)));
    }

    private int intervalMinutesFromValues(Integer secondsValue, Integer minutesValue) {
        if (secondsValue != null && secondsValue > 0) {
            return Math.max(1, (int) Math.ceil(secondsValue / 60.0d));
        }
        return Math.max(1, valueOrDefault(minutesValue, 60));
    }

    private String normalizeIntervalUnit(String value) {
        return switch (safeText(value)) {
            case INTERVAL_UNIT_SECONDS,
                    INTERVAL_UNIT_MINUTES,
                    INTERVAL_UNIT_HOURS,
                    INTERVAL_UNIT_DAYS,
                    INTERVAL_UNIT_WEEKS,
                    INTERVAL_UNIT_MONTHS,
                    INTERVAL_UNIT_YEARS -> safeText(value);
            default -> "";
        };
    }

    private int intervalUnitSeconds(String unit) {
        return switch (normalizeIntervalUnit(unit)) {
            case INTERVAL_UNIT_SECONDS -> 1;
            case INTERVAL_UNIT_MINUTES -> 60;
            case INTERVAL_UNIT_HOURS -> 3600;
            case INTERVAL_UNIT_DAYS -> 86400;
            case INTERVAL_UNIT_WEEKS -> 604800;
            case INTERVAL_UNIT_MONTHS -> 2592000;
            case INTERVAL_UNIT_YEARS -> 31536000;
            default -> 60;
        };
    }

    private String fixedIntervalUnit(int seconds) {
        int value = Math.max(1, seconds);
        if (value % intervalUnitSeconds(INTERVAL_UNIT_YEARS) == 0) {
            return INTERVAL_UNIT_YEARS;
        }
        if (value % intervalUnitSeconds(INTERVAL_UNIT_MONTHS) == 0) {
            return INTERVAL_UNIT_MONTHS;
        }
        if (value % intervalUnitSeconds(INTERVAL_UNIT_WEEKS) == 0) {
            return INTERVAL_UNIT_WEEKS;
        }
        if (value % intervalUnitSeconds(INTERVAL_UNIT_DAYS) == 0) {
            return INTERVAL_UNIT_DAYS;
        }
        if (value % intervalUnitSeconds(INTERVAL_UNIT_HOURS) == 0) {
            return INTERVAL_UNIT_HOURS;
        }
        if (value % intervalUnitSeconds(INTERVAL_UNIT_MINUTES) == 0) {
            return INTERVAL_UNIT_MINUTES;
        }
        return INTERVAL_UNIT_SECONDS;
    }

    private ZonedDateTime plusInterval(ZonedDateTime base, IntervalSpec interval) {
        int amount = Math.max(1, interval == null ? 1 : interval.amount());
        return switch (interval == null ? INTERVAL_UNIT_MINUTES : normalizeIntervalUnit(interval.unit())) {
            case INTERVAL_UNIT_SECONDS -> base.plusSeconds(amount);
            case INTERVAL_UNIT_MINUTES -> base.plusMinutes(amount);
            case INTERVAL_UNIT_HOURS -> base.plusHours(amount);
            case INTERVAL_UNIT_DAYS -> base.plusDays(amount);
            case INTERVAL_UNIT_WEEKS -> base.plusWeeks(amount);
            case INTERVAL_UNIT_MONTHS -> base.plusMonths(amount);
            case INTERVAL_UNIT_YEARS -> base.plusYears(amount);
            default -> base.plusMinutes(amount);
        };
    }

    private String toIntervalExpression(IntervalSpec interval, String time) {
        int amount = Math.max(1, interval == null ? 60 : interval.amount());
        String unit = interval == null ? INTERVAL_UNIT_MINUTES : normalizeIntervalUnit(interval.unit());
        String[] timeParts = normalizeTime(time).split(":");
        int hour = Integer.parseInt(timeParts[0]);
        int minute = Integer.parseInt(timeParts[1]);
        return switch (unit) {
            case INTERVAL_UNIT_SECONDS -> "0/" + amount + " * * * * ?";
            case INTERVAL_UNIT_MINUTES -> "0 0/" + amount + " * * * ?";
            case INTERVAL_UNIT_HOURS -> "0 " + minute + " 0/" + amount + " * * ?";
            case INTERVAL_UNIT_DAYS -> "0 " + minute + " " + hour + " 1/" + amount + " * ?";
            default -> "@every " + amount + " " + unit + " @ " + normalizeTime(time);
        };
    }

    private String toSlotCron(NotificationRuleConfig.ScheduleSlot slot) {
        String[] timeParts = normalizeTime(slot == null ? null : slot.getTime()).split(":");
        int hour = Integer.parseInt(timeParts[0]);
        int minute = Integer.parseInt(timeParts[1]);
        String frequency = normalizeFrequency(slot == null ? null : slot.getFrequency());
        if ("one-time".equals(frequency)) {
            LocalDate date = parseLocalDate(slot == null ? null : slot.getDate());
            if (date == null) {
                return "0 " + minute + " " + hour + " * * ?";
            }
            return "0 " + minute + " " + hour + " " + date.getDayOfMonth() + " " + date.getMonthValue() + " ?";
        }
        if ("weekly".equals(frequency)) {
            int quartzDay = (clamp(valueOrDefault(slot == null ? null : slot.getDayOfWeek(), 1), 1, 7) % 7) + 1;
            return "0 " + minute + " " + hour + " ? * " + quartzDay;
        }
        if ("bi-weekly".equals(frequency)) {
            int quartzDay = (clamp(valueOrDefault(slot == null ? null : slot.getDayOfWeek(), 1), 1, 7) % 7) + 1;
            return "0 " + minute + " " + hour + " ? * " + quartzDay;
        }
        if ("monthly".equals(frequency)) {
            LocalDate date = parseLocalDate(slot == null ? null : slot.getDate());
            int dayOfMonth = date == null ? 1 : date.getDayOfMonth();
            return "0 " + minute + " " + hour + " " + dayOfMonth + " * ?";
        }
        if ("yearly".equals(frequency)) {
            LocalDate date = parseLocalDate(slot == null ? null : slot.getDate());
            int month = date == null ? 1 : date.getMonthValue();
            int dayOfMonth = date == null ? 1 : date.getDayOfMonth();
            return "0 " + minute + " " + hour + " " + dayOfMonth + " " + month + " ?";
        }
        return "0 " + minute + " " + hour + " * * ?";
    }

    private LocalDate parseLocalDate(String value) {
        try {
            return StringUtils.hasText(safeText(value)) ? LocalDate.parse(safeText(value)) : null;
        } catch (Exception exception) {
            return null;
        }
    }

    private String normalizeFrequency(String value) {
        String normalized = safeText(value).toLowerCase();
        return Set.of("one-time", "daily", "weekly", "bi-weekly", "monthly", "yearly").contains(normalized) ? normalized : "daily";
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

    private double valueOrDefault(Double value, double fallback) {
        return value == null || !Double.isFinite(value) ? fallback : value.doubleValue();
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
