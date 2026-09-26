package com.raxim.myscoutee.common.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.config.firebase.FirebaseAuthenticationToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.service.CommunityGroupProfilesService;
import jakarta.servlet.FilterChain;

class GroupWorkspaceFilterTest {
    private final CommunityGroupProfilesService profiles = mock(CommunityGroupProfilesService.class);
    private final Users account = user("account", null);
    private final Users workspace = user("group-profile", "saved-group");
    private GroupWorkspaceFilter filter;
    private FirebaseAuthenticationToken original;
    @BeforeEach @SuppressWarnings("unchecked") void setup() {
        ObjectProvider<CommunityGroupProfilesService> provider = mock(ObjectProvider.class);
        when(provider.getObject()).thenReturn(profiles);
        filter = new GroupWorkspaceFilter(provider);
        var principal = new FirebasePrincipal("account", "account@example.invalid", List.of("U"), account);
        original = new FirebaseAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(original);
        when(profiles.current(account)).thenReturn(workspace);
    }
    @AfterEach void cleanup() { SecurityContextHolder.clearContext(); }

    @Test void ordinaryRequestsUseSavedWorkspaceAndIgnoreForgedScopeHeaderOrParameter() throws Exception {
        var request = request("GET", "/activities/events");
        request.addHeader("X-MyScoutee-Group-Id", "another-group");
        request.addParameter("groupId", "another-group");
        filter.doFilter(request, new MockHttpServletResponse(), (req, res) ->
            assertThat(principal().getUserId()).isEqualTo("group-profile"));
        verify(profiles).current(account);
        verify(profiles, never()).activate(any(), any());
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isSameAs(original);
    }
    @Test void profileReloadWithoutParameterOnlyReadsSavedSelection() throws Exception {
        filter.doFilter(request("GET", "/auth/me/profile-ext"), new MockHttpServletResponse(), (req, res) ->
            assertThat(principal().getUserId()).isEqualTo("group-profile"));
        verify(profiles).current(account);
        verify(profiles, never()).activate(any(), any());
    }
    @Test void profileLoadWithParameterSelectsAndReturnsThatProfile() throws Exception {
        var request = request("GET", "/auth/me/profile-ext");
        request.addParameter("groupId", "saved-group");
        when(profiles.select("account", "saved-group")).thenReturn(workspace);
        filter.doFilter(request, new MockHttpServletResponse(), (req, res) ->
            assertThat(principal().getUserId()).isEqualTo("group-profile"));
        verify(profiles).select("account", "saved-group");
        verify(profiles, never()).activate(any(), any());
        verify(profiles, never()).current(any());
    }
    @Test void explicitEmptyParameterReturnsToBaseProfile() throws Exception {
        var request = request("GET", "/auth/me/profile-ext"); request.addParameter("groupId", "");
        filter.doFilter(request, new MockHttpServletResponse(), (req, res) ->
            assertThat(principal().getUserId()).isEqualTo("account"));
        verifyNoInteractions(profiles);
    }
    @Test void forbiddenSelectionCannotReachControllerAndRestoresAuthentication() throws Exception {
        var request = request("GET", "/auth/me/profile-ext"); request.addParameter("groupId", "forbidden");
        var response = new MockHttpServletResponse(); var chain = mock(FilterChain.class);
        when(profiles.select("account", "forbidden")).thenThrow(new ResponseStatusException(HttpStatus.FORBIDDEN));
        filter.doFilter(request, response, chain);
        assertThat(response.getStatus()).isEqualTo(403);
        verifyNoInteractions(chain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isSameAs(original);
    }
    @Test void accountRoutesRemainOnAccountWithoutChangingSelection() throws Exception {
        for (String path : List.of("/groups", "/auth/me/partner-invite/claim", "/notifications", "/auth/session/login", "/assets", "/assets/a/availability", "/navigator/contacts")) {
            filter.doFilter(request("POST", path), new MockHttpServletResponse(), (req, res) ->
                assertThat(principal().getUserId()).isEqualTo("account"));
        }
        verifyNoInteractions(profiles);
    }
    @Test void profileAndAffiliateSettingsFollowSavedGroup() throws Exception {
        for (String path : List.of("/integrations/settings", "/integrations/tokens", "/payment-methods/history", "/auth/me/profile-ext")) {
            filter.doFilter(request("GET", path), new MockHttpServletResponse(), (req, res) ->
                assertThat(principal().getUserId()).isEqualTo("group-profile"));
        }
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isSameAs(original);
    }
    @Test void eventLinkedAssetActionsRetainTheSelectedEventProfile() throws Exception {
        for (String path : List.of("/assets/members/action", "/assets/requests", "/assets/tickets/validate")) {
            filter.doFilter(request("POST", path), new MockHttpServletResponse(), (req, res) ->
                    assertThat(principal().getUserId()).isEqualTo("group-profile"));
        }
        var detail = request("GET", "/assets/asset-1");
        detail.addParameter("eventId", "event-1"); detail.addParameter("subEventId", "sub-1");
        filter.doFilter(detail, new MockHttpServletResponse(), (req, res) ->
                assertThat(principal().getUserId()).isEqualTo("group-profile"));
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isSameAs(original);
    }

    private FirebasePrincipal principal() { return (FirebasePrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal(); }
    private MockHttpServletRequest request(String method, String path) {
        var request = new MockHttpServletRequest(method, path); request.setServletPath(path); return request;
    }
    private Users user(String id, String groupId) {
        var user = new Users(); user.setUserId(id); user.setId(id); user.setWorkspaceGroupId(groupId); return user;
    }
}
