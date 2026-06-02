package com.raxim.myscoutee.profile.security.condition;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.security.AccessPolicyCondition;
import com.raxim.myscoutee.profile.security.AccessPolicyContext;
import com.raxim.myscoutee.profile.security.AccessPolicyData;

@Component
public class ActorCanManageSupportChatCondition implements AccessPolicyCondition {
    @Override
    public String name() {
        return "actorCanManageSupportChat";
    }

    @Override
    public boolean matches(AccessPolicyContext context, AccessPolicyData data) {
        return data.canManageSupportChat(context.resourceId(), context.actorUserId());
    }
}
