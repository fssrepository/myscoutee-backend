package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;

@Service
public class EventTicketSyncService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String TYPE_EVENTS = "events";

    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;

    public EventTicketSyncService(
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository) {
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
    }

    public void syncTicketOverlaysForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }

        LinkedHashSet<String> sourceIds = new LinkedHashSet<>();
        for (ActivityMember member : activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, normalizedUserId)) {
            if (member == null || !"accepted".equals(normalizeStatus(member.getStatus()))) {
                continue;
            }
            String sourceId = normalizeId(member.getOwnerId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
        for (ActivityEvent record : activityEventsRepository.findByOwnerUserId(normalizedUserId)) {
            String sourceId = normalizeId(record == null ? null : record.getSourceId());
            if (StringUtils.hasText(sourceId)) {
                sourceIds.add(sourceId);
            }
        }
        for (String sourceId : sourceIds) {
            syncTicketOverlaysForEvent(sourceId);
        }
    }

    public List<ActivityEvent> queryTicketRecords(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }
        syncTicketOverlaysForUser(normalizedUserId);
        return activityEventsRepository.findByOwnerUserId(normalizedUserId).stream()
                .filter(Objects::nonNull)
                .filter(this::isVisibleTicketRecord)
                .toList();
    }

    public void syncTicketOverlaysForEvent(String eventSourceId) {
        String normalizedSourceId = normalizeId(eventSourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return;
        }

        List<ActivityEvent> sourceRecords = activityEventsRepository.findBySourceId(normalizedSourceId).stream()
                .filter(Objects::nonNull)
                .toList();
        if (sourceRecords.isEmpty()) {
            return;
        }

        ActivityEvent canonical = resolveCanonicalRecord(sourceRecords);
        Map<String, ActivityEvent> participantDirectRecordsByUserId = new LinkedHashMap<>();
        for (ActivityEvent record : sourceRecords) {
            if (!isParticipantDirectRecord(record)) {
                continue;
            }
            String ownerUserId = normalizeId(record.getOwnerUserId());
            if (StringUtils.hasText(ownerUserId)) {
                participantDirectRecordsByUserId.put(ownerUserId, record);
            }
        }

        List<ActivityMember> members = activityMembersRepository.findByOwnerTypeAndOwnerId(OWNER_TYPE_EVENT, normalizedSourceId).stream()
                .filter(Objects::nonNull)
                .toList();
        Set<String> acceptedUserIds = resolveAcceptedUserIds(canonical, members);
        String creatorUserId = normalizeId(canonical == null ? null : canonical.getCreatorUserId());
        boolean ticketEligible = isTicketEligible(canonical);

        LinkedHashSet<String> desiredTicketUserIds = acceptedUserIds.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(creatorUserId))
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        List<ActivityEvent> toSave = new ArrayList<>();
        if (canonical != null) {
            for (String userId : desiredTicketUserIds) {
                ActivityEvent existing = participantDirectRecordsByUserId.get(userId);
                ActivityEvent next = buildParticipantOverlay(existing, canonical, userId, ticketEligible);
                if (existing == null || !overlayEquivalent(existing, next)) {
                    toSave.add(next);
                }
            }
        }

        for (Map.Entry<String, ActivityEvent> entry : participantDirectRecordsByUserId.entrySet()) {
            String userId = entry.getKey();
            ActivityEvent existing = entry.getValue();
            if (desiredTicketUserIds.contains(userId)) {
                continue;
            }
            ActivityEvent next = buildParticipantOverlay(existing, canonical, userId, false);
            if (!overlayEquivalent(existing, next)) {
                toSave.add(next);
            }
        }

        if (!toSave.isEmpty()) {
            activityEventsRepository.saveAll(toSave);
        }
    }

    private ActivityEvent resolveCanonicalRecord(List<ActivityEvent> sourceRecords) {
        ActivityEvent preferred = null;
        for (ActivityEvent record : sourceRecords) {
            if (record == null || Boolean.TRUE.equals(record.getIsInvitation())) {
                continue;
            }
            if (!isCreatorOwnedRecord(record) && preferred != null && isCreatorOwnedRecord(preferred)) {
                continue;
            }
            if (preferred == null) {
                preferred = record;
                continue;
            }
            if (preferCanonicalRecord(record, preferred)) {
                preferred = record;
            }
        }
        return preferred;
    }

    private boolean preferCanonicalRecord(ActivityEvent next, ActivityEvent current) {
        boolean nextCreatorOwned = isCreatorOwnedRecord(next);
        boolean currentCreatorOwned = isCreatorOwnedRecord(current);
        if (nextCreatorOwned != currentCreatorOwned) {
            return nextCreatorOwned;
        }
        if (Boolean.TRUE.equals(next.getIsHosting()) != Boolean.TRUE.equals(current.getIsHosting())) {
            return Boolean.TRUE.equals(next.getIsHosting());
        }
        if (!Objects.equals(Boolean.TRUE.equals(next.getPublished()), Boolean.TRUE.equals(current.getPublished()))) {
            return Boolean.TRUE.equals(next.getPublished());
        }
        int nextAccepted = normalizeCount(next.getAcceptedMembers());
        int currentAccepted = normalizeCount(current.getAcceptedMembers());
        if (nextAccepted != currentAccepted) {
            return nextAccepted > currentAccepted;
        }
        return toSortableDate(next.getUpdatedDate()) >= toSortableDate(current.getUpdatedDate());
    }

    private boolean isCreatorOwnedRecord(ActivityEvent record) {
        return record != null
                && !Boolean.TRUE.equals(record.getIsInvitation())
                && normalizeId(record.getOwnerUserId()).equals(normalizeId(record.getCreatorUserId()));
    }

    private boolean isParticipantDirectRecord(ActivityEvent record) {
        if (record == null || Boolean.TRUE.equals(record.getIsInvitation())) {
            return false;
        }
        if (!TYPE_EVENTS.equals(normalizeType(record.getType()))) {
            return false;
        }
        String ownerUserId = normalizeId(record.getOwnerUserId());
        String creatorUserId = normalizeId(record.getCreatorUserId());
        return StringUtils.hasText(ownerUserId) && !ownerUserId.equals(creatorUserId);
    }

    private Set<String> resolveAcceptedUserIds(ActivityEvent canonical, List<ActivityMember> members) {
        LinkedHashSet<String> acceptedUserIds = new LinkedHashSet<>();
        for (ActivityMember member : members) {
            if (member == null || !"accepted".equals(normalizeStatus(member.getStatus()))) {
                continue;
            }
            String userId = normalizeId(member.getUserId());
            if (StringUtils.hasText(userId)) {
                acceptedUserIds.add(userId);
            }
        }
        String creatorUserId = normalizeId(canonical == null ? null : canonical.getCreatorUserId());
        if (StringUtils.hasText(creatorUserId)) {
            acceptedUserIds.add(creatorUserId);
        }
        return acceptedUserIds;
    }

    private boolean isTicketEligible(ActivityEvent canonical) {
        return canonical != null
                && Boolean.TRUE.equals(canonical.getTicketing())
                && !Boolean.TRUE.equals(canonical.getIsInvitation())
                && !Boolean.TRUE.equals(canonical.getIsTrashed())
                && !Boolean.FALSE.equals(canonical.getPublished());
    }

    private boolean isVisibleTicketRecord(ActivityEvent record) {
        return record != null
                && !Boolean.TRUE.equals(record.getIsInvitation())
                && !Boolean.TRUE.equals(record.getIsTrashed())
                && Boolean.TRUE.equals(record.getTicketing());
    }

    private ActivityEvent buildParticipantOverlay(
            ActivityEvent existing,
            ActivityEvent canonical,
            String ownerUserId,
            boolean ticketingEnabled) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        String nowIso = Instant.now().toString();
        ActivityEvent next = existing == null ? new ActivityEvent() : cloneRecord(existing);

        next.setId(existing != null && StringUtils.hasText(existing.getId()) ? existing.getId() : new ObjectId().toHexString());
        next.setSyncKey(existing != null && StringUtils.hasText(existing.getSyncKey()) ? existing.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setOwnerUserId(normalizedOwnerUserId);
        next.setType(TYPE_EVENTS);
        next.setIsAdmin(false);
        next.setIsInvitation(false);
        next.setIsHosting(false);
        next.setUnread(existing == null ? 0 : normalizeCount(existing.getUnread()));
        next.setActivity(existing == null ? 0 : normalizeCount(existing.getActivity()));

        if (canonical != null) {
            next.setSourceId(normalizeId(canonical.getSourceId()));
            next.setAvatar(safeText(canonical.getAvatar()));
            next.setTitle(safeText(canonical.getTitle()));
            next.setSubtitle(safeText(canonical.getSubtitle()));
            next.setTimeframe(safeText(canonical.getTimeframe()));
            next.setInviter(existing == null ? null : existing.getInviter());
            next.setPublished(Boolean.FALSE.equals(canonical.getPublished()) ? Boolean.FALSE : Boolean.TRUE);
            next.setCreatorUserId(normalizeId(canonical.getCreatorUserId()));
            next.setCreatorName(safeText(canonical.getCreatorName()));
            next.setCreatorInitials(safeText(canonical.getCreatorInitials()));
            next.setCreatorGender(safeText(canonical.getCreatorGender()));
            next.setCreatorCity(safeText(canonical.getCreatorCity()));
            next.setAdmins(canonical.getAdmins() == null ? List.of() : new ArrayList<>(canonical.getAdmins()));
            next.setVisibility(safeText(canonical.getVisibility()));
            next.setBlindMode(safeText(canonical.getBlindMode()));
            next.setStartAtIso(safeNullableText(canonical.getStartAtIso()));
            next.setEndAtIso(safeNullableText(canonical.getEndAtIso()));
            next.setDistanceKm(null);
            next.setImageUrl(safeText(canonical.getImageUrl()));
            next.setSourceLink(safeText(canonical.getSourceLink()));
            next.setLocation(safeText(canonical.getLocation()));
            next.setLocationCoordinates(canonical.getLocationCoordinates());
            next.setLocationGeo(cloneGeoPoint(canonical.getLocationGeo()));
            next.setCapacityMin(nullableCount(canonical.getCapacityMin()));
            next.setCapacityMax(nullableCount(canonical.getCapacityMax()));
            next.setCapacityTotal(normalizeCount(canonical.getCapacityTotal()));
            next.setAutoInviter(Boolean.TRUE.equals(canonical.getAutoInviter()));
            next.setFrequency(safeText(canonical.getFrequency()));
            next.setPricing(canonical.getPricing());
            next.setAcceptedMembers(normalizeCount(canonical.getAcceptedMembers()));
            next.setPendingMembers(normalizeCount(canonical.getPendingMembers()));
            next.setTopics(canonical.getTopics() == null ? List.of() : new ArrayList<>(canonical.getTopics()));
            next.setSubEvents(canonical.getSubEvents() == null ? List.of() : new ArrayList<>(canonical.getSubEvents()));
            next.setSubEventsDisplayMode(safeText(canonical.getSubEventsDisplayMode()));
            next.setRating(safeDouble(canonical.getRating()));
            next.setRelevance(safeDouble(canonical.getRelevance()));
            next.setAffinity(safeDouble(canonical.getAffinity()));
            next.setTicketing(ticketingEnabled);
            boolean existingTrashed = existing != null && Boolean.TRUE.equals(existing.getIsTrashed());
            String existingTrashedAtIso = existing == null ? null : existing.getTrashedAtIso();
            next.setIsTrashed(existingTrashed || Boolean.TRUE.equals(canonical.getIsTrashed()));
            next.setTrashedAtIso(existingTrashed
                    ? firstNonBlank(existingTrashedAtIso, canonical.getTrashedAtIso())
                    : safeNullableText(canonical.getTrashedAtIso()));
        } else {
            next.setTicketing(false);
        }

        next.setCreatedDate(existing == null
                ? normalizeDateTime(canonical == null ? null : canonical.getCreatedDate(), nowIso)
                : normalizeDateTime(existing.getCreatedDate(), nowIso));
        next.setCreatedUser(existing == null
                ? normalizedOwnerUserId
                : safeText(existing.getCreatedUser()));
        next.setUpdatedDate(existing == null
                ? normalizeDateTime(canonical == null ? null : canonical.getUpdatedDate(), nowIso)
                : normalizeDateTime(existing.getUpdatedDate(), nowIso));
        next.setUpdatedUser(existing == null
                ? normalizedOwnerUserId
                : safeText(existing.getUpdatedUser()));
        next.normalizeLifecycleState();
        return next;
    }

    private ActivityEvent cloneRecord(ActivityEvent source) {
        ActivityEvent clone = new ActivityEvent();
        clone.setId(source.getId());
        clone.setSyncKey(source.getSyncKey());
        clone.setSourceId(source.getSourceId());
        clone.setOwnerUserId(source.getOwnerUserId());
        clone.setType(source.getType());
        clone.setStatus(source.getStatus());
        clone.setAvatar(source.getAvatar());
        clone.setTitle(source.getTitle());
        clone.setSubtitle(source.getSubtitle());
        clone.setTimeframe(source.getTimeframe());
        clone.setAdmins(source.getAdmins() == null ? List.of() : new ArrayList<>(source.getAdmins()));
        clone.setInviter(source.getInviter());
        clone.setUnread(source.getUnread());
        clone.setActivity(source.getActivity());
        clone.setIsAdmin(source.getIsAdmin());
        clone.setIsInvitation(source.getIsInvitation());
        clone.setIsHosting(source.getIsHosting());
        clone.setIsTrashed(source.getIsTrashed());
        clone.setPublished(source.getPublished());
        clone.setTrashedAtIso(source.getTrashedAtIso());
        clone.setCreatorUserId(source.getCreatorUserId());
        clone.setCreatorName(source.getCreatorName());
        clone.setCreatorInitials(source.getCreatorInitials());
        clone.setCreatorGender(source.getCreatorGender());
        clone.setCreatorCity(source.getCreatorCity());
        clone.setVisibility(source.getVisibility());
        clone.setBlindMode(source.getBlindMode());
        clone.setStartAtIso(source.getStartAtIso());
        clone.setEndAtIso(source.getEndAtIso());
        clone.setDistanceKm(source.getDistanceKm());
        clone.setImageUrl(source.getImageUrl());
        clone.setSourceLink(source.getSourceLink());
        clone.setLocation(source.getLocation());
        clone.setLocationCoordinates(source.getLocationCoordinates());
        clone.setLocationGeo(cloneGeoPoint(source.getLocationGeo()));
        clone.setCapacityMin(source.getCapacityMin());
        clone.setCapacityMax(source.getCapacityMax());
        clone.setCapacityTotal(source.getCapacityTotal());
        clone.setAutoInviter(source.getAutoInviter());
        clone.setFrequency(source.getFrequency());
        clone.setTicketing(source.getTicketing());
        clone.setPricing(source.getPricing());
        clone.setAcceptedMembers(source.getAcceptedMembers());
        clone.setPendingMembers(source.getPendingMembers());
        clone.setTopics(source.getTopics() == null ? List.of() : new ArrayList<>(source.getTopics()));
        clone.setSubEvents(source.getSubEvents() == null ? List.of() : new ArrayList<>(source.getSubEvents()));
        clone.setSubEventsDisplayMode(source.getSubEventsDisplayMode());
        clone.setRating(source.getRating());
        clone.setRelevance(source.getRelevance());
        clone.setAffinity(source.getAffinity());
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
    }

    private boolean overlayEquivalent(ActivityEvent left, ActivityEvent right) {
        if (left == right) {
            return true;
        }
        if (left == null || right == null) {
            return false;
        }
        return Objects.equals(normalizeId(left.getSourceId()), normalizeId(right.getSourceId()))
                && Objects.equals(normalizeId(left.getOwnerUserId()), normalizeId(right.getOwnerUserId()))
                && Objects.equals(normalizeType(left.getType()), normalizeType(right.getType()))
                && Objects.equals(safeText(left.getAvatar()), safeText(right.getAvatar()))
                && Objects.equals(safeText(left.getTitle()), safeText(right.getTitle()))
                && Objects.equals(safeText(left.getSubtitle()), safeText(right.getSubtitle()))
                && Objects.equals(safeText(left.getTimeframe()), safeText(right.getTimeframe()))
                && normalizeCount(left.getUnread()) == normalizeCount(right.getUnread())
                && normalizeCount(left.getActivity()) == normalizeCount(right.getActivity())
                && Boolean.TRUE.equals(left.getIsAdmin()) == Boolean.TRUE.equals(right.getIsAdmin())
                && Boolean.TRUE.equals(left.getIsInvitation()) == Boolean.TRUE.equals(right.getIsInvitation())
                && Boolean.TRUE.equals(left.getIsHosting()) == Boolean.TRUE.equals(right.getIsHosting())
                && Boolean.TRUE.equals(left.getIsTrashed()) == Boolean.TRUE.equals(right.getIsTrashed())
                && Objects.equals(safeNullableText(left.getTrashedAtIso()), safeNullableText(right.getTrashedAtIso()))
                && Boolean.TRUE.equals(left.getPublished()) == Boolean.TRUE.equals(right.getPublished())
                && Objects.equals(normalizeId(left.getCreatorUserId()), normalizeId(right.getCreatorUserId()))
                && Objects.equals(safeText(left.getCreatorName()), safeText(right.getCreatorName()))
                && Objects.equals(safeText(left.getCreatorInitials()), safeText(right.getCreatorInitials()))
                && Objects.equals(safeText(left.getCreatorGender()), safeText(right.getCreatorGender()))
                && Objects.equals(safeText(left.getCreatorCity()), safeText(right.getCreatorCity()))
                && Objects.equals(safeText(left.getVisibility()), safeText(right.getVisibility()))
                && Objects.equals(safeText(left.getBlindMode()), safeText(right.getBlindMode()))
                && Objects.equals(safeNullableText(left.getStartAtIso()), safeNullableText(right.getStartAtIso()))
                && Objects.equals(safeNullableText(left.getEndAtIso()), safeNullableText(right.getEndAtIso()))
                && Double.compare(safeDouble(left.getDistanceKm()), safeDouble(right.getDistanceKm())) == 0
                && Objects.equals(safeText(left.getImageUrl()), safeText(right.getImageUrl()))
                && Objects.equals(safeText(left.getSourceLink()), safeText(right.getSourceLink()))
                && Objects.equals(safeText(left.getLocation()), safeText(right.getLocation()))
                && Objects.equals(left.getLocationCoordinates(), right.getLocationCoordinates())
                && Objects.equals(left.getLocationGeo(), right.getLocationGeo())
                && Objects.equals(nullableCount(left.getCapacityMin()), nullableCount(right.getCapacityMin()))
                && Objects.equals(nullableCount(left.getCapacityMax()), nullableCount(right.getCapacityMax()))
                && normalizeCount(left.getCapacityTotal()) == normalizeCount(right.getCapacityTotal())
                && Boolean.TRUE.equals(left.getAutoInviter()) == Boolean.TRUE.equals(right.getAutoInviter())
                && Objects.equals(safeText(left.getFrequency()), safeText(right.getFrequency()))
                && Boolean.TRUE.equals(left.getTicketing()) == Boolean.TRUE.equals(right.getTicketing())
                && Objects.equals(left.getPricing(), right.getPricing())
                && normalizeCount(left.getAcceptedMembers()) == normalizeCount(right.getAcceptedMembers())
                && normalizeCount(left.getPendingMembers()) == normalizeCount(right.getPendingMembers())
                && Objects.equals(left.getTopics() == null ? List.of() : left.getTopics(), right.getTopics() == null ? List.of() : right.getTopics())
                && Objects.equals(left.getSubEvents() == null ? List.of() : left.getSubEvents(), right.getSubEvents() == null ? List.of() : right.getSubEvents())
                && Objects.equals(safeText(left.getSubEventsDisplayMode()), safeText(right.getSubEventsDisplayMode()))
                && Double.compare(safeDouble(left.getRating()), safeDouble(right.getRating())) == 0
                && Double.compare(safeDouble(left.getRelevance()), safeDouble(right.getRelevance())) == 0
                && Double.compare(safeDouble(left.getAffinity()), safeDouble(right.getAffinity())) == 0;
    }

    private Integer nullableCount(Number value) {
        return value == null ? null : Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private String normalizeType(String value) {
        return safeText(value);
    }

    private String normalizeStatus(String value) {
        return "accepted".equals(safeText(value)) ? "accepted" : "pending";
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeNullableText(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private double safeDouble(Double value) {
        return value == null || !Double.isFinite(value) ? 0d : value;
    }

    private GeoJsonPoint cloneGeoPoint(GeoJsonPoint source) {
        return source == null ? null : new GeoJsonPoint(source.getX(), source.getY());
    }

    private String normalizeDateTime(String value, String fallback) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : fallback;
    }

    private String firstNonBlank(String first, String second) {
        String firstValue = safeText(first);
        if (StringUtils.hasText(firstValue)) {
            return firstValue;
        }
        return safeNullableText(second);
    }

    private long toSortableDate(String value) {
        try {
            return Instant.parse(safeText(value)).toEpochMilli();
        } catch (Exception ignored) {
            return 0L;
        }
    }
}
