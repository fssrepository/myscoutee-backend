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
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.AccessGrant;
import com.raxim.myscoutee.profile.data.document.AccessPolicyDefinition;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.repository.AccessGrantsRepository;
import com.raxim.myscoutee.profile.repository.AccessPolicyDefinitionsRepository;

import jakarta.annotation.PostConstruct;

@Service("accessControl")
public class AccessControlService implements AccessPolicyData {
    private static final String EFFECT_ALLOW = "allow";
    private static final String EFFECT_DENY = "deny";

    private final AccessGrantsRepository accessGrantsRepository;
    private final AccessPolicyDefinitionsRepository accessPolicyDefinitionsRepository;
    private final ConfigProperties configProperties;
    private final AccessPolicyConditionRegistry conditionRegistry;
    private final MemberPolicyFacts memberPolicyFacts;
    private final ChatPolicyFacts chatPolicyFacts;
    private final AtomicReference<Map<GrantKey, AccessGrantEffect>> accessGrantCache = new AtomicReference<>(Map.of());
    private final AtomicReference<Map<String, AccessPolicy>> accessPolicyCache = new AtomicReference<>(Map.of());

    public AccessControlService(
            AccessGrantsRepository accessGrantsRepository,
            AccessPolicyDefinitionsRepository accessPolicyDefinitionsRepository,
            ConfigProperties configProperties,
            AccessPolicyConditionRegistry conditionRegistry,
            MemberPolicyFacts memberPolicyFacts,
            ChatPolicyFacts chatPolicyFacts) {
        this.accessGrantsRepository = accessGrantsRepository;
        this.accessPolicyDefinitionsRepository = accessPolicyDefinitionsRepository;
        this.configProperties = configProperties;
        this.conditionRegistry = conditionRegistry;
        this.memberPolicyFacts = memberPolicyFacts;
        this.chatPolicyFacts = chatPolicyFacts;
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
            AccessPolicyCondition condition = conditionRegistry.named(conditionName);
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
        String actorId = normalizeId(actorUserId);
        if (policy != null && "chat".equals(policy.resourceType())) {
            String chatActorId = resolveChatActorUserId(normalizedResourceId, actorId);
            if (java.util.Objects.equals(actorId, normalizedSubjectUserId)) {
                normalizedSubjectUserId = chatActorId;
            }
            actorId = chatActorId;
        }
        return policy != null && policy.allows(
                actorId,
                normalizedSubjectUserId,
                normalizedResourceId,
                this);
    }

    public String resolveChatActorUserId(String chatId, String profileId) {
        return chatPolicyFacts.resolveActorUserId(chatId, profileId);
    }

    public boolean canSubmitEventResourceAssignment(Authentication authentication, ActivitySubEventResourceStateDto request) {
        String eventId = normalizeId(request == null ? null : request.authorizationEventId());
        String subEventId = normalizeId(request == null ? null : request.subEventId());
        String assetOwnerUserId = normalizeId(request == null ? null : request.assetOwnerUserId());
        if (!StringUtils.hasText(eventId)
                || !StringUtils.hasText(subEventId)
                || !StringUtils.hasText(assetOwnerUserId)) {
            return false;
        }
        String actorUserId = resolveActorUserId(authentication);
        return StringUtils.hasText(actorUserId)
                && can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT, actorUserId, assetOwnerUserId, eventId);
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

    public boolean canCurrentActorCreateAsset(String ownerUserId, String assetId) {
        return canCurrentActorUseAssetPolicy(AccessPolicyKeys.ASSET_CREATE, ownerUserId, assetId);
    }

    public boolean canCurrentActorReplaceAssets(String ownerUserId) {
        return canCurrentActorUseAssetPolicy(AccessPolicyKeys.ASSET_REPLACE, ownerUserId, ownerUserId);
    }

    public boolean canCurrentActorEditAsset(String ownerUserId, String assetId) {
        return canCurrentActorUseAssetPolicy(AccessPolicyKeys.ASSET_EDIT, ownerUserId, assetId);
    }

    public boolean canCurrentActorDeleteAsset(String ownerUserId, String assetId) {
        return canCurrentActorUseAssetPolicy(AccessPolicyKeys.ASSET_DELETE, ownerUserId, assetId);
    }

    public boolean canCurrentActorRestoreAsset(String ownerUserId, String assetId) {
        return canCurrentActorUseAssetPolicy(AccessPolicyKeys.ASSET_RESTORE, ownerUserId, assetId);
    }

