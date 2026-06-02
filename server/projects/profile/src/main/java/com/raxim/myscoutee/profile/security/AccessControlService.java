package com.raxim.myscoutee.profile.security;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.DemoSessionRequestSupport;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.AccessGrant;
import com.raxim.myscoutee.profile.data.document.AccessPolicyDefinition;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.repository.AccessGrantsRepository;
import com.raxim.myscoutee.profile.repository.AccessPolicyDefinitionsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;

import jakarta.annotation.PostConstruct;

@Service("accessControl")
public class AccessControlService implements AccessPolicyData {
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String EFFECT_ALLOW = "allow";
    private static final String EFFECT_DENY = "deny";

    private final ActivityMembersRepository activityMembersRepository;
    private final AccessGrantsRepository accessGrantsRepository;
    private final AccessPolicyDefinitionsRepository accessPolicyDefinitionsRepository;
    private final ConfigProperties configProperties;
    private final AtomicReference<Map<GrantKey, AccessGrantEffect>> accessGrantCache = new AtomicReference<>(Map.of());
    private final AtomicReference<Map<String, AccessPolicy>> accessPolicyCache = new AtomicReference<>(Map.of());

    public AccessControlService(
            ActivityMembersRepository activityMembersRepository,
            AccessGrantsRepository accessGrantsRepository,
            AccessPolicyDefinitionsRepository accessPolicyDefinitionsRepository,
            ConfigProperties configProperties) {
        this.activityMembersRepository = activityMembersRepository;
        this.accessGrantsRepository = accessGrantsRepository;
        this.accessPolicyDefinitionsRepository = accessPolicyDefinitionsRepository;
        this.configProperties = configProperties;
    }

    @PostConstruct
    public void loadAccessControlCacheAtStartup() {
        refreshAccessControlCache();
    }

    @Scheduled(fixedDelayString = "${access-control.cache-refresh-ms:1800000}")
    public void refreshAccessControlCache() {
        refreshAccessPolicyCache();
        refreshAccessGrantCache();
    }

    public void refreshAccessPolicyCache() {
        Map<String, AccessPolicy> nextCache = new LinkedHashMap<>();
        for (AccessPolicyDefinition definition : accessPolicyDefinitionsRepository.findAll()) {
            AccessPolicy policy = compilePolicy(definition);
            if (policy != null) {
                nextCache.put(policy.policyKey(), policy);
            }
        }
        accessPolicyCache.set(Map.copyOf(nextCache));
    }

    public void refreshAccessGrantCache() {
        Map<GrantKey, AccessGrantEffect> nextCache = new LinkedHashMap<>();
        Instant now = Instant.now();
        for (AccessGrant grant : accessGrantsRepository.findAll()) {
            GrantKey key = grantKey(grant);
            AccessGrantEffect effect = grantEffect(grant);
            if (key == null || effect == null || isExpired(grant == null ? null : grant.getExpiresAtIso(), now)) {
                continue;
            }
            AccessGrantEffect current = nextCache.get(key);
            if (current == AccessGrantEffect.DENY) {
                continue;
            }
            nextCache.put(key, effect);
        }
        accessGrantCache.set(Map.copyOf(nextCache));
    }

    private AccessPolicy compilePolicy(AccessPolicyDefinition definition) {
        if (definition == null || !isPolicyEnabled(definition.getStatus())) {
            return null;
        }
        String policyKey = safeText(definition.getPolicyKey());
        String permission = safeText(definition.getPermission());
        String resourceType = safeText(definition.getResourceType());
        if (!StringUtils.hasText(policyKey)
                || !StringUtils.hasText(permission)
                || !StringUtils.hasText(resourceType)) {
            return null;
        }

        List<AccessPolicyCondition> required = compileConditions(definition.getRequired());
        List<AccessPolicyCondition> anyOf = compileConditions(definition.getAnyOf());
        if (required == null || anyOf == null) {
            return null;
        }
        return new AccessPolicy(policyKey, permission, resourceType, required, anyOf);
    }

    private List<AccessPolicyCondition> compileConditions(List<String> conditionNames) {
        if (conditionNames == null || conditionNames.isEmpty()) {
            return List.of();
        }
        List<AccessPolicyCondition> conditions = new ArrayList<>();
        for (String conditionName : conditionNames) {
            AccessPolicyCondition condition = AccessPolicyConditions.named(conditionName);
            if (condition == null) {
                return null;
            }
            conditions.add(condition);
        }
        return conditions;
    }

    public boolean can(String policyKey, String actorUserId, String subjectUserId, String resourceId) {
        String normalizedPolicyKey = safeText(policyKey);
        String normalizedSubjectUserId = normalizeId(subjectUserId);
        String normalizedResourceId = normalizeId(resourceId);
        if (!StringUtils.hasText(normalizedPolicyKey)
                || !StringUtils.hasText(normalizedSubjectUserId)
                || !StringUtils.hasText(normalizedResourceId)) {
            return false;
        }

        AccessPolicy policy = accessPolicyCache.get().get(normalizedPolicyKey);
        return policy != null && policy.allows(
                normalizeId(actorUserId),
                normalizedSubjectUserId,
                normalizedResourceId,
                this);
    }

