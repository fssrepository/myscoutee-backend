package com.raxim.myscoutee.domain.integrations.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import com.raxim.myscoutee.domain.integrations.service.IntegrationTokenService;
import com.raxim.myscoutee.domain.integrations.service.IntegrationTokenService.AuthenticatedIntegrationClient;

@org.junit.jupiter.api.Tag("standard")
class IntegrationTokenAuthenticationFilterTest {
    private final IntegrationTokenService tokenService = org.mockito.Mockito.mock(IntegrationTokenService.class);
    private final com.raxim.myscoutee.domain.accounts.repository.UsersRepository users = org.mockito.Mockito.mock(com.raxim.myscoutee.domain.accounts.repository.UsersRepository.class);
    private final com.raxim.myscoutee.domain.groups.service.CommunityGroupProfilesService profiles = org.mockito.Mockito.mock(com.raxim.myscoutee.domain.groups.service.CommunityGroupProfilesService.class);
    private final IntegrationTokenAuthenticationFilter filter = new IntegrationTokenAuthenticationFilter(tokenService, users, profiles,
            new com.raxim.myscoutee.domain.integrations.service.IntegrationRoleAccessService(null, null));

    @Test void oauthUsesTheSameIntegrationAuthorityAndNeverFallsBackToApiKeys() throws Exception {
        var oauth = org.mockito.Mockito.mock(com.raxim.myscoutee.domain.integrations.service.McpAuthorizationService.class);
        org.springframework.beans.factory.ObjectProvider<com.raxim.myscoutee.domain.integrations.service.McpAuthorizationService> provider =
                org.mockito.Mockito.mock(org.springframework.beans.factory.ObjectProvider.class);
        when(provider.getObject()).thenReturn(oauth);
        org.springframework.test.util.ReflectionTestUtils.setField(filter, "mcp", provider);
        var request = new MockHttpServletRequest("POST", "/integrations/v1/connect");
        request.addHeader("Authorization", "Bearer mca_test");
        request.addHeader(IntegrationTokenAuthenticationFilter.CLIENT_ID_HEADER, "ignored");
        var denied = new MockHttpServletResponse();
        filter.doFilter(request, denied, new MockFilterChain());
        assertThat(denied.getStatus()).isEqualTo(401);
        verifyNoInteractions(tokenService);
        var owner = new com.raxim.myscoutee.domain.accounts.document.Users(); owner.setUserId("owner");
        when(users.findByUserId("owner")).thenReturn(java.util.Optional.of(owner));
        when(oauth.authenticate("mca_test")).thenReturn(new AuthenticatedIntegrationClient("owner", "client", "client"));
        var chain = new MockFilterChain();var response = new MockHttpServletResponse();
        filter.doFilter(request, response, chain);
        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(SecurityContextHolder.getContext().getAuthentication().getAuthorities())
                .extracting("authority").containsExactly("INTEGRATION");
        verifyNoInteractions(tokenService);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void blocksIntegrationRequestWithoutTokenBeforeController() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/integrations/v1/connect");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(chain.getRequest()).isNull();
    }

