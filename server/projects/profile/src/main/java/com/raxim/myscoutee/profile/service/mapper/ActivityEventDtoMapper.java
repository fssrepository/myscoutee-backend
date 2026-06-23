package com.raxim.myscoutee.profile.service.mapper;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.service.ActivitiesMembersService;

@Component
public class ActivityEventDtoMapper {
    public record MappingContext(
            LocationCoordinatesDto viewerCoordinates,
            Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId) {
        public MappingContext {
            snapshotsBySourceId = snapshotsBySourceId == null ? Map.of() : snapshotsBySourceId;
        }
    }

    public EventRecordDto toDto(ActivityEvent record, MappingContext context) {
        if (record == null) {
            return null;
        }
        Integer distanceMetersExact = resolveDistanceMetersExact(context == null ? null : context.viewerCoordinates(), record);
        ActivitiesMembersService.OwnerMembersSnapshot membersSnapshot = resolveMembersSnapshot(record, context);
        int capacityTotal = membersSnapshot == null || membersSnapshot.capacityTotal() == null
                ? normalizeCount(record.getCapacityTotal())
                : Math.max(0, membersSnapshot.capacityTotal());
        int acceptedMembers = membersSnapshot == null
                ? Math.max(normalizeCount(record.getAcceptedMembers()), fallbackAcceptedMemberUserIds(record).size())
                : membersSnapshot.acceptedMembers();
        int pendingMembers = membersSnapshot == null
                ? normalizeCount(record.getPendingMembers())
                : membersSnapshot.pendingMembers();
        List<EventSlotOccurrenceDto> upcomingSlots = cloneSlotOccurrences(record.getUpcomingSlots());
        List<String> adminUserIds = resolveDtoAdminUserIds(record, membersSnapshot);
        return new EventRecordDto(
                normalizeId(record.getSourceId()),
                normalizeId(record.getOwnerUserId()),
                safeText(record.getStatus()),
                adminUserIds,
                safeText(record.getAvatar()),
                safeText(record.getTitle()),
                safeText(record.getSubtitle()),
                safeText(record.getTimeframe()),
                StringUtils.hasText(record.getInviter()) ? record.getInviter().trim() : null,
                normalizeCount(record.getUnread()),
                normalizeCount(record.getActivity()),
                StringUtils.hasText(record.getTrashedAtIso()) ? record.getTrashedAtIso().trim() : null,
                normalizeId(record.getCreatorUserId()),
                safeText(record.getCreatorName()),
                safeText(record.getCreatorInitials()),
                safeText(record.getCreatorGender()),
                safeText(record.getCreatorCity()),
                safeText(record.getVisibility()),
                safeText(record.getBlindMode()),
                StringUtils.hasText(record.getStartAtIso()) ? record.getStartAtIso().trim() : null,
                StringUtils.hasText(record.getEndAtIso()) ? record.getEndAtIso().trim() : null,
                distanceMetersExact == null
                        ? Math.max(0d, safeDouble(record.getDistanceKm()))
                        : distanceMetersExact.doubleValue() / 1000d,
                safeText(record.getImageUrl()),
                safeText(record.getSourceLink()),
                safeText(record.getLocation()),
                cloneLocation(record.getLocationCoordinates()),
                nullableCount(record.getCapacityMin()),
                nullableCount(record.getCapacityMax()),
                Math.max(acceptedMembers, capacityTotal),
                Boolean.TRUE.equals(record.getAutoInviter()),
                safeText(record.getFrequency()),
                Boolean.TRUE.equals(record.getTicketing()),
                clonePricing(record.getPricing()),
                clonePolicies(record.getPolicies()),
                Boolean.TRUE.equals(record.getSlotsEnabled()),
                cloneSlotTemplates(record.getSlotTemplates()),
                safeText(record.getParentEventId()),
                safeText(record.getSlotTemplateId()),
                Boolean.TRUE.equals(record.getGenerated()),
                isGeneratedSlotRecord(record) ? "slot" : "main",
                upcomingSlots.isEmpty() ? null : upcomingSlots.get(0),
                upcomingSlots,
                acceptedMembers,
                pendingMembers,
                normalizeStrings(record.getTopics()),
                cloneSubEvents(record.getSubEvents()),
                safeText(record.getSubEventsDisplayMode()),
                safeDouble(record.getRating()),
                safeDouble(record.getBoost()),
                safeDouble(record.getAffinity()));
    }

    private ActivitiesMembersService.OwnerMembersSnapshot resolveMembersSnapshot(
            ActivityEvent record,
            MappingContext context) {
        String sourceId = normalizeId(record == null ? null : record.getSourceId());
        if (!StringUtils.hasText(sourceId) || context == null) {
            return null;
        }
        return context.snapshotsBySourceId().get(sourceId);
    }

