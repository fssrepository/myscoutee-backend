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

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import com.raxim.myscoutee.common.config.firebase.FirebaseAuthenticationToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.AccessGrant;
import com.raxim.myscoutee.profile.data.document.AccessPolicyDefinition;
import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.repository.AccessGrantsRepository;
import com.raxim.myscoutee.profile.repository.AccessPolicyDefinitionsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AdminMenuCounterService;

@ExtendWith(MockitoExtension.class)
class AccessControlServiceTest {
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ChatsRepository chatsRepository;
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
                new MemberPolicyFacts(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository),
                new ChatPolicyFacts(chatsRepository, usersRepository, adminMenuCounterService));
        service.loadAccessControlCacheAtStartup();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
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
    void eventCreateAndJoinPoliciesRequireCurrentActorToMatchRequestUser() {
        authenticateAs("u1");

        assertThat(service.canCurrentActorCreateEvent("u1", "event-1")).isTrue();
        assertThat(service.canCurrentActorJoinEvent("u1", "event-1")).isTrue();
        assertThat(service.canCurrentActorCreateEvent("u2", "event-1")).isFalse();
        assertThat(service.canCurrentActorJoinEvent("u2", "event-1")).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void eventManagePoliciesAllowEventCreator() {
        authenticateAs("creator");
        when(usersRepository.findByUserId("creator")).thenReturn(Optional.of(user("creator")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        assertThat(service.canCurrentActorEditEvent("event-1")).isTrue();
        assertThat(service.canCurrentActorPublishEvent("event-1")).isTrue();
        assertThat(service.canCurrentActorUnpublishEvent("event-1")).isTrue();
        assertThat(service.canCurrentActorDeleteEvent("event-1")).isTrue();
        assertThat(service.canCurrentActorRestoreEvent("event-1")).isTrue();
        assertThat(service.canCurrentActorApplyEventStageAction("event-1")).isTrue();
    }

    @Test
    void eventManagePoliciesAllowAcceptedEventManager() {
        authenticateAs("manager");
        when(usersRepository.findByUserId("manager")).thenReturn(Optional.of(user("manager")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "manager"))
                .thenReturn(Optional.of(member("event-1", "manager", "accepted", "Manager")));

        boolean allowed = service.canCurrentActorApplyEventStageAction("event-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void eventManagePoliciesRejectPlainMember() {
        authenticateAs("member");
        when(usersRepository.findByUserId("member")).thenReturn(Optional.of(user("member")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "member"))
                .thenReturn(Optional.of(member("event-1", "member", "accepted", "Member")));

        boolean allowed = service.canCurrentActorPublishEvent("event-1");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventTakeoverRequiresUnderReviewEventAndManager() {
        authenticateAs("manager");
        when(usersRepository.findByUserId("manager")).thenReturn(Optional.of(user("manager")));
        ActivityEvent underReview = event("event-1", "creator", "admin");
        underReview.setStatus("UR");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(underReview));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "manager"))
                .thenReturn(Optional.of(member("event-1", "manager", "accepted", "Manager")));

        assertThat(service.canCurrentActorTakeOverEvent("event-1")).isTrue();

        ActivityEvent active = event("event-1", "creator", "admin");
        active.setStatus("A");
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(active));

        assertThat(service.canCurrentActorTakeOverEvent("event-1")).isFalse();
    }

    @Test
    void eventJoinDenyGrantOverridesActorMatch() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "event.join", "event", "event-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canCurrentActorJoinEvent("u1", "event-1");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventMemberViewAllowsAcceptedParticipant() {
        authenticateAs("member");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "member"))
                .thenReturn(Optional.of(member("event-1", "member", "accepted", "Member")));

        boolean allowed = service.canCurrentActorViewEventMembers("event-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void eventMemberViewDenyGrantOverridesAcceptedParticipation() {
        authenticateAs("member");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("member", "event.member.view", "event", "event-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canCurrentActorViewEventMembers("event-1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository);
    }

    @Test
    void eventMemberAcceptAllowsManagerForPendingNonProtectedMember() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(member("event-1", "target", "pending", "Member")));

        boolean allowed = service.canAcceptEventMember("event-1", "admin", "target");

        assertThat(allowed).isTrue();
    }

    @Test
    void eventMemberAcceptRequiresPendingTargetStatus() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(member("event-1", "target", "accepted", "Member")));

        boolean allowed = service.canAcceptEventMember("event-1", "admin", "target");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventMemberRemoveAllowsManagerForPendingMember() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "target"))
                .thenReturn(Optional.of(member("event-1", "target", "pending", "Member")));

        boolean allowed = service.canRemoveEventMember("event-1", "admin", "target");

        assertThat(allowed).isTrue();
    }

    @Test
    void eventMemberRemoveRejectsProtectedCreatorTarget() {
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        boolean allowed = service.canRemoveEventMember("event-1", "admin", "creator");

        assertThat(allowed).isFalse();
    }

    @Test
    void eventMemberInviteAllowsEventManager() {
        when(usersRepository.findByUserId("admin")).thenReturn(Optional.of(user("admin")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        boolean allowed = service.canInviteEventMembers("event-1", "admin");

        assertThat(allowed).isTrue();
    }

    @Test
    void resourceAssignmentManageAndCleanupAllowEventManager() {
        authenticateAs("admin");
        when(usersRepository.findByUserId("admin")).thenReturn(Optional.of(user("admin")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        assertThat(service.canCurrentActorManageEventResourceAssignment(request("event-1", "sub-1", "member"))).isTrue();
        assertThat(service.canCleanupEventResourceAssignments("event-1", "admin")).isTrue();
    }

    @Test
    void resourceAssignmentUsesParentEventPolicyForGeneratedSlot() {
        authenticateAs("admin");
        when(usersRepository.findByUserId("admin")).thenReturn(Optional.of(user("admin")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        boolean allowed = service.canCurrentActorManageEventResourceAssignment(request(
                "event-1:slot:slot-1:2026-07-22T13:30:00Z",
                "sub-1",
                "member"));

        assertThat(allowed).isTrue();
    }

    @Test
    void assetOwnerPoliciesRequireCurrentActorToMatchRequestUser() {
        authenticateAs("u1");

        assertThat(service.canCurrentActorCreateAsset("u1", "asset-1")).isTrue();
        assertThat(service.canCurrentActorReplaceAssets("u1")).isTrue();
        assertThat(service.canCurrentActorEditAsset("u1", "asset-1")).isTrue();
        assertThat(service.canCurrentActorDeleteAsset("u1", "asset-1")).isTrue();
        assertThat(service.canCurrentActorRestoreAsset("u1", "asset-1")).isTrue();
        assertThat(service.canCurrentActorDeleteAsset("u2", "asset-1")).isFalse();
    }

    @Test
    void assetOwnerPolicyDenyGrantOverridesActorMatch() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "asset.delete", "asset", "asset-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canCurrentActorDeleteAsset("u1", "asset-1");

        assertThat(allowed).isFalse();
    }

    @Test
    void userOwnedPoliciesRequireCurrentActorToMatchSubject() {
        authenticateAs("u1");

        assertThat(service.canCurrentActorEditProfile("u1")).isTrue();
        assertThat(service.canCurrentActorDeleteProfile("u1")).isTrue();
        assertThat(service.canCurrentActorUploadMedia("u1")).isTrue();
        assertThat(service.canCurrentActorImportMedia("u1")).isTrue();
        assertThat(service.canCurrentActorSubmitPrivacyConsent("u1")).isTrue();
        assertThat(service.canCurrentActorEditProfile("u2")).isFalse();
        assertThat(service.canCurrentActorDeleteProfile("u2")).isFalse();
        assertThat(service.canCurrentActorUploadMedia("u2")).isFalse();
        assertThat(service.canCurrentActorImportMedia("u2")).isFalse();
        assertThat(service.canCurrentActorSubmitPrivacyConsent("u2")).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void userOwnedPolicyDenyGrantOverridesActorMatch() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "user.media.import", "user", "u1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canCurrentActorImportMedia("u1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void leaderboardSubmitAllowsAcceptedEventParticipant() {
        authenticateAs("u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));

        boolean allowed = service.canCurrentActorSubmitLeaderboardEntry("u1", "event-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void leaderboardSubmitRejectsActorMismatchBeforeMembershipLookup() {
        authenticateAs("u2");

        boolean allowed = service.canCurrentActorSubmitLeaderboardEntry("u1", "event-1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void leaderboardSubmitDenyGrantOverridesAcceptedParticipation() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "event.leaderboard.entry.submit", "event", "event-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canCurrentActorSubmitLeaderboardEntry("u1", "event-1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void eventFeedbackPoliciesAllowAcceptedEventParticipant() {
        authenticateAs("u1");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u1"))
                .thenReturn(Optional.of(member("event-1", "u1", "accepted")));

        assertThat(service.canCurrentActorSubmitEventFeedback("u1", "event-1")).isTrue();
        assertThat(service.canCurrentActorSaveEventFeedbackNote("u1", "event-1")).isTrue();
        assertThat(service.canCurrentActorRemoveEventFeedback("u1", "event-1")).isTrue();
        assertThat(service.canCurrentActorRestoreEventFeedback("u1", "event-1")).isTrue();
    }

    @Test
    void eventFeedbackPoliciesAllowEventManagerForOwnFeedbackState() {
        authenticateAs("admin");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "admin"))
                .thenReturn(Optional.empty());
        when(usersRepository.findByUserId("admin")).thenReturn(Optional.of(user("admin")));
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(event("event-1", "creator", "admin")));

        boolean allowed = service.canCurrentActorSaveEventFeedbackNote("admin", "event-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void eventFeedbackPoliciesRejectActorMismatchBeforeLookup() {
        authenticateAs("u2");

        boolean allowed = service.canCurrentActorSubmitEventFeedback("u1", "event-1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void eventFeedbackDenyGrantOverridesAcceptedParticipation() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "event.feedback.note", "event", "event-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canCurrentActorSaveEventFeedbackNote("u1", "event-1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void assetBorrowRequestAllowsAcceptedEventParticipant() {
        authenticateAs("u2");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u2"))
                .thenReturn(Optional.of(member("event-1", "u2", "accepted")));

        boolean allowed = service.canCurrentActorRequestAssetBorrow("u2", "event-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetBorrowRequestRejectsAnotherActorAndNonParticipant() {
        authenticateAs("u3");

        assertThat(service.canCurrentActorRequestAssetBorrow("u2", "event-1")).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);

        authenticateAs("u2");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("event", "event-1", "u2"))
                .thenReturn(Optional.empty());

        assertThat(service.canCurrentActorRequestAssetBorrow("u2", "event-1")).isFalse();
    }

    @Test
    void assetBorrowApproveAllowsAssetOwner() {
        authenticateAs("u1");
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(user("u1")));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset("asset-1", "u1", "A")));

        boolean allowed = service.canCurrentActorApproveAssetBorrow("u2", "asset-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetBorrowRejectAllowsAcceptedAssetManager() {
        authenticateAs("u3");
        when(usersRepository.findByUserId("u3")).thenReturn(Optional.of(user("u3")));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset("asset-1", "u1", "A")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u3"))
                .thenReturn(Optional.of(member("asset", "asset-1", "u3", "accepted", "Manager")));

        boolean allowed = service.canCurrentActorRejectAssetBorrow("u2", "asset-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetBorrowCancelAllowsRequesterWithoutAssetLookup() {
        authenticateAs("u2");

        boolean allowed = service.canCurrentActorCancelAssetBorrow("u2", "asset-1");

        assertThat(allowed).isTrue();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void assetBorrowCancelDenyGrantOverridesRequesterRule() {
        authenticateAs("u2");
        when(accessGrantsRepository.findAll())
                .thenReturn(List.of(grant("u2", "asset.borrow.cancel", "asset", "asset-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canCurrentActorCancelAssetBorrow("u2", "asset-1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(activityMembersRepository, activityEventsRepository, assetsRepository, usersRepository);
    }

    @Test
    void assetManagerPromotionActorAllowsAssetOwner() {
        authenticateAs("u1");
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(user("u1")));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset("asset-1", "u1", "A")));

        boolean allowed = service.canCurrentActorPromoteAssetManager("u1", "asset-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetManagerPromotionActorAllowsAcceptedAssetManager() {
        authenticateAs("u2");
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(user("u2")));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset("asset-1", "u1", "A")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(member("asset-1", "u2", "accepted", "Manager")));

        boolean allowed = service.canCurrentActorPromoteAssetManager("u2", "asset-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetManagerPromotionActorRejectsPlainMember() {
        authenticateAs("u2");
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(user("u2")));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset("asset-1", "u1", "A")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(member("asset-1", "u2", "accepted", "Member")));

        boolean allowed = service.canCurrentActorPromoteAssetManager("u2", "asset-1");

        assertThat(allowed).isFalse();
    }

    @Test
    void assetTakeoverAllowsAcceptedManagerForUnderReviewAsset() {
        authenticateAs("u2");
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(user("u2")));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset("asset-1", "u1", "UR")));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId("asset", "asset-1", "u2"))
                .thenReturn(Optional.of(member("asset-1", "u2", "accepted", "Manager")));

        boolean allowed = service.canCurrentActorTakeOverAsset("u2", "asset-1");

        assertThat(allowed).isTrue();
    }

    @Test
    void assetTakeoverRejectsActiveAssetEvenForManager() {
        authenticateAs("u2");
        when(usersRepository.findByUserId("u2")).thenReturn(Optional.of(user("u2")));
        when(assetsRepository.findByAssetId("asset-1")).thenReturn(Optional.of(asset("asset-1", "u1", "A")));

        boolean allowed = service.canCurrentActorTakeOverAsset("u2", "asset-1");

        assertThat(allowed).isFalse();
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

    @Test
    void chatParticipantPoliciesAllowChatMember() {
        authenticateAs("u1");
        when(chatsRepository.findByOwnerUserIdAndChatId("u1", "chat-1"))
                .thenReturn(Optional.of(chat("chat-1", "u1", List.of("u1", "u2"), false)));

        assertThat(service.canCurrentActorCreateChatMessage("u1", "chat-1")).isTrue();
        assertThat(service.canCurrentActorEditChatMessage("u1", "chat-1")).isTrue();
        assertThat(service.canCurrentActorDeleteChatMessage("u1", "chat-1")).isTrue();
        assertThat(service.canCurrentActorPinChatMessage("u1", "chat-1")).isTrue();
        assertThat(service.canCurrentActorManageChatReaction("u1", "chat-1")).isTrue();
        assertThat(service.canCurrentActorAddChatAttachment("u1", "chat-1")).isTrue();
    }

    @Test
    void chatParticipantPolicyRejectsActorMismatchBeforeChatLookup() {
        authenticateAs("u2");

        boolean allowed = service.canCurrentActorCreateChatMessage("u1", "chat-1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(chatsRepository);
    }

    @Test
    void chatParticipantPolicyDenyGrantOverridesChatAccess() {
        authenticateAs("u1");
        when(accessGrantsRepository.findAll()).thenReturn(List.of(grant("u1", "chat.message.create", "chat", "chat-1", "deny")));
        service.refreshAccessControlCache();

        boolean allowed = service.canCurrentActorCreateChatMessage("u1", "chat-1");

        assertThat(allowed).isFalse();
        verifyNoInteractions(chatsRepository);
    }

    @Test
    void chatSupportManageAllowsAdminOnSupportChat() {
        authenticateAs("admin");
        when(usersRepository.findByUserId("admin")).thenReturn(Optional.of(user("admin")));
        when(adminMenuCounterService.isAdminUser(any(Users.class))).thenReturn(true);
        when(chatsRepository.findByChatId("chat-support"))
                .thenReturn(List.of(chat("chat-support", "requester", List.of("requester"), true)));

        boolean allowed = service.canCurrentActorManageSupportChat("admin", "chat-support");

        assertThat(allowed).isTrue();
    }

    @Test
    void chatSupportManageRejectsNonAdmin() {
        authenticateAs("u1");
        when(usersRepository.findByUserId("u1")).thenReturn(Optional.of(user("u1")));
        when(adminMenuCounterService.isAdminUser(any(Users.class))).thenReturn(false);

        boolean allowed = service.canCurrentActorManageSupportChat("u1", "chat-support");

        assertThat(allowed).isFalse();
        verifyNoInteractions(chatsRepository);
    }

    private Authentication auth(String userId) {
        return new FirebaseAuthenticationToken(
                new FirebasePrincipal(userId, userId + "@example.test", "U"),
                null,
                List.of(new SimpleGrantedAuthority("U")));
    }

    private void authenticateAs(String userId) {
        SecurityContextHolder.getContext().setAuthentication(auth(userId));
    }

    private ActivitySubEventResourceStateDto request(String ownerId, String subEventId, String assetOwnerUserId) {
        return new ActivitySubEventResourceStateDto(ownerId, subEventId, assetOwnerUserId, Map.of(), Map.of(), Map.of(), Map.of());
    }

    private ActivityMember member(String ownerId, String userId, String status) {
        return member(ownerId, userId, status, "Member");
    }

    private ActivityMember member(String ownerId, String userId, String status, String role) {
        return member("event", ownerId, userId, status, role);
    }

    private ActivityMember member(String ownerType, String ownerId, String userId, String status, String role) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType(ownerType);
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setStatus(status);
        member.setRole(role);
        return member;
    }

    private ActivityEvent event(String sourceId, String creatorUserId, String adminUserId) {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId(sourceId);
        event.setStatus("A");
        event.setCreatorUserId(creatorUserId);
        event.setAdmins(List.of(adminUserId));
        event.setUpdatedDate("2026-06-02T10:00:00Z");
        return event;
    }

    private Asset asset(String assetId, String ownerUserId, String status) {
        Asset asset = new Asset();
        asset.setAssetId(assetId);
        asset.setOwnerUserId(ownerUserId);
        asset.setStatus(status);
        return asset;
    }

    private Chat chat(String chatId, String ownerUserId, List<String> memberIds, boolean support) {
        Chat chat = new Chat();
        chat.setChatId(chatId);
        chat.setOwnerUserId(ownerUserId);
        chat.setMemberIds(memberIds);
        if (support) {
            Chat.SupportCaseRecord supportCase = new Chat.SupportCaseRecord();
            supportCase.setStatus("pending");
            chat.setChannelType("supportCase");
            chat.setOwnerId(chatId);
            chat.setSupportCase(supportCase);
        }
        return chat;
    }

    private Users user(String userId) {
        Users user = new Users();
        user.setUserId(userId);
        user.setStatus("A");
        user.setProfileStatus("public");
        return user;
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
                        AccessPolicyKeys.EVENT_CREATE,
                        "event.create",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_EDIT,
                        "event.edit",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_PUBLISH,
                        "event.publish",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_UNPUBLISH,
                        "event.unpublish",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_DELETE,
                        "event.delete",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_RESTORE,
                        "event.restore",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_TAKEOVER,
                        "event.takeover",
                        "event",
                        List.of("noExplicitDeny", "actorCanTakeOverEvent"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_JOIN,
                        "event.join",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_STAGE_ACTION,
                        "event.stage.action",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_LEADERBOARD_ENTRY_SUBMIT,
                        "event.leaderboard.entry.submit",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of("acceptedParticipation", "explicitAllow"),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_FEEDBACK_SUBMIT,
                        "event.feedback.submit",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of("acceptedParticipation", "actorCanManageEvent", "explicitAllow"),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_FEEDBACK_NOTE,
                        "event.feedback.note",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of("acceptedParticipation", "actorCanManageEvent", "explicitAllow"),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_FEEDBACK_REMOVE,
                        "event.feedback.remove",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of("acceptedParticipation", "actorCanManageEvent", "explicitAllow"),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_FEEDBACK_RESTORE,
                        "event.feedback.restore",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of("acceptedParticipation", "actorCanManageEvent", "explicitAllow"),
                        null),
                policy(
                        AccessPolicyKeys.CHAT_MESSAGE_CREATE,
                        "chat.message.create",
                        "chat",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanAccessChat"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.CHAT_MESSAGE_EDIT,
                        "chat.message.edit",
                        "chat",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanAccessChat"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.CHAT_MESSAGE_DELETE,
                        "chat.message.delete",
                        "chat",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanAccessChat"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.CHAT_MESSAGE_PIN,
                        "chat.message.pin",
                        "chat",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanAccessChat"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.CHAT_REACTION_MANAGE,
                        "chat.reaction.manage",
                        "chat",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanAccessChat"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.CHAT_ATTACHMENT_ADD,
                        "chat.attachment.add",
                        "chat",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanAccessChat"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.CHAT_SUPPORT_MANAGE,
                        "chat.support.manage",
                        "chat",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanManageSupportChat"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.USER_PROFILE_EDIT,
                        "user.profile.edit",
                        "user",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.USER_PROFILE_DELETE,
                        "user.profile.delete",
                        "user",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.USER_MEDIA_UPLOAD,
                        "user.media.upload",
                        "user",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.USER_MEDIA_IMPORT,
                        "user.media.import",
                        "user",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.PRIVACY_CONSENT_SUBMIT,
                        "privacy.consent.submit",
                        "user",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_CREATE,
                        "asset.create",
                        "asset",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_REPLACE,
                        "asset.replace",
                        "asset",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_EDIT,
                        "asset.edit",
                        "asset",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_DELETE,
                        "asset.delete",
                        "asset",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_RESTORE,
                        "asset.restore",
                        "asset",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_TAKEOVER,
                        "asset.takeover",
                        "asset",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanTakeOverAsset"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_MANAGER_PROMOTE_ACTOR,
                        "asset.manager.promote.actor",
                        "asset",
                        List.of("actorMatchesSubject", "noExplicitDeny", "actorCanManageAsset"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_BORROW_REQUEST,
                        "asset.borrow.request",
                        "event",
                        List.of("actorMatchesSubject", "noExplicitDeny"),
                        List.of("acceptedParticipation", "explicitAllow"),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_BORROW_APPROVE,
                        "asset.borrow.approve",
                        "asset",
                        List.of("noExplicitDeny", "actorCanManageAsset"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_BORROW_REJECT,
                        "asset.borrow.reject",
                        "asset",
                        List.of("noExplicitDeny", "actorCanManageAsset"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.ASSET_BORROW_CANCEL,
                        "asset.borrow.cancel",
                        "asset",
                        List.of("noExplicitDeny"),
                        List.of("actorMatchesSubject", "actorCanManageAsset"),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_MEMBER_VIEW,
                        "event.member.view",
                        "event",
                        List.of("noExplicitDeny"),
                        List.of("acceptedParticipation", "actorCanManageEvent", "explicitAllow"),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_MEMBER_MANAGE,
                        "event.member.manage",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageMembers"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_MEMBER_ACCEPT,
                        "event.member.accept",
                        "event",
                        List.of(
                                "noExplicitDeny",
                                "actorCanManageMembers",
                                "actorDiffersFromSubject",
                                "subjectIsNotProtectedMember",
                                "pendingParticipation"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.EVENT_MEMBER_REMOVE,
                        "event.member.remove",
                        "event",
                        List.of(
                                "noExplicitDeny",
                                "actorCanManageMembers",
                                "actorDiffersFromSubject",
                                "subjectIsNotProtectedMember"),
                        List.of("acceptedParticipation", "pendingParticipation", "disqualifiedParticipation"),
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
                        AccessPolicyKeys.EVENT_MEMBER_INVITE,
                        "event.member.invite",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
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
                        AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE,
                        "resource.assign.manage",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of(),
                        null),
                policy(
                        AccessPolicyKeys.RESOURCE_ASSIGN_CLEANUP,
                        "resource.assign.cleanup",
                        "event",
                        List.of("noExplicitDeny", "actorCanManageEvent"),
                        List.of(),
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