    @Test
    void authenticatesClaimedClientAndContinuesFilterChain() throws Exception {
        String clientId = UUID.randomUUID().toString();
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/integrations/v1/connect");
        request.addHeader("Authorization", "Bearer msc_test");
        request.addHeader(IntegrationTokenAuthenticationFilter.CLIENT_ID_HEADER, clientId);
        request.setRemoteAddr("203.0.113.8");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();
        when(tokenService.authenticateClient("msc_test", clientId, "203.0.113.8"))
                .thenReturn(new AuthenticatedIntegrationClient("owner-1", "token-1", clientId));

        var owner = new com.raxim.myscoutee.domain.accounts.document.Users(); owner.setUserId("owner-1");
        when(users.findByUserId("owner-1")).thenReturn(java.util.Optional.of(owner));
        filter.doFilter(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(chain.getRequest()).isSameAs(request);
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("owner-1");
        assertThat(SecurityContextHolder.getContext().getAuthentication().getDetails())
                .isEqualTo(new AuthenticatedIntegrationClient("owner-1", "token-1", clientId));
        verify(tokenService).authenticateClient("msc_test", clientId, "203.0.113.8");
    }

    @Test void groupKeyKeepsItsGroupForEventsAndCannotCreateAccountAssets() throws Exception {
        var owner = new com.raxim.myscoutee.domain.accounts.document.Users();
        owner.setUserId("profile"); owner.setWorkspaceGroupId("group"); owner.setAccountUserId("account");
        when(tokenService.authenticateClient(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any()))
            .thenReturn(new AuthenticatedIntegrationClient("profile", "key", "client"));
        when(users.findByUserId("profile")).thenReturn(java.util.Optional.of(owner));
        when(profiles.select("account", "group")).thenReturn(owner);
        var eventChain = new MockFilterChain();
        filter.doFilter(new MockHttpServletRequest("POST", "/integrations/v1/events"), new MockHttpServletResponse(), eventChain);
        assertThat(eventChain.getRequest()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("profile");
        assertThat(com.raxim.myscoutee.domain.groups.service.CommunityGroupProfilesService.currentGroupId()).isEqualTo("group");
        for (String path : java.util.List.of("/integrations/v1/assets", "/api/integrations/v1/assets")) {
            for (String contentType : java.util.List.of("application/json", "multipart/form-data")) {
                var request = new MockHttpServletRequest("POST", path);
                request.setContentType(contentType);
                var response = new MockHttpServletResponse();
                var chain = new MockFilterChain();
                filter.doFilter(request, response, chain);
                assertThat(response.getStatus()).isEqualTo(403);
                assertThat(chain.getRequest()).isNull();
                assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
            }
        }
        org.mockito.Mockito.verify(profiles, org.mockito.Mockito.never()).current(org.mockito.ArgumentMatchers.any());
    }

    @Test void baseKeyCreatesAssetsEvenWhenInteractiveSessionHasSelectedAGroup() throws Exception {
        var account = new com.raxim.myscoutee.domain.accounts.document.Users();
        account.setUserId("account"); account.setActiveWorkspaceGroupId("selected-group");
        when(tokenService.authenticateClient(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any()))
            .thenReturn(new AuthenticatedIntegrationClient("account", "key", "client"));
        when(users.findByUserId("account")).thenReturn(java.util.Optional.of(account));
        var response = new MockHttpServletResponse();
        var chain = new MockFilterChain();
        filter.doFilter(new MockHttpServletRequest("POST", "/integrations/v1/assets"), response, chain);
        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(chain.getRequest()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("account");
        assertThat(com.raxim.myscoutee.domain.groups.service.CommunityGroupProfilesService.currentGroupId()).isNull();
        verifyNoInteractions(profiles);
    }

    @Test void groupKeyCannotOutliveAcceptedMembership() throws Exception {
        var owner = new com.raxim.myscoutee.domain.accounts.document.Users();
        owner.setUserId("profile"); owner.setWorkspaceGroupId("group"); owner.setAccountUserId("account");
        when(tokenService.authenticateClient(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any()))
            .thenReturn(new AuthenticatedIntegrationClient("profile", "key", "client"));
        when(users.findByUserId("profile")).thenReturn(java.util.Optional.of(owner));
        when(profiles.select("account", "group")).thenThrow(new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN));
        var response = new MockHttpServletResponse(); var chain = new MockFilterChain();
        filter.doFilter(new MockHttpServletRequest("POST", "/integrations/v1/events"), response, chain);
        assertThat(response.getStatus()).isEqualTo(403);
        assertThat(chain.getRequest()).isNull();
    }

    @Test
    void leavesNonIntegrationRoutesUntouched() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/auth/me");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertThat(chain.getRequest()).isSameAs(request);
        verifyNoInteractions(tokenService);
    }
}
