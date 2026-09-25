package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.*;
import com.raxim.myscoutee.profile.repository.*;

class CommunityGroupInviteClaimTest {
    private final CommunityGroupsRepository groups = mock(CommunityGroupsRepository.class);
    private final ActivityMembersRepository members = mock(ActivityMembersRepository.class);
    private final UsersRepository users = mock(UsersRepository.class);
    private final CommunityGroupProfilesService profiles = mock(CommunityGroupProfilesService.class);
    private final Map<String, ActivityMember> rows = new LinkedHashMap<>();
    private final CommunityGroup group = new CommunityGroup("group", "owner", "Invited group", "", null,
            "friends", "invitation", true, new CommunityGroup.Policy(true, false, List.of()),
            "now", "now", 0L, "accepted", 0L);
    private final CommunityGroupsService service = new CommunityGroupsService(groups, members, users,
            mock(HomeUserProfileService.class), profiles, mock(ContentModerationService.class),
            mock(UserReportSubmissionsRepository.class), mock(AdminTelemetryService.class));

    @BeforeEach void setup() {
        Map<String, Users> accounts = new HashMap<>();
        for (String id : List.of("owner", "recipient")) {
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
        verify(profiles, atLeastOnce()).activate(argThat(user -> "recipient".equals(user.getUserId())), eq("group"));
    }

    @Test void anExistingJoinRequestIsApprovedUsingTheInvitingAdministratorsAuthority() {
        rows.put("recipient", member("recipient", "Member", "pending", "join"));

        service.claimIntegrationInvite(invite("recipient"), "recipient");

        assertThat(rows.get("recipient").getStatus()).isEqualTo("accepted");
        verify(profiles).admit(group, "recipient");
        verify(profiles, atLeastOnce()).activate(argThat(user -> "recipient".equals(user.getUserId())), eq("group"));
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
        service.action(recipient, new com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberActionRequestDto(
                new com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberOwnerRefDto("community", "group"),
                "recipient", "recipient", "remove", null));
        verify(users).clearActiveWorkspace("recipient", "group");
    }

    @Test void ordinaryProfileLoadDoesNotWriteButExplicitBaseSelectionDoes() {
        var account = users.findByUserId("recipient").orElseThrow();
        var response = new com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.ProfileExtByIdResponseDto(null, 0, null, null);
        service.completeProfileLoad(account, response, null);
        verify(profiles, never()).activate(any(), any());
        service.completeProfileLoad(account, response, "");
        verify(profiles).activate(account, "");
    }

    @Test void failedProfileContextDoesNotCommitSelection() {
        var account = users.findByUserId("recipient").orElseThrow();
        var response = new com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.ProfileExtByIdResponseDto(null, 0, null, null);
        var failing = spy(service);
        doThrow(new IllegalStateException("profile load failed")).when(failing).select(account, null);
        assertThatThrownBy(() -> failing.completeProfileLoad(account, response, "group"))
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
