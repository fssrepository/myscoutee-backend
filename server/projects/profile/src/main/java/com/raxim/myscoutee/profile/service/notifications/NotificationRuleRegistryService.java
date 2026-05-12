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

    private static final String SYSTEM_USER = "notification-registry";
    private static final int RUN_HISTORY_LIMIT = 12;
    private static final Set<String> SCHEDULED_EVENT_RULES = Set.of(
            RULE_EVENT_RANDOM_GROUPS);

    private final NotificationRuleConfigsRepository notificationRuleConfigsRepository;
    private final AdminNotificationSocketSessionRegistry socketSessionRegistry;

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
            int intervalMinutes = intervalMinutes(timing);
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
                        "Matched rooms",
                        "Scheduled",
                        "event.scheduler.random-groups",
                        "Assigns accepted event members into generated rooms using affinity and prior-meeting signals.",
                        200,
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
        rule.setAdminManageable(Boolean.TRUE);
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
        timing.setCronExpression(toIntervalCron(intervalMinutes));
        timing.setTimezone("UTC");
        rule.setTiming(timing);
        NotificationRuleConfig.RunState runState = new NotificationRuleConfig.RunState();
        runState.setCurrentStatus(enabled ? "idle" : "suspended");
        runState.setProgressPercent(0);
        runState.setProgressDetail(enabled ? "Ready for the next scheduled slot." : "Suspended by default.");
        rule.setRunState(runState);
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
        target.setAdminManageable(resolveAdminManageable(source, target));
        target.setPriority(valueOrDefault(source.getPriority(), valueOrDefault(target.getPriority(), 1000)));
        target.setChannels(normalizeChannels(source.getChannels()));
        target.setTiming(normalizeTiming(source.getTiming(), source.getTriggerKind()));
        target.setScheduleSlots(normalizeScheduleSlots(source.getScheduleSlots(), target.getTiming()));
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
        timing.setIntervalMinutes(Math.max(1, valueOrDefault(source == null ? null : source.getIntervalMinutes(), 60)));
        timing.setMonth(clamp(valueOrDefault(source == null ? null : source.getMonth(), 1), 1, 12));
        timing.setDayOfMonth(clamp(valueOrDefault(source == null ? null : source.getDayOfMonth(), 1), 1, 31));
        timing.setTime(normalizeTime(source == null ? null : source.getTime()));
        timing.setTimezone(firstNonBlank(source == null ? null : source.getTimezone(), "UTC"));
        timing.setCronExpression(firstNonBlank(
                source == null ? null : source.getCronExpression(),
                toIntervalCron(timing.getIntervalMinutes())));
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
        if (slots.isEmpty() && fallbackTiming != null) {
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

    private int intervalMinutes(NotificationRuleConfig.Timing timing) {
        String cron = safeText(timing == null ? null : timing.getCronExpression());
        if (cron.matches("^0\\s+0/\\d+\\s+\\*\\s+\\*\\s+\\*\\s+\\?$")) {
            String value = cron.split("\\s+")[1].substring(2);
            try {
                return Math.max(1, Integer.parseInt(value));
            } catch (NumberFormatException exception) {
                return Math.max(1, valueOrDefault(timing == null ? null : timing.getIntervalMinutes(), 60));
            }
        }
        return Math.max(1, valueOrDefault(timing == null ? null : timing.getIntervalMinutes(), 60));
    }

    private String toIntervalCron(Integer intervalMinutes) {
        return "0 0/" + Math.max(1, valueOrDefault(intervalMinutes, 60)) + " * * * ?";
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

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
