package com.raxim.myscoutee.profile.security;

import java.lang.reflect.Method;

import org.springframework.aop.support.AopUtils;
import org.springframework.core.annotation.AnnotatedElementUtils;

final class RequiresPolicySupport {
    private RequiresPolicySupport() {
    }

    static RequiresPolicy findAnnotation(Method method, Object target) {
        Class<?> targetClass = target == null ? null : target.getClass();
        return findAnnotation(method, targetClass);
    }

    static RequiresPolicy findAnnotation(Method method, Class<?> targetClass) {
        Method specificMethod = targetClass == null
                ? method
                : AopUtils.getMostSpecificMethod(method, targetClass);
        RequiresPolicy annotation = AnnotatedElementUtils.findMergedAnnotation(specificMethod, RequiresPolicy.class);
        if (annotation != null) {
            return annotation;
        }
        return AnnotatedElementUtils.findMergedAnnotation(method, RequiresPolicy.class);
    }
}
