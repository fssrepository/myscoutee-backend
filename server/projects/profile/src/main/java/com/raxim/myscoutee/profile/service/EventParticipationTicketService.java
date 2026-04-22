package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;

@Service
public class EventParticipationTicketService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String TYPE_EVENTS = "events";
    private static final String TYPE_HOSTING = "hosting";
    private static final String TYPE_INVITATIONS = "invitations";

    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;

    public EventParticipationTicketService(
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository) {
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
    }

    public List<ActivityEvent> queryTicketRecordsForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : activityEventsRepository.findByOwnerUserId(normalizedUserId)) {
            if (record == null
                    || !Boolean.TRUE.equals(record.getTicketing())
                    || Boolean.TRUE.equals(record.getIsInvitation())
                    || Boolean.TRUE.equals(record.getIsTrashed())) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent current = preferredBySourceId.get(sourceId);
            if (current == null || preferSourceRecord(record, current)) {
                preferredBySourceId.put(sourceId, record);
            }
        }
        return new ArrayList<>(preferredBySourceId.values());
    }

    public void syncParticipationTicketsForEvent(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return;
        }

        List<ActivityEvent> toSave = new ArrayList<>();
        reconcileSource(normalizedSourceId, null, toSave);
        flushChanges(toSave);
    }

    private void reconcileSource(
            String sourceId,
            Set<String> limitedUserIds,
            List<ActivityEvent> toSave) {
        SourceTicketSnapshot snapshot = loadSnapshot(sourceId);
        if (snapshot == null) {
            return;
        }

        Set<String> candidateUserIds = new LinkedHashSet<>();
        if (limitedUserIds != null && !limitedUserIds.isEmpty()) {
            candidateUserIds.addAll(limitedUserIds);
        } else {
            candidateUserIds.addAll(snapshot.acceptedMemberUserIds());
        }
        candidateUserIds.addAll(snapshot.existingOverlayByOwnerUserId().keySet());
        candidateUserIds.remove(snapshot.creatorUserId());

        for (String ownerUserId : candidateUserIds) {
            reconcileUserOverlay(snapshot, ownerUserId, toSave);
        }
    }

    private SourceTicketSnapshot loadSnapshot(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return null;
        }

        List<ActivityEvent> sourceDocuments = activityEventsRepository.findBySourceId(normalizedSourceId).stream()
                .filter(Objects::nonNull)
                .toList();
        ActivityEvent preferred = resolvePreferredSourceRecord(sourceDocuments);

        List<ActivityMember> members = activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_EVENT, normalizedSourceId).stream()
                .filter(Objects::nonNull)
                .toList();
        Set<String> acceptedMemberUserIds = new LinkedHashSet<>();
        Set<String> pendingMemberUserIds = new LinkedHashSet<>();
        for (ActivityMember member : members) {
            String memberUserId = normalizeId(member.getUserId());
            if (!StringUtils.hasText(memberUserId)) {
                continue;
            }
            String memberStatus = normalizeMemberStatus(member.getStatus());
            if ("deleted".equals(memberStatus)) {
                continue;
            }
            if ("pending".equals(memberStatus)) {
                pendingMemberUserIds.add(memberUserId);
            } else {
                acceptedMemberUserIds.add(memberUserId);
            }
        }

        String creatorUserId = preferred == null ? null : normalizeId(preferred.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId)) {
            acceptedMemberUserIds.add(creatorUserId);
            pendingMemberUserIds.remove(creatorUserId);
        }

        Map<String, ActivityEvent> existingOverlayByOwnerUserId = new LinkedHashMap<>();
        for (ActivityEvent record : sourceDocuments) {
            if (!isManagedParticipationOverlay(record, creatorUserId)) {
                continue;
            }
            String ownerUserId = normalizeId(record.getOwnerUserId());
            if (StringUtils.hasText(ownerUserId)) {
                existingOverlayByOwnerUserId.put(ownerUserId, record);
            }
        }

        return new SourceTicketSnapshot(
                normalizedSourceId,
                preferred,
                creatorUserId,
                acceptedMemberUserIds,
                pendingMemberUserIds,
                existingOverlayByOwnerUserId);
    }

    private void reconcileUserOverlay(
            SourceTicketSnapshot snapshot,
            String ownerUserId,
            List<ActivityEvent> toSave) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        if (!StringUtils.hasText(normalizedOwnerUserId)) {
            return;
        }

        ActivityEvent existing = snapshot.existingOverlayByOwnerUserId().get(normalizedOwnerUserId);
        ActivityEvent preferred = snapshot.preferredRecord();
        boolean acceptedParticipant = snapshot.acceptedMemberUserIds().contains(normalizedOwnerUserId)
                && !normalizedOwnerUserId.equals(snapshot.creatorUserId());

        if (preferred == null || !acceptedParticipant || Boolean.TRUE.equals(preferred.getIsInvitation())) {
            if (existing != null) {
                ActivityEvent next = buildInactiveParticipationOverlay(snapshot, normalizedOwnerUserId, existing);
                if (!equivalentOverlay(existing, next)) {
                    toSave.add(next);
                }
            }
            return;
        }

        boolean ticketingEnabled = Boolean.TRUE.equals(preferred.getTicketing());
        boolean eventTrashed = Boolean.TRUE.equals(preferred.getIsTrashed());
        if (existing == null && (!ticketingEnabled || eventTrashed)) {
            return;
        }

        if (!ticketingEnabled || eventTrashed) {
            ActivityEvent next = buildInactiveParticipationOverlay(snapshot, normalizedOwnerUserId, existing);
            if (existing != null && equivalentOverlay(existing, next)) {
                return;
            }
            if (next != null) {
                toSave.add(next);
            }
            return;
        }

        ActivityEvent next = buildParticipationOverlay(snapshot, normalizedOwnerUserId, existing);
        if (existing != null && equivalentOverlay(existing, next)) {
            return;
        }
        toSave.add(next);
    }

    private ActivityEvent buildInactiveParticipationOverlay(
            SourceTicketSnapshot snapshot,
            String ownerUserId,
            ActivityEvent existing) {
        if (existing == null) {
            return null;
        }

        ActivityEvent preferred = snapshot.preferredRecord();
        ActivityEvent next = preferred == null
                ? cloneDocument(existing)
                : buildParticipationOverlay(snapshot, ownerUserId, existing);
        next.setTicketing(false);
        next.setIsTrashed(preferred != null && Boolean.TRUE.equals(preferred.getIsTrashed()));
        next.setTrashedAtIso(resolveTrashedAtIso(preferred, existing, Boolean.TRUE.equals(next.getIsTrashed())));
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(resolveUpdatedUser(preferred, existing, ownerUserId));
        next.normalizeLifecycleState();
        return next;
    }

    private ActivityEvent buildParticipationOverlay(
            SourceTicketSnapshot snapshot,
            String ownerUserId,
            ActivityEvent existing) {
        ActivityEvent preferred = snapshot.preferredRecord();
        String nowIso = Instant.now().toString();

        ActivityEvent next = existing == null ? new ActivityEvent() : cloneDocument(existing);
        next.setId(existing != null && StringUtils.hasText(existing.getId()) ? existing.getId() : new ObjectId().toHexString());
        next.setSyncKey(existing != null && StringUtils.hasText(existing.getSyncKey()) ? existing.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setSourceId(normalizeId(preferred.getSourceId()));
        next.setOwnerUserId(ownerUserId);
        next.setType(TYPE_EVENTS);
        next.setAvatar(safeText(preferred.getAvatar()));
        next.setTitle(safeText(preferred.getTitle()));
        next.setSubtitle(safeText(preferred.getSubtitle()));
        next.setTimeframe(safeText(preferred.getTimeframe()));
        next.setInviter(StringUtils.hasText(preferred.getInviter()) ? preferred.getInviter().trim() : null);
        next.setUnread(existing == null ? 0 : normalizeCount(existing.getUnread()));
        next.setActivity(normalizeCount(preferred.getActivity()));
        next.setIsAdmin(false);
        next.setIsInvitation(false);
        next.setIsHosting(false);
        boolean globallyTrashed = Boolean.TRUE.equals(preferred.getIsTrashed());
        next.setIsTrashed(globallyTrashed);
        next.setPublished(Boolean.FALSE.equals(preferred.getPublished()) ? Boolean.FALSE : Boolean.TRUE);
        next.setTrashedAtIso(resolveTrashedAtIso(preferred, existing, globallyTrashed));
        next.setCreatorUserId(normalizeId(preferred.getCreatorUserId()));
        next.setCreatorName(safeText(preferred.getCreatorName()));
        next.setCreatorInitials(safeText(preferred.getCreatorInitials()));
        next.setCreatorGender(safeText(preferred.getCreatorGender()));
        next.setCreatorCity(safeText(preferred.getCreatorCity()));
        next.setAdmins(preferred.getAdmins() == null ? List.of() : new ArrayList<>(preferred.getAdmins()));
        next.setVisibility(safeText(preferred.getVisibility()));
        next.setBlindMode(safeText(preferred.getBlindMode()));
        next.setStartAtIso(normalizeDateTime(preferred.getStartAtIso(), null));
        next.setEndAtIso(normalizeDateTime(preferred.getEndAtIso(), next.getStartAtIso()));
        next.setDistanceKm(null);
        next.setImageUrl(safeText(preferred.getImageUrl()));
        next.setSourceLink(safeText(preferred.getSourceLink()));
        next.setLocation(safeText(preferred.getLocation()));
        next.setLocationCoordinates(cloneLocation(preferred.getLocationCoordinates()));
        next.setLocationGeo(cloneGeoPoint(preferred.getLocationGeo()));
        next.setCapacityMin(preferred.getCapacityMin());
        next.setCapacityMax(preferred.getCapacityMax());
        next.setCapacityTotal(preferred.getCapacityTotal());
        next.setAutoInviter(Boolean.TRUE.equals(preferred.getAutoInviter()));
        next.setFrequency(safeText(preferred.getFrequency()));
        next.setTicketing(Boolean.TRUE.equals(preferred.getTicketing()));
        next.setPricing(preferred.getPricing());
        next.setAcceptedMembers(Math.max(normalizeCount(preferred.getAcceptedMembers()), snapshot.acceptedMemberUserIds().size()));
        next.setPendingMembers(Math.max(normalizeCount(preferred.getPendingMembers()), snapshot.pendingMemberUserIds().size()));
        next.setAcceptedMemberUserIds(new ArrayList<>(snapshot.acceptedMemberUserIds()));
        next.setPendingMemberUserIds(new ArrayList<>(snapshot.pendingMemberUserIds()));
        next.setTopics(new ArrayList<>(normalizeStrings(preferred.getTopics())));
        next.setSubEvents(cloneSubEvents(preferred.getSubEvents()));
        next.setSubEventsDisplayMode(safeText(preferred.getSubEventsDisplayMode()));
        next.setRating(preferred.getRating());
        next.setRelevance(preferred.getRelevance());
        next.setAffinity(preferred.getAffinity());
        next.setCreatedDate(existing != null ? normalizeDateTime(existing.getCreatedDate(), nowIso) : nowIso);
        next.setCreatedUser(existing != null ? safeText(existing.getCreatedUser()) : ownerUserId);
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(resolveUpdatedUser(preferred, existing, ownerUserId));
        next.normalizeLifecycleState();
        return next;
    }

    private void flushChanges(List<ActivityEvent> toSave) {
        if (!toSave.isEmpty()) {
            activityEventsRepository.saveAll(toSave);
        }
    }

    private ActivityEvent resolvePreferredSourceRecord(List<ActivityEvent> sourceDocuments) {
        ActivityEvent preferred = null;
        for (ActivityEvent document : sourceDocuments) {
            if (document == null || Boolean.TRUE.equals(document.getIsInvitation())) {
                continue;
            }
            if (preferred == null || preferSourceRecord(document, preferred)) {
                preferred = document;
            }
        }
        return preferred;
    }

    private boolean preferSourceRecord(ActivityEvent next, ActivityEvent current) {
        int nextRank = sourceRecordRank(next);
        int currentRank = sourceRecordRank(current);
        if (nextRank != currentRank) {
            return nextRank > currentRank;
        }
        return toSortableDate(next == null ? null : next.getUpdatedDate()) >= toSortableDate(current == null ? null : current.getUpdatedDate());
    }

    private int sourceRecordRank(ActivityEvent record) {
        if (record == null) {
            return 0;
        }
        if (Boolean.TRUE.equals(record.getIsHosting()) || TYPE_HOSTING.equals(normalizeType(record.getType()))) {
            return 3;
        }
        if (TYPE_EVENTS.equals(normalizeType(record.getType()))) {
            return 2;
        }
        if (TYPE_INVITATIONS.equals(normalizeType(record.getType())) || Boolean.TRUE.equals(record.getIsInvitation())) {
            return 1;
        }
        return 0;
    }

    private boolean isManagedParticipationOverlay(ActivityEvent record, String creatorUserId) {
        if (record == null || !TYPE_EVENTS.equals(normalizeType(record.getType()))) {
            return false;
        }
        if (Boolean.TRUE.equals(record.getIsInvitation()) || Boolean.TRUE.equals(record.getIsHosting())) {
            return false;
        }
        String ownerUserId = normalizeId(record.getOwnerUserId());
        if (!StringUtils.hasText(ownerUserId)) {
            return false;
        }
        String normalizedCreatorUserId = normalizeId(creatorUserId);
        if (StringUtils.hasText(normalizedCreatorUserId) && normalizedCreatorUserId.equals(ownerUserId)) {
            return false;
        }
        return StringUtils.hasText(normalizeId(record.getSourceId()));
    }

    private boolean equivalentOverlay(ActivityEvent left, ActivityEvent right) {
        if (left == right) {
            return true;
        }
        if (left == null || right == null) {
            return false;
        }
        return Objects.equals(left.getId(), right.getId())
                && Objects.equals(left.getSyncKey(), right.getSyncKey())
                && Objects.equals(left.getSourceId(), right.getSourceId())
                && Objects.equals(left.getOwnerUserId(), right.getOwnerUserId())
                && Objects.equals(left.getType(), right.getType())
                && Objects.equals(left.getAvatar(), right.getAvatar())
                && Objects.equals(left.getTitle(), right.getTitle())
                && Objects.equals(left.getSubtitle(), right.getSubtitle())
                && Objects.equals(left.getTimeframe(), right.getTimeframe())
                && Objects.equals(left.getInviter(), right.getInviter())
                && Objects.equals(left.getUnread(), right.getUnread())
                && Objects.equals(left.getActivity(), right.getActivity())
                && Objects.equals(left.getIsAdmin(), right.getIsAdmin())
                && Objects.equals(left.getIsInvitation(), right.getIsInvitation())
                && Objects.equals(left.getIsHosting(), right.getIsHosting())
                && Objects.equals(left.getIsTrashed(), right.getIsTrashed())
                && Objects.equals(left.getPublished(), right.getPublished())
                && Objects.equals(left.getTrashedAtIso(), right.getTrashedAtIso())
                && Objects.equals(left.getCreatorUserId(), right.getCreatorUserId())
                && Objects.equals(left.getCreatorName(), right.getCreatorName())
                && Objects.equals(left.getCreatorInitials(), right.getCreatorInitials())
                && Objects.equals(left.getCreatorGender(), right.getCreatorGender())
                && Objects.equals(left.getCreatorCity(), right.getCreatorCity())
                && Objects.equals(left.getVisibility(), right.getVisibility())
                && Objects.equals(left.getBlindMode(), right.getBlindMode())
                && Objects.equals(left.getStartAtIso(), right.getStartAtIso())
                && Objects.equals(left.getEndAtIso(), right.getEndAtIso())
                && Objects.equals(left.getDistanceKm(), right.getDistanceKm())
                && Objects.equals(left.getImageUrl(), right.getImageUrl())
                && Objects.equals(left.getSourceLink(), right.getSourceLink())
                && Objects.equals(left.getLocation(), right.getLocation())
                && Objects.equals(left.getLocationCoordinates(), right.getLocationCoordinates())
                && Objects.equals(left.getLocationGeo(), right.getLocationGeo())
                && Objects.equals(left.getCapacityMin(), right.getCapacityMin())
                && Objects.equals(left.getCapacityMax(), right.getCapacityMax())
                && Objects.equals(left.getCapacityTotal(), right.getCapacityTotal())
                && Objects.equals(left.getAutoInviter(), right.getAutoInviter())
                && Objects.equals(left.getFrequency(), right.getFrequency())
                && Objects.equals(left.getTicketing(), right.getTicketing())
                && Objects.equals(left.getPricing(), right.getPricing())
                && Objects.equals(left.getAcceptedMembers(), right.getAcceptedMembers())
                && Objects.equals(left.getPendingMembers(), right.getPendingMembers())
                && Objects.equals(normalizeStrings(left.getTopics()), normalizeStrings(right.getTopics()))
                && Objects.equals(safeSubEvents(left.getSubEvents()), safeSubEvents(right.getSubEvents()))
                && Objects.equals(left.getSubEventsDisplayMode(), right.getSubEventsDisplayMode())
                && Objects.equals(left.getRating(), right.getRating())
                && Objects.equals(left.getRelevance(), right.getRelevance())
                && Objects.equals(left.getAffinity(), right.getAffinity())
                && Objects.equals(left.getCreatedDate(), right.getCreatedDate())
                && Objects.equals(left.getCreatedUser(), right.getCreatedUser());
    }

    private ActivityEvent cloneDocument(ActivityEvent source) {
        ActivityEvent clone = new ActivityEvent();
        BeanUtils.copyProperties(source, clone);
        clone.setAdmins(source.getAdmins() == null ? List.of() : new ArrayList<>(source.getAdmins()));
        clone.setTopics(new ArrayList<>(normalizeStrings(source.getTopics())));
        clone.setSubEvents(cloneSubEvents(source.getSubEvents()));
        clone.setPricing(source.getPricing());
        clone.setLocationCoordinates(cloneLocation(source.getLocationCoordinates()));
        clone.setLocationGeo(cloneGeoPoint(source.getLocationGeo()));
        return clone;
    }

    private List<SubEventFormItemDto> cloneSubEvents(List<SubEventFormItemDto> source) {
        return source == null ? List.of() : new ArrayList<>(source);
    }

    private List<SubEventFormItemDto> safeSubEvents(List<SubEventFormItemDto> value) {
        return value == null ? List.of() : value;
    }

    private LocationCoordinatesDto cloneLocation(LocationCoordinatesDto source) {
        return source == null ? null : new LocationCoordinatesDto(source.latitude(), source.longitude());
    }

    private GeoJsonPoint cloneGeoPoint(GeoJsonPoint source) {
        return source == null ? null : new GeoJsonPoint(source.getX(), source.getY());
    }

    private List<String> normalizeStrings(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        List<String> normalized = new ArrayList<>();
        for (String value : values) {
            String next = safeText(value);
            if (StringUtils.hasText(next)) {
                normalized.add(next);
            }
        }
        return normalized;
    }

    private String resolveTrashedAtIso(
            ActivityEvent preferred,
            ActivityEvent existing,
            boolean globallyTrashed) {
        if (globallyTrashed) {
            return normalizeDateTime(
                    preferred == null ? null : preferred.getTrashedAtIso(),
                    normalizeDateTime(existing == null ? null : existing.getTrashedAtIso(), preferred == null ? null : preferred.getUpdatedDate()));
        }
        return null;
    }

    private String resolveUpdatedUser(ActivityEvent preferred, ActivityEvent existing, String ownerUserId) {
        String preferredUpdatedUser = safeText(preferred == null ? null : preferred.getUpdatedUser());
        if (StringUtils.hasText(preferredUpdatedUser)) {
            return preferredUpdatedUser;
        }
        String existingUpdatedUser = safeText(existing == null ? null : existing.getUpdatedUser());
        if (StringUtils.hasText(existingUpdatedUser)) {
            return existingUpdatedUser;
        }
        return ownerUserId;
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private String normalizeMemberStatus(String value) {
        String normalized = safeText(value);
        if ("pending".equals(normalized)) {
            return "pending";
        }
        if ("deleted".equals(normalized)) {
            return "deleted";
        }
        return "accepted";
    }

    private String normalizeType(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case TYPE_EVENTS, TYPE_HOSTING, TYPE_INVITATIONS -> normalized;
            default -> TYPE_EVENTS;
        };
    }

    private String normalizeId(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeDateTime(String value, String fallback) {
        if (StringUtils.hasText(value)) {
            return value.trim();
        }
        return StringUtils.hasText(fallback) ? fallback.trim() : null;
    }

    private long toSortableDate(String value) {
        if (!StringUtils.hasText(value)) {
            return Long.MIN_VALUE;
        }
        try {
            return Instant.parse(value.trim()).toEpochMilli();
        } catch (DateTimeParseException exception) {
            return Long.MIN_VALUE;
        }
    }

    private record SourceTicketSnapshot(
            String sourceId,
            ActivityEvent preferredRecord,
            String creatorUserId,
            Set<String> acceptedMemberUserIds,
            Set<String> pendingMemberUserIds,
            Map<String, ActivityEvent> existingOverlayByOwnerUserId) {
    }
}