    private List<String> resolveDtoAdminUserIds(
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        if (record == null) {
            return List.of();
        }
        if (snapshot != null) {
            LinkedHashSet<String> adminUserIds = new LinkedHashSet<>(snapshot.adminUserIds());
            String creatorUserId = normalizeId(record.getCreatorUserId());
            if (StringUtils.hasText(creatorUserId)) {
                adminUserIds.add(creatorUserId);
            }
            return new ArrayList<>(adminUserIds);
        }
        return normalizeStrings(record.getAdmins());
    }

    private List<String> fallbackAcceptedMemberUserIds(ActivityEvent record) {
        List<String> projectedUserIds = normalizeIds(record == null ? null : record.getAcceptedMemberUserIds());
        if (!projectedUserIds.isEmpty()) {
            return projectedUserIds;
        }
        String creatorUserId = record == null ? null : normalizeId(record.getCreatorUserId());
        return StringUtils.hasText(creatorUserId) ? List.of(creatorUserId) : List.of();
    }

    private Integer resolveDistanceMetersExact(LocationCoordinatesDto viewerCoordinates, ActivityEvent record) {
        LocationCoordinatesDto eventCoordinates = record == null ? null : cloneLocation(record.getLocationCoordinates());
        if (viewerCoordinates == null || eventCoordinates == null) {
            Double fallbackDistanceKm = record == null ? null : record.getDistanceKm();
            if (fallbackDistanceKm == null || !Double.isFinite(fallbackDistanceKm)) {
                return null;
            }
            return Math.max(0, (int) Math.round(fallbackDistanceKm * 1000d));
        }
        return haversineDistanceMeters(viewerCoordinates, eventCoordinates);
    }

    private int haversineDistanceMeters(LocationCoordinatesDto from, LocationCoordinatesDto to) {
        double earthRadiusMeters = 6_371_000d;
        double latitudeDelta = Math.toRadians(to.latitude() - from.latitude());
        double longitudeDelta = Math.toRadians(to.longitude() - from.longitude());
        double fromLatitude = Math.toRadians(from.latitude());
        double toLatitude = Math.toRadians(to.latitude());
        double sinLatitude = Math.sin(latitudeDelta / 2d);
        double sinLongitude = Math.sin(longitudeDelta / 2d);
        double a = (sinLatitude * sinLatitude)
                + (Math.cos(fromLatitude) * Math.cos(toLatitude) * sinLongitude * sinLongitude);
        double c = 2d * Math.atan2(Math.sqrt(a), Math.sqrt(1d - a));
        return Math.max(0, (int) Math.round(earthRadiusMeters * c));
    }

    private LocationCoordinatesDto cloneLocation(LocationCoordinatesDto value) {
        if (value == null || value.latitude() == null || value.longitude() == null) {
            return null;
        }
        return new LocationCoordinatesDto(value.latitude(), value.longitude());
    }

    private List<EventSlotTemplateDto> cloneSlotTemplates(List<EventSlotTemplateDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private List<EventSlotOccurrenceDto> cloneSlotOccurrences(List<EventSlotOccurrenceDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private PricingConfigDto clonePricing(PricingConfigDto pricing) {
        return pricing;
    }

    private List<PolicyItemDto> clonePolicies(List<PolicyItemDto> policies) {
        if (policies == null) {
            return new ArrayList<>();
        }
        List<PolicyItemDto> normalized = new ArrayList<>();
        for (int index = 0; index < policies.size(); index += 1) {
            PolicyItemDto policy = policies.get(index);
            if (policy == null) {
                continue;
            }
            String title = safeText(policy.title());
            String description = safeText(policy.description());
            if (!StringUtils.hasText(title) && !StringUtils.hasText(description)) {
                continue;
            }
            String id = safeText(policy.id());
            if (!StringUtils.hasText(id)) {
                id = "policy-" + (index + 1);
            }
            normalized.add(new PolicyItemDto(
                    id,
                    StringUtils.hasText(title) ? title : "Policy " + (index + 1),
                    description,
                    !Boolean.FALSE.equals(policy.required())));
        }
        return normalized;
    }

    private List<SubEventFormItemDto> cloneSubEvents(List<SubEventFormItemDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private boolean isGeneratedSlotRecord(ActivityEvent record) {
        return record != null
                && (Boolean.TRUE.equals(record.getGenerated())
                        || "slot".equalsIgnoreCase(safeText(record.getEventType()))
                        || StringUtils.hasText(normalizeId(record.getParentEventId())));
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
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String value : values) {
            String id = normalizeId(value);
            if (StringUtils.hasText(id)) {
                normalized.add(id);
            }
        }
        return new ArrayList<>(normalized);
    }

    private int normalizeCount(Number value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private Integer nullableCount(Number value) {
        return value == null ? null : Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private double safeDouble(Number value) {
        return value == null ? 0d : value.doubleValue();
    }

    private String normalizeId(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
