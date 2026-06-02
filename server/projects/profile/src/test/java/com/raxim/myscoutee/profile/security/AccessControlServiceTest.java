package com.raxim.myscoutee.profile.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.raxim.myscoutee.common.config.firebase.FirebaseAuthenticationToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.AccessGrant;
import com.raxim.myscoutee.profile.data.document.AccessPolicyDefinition;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.repository.AccessGrantsRepository;
import com.raxim.myscoutee.profile.repository.AccessPolicyDefinitionsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;

@ExtendWith(MockitoExtension.class)
class AccessControlServiceTest {
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private AssetsRepository assetsRepository;
    @Mock
    private AccessGrantsRepository accessGrantsRepository;
    @Mock
    private AccessPolicyDefinitionsRepository accessPolicyDefinitionsRepository;

    private ConfigProperties configProperties;
    private AccessControlService service;

    @BeforeEach
    void setUp() {
        configProperties = new ConfigProperties();
        configProperties.setFirebaseEnabled(true);
        when(accessGrantsRepository.findAll()).thenReturn(List.of());
        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(defaultPolicyDefinitions());
        service = new AccessControlService(
                accessGrantsRepository,
                accessPolicyDefinitionsRepository,
                configProperties,
                AccessPolicyTestSupport.conditionRegistry(),
                new MemberPolicyFacts(activityMembersRepository, activityEventsRepository, assetsRepository));
        service.loadAccessControlCacheAtStartup();
    }

    @Test
    void allowsAuthenticatedParticipantToSubmitOwnEventResourceAssignment() {
        boolean allowed = service.canSubmitEventResourceAssignment(auth("u1"), request("event-1", "sub-1", "u1"));

        assertThat(allowed).isTrue();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void refreshAccessControlCacheIsScheduledForThirtyMinuteInMemoryReloads() throws Exception {
        Method method = AccessControlService.class.getDeclaredMethod("refreshAccessControlCache");

        Scheduled scheduled = method.getAnnotation(Scheduled.class);

        assertThat(scheduled).isNotNull();
        assertThat(scheduled.fixedDelayString()).isEqualTo("${access-control.cache-refresh-ms:1800000}");
    }

    @Test
    void cacheRefreshOnlyReadsPoliciesAndGrantsIntoMemory() {
        clearInvocations(accessPolicyDefinitionsRepository, accessGrantsRepository);

        service.refreshAccessControlCache();

        verify(accessPolicyDefinitionsRepository).findAll();
        verify(accessGrantsRepository).findAll();
        verify(accessPolicyDefinitionsRepository, never()).save(any(AccessPolicyDefinition.class));
        verify(accessGrantsRepository, never()).save(any(AccessGrant.class));
    }

    @Test
    void rejectsAuthenticatedUserAssigningForAnotherAssetOwner() {
        boolean allowed = service.canSubmitEventResourceAssignment(auth("u2"), request("event-1", "sub-1", "u1"));

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void rejectsInvalidEventResourceAssignmentInput() {
        assertThat(service.canSubmitEventResourceAssignment(auth("u1"), request("", "sub-1", "u1"))).isFalse();
        assertThat(service.canSubmitEventResourceAssignment(auth("u1"), request("event-1", "", "u1"))).isFalse();
        assertThat(service.canSubmitEventResourceAssignment(auth("u1"), request("event-1", "sub-1", ""))).isFalse();
        assertThat(service.canAssignEventResourcesForSubject("", "u1")).isFalse();
        assertThat(service.canAssignEventResourcesForSubject("event-1", "")).isFalse();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void rejectsUserWithoutAcceptedEventParticipation() {
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "pending")));

        boolean allowed = service.canAssignEventResourcesForSubject("event-1", "u1");

        assertThat(allowed).isFalse();
    }

