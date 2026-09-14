package com.raxim.myscoutee.common.config.firebase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.DemoSessionRequestSupport;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.service.UserLoginSessionService;

import jakarta.servlet.FilterChain;

class FirebaseFilterOperatorTest {
    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void publicExploreOperatorApiFailsClosedWithoutSelectedDemoUserHeader() throws Exception {
        FirebaseService firebaseService = mock(FirebaseService.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(true);
        UserLoginSessionService sessionService = mock(UserLoginSessionService.class);
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                mock(FirebaseTokenVerifier.class),
                sessionService,
                mock(com.raxim.myscoutee.profile.service.media.MediaSessionAccessService.class));
        MockHttpServletRequest request = demoOperatorRequest();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, new MockHttpServletResponse(), chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(firebaseService, never()).loadDemoOperatorById(org.mockito.ArgumentMatchers.any());
        verify(sessionService, never()).isCurrentUserEnrolled();
        verify(chain).doFilter(
                org.mockito.ArgumentMatchers.eq(request),
                org.mockito.ArgumentMatchers.any());
    }

    @Test
    void anonymousPublicHealthRequestDoesNotRequireAnApplicationSession()
            throws Exception {
        FirebaseService firebaseService = mock(FirebaseService.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(true);
        UserLoginSessionService sessionService = mock(UserLoginSessionService.class);
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                mock(FirebaseTokenVerifier.class),
                sessionService,
                mock(com.raxim.myscoutee.profile.service.media.MediaSessionAccessService.class));
        MockHttpServletRequest request =
                new MockHttpServletRequest("GET", "/health");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNull();
        verify(sessionService, never()).isCurrentUserEnrolled();
        verify(sessionService, never()).isCurrentSessionActive(
                org.mockito.ArgumentMatchers.any());
        verify(chain).doFilter(request, response);
    }

    @Test
    void publicHealthRequestSkipsMemberFallbackWhenFirebaseIsDisabled()
            throws Exception {
        FirebaseService firebaseService = mock(FirebaseService.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(false);
        properties.setMemberUser("member1@myscoutee.local");
        UserLoginSessionService sessionService = mock(UserLoginSessionService.class);
        when(sessionService.isCurrentUserEnrolled()).thenReturn(true);
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                mock(FirebaseTokenVerifier.class),
                sessionService,
                mock(com.raxim.myscoutee.profile.service.media.MediaSessionAccessService.class));
        MockHttpServletRequest request =
                new MockHttpServletRequest("GET", "/health");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(firebaseService, never()).loadUserByUsername(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString());
        verify(sessionService, never()).isCurrentUserEnrolled();
        verify(chain).doFilter(request, response);
    }

    @Test
    void publicMediaRequestSkipsMemberFallbackWhenFirebaseIsDisabled()
            throws Exception {
        FirebaseService firebaseService = mock(FirebaseService.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(false);
        properties.setMemberUser("member1@myscoutee.local");
        UserLoginSessionService sessionService = mock(UserLoginSessionService.class);
        when(sessionService.isCurrentUserEnrolled()).thenReturn(true);
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                mock(FirebaseTokenVerifier.class),
                sessionService,
                mock(com.raxim.myscoutee.profile.service.media.MediaSessionAccessService.class));
        MockHttpServletRequest request =
                new MockHttpServletRequest("GET", "/api/media/public/help/e2e-small.webp");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(firebaseService, never()).loadUserByUsername(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString());
        verify(sessionService, never()).isCurrentUserEnrolled();
        verify(sessionService, never()).isCurrentSessionActive(
                org.mockito.ArgumentMatchers.any());
        verify(chain).doFilter(request, response);
    }

