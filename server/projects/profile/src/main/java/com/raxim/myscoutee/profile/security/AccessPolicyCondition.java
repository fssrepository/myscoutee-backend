package com.raxim.myscoutee.profile.security;

@FunctionalInterface
public interface AccessPolicyCondition {
    boolean matches(AccessPolicyContext context, AccessPolicyData data);
}
