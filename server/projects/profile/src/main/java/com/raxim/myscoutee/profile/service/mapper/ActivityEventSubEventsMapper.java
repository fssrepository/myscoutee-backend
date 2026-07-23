package com.raxim.myscoutee.profile.service.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsSlotPage;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsSlotDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventStageRuntimeStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventResourceMetricDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionEntryDto;

@Component
public class ActivityEventSubEventsMapper {
    public List<EventSubEventsSlotDto> toSlotDtos(
            String parentEventId,
            ActivityEvent parentRecord,
            EventSubEventsQueryDto query) {
        return toSlotPage(parentEventId, parentRecord, query).slots();
    }

    public EventSubEventsSlotPage toSlotPage(
            String parentEventId,
            ActivityEvent parentRecord,
            EventSubEventsQueryDto query) {
        String normalizedParentEventId = normalizeId(parentEventId);
        int direction = "past".equalsIgnoreCase(safeText(query == null ? null : query.order())) ? -1 : 1;
        long nowMs = System.currentTimeMillis();
        if (parentRecord != null
                && !isGeneratedSlotRecord(parentRecord)
                && !Boolean.FALSE.equals(parentRecord.getSubEventsEnabled())
                && Boolean.TRUE.equals(parentRecord.getSlotsEnabled())
                && parentRecord.getSlotTemplates() != null
                && !parentRecord.getSlotTemplates().isEmpty()) {
            return templateSlotPage(normalizedParentEventId, parentRecord, query, nowMs, direction);
        }
        List<EventSubEventsSlotDto> slots = subEventsSlotSources(normalizedParentEventId, parentRecord, query, nowMs).stream()
                .filter(source -> source.definitions() != null && !source.definitions().isEmpty())
                .filter(source -> slotSourceMatchesOrder(source, query, nowMs))
                .filter(source -> slotSourceOverlapsRange(source, query))
                .sorted((left, right) -> direction * Long.compare(toSortableDate(left.startAt()), toSortableDate(right.startAt())))
                .map(this::toSlotDto)
                .toList();
        return slicePage(slots, query);
    }

    private EventSubEventsSlotPage slicePage(List<EventSubEventsSlotDto> slots, EventSubEventsQueryDto query) {
        int pageSize = pageSize(query);
        int offset = Math.min(slots.size(), pageOffset(query, pageSize));
        int end = Math.min(slots.size(), offset + pageSize);
        return new EventSubEventsSlotPage(
                slots.subList(offset, end),
                slots.size(),
                end < slots.size() ? Integer.toString(end) : null);
    }

    private EventSubEventsSlotPage templateSlotPage(
            String parentEventId,
            ActivityEvent parent,
            EventSubEventsQueryDto query,
            long nowMs,
            int direction) {
        LocalDateTime parentStart = toLocalDateTime(parent.getStartAtIso());
        LocalDateTime parentEnd = toLocalDateTime(parent.getEndAtIso());
        if (parentStart == null || parentEnd == null || parentEnd.isBefore(parentStart)) {
            return new EventSubEventsSlotPage(List.of(), 0, null);
        }
        List<EventSlotTemplateDto> templates = parent.getSlotTemplates();
        Set<LocalDate> overrideDates = templates.stream()
                .map(template -> slotOverrideDateKey(template == null ? null : template.overrideDate()))
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        List<OccurrencePlan> plans = new ArrayList<>();
        List<SubEventsSlotSource> overrides = new ArrayList<>();
        LocalDateTime now = toUtcDateTime(nowMs);

        for (EventSlotTemplateDto template : templates) {
            if (template == null || Boolean.TRUE.equals(template.closed())) {
                continue;
            }
            LocalDateTime templateStart = toLocalDateTime(template.startAt());
            List<SubEventDefinitionDto> definitions = slotTemplateSubEventDefinitions(parent, template);
            if (templateStart == null || definitions.isEmpty()) {
                continue;
            }
            long duration = subEventDefinitionsDurationMinutes(definitions);
            if (slotOverrideDateKey(template.overrideDate()) != null) {
                LocalDateTime end = templateStart.plusMinutes(duration);
                SubEventsSlotSource source = templateSlotSource(parentEventId, parent, template, definitions, templateStart, end);
                if (!templateStart.isBefore(parentStart)
                        && !end.isAfter(parentEnd)
                        && slotSourceMatchesOrder(source, query, nowMs)
                        && slotSourceOverlapsRange(source, query)) {
                    overrides.add(source);
                }
                continue;
            }
            LocalDateTime lower = parentStart;
            LocalDateTime upper = parentEnd.minusMinutes(Math.max(0L, duration));
            LocalDateTime rangeStart = queryRangeStart(query);
            LocalDateTime rangeEnd = queryRangeEnd(query);
            if (rangeStart != null) {
                lower = maxDateTime(lower, rangeStart.minusMinutes(Math.max(0L, duration)));
            }
            if (rangeEnd != null) {
                upper = minDateTime(upper, rangeEnd);
            }
            boolean past = "past".equalsIgnoreCase(safeText(query == null ? null : query.order()));
            if (past) {
                upper = minDateTime(upper, now.minusMinutes(Math.max(0L, duration)));
            } else {
                lower = maxDateTime(lower, now.minusMinutes(Math.max(0L, duration)).plusNanos(1L));
            }
            if (upper.isBefore(lower)) {
                continue;
            }
            String frequency = normalizedFrequency(parent.getFrequency());
            long first = indexAtOrAfter(frequency, templateStart, lower);
            long last = indexAtOrBefore(frequency, templateStart, upper);
            if (last >= first && (allowsOccurrencesBeforeTemplate(frequency) || last >= 0L)) {
                plans.add(new OccurrencePlan(
                        template, definitions, duration, frequency, templateStart, parentStart, first, last, overrideDates));
            }
        }

        long totalLong = overrides.size();
        for (OccurrencePlan plan : plans) {
            totalLong += validCount(plan);
        }
        int total = (int) Math.min(Integer.MAX_VALUE, totalLong);
        int pageSize = pageSize(query);
        int offset = Math.min(total, pageOffset(query, pageSize));
        Comparator<OccurrenceCursor> comparator = Comparator
                .comparing(OccurrenceCursor::start)
                .thenComparing(cursor -> safeText(cursor.plan() == null ? null : cursor.plan().template().id()));
        if (direction < 0) {
            comparator = comparator.reversed();
        }
        PriorityQueue<OccurrenceCursor> queue = new PriorityQueue<>(comparator);
        for (OccurrencePlan plan : plans) {
            OccurrenceCursor cursor = validCursor(plan, direction < 0 ? plan.last() : plan.first(), direction);
            if (cursor != null) {
                queue.add(cursor);
            }
        }
        for (SubEventsSlotSource source : overrides) {
            LocalDateTime start = toLocalDateTime(source.startAt());
            if (start != null) {
                queue.add(new OccurrenceCursor(null, 0L, start, source));
            }
        }

        List<EventSubEventsSlotDto> page = new ArrayList<>(pageSize);
        int position = 0;
        while (!queue.isEmpty() && page.size() < pageSize) {
            OccurrenceCursor cursor = queue.poll();
            if (position++ >= offset) {
                SubEventsSlotSource source = cursor.source() != null
                        ? cursor.source()
                        : templateSlotSource(
                                parentEventId,
                                parent,
                                cursor.plan().template(),
                                cursor.plan().definitions(),
                                cursor.start(),
                                cursor.start().plusMinutes(cursor.plan().duration()));
                page.add(toSlotDto(source));
            }
            if (cursor.plan() != null) {
                OccurrenceCursor next = validCursor(cursor.plan(), cursor.index() + direction, direction);
                if (next != null) {
                    queue.add(next);
                }
            }
        }
        int nextOffset = offset + page.size();
        return new EventSubEventsSlotPage(page, total, nextOffset < total ? Integer.toString(nextOffset) : null);
    }

