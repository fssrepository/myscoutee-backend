package com.raxim.myscoutee.domain.access.security.condition;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.access.security.AccessPolicyCondition;
import com.raxim.myscoutee.domain.access.security.AccessPolicyContext;
import com.raxim.myscoutee.domain.access.security.AccessPolicyData;

@Component
public class ActorCanTakeOverAssetCondition implements AccessPolicyCondition {
    @Override
    public String name() {
        return "actorCanTakeOverAsset";
    }

    @Override
    public boolean matches(AccessPolicyContext context, AccessPolicyData data) {
        return data.canTakeOverAsset(context.resourceId(), context.actorUserId());
    }
}
