package com.raxim.myscoutee.profile.security;

import java.time.Instant;
import java.util.Collection;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Component
public class MemberPolicyFacts {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String EVENT_STATUS_UNDER_REVIEW = "UR";
    private static final String ASSET_STATUS_UNDER_REVIEW = "UR";
    private static final String ASSET_STATUS_TRASHED = "T";
    private static final String USER_STATUS_BLOCKED = "B";
    private static final String USER_STATUS_DELETED = "D";
    private static final String USER_STATUS_INACTIVE = "I";
    private static final Set<String> EVENT_ADMIN_ROLES = Set.of("Admin");
    private static final Set<String> MANAGER_ROLES = Set.of("Admin", "Manager");

    private final ActivityMembersRepository activityMembersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final AssetsRepository assetsRepository;
    private final UsersRepository usersRepository;

    public MemberPolicyFacts(
            ActivityMembersRepository activityMembersRepository,
            ActivityEventsRepository activityEventsRepository,
            AssetsRepository assetsRepository,
            UsersRepository usersRepository) {
        this.activityMembersRepository = activityMembersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.assetsRepository = assetsRepository;
        this.usersRepository = usersRepository;
    }

    public boolean hasAcceptedParticipation(String ownerType, String ownerId, String userId) {
        return hasMemberStatus(ownerType, ownerId, userId, STATUS_ACCEPTED);
    }

