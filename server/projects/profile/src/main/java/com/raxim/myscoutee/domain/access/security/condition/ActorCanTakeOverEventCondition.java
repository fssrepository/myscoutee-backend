package com.raxim.myscoutee.domain.access.security.condition;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.access.security.AccessPolicyCondition;
import com.raxim.myscoutee.domain.access.security.AccessPolicyContext;
import com.raxim.myscoutee.domain.access.security.AccessPolicyData;

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
