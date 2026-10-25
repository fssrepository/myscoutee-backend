package com.raxim.myscoutee.domain.accounts.controller;

import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.AccountIdentity;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.*;
import com.raxim.myscoutee.domain.accounts.service.*;
import com.raxim.myscoutee.domain.groups.api.ProfileWorkspaceLoads;
import com.raxim.myscoutee.domain.groups.dto.ProfileWorkspaceDto;
import org.junit.jupiter.api.*;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@Tag("standard")
class AuthProfileWorkspaceTest {
    final HomeUserProfileService profiles = mock(HomeUserProfileService.class);
    final ProfileWorkspaceLoads groups = mock(ProfileWorkspaceLoads.class);
    final AuthController controller = new AuthController(profiles, mock(UserLoginSessionService.class), groups, mock(com.raxim.myscoutee.domain.accounts.service.AccountLoginService.class));
    @AfterEach void clear() { SecurityContextHolder.clearContext(); }
    @Test void completesOnlyTheResolvedActorsAccountAndPreservesAccountResponse() {
        var actor = new Users(); actor.setUserId("selected-profile"); actor.setAccountUserId("account"); actor.setWorkspaceGroupId("current-workspace");
        var principal = mock(AccountIdentity.class); when(principal.getUser()).thenReturn(actor);
        when(principal.getProfileIdentity()).thenCallRealMethod();
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(principal, null, List.of()));
        var extended = new ProfileExtDto(mock(UserDto.class), List.of(), "affiliate");
        var preferences = mock(UserGameFilterPreferencesDto.class); var counters = mock(UserMenuCountersDto.class);
        var original = new ProfileExtByIdResponseDto(extended, 7, preferences, counters);
        when(profiles.loadProfileExtById("untrusted-request", 47d, 19d)).thenReturn(original);
        when(profiles.resolveCurrentUser("untrusted-request")).thenReturn(actor);
        var accountProfile = mock(UserDto.class);
        when(groups.loadProfileWorkspace("account", "current-workspace", "next-workspace")).thenReturn(new ProfileWorkspaceDto(null, accountProfile));
        var http = new MockHttpServletResponse();
        var response = controller.loadProfileExt("untrusted-request", "next-workspace", 47d, 19d, http);
        assertThat(response.profileExt()).isSameAs(extended); assertThat(response.filterCount()).isEqualTo(7);
        assertThat(response.filterPreferences()).isSameAs(preferences); assertThat(response.counterOverrides()).isSameAs(counters);
        assertThat(response.accountProfile()).isSameAs(accountProfile); assertThat(http.getHeader("Cache-Control")).isEqualTo("no-store");
        verify(groups).loadProfileWorkspace("account", "current-workspace", "next-workspace"); verifyNoMoreInteractions(groups);
    }
    @Test void failedOrMissingProfileDoesNotReachWorkspaceSelection() {
        assertThat(controller.loadProfileExt("missing", "next", null, null, new MockHttpServletResponse())).isNull();
        verify(profiles, never()).resolveCurrentUser("missing"); verifyNoInteractions(groups);
        when(profiles.loadProfileExtById("failed", null, null)).thenThrow(new IllegalStateException("profile failed"));
        assertThatThrownBy(() -> controller.loadProfileExt("failed", "next", null, null, new MockHttpServletResponse())).isInstanceOf(IllegalStateException.class);
        verifyNoInteractions(groups);
    }
    @Test void accountSelectionPreservesNullVersusExplicitBaseAndRejectsMissingActor() {
        var actor = new Users(); actor.setUserId("account");
        var original = new ProfileExtByIdResponseDto(null, 0, null, null);
        when(profiles.loadProfileExtById("account", null, null)).thenReturn(original);
        when(profiles.resolveCurrentUser("account")).thenReturn(actor);
        when(groups.loadProfileWorkspace("account", null, null)).thenReturn(new ProfileWorkspaceDto(null, null));
        when(groups.loadProfileWorkspace("account", null, "")).thenReturn(new ProfileWorkspaceDto(null, null));
        controller.loadProfileExt("account", null, null, null, new MockHttpServletResponse());
        controller.loadProfileExt("account", "", null, null, new MockHttpServletResponse());
        verify(groups).loadProfileWorkspace("account", null, null); verify(groups).loadProfileWorkspace("account", null, "");
        when(profiles.resolveCurrentUser("account")).thenReturn(null);
        assertThatThrownBy(() -> controller.loadProfileExt("account", "next", null, null, new MockHttpServletResponse()))
                .isInstanceOfSatisfying(ResponseStatusException.class, error -> assertThat(error.getStatusCode().value()).isEqualTo(401));
        verifyNoMoreInteractions(groups);
    }
}
