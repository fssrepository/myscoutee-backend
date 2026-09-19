package com.raxim.myscoutee.common.config;

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

import com.raxim.myscoutee.profile.service.IntegrationTokenService;

class IntegrationTokenAuthenticationFilterTest {
    private final IntegrationTokenService tokenService = org.mockito.Mockito.mock(IntegrationTokenService.class);
    private final IntegrationTokenAuthenticationFilter filter = new IntegrationTokenAuthenticationFilter(tokenService);

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
        when(tokenService.authenticate("msc_test", clientId, "203.0.113.8")).thenReturn("owner-1");

        filter.doFilter(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(chain.getRequest()).isSameAs(request);
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("owner-1");
        verify(tokenService).authenticate("msc_test", clientId, "203.0.113.8");
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
