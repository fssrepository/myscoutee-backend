package com.raxim.myscoutee.profile.service.mapper;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.service.ActivitiesMembersService;

@Component
public class ActivityEventMapper {
    public record MappingContext(
            LocationCoordinatesDto viewerCoordinates,
            Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId) {
        public MappingContext {
            snapshotsBySourceId = snapshotsBySourceId == null ? Map.of() : snapshotsBySourceId;
        }
    }

    public EventDto toDto(ActivityEvent record, MappingContext context) {
        if (record == null) {
            return null;
        }
        Integer distanceMetersExact = resolveDistanceMetersExact(context == null ? null : context.viewerCoordinates(), record);
        ActivitiesMembersService.OwnerMembersSnapshot membersSnapshot = resolveMembersSnapshot(record, context);
        List<String> acceptedMemberUserIds = resolveAcceptedMemberUserIds(record, membersSnapshot);
        List<String> pendingMemberUserIds = resolvePendingMemberUserIds(record, membersSnapshot);
        List<String> invitedMemberUserIds = resolveInvitedMemberUserIds(record, membersSnapshot);
        List<String> pendingRequestMemberUserIds = resolvePendingRequestMemberUserIds(record, membersSnapshot);
        int capacityTotal = membersSnapshot == null || membersSnapshot.capacityTotal() == null
                ? normalizeCount(record.getCapacityTotal())
                : Math.max(0, membersSnapshot.capacityTotal());
        int acceptedMembers = membersSnapshot == null
                ? Math.max(normalizeCount(record.getAcceptedMembers()), acceptedMemberUserIds.size())
                : membersSnapshot.acceptedMembers();
        int pendingMembers = membersSnapshot == null
                ? Math.max(normalizeCount(record.getPendingMembers()), pendingMemberUserIds.size())
                : membersSnapshot.pendingMembers();
        List<String> adminUserIds = resolveDtoAdminUserIds(record, membersSnapshot);
        return new EventDto(
                normalizeId(record.getSourceId()),
                normalizeId(record.getOwnerUserId()),
                safeText(record.getStatus()),
                adminUserIds,
                safeText(record.getTitle()),
                safeText(record.getSubtitle()),
                safeText(record.getTimeframe()),
                StringUtils.hasText(record.getInviter()) ? record.getInviter().trim() : null,
                normalizeCount(record.getActivity()),
                normalizeId(record.getCreatorUserId()),
                safeText(record.getCreatorName()),
                safeText(record.getCreatorInitials()),
                safeText(record.getCreatorCity()),
                safeText(record.getVisibility()),
                StringUtils.hasText(record.getStartAtIso()) ? record.getStartAtIso().trim() : null,
                StringUtils.hasText(record.getEndAtIso()) ? record.getEndAtIso().trim() : null,
                distanceMetersExact == null
                        ? Math.max(0d, safeDouble(record.getDistanceKm()))
                        : distanceMetersExact.doubleValue() / 1000d,
                safeText(record.getImageUrl()),
                safeText(record.getLocation()),
                nullableCount(record.getCapacityMin()),
                nullableCount(record.getCapacityMax()),
                Math.max(acceptedMembers, capacityTotal),
                resolveEventFull(record, acceptedMembers, capacityTotal),
                resolveEventType(record),
                normalizeMode(record.getMode()),
                acceptedMembers,
                pendingMembers,
                acceptedMemberUserIds,
                pendingMemberUserIds,
                invitedMemberUserIds,
                pendingRequestMemberUserIds,
                null,
                Boolean.TRUE.equals(record.getApprovalRequired()),
                safeDouble(record.getBoost()));
    }

    private Boolean resolveEventFull(ActivityEvent record, int acceptedMembers, int capacityTotal) {
        if (record == null) {
            return Boolean.FALSE;
        }
        if (Boolean.TRUE.equals(record.getFull())) {
            return Boolean.TRUE;
        }
        if (Boolean.TRUE.equals(record.getSlotsEnabled()) && !Boolean.TRUE.equals(record.getGenerated())) {
            List<EventSlotOccurrenceDto> upcomingSlots = record.getUpcomingSlots();
            if (upcomingSlots == null || upcomingSlots.isEmpty()) {
                return Boolean.TRUE;
            }
            return upcomingSlots.stream().allMatch(this::isSlotOccurrenceFull);
        }
        return capacityTotal > 0 && acceptedMembers >= capacityTotal;
    }

    private boolean isSlotOccurrenceFull(EventSlotOccurrenceDto slot) {
        if (slot == null) {
            return false;
        }
        int capacityTotal = normalizeCount(slot.capacityTotal());
        return capacityTotal > 0 && normalizeCount(slot.acceptedMembers()) >= capacityTotal;
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

    private List<String> resolveAcceptedMemberUserIds(
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        return snapshot == null ? fallbackAcceptedMemberUserIds(record) : normalizeIds(snapshot.acceptedMemberUserIds());
    }

    private List<String> resolvePendingMemberUserIds(
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        return snapshot == null
                ? normalizeIds(record == null ? null : record.getPendingMemberUserIds())
                : normalizeIds(snapshot.pendingMemberUserIds());
    }

    private List<String> resolveInvitedMemberUserIds(
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        return snapshot == null
                ? normalizeIds(record == null ? null : record.getInvitedMemberUserIds())
                : normalizeIds(snapshot.invitedMemberUserIds());
    }

    private List<String> resolvePendingRequestMemberUserIds(
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        return snapshot == null
                ? normalizeIds(record == null ? null : record.getPendingRequestMemberUserIds())
                : normalizeIds(snapshot.pendingRequestMemberUserIds());
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

    private boolean isGeneratedSlotRecord(ActivityEvent record) {
        return record != null
                && (Boolean.TRUE.equals(record.getGenerated())
                        || "slot".equalsIgnoreCase(safeText(record.getEventType()))
                        || StringUtils.hasText(normalizeId(record.getParentEventId())));
    }

    private String resolveEventType(ActivityEvent record) {
        String eventType = safeText(record == null ? null : record.getEventType());
        if (StringUtils.hasText(eventType)) {
            return eventType;
        }
        return isGeneratedSlotRecord(record) ? "slot" : "main";
    }

    private String normalizeMode(String value) {
        return "tournament".equalsIgnoreCase(safeText(value)) ? "Tournament" : "Casual";
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
