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
        FirebaseFilter filter = new FirebaseFilter(
                firebaseService,
                properties,
                mock(FirebaseTokenVerifier.class));
        MockHttpServletRequest request = demoOperatorRequest();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, new MockHttpServletResponse(), chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(firebaseService, never()).loadDemoOperatorById(org.mockito.ArgumentMatchers.any());
        verify(chain).doFilter(
                org.mockito.ArgumentMatchers.eq(request),
                org.mockito.ArgumentMatchers.any());
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
                mock(FirebaseTokenVerifier.class));
        MockHttpServletRequest request = demoOperatorRequest();
        request.addHeader("X-Demo-User-Id", "operator-demo-dev");

        filter.doFilter(request, new MockHttpServletResponse(), mock(FilterChain.class));

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getAuthorities())
                .extracting(Object::toString)
                .containsExactly("U", "O");
    }

    private MockHttpServletRequest demoOperatorRequest() {
        MockHttpServletRequest request =
                new MockHttpServletRequest("GET", "/api/operator/registry");
        request.addHeader(DemoSessionRequestSupport.SESSION_KIND_HEADER, "demo");
        return request;
    }
}
