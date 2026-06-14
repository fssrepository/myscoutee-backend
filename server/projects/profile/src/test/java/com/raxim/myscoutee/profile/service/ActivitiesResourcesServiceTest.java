package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.firebase.FirebaseAuthenticationToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.AccessGrant;
import com.raxim.myscoutee.profile.data.document.AccessPolicyDefinition;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.repository.AccessGrantsRepository;
import com.raxim.myscoutee.profile.repository.AccessPolicyDefinitionsRepository;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.AccessPolicyTestSupport;
import com.raxim.myscoutee.profile.security.ChatPolicyFacts;
import com.raxim.myscoutee.profile.security.MemberPolicyFacts;

@ExtendWith(MockitoExtension.class)
class ActivitiesResourcesServiceTest {
    @Mock
    private ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    @Mock
    private AssetsService assetsService;
    @Mock
    private ObjectProvider<ActivitiesMembersService> activitiesMembersServiceProvider;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityChatsRepository activityChatsRepository;
    @Mock
    private AssetsRepository assetsRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private AccessGrantsRepository accessGrantsRepository;
    @Mock
    private AccessPolicyDefinitionsRepository accessPolicyDefinitionsRepository;
    @Mock
    private AdminMenuCounterService adminMenuCounterService;

    private ActivitiesResourcesService service;
    private AccessControlService accessControlService;

    @BeforeEach
    void setUp() {
        ConfigProperties configProperties = new ConfigProperties();
        configProperties.setFirebaseEnabled(true);
        when(accessGrantsRepository.findAll()).thenReturn(List.of());
        when(accessPolicyDefinitionsRepository.findAll()).thenReturn(defaultPolicyDefinitions());
        accessControlService = new AccessControlService(
                accessGrantsRepository,
                accessPolicyDefinitionsRepository,
                configProperties,
                AccessPolicyTestSupport.conditionRegistry(),
                new MemberPolicyFacts(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository),
                new ChatPolicyFacts(activityChatsRepository, usersRepository, adminMenuCounterService));
        accessControlService.loadAccessControlCacheAtStartup();
        service = new ActivitiesResourcesService(
                activitySubEventResourcesRepository,
                assetsService,
                activitiesMembersServiceProvider,
                accessControlService);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void replaceRejectsAuthenticatedActorDifferentFromAssetOwner() {
        authenticateAs("u2");

        assertThatThrownBy(() -> service.replace(request("event-1", "sub-1", "u1")))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));

        verifyNoInteractions(activitiesMembersServiceProvider);
        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceRejectsUnauthenticatedActorWhenFirebaseIsEnabled() {
        assertThatThrownBy(() -> service.replace(request("event-1", "sub-1", "u1")))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceReturnsNullForBlankAssignmentIds() {
        authenticateAs("u1");

        assertThat(service.replace(request("", "sub-1", "u1"))).isNull();
        assertThat(service.replace(request("event-1", "", "u1"))).isNull();
        assertThat(service.replace(request("event-1", "sub-1", ""))).isNull();

        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceKeepsEventMembershipInvariantAfterActorPolicyPasses() {
        authenticateAs("u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.replace(request("event-1", "sub-1", "u1")))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceAllowsAcceptedAuthenticatedParticipant() {
        authenticateAs("u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitySubEventResourcesRepository.findByRecordId("u1:event-1:sub-1")).thenReturn(Optional.empty());
        when(assetsService.queryAssets("u1")).thenReturn(List.of());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitySubEventResourceStateDto saved = service.replace(request("event-1", "sub-1", "u1"));

        assertThat(saved).isNotNull();
        assertThat(saved.ownerId()).isEqualTo("event-1");
        assertThat(saved.assetOwnerUserId()).isEqualTo("u1");
        verify(activitySubEventResourcesRepository).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceAllowsExplicitAssignmentGrantWithoutAcceptedEventParticipation() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "resource.assign", "event", "event-1", "allow")));
        accessControlService.refreshAccessControlCache();
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.empty());
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitySubEventResourcesRepository.findByRecordId("u1:event-1:sub-1")).thenReturn(Optional.empty());
        when(assetsService.queryAssets("u1")).thenReturn(List.of());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitySubEventResourceStateDto saved = service.replace(request("event-1", "sub-1", "u1"));

