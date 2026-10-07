package com.raxim.myscoutee.domain.groups.document;

import com.raxim.myscoutee.domain.groups.dto.GroupPolicy;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.accounts.service.CommunityGroupProfilesService;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

@org.junit.jupiter.api.Tag("standard")
class CommunityGroupWorkspaceSelectionTest {
    private final UsersRepository users = mock(UsersRepository.class);
    private final CommunityGroupsRepository groups = mock(CommunityGroupsRepository.class);
    private final ActivityMembersRepository members = mock(ActivityMembersRepository.class);
    private final CommunityGroupProfilesService service = new CommunityGroupProfilesService(users, new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(groups), new com.raxim.myscoutee.domain.events.service.CommunityMembershipService(members));
    private final Users account = new Users();
    private final Users profile = new Users();
    private final ActivityMember membership = new ActivityMember();
    @BeforeEach void setup() {
        account.setUserId("account"); account.setActiveWorkspaceGroupId("previous");
        profile.setUserId("group-profile"); profile.setWorkspaceGroupId("group");
        membership.setStatus("accepted");
        var group = new CommunityGroup("group", "owner", "Group", "", null, "friends", "private", true,
            new GroupPolicy(true, false, List.of()), "now", "now", 0L, "accepted", 0L);
        when(groups.findById("group")).thenReturn(Optional.of(group));
        when(members.findByOwnerTypeAndOwnerIdAndUserId("community", "group", "account")).thenReturn(Optional.of(membership));
        when(users.findByWorkspaceGroupIdAndAccountUserId("group", "account")).thenReturn(Optional.of(profile));
    }
    @Test void acceptedMemberSelectionIsPersistedAndReadBackWithoutWriting() {
        assertThat(service.activate(account, "group")).isSameAs(profile);
        assertThat(account.getActiveWorkspaceGroupId()).isEqualTo("group");
        var reloadedAccount = new Users(); reloadedAccount.setUserId("account"); reloadedAccount.setActiveWorkspaceGroupId("group");
        assertThat(service.current(reloadedAccount)).isSameAs(profile);
        verify(users).updateActiveWorkspace("account", "group");
    }
    @Test void pendingOrRemovedMembershipCannotChangeSavedSelection() {
        for (String status : List.of("pending", "deleted")) {
            membership.setStatus(status);
            assertThatThrownBy(() -> service.activate(account, "group")).isInstanceOf(ResponseStatusException.class);
            assertThat(account.getActiveWorkspaceGroupId()).isEqualTo("previous");
        }
        verify(users, never()).updateActiveWorkspace(any(), any());
    }
    @Test void missingMembershipOrProfileCannotChangeSavedSelection() {
        when(users.findByWorkspaceGroupIdAndAccountUserId("group", "account")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.activate(account, "group")).isInstanceOf(ResponseStatusException.class);
        when(members.findByOwnerTypeAndOwnerIdAndUserId("community", "group", "account")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.activate(account, "group")).isInstanceOf(ResponseStatusException.class);
        verify(users, never()).updateActiveWorkspace(any(), any());
    }
    @Test void baseProfileReturnIsExplicitAndIdempotent() {
        assertThat(service.activate(account, "")).isSameAs(account);
        assertThat(account.getActiveWorkspaceGroupId()).isNull();
        assertThat(service.current(account)).isSameAs(account);
        verify(users).updateActiveWorkspace("account", null);
    }
    @Test void revokedMembershipFailsClosedEvenWithPreviouslySavedChoice() {
        account.setActiveWorkspaceGroupId("group"); membership.setStatus("deleted");
        assertThatThrownBy(() -> service.current(account)).isInstanceOf(ResponseStatusException.class);
        verify(users, never()).updateActiveWorkspace(any(), any());
    }
}
