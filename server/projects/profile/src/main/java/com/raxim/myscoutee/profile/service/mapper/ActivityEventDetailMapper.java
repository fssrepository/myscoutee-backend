package com.raxim.myscoutee.profile.service.mapper;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDetailDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.MingleConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventItemDto;
import com.raxim.myscoutee.profile.data.document.SubEventItem;

@Component
public class ActivityEventDetailMapper {
    public record MappingContext(String type) {
        public MappingContext {
            type = StringUtils.hasText(type) ? type.trim() : "events";
        }
    }

    public EventDetailDto toDto(ActivityEvent record, MappingContext context) {
        if (record == null) {
            return null;
        }
        List<EventSlotOccurrenceDto> upcomingSlots = cloneSlotOccurrences(record.getUpcomingSlots());
        return new EventDetailDto(
                safeText(record.getSyncKey()),
                normalizeId(record.getSourceId()),
                normalizeId(record.getOwnerUserId()),
                context == null ? "events" : context.type(),
                safeText(record.getStatus()),
                safeText(record.getStatusBeforeSuppression()),
                normalizeIds(record.getAdmins()),
                safeText(record.getAvatar()),
                safeText(record.getTitle()),
                safeText(record.getSubtitle()),
                safeText(record.getTimeframe()),
                StringUtils.hasText(record.getInviter()) ? record.getInviter().trim() : null,
                normalizeCount(record.getUnread()),
                aggregateRuntimeActivity(record),
                StringUtils.hasText(record.getTrashedAtIso()) ? record.getTrashedAtIso().trim() : null,
                normalizeId(record.getCreatorUserId()),
                safeText(record.getCreatorName()),
                safeText(record.getCreatorInitials()),
                safeText(record.getCreatorGender()),
                safeText(record.getCreatorCity()),
                safeText(record.getVisibility()),
                safeText(record.getBlindMode()),
                safeText(record.getStartAtIso()),
                safeText(record.getEndAtIso()),
                record.getDistanceKm() == null ? null : Math.max(0d, safeDouble(record.getDistanceKm())),
                safeText(record.getImageUrl()),
                safeText(record.getSourceLink()),
                safeText(record.getLocation()),
                cloneLocation(record.getLocationCoordinates()),
                nullableCount(record.getCapacityMin()),
                nullableCount(record.getCapacityMax()),
                normalizeCount(record.getCapacityTotal()),
                normalizeCount(record.getCapacityTotal()),
                resolveEventFull(record, upcomingSlots),
                Boolean.TRUE.equals(record.getAutoInviter()),
                safeText(record.getFrequency()),
                Boolean.TRUE.equals(record.getTicketing()),
                Boolean.TRUE.equals(record.getApprovalRequired()),
                clonePricing(record.getPricing()),
                Boolean.TRUE.equals(record.getPoliciesEnabled()),
                clonePolicies(record.getPolicies()),
                Boolean.TRUE.equals(record.getSlotsEnabled()),
                cloneSlotTemplates(record.getSlotTemplates()),
                safeText(record.getParentEventId()),
                safeText(record.getSlotTemplateId()),
                Boolean.TRUE.equals(record.getGenerated()),
                resolveEventType(record),
                upcomingSlots.isEmpty() ? null : upcomingSlots.get(0),
                upcomingSlots,
                normalizeCount(record.getAcceptedMembers()),
                normalizeCount(record.getPendingMembers()),
                normalizeIds(record.getAcceptedMemberUserIds()),
                normalizeIds(record.getPendingMemberUserIds()),
                normalizeIds(record.getInvitedMemberUserIds()),
                normalizeIds(record.getPendingRequestMemberUserIds()),
                null,
                normalizeStrings(record.getTopics()),
                record.getSubEventsEnabled() == null || Boolean.TRUE.equals(record.getSubEventsEnabled()),
                cloneSubEventDefinitions(record.getSubEventDefinitions()),
                cloneSubEvents(record.getSubEvents()),
                safeText(record.getMode()),
                cloneMingleConfiguration(record.getMingleConfiguration()),
                record.getCurrentStage(),
                safeDouble(record.getRating()),
                safeDouble(record.getBoost()),
                safeDouble(record.getAffinity()),
                null,
                record.getImageUrls() == null
                        ? (StringUtils.hasText(record.getImageUrl()) ? List.of(record.getImageUrl().trim()) : List.of())
                        : List.copyOf(record.getImageUrls()),
                record.getImageDetails(),
                record.getPaymentDeadlineHours() == null ? 4 : record.getPaymentDeadlineHours());
    }

    private MingleConfigurationDto cloneMingleConfiguration(MingleConfigurationDto value) {
        if (value == null) {
            return null;
        }
        return new MingleConfigurationDto(
                value.groupSize(),
                value.plannedRounds(),
                value.roundDurationMinutes(),
                value.breakDurationMinutes(),
                value.requireGenderBalance());
    }

