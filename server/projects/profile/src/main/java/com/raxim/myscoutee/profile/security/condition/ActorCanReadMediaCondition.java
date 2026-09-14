package com.raxim.myscoutee.profile.security.condition;

import org.springframework.stereotype.Component;
import com.raxim.myscoutee.profile.security.AccessPolicyCondition;
import com.raxim.myscoutee.profile.security.AccessPolicyContext;
import com.raxim.myscoutee.profile.security.AccessPolicyData;
import com.raxim.myscoutee.profile.security.MediaPolicyFacts;

@Component
public class ActorCanReadMediaCondition implements AccessPolicyCondition {
    private final MediaPolicyFacts media;

    public ActorCanReadMediaCondition(MediaPolicyFacts media) { this.media = media; }

    @Override public String name() { return "actorCanReadMedia"; }

    @Override public boolean matches(AccessPolicyContext context, AccessPolicyData data) {
        return media.canRead(context.actorUserId(), context.resourceId());
    }
}