    private OccurrenceCursor validCursor(OccurrencePlan plan, long index, int direction) {
        long current = index;
        while (current >= plan.first() && current <= plan.last()) {
            LocalDateTime start = occurrenceAt(plan.frequency(), plan.templateStart(), current);
            LocalDate key = slotOccurrenceAnchorDateKey(start, plan.templateStart(), plan.parentStart());
            if (key == null || !plan.overrideDates().contains(key)) {
                return new OccurrenceCursor(plan, current, start, null);
            }
            current += direction;
        }
        return null;
    }

    private long validCount(OccurrencePlan plan) {
        long count = plan.last() - plan.first() + 1L;
        if (plan.overrideDates().isEmpty()) {
            return count;
        }
        Set<Long> removed = new LinkedHashSet<>();
        long offsetMinutes = ChronoUnit.MINUTES.between(plan.parentStart(), plan.templateStart());
        for (LocalDate overrideDate : plan.overrideDates()) {
            LocalDateTime target = overrideDate.atTime(plan.parentStart().toLocalTime()).plusMinutes(offsetMinutes);
            long candidate = indexAtOrAfter(plan.frequency(), plan.templateStart(), target.minusDays(2));
            for (long index = Math.max(plan.first(), candidate - 2L);
                    index <= Math.min(plan.last(), candidate + 4L);
                    index += 1L) {
                LocalDateTime start = occurrenceAt(plan.frequency(), plan.templateStart(), index);
                if (overrideDate.equals(slotOccurrenceAnchorDateKey(start, plan.templateStart(), plan.parentStart()))) {
                    removed.add(index);
                }
            }
        }
        return Math.max(0L, count - removed.size());
    }

    private String normalizedFrequency(String value) {
        String frequency = safeText(value).toLowerCase();
        return !StringUtils.hasText(frequency) || "custom".equals(frequency) ? "one-time" : frequency;
    }

    private long indexAtOrAfter(String frequency, LocalDateTime start, LocalDateTime target) {
        if (isOneTime(frequency)) {
            return target == null || !target.isAfter(start) ? 0L : 1L;
        }
        long index = approximateIndex(frequency, start, target);
        long minimum = allowsOccurrencesBeforeTemplate(frequency) ? Long.MIN_VALUE : 0L;
        while (index > minimum && !occurrenceAt(frequency, start, index - 1L).isBefore(target)) {
            index -= 1L;
        }
        while (occurrenceAt(frequency, start, index).isBefore(target)) {
            index += 1L;
        }
        return index;
    }

    private long indexAtOrBefore(String frequency, LocalDateTime start, LocalDateTime target) {
        if (isOneTime(frequency)) {
            return target != null && !target.isBefore(start) ? 0L : -1L;
        }
        if (target == null || (!allowsOccurrencesBeforeTemplate(frequency) && target.isBefore(start))) {
            return -1L;
        }
        long index = approximateIndex(frequency, start, target);
        long minimum = allowsOccurrencesBeforeTemplate(frequency) ? Long.MIN_VALUE : 0L;
        while (index > minimum && occurrenceAt(frequency, start, index).isAfter(target)) {
            index -= 1L;
        }
        while (!occurrenceAt(frequency, start, index + 1L).isAfter(target)) {
            index += 1L;
        }
        return occurrenceAt(frequency, start, index).isAfter(target) ? -1L : index;
    }

    private long approximateIndex(String frequency, LocalDateTime start, LocalDateTime target) {
        if (target == null) {
            return 0L;
        }
        long days = ChronoUnit.DAYS.between(start.toLocalDate(), target.toLocalDate());
        if ("daily".equals(frequency)) return days;
        if ("weekly".equals(frequency)) return Math.floorDiv(days, 7L);
        if ("bi-weekly".equals(frequency) || "biweekly".equals(frequency)) return Math.max(0L, Math.floorDiv(days, 14L));
        if ("monthly".equals(frequency)) {
            return ChronoUnit.MONTHS.between(java.time.YearMonth.from(start), java.time.YearMonth.from(target));
        }
        return target.getYear() - start.getYear();
    }

    private LocalDateTime occurrenceAt(String frequency, LocalDateTime start, long index) {
        if ("daily".equals(frequency)) return start.plusDays(index);
        if ("weekly".equals(frequency)) return start.plusWeeks(index);
        if ("bi-weekly".equals(frequency) || "biweekly".equals(frequency)) return start.plusWeeks(index * 2L);
        if ("monthly".equals(frequency)) return start.plusMonths(index);
        if ("yearly".equals(frequency) || "annual".equals(frequency) || "annually".equals(frequency)) return start.plusYears(index);
        return start;
    }

    private boolean allowsOccurrencesBeforeTemplate(String frequency) {
        return "daily".equals(frequency)
                || "weekly".equals(frequency)
                || "monthly".equals(frequency)
                || "yearly".equals(frequency)
                || "annual".equals(frequency)
                || "annually".equals(frequency);
    }

    private boolean isOneTime(String frequency) {
        return !"daily".equals(frequency)
                && !"weekly".equals(frequency)
                && !"bi-weekly".equals(frequency)
                && !"biweekly".equals(frequency)
                && !"monthly".equals(frequency)
                && !"yearly".equals(frequency)
                && !"annual".equals(frequency)
                && !"annually".equals(frequency);
    }

    private int pageSize(EventSubEventsQueryDto query) {
        int value = query == null || query.pageSize() == null ? 12 : query.pageSize();
        return Math.max(1, Math.min(240, value));
    }

    private int pageOffset(EventSubEventsQueryDto query, int pageSize) {
        String cursor = safeText(query == null ? null : query.cursor());
        if (StringUtils.hasText(cursor)) {
            try {
                return Math.max(0, Integer.parseInt(cursor));
            } catch (NumberFormatException ignored) {
            }
        }
        int page = query == null || query.page() == null ? 0 : Math.max(0, query.page());
        return (int) Math.min(Integer.MAX_VALUE, (long) page * pageSize);
    }

