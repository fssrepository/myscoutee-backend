package com.raxim.myscoutee.profile.security;

import java.lang.reflect.Method;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.springframework.aop.support.AopUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Component
public class RequiresPolicyMethodInterceptor implements MethodInterceptor {
    private final AccessControlService accessControlService;
    private final PolicyExpressionEvaluator expressionEvaluator;

    public RequiresPolicyMethodInterceptor(
            AccessControlService accessControlService,
            PolicyExpressionEvaluator expressionEvaluator) {
        this.accessControlService = accessControlService;
        this.expressionEvaluator = expressionEvaluator;
    }

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        RequiresPolicy requiresPolicy = RequiresPolicySupport.findAnnotation(invocation.getMethod(), invocation.getThis());
        if (requiresPolicy == null) {
            return invocation.proceed();
        }
        if (requiresPolicy.skipWhenAuthenticationOptional() && !accessControlService.requiresAuthenticatedActor()) {
            return invocation.proceed();
        }

        Method method = mostSpecificMethod(invocation);
        Object[] arguments = invocation.getArguments();
        Object target = invocation.getThis();
        String actorUserId = resolveActorUserId(requiresPolicy, method, arguments, target);
        String subjectUserId = evaluate(requiresPolicy.subject(), method, arguments, target);
        String resourceId = evaluate(requiresPolicy.resourceId(), method, arguments, target);
        if (!accessControlService.can(requiresPolicy.key(), actorUserId, subjectUserId, resourceId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Policy authorization denied.");
        }
        return invocation.proceed();
    }

    private String resolveActorUserId(RequiresPolicy requiresPolicy, Method method, Object[] arguments, Object target) {
        String actorExpression = requiresPolicy.actor();
        if (StringUtils.hasText(actorExpression)) {
            return evaluate(actorExpression, method, arguments, target);
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return accessControlService.resolveActorUserId(authentication);
    }

    private String evaluate(String expression, Method method, Object[] arguments, Object target) {
        try {
            return expressionEvaluator.evaluate(expression, method, arguments, target);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Policy expression could not be evaluated.", exception);
        }
    }

    private Method mostSpecificMethod(MethodInvocation invocation) {
        Object target = invocation.getThis();
        if (target == null) {
            return invocation.getMethod();
        }
        return AopUtils.getMostSpecificMethod(invocation.getMethod(), target.getClass());
    }
}