    public boolean canCurrentActorTakeOverAsset(String actorUserId, String assetId) {
        return canCurrentActorUseAssetPolicy(AccessPolicyKeys.ASSET_TAKEOVER, actorUserId, assetId);
    }

    public boolean canCurrentActorPromoteAssetManager(String actorUserId, String assetId) {
        return canCurrentActorUseAssetPolicy(AccessPolicyKeys.ASSET_MANAGER_PROMOTE_ACTOR, actorUserId, assetId);
    }

    public boolean canCurrentActorCreateEvent(String ownerUserId, String eventId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.EVENT_CREATE, ownerUserId, eventId);
    }

    public boolean canCurrentActorEditEvent(String eventId) {
        return canCurrentActorUseCurrentSubjectPolicy(AccessPolicyKeys.EVENT_EDIT, eventId);
    }

    public boolean canCurrentActorPublishEvent(String eventId) {
        return canCurrentActorUseCurrentSubjectPolicy(AccessPolicyKeys.EVENT_PUBLISH, eventId);
    }

    public boolean canCurrentActorUnpublishEvent(String eventId) {
        return canCurrentActorUseCurrentSubjectPolicy(AccessPolicyKeys.EVENT_UNPUBLISH, eventId);
    }

    public boolean canCurrentActorDeleteEvent(String eventId) {
        return canCurrentActorUseCurrentSubjectPolicy(AccessPolicyKeys.EVENT_DELETE, eventId);
    }

    public boolean canCurrentActorRestoreEvent(String eventId) {
        return canCurrentActorUseCurrentSubjectPolicy(AccessPolicyKeys.EVENT_RESTORE, eventId);
    }

    public boolean canCurrentActorTakeOverEvent(String eventId) {
        return canCurrentActorUseCurrentSubjectPolicy(AccessPolicyKeys.EVENT_TAKEOVER, eventId);
    }

    public boolean canCurrentActorJoinEvent(String userId, String eventId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.EVENT_JOIN, userId, eventId);
    }

    public boolean canCurrentActorApplyEventStageAction(String eventId) {
        return canCurrentActorUseCurrentSubjectPolicy(AccessPolicyKeys.EVENT_STAGE_ACTION, eventId);
    }

    public boolean canCurrentActorRequestAssetBorrow(String requesterUserId, String eventId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.ASSET_BORROW_REQUEST, requesterUserId, eventId);
    }

    public boolean canCurrentActorApproveAssetBorrow(String requesterUserId, String assetId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.ASSET_BORROW_APPROVE, requesterUserId, assetId);
    }

    public boolean canCurrentActorRejectAssetBorrow(String requesterUserId, String assetId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.ASSET_BORROW_REJECT, requesterUserId, assetId);
    }

    public boolean canCurrentActorCancelAssetBorrow(String requesterUserId, String assetId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.ASSET_BORROW_CANCEL, requesterUserId, assetId);
    }

    public boolean canCurrentActorSubmitLeaderboardEntry(String actorUserId, String eventId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.EVENT_LEADERBOARD_ENTRY_SUBMIT, actorUserId, eventId);
    }

    public boolean canCurrentActorSubmitEventFeedback(String userId, String eventId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.EVENT_FEEDBACK_SUBMIT, userId, eventId);
    }

    public boolean canCurrentActorSaveEventFeedbackNote(String userId, String eventId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.EVENT_FEEDBACK_NOTE, userId, eventId);
    }

    public boolean canCurrentActorRemoveEventFeedback(String userId, String eventId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.EVENT_FEEDBACK_REMOVE, userId, eventId);
    }

    public boolean canCurrentActorRestoreEventFeedback(String userId, String eventId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.EVENT_FEEDBACK_RESTORE, userId, eventId);
    }

    public boolean canCurrentActorCreateChatMessage(String userId, String chatId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.CHAT_MESSAGE_CREATE, userId, chatId);
    }

    public boolean canCurrentActorEditChatMessage(String userId, String chatId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.CHAT_MESSAGE_EDIT, userId, chatId);
    }

    public boolean canCurrentActorDeleteChatMessage(String userId, String chatId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.CHAT_MESSAGE_DELETE, userId, chatId);
    }

    public boolean canCurrentActorPinChatMessage(String userId, String chatId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.CHAT_MESSAGE_PIN, userId, chatId);
    }

    public boolean canCurrentActorManageChatReaction(String userId, String chatId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.CHAT_REACTION_MANAGE, userId, chatId);
    }

    public boolean canCurrentActorAddChatAttachment(String userId, String chatId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.CHAT_ATTACHMENT_ADD, userId, chatId);
    }

    public boolean canCurrentActorManageSupportChat(String userId, String chatId) {
        return canCurrentActorUsePolicy(AccessPolicyKeys.CHAT_SUPPORT_MANAGE, userId, chatId);
    }

    public boolean canCurrentActorEditProfile(String userId) {
        String normalizedUserId = normalizeId(userId);
        return canCurrentActorUsePolicy(AccessPolicyKeys.USER_PROFILE_EDIT, normalizedUserId, normalizedUserId);
    }

    public boolean canCurrentActorDeleteProfile(String userId) {
        String normalizedUserId = normalizeId(userId);
        return canCurrentActorUsePolicy(AccessPolicyKeys.USER_PROFILE_DELETE, normalizedUserId, normalizedUserId);
    }

    public boolean canCurrentActorUploadMedia(String ownerUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        return canCurrentActorUsePolicy(AccessPolicyKeys.USER_MEDIA_UPLOAD, normalizedOwnerUserId, normalizedOwnerUserId);
    }

    public boolean canCurrentActorImportMedia(String ownerUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        return canCurrentActorUsePolicy(AccessPolicyKeys.USER_MEDIA_IMPORT, normalizedOwnerUserId, normalizedOwnerUserId);
    }

    public boolean canCurrentActorSubmitPrivacyConsent(String userId) {
        String normalizedUserId = normalizeId(userId);
        return canCurrentActorUsePolicy(AccessPolicyKeys.PRIVACY_CONSENT_SUBMIT, normalizedUserId, normalizedUserId);
    }

    private boolean canCurrentActorUseAssetPolicy(String policyKey, String subjectUserId, String resourceId) {
        boolean allowed = requiresAuthenticatedActor()
                ? can(policyKey, memberPolicyFacts.accountUserId(resolveActorUserId(
                        SecurityContextHolder.getContext().getAuthentication())), subjectUserId, resourceId)
                : canCurrentActorUsePolicy(policyKey, subjectUserId, resourceId);
        if (!allowed) {
            return false;
        }
        boolean existingOwnerAction = AccessPolicyKeys.ASSET_EDIT.equals(policyKey)
                || AccessPolicyKeys.ASSET_DELETE.equals(policyKey)
                || AccessPolicyKeys.ASSET_RESTORE.equals(policyKey);
        return !requiresAuthenticatedActor() || !existingOwnerAction
                || memberPolicyFacts.isAssetOwner(resourceId, subjectUserId);
    }

    private boolean canCurrentActorUsePolicy(String policyKey, String subjectUserId, String resourceId) {
        String normalizedSubjectUserId = normalizeId(subjectUserId);
        String normalizedResourceId = normalizeId(resourceId);
        if (!StringUtils.hasText(normalizedSubjectUserId) || !StringUtils.hasText(normalizedResourceId)) {
            return false;
        }
        if (!requiresAuthenticatedActor()) {
            return true;
        }
        String actorUserId = resolveActorUserId(SecurityContextHolder.getContext().getAuthentication());
        return can(policyKey, actorUserId, normalizedSubjectUserId, normalizedResourceId);
    }

    private boolean canCurrentActorUseCurrentSubjectPolicy(String policyKey, String resourceId) {
        String normalizedResourceId = normalizeId(resourceId);
        if (!StringUtils.hasText(normalizedResourceId)) {
            return false;
        }
        String actorUserId = resolveActorUserId(SecurityContextHolder.getContext().getAuthentication());
        return StringUtils.hasText(actorUserId)
                && can(policyKey, actorUserId, actorUserId, normalizedResourceId);
    }

    public boolean canManageEventMembers(String eventId, String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
        }
        return can(AccessPolicyKeys.EVENT_MEMBER_MANAGE, normalizedActorUserId, normalizedActorUserId, normalizedEventId);
    }

    public boolean canCurrentActorViewEventMembers(String eventId) {
        return canCurrentActorUseCurrentSubjectPolicy(AccessPolicyKeys.EVENT_MEMBER_VIEW, eventId);
    }

    public boolean canAcceptEventMember(String eventId, String actorUserId, String targetUserId) {
        return canEventMemberAction(
                AccessPolicyKeys.EVENT_MEMBER_ACCEPT,
                eventId,
                actorUserId,
                targetUserId);
    }

    public boolean canRemoveEventMember(String eventId, String actorUserId, String targetUserId) {
        return canEventMemberAction(
                AccessPolicyKeys.EVENT_MEMBER_REMOVE,
                eventId,
                actorUserId,
                targetUserId);
    }

    public boolean canDisqualifyEventMember(String eventId, String actorUserId, String targetUserId) {
        return canEventMemberAction(
                AccessPolicyKeys.EVENT_MEMBER_DISQUALIFY,
                eventId,
                actorUserId,
                targetUserId);
    }

    public boolean canReinstateEventMember(String eventId, String actorUserId, String targetUserId) {
        return canEventMemberAction(
                AccessPolicyKeys.EVENT_MEMBER_REINSTATE,
                eventId,
                actorUserId,
                targetUserId);
    }

    public boolean canInviteEventMembers(String eventId, String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
        }
        return can(AccessPolicyKeys.EVENT_MEMBER_INVITE, normalizedActorUserId, normalizedActorUserId, normalizedEventId);
    }

    public boolean canCurrentActorManageEventResourceAssignment(ActivitySubEventResourceStateDto request) {
        String eventId = normalizeId(request == null ? null : request.authorizationEventId());
        if (!StringUtils.hasText(eventId)) {
            return false;
        }
        String actorUserId = resolveActorUserId(SecurityContextHolder.getContext().getAuthentication());
        return StringUtils.hasText(actorUserId)
                && can(AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE, actorUserId, actorUserId, eventId);
    }

    public boolean canCleanupEventResourceAssignments(String eventId, String actorUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
        }
        return can(AccessPolicyKeys.RESOURCE_ASSIGN_CLEANUP, normalizedActorUserId, normalizedActorUserId, normalizedEventId);
    }

    private boolean canEventMemberAction(String policyKey, String eventId, String actorUserId, String targetUserId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedActorUserId = normalizeId(actorUserId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        if (!StringUtils.hasText(normalizedEventId)
                || !StringUtils.hasText(normalizedActorUserId)
                || !StringUtils.hasText(normalizedTargetUserId)) {
            return false;
        }
        return can(policyKey, normalizedActorUserId, normalizedTargetUserId, normalizedEventId);
    }

    @Override
    public boolean hasAcceptedParticipation(String ownerType, String ownerId, String userId) {
        return memberPolicyFacts.hasAcceptedParticipation(ownerType, ownerId, userId);
    }

    @Override
    public boolean hasMemberStatus(String ownerType, String ownerId, String userId, String status) {
        return memberPolicyFacts.hasMemberStatus(ownerType, ownerId, userId, status);
    }

    @Override
    public boolean canManageMembers(String ownerType, String ownerId, String actorUserId) {
        return memberPolicyFacts.canManageMembers(ownerType, ownerId, actorUserId);
    }

    @Override
    public boolean isProtectedMember(String ownerType, String ownerId, String userId) {
        return memberPolicyFacts.isProtectedMember(ownerType, ownerId, userId);
    }

    @Override
    public boolean canManageEvent(String eventId, String actorUserId) {
        return memberPolicyFacts.canManageEvent(eventId, actorUserId);
    }

    @Override
    public boolean canTakeOverEvent(String eventId, String actorUserId) {
        return memberPolicyFacts.canTakeOverEvent(eventId, actorUserId);
    }

    @Override
    public boolean canManageAsset(String assetId, String actorUserId) {
        return memberPolicyFacts.canManageAsset(assetId, actorUserId);
    }

    @Override
    public boolean canTakeOverAsset(String assetId, String actorUserId) {
        return memberPolicyFacts.canTakeOverAsset(assetId, actorUserId);
    }

    @Override
    public boolean canAccessChat(String chatId, String actorUserId) {
        return chatPolicyFacts.canAccessChat(chatId, actorUserId);
    }

    @Override
    public boolean canManageSupportChat(String chatId, String actorUserId) {
        return chatPolicyFacts.canManageSupportChat(chatId, actorUserId);
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
        return !configProperties.isMemberFallbackEnabled() && !isDemoSessionRequest();
    }

    private boolean isDemoSessionRequest() {
        // WebSocket callbacks retain the routed session mode after the HTTP
        // handshake request has ended.
        if (MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO) {
            return true;
        }
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (!(requestAttributes instanceof ServletRequestAttributes servletRequestAttributes)) {
            return false;
        }
        return DemoSessionRequestSupport.isDemoSessionRequest(servletRequestAttributes.getRequest());
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
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