    @Test
    void selectedStoredDemoOperatorGetsOnlyServerDerivedAuthorities() throws Exception {
        FirebaseService firebaseService = mock(FirebaseService.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(true);
        Users user = new Users();
        user.setUserId("operator-demo-dev");
        user.setOperator(true);
        FirebasePrincipal principal = new FirebasePrincipal(
                "operator-demo-dev",
                "operator@myscoutee.local",
                List.of("U", "O"),
                user);
        when(firebaseService.loadDemoOperatorById("operator-demo-dev")).thenReturn(principal);
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                mock(FirebaseTokenVerifier.class),
                mock(UserLoginSessionService.class),
                mock(com.raxim.myscoutee.profile.service.media.MediaSessionAccessService.class));
        MockHttpServletRequest request = demoOperatorRequest();
        request.addHeader("X-Demo-User-Id", "operator-demo-dev");

        filter.doFilter(request, new MockHttpServletResponse(), mock(FilterChain.class));

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getAuthorities())
                .extracting(Object::toString)
                .containsExactly("U", "O");
    }

    @Test
    void existingBootstrapAuthenticationIsNeverReplacedByDemoFallback()
            throws Exception {
        FirebaseService firebaseService = mock(FirebaseService.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(false);
        FirebasePrincipal principal = new FirebasePrincipal(
                "real-operator",
                "operator@deployment.invalid",
                List.of("U", "O"),
                null);
        FirebaseAuthenticationToken bootstrapAuthentication =
                new FirebaseAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(
                bootstrapAuthentication);
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                mock(FirebaseTokenVerifier.class),
                mock(UserLoginSessionService.class),
                mock(com.raxim.myscoutee.profile.service.media.MediaSessionAccessService.class));
        MockHttpServletRequest request = demoOperatorRequest();
        request.addHeader("X-Demo-User-Id", "operator-demo-dev");
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(
                request,
                new MockHttpServletResponse(),
                chain);

        assertThat(SecurityContextHolder.getContext()
                .getAuthentication()).isSameAs(
                        bootstrapAuthentication);
        verify(firebaseService, never())
                .loadDemoOperatorById(
                        org.mockito.ArgumentMatchers.anyString());
        verify(firebaseService, never())
                .loadUserByUsername(
                        org.mockito.ArgumentMatchers.anyString(),
                        org.mockito.ArgumentMatchers.any(),
                        org.mockito.ArgumentMatchers.anyString());
        verify(chain).doFilter(
                org.mockito.ArgumentMatchers.eq(request),
                org.mockito.ArgumentMatchers.any());
    }

    @Test
    void selectedDemoMemberHeaderAuthenticatesBodyOnlyApiRequests()
            throws Exception {
        FirebaseService firebaseService = mock(FirebaseService.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(false);
        Users user = new Users();
        user.setUserId("nova-social");
        FirebasePrincipal principal = new FirebasePrincipal(
                "nova-social",
                "nova@myscoutee.local",
                List.of("U"),
                user);
        when(firebaseService.loadUserById("nova-social")).thenReturn(principal);
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                mock(FirebaseTokenVerifier.class),
                mock(UserLoginSessionService.class),
                mock(com.raxim.myscoutee.profile.service.media.MediaSessionAccessService.class));
        MockHttpServletRequest request =
                new MockHttpServletRequest("POST", "/api/game-cards/query");
        request.addHeader(
                DemoSessionRequestSupport.SESSION_KIND_HEADER,
                "demo");
        request.addHeader("X-Demo-User-Id", "nova-social");

        filter.doFilter(
                request,
                new MockHttpServletResponse(),
                mock(FilterChain.class));

        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication()
                .getName()).isEqualTo("nova@myscoutee.local");
        verify(firebaseService).loadUserById("nova-social");
        verify(firebaseService, never()).loadUserByUsername(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void bootstrapLoginIgnoresStaleFirebaseBearerCredential()
            throws Exception {
        FirebaseService firebaseService = mock(FirebaseService.class);
        FirebaseTokenVerifier verifier = mock(FirebaseTokenVerifier.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(true);
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                verifier,
                mock(UserLoginSessionService.class),
                mock(com.raxim.myscoutee.profile.service.media.MediaSessionAccessService.class));
        MockHttpServletRequest request =
                new MockHttpServletRequest(
                        "POST",
                        "/api/auth/operator-bootstrap");
        request.addHeader("Authorization", "Bearer expired-firebase-token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNull();
        verify(verifier, never()).verify(
                org.mockito.ArgumentMatchers.anyString());
        verify(firebaseService, never()).loadUserByCredential(
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString());
        verify(chain).doFilter(request, response);
    }

    private MockHttpServletRequest demoOperatorRequest() {
        MockHttpServletRequest request =
                new MockHttpServletRequest("GET", "/api/operator/registry");
        request.addHeader(DemoSessionRequestSupport.SESSION_KIND_HEADER, "demo");
        return request;
    }
}
