package com.raxim.myscoutee.domain.access.security;

import java.util.List;

import com.raxim.myscoutee.domain.access.security.condition.AcceptedParticipationCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanAccessChatCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanManageAssetCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanManageEventCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanManageMembersCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanManageSupportChatCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanReadMediaCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanTakeOverAssetCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanTakeOverEventCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorDiffersFromSubjectCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorMatchesSubjectCondition;
import com.raxim.myscoutee.domain.access.security.condition.DisqualifiedParticipationCondition;
import com.raxim.myscoutee.domain.access.security.condition.ExplicitAllowCondition;
import com.raxim.myscoutee.domain.access.security.condition.NoExplicitDenyCondition;
import com.raxim.myscoutee.domain.access.security.condition.PendingParticipationCondition;
import com.raxim.myscoutee.domain.access.security.condition.SubjectIsNotProtectedMemberCondition;

public final class AccessPolicyTestSupport {
    private AccessPolicyTestSupport() {
    }

    public static AccessPolicyConditionRegistry conditionRegistry() {
        return new AccessPolicyConditionRegistry(List.of(
                new ActorMatchesSubjectCondition(),
                new ActorDiffersFromSubjectCondition(),
                new NoExplicitDenyCondition(),
                new ExplicitAllowCondition(),
                new AcceptedParticipationCondition(),
                new PendingParticipationCondition(),
                new DisqualifiedParticipationCondition(),
                new ActorCanManageEventCondition(),
                new ActorCanTakeOverEventCondition(),
                new ActorCanManageMembersCondition(),
                new ActorCanAccessChatCondition(),
                new ActorCanManageSupportChatCondition(),
                new ActorCanManageAssetCondition(),
                new ActorCanTakeOverAssetCondition(),
                new ActorCanReadMediaCondition(org.mockito.Mockito.mock(MediaPolicyFacts.class)),
                new SubjectIsNotProtectedMemberCondition()));
    }
}
