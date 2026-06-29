package com.raxim.myscoutee.profile.service.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsSlotDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventStageRuntimeStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventSupplyContributionEntryDto;

@Component
public class ActivityEventSubEventsMapper {
    public List<EventSubEventsSlotDto> toSlotDtos(
            String parentEventId,
            ActivityEvent parentRecord,
            EventSubEventsQueryDto query) {
        String normalizedParentEventId = normalizeId(parentEventId);
        int direction = "past".equalsIgnoreCase(safeText(query == null ? null : query.order())) ? -1 : 1;
        long nowMs = System.currentTimeMillis();
        return subEventsSlotSources(normalizedParentEventId, parentRecord, query).stream()
                .filter(source -> source.definitions() != null && !source.definitions().isEmpty())
                .filter(source -> slotSourceMatchesOrder(source, query, nowMs))
                .filter(source -> slotSourceOverlapsRange(source, query))
                .sorted((left, right) -> direction * Long.compare(toSortableDate(left.startAt()), toSortableDate(right.startAt())))
                .map(this::toSlotDto)
                .toList();
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
        for (int index = 0; index < timeline.size(); index++) {
            SubEventDefinitionTimelineEntry entry = timeline.get(index);
            if (entry == null || entry.item() == null) {
                continue;
            }
            SubEventDefinitionDto item = entry.item();
            items.add(toSubEventItemDto(item, index, slotStartMs, entry.startOffsetMinutes(), entry.durationMinutes()));
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
        String normalizedAssetOwnerUserId = normalizeId(assetOwnerUserId);
        return (slots == null ? List.<EventSubEventsSlotDto>of() : slots).stream()
                .map(slot -> withSubEventStates(slot, resourceRecordsByKey, stageRuntimeByKey, normalizedAssetOwnerUserId))
                .toList();
    }

    private EventSubEventsSlotDto withSubEventStates(
            EventSubEventsSlotDto slot,
            Map<String, ActivitySubEventResourceStateDto> resourceRecordsByKey,
            Map<String, ActivitySubEventStageRuntimeStateDto> stageRuntimeByKey,
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
                    return withStageRuntime(withResourceRecord(item, resourceRecord), stageRuntime);
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

    private List<SubEventsSlotSource> subEventsSlotSources(
            String parentEventId,
            ActivityEvent parentRecord,
            EventSubEventsQueryDto query) {
        if (parentRecord == null || Boolean.FALSE.equals(parentRecord.getSubEventsEnabled())) {
            return List.of();
        }
        if (isGeneratedSlotRecord(parentRecord)) {
            return List.of(recordSlotSource(parentEventId, parentRecord));
        }
        List<EventSlotTemplateDto> templates = Boolean.TRUE.equals(parentRecord.getSlotsEnabled())
                ? parentRecord.getSlotTemplates()
                : List.of();
        if (templates != null && !templates.isEmpty()) {
            return templateSlotSources(parentEventId, parentRecord, templates, query);
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
                cloneSubEventDefinitions(record == null ? null : record.getSubEventDefinitions()));
    }

    private List<SubEventsSlotSource> templateSlotSources(
            String parentEventId,
            ActivityEvent parentRecord,
            List<EventSlotTemplateDto> templates,
            EventSubEventsQueryDto query) {
        LocalDateTime parentStart = toLocalDateTime(parentRecord.getStartAtIso());
        LocalDateTime parentEnd = toLocalDateTime(parentRecord.getEndAtIso());
        if (parentStart == null || parentEnd == null || parentEnd.isBefore(parentStart)) {
            return List.of();
        }
        SlotGenerationHorizon horizon = slotGenerationHorizon(parentStart, parentEnd, query);
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
            for (LocalDateTime occurrenceStart : generateSlotOccurrenceStarts(parentRecord.getFrequency(), templateStart, horizon.start(), horizon.end())) {
                LocalDate occurrenceDateKey = slotOccurrenceAnchorDateKey(occurrenceStart, templateStart, parentStart);
                if (occurrenceDateKey != null && overrideDates.contains(occurrenceDateKey)) {
                    continue;
                }
                LocalDateTime occurrenceEnd = occurrenceStart.plusMinutes(durationMinutes);
                if (occurrenceStart.isBefore(parentStart) || occurrenceEnd.isAfter(parentEnd)) {
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
            if (templateStart.isBefore(horizon.start()) || templateStart.isAfter(horizon.end())) {
                continue;
            }
            if (templateStart.isBefore(parentStart) || templateEnd.isAfter(parentEnd)) {
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
            EventSubEventsQueryDto query) {
        LocalDateTime rangeStart = queryRangeStart(query);
        LocalDateTime rangeEnd = queryRangeEnd(query);
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        boolean isPast = "past".equalsIgnoreCase(safeText(query == null ? null : query.order()));
        LocalDateTime defaultStart = now.minusDays(isPast ? 45 : 1);
        LocalDateTime defaultEnd = now.plusDays(isPast ? 1 : 45);
        LocalDateTime start = maxDateTime(parentStart, rangeStart == null ? defaultStart : rangeStart);
        LocalDateTime end = minDateTime(parentEnd, rangeEnd == null ? defaultEnd : rangeEnd);
        return end.isBefore(start) ? null : new SlotGenerationHorizon(start, end);
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
        boolean past = end < nowMs;
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
            int index,
            long slotStartMs,
            int startOffsetMinutes,
            int durationMinutes) {
        long startMs = slotStartMs + (startOffsetMinutes * 60_000L);
        long endMs = startMs + (durationMinutes * 60_000L);
        boolean tournamentStage = isTournamentStageDefinition(item);
        String stageStatus = tournamentStage ? (index == 0 ? "RS" : "A") : null;
        return new SubEventItemDto(
                firstNonBlank(item.id(), fallbackSubEventId(index)),
                item.name(),
                item.description(),
                Instant.ofEpochMilli(startMs).toString(),
                Instant.ofEpochMilli(endMs).toString(),
                item.location(),
                null,
                item.groups() == null ? List.of() : new ArrayList<>(item.groups()),
                item.tournamentGroupCount(),
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
                stageStatus,
                "RS".equals(stageStatus) ? "awaiting-tournament-start" : null,
                null,
                null,
                null);
    }

    private SubEventItemDto withResourceRecord(SubEventItemDto item, ActivitySubEventResourceStateDto resourceRecord) {
        if (item == null) {
            return null;
        }
        ResourceMetric car = resourceMetric(
                resourceRecord,
                "Car",
                item.carsAccepted(),
                item.carsPending(),
                item.carsCapacityMin(),
                item.carsCapacityMax());
        ResourceMetric accommodation = resourceMetric(
                resourceRecord,
                "Accommodation",
                item.accommodationAccepted(),
                item.accommodationPending(),
                item.accommodationCapacityMin(),
                item.accommodationCapacityMax());
        ResourceMetric supplies = resourceMetric(
                resourceRecord,
                "Supplies",
                item.suppliesAccepted(),
                item.suppliesPending(),
                item.suppliesCapacityMin(),
                item.suppliesCapacityMax());
        return new SubEventItemDto(
                item.id(),
                item.name(),
                item.description(),
                item.startAt(),
                item.endAt(),
                item.location(),
                item.createdByUserId(),
                item.groups() == null ? List.of() : new ArrayList<>(item.groups()),
                item.tournamentGroupCount(),
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
                car.pending(),
                accommodation.pending(),
                supplies.pending(),
                car.accepted(),
                accommodation.accepted(),
                supplies.accepted(),
                car.capacityMin(),
                car.capacityMax(),
                accommodation.capacityMin(),
                accommodation.capacityMax(),
                supplies.capacityMin(),
                supplies.capacityMax(),
                item.slotStartOffsetMinutes(),
                item.slotDurationMinutes(),
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
                item.groups() == null ? List.of() : new ArrayList<>(item.groups()),
                item.tournamentGroupCount(),
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
                && ((item.groups() != null && !item.groups().isEmpty())
                        || (item.tournamentGroupCount() != null && item.tournamentGroupCount() > 0)
                        || "Score".equals(item.tournamentLeaderboardType())
                        || "Fifa".equals(item.tournamentLeaderboardType()));
    }

    private ResourceMetric resourceMetric(
            ActivitySubEventResourceStateDto resourceRecord,
            String type,
            Integer fallbackAccepted,
            Integer fallbackPending,
            Integer fallbackCapacityMin,
            Integer fallbackCapacityMax) {
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
        List<String> assetIds = assignedIds == null || assignedIds.isEmpty()
                ? new ArrayList<>(settingsByAssetId.keySet())
                : assignedIds;
        int capacityMin = 0;
        int capacityMax = 0;
        int accepted = 0;
        for (String assetId : assetIds) {
            SubEventAssignedAssetSettingsDto settings = settingsByAssetId.get(assetId);
            capacityMin += nonNegativeInteger(settings == null ? null : settings.capacityMin());
            capacityMax += nonNegativeInteger(settings == null ? null : settings.capacityMax());
            if ("Supplies".equals(type)) {
                accepted += supplyContributionQuantity(resourceRecord, assetId);
            }
        }
        return new ResourceMetric(accepted, 0, capacityMin, capacityMax);
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
            List<SubEventDefinitionDto> definitions) {
    }
}