    private record OccurrencePlan(
            EventSlotTemplateDto template,
            List<SubEventDefinitionDto> definitions,
            long duration,
            String frequency,
            LocalDateTime templateStart,
            LocalDateTime parentStart,
            long first,
            long last,
            Set<LocalDate> overrideDates) {
    }

    private record OccurrenceCursor(
            OccurrencePlan plan,
            long index,
            LocalDateTime start,
            SubEventsSlotSource source) {
    }

    private EventSubEventsSlotDto toSlotDto(SubEventsSlotSource source) {
        List<SubEventItemDto> items = new ArrayList<>();
        List<SubEventDefinitionDto> definitions = source == null || source.definitions() == null
                ? List.of()
                : source.definitions();
        long slotStartMs = toSortableDate(source == null ? null : source.startAt());
        if (slotStartMs == Long.MAX_VALUE) {
            slotStartMs = Instant.now().toEpochMilli();
        }
        List<SubEventDefinitionTimelineEntry> timeline = subEventDefinitionTimeline(definitions);
        Map<String, Integer> groupCountsByStageId = stageGroupCountsByStageId(definitions, source == null ? null : source.capacityMax());
        for (int index = 0; index < timeline.size(); index++) {
            SubEventDefinitionTimelineEntry entry = timeline.get(index);
            if (entry == null || entry.item() == null) {
                continue;
            }
            SubEventDefinitionDto item = entry.item();
            String itemId = firstNonBlank(item.id(), fallbackSubEventId(index));
            items.add(toSubEventItemDto(
                    item,
                    itemId,
                    index,
                    slotStartMs,
                    entry.startOffsetMinutes(),
                    entry.durationMinutes(),
                    groupCountsByStageId.get(itemId)));
        }
        return new EventSubEventsSlotDto(
                source == null ? "" : source.id(),
                source == null ? "" : source.parentEventId(),
                source == null ? null : source.slotSourceId(),
                source == null ? null : source.slotTemplateId(),
                source == null ? null : source.title(),
                source == null ? null : source.timeframe(),
                source == null ? null : source.startAt(),
                source == null ? null : source.endAt(),
                items);
    }

    public List<SubEventResourceLookup> subEventResourceLookups(
            List<EventSubEventsSlotDto> slots,
            String assetOwnerUserId) {
        return subEventStateLookups(slots, assetOwnerUserId).resourceLookups();
    }

    public SubEventStateLookups subEventStateLookups(
            List<EventSubEventsSlotDto> slots,
            String assetOwnerUserId) {
        String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
        List<SubEventResourceLookup> resourceLookups = new ArrayList<>();
        List<SubEventStageRuntimeLookup> stageRuntimeLookups = new ArrayList<>();
        for (EventSubEventsSlotDto slot : slots == null ? List.<EventSubEventsSlotDto>of() : slots) {
            String ownerId = subEventResourceOwnerId(slot);
            if (!StringUtils.hasText(ownerId)) {
                continue;
            }
            List<SubEventItemDto> items = slot.subEventItems() == null ? List.of() : slot.subEventItems();
            for (int index = 0; index < items.size(); index += 1) {
                SubEventItemDto item = items.get(index);
                String subEventId = firstNonBlank(item == null ? null : item.id(), fallbackSubEventId(index));
                if (StringUtils.hasText(subEventId)) {
                    stageRuntimeLookups.add(new SubEventStageRuntimeLookup(ownerId, subEventId));
                    if (StringUtils.hasText(normalizedAssetOwnerUserId)) {
                        resourceLookups.add(new SubEventResourceLookup(ownerId, subEventId, normalizedAssetOwnerUserId));
                    }
                }
            }
        }
        return new SubEventStateLookups(resourceLookups, stageRuntimeLookups);
    }

    public List<EventSubEventsSlotDto> withResourceRecords(
            List<EventSubEventsSlotDto> slots,
            Map<String, ActivitySubEventResourceStateDto> resourceRecordsByKey,
            String assetOwnerUserId) {
        return withSubEventStates(slots, resourceRecordsByKey, Map.of(), assetOwnerUserId);
    }

    public List<EventSubEventsSlotDto> withSubEventStates(
            List<EventSubEventsSlotDto> slots,
            Map<String, ActivitySubEventResourceStateDto> resourceRecordsByKey,
            Map<String, ActivitySubEventStageRuntimeStateDto> stageRuntimeByKey,
            String assetOwnerUserId) {
        return withSubEventStates(slots, resourceRecordsByKey, stageRuntimeByKey, Map.of(), assetOwnerUserId);
    }

    public List<EventSubEventsSlotDto> withSubEventStates(
            List<EventSubEventsSlotDto> slots,
            Map<String, ActivitySubEventResourceStateDto> resourceRecordsByKey,
            Map<String, ActivitySubEventStageRuntimeStateDto> stageRuntimeByKey,
            Map<String, SubEventResourceMetric> resourceMetricsByKey,
            String assetOwnerUserId) {
        String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
        return (slots == null ? List.<EventSubEventsSlotDto>of() : slots).stream()
                .map(slot -> withSubEventStates(slot, resourceRecordsByKey, stageRuntimeByKey, resourceMetricsByKey, normalizedAssetOwnerUserId))
                .toList();
    }

    private EventSubEventsSlotDto withSubEventStates(
            EventSubEventsSlotDto slot,
            Map<String, ActivitySubEventResourceStateDto> resourceRecordsByKey,
            Map<String, ActivitySubEventStageRuntimeStateDto> stageRuntimeByKey,
            Map<String, SubEventResourceMetric> resourceMetricsByKey,
            String assetOwnerUserId) {
        if (slot == null) {
            return null;
        }
        String ownerId = subEventResourceOwnerId(slot);
        List<SubEventItemDto> items = (slot.subEventItems() == null ? List.<SubEventItemDto>of() : slot.subEventItems()).stream()
                .map((SubEventItemDto item) -> {
                    String subEventId = normalizeId(item == null ? null : item.id());
                    ActivitySubEventResourceStateDto resourceRecord = resourceRecordsByKey == null
                            ? null
                            : resourceRecordsByKey.get(subEventResourceRecordKey(ownerId, subEventId, assetOwnerUserId));
                    ActivitySubEventStageRuntimeStateDto stageRuntime = stageRuntimeByKey == null
                            ? null
                            : stageRuntimeByKey.get(subEventStageRuntimeRecordKey(ownerId, subEventId));
                    return withStageRuntime(withResourceRecord(item, resourceRecord, resourceMetricsByKey), stageRuntime);
                })
                .toList();
        return new EventSubEventsSlotDto(
                slot.id(),
                slot.parentEventId(),
                slot.slotSourceId(),
                slot.slotTemplateId(),
                slot.title(),
                slot.timeframe(),
                slot.startAt(),
                slot.endAt(),
                items);
    }

