package com.raxim.myscoutee.profile.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.lang.reflect.Method;
import java.util.Map;

import org.aopalliance.intercept.MethodInvocation;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;

@ExtendWith(MockitoExtension.class)
class RequiresPolicyMethodInterceptorTest {
    @Mock
    private AccessControlService accessControlService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void allowsAnnotatedMethodWhenPolicyPasses() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("replace", request("event-1", "u1"));
        when(accessControlService.resolveActorUserId(null)).thenReturn("u1");
        when(accessControlService.can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT, "u1", "u1", "event-1")).thenReturn(true);

        Object result = interceptor.invoke(invocation);

        assertThat(result).isEqualTo("ok");
        verify(invocation).proceed();
    }

    @Test
    void deniesAnnotatedMethodWhenPolicyFails() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("replace", request("event-1", "u1"));
        when(accessControlService.resolveActorUserId(null)).thenReturn("u2");
        when(accessControlService.can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT, "u2", "u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> interceptor.invoke(invocation))
                .isInstanceOf(ResponseStatusException.class);

        verify(invocation, never()).proceed();
    }

    @Test
    void allowsAnyPolicyGroupWhenOnePolicyPasses() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("replaceWithSubmitOrManagerPolicy", request("event-1", "u1"));
        when(accessControlService.resolveActorUserId(null)).thenReturn("manager-1");
        when(accessControlService.can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT, "manager-1", "u1", "event-1")).thenReturn(false);
        when(accessControlService.can(AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE, "manager-1", "manager-1", "event-1")).thenReturn(true);

        Object result = interceptor.invoke(invocation);

        assertThat(result).isEqualTo("ok");
        verify(invocation).proceed();
    }

    @Test
    void deniesAnyPolicyGroupWhenAllPoliciesFail() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("replaceWithSubmitOrManagerPolicy", request("event-1", "u1"));
        when(accessControlService.resolveActorUserId(null)).thenReturn("manager-1");
        when(accessControlService.can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT, "manager-1", "u1", "event-1")).thenReturn(false);
        when(accessControlService.can(AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE, "manager-1", "manager-1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> interceptor.invoke(invocation))
                .isInstanceOf(ResponseStatusException.class);

        verify(invocation, never()).proceed();
    }

    @Test
    void supportsActorExpressionAndParameterIndexFallback() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("replaceWithActorExpression", request("event-1", "u1"));
        when(accessControlService.can(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT, "u1", "u1", "event-1")).thenReturn(true);

        Object result = interceptor.invoke(invocation);

        assertThat(result).isEqualTo("ok");
        verify(accessControlService, never()).resolveActorUserId(any(Authentication.class));
    }

    @Test
    void bypassesPolicyWhenAuthenticationIsOptional() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("replaceInDevMode", request("event-1", "u1"));
        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);

        Object result = interceptor.invoke(invocation);

        assertThat(result).isEqualTo("ok");
        verify(accessControlService, never()).can(any(), any(), any(), any());
    }

    @Test
    void bypassesPolicyGroupWhenAuthenticationIsOptional() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("replaceWithOptionalPolicyGroup", request("event-1", "u1"));
        when(accessControlService.requiresAuthenticatedActor()).thenReturn(false);

        Object result = interceptor.invoke(invocation);

        assertThat(result).isEqualTo("ok");
        verify(accessControlService, never()).can(any(), any(), any(), any());
    }

    @Test
    void deniesWhenPolicyExpressionCannotBeEvaluated() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("replaceWithBrokenExpression", request("event-1", "u1"));
        when(accessControlService.resolveActorUserId(null)).thenReturn("u1");

        assertThatThrownBy(() -> interceptor.invoke(invocation))
                .isInstanceOf(ResponseStatusException.class);

        verify(accessControlService, never()).can(any(), any(), any(), any());
        verify(invocation, never()).proceed();
    }

    @Test
    void proceedsWhenMethodHasNoPolicyAnnotation() throws Throwable {
        RequiresPolicyMethodInterceptor interceptor = interceptor();
        MethodInvocation invocation = invocation("open", request("event-1", "u1"));

        Object result = interceptor.invoke(invocation);

        assertThat(result).isEqualTo("ok");
        verify(accessControlService, never()).can(any(), any(), any(), any());
    }

    private RequiresPolicyMethodInterceptor interceptor() {
        return new RequiresPolicyMethodInterceptor(accessControlService, new PolicyExpressionEvaluator());
    }

    private MethodInvocation invocation(String methodName, ActivitySubEventResourceStateDto request) throws Throwable {
        Fixture target = new Fixture();
        Method method = Fixture.class.getDeclaredMethod(methodName, ActivitySubEventResourceStateDto.class);
        MethodInvocation invocation = org.mockito.Mockito.mock(MethodInvocation.class);
        when(invocation.getMethod()).thenReturn(method);
        when(invocation.getThis()).thenReturn(target);
        lenient().when(invocation.getArguments()).thenReturn(new Object[] { request });
        lenient().when(invocation.proceed()).thenReturn("ok");
        return invocation;
    }

    private ActivitySubEventResourceStateDto request(String ownerId, String assetOwnerUserId) {
        return new ActivitySubEventResourceStateDto(ownerId, "sub-1", assetOwnerUserId, Map.of(), Map.of(), Map.of(), Map.of());
    }

    private static class Fixture {
        @RequiresPolicy(
                key = AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                subject = "#request.assetOwnerUserId()",
                resourceId = "#request.ownerId()")
        String replace(ActivitySubEventResourceStateDto request) {
            return "unused";
        }

        @RequiresPolicies(
                mode = RequiresPolicies.Mode.ANY,
                value = {
                        @RequiresPolicy(
                                key = AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                                subject = "#request.assetOwnerUserId()",
                                resourceId = "#request.ownerId()"),
                        @RequiresPolicy(
                                key = AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE,
                                subject = "#actorUserId",
                                resourceId = "#request.ownerId()")
                })
        String replaceWithSubmitOrManagerPolicy(ActivitySubEventResourceStateDto request) {
            return "unused";
        }

        @RequiresPolicy(
                key = AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                actor = "#request.assetOwnerUserId()",
                subject = "#p0.assetOwnerUserId()",
                resourceId = "#p0.ownerId()")
        String replaceWithActorExpression(ActivitySubEventResourceStateDto request) {
            return "unused";
        }

        @RequiresPolicy(
                key = AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                subject = "#request.assetOwnerUserId()",
                resourceId = "#request.ownerId()",
                skipWhenAuthenticationOptional = true)
        String replaceInDevMode(ActivitySubEventResourceStateDto request) {
            return "unused";
        }

        @RequiresPolicies(
                mode = RequiresPolicies.Mode.ANY,
                skipWhenAuthenticationOptional = true,
                value = {
                        @RequiresPolicy(
                                key = AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                                subject = "#request.assetOwnerUserId()",
                                resourceId = "#request.ownerId()"),
                        @RequiresPolicy(
                                key = AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE,
                                subject = "#actorUserId",
                                resourceId = "#request.ownerId()")
                })
        String replaceWithOptionalPolicyGroup(ActivitySubEventResourceStateDto request) {
            return "unused";
        }

        @RequiresPolicy(
                key = AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                subject = "#request.missing()",
                resourceId = "#request.ownerId()")
        String replaceWithBrokenExpression(ActivitySubEventResourceStateDto request) {
            return "unused";
        }

        String open(ActivitySubEventResourceStateDto request) {
            return "unused";
        }
    }
}
