package com.raxim.myscoutee.profile.service.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsSlotDto;
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
            List<ActivityEvent> records,
            String order) {
        String normalizedParentEventId = normalizeId(parentEventId);
        int direction = "past".equalsIgnoreCase(safeText(order)) ? -1 : 1;
        return (records == null ? List.<ActivityEvent>of() : records).stream()
                .map(record -> toSlotDto(normalizedParentEventId, record))
                .sorted(Comparator.comparingLong((EventSubEventsSlotDto item) -> toSortableDate(item.startAt()))
                        .thenComparing(item -> safeText(item.id())))
                .sorted((left, right) -> direction * Long.compare(toSortableDate(left.startAt()), toSortableDate(right.startAt())))
                .toList();
    }

    public EventSubEventsSlotDto toSlotDto(
            String parentEventId,
            ActivityEvent record) {
        List<SubEventItemDto> items = new ArrayList<>();
        List<SubEventDefinitionDto> definitions = record == null || record.getSubEventDefinitions() == null
                ? List.of()
                : new ArrayList<>(record.getSubEventDefinitions());
        long slotStartMs = toSortableDate(record == null ? null : record.getStartAtIso());
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
                subEventsSlotId(parentEventId, record),
                normalizeId(parentEventId),
                isGeneratedSlotRecord(record) ? normalizeId(record == null ? null : record.getSourceId()) : null,
                safeText(record == null ? null : record.getSlotTemplateId()),
                isGeneratedSlotRecord(record) ? safeText(record.getTitle()) : null,
                isGeneratedSlotRecord(record) ? safeText(record.getTimeframe()) : null,
                safeText(record == null ? null : record.getStartAtIso()),
                safeText(record == null ? null : record.getEndAtIso()),
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

    public String subEventResourceOwnerId(String parentEventId, ActivityEvent record) {
        return isGeneratedSlotRecord(record)
                ? normalizeId(record == null ? null : record.getSourceId())
                : normalizeId(parentEventId);
    }

    private String subEventResourceOwnerId(EventSubEventsSlotDto slot) {
        return firstNonBlank(slot == null ? null : slot.slotSourceId(), slot == null ? null : slot.id());
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

    private String subEventsSlotId(String parentEventId, ActivityEvent record) {
        return isGeneratedSlotRecord(record)
                ? normalizeId(record == null ? null : record.getSourceId())
                : normalizeId(parentEventId) + ":default";
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
}