    @Test
    void allowsDevModeToFallThroughToServiceMembershipInvariant() {
        configProperties.setFirebaseEnabled(false);

        boolean allowed = service.canSubmitEventResourceAssignment(null, request("event-1", "sub-1", "u1"));

        assertThat(allowed).isTrue();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void allowsExplicitCachedGrantToAssignEventResources() {
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "resource.assign", "event", "event-1", "allow")));
        service.refreshAccessControlCache();
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.empty());

        boolean allowed = service.canAssignEventResourcesForSubject("event-1", "u1");

        assertThat(allowed).isTrue();
    }

    @Test
    void cachedDenyOverridesAcceptedEventParticipation() {
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "resource.assign", "event", "event-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canAssignEventResourcesForSubject("event-1", "u1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void deniesWhenMongoPolicyDefinitionIsMissing() {
        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(List.of());
        service.refreshAccessControlCache();

        boolean allowed = service.canAssignEventResourcesForSubject("event-1", "u1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void ignoresMongoPolicyDefinitionWithUnknownCondition() {
        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(List.of(policy(
                AccessPolicyKeys.RESOURCE_ASSIGN_SUBJECT,
                "resource.assign",
                "event",
                List.of("noExplicitDeny"),
                List.of("acceptedParticipation", "someUnknownCondition"),
                null)));
        service.refreshAccessControlCache();

        boolean allowed = service.canAssignEventResourcesForSubject("event-1", "u1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void ignoresDisabledMongoPolicyDefinition() {
        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(List.of(policy(
                AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                "resource.assign",
                "event",
                List.of("actorMatchesSubject"),
                List.of(),
                "disabled")));
        service.refreshAccessControlCache();

        boolean allowed = service.canSubmitEventResourceAssignment(auth("u1"), request("event-1", "sub-1", "u1"));

        assertThat(allowed).isFalse();
    }

    @Test
    void disabledCataloguePolicyWithNoConditionsStillDeniesWhenCalledDirectly() {
        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(List.of(policy(
                AccessPolicyKeys.EVENT_CREATE,
                "event.create",
                "event",
                List.of(),
                List.of(),
                "disabled")));
        service.refreshAccessControlCache();

        boolean allowed = service.can(AccessPolicyKeys.EVENT_CREATE, "u1", "u1", "event-1");

        assertThat(allowed).isFalse();
    }

    @Test
    void refreshesMongoPolicyDefinitionCache() {
        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(List.of());
        service.refreshAccessControlCache();
        assertThat(service.canAssignEventResourcesForSubject("event-1", "u1")).isFalse();

        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(defaultPolicyDefinitions());
        service.refreshAccessControlCache();
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));

        boolean allowed = service.canAssignEventResourcesForSubject("event-1", "u1");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetManagerPromotionUsesMongoPolicyDefinition() {
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u2"))
                .thenReturn(Optional.of(member("event-1", "u2", "accepted")));

        boolean allowed = service.canReceiveEventAssetManagerRole("event-1", "u2");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetManagerPromotionAllowsExplicitGrantWithoutMembership() {
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u2", "asset.manager.promote", "event", "event-1", "allow")));
        service.refreshAccessControlCache();
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u2"))
                .thenReturn(Optional.empty());

        boolean allowed = service.canReceiveEventAssetManagerRole("event-1", "u2");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetManagerPromotionDenyOverridesAcceptedEventParticipation() {
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u2", "asset.manager.promote", "event", "event-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canReceiveEventAssetManagerRole("event-1", "u2");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void assetManagerPromotionRejectsInvalidInput() {
        assertThat(service.canReceiveEventAssetManagerRole("", "u2")).isFalse();
        assertThat(service.canReceiveEventAssetManagerRole("event-1", "")).isFalse();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void eventMemberManageAllowsEventCreator() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        boolean allowed = service.canManageEventMembers("event-1", "creator");

        assertThat(allowed).isTrue();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void eventMemberManageAllowsEventAdmin() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        boolean allowed = service.canManageEventMembers("event-1", "admin");

        assertThat(allowed).isTrue();
        verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void eventMemberManageAllowsAcceptedManagerRole() {
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of());
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "manager"))
                .thenReturn(Optional.of(member("event-1", "manager", "accepted", "Manager")));

        boolean allowed = service.canManageEventMembers("event-1", "manager");

        assertThat(allowed).isTrue();
    }

    @Test
    void eventMemberManageRejectsPlainAcceptedMember() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "member"))
                .thenReturn(Optional.of(member("event-1", "member", "accepted", "Member")));

        boolean allowed = service.canManageEventMembers("event-1", "member");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventMemberDisqualifyAllowsManagerAgainstAcceptedNonProtectedMember() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(member("event-1", "target", "accepted", "Member")));

        boolean allowed = service.canDisqualifyEventMember("event-1", "admin", "target");

        assertThat(allowed).isTrue();
    }

    @Test
    void eventMemberDisqualifyRejectsActorTargetSelfAction() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        boolean allowed = service.canDisqualifyEventMember("event-1", "admin", "admin");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventMemberDisqualifyRejectsProtectedCreatorTarget() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        boolean allowed = service.canDisqualifyEventMember("event-1", "admin", "creator");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventMemberDisqualifyRejectsProtectedManagerTarget() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(member("event-1", "target", "accepted", "Manager")));

        boolean allowed = service.canDisqualifyEventMember("event-1", "admin", "target");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventMemberDisqualifyRequiresAcceptedTargetStatus() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(member("event-1", "target", "pending", "Member")));

        boolean allowed = service.canDisqualifyEventMember("event-1", "admin", "target");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventMemberDisqualifyDenyGrantOverridesManagerRule() {
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("target", "event.member.disqualify", "event", "event-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canDisqualifyEventMember("event-1", "admin", "target");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityEventsRepository, activityMembersRepository);
    }

    @Test
    void eventMemberReinstateAllowsManagerAgainstDisqualifiedNonProtectedMember() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(member("event-1", "target", "disqualified", "Member")));

        boolean allowed = service.canReinstateEventMember("event-1", "admin", "target");

        assertThat(allowed).isTrue();
    }

    @Test
    void eventMemberReinstateRequiresDisqualifiedTargetStatus() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(member("event-1", "target", "accepted", "Member")));

        boolean allowed = service.canReinstateEventMember("event-1", "admin", "target");

        assertThat(allowed).isFalse();
    }

    private Authentication auth(String userId) {
        return new FirebaseAuthenticationToken(
                new FirebasePrincipal(userId, userId + "@example.test", "U"),
                null,
                List.of(new SimpleGrantedAuthority("U")));
    }

    private ActivitySubEventResourceStateDto request(String ownerId, String subEventId, String assetOwnerUserId) {
        return new ActivitySubEventResourceStateDto(ownerId, subEventId, assetOwnerUserId, Map.of(), Map.of(), Map.of());
    }

    private ActivityMember member(String ownerId, String userId, String status) {
        return member(ownerId, userId, status, "Member");
    }

    private ActivityMember member(String ownerId, String userId, String status, String role) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setStatus(status);
        member.setRole(role);
        return member;
    }

    private ActivityEvent event(String sourceId, String creatorUserId, String adminUserId) {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId(sourceId);
        event.setType("events");
        event.setStatus("A");
        event.setCreatorUserId(creatorUserId);
        event.setAdmins(List.of(adminUserId));
        event.setUpdatedDate("2026-06-02T10:00:00Z");
        return event;
    }

    private AccessGrant grant(String subjectUserId, String permission, String resourceType, String resourceId, String effect) {
        AccessGrant grant = new AccessGrant();
        grant.setSubjectUserId(subjectUserId);
        grant.setPermission(permission);
        grant.setResourceType(resourceType);
        grant.setResourceId(resourceId);
        grant.setEffect(effect);
        return grant;
    }

    private List<AccessPolicyDefinition> defaultPolicyDefinitions() {
        return List.of(
                policy(
                        AccessPolicyKeys.EVENT_MEMBER_MANAGE,
                        "event.member.manage",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageMembers"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_MEMBER_DISQUALIFY,
                        "event.member.disqualify",
                        "event",
                        List.of(
                                "noExplicitDeny",
                                "actorCanManageMembers",
                                "actorDiffersFromSubject",
                                "subjectIsNotProtectedMember",
                                "acceptedParticipation"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_MEMBER_REINSTATE,
                        "event.member.reinstate",
                        "event",
                        List.of(
                                "noExplicitDeny",
                                "actorCanManageMembers",
                                "actorDiffersFromSubject",
                                "subjectIsNotProtectedMember",
                                "disqualifiedParticipation"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                        "resource.assign",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_SUBJECT,
                        "resource.assign",
                        "event",
                        List.of("noExplicitDeny"),
                        List.of("acceptedParticipation", "explicitAllow"),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_MANAGER_PROMOTE_TARGET,
                        "asset.manager.promote",
                        "event",
                        List.of("noExplicitDeny"),
                        List.of("acceptedParticipation", "explicitAllow"),
                        null));
    }

    private AccessPolicyDefinition policy(
            String policyKey,
            String permission,
            String resourceType,
            List<String> required,
            List<String> anyOf,
            String status) {
        AccessPolicyDefinition definition = new AccessPolicyDefinition();
        definition.setPolicyKey(policyKey);
        definition.setPermission(permission);
        definition.setResourceType(resourceType);
        definition.setRequired(required);
        definition.setAnyOf(anyOf);
        definition.setStatus(status);
        return definition;
    }
}