    public boolean hasMemberStatus(String ownerType, String ownerId, String userId, String status) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedUserId = normalizeId(userId);
        String normalizedStatus = normalizeStatus(status);
        if (!StringUtils.hasText(normalizedOwnerType)
                || !StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedUserId)
                || !StringUtils.hasText(normalizedStatus)) {
            return false;
        }
        return activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                        normalizedOwnerType,
                        normalizedOwnerId,
                        normalizedUserId)
                .filter(member -> normalizedStatus.equals(normalizeStatus(member.getStatus())))
                .isPresent();
    }

    public boolean canManageMembers(String ownerType, String ownerId, String actorUserId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedOwnerType)
                || !StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
        }
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)) {
            return isEventCreatorOrAdmin(normalizedOwnerId, normalizedActorUserId)
                    || hasAcceptedRole(
                            normalizedOwnerType,
                            normalizedOwnerId,
                            normalizedActorUserId,
                            EVENT_ADMIN_ROLES);
        }
        if (OWNER_TYPE_ASSET.equals(normalizedOwnerType) && isAssetOwner(normalizedOwnerId, normalizedActorUserId)) {
            return true;
        }
        return hasAcceptedManagerRole(normalizedOwnerType, normalizedOwnerId, normalizedActorUserId);
    }

    public boolean isProtectedMember(String ownerType, String ownerId, String userId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedOwnerType)
                || !StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedUserId)) {
            return true;
        }
        if (OWNER_TYPE_EVENT.equals(normalizedOwnerType)) {
            return isEventCreator(normalizedOwnerId, normalizedUserId)
                    || hasAcceptedRole(
                            normalizedOwnerType,
                            normalizedOwnerId,
                            normalizedUserId,
                            EVENT_ADMIN_ROLES);
        }
        if (OWNER_TYPE_ASSET.equals(normalizedOwnerType) && isAssetOwner(normalizedOwnerId, normalizedUserId)) {
            return true;
        }
        return hasAcceptedManagerRole(normalizedOwnerType, normalizedOwnerId, normalizedUserId);
    }

    public boolean canManageEvent(String eventId, String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedActorUserId)
                || !isActiveUser(normalizedActorUserId)) {
            return false;
        }
        ActivityEvent eventRecord = findPreferredEventRecord(normalizedEventId);
        if (eventRecord == null) {
            return false;
        }
        return isEventCreatorOrAdmin(normalizedEventId, normalizedActorUserId)
                || hasAcceptedManagerRole(OWNER_TYPE_EVENT, normalizedEventId, normalizedActorUserId);
    }

    public boolean canTakeOverEvent(String eventId, String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedActorUserId)
                || !isActiveUser(normalizedActorUserId)) {
            return false;
        }
        ActivityEvent eventRecord = findPreferredEventRecord(normalizedEventId);
        return eventRecord != null
                && EVENT_STATUS_UNDER_REVIEW.equals(safeText(eventRecord.getStatus()))
                && (isEventCreatorOrAdmin(normalizedEventId, normalizedActorUserId)
                        || hasAcceptedManagerRole(OWNER_TYPE_EVENT, normalizedEventId, normalizedActorUserId));
    }

    public boolean canManageAsset(String assetId, String actorUserId) {
        String normalizedAssetId = normalizeId(assetId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedAssetId)
                || !StringUtils.hasText(normalizedActorUserId)
                || !isActiveUser(normalizedActorUserId)) {
            return false;
        }
        Asset asset = assetsRepository.findByAssetId(normalizedAssetId).orElse(null);
        if (asset == null || ASSET_STATUS_TRASHED.equals(safeText(asset.getStatus()))) {
            return false;
        }
        if (normalizedActorUserId.equals(normalizeId(asset.getOwnerUserId()))) {
            return !isOwnerResponsibilityReleased(asset);
        }
        return hasAcceptedManagerRole(OWNER_TYPE_ASSET, normalizedAssetId, normalizedActorUserId);
    }

    public boolean canTakeOverAsset(String assetId, String actorUserId) {
        String normalizedAssetId = normalizeId(assetId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedAssetId)
                || !StringUtils.hasText(normalizedActorUserId)
                || !isActiveUser(normalizedActorUserId)) {
            return false;
        }
        Asset asset = assetsRepository.findByAssetId(normalizedAssetId).orElse(null);
        if (asset == null || !ASSET_STATUS_UNDER_REVIEW.equals(safeText(asset.getStatus()))) {
            return false;
        }
        if (normalizedActorUserId.equals(normalizeId(asset.getOwnerUserId()))) {
            return !isOwnerResponsibilityReleased(asset);
        }
        return hasAcceptedManagerRole(OWNER_TYPE_ASSET, normalizedAssetId, normalizedActorUserId);
    }

    private boolean isEventCreatorOrAdmin(String eventId, String userId) {
        ActivityEvent eventRecord = findPreferredEventRecord(eventId);
        if (eventRecord == null) {
            return false;
        }
        String normalizedUserId = normalizeId(userId);
        return normalizedUserId.equals(normalizeId(eventRecord.getCreatorUserId()))
                || normalizeIds(eventRecord.getAdmins()).contains(normalizedUserId);
    }

    private boolean isEventCreator(String eventId, String userId) {
        ActivityEvent eventRecord = findPreferredEventRecord(eventId);
        return eventRecord != null && normalizeId(userId).equals(normalizeId(eventRecord.getCreatorUserId()));
    }

    private ActivityEvent findPreferredEventRecord(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return null;
        }
        ActivityEvent preferred = null;
        for (ActivityEvent document : activityEventsRepository.findBySourceId(normalizedSourceId)) {
            if (document == null) {
                continue;
            }
            if (preferred == null || preferEventRecord(document, preferred)) {
                preferred = document;
            }
        }
        return preferred;
    }

    private boolean preferEventRecord(ActivityEvent next, ActivityEvent current) {
        return toSortableDate(next == null ? null : next.getUpdatedDate()) >= toSortableDate(current == null ? null : current.getUpdatedDate());
    }

    private boolean isAssetOwner(String assetId, String userId) {
        String normalizedAssetId = normalizeId(assetId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedAssetId) || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return assetsRepository.findByAssetId(normalizedAssetId)
                .filter(asset -> !isOwnerResponsibilityReleased(asset))
                .filter(asset -> normalizedUserId.equals(normalizeId(asset.getOwnerUserId())))
                .isPresent();
    }

    private boolean isOwnerResponsibilityReleased(Asset asset) {
        return asset != null && StringUtils.hasText(safeText(asset.getOwnerReleasedAtIso()));
    }

    private boolean hasAcceptedManagerRole(String ownerType, String ownerId, String userId) {
        return hasAcceptedRole(ownerType, ownerId, userId, MANAGER_ROLES);
    }

    private boolean hasAcceptedRole(
            String ownerType,
            String ownerId,
            String userId,
            Set<String> roles) {
        return activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(ownerType, ownerId, userId)
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .map(ActivityMember::getRole)
                .map(this::safeText)
                .filter(roles::contains)
                .isPresent();
    }

    private boolean isActiveUser(String userId) {
        return usersRepository.findByUserId(normalizeId(userId))
                .map(user -> {
                    String profileStatus = safeText(user.getProfileStatus());
                    String status = safeText(user.getStatus());
                    return !"blocked".equals(profileStatus)
                            && !"deleted".equals(profileStatus)
                            && !"inactive".equals(profileStatus)
                            && !USER_STATUS_BLOCKED.equalsIgnoreCase(status)
                            && !USER_STATUS_DELETED.equalsIgnoreCase(status)
                            && !USER_STATUS_INACTIVE.equalsIgnoreCase(status);
                })
                .orElse(false);
    }

    private Set<String> normalizeIds(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return Set.of();
        }
        return values.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(java.util.stream.Collectors.toUnmodifiableSet());
    }

    private long toSortableDate(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return 0L;
        }
        try {
            return Instant.parse(normalizedValue).toEpochMilli();
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private String normalizeStatus(String status) {
        String normalizedStatus = safeText(status).toLowerCase(Locale.ROOT);
        if ("a".equals(normalizedStatus)) {
            return STATUS_ACCEPTED;
        }
        return normalizedStatus;
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private String normalizeOwnerType(String ownerType) {
        String normalizedOwnerType = safeText(ownerType);
        return StringUtils.hasText(normalizedOwnerType) ? normalizedOwnerType : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
