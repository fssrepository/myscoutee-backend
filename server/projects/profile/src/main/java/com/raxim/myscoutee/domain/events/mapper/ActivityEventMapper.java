package com.raxim.myscoutee.domain.events.mapper;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.events.service.ActivitiesMembersService;

@Component
public class ActivityEventMapper {
    public record MappingContext(
            LocationCoordinatesDto viewerCoordinates,
            Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId,
            Map<String, String> checkoutResultStatesBySourceId,
            Map<String, String> creatorAvatarUrlsByUserId,
            Map<String, String> currentUserMembershipStatusesBySourceId,
            String viewerUserId,
            Map<String, Integer> resourcePendingReadBySourceId,
            Set<String> watchedEventSourceIds,
            Map<String, String> checkoutPendingReasonsBySourceId) {
        public MappingContext {
            checkoutPendingReasonsBySourceId = checkoutPendingReasonsBySourceId == null ? Map.of() : checkoutPendingReasonsBySourceId;
            snapshotsBySourceId = snapshotsBySourceId == null ? Map.of() : snapshotsBySourceId;
            checkoutResultStatesBySourceId = checkoutResultStatesBySourceId == null ? Map.of() : checkoutResultStatesBySourceId;
            creatorAvatarUrlsByUserId = creatorAvatarUrlsByUserId == null ? Map.of() : creatorAvatarUrlsByUserId;
            currentUserMembershipStatusesBySourceId = currentUserMembershipStatusesBySourceId == null
                    ? Map.of()
                    : currentUserMembershipStatusesBySourceId;
            resourcePendingReadBySourceId = resourcePendingReadBySourceId == null
                    ? Map.of()
                    : resourcePendingReadBySourceId;
            watchedEventSourceIds = watchedEventSourceIds == null ? Set.of() : Set.copyOf(watchedEventSourceIds);
        }

        public MappingContext withCheckoutPendingReasons(Map<String, String> reasons) {
            return new MappingContext(viewerCoordinates, snapshotsBySourceId, checkoutResultStatesBySourceId,
                    creatorAvatarUrlsByUserId, currentUserMembershipStatusesBySourceId, viewerUserId,
                    resourcePendingReadBySourceId, watchedEventSourceIds, reasons);
        }

        public MappingContext(LocationCoordinatesDto viewerCoordinates,
                Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId,
                Map<String, String> checkoutResultStatesBySourceId,
                Map<String, String> creatorAvatarUrlsByUserId,
                Map<String, String> currentUserMembershipStatusesBySourceId,
                String viewerUserId, Map<String, Integer> resourcePendingReadBySourceId,
                Set<String> watchedEventSourceIds) {
            this(viewerCoordinates, snapshotsBySourceId, checkoutResultStatesBySourceId,
                    creatorAvatarUrlsByUserId, currentUserMembershipStatusesBySourceId, viewerUserId,
                    resourcePendingReadBySourceId, watchedEventSourceIds, Map.of());
        }

        public MappingContext(
                LocationCoordinatesDto viewerCoordinates,
                Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId,
                Map<String, String> checkoutResultStatesBySourceId,
                Map<String, String> creatorAvatarUrlsByUserId,
                Map<String, String> currentUserMembershipStatusesBySourceId,
                String viewerUserId) {
            this(
                    viewerCoordinates,
                    snapshotsBySourceId,
                    checkoutResultStatesBySourceId,
                    creatorAvatarUrlsByUserId,
                    currentUserMembershipStatusesBySourceId,
                    viewerUserId,
                    Map.of(),
                    Set.of());
        }

        public MappingContext(
                LocationCoordinatesDto viewerCoordinates,
                Map<String, ActivitiesMembersService.OwnerMembersSnapshot> snapshotsBySourceId,
                Map<String, String> checkoutResultStatesBySourceId,
                Map<String, String> creatorAvatarUrlsByUserId,
                Map<String, String> currentUserMembershipStatusesBySourceId,
                String viewerUserId,
                Map<String, Integer> resourcePendingReadBySourceId) {
            this(
                    viewerCoordinates,
                    snapshotsBySourceId,
                    checkoutResultStatesBySourceId,
                    creatorAvatarUrlsByUserId,
                    currentUserMembershipStatusesBySourceId,
                    viewerUserId,
                    resourcePendingReadBySourceId,
                    Set.of());
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
        List<EventSlotOccurrenceDto> upcomingSlots = record.getUpcomingSlots() == null
                ? new ArrayList<>()
                : new ArrayList<>(record.getUpcomingSlots());
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
                aggregateRuntimeActivity(record),
                normalizeId(record.getCreatorUserId()),
                safeText(record.getCreatorName()),
                safeText(record.getCreatorInitials()),
                resolveCreatorAvatarUrl(record, context),
                safeText(record.getCreatorCity()),
                resolveOrganizerUserId(record),
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
                record.getCurrentStage(),
                Boolean.TRUE.equals(record.getTicketing()),
                record.getPricing(),
                Boolean.TRUE.equals(record.getPoliciesEnabled()),
                record.getPolicies() == null ? new ArrayList<>() : new ArrayList<>(record.getPolicies()),
                Boolean.TRUE.equals(record.getSlotsEnabled()),
                record.getSlotTemplates() == null ? new ArrayList<>() : new ArrayList<>(record.getSlotTemplates()),
                upcomingSlots.isEmpty() ? null : upcomingSlots.get(0),
                upcomingSlots,
                record.getSubEventsEnabled() == null || Boolean.TRUE.equals(record.getSubEventsEnabled()),
                record.getSubEventDefinitions() == null
                        ? new ArrayList<>()
                        : new ArrayList<>(record.getSubEventDefinitions()),
                SubEventItemMapper.toDtoList(record.getSubEvents()),
                acceptedMembers,
                pendingMembers,
                acceptedMemberUserIds,
                pendingMemberUserIds,
                invitedMemberUserIds,
                pendingRequestMemberUserIds,
                resolvePendingReason(record, context, membersSnapshot),
                resolveCurrentUserMembershipStatus(record, context, membersSnapshot),
                Boolean.TRUE.equals(record.getApprovalRequired()),
                resolveCheckoutResultState(record, context),
                safeDouble(record.getBoost()),
                context != null && context.watchedEventSourceIds().contains(normalizeId(record.getSourceId())),
                safeText(record.getSourceLink()),
                record.getModerationStatus(),
                record.getPaymentDeadlineHours() == null ? 4 : record.getPaymentDeadlineHours(),
                !Boolean.FALSE.equals(record.getPaymentDeadlineEnabled()),
                StringUtils.hasText(record.getCancelledAtIso()),
                StringUtils.hasText(record.getCancelledAtIso()) && !Boolean.TRUE.equals(record.getCancellationRefundsComplete()),
                context != null && record.getRefundEligibleUserIds() != null
                        && record.getRefundEligibleUserIds().contains(context.viewerUserId()),
                record.getCampaignId());
    }