        assertThat(saved).isNotNull();
        assertThat(saved.ownerId()).isEqualTo("event-1");
        verify(activitySubEventResourcesRepository).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceAllowsEventManagerToAssignForAcceptedParticipant() {
        authenticateAs("manager");
        when(usersRepository.findByUserId("manager")).thenReturn(Optional.of(user("manager")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "host", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "manager"))
                .thenReturn(Optional.of(member("event-1", "manager", "accepted", "Manager")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted", "Member")));
        when(activitiesMembersServiceProvider.getIfAvailable()).thenReturn(activitiesMembersService);
        when(activitySubEventResourcesRepository.findByRecordId("u1:event-1:sub-1")).thenReturn(Optional.empty());
        when(assetsService.queryAssets("u1")).thenReturn(List.of());
        when(activitySubEventResourcesRepository.save(any(ActivitySubEventResource.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ActivitySubEventResourceStateDto saved = service.replace(request("event-1", "sub-1", "u1"));

        assertThat(saved).isNotNull();
        assertThat(saved.assetOwnerUserId()).isEqualTo("u1");
        verify(activitySubEventResourcesRepository).save(any(ActivitySubEventResource.class));
    }

    @Test
    void replaceRejectsExplicitAssignmentDenyBeforeSaving() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "resource.assign", "event", "event-1", "deny")));
        accessControlService.refreshAccessControlCache();

        assertThatThrownBy(() -> service.replace(request("event-1", "sub-1", "u1")))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(activitySubEventResourcesRepository, never()).save(any(ActivitySubEventResource.class));
    }

    @Test
    void cleanupReturnsEmptyWhenPolicyDeniesBeforeLoadingResources() {
        Set<String> removed = service.removeManagedResourcesForRemovedEventMembers(
                "event-1",
                List.of(member("event-1", "u1", "accepted", "Manager")),
                "manager",
                "2026-06-02T12:00:00Z");

        assertThat(removed).isEmpty();
        verify(activitySubEventResourcesRepository, never()).findByOwnerId(anyString());
    }

    private void authenticateAs(String userId) {
        SecurityContextHolder.getContext().setAuthentication(new FirebaseAuthenticationToken(
                new FirebasePrincipal(userId, userId + "@example.test", "U"),
                null,
                List.of(new SimpleGrantedAuthority("U"))));
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
        event.setCreatorUserId(creatorUserId);
        event.setAdmins(List.of(adminUserId));
        event.setStatus("A");
        return event;
    }

    private Users user(String userId) {
        Users user = new Users();
        user.setUserId(userId);
        user.setStatus("A");
        user.setProfileStatus("public");
        return user;
    }

    private List<AccessPolicyDefinition> defaultPolicyDefinitions() {
        return List.of(
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                        "resource.assign",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of()),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_SUBJECT,
                        "resource.assign",
                        "event",
                        List.of("noExplicitDeny"),
                        List.of("acceptedParticipation", "explicitAllow")),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE,
                        "resource.assign.manage",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of()),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_CLEANUP,
                        "resource.assign.cleanup",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of()));
    }

    private AccessPolicyDefinition policy(
            String policyKey,
            String permission,
            String resourceType,
            List<String> required,
            List<String> anyOf) {
        AccessPolicyDefinition definition = new AccessPolicyDefinition();
        definition.setPolicyKey(policyKey);
        definition.setPermission(permission);
        definition.setResourceType(resourceType);
        definition.setRequired(required);
        definition.setAnyOf(anyOf);
        return definition;
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
}
