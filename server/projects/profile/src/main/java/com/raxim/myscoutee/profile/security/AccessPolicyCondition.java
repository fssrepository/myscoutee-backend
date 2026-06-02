package com.raxim.myscoutee.profile.security;

public interface AccessPolicyCondition {
    String name();

    boolean matches(AccessPolicyContext context, AccessPolicyData data);
}