    private String resolvePendingReason(ActivityEvent record, MappingContext context,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        String checkoutReason = context == null ? null
                : context.checkoutPendingReasonsBySourceId().get(normalizeId(record.getSourceId()));
        if (StringUtils.hasText(checkoutReason)) return checkoutReason;
        String viewer = context == null ? null : context.viewerUserId();
        if (!StringUtils.hasText(viewer) || snapshot == null || snapshot.members() == null) return null;
        var member = snapshot.members().stream()
                .filter(item -> viewer.equals(item.getUserId()) && "pending".equals(item.getStatus()))
                .findFirst().orElse(null);
        if (member == null) return null;
        String kind = member.getRequestKind();
        if ("payment".equals(kind)
                || ("join".equals(kind) && record.getPricing() != null
                    && !Boolean.FALSE.equals(record.getPricing().enabled()))) return "payment";
        return "approval".equals(kind) || "waitlist".equals(kind) ? kind : null;
    }

    private String resolveCurrentUserMembershipStatus(
            ActivityEvent record,
            MappingContext context,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        String sourceId = normalizeId(record == null ? null : record.getSourceId());
        String contextualStatus = safeText(context == null || !StringUtils.hasText(sourceId)
                ? null
                : context.currentUserMembershipStatusesBySourceId().get(sourceId));
        if ("accepted".equals(contextualStatus)
                || "pending".equals(contextualStatus)
                || "invited".equals(contextualStatus)) {
            return contextualStatus;
        }
        String viewerUserId = normalizeId(context == null ? null : context.viewerUserId());
        if (!StringUtils.hasText(viewerUserId) || snapshot == null) {
            return "none";
        }
        if (normalizeIds(snapshot.acceptedMemberUserIds()).contains(viewerUserId)) {
            return "accepted";
        }
        if (normalizeIds(snapshot.pendingMemberUserIds()).contains(viewerUserId)) {
            return "pending";
        }
        if (normalizeIds(snapshot.invitedMemberUserIds()).contains(viewerUserId)) {
            return "invited";
        }
        return "none";
    }

    private String resolveCreatorAvatarUrl(ActivityEvent record, MappingContext context) {
        if (record == null || context == null) {
            return "";
        }
        String organizerUserId = resolveOrganizerUserId(record);
        if (!StringUtils.hasText(organizerUserId)) {
            return "";
        }
        return safeText(context.creatorAvatarUrlsByUserId().get(organizerUserId));
    }

    private String resolveOrganizerUserId(ActivityEvent record) {
        String organizerUserId = normalizeId(record == null ? null : record.getOrganizerUserId());
        return StringUtils.hasText(organizerUserId)
                ? organizerUserId
                : normalizeId(record == null ? null : record.getCreatorUserId());
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

    private String resolveCheckoutResultState(ActivityEvent record, MappingContext context) {
        String sourceId = normalizeId(record == null ? null : record.getSourceId());
        if (!StringUtils.hasText(sourceId) || context == null || context.checkoutResultStatesBySourceId() == null) {
            return null;
        }
        String value = context.checkoutResultStatesBySourceId().get(sourceId);
        return "pending".equals(value) || "deleted".equals(value) || "succeeded".equals(value) || "failed".equals(value)
                ? value
                : null;
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
            return new ArrayList<>(snapshot.adminUserIds());
        }
        return normalizeStrings(record.getAdmins());
    }

    private List<String> resolveAcceptedMemberUserIds(
            ActivityEvent record,
            ActivitiesMembersService.OwnerMembersSnapshot snapshot) {
        return snapshot == null
                ? normalizeIds(record == null ? null : record.getAcceptedMemberUserIds())
                : normalizeIds(snapshot.acceptedMemberUserIds());
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
        if ("tournament".equalsIgnoreCase(safeText(value))) {
            return "Tournament";
        }
        return "mingle".equalsIgnoreCase(safeText(value)) ? "Mingle" : "Casual";
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
