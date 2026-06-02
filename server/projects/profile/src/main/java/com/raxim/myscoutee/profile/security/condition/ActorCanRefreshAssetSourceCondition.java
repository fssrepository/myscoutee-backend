package com.raxim.myscoutee.profile.security.condition;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.security.AccessPolicyCondition;
import com.raxim.myscoutee.profile.security.AccessPolicyContext;
import com.raxim.myscoutee.profile.security.AccessPolicyData;

@Component
public class ActorCanRefreshAssetSourceCondition implements AccessPolicyCondition {
    @Override
    public String name() {
        return "actorCanRefreshAssetSource";
    }

    @Override
    public boolean matches(AccessPolicyContext context, AccessPolicyData data) {
        String actorUserId = context.actorUserId();
        String subjectUserId = context.subjectUserId();
        String resourceId = context.resourceId();
        if (!StringUtils.hasText(actorUserId)
                || !StringUtils.hasText(subjectUserId)
                || !StringUtils.hasText(resourceId)) {
            return false;
        }
        if (resourceId.equals(subjectUserId)) {
            return actorUserId.equals(subjectUserId);
        }
        return data.canManageAsset(resourceId, actorUserId);
    }
}