    public boolean canSubmitEventResourceAssignment(Authentication authentication, ActivitySubEventResourceStateDto request) {
        String eventId = normalizeId(request == null ? null : request.ownerId());
        String subEventId = normalizeId(request == null ? null : request.subEventId());
        String assetOwnerUserId = normalizeId(request == null ? null : request.assetOwnerUserId());
        if (!StringUtils.hasText(eventId)
                || !StringUtils.hasText(subEventId)
                || !StringUtils.hasText(assetOwnerUserId)) {
            return false;
        }
        if (!requiresAuthenticatedActor()) {
            return true;
        }

        String actorUserId = resolveActorUserId(authentication);
        return can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT, actorUserId, assetOwnerUserId, eventId);
    }

    public boolean canCurrentActorAssignEventResources(ActivitySubEventResourceStateDto request) {
        return canSubmitEventResourceAssignment(SecurityContextHolder.getContext().getAuthentication(), request);
    }

    public boolean canAssignEventResourcesForSubject(String eventId, String userId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBJECT, null, normalizedUserId, normalizedEventId);
    }

    public boolean canReceiveEventAssetManagerRole(String eventId, String userId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return can(AccessPolicyKeys.ASSET_MANAGER_PROMOTE_TARGET, null, normalizedUserId, normalizedEventId);
    }

    @Override
    public boolean hasAcceptedParticipation(String ownerType, String ownerId, String userId) {
        String normalizedOwnerType = normalizeOwnerType(ownerType);
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedOwnerType)
                || !StringUtils.hasText(normalizedOwnerId)
                || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                        normalizedOwnerType,
                        normalizedOwnerId,
                        normalizedUserId)
                .filter(member -> STATUS_ACCEPTED.equals(normalizeStatus(member.getStatus())))
                .isPresent();
    }

    public String resolveActorUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof FirebasePrincipal firebasePrincipal) {
            return normalizeId(firebasePrincipal.getUserId());
        }
        if (principal instanceof String value) {
            return normalizeId(value);
        }
        return normalizeId(authentication.getName());
    }

    @Override
    public boolean hasExplicitGrant(
            String subjectUserId,
            String permission,
            String resourceType,
            String resourceId,
            AccessGrantEffect expectedEffect) {
        AccessGrantEffect effect = accessGrantCache.get().get(new GrantKey(
                normalizeId(subjectUserId),
                safeText(permission),
                safeText(resourceType),
                normalizeId(resourceId)));
        return expectedEffect == effect;
    }

    private GrantKey grantKey(AccessGrant grant) {
        if (grant == null) {
            return null;
        }
        String subjectUserId = normalizeId(grant.getSubjectUserId());
        String permission = safeText(grant.getPermission());
        String resourceType = safeText(grant.getResourceType());
        String resourceId = normalizeId(grant.getResourceId());
        if (!StringUtils.hasText(subjectUserId)
                || !StringUtils.hasText(permission)
                || !StringUtils.hasText(resourceType)
                || !StringUtils.hasText(resourceId)) {
            return null;
        }
        return new GrantKey(subjectUserId, permission, resourceType, resourceId);
    }

    private AccessGrantEffect grantEffect(AccessGrant grant) {
        String effect = safeText(grant == null ? null : grant.getEffect()).toLowerCase(Locale.ROOT);
        if (EFFECT_DENY.equals(effect)) {
            return AccessGrantEffect.DENY;
        }
        if (EFFECT_ALLOW.equals(effect)) {
            return AccessGrantEffect.ALLOW;
        }
        return null;
    }

    private boolean isExpired(String expiresAtIso, Instant now) {
        String normalizedExpiresAtIso = safeText(expiresAtIso);
        if (!StringUtils.hasText(normalizedExpiresAtIso)) {
            return false;
        }
        try {
            return Instant.parse(normalizedExpiresAtIso).isBefore(now);
        } catch (Exception ignored) {
            return true;
        }
    }

    private boolean isPolicyEnabled(String status) {
        String normalizedStatus = safeText(status).toLowerCase(Locale.ROOT);
        return !"disabled".equals(normalizedStatus)
                && !"inactive".equals(normalizedStatus)
                && !"d".equals(normalizedStatus);
    }

    public boolean requiresAuthenticatedActor() {
        return configProperties.isFirebaseEnabled() && !isDemoSessionRequest();
    }

    private boolean isDemoSessionRequest() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (!(requestAttributes instanceof ServletRequestAttributes servletRequestAttributes)) {
            return false;
        }
        return DemoSessionRequestSupport.isDemoSessionRequest(servletRequestAttributes.getRequest());
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

    private record GrantKey(
            String subjectUserId,
            String permission,
            String resourceType,
            String resourceId) {
    }
}
