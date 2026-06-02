package com.raxim.myscoutee.profile.security.condition;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.security.AccessGrantEffect;
import com.raxim.myscoutee.profile.security.AccessPolicyCondition;
import com.raxim.myscoutee.profile.security.AccessPolicyContext;
import com.raxim.myscoutee.profile.security.AccessPolicyData;

@Component
public class ExplicitAllowCondition implements AccessPolicyCondition {
    @Override
    public String name() {
        return "explicitAllow";
    }

    @Override
    public boolean matches(AccessPolicyContext context, AccessPolicyData data) {
        return data.hasExplicitGrant(
                context.subjectUserId(),
                context.permission(),
                context.resourceType(),
                context.resourceId(),
                AccessGrantEffect.ALLOW);
    }
}
