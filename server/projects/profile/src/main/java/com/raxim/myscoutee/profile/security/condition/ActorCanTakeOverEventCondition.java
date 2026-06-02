package com.raxim.myscoutee.profile.security.condition;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.security.AccessPolicyCondition;
import com.raxim.myscoutee.profile.security.AccessPolicyContext;
import com.raxim.myscoutee.profile.security.AccessPolicyData;

@Component
public class ActorCanTakeOverEventCondition implements AccessPolicyCondition {
    @Override
    public String name() {
        return "actorCanTakeOverEvent";
    }

    @Override
    public boolean matches(AccessPolicyContext context, AccessPolicyData data) {
        return data.canTakeOverEvent(context.resourceId(), context.actorUserId());
    }
}
