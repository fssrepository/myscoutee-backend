package com.raxim.myscoutee.domain.access.security;

import com.raxim.myscoutee.domain.access.api.RequiresPolicy;
import com.raxim.myscoutee.domain.access.api.AccessPolicyKeys;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.server.ResponseStatusException;

@org.junit.jupiter.api.Tag("embedded")
class RequiresPolicyRegistrationTest {
    @Test
    void methodSecurityRegistersThePolicyAdvisorAndEnforcesDecisions() {
        try (var context = new AnnotationConfigApplicationContext(SecurityConfiguration.class)) {
            var access = context.getBean(AccessControlService.class);
            var protectedBean = context.getBean(ProtectedBean.class);
            when(access.resolveActorUserId(null)).thenReturn("viewer");

            assertThatThrownBy(() -> protectedBean.read("image-key"))
                    .isInstanceOf(ResponseStatusException.class)
                    .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value()).isEqualTo(403));
            assertThat(protectedBean.calls()).isZero();
            verify(access).can(AccessPolicyKeys.MEDIA_READ, "viewer", "viewer", "image-key");

            when(access.can(AccessPolicyKeys.MEDIA_READ, "viewer", "viewer", "image-key")).thenReturn(true);
            assertThat(protectedBean.read("image-key")).isEqualTo("bytes");
            assertThat(protectedBean.calls()).isEqualTo(1);
            // The existing explicit dev/demo opt-out remains effective.
            assertThat(protectedBean.optional()).isEqualTo("optional");
        }
    }

    @Configuration(proxyBeanMethods = false)
    @EnableMethodSecurity
    @Import({RequiresPolicyAdvisor.class, RequiresPolicyMethodInterceptor.class, PolicyExpressionEvaluator.class})
    static class SecurityConfiguration {
        @Bean AccessControlService accessControlService() { return mock(AccessControlService.class); }
        @Bean ProtectedBean protectedBean() { return new ProtectedBean(); }
    }

    static class ProtectedBean {
        private int calls;

        @RequiresPolicy(key = AccessPolicyKeys.MEDIA_READ, subject = "#actorUserId", resourceId = "#p0")
        public String read(String key) { calls++; return "bytes"; }

        @RequiresPolicy(key = AccessPolicyKeys.MEDIA_READ, subject = "#actorUserId", resourceId = "'optional'",
                skipWhenAuthenticationOptional = true)
        public String optional() { return "optional"; }

        public int calls() { return calls; }
    }
}