    private String subEventResourceOwnerId(EventSubEventsSlotDto slot) {
        return firstNonBlank(
                slot == null ? null : slot.slotSourceId(),
                slot == null ? null : slot.parentEventId(),
                slot == null ? null : slot.id());
    }

    public String subEventResourceRecordKey(String ownerId, String subEventId, String assetOwnerUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
        return StringUtils.hasText(normalizedOwnerId)
                && StringUtils.hasText(normalizedSubEventId)
                && StringUtils.hasText(normalizedAssetOwnerUserId)
                        ? normalizedOwnerId + ":" + normalizedSubEventId + ":" + normalizedAssetOwnerUserId
                        : "";
    }

    public String subEventStageRuntimeRecordKey(String ownerId, String subEventId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        return StringUtils.hasText(normalizedOwnerId) && StringUtils.hasText(normalizedSubEventId)
                ? normalizedOwnerId + ":" + normalizedSubEventId
                : "";
    }

    public String subEventResourceMetricKey(String ownerId, String subEventId, String type) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedType = safeText(type);
        return StringUtils.hasText(normalizedOwnerId)
                && StringUtils.hasText(normalizedSubEventId)
                && StringUtils.hasText(normalizedType)
                        ? normalizedOwnerId + ":" + normalizedSubEventId + ":" + normalizedType
                        : "";
    }

    private List<SubEventsSlotSource> subEventsSlotSources(
            String parentEventId,
            ActivityEvent parentRecord,
            EventSubEventsQueryDto query,
            long nowMs) {
        if (parentRecord == null) {
            return List.of();
        }
        if (isGeneratedSlotRecord(parentRecord)) {
            return List.of(recordSlotSource(parentEventId, parentRecord));
        }
        if (Boolean.FALSE.equals(parentRecord.getSubEventsEnabled())) {
            return List.of();
        }
        List<EventSlotTemplateDto> templates = Boolean.TRUE.equals(parentRecord.getSlotsEnabled())
                ? parentRecord.getSlotTemplates()
                : List.of();
        if (templates != null && !templates.isEmpty()) {
            return templateSlotSources(parentEventId, parentRecord, templates, query, nowMs);
        }
        List<SubEventDefinitionDto> definitions = cloneSubEventDefinitions(parentRecord.getSubEventDefinitions());
        if (definitions.isEmpty()) {
            return List.of();
        }
        return List.of(new SubEventsSlotSource(
                parentEventId + ":default",
                parentEventId,
                null,
                null,
                null,
                null,
                safeText(parentRecord.getStartAtIso()),
                safeText(parentRecord.getEndAtIso()),
                parentRecord.getCapacityMax(),
                definitions));
    }

    private SubEventsSlotSource recordSlotSource(String parentEventId, ActivityEvent record) {
        String sourceId = firstNonBlank(record == null ? null : record.getSourceId(), record == null ? null : record.getId());
        return new SubEventsSlotSource(
                firstNonBlank(sourceId, parentEventId + ":slot"),
                parentEventId,
                StringUtils.hasText(sourceId) ? sourceId : null,
                safeText(record == null ? null : record.getSlotTemplateId()),
                safeText(record == null ? null : record.getTitle()),
                safeText(record == null ? null : record.getTimeframe()),
                safeText(record == null ? null : record.getStartAtIso()),
                safeText(record == null ? null : record.getEndAtIso()),
                record == null ? null : record.getCapacityMax(),
                cloneSubEventDefinitions(record == null ? null : record.getSubEventDefinitions()));
    }

    private List<SubEventsSlotSource> templateSlotSources(
            String parentEventId,
            ActivityEvent parentRecord,
            List<EventSlotTemplateDto> templates,
            EventSubEventsQueryDto query,
            long nowMs) {
        LocalDateTime parentStart = toLocalDateTime(parentRecord.getStartAtIso());
        LocalDateTime parentEnd = toLocalDateTime(parentRecord.getEndAtIso());
        if (parentStart == null || parentEnd == null || parentEnd.isBefore(parentStart)) {
            return List.of();
        }
        LocalDateTime now = toUtcDateTime(nowMs);
        SlotGenerationHorizon horizon = slotGenerationHorizon(parentStart, parentEnd, query, now);
        if (horizon == null) {
            return List.of();
        }
        List<SubEventsSlotSource> sources = new ArrayList<>();
        Set<LocalDate> overrideDates = (templates == null ? List.<EventSlotTemplateDto>of() : templates).stream()
                .map(template -> slotOverrideDateKey(template == null ? null : template.overrideDate()))
                .filter(date -> date != null)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));

        for (EventSlotTemplateDto template : templates == null ? List.<EventSlotTemplateDto>of() : templates) {
            if (template == null || Boolean.TRUE.equals(template.closed()) || slotOverrideDateKey(template.overrideDate()) != null) {
                continue;
            }
            LocalDateTime templateStart = toLocalDateTime(template.startAt());
            if (templateStart == null) {
                continue;
            }
            List<SubEventDefinitionDto> definitions = slotTemplateSubEventDefinitions(parentRecord, template);
            long durationMinutes = subEventDefinitionsDurationMinutes(definitions);
            SlotGenerationHorizon templateHorizon = slotGenerationHorizonForTemplate(horizon, durationMinutes, query, now);
            if (templateHorizon == null) {
                continue;
            }
            for (LocalDateTime occurrenceStart : generateSlotOccurrenceStarts(
                    parentRecord.getFrequency(),
                    templateStart,
                    templateHorizon.start(),
                    templateHorizon.end())) {
                LocalDate occurrenceDateKey = slotOccurrenceAnchorDateKey(occurrenceStart, templateStart, parentStart);
                if (occurrenceDateKey != null && overrideDates.contains(occurrenceDateKey)) {
                    continue;
                }
                LocalDateTime occurrenceEnd = occurrenceStart.plusMinutes(durationMinutes);
                if (occurrenceStart.isBefore(parentStart) || occurrenceEnd.isAfter(parentEnd)) {
                    continue;
                }
                if (!slotOccurrenceMatchesOrder(occurrenceEnd, query, nowMs)) {
                    continue;
                }
                sources.add(templateSlotSource(parentEventId, parentRecord, template, definitions, occurrenceStart, occurrenceEnd));
            }
        }

        for (EventSlotTemplateDto template : templates == null ? List.<EventSlotTemplateDto>of() : templates) {
            if (template == null || Boolean.TRUE.equals(template.closed()) || slotOverrideDateKey(template.overrideDate()) == null) {
                continue;
            }
            LocalDateTime templateStart = toLocalDateTime(template.startAt());
            if (templateStart == null) {
                continue;
            }
            List<SubEventDefinitionDto> definitions = slotTemplateSubEventDefinitions(parentRecord, template);
            LocalDateTime templateEnd = templateStart.plusMinutes(subEventDefinitionsDurationMinutes(definitions));
            SlotGenerationHorizon templateHorizon = slotGenerationHorizonForTemplate(
                    horizon,
                    subEventDefinitionsDurationMinutes(definitions),
                    query,
                    now);
            if (templateHorizon == null
                    || templateStart.isBefore(templateHorizon.start())
                    || templateStart.isAfter(templateHorizon.end())) {
                continue;
            }
            if (templateStart.isBefore(parentStart) || templateEnd.isAfter(parentEnd)) {
                continue;
            }
            if (!slotOccurrenceMatchesOrder(templateEnd, query, nowMs)) {
                continue;
            }
            sources.add(templateSlotSource(parentEventId, parentRecord, template, definitions, templateStart, templateEnd));
        }
        return sources;
    }

    private SubEventsSlotSource templateSlotSource(
            String parentEventId,
            ActivityEvent parentRecord,
            EventSlotTemplateDto template,
            List<SubEventDefinitionDto> definitions,
            LocalDateTime startAt,
            LocalDateTime endAt) {
        String slotTemplateId = safeText(template == null ? null : template.id());
        String sourceId = generatedSlotSourceId(parentEventId, slotTemplateId, startAt);
        return new SubEventsSlotSource(
                sourceId,
                parentEventId,
                sourceId,
                slotTemplateId,
                safeText(parentRecord == null ? null : parentRecord.getTitle()),
                generatedSlotTimeframe(startAt, endAt),
                startAt.toInstant(ZoneOffset.UTC).toString(),
                endAt.toInstant(ZoneOffset.UTC).toString(),
                parentRecord == null ? null : parentRecord.getCapacityMax(),
                cloneSubEventDefinitions(definitions));
    }

    private List<SubEventDefinitionDto> slotTemplateSubEventDefinitions(ActivityEvent parentRecord, EventSlotTemplateDto template) {
        if (parentRecord == null || Boolean.FALSE.equals(parentRecord.getSubEventsEnabled())) {
            return List.of();
        }
        List<SubEventDefinitionDto> overrideDefinitions = cloneSubEventDefinitions(template == null ? null : template.subEventDefinitions());
        return overrideDefinitions.isEmpty()
                ? cloneSubEventDefinitions(parentRecord.getSubEventDefinitions())
                : overrideDefinitions;
    }

    private SlotGenerationHorizon slotGenerationHorizon(
            LocalDateTime parentStart,
            LocalDateTime parentEnd,
            EventSubEventsQueryDto query,
            LocalDateTime now) {
        LocalDateTime rangeStart = queryRangeStart(query);
        LocalDateTime rangeEnd = queryRangeEnd(query);
        boolean isPast = "past".equalsIgnoreCase(safeText(query == null ? null : query.order()));
        LocalDateTime defaultStart;
        LocalDateTime defaultEnd;
        if (isPast) {
            defaultEnd = minDateTime(parentEnd, now);
            defaultStart = parentStart;
        } else {
            defaultStart = maxDateTime(parentStart, now);
            defaultEnd = parentEnd;
        }
        LocalDateTime start = maxDateTime(parentStart, rangeStart == null ? defaultStart : rangeStart);
        LocalDateTime end = minDateTime(parentEnd, rangeEnd == null ? defaultEnd : rangeEnd);
        return end.isBefore(start) ? null : new SlotGenerationHorizon(start, end);
    }

    private SlotGenerationHorizon slotGenerationHorizonForTemplate(
            SlotGenerationHorizon horizon,
            long durationMinutes,
            EventSubEventsQueryDto query,
            LocalDateTime now) {
        if (horizon == null) {
            return null;
        }
        long safeDurationMinutes = Math.max(0L, durationMinutes);
        boolean isPast = "past".equalsIgnoreCase(safeText(query == null ? null : query.order()));
        LocalDateTime start = horizon.start().minusMinutes(safeDurationMinutes);
        LocalDateTime end = horizon.end();
        if (isPast) {
            end = minDateTime(end, now);
        } else {
            start = maxDateTime(start, now.minusMinutes(safeDurationMinutes));
        }
        return end.isBefore(start) ? null : new SlotGenerationHorizon(start, end);
    }

    private boolean slotOccurrenceMatchesOrder(LocalDateTime occurrenceEnd, EventSubEventsQueryDto query, long nowMs) {
        if (occurrenceEnd == null) {
            return false;
        }
        boolean past = occurrenceEnd.toInstant(ZoneOffset.UTC).toEpochMilli() <= nowMs;
        return "past".equalsIgnoreCase(safeText(query == null ? null : query.order())) ? past : !past;
    }

    private boolean slotSourceMatchesOrder(SubEventsSlotSource source, EventSubEventsQueryDto query, long nowMs) {
        long start = toSortableDate(source == null ? null : source.startAt());
        long end = toSortableDate(source == null ? null : source.endAt());
        if (end == Long.MAX_VALUE || end <= 0L) {
            end = start;
        }
        if (end == Long.MAX_VALUE || end <= 0L) {
            return false;
        }
        boolean past = end <= nowMs;
        return "past".equalsIgnoreCase(safeText(query == null ? null : query.order())) ? past : !past;
    }

    private boolean slotSourceOverlapsRange(SubEventsSlotSource source, EventSubEventsQueryDto query) {
        LocalDateTime rangeStart = queryRangeStart(query);
        LocalDateTime rangeEnd = queryRangeEnd(query);
        if (rangeStart == null && rangeEnd == null) {
            return true;
        }
        long start = toSortableDate(source == null ? null : source.startAt());
        long end = toSortableDate(source == null ? null : source.endAt());
        if (end == Long.MAX_VALUE || end <= 0L) {
            end = start;
        }
        if (rangeStart != null && end < rangeStart.toInstant(ZoneOffset.UTC).toEpochMilli()) {
            return false;
        }
        if (rangeEnd != null && start > rangeEnd.toInstant(ZoneOffset.UTC).toEpochMilli()) {
            return false;
        }
        return true;
    }

    private long subEventDefinitionsDurationMinutes(List<SubEventDefinitionDto> items) {
        long maxEndOffset = 0L;
        for (SubEventDefinitionTimelineEntry entry : subEventDefinitionTimeline(items)) {
            maxEndOffset = Math.max(maxEndOffset, (long) entry.startOffsetMinutes() + entry.durationMinutes());
        }
        return maxEndOffset;
    }

    private List<LocalDateTime> generateSlotOccurrenceStarts(
            String frequency,
            LocalDateTime templateStart,
            LocalDateTime horizonStart,
            LocalDateTime horizonEnd) {
        String normalizedFrequency = safeText(frequency).toLowerCase();
        if (!StringUtils.hasText(normalizedFrequency) || "one-time".equals(normalizedFrequency) || "custom".equals(normalizedFrequency)) {
            return !templateStart.isBefore(horizonStart) && !templateStart.isAfter(horizonEnd)
                    ? List.of(templateStart)
                    : List.of();
        }
        List<LocalDateTime> starts = new ArrayList<>();
        LocalDate cursor = horizonStart.toLocalDate();
        LocalDate endDate = horizonEnd.toLocalDate();
        while (!cursor.isAfter(endDate)) {
            if (matchesSlotFrequency(cursor, templateStart, normalizedFrequency)) {
                LocalDateTime candidate = cursor.atTime(templateStart.toLocalTime());
                if (!candidate.isBefore(horizonStart) && !candidate.isAfter(horizonEnd)) {
                    starts.add(candidate);
                }
            }
            cursor = cursor.plusDays(1);
        }
        return starts;
    }

    private boolean matchesSlotFrequency(LocalDate date, LocalDateTime templateStart, String frequency) {
        if ("daily".equals(frequency)) {
            return true;
        }
        if ("weekly".equals(frequency)) {
            return date.getDayOfWeek() == templateStart.getDayOfWeek();
        }
        if ("bi-weekly".equals(frequency) || "biweekly".equals(frequency)) {
            if (date.getDayOfWeek() != templateStart.getDayOfWeek()) {
                return false;
            }
            long weeksBetween = ChronoUnit.WEEKS.between(templateStart.toLocalDate(), date);
            return weeksBetween >= 0L && weeksBetween % 2L == 0L;
        }
        if ("monthly".equals(frequency)) {
            return date.getDayOfMonth() == Math.min(templateStart.getDayOfMonth(), date.lengthOfMonth());
        }
        if ("yearly".equals(frequency) || "annual".equals(frequency) || "annually".equals(frequency)) {
            return date.getMonthValue() == templateStart.getMonthValue()
                    && date.getDayOfMonth() == Math.min(templateStart.getDayOfMonth(), date.lengthOfMonth());
        }
        return false;
    }

    private LocalDateTime queryRangeStart(EventSubEventsQueryDto query) {
        LocalDate date = queryDate(query == null ? null : query.rangeStart());
        return date == null ? null : date.atStartOfDay();
    }

    private LocalDateTime queryRangeEnd(EventSubEventsQueryDto query) {
        LocalDate date = queryDate(query == null ? null : query.rangeEnd());
        return date == null ? null : date.atTime(23, 59, 59, 999_000_000);
    }

    private LocalDate queryDate(String value) {
        String text = safeText(value);
        if (!StringUtils.hasText(text)) {
            return null;
        }
        try {
            return LocalDate.parse(text);
        } catch (DateTimeParseException ignored) {
            try {
                return Instant.parse(text).atOffset(ZoneOffset.UTC).toLocalDate();
            } catch (DateTimeParseException ignoredInstant) {
                try {
                    return LocalDateTime.parse(text).toLocalDate();
                } catch (DateTimeParseException ignoredLocalDateTime) {
                    return null;
                }
            }
        }
    }

    private LocalDateTime toLocalDateTime(String value) {
        String text = safeText(value);
        if (!StringUtils.hasText(text)) {
            return null;
        }
        try {
            return Instant.parse(text).atOffset(ZoneOffset.UTC).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(text);
            } catch (DateTimeParseException ignoredLocalDateTime) {
                try {
                    return LocalDate.parse(text).atStartOfDay();
                } catch (DateTimeParseException ignoredDate) {
                    return null;
                }
            }
        }
    }

    private LocalDateTime toUtcDateTime(long epochMs) {
        return Instant.ofEpochMilli(epochMs).atOffset(ZoneOffset.UTC).toLocalDateTime();
    }

    private LocalDate slotOverrideDateKey(String value) {
        return queryDate(value);
    }

    private LocalDate slotOccurrenceAnchorDateKey(
            LocalDateTime occurrenceStart,
            LocalDateTime templateStart,
            LocalDateTime parentStart) {
        if (occurrenceStart == null || templateStart == null || parentStart == null) {
            return null;
        }
        long templateOffsetMinutes = ChronoUnit.MINUTES.between(parentStart, templateStart);
        return occurrenceStart.minusMinutes(templateOffsetMinutes).toLocalDate();
    }

    private String generatedSlotSourceId(String parentEventId, String slotTemplateId, LocalDateTime startAt) {
        return parentEventId + ":slot:" + slotTemplateId + ":" + startAt.toInstant(ZoneOffset.UTC);
    }

    private String generatedSlotTimeframe(LocalDateTime startAt, LocalDateTime endAt) {
        return startAt.toLocalDate() + " · "
                + String.format("%02d:%02d", startAt.getHour(), startAt.getMinute())
                + " - "
                + String.format("%02d:%02d", endAt.getHour(), endAt.getMinute());
    }

    private LocalDateTime maxDateTime(LocalDateTime left, LocalDateTime right) {
        return left.isAfter(right) ? left : right;
    }

    private LocalDateTime minDateTime(LocalDateTime left, LocalDateTime right) {
        return left.isBefore(right) ? left : right;
    }

    private List<SubEventDefinitionDto> cloneSubEventDefinitions(List<SubEventDefinitionDto> items) {
        return items == null ? List.of() : new ArrayList<>(items);
    }

    private SubEventItemDto toSubEventItemDto(
            SubEventDefinitionDto item,
            String itemId,
            int index,
            long slotStartMs,
            int startOffsetMinutes,
            int durationMinutes,
            Integer groupsCount) {
        long startMs = slotStartMs + (startOffsetMinutes * 60_000L);
        long endMs = startMs + (durationMinutes * 60_000L);
        boolean tournamentStage = isTournamentStageDefinition(item);
        String stageStatus = tournamentStage ? "RS" : null;
        return new SubEventItemDto(
                firstNonBlank(itemId, fallbackSubEventId(index)),
                item.name(),
                item.description(),
                Instant.ofEpochMilli(startMs).toString(),
                Instant.ofEpochMilli(endMs).toString(),
                item.location(),
                null,
                item.tournamentGroupCapacityMin(),
                item.tournamentGroupCapacityMax(),
                item.tournamentLeaderboardType(),
                item.tournamentAdvancePerGroup(),
                item.optional(),
                item.pricing(),
                item.capacityMin(),
                item.capacityMax(),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null,
                null,
                null,
                null,
                null,
                startOffsetMinutes,
                durationMinutes,
                groupsCount,
                stageStatus,
                "RS".equals(stageStatus) ? "awaiting-tournament-start" : null,
                null,
                null,
                null);
    }

    private SubEventItemDto withResourceRecord(
            SubEventItemDto item,
            ActivitySubEventResourceStateDto resourceRecord,
            Map<String, SubEventResourceMetric> resourceMetricsByKey) {
        if (item == null) {
            return null;
        }
        ResourceMetric transport = resourceMetric(
                resourceRecord,
                AssetCatalog.TYPE_TRANSPORT,
                item.carsAccepted(),
                item.carsPending(),
                item.carsCapacityMin(),
                item.carsCapacityMax(),
                resourceMetricsByKey);
        ResourceMetric accommodation = resourceMetric(
                resourceRecord,
                AssetCatalog.TYPE_ACCOMMODATION,
                item.accommodationAccepted(),
                item.accommodationPending(),
                item.accommodationCapacityMin(),
                item.accommodationCapacityMax(),
                resourceMetricsByKey);
        ResourceMetric supplies = resourceMetric(
                resourceRecord,
                AssetCatalog.TYPE_SUPPLIES,
                item.suppliesAccepted(),
                item.suppliesPending(),
                item.suppliesCapacityMin(),
                item.suppliesCapacityMax(),
                resourceMetricsByKey);
        return new SubEventItemDto(
                item.id(),
                item.name(),
                item.description(),
                item.startAt(),
                item.endAt(),
                item.location(),
                item.createdByUserId(),
                item.tournamentGroupCapacityMin(),
                item.tournamentGroupCapacityMax(),
                item.tournamentLeaderboardType(),
                item.tournamentAdvancePerGroup(),
                item.optional(),
                item.pricing(),
                item.capacityMin(),
                item.capacityMax(),
                item.membersAccepted(),
                item.membersPending(),
                transport.pending(),
                accommodation.pending(),
                supplies.pending(),
                transport.accepted(),
                accommodation.accepted(),
                supplies.accepted(),
                transport.capacityMin(),
                transport.capacityMax(),
                accommodation.capacityMin(),
                accommodation.capacityMax(),
                supplies.capacityMin(),
                supplies.capacityMax(),
                item.slotStartOffsetMinutes(),
                item.slotDurationMinutes(),
                item.groupsCount(),
                item.stageStatus(),
                item.stageStatusReason(),
                item.stageStatusUpdatedAt(),
                item.stageFinalizedAt(),
                item.stageFinalizedByUserId());
    }

    private SubEventItemDto withStageRuntime(SubEventItemDto item, ActivitySubEventStageRuntimeStateDto stageRuntime) {
        if (item == null || stageRuntime == null) {
            return item;
        }
        return new SubEventItemDto(
                item.id(),
                item.name(),
                item.description(),
                item.startAt(),
                item.endAt(),
                item.location(),
                item.createdByUserId(),
                item.tournamentGroupCapacityMin(),
                item.tournamentGroupCapacityMax(),
                item.tournamentLeaderboardType(),
                item.tournamentAdvancePerGroup(),
                item.optional(),
                item.pricing(),
                item.capacityMin(),
                item.capacityMax(),
                item.membersAccepted(),
                item.membersPending(),
                item.carsPending(),
                item.accommodationPending(),
                item.suppliesPending(),
                item.carsAccepted(),
                item.accommodationAccepted(),
                item.suppliesAccepted(),
                item.carsCapacityMin(),
                item.carsCapacityMax(),
                item.accommodationCapacityMin(),
                item.accommodationCapacityMax(),
                item.suppliesCapacityMin(),
                item.suppliesCapacityMax(),
                item.slotStartOffsetMinutes(),
                item.slotDurationMinutes(),
                stageRuntime.groupsCount() == null ? item.groupsCount() : stageRuntime.groupsCount(),
                firstNonBlank(stageRuntime.stageStatus(), item.stageStatus()),
                firstNonBlank(stageRuntime.stageStatusReason(), item.stageStatusReason()),
                firstNonBlank(stageRuntime.stageStatusUpdatedAt(), item.stageStatusUpdatedAt()),
                firstNonBlank(stageRuntime.stageFinalizedAt(), item.stageFinalizedAt()),
                firstNonBlank(stageRuntime.stageFinalizedByUserId(), item.stageFinalizedByUserId()));
    }

    private List<SubEventDefinitionTimelineEntry> subEventDefinitionTimeline(List<SubEventDefinitionDto> items) {
        List<SubEventDefinitionTimelineEntry> timeline = new ArrayList<>();
        int previousStartOffsetMinutes = 0;
        int previousEndOffsetMinutes = 0;
        boolean hasPrevious = false;
        for (SubEventDefinitionDto item : items == null ? List.<SubEventDefinitionDto>of() : items) {
            if (item == null) {
                continue;
            }
            int durationMinutes = Math.max(0, item.durationMinutes() == null ? 0 : item.durationMinutes());
            int offsetMinutes = Math.max(0, item.offsetMinutes() == null ? 0 : item.offsetMinutes());
            String timing = normalizeSubEventDefinitionTiming(item.timing());
            int startOffsetMinutes = !hasPrevious
                    ? offsetMinutes
                    : "During".equals(timing)
                            ? previousStartOffsetMinutes + offsetMinutes
                            : previousEndOffsetMinutes + offsetMinutes;
            previousStartOffsetMinutes = startOffsetMinutes;
            previousEndOffsetMinutes = startOffsetMinutes + durationMinutes;
            hasPrevious = true;
            timeline.add(new SubEventDefinitionTimelineEntry(item, startOffsetMinutes, durationMinutes));
        }
        return timeline;
    }

    private String normalizeSubEventDefinitionTiming(String value) {
        String normalized = safeText(value).toLowerCase(java.util.Locale.ROOT);
        if ("before".equals(normalized)) {
            return "Before";
        }
        if ("after".equals(normalized)) {
            return "After";
        }
        return "During";
    }

    private boolean isTournamentStageDefinition(SubEventDefinitionDto item) {
        return item != null
                && !Boolean.TRUE.equals(item.optional())
                && ((item.tournamentGroupCapacityMin() != null && item.tournamentGroupCapacityMin() > 0)
                        || (item.tournamentGroupCapacityMax() != null && item.tournamentGroupCapacityMax() > 0)
                        || "Score".equals(item.tournamentLeaderboardType())
                        || "Fifa".equals(item.tournamentLeaderboardType()));
    }

    private Map<String, Integer> stageGroupCountsByStageId(List<SubEventDefinitionDto> definitions, Integer eventCapacityMax) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        int incomingCapacityMax = nonNegativeInteger(eventCapacityMax);
        for (int index = 0; index < (definitions == null ? 0 : definitions.size()); index += 1) {
            SubEventDefinitionDto definition = definitions.get(index);
            if (definition == null) {
                continue;
            }
            String stageId = firstNonBlank(definition.id(), fallbackSubEventId(index));
            int groupCount = autoTournamentGroupCountForIncoming(definition, incomingCapacityMax);
            if (StringUtils.hasText(stageId)) {
                counts.put(stageId, groupCount);
            }
            if (isTournamentStageDefinition(definition) && groupCount > 0) {
                int advancePerGroup = nonNegativeInteger(definition.tournamentAdvancePerGroup());
                incomingCapacityMax = advancePerGroup > 0 ? groupCount * advancePerGroup : 0;
            }
        }
        return counts;
    }

    private int autoTournamentGroupCountForIncoming(SubEventDefinitionDto item, int incomingCapacityMax) {
        if (item == null) {
            return 0;
        }
        int groupMin = nonNegativeInteger(item.tournamentGroupCapacityMin());
        int groupMax = Math.max(groupMin, nonNegativeInteger(item.tournamentGroupCapacityMax()));
        if (groupMin > 0 || groupMax > 0) {
            int divisor = Math.max(1, groupMax > 0 ? groupMax : groupMin);
            int capacityMax = incomingCapacityMax > 0 ? incomingCapacityMax : nonNegativeInteger(item.capacityMax());
            return capacityMax > 0 ? Math.max(1, (int) Math.ceil((double) capacityMax / divisor)) : 0;
        }
        return 0;
    }

    private ResourceMetric resourceMetric(
            ActivitySubEventResourceStateDto resourceRecord,
            String type,
            Integer fallbackAccepted,
            Integer fallbackPending,
            Integer fallbackCapacityMin,
            Integer fallbackCapacityMax,
            Map<String, SubEventResourceMetric> resourceMetricsByKey) {
        if (resourceRecord == null) {
            return new ResourceMetric(
                    nonNegativeInteger(fallbackAccepted),
                    nonNegativeInteger(fallbackPending),
                    nonNegativeInteger(fallbackCapacityMin),
                    nonNegativeInteger(fallbackCapacityMax));
        }
        Map<String, SubEventAssignedAssetSettingsDto> settingsByAssetId =
                resourceRecord.assetSettingsByType() == null
                        ? Map.of()
                        : resourceRecord.assetSettingsByType().getOrDefault(type, Map.of());
        List<String> assignedIds = resourceRecord.assetAssignmentIds() == null
                ? List.of()
                : resourceRecord.assetAssignmentIds().getOrDefault(type, List.of());
        List<String> assetIds = normalizedAssetIds(
                assignedIds == null || assignedIds.isEmpty()
                        ? new ArrayList<>(settingsByAssetId.keySet())
                        : assignedIds);
        int capacityMin = 0;
        int capacityMax = 0;
        int accepted = AssetCatalog.TYPE_SUPPLIES.equals(type) ? 0 : assetIds.size();
        int pending = 0;
        for (String assetId : assetIds) {
            SubEventAssignedAssetSettingsDto settings = settingsByAssetId.get(assetId);
            capacityMin += nonNegativeInteger(settings == null ? null : settings.capacityMin());
            capacityMax += nonNegativeInteger(settings == null ? null : settings.capacityMax());
            if (AssetCatalog.TYPE_SUPPLIES.equals(type)) {
                accepted += supplyContributionQuantity(resourceRecord, assetId);
            }
        }
        SubEventResourceMetricDto recordMetric = resourceRecord.resourceMetricsByType() == null
                ? null
                : resourceRecord.resourceMetricsByType().get(type);
        if (recordMetric != null) {
            accepted = nonNegativeInteger(recordMetric.accepted());
            pending = nonNegativeInteger(recordMetric.pending());
            capacityMin = nonNegativeInteger(recordMetric.capacityMin());
            capacityMax = nonNegativeInteger(recordMetric.capacityMax());
        }
        SubEventResourceMetric metric = resourceMetricsByKey == null
                ? null
                : resourceMetricsByKey.get(subEventResourceMetricKey(resourceRecord.ownerId(), resourceRecord.subEventId(), type));
        if (metric != null) {
            accepted = nonNegativeInteger(metric.accepted());
            pending = nonNegativeInteger(metric.pending());
        }
        return new ResourceMetric(accepted, pending, capacityMin, capacityMax);
    }

    private List<String> normalizedAssetIds(List<String> source) {
        if (source == null || source.isEmpty()) {
            return List.of();
        }
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        for (String item : source) {
            String assetId = normalizeId(item);
            if (StringUtils.hasText(assetId)) {
                ids.add(assetId);
            }
        }
        return new ArrayList<>(ids);
    }

    private int supplyContributionQuantity(ActivitySubEventResourceStateDto resourceRecord, String assetId) {
        if (resourceRecord == null || resourceRecord.supplyContributionEntriesByAssetId() == null) {
            return 0;
        }
        return resourceRecord.supplyContributionEntriesByAssetId()
                .getOrDefault(assetId, List.of())
                .stream()
                .map(SubEventSupplyContributionEntryDto::quantity)
                .mapToInt(this::nonNegativeInteger)
                .sum();
    }

    private String fallbackSubEventId(int index) {
        return "subevent-" + (index + 1);
    }

    private boolean isGeneratedSlotRecord(ActivityEvent record) {
        return record != null
                && (Boolean.TRUE.equals(record.getGenerated())
                        || "slot".equalsIgnoreCase(safeText(record.getEventType()))
                        || StringUtils.hasText(normalizeId(record.getParentEventId())));
    }

    private long toSortableDate(String value) {
        String text = safeText(value);
        if (!StringUtils.hasText(text)) {
            return Long.MAX_VALUE;
        }
        try {
            return Instant.parse(text).toEpochMilli();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(text).toInstant(ZoneOffset.UTC).toEpochMilli();
            } catch (DateTimeParseException ignoredLocalDateTime) {
                try {
                return LocalDate.parse(text).atStartOfDay().toInstant(java.time.ZoneOffset.UTC).toEpochMilli();
                } catch (DateTimeParseException ignoredAgain) {
                return Long.MAX_VALUE;
                }
            }
        }
    }

    private String firstNonBlank(String... values) {
        if (values == null) {
            return "";
        }
        for (String value : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private int nonNegativeInteger(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private record ResourceMetric(
            Integer accepted,
            Integer pending,
            Integer capacityMin,
            Integer capacityMax) {
    }

    public record SubEventResourceLookup(
            String ownerId,
            String subEventId,
            String assetOwnerUserId) {
    }

    public record SubEventStageRuntimeLookup(
            String ownerId,
            String subEventId) {
    }

    public record SubEventResourceMetric(
            Integer accepted,
            Integer pending) {
    }

    public record SubEventStateLookups(
            List<SubEventResourceLookup> resourceLookups,
            List<SubEventStageRuntimeLookup> stageRuntimeLookups) {
    }

    private record SubEventDefinitionTimelineEntry(
            SubEventDefinitionDto item,
            int startOffsetMinutes,
            int durationMinutes) {
    }

    private record SlotGenerationHorizon(
            LocalDateTime start,
            LocalDateTime end) {
    }

    private record SubEventsSlotSource(
            String id,
            String parentEventId,
            String slotSourceId,
            String slotTemplateId,
            String title,
            String timeframe,
            String startAt,
            String endAt,
            Integer capacityMax,
            List<SubEventDefinitionDto> definitions) {
    }
}
