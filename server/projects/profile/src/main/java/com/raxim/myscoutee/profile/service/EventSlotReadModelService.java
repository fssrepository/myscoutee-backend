package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;

@Service
public class EventSlotReadModelService {
    private static final long UPCOMING_SLOT_GRACE_MS = 60L * 60L * 1000L;

    private final ActivityEventsRepository activityEventsRepository;

    public EventSlotReadModelService(ActivityEventsRepository activityEventsRepository) {
        this.activityEventsRepository = activityEventsRepository;
    }

    public List<ActivityEvent> refreshForChangedEvents(Collection<ActivityEvent> records) {
        return refreshParentUpcomingSlots(resolveParentSourceIds(records));
    }

    public List<ActivityEvent> refreshForChangedSourceIds(Collection<String> sourceIds) {
        List<String> normalizedSourceIds = normalizeIds(sourceIds);
        if (normalizedSourceIds.isEmpty()) {
            return List.of();
        }
        List<ActivityEvent> changedDocuments = activityEventsRepository.findBySourceIdIn(normalizedSourceIds);
        return refreshForChangedEvents(changedDocuments);
    }

    public List<ActivityEvent> refreshParentUpcomingSlots(Collection<String> parentSourceIds) {
        List<String> normalizedParentIds = normalizeIds(parentSourceIds);
        if (normalizedParentIds.isEmpty()) {
            return List.of();
        }
        Set<String> parentIdSet = new LinkedHashSet<>(normalizedParentIds);
        List<ActivityEvent> rawParentDocuments = activityEventsRepository.findBySourceIdIn(normalizedParentIds);
        List<ActivityEvent> parentDocuments = (rawParentDocuments == null ? List.<ActivityEvent>of() : rawParentDocuments).stream()
                .filter(Objects::nonNull)
                .toList();
        if (parentDocuments.isEmpty()) {
            return List.of();
        }
        Map<String, ActivityEvent> parentBySourceId = new LinkedHashMap<>();
        for (ActivityEvent parent : parentDocuments) {
            String sourceId = normalizeId(parent.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                parentBySourceId.put(sourceId, parent);
            }
        }
        List<ActivityEvent> rawSlotDocuments = activityEventsRepository.findByParentEventIdIn(normalizedParentIds);
        List<ActivityEvent> slotDocuments = (rawSlotDocuments == null ? List.<ActivityEvent>of() : rawSlotDocuments).stream()
                .filter(Objects::nonNull)
                .toList();
        Map<String, List<EventSlotOccurrenceDto>> upcomingByParentId = new LinkedHashMap<>();
        for (String parentSourceId : parentIdSet) {
            upcomingByParentId.put(parentSourceId, buildUpcomingSlotOccurrences(parentBySourceId.get(parentSourceId), slotDocuments));
        }

        List<ActivityEvent> toSave = new ArrayList<>();
        for (ActivityEvent document : parentDocuments) {
            String sourceId = normalizeId(document.getSourceId());
            if (!parentIdSet.contains(sourceId) || isGeneratedSlotRecord(document)) {
                continue;
            }
            List<EventSlotOccurrenceDto> nextSlots = isSlotParentRecord(document)
                    ? upcomingByParentId.getOrDefault(sourceId, List.of())
                    : List.of();
            if (!Objects.equals(normalizeSlotOccurrences(document.getUpcomingSlots()), nextSlots)) {
                document.setUpcomingSlots(nextSlots);
                toSave.add(document);
            }
        }
        if (toSave.isEmpty()) {
            return List.of();
        }
        return activityEventsRepository.saveAll(toSave);
    }

