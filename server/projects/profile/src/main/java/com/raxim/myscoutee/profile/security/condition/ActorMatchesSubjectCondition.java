package com.raxim.myscoutee.profile.security.condition;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.security.AccessPolicyCondition;
import com.raxim.myscoutee.profile.security.AccessPolicyContext;
import com.raxim.myscoutee.profile.security.AccessPolicyData;

@Component
public class ActorMatchesSubjectCondition implements AccessPolicyCondition {
    @Override
    public String name() {
        return "actorMatchesSubject";
    }

    @Override
    public boolean matches(AccessPolicyContext context, AccessPolicyData data) {
        return StringUtils.hasText(context.actorUserId())
                && context.actorUserId().equals(context.subjectUserId());
    }
}
