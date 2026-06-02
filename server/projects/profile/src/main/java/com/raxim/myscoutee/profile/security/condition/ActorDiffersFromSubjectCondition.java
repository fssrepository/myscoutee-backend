package com.raxim.myscoutee.profile.security.condition;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.security.AccessPolicyCondition;
import com.raxim.myscoutee.profile.security.AccessPolicyContext;
import com.raxim.myscoutee.profile.security.AccessPolicyData;

@Component
public class ActorDiffersFromSubjectCondition implements AccessPolicyCondition {
    @Override
    public String name() {
        return "actorDiffersFromSubject";
    }

    @Override
    public boolean matches(AccessPolicyContext context, AccessPolicyData data) {
        return StringUtils.hasText(context.actorUserId())
                && StringUtils.hasText(context.subjectUserId())
                && !context.actorUserId().equals(context.subjectUserId());
    }
}