    private List<String> resolveParentSourceIds(Collection<ActivityEvent> records) {
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            if (record == null) {
                continue;
            }
            String parentEventId = normalizeId(record.getParentEventId());
            if (isGeneratedSlotRecord(record) && StringUtils.hasText(parentEventId)) {
                ids.add(parentEventId);
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                ids.add(sourceId);
            }
        }
        return new ArrayList<>(ids);
    }

    private List<EventSlotOccurrenceDto> buildUpcomingSlotOccurrences(
            ActivityEvent parent,
            List<ActivityEvent> slotDocuments) {
        String normalizedParentSourceId = normalizeId(parent == null ? null : parent.getSourceId());
        if (!StringUtils.hasText(normalizedParentSourceId)) {
            return List.of();
        }
        long nowMs = System.currentTimeMillis() - UPCOMING_SLOT_GRACE_MS;
        return (slotDocuments == null ? List.<ActivityEvent>of() : slotDocuments).stream()
                .filter(this::isGeneratedSlotRecord)
                .filter(item -> normalizedParentSourceId.equals(normalizeId(item.getParentEventId())))
                .filter(item -> !Boolean.TRUE.equals(item.getIsTrashed()))
                .filter(item -> toSortableDate(item.getEndAtIso()) >= nowMs)
                .sorted(Comparator.comparingLong(item -> toSortableDate(item.getStartAtIso())))
                .map(item -> toSlotOccurrence(parent, item))
                .filter(Objects::nonNull)
                .toList();
    }

    private EventSlotOccurrenceDto toSlotOccurrence(ActivityEvent parent, ActivityEvent item) {
        String sourceId = normalizeId(item == null ? null : item.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return null;
        }
        int acceptedMembers = acceptedMembersIncludingParentAdmins(parent, item);
        int pendingMembers = pendingMembersExcludingAcceptedAdmins(parent, item);
        int capacityTotal = Math.max(acceptedMembers, normalizeCount(item.getCapacityTotal()));
        return new EventSlotOccurrenceDto(
                sourceId,
                normalizeId(parent == null ? null : parent.getSourceId()),
                safeText(item.getSlotTemplateId()),
                safeText(item.getTitle()),
                safeText(item.getTimeframe()),
                safeText(item.getStartAtIso()),
                safeText(item.getEndAtIso()),
                capacityTotal,
                acceptedMembers,
                pendingMembers);
    }

    private int acceptedMembersIncludingParentAdmins(ActivityEvent parent, ActivityEvent slot) {
        List<String> parentAdminIds = normalizeIds(parent == null ? null : parent.getAdmins());
        List<String> acceptedMemberUserIds = normalizeIds(slot == null ? null : slot.getAcceptedMemberUserIds());
        LinkedHashSet<String> mergedUserIds = new LinkedHashSet<>(acceptedMemberUserIds);
        mergedUserIds.addAll(parentAdminIds);
        int storedAcceptedMembers = normalizeCount(slot == null ? null : slot.getAcceptedMembers());
        return mergedUserIds.isEmpty() ? storedAcceptedMembers : mergedUserIds.size();
    }

    private int pendingMembersExcludingAcceptedAdmins(ActivityEvent parent, ActivityEvent slot) {
        List<String> parentAdminIds = normalizeIds(parent == null ? null : parent.getAdmins());
        List<String> acceptedMemberUserIds = normalizeIds(slot == null ? null : slot.getAcceptedMemberUserIds());
        LinkedHashSet<String> acceptedUserIds = new LinkedHashSet<>(acceptedMemberUserIds);
        acceptedUserIds.addAll(parentAdminIds);
        List<String> pendingMemberUserIds = normalizeIds(slot == null ? null : slot.getPendingMemberUserIds());
        if (pendingMemberUserIds.isEmpty()) {
            return normalizeCount(slot == null ? null : slot.getPendingMembers());
        }
        pendingMemberUserIds.removeIf(acceptedUserIds::contains);
        return pendingMemberUserIds.size();
    }

    private boolean isSlotParentRecord(ActivityEvent record) {
        return record != null
                && Boolean.TRUE.equals(record.getSlotsEnabled())
                && !isGeneratedSlotRecord(record)
                && record.getSlotTemplates() != null
                && !record.getSlotTemplates().isEmpty();
    }

    private boolean isGeneratedSlotRecord(ActivityEvent record) {
        return record != null
                && (Boolean.TRUE.equals(record.getGenerated())
                        || "slot".equalsIgnoreCase(safeText(record.getEventType()))
                        || StringUtils.hasText(normalizeId(record.getParentEventId())));
    }

    private List<EventSlotOccurrenceDto> normalizeSlotOccurrences(List<EventSlotOccurrenceDto> value) {
        return value == null ? List.of() : new ArrayList<>(value);
    }

    private List<String> normalizeIds(Collection<String> values) {
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        for (String value : values == null ? List.<String>of() : values) {
            String normalized = normalizeId(value);
            if (StringUtils.hasText(normalized)) {
                ids.add(normalized);
            }
        }
        return new ArrayList<>(ids);
    }

    private long toSortableDate(String value) {
        if (!StringUtils.hasText(value)) {
            return 0L;
        }
        try {
            return Instant.parse(value.trim()).toEpochMilli();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value.trim()).toInstant(ZoneOffset.UTC).toEpochMilli();
            } catch (DateTimeParseException secondIgnored) {
                try {
                    return LocalDate.parse(value.trim()).atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli();
                } catch (DateTimeParseException thirdIgnored) {
                    return 0L;
                }
            }
        }
    }

    private int normalizeCount(Number value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private String normalizeId(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
