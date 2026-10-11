package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import com.raxim.myscoutee.domain.accounts.api.ProfileReadState;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.groups.api.BaseGroups;
import com.raxim.myscoutee.domain.groups.api.GroupAdministration;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import tools.jackson.databind.json.JsonMapper;

@Tag("standard")
class ProfileMenuCountersServiceTest {
    private final UsersRepository users = mock(UsersRepository.class);
    private final JsonMapper mapper = new JsonMapper();

    @Test
    void startsWithoutProductOrDiscoveryOwnersAndPreservesProfileAccountReads() {
        var profile = user("selected");
        profile.setAccountUserId("account");
        profile.setActivities(mapper.readValue("""
                {"chats":7,"events":3,"cars":99,"notifications":4,"chat":{"contacts":5,"event":2}}
                """, Users.UserActivitiesRecord.class));
        var account = user("account");
        account.setActivities(mapper.readValue("{\"cars\":8,\"contacts\":9}", Users.UserActivitiesRecord.class));
        when(users.findByUserId("selected")).thenReturn(Optional.of(profile));
        when(users.findByUserId("account")).thenReturn(Optional.of(account));
        try (var context = new AnnotationConfigApplicationContext()) {
            context.registerBean(UsersRepository.class, () -> users);
            context.register(SelectedProfileService.class, ProfileMenuCountersService.class, ProfileReadStateService.class);
            context.refresh();
            var state = context.getBean(ProfileReadState.class);
            var counts = state.queryMenuCounters("selected");
            assertThat(counts.chats()).isEqualTo(7);
            assertThat(counts.events()).isEqualTo(3);
            assertThat(counts.chat().contacts()).isEqualTo(5);
            assertThat(counts.chat().event()).isEqualTo(2);
            assertThat(counts.cars()).isEqualTo(8);
            assertThat(counts.contacts()).isEqualTo(9);
            assertThat(counts.notifications()).isEqualTo(4);
            assertThat(counts.cases()).isZero();
            state.evictUserReadCaches("selected");
            state.evictUserReadCaches(List.of("selected"));
        }
        // The prior selection read, counter-profile read and optional account read.
        verify(users, times(2)).findByUserId("selected");
        verify(users).findByUserId("account");
        verifyNoMoreInteractions(users);
    }

    @Test
    void missingProfileReturnsTheExistingEmptyCounterShape() {
        var counters = new ProfileMenuCountersService(users, new SelectedProfileService(users), Optional.empty());
        assertThat(counters.queryMenuCounters("absent")).isEqualTo(AccountCounterMapper.emptyMenuCounters());
        verify(users).findByUserId("absent");
        verifyNoMoreInteractions(users);
    }

    @Test
    void installedCommunityCountIsUsedOnceAndFailureIsNotHidden() {
        var contribution = mock(ProfileCommunityCounters.class);
        var counters = new ProfileMenuCountersService(users, new SelectedProfileService(users), Optional.of(contribution));
        var profile = user("profile");
        when(contribution.count(profile)).thenReturn(12);
        assertThat(counters.buildMenuCounters(profile, profile).cases()).isEqualTo(12);
        verify(contribution).count(profile);
        when(contribution.count(profile)).thenThrow(new IllegalStateException("community unavailable"));
        assertThatThrownBy(() -> counters.buildMenuCounters(profile, profile))
                .isInstanceOf(IllegalStateException.class).hasMessage("community unavailable");
        verifyNoInteractions(users);
    }

    @Test
    void cacheInvalidationKeepsTheSameSynchronousArgumentsAndFailure() {
        var cache = mock(ProfileReadCache.class);
        var state = new ProfileReadStateService(null, List.of(cache));
        var ids = List.of("one", "two");
        state.evictUserReadCaches("one");
        state.evictUserReadCaches(ids);
        verify(cache).evictUserReadCaches("one");
        verify(cache).evictUserReadCaches(same(ids));
        doThrow(new IllegalStateException("cache failure")).when(cache).evictUserReadCaches("broken");
        assertThatThrownBy(() -> state.evictUserReadCaches("broken")).hasMessage("cache failure");
    }

    @Test
    void communityBaseUsesExistingAccountAndManagedGroupQueriesWithoutWorkspaceLookup() {
        var cases = mock(CaseParticipants.class);
        var groups = mock(GroupDirectory.class);
        var administration = mock(GroupAdministration.class);
        var profile = user("profile");
        profile.setAccountUserId("account");
        profile.setWorkspaceGroupId(BaseGroups.COMMUNITY_BASE_ID);
        when(administration.managedGroups("account")).thenReturn(Set.of("managed"));
        when(cases.visibleCount(BaseGroups.COMMUNITY_BASE_ID, "account", Set.of("managed"))).thenReturn(6);
        assertThat(new CommunityProfileCounters(cases, groups, administration).count(profile)).isEqualTo(6);
        verify(administration).managedGroups("account");
        verify(cases).visibleCount(BaseGroups.COMMUNITY_BASE_ID, "account", Set.of("managed"));
        verifyNoMoreInteractions(cases, administration);
        verifyNoInteractions(groups);
    }

    @Test
    void communityWorkspaceKeepsExactlyOneTypeReadThenExistingCaseReads() {
        var cases = mock(CaseParticipants.class);
        var groups = mock(GroupDirectory.class);
        var administration = mock(GroupAdministration.class);
        var profile = user("profile");
        profile.setWorkspaceGroupId("workspace");
        var group = mock(GroupView.class);
        when(group.effectiveType()).thenReturn("community");
        doReturn(Optional.of(group)).when(groups).findById("workspace");
        when(administration.managedGroups("profile")).thenReturn(Set.of());
        new CommunityProfileCounters(cases, groups, administration).count(profile);
        verify(groups).findById("workspace");
        verify(administration).managedGroups("profile");
        verify(cases).visibleCount(BaseGroups.COMMUNITY_BASE_ID, "profile", Set.of());
        verifyNoMoreInteractions(groups, administration, cases);
    }

    @Test
    void ungroupedProfileDoesNotQueryCommunityAndOtherWorkspaceOnlyChecksItsType() {
        var cases = mock(CaseParticipants.class);
        var groups = mock(GroupDirectory.class);
        var administration = mock(GroupAdministration.class);
        var counters = new CommunityProfileCounters(cases, groups, administration);
        var profile = user("profile");
        assertThat(counters.count(profile)).isZero();
        verifyNoInteractions(groups, administration, cases);
        profile.setWorkspaceGroupId("other");
        assertThat(counters.count(profile)).isZero();
        verify(groups).findById("other");
        verifyNoInteractions(administration, cases);
    }

    private Users user(String id) {
        var user = new Users();
        user.setId(id);
        user.setUserId(id);
        user.setName(id);
        return user;
    }
}
