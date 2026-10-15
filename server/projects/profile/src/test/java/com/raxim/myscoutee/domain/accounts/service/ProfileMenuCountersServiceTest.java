package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import com.raxim.myscoutee.domain.accounts.api.ProfileReadState;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
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
        account.setActivities(mapper.readValue("{\"cars\":8,\"contacts\":9,\"notifications\":6}", Users.UserActivitiesRecord.class));
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
            assertThat(counts.notifications()).isEqualTo(6);
            assertThat(counts.menuCounters()).isEmpty();
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
        var counters = new ProfileMenuCountersService(users, new SelectedProfileService(users));
        assertThat(counters.queryMenuCounters("absent")).isEqualTo(AccountCounterMapper.emptyMenuCounters());
        verify(users).findByUserId("absent");
        verifyNoMoreInteractions(users);
    }

    @Test
    void moduleCountersMergeStoredAccountAndProfileValuesWithoutAnOwnerCall() {
        var counters = new ProfileMenuCountersService(users, new SelectedProfileService(users));
        var account = user("account"); account.setMenuCounters(java.util.Map.of("communityCases", 12, "otherModule", 7));
        var profile = user("profile"); profile.setMenuCounters(java.util.Map.of("campaignsPublished", 3));
        assertThat(counters.buildMenuCounters(profile, account).menuCounters())
                .containsEntry("communityCases", 12).containsEntry("campaignsPublished", 3).containsEntry("otherModule", 7);
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
    void moduleCountersAreReadFromTheProfileWithoutAProductOwner() {
        var counters = new ProfileMenuCountersService(users, new SelectedProfileService(users));
        var profile = user("work-profile"); profile.setWorkspaceGroupId("work");
        profile.setMenuCounters(java.util.Map.of("campaignsPublished", 3, "campaignsDrafts", 2, "campaignsTrash", 0));
        assertThat(counters.buildMenuCounters(profile, profile).menuCounters()).isEqualTo(profile.getMenuCounters());
        verifyNoInteractions(users);
    }

    private Users user(String id) {
        var user = new Users();
        user.setId(id);
        user.setUserId(id);
        user.setName(id);
        return user;
    }
}