    private int aggregateRuntimeActivity(ActivityEvent record) {
        int pending = 0;
        for (SubEventItem item : record == null || record.getSubEvents() == null
                ? List.<SubEventItem>of()
                : record.getSubEvents()) {
            if (item == null) {
                continue;
            }
            if (Boolean.TRUE.equals(item.optional())) {
                pending += normalizeCount(item.membersPending());
            }
            pending += normalizeCount(item.carsPending());
            pending += normalizeCount(item.accommodationPending());
            pending += normalizeCount(item.suppliesPending());
        }
        return Math.max(normalizeCount(record == null ? null : record.getActivity()), pending);
    }

    private Boolean resolveEventFull(ActivityEvent record, List<EventSlotOccurrenceDto> upcomingSlots) {
        if (record == null) {
            return Boolean.FALSE;
        }
        if (Boolean.TRUE.equals(record.getFull())) {
            return Boolean.TRUE;
        }
        if (Boolean.TRUE.equals(record.getSlotsEnabled()) && !Boolean.TRUE.equals(record.getGenerated())) {
            if (upcomingSlots == null || upcomingSlots.isEmpty()) {
                return Boolean.TRUE;
            }
            return upcomingSlots.stream().allMatch(this::isSlotOccurrenceFull);
        }
        int capacityTotal = normalizeCount(record.getCapacityTotal());
        return capacityTotal > 0 && normalizeCount(record.getAcceptedMembers()) >= capacityTotal;
    }

    private boolean isSlotOccurrenceFull(EventSlotOccurrenceDto slot) {
        if (slot == null) {
            return false;
        }
        int capacityTotal = normalizeCount(slot.capacityTotal());
        return capacityTotal > 0 && normalizeCount(slot.acceptedMembers()) >= capacityTotal;
    }

    private String resolveEventType(ActivityEvent record) {
        String eventType = safeText(record.getEventType());
        if (StringUtils.hasText(eventType)) {
            return eventType;
        }
        return Boolean.TRUE.equals(record.getGenerated()) ? "slot" : "main";
    }

    private LocationCoordinatesDto cloneLocation(LocationCoordinatesDto value) {
        if (value == null || value.latitude() == null || value.longitude() == null) {
            return null;
        }
        return new LocationCoordinatesDto(value.latitude(), value.longitude());
    }

    private List<EventSlotTemplateDto> cloneSlotTemplates(List<EventSlotTemplateDto> items) {
        if (items == null) {
            return new ArrayList<>();
        }
        List<EventSlotTemplateDto> cloned = new ArrayList<>();
        for (EventSlotTemplateDto item : items) {
            if (item == null) {
                continue;
            }
            cloned.add(new EventSlotTemplateDto(
                    item.id(),
                    item.startAt(),
                    item.overrideDate(),
                    item.closed(),
                    cloneSubEventDefinitions(item.subEventDefinitions())));
        }
        return cloned;
    }

    private List<EventSlotOccurrenceDto> cloneSlotOccurrences(List<EventSlotOccurrenceDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private PricingConfigDto clonePricing(PricingConfigDto pricing) {
        return pricing;
    }

    private List<PolicyItemDto> clonePolicies(List<PolicyItemDto> policies) {
        return policies == null ? new ArrayList<>() : new ArrayList<>(policies);
    }

    private List<SubEventItemDto> cloneSubEvents(List<SubEventItem> items) {
        return SubEventItemMapper.toDtoList(items);
    }

    private List<SubEventDefinitionDto> cloneSubEventDefinitions(List<SubEventDefinitionDto> items) {
        if (items == null) {
            return new ArrayList<>();
        }
        List<SubEventDefinitionDto> cloned = new ArrayList<>();
        for (SubEventDefinitionDto item : items) {
            if (item == null) {
                continue;
            }
            cloned.add(new SubEventDefinitionDto(
                    item.id(),
                    item.name(),
                    item.description(),
                    item.timing(),
                    item.offsetMinutes(),
                    item.durationMinutes(),
                    item.location(),
                    item.tournamentGroupCapacityMin(),
                    item.tournamentGroupCapacityMax(),
                    item.tournamentLeaderboardType(),
                    item.tournamentAdvancePerGroup(),
                    item.optional(),
                    clonePricing(item.pricing()),
                    item.capacityMin(),
                    item.capacityMax(),
                    item.icon()));
        }
        return cloned;
    }

    private List<String> normalizeStrings(Collection<String> values) {
        if (values == null) {
            return List.of();
        }
        List<String> normalized = new ArrayList<>();
        for (String value : values) {
            String text = safeText(value);
            if (StringUtils.hasText(text)) {
                normalized.add(text);
            }
        }
        return normalized;
    }

    private List<String> normalizeIds(Collection<String> values) {
        if (values == null) {
            return List.of();
        }
        List<String> normalized = new ArrayList<>();
        for (String value : values) {
            String text = normalizeId(value);
            if (StringUtils.hasText(text)) {
                normalized.add(text);
            }
        }
        return normalized;
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private Integer nullableCount(Integer value) {
        return value == null ? null : Math.max(0, value);
    }

    private double safeDouble(Double value) {
        return value == null || !Double.isFinite(value) ? 0d : value;
    }
}
