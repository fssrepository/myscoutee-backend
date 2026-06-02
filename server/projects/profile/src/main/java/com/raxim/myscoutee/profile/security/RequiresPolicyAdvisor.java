package com.raxim.myscoutee.profile.security;

import java.lang.reflect.Method;

import org.springframework.aop.support.StaticMethodMatcherPointcutAdvisor;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;

@Component
public class RequiresPolicyAdvisor extends StaticMethodMatcherPointcutAdvisor {
    public RequiresPolicyAdvisor(RequiresPolicyMethodInterceptor interceptor) {
        setAdvice(interceptor);
        setOrder(Ordered.HIGHEST_PRECEDENCE + 100);
    }

    @Override
    public boolean matches(Method method, Class<?> targetClass) {
        return RequiresPolicySupport.findAnnotation(method, targetClass) != null;
    }
}
