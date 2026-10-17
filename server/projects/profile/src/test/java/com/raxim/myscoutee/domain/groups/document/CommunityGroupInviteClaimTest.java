package com.raxim.myscoutee.domain.groups.document;

import com.raxim.myscoutee.domain.groups.dto.GroupPolicy;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.api.SelectedProfile;
import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;
import com.raxim.myscoutee.domain.content.service.ContentModerationService;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.groups.service.CommunityGroupsService;
import com.raxim.myscoutee.domain.integrations.document.IntegrationParticipantInvite;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

@org.junit.jupiter.api.Tag("standard")
class CommunityGroupInviteClaimTest {
    private final CommunityGroupsRepository groups = mock(CommunityGroupsRepository.class);
    private final ActivityMembersRepository members = mock(ActivityMembersRepository.class);
    private final UsersRepository users = mock(UsersRepository.class);
    private final com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces profiles = mock(com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces.class);
    private final Map<String, ActivityMember> rows = new LinkedHashMap<>();
    private final CommunityGroup group = new CommunityGroup("group", "owner", "Invited group", "", null,
            "friends", "invitation", true, new GroupPolicy(true, false, List.of()),
            "now", "now", 0L, "accepted", 0L);
    private final com.raxim.myscoutee.domain.events.service.CommunityMembershipService memberships = new com.raxim.myscoutee.domain.events.service.CommunityMembershipService(members);
    private final CommunityGroupsService service = new CommunityGroupsService(groups, memberships, new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users),
            mock(SelectedProfile.class), mock(com.raxim.myscoutee.domain.accounts.api.ProfileCards.class), profiles, mock(ContentModerationService.class),
            mock(com.raxim.myscoutee.domain.content.api.CommunityReports.class), mock(AdminTelemetryService.class), mock(com.raxim.myscoutee.domain.groups.api.GroupCounters.class),
            mock(com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService.class));

    @BeforeEach void setup() {
        var counterApi = mock(com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.class);
        var mongo = mock(org.springframework.data.mongodb.core.MongoTemplate.class);
        var bulk = mock(org.springframework.data.mongodb.core.BulkOperations.class);
        when(mongo.bulkOps(any(), eq(ActivityMember.class))).thenReturn(bulk);
        org.springframework.test.util.ReflectionTestUtils.setField(memberships, "counters", counterApi);
        org.springframework.test.util.ReflectionTestUtils.setField(memberships, "mongo", mongo);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "summaries", mock(com.raxim.myscoutee.domain.accounts.api.ProfileSummaries.class));
        when(members.findById(anyString())).thenAnswer(call -> rows.values().stream().filter(row -> row.getId().equals(call.getArgument(0))).findFirst());
        when(members.findAllById(any())).thenAnswer(call -> { java.util.Collection<String> ids = call.getArgument(0);
            return rows.values().stream().filter(row -> ids.contains(row.getId())).toList(); });
        Map<String, Users> accounts = new HashMap<>();
        for (String id : List.of("owner", "recipient", "sender")) {
            var user = new Users(); user.setId(id); user.setUserId(id); user.setName(id);
            accounts.put(id, user);
        }
        rows.put("owner", member("owner", "Admin", "accepted", null));
        when(groups.findById("group")).thenReturn(Optional.of(group));
        when(users.findByUserId(anyString())).thenAnswer(call -> Optional.ofNullable(accounts.get(call.getArgument(0))));
        when(users.findByUserIdIn(any())).thenAnswer(call -> {
            Collection<String> ids = call.getArgument(0);
            return ids.stream().map(accounts::get).filter(Objects::nonNull).toList();
        });
        when(members.findByOwnerTypeAndOwnerId("community", "group"))
                .thenAnswer(call -> new ArrayList<>(rows.values()));
        when(members.findByOwnerTypeAndOwnerIdAndUserId(eq("community"), eq("group"), anyString()))
                .thenAnswer(call -> Optional.ofNullable(rows.get(call.getArgument(2))));
        when(members.saveAll(any())).thenAnswer(call -> {
            List<ActivityMember> saved = call.getArgument(0);
            saved.forEach(member -> rows.put(member.getUserId(), member));
            return saved;
        });
        when(members.save(any(ActivityMember.class))).thenAnswer(call -> {
            ActivityMember saved = call.getArgument(0); rows.put(saved.getUserId(), saved); return saved;
        });
        when(members.updateCommunityState(anyString(), any(), any(), any(), any(), any(), any(), any(), anyBoolean(), any(), any(), any(), any(), anyBoolean(), any(), any()))
                .thenAnswer(call -> {
                    var stored = rows.values().stream().filter(row -> row.getId().equals(call.getArgument(0))).findFirst().orElseThrow();
                    if (!Objects.equals(stored.getStatus(), call.getArgument(1)) || !Objects.equals(stored.getRole(), call.getArgument(2))
                            || !Objects.equals(stored.getActionAtIso(), call.getArgument(3))) return 0L;
                    stored.setStatus(call.getArgument(4)); stored.setRole(call.getArgument(5));
                    stored.setRequestKind(call.getArgument(6)); stored.setPendingSource(call.getArgument(7));
                    stored.setOrganizerOnly(call.getArgument(8)); stored.setActionAtIso(call.getArgument(9));
                    stored.setCommunityAction(call.getArgument(10)); stored.setCommunityActor(call.getArgument(11));
                    stored.setManagerGrantedByUserId(call.getArgument(12)); stored.setVotingEligible(call.getArgument(13)); stored.setGroupCounterState(call.getArgument(14));
                    return 1L;
                });
        when(profiles.profilesByGroup(anyString())).thenReturn(Map.of());
    }

    @Test void claimedLinkAcceptsMembershipAndReplayingItDoesNotReadmitTheUser() {
        service.claimIntegrationInvite(invite("recipient"), "recipient");
        service.claimIntegrationInvite(invite("recipient"), "recipient");

        assertThat(rows).hasSize(2);
        assertThat(rows.get("recipient").getStatus()).isEqualTo("accepted");
        assertThat(rows.get("recipient").getRole()).isEqualTo("Member");
        assertThat(rows.get("recipient").getRequestKind()).isNull();
        verify(profiles).admit(group, "recipient");
        verify(profiles, atLeastOnce()).activate(eq("recipient"), eq("group"));
    }

    @Test void builtInWorkspaceAdmissionReturnsItsMembershipWithoutASyntheticSystemAccount() {
        var recipient = new Users(); recipient.setUserId("recipient"); recipient.setName("Recipient");
        for (String baseId : CommunityGroup.BASE_IDS) {
            var base = new CommunityGroup(baseId, "system", "MyScoutee", "", null,
                    "work", "public", false, new GroupPolicy(true, false, List.of()),
                    "now", "now", 0L, "accepted", 0L);
            var membership = member("recipient", "Member", "accepted", null);
            membership.setOwnerId(baseId);
            when(groups.findById(baseId)).thenReturn(Optional.of(base));
            when(members.findByOwnerTypeAndOwnerId("community", baseId)).thenReturn(List.of(membership));
            when(members.findByOwnerTypeAndOwnerIdAndUserId("community", baseId, "recipient"))
                    .thenReturn(Optional.of(membership));

            var result = service.join(recipient, baseId);

            assertThat(result.membershipStatus()).isEqualTo("accepted");
            assertThat(result.ownerUserId()).isEqualTo("system");
            assertThat(result.ownerName()).isEmpty();
            assertThat(result.ownerAvatarUrl()).isNull();
            assertThat(result.distanceKm()).isNull();
        }
        verify(users, never()).save(any());
    }

    @Test void ordinaryGroupStillRequiresItsRealOwnerProfile() {
        var recipient = new Users(); recipient.setUserId("recipient");
        rows.put("recipient", member("recipient", "Member", "accepted", null));
        when(users.findByUserId("owner")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.detail(recipient, "group"))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        error -> assertThat(error.getStatusCode().value()).isEqualTo(404));
    }

    @Test void eventLinkFromAnAcceptedMemberCreatesOneAcceptedMembershipAndReusesItsProfile() {
        eventInviter();
        var selected = new Users(); selected.setUserId("group-recipient"); selected.setWorkspaceGroupId("group"); selected.setAccountUserId("recipient");
        when(profiles.activate(any(), eq("group"))).thenReturn(selected);
        assertThat(service.claimEventInvite("group", "group-sender", "recipient")).isSameAs(selected);
        assertThat(service.claimEventInvite("group", "group-sender", "recipient")).isSameAs(selected);
        assertThat(rows.get("recipient").getStatus()).isEqualTo("accepted");
        assertThat(rows.get("recipient").getRole()).isEqualTo("Member");
        verify(profiles).admit(group, "recipient");
    }

    @Test void eventLinkCannotBypassRemovalOrPendingRestorationApproval() {
        eventInviter();
        var blocked = member("recipient", "Member", "blocked", null);
        rows.put("recipient", blocked);
        assertThatThrownBy(() -> service.claimEventInvite("group", "group-sender", "recipient")).isInstanceOf(ResponseStatusException.class);
        blocked.setStatus("pending"); blocked.setRequestKind("join"); blocked.setCommunityAction("restore");
        assertThatThrownBy(() -> service.claimEventInvite("group", "group-sender", "recipient")).isInstanceOf(ResponseStatusException.class);
        verify(profiles, never()).admit(any(), anyString());
    }

    private void eventInviter() {
        var profile = new Users(); profile.setUserId("group-sender"); profile.setAccountUserId("sender"); profile.setWorkspaceGroupId("group");
        when(users.findByUserId("group-sender")).thenReturn(Optional.of(profile));
        rows.put("sender", member("sender", "Member", "accepted", null));
    }

    @Test void anExistingJoinRequestIsApprovedUsingTheInvitingAdministratorsAuthority() {
        rows.put("recipient", member("recipient", "Member", "pending", "join"));

        service.claimIntegrationInvite(invite("recipient"), "recipient");

        assertThat(rows.get("recipient").getStatus()).isEqualTo("accepted");
        verify(profiles).admit(group, "recipient");
        verify(profiles, atLeastOnce()).activate(eq("recipient"), eq("group"));
    }

    @Test void unclaimedOrOtherAccountLinksCannotAdmitAnyone() {
        for (String claimed : Arrays.asList(null, "other")) {
            assertThatThrownBy(() -> service.claimIntegrationInvite(invite(claimed), "recipient"))
                    .isInstanceOf(ResponseStatusException.class);
        }
        assertThat(rows).containsOnlyKeys("owner");
        verify(profiles, never()).admit(any(), anyString());
    }

    @Test void leavingTheActiveGroupClearsOnlyThatSavedSelection() {
        service.claimIntegrationInvite(invite("recipient"), "recipient");
        var recipient = users.findByUserId("recipient").orElseThrow();
        service.action(recipient, new com.raxim.myscoutee.domain.events.dto.ActivityMembersDtos.ActivityMemberActionRequestDto(
                new com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberOwnerRefDto("community", "group"),
                "recipient", "recipient", "remove", null));
        verify(profiles).clearActiveWorkspace("recipient", "group");
    }

    @Test void ordinaryProfileLoadDoesNotWriteButExplicitBaseSelectionDoes() {
        var account = users.findByUserId("recipient").orElseThrow();
        var response = new com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtByIdResponseDto(null, 0, null, null);
        service.completeProfileLoad(account, response, null);
        verify(profiles, never()).activate(any(), any());
        service.completeProfileLoad(account, response, "");
        verify(profiles).activate(account.getUserId(), "");
    }

    @Test void failedProfileContextDoesNotCommitSelection() {
        var account = users.findByUserId("recipient").orElseThrow();
        var response = new com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtByIdResponseDto(null, 0, null, null);
        var failing = spy(service);
        doThrow(new IllegalStateException("profile load failed")).when(failing).select(account, null);
        assertThatThrownBy(() -> failing.completeProfileLoad(account, response, "group"))
                .isInstanceOf(IllegalStateException.class);
        verify(profiles, never()).activate(any(), any());
    }

    @Test void accountIdBoundaryUsesTheSameSelectionAndCommitOrder() {
        var account = users.findByUserId("recipient").orElseThrow();
        var boundary = spy(service);
        doReturn(new com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.WorkspaceSelection(null, null, null))
                .when(boundary).select(account, "current-group");
        boundary.loadProfileWorkspace("recipient", "current-group", "");
        var ordered = inOrder(boundary, profiles);
        ordered.verify(boundary).select(account, "current-group");
        ordered.verify(profiles).activate(account.getUserId(), "");
        reset(profiles);
        doThrow(new IllegalStateException("profile load failed")).when(boundary).select(account, "current-group");
        assertThatThrownBy(() -> boundary.loadProfileWorkspace("recipient", "current-group", "next"))
                .isInstanceOf(IllegalStateException.class);
        verify(profiles, never()).activate(any(), any());
    }

    private IntegrationParticipantInvite invite(String claimed) {
        return new IntegrationParticipantInvite("invite", "owner", "group", "guest", "token", "hash",
                claimed, "now", "now", "community");
    }
    private ActivityMember member(String id, String role, String status, String request) {
        var member = new ActivityMember(); member.setId("community:group:" + id); member.setUserId(id);
        member.setOwnerType("community"); member.setOwnerId("group"); member.setRole(role);
        member.setStatus(status); member.setRequestKind(request); return member;
    }
}
