package com.raxim.myscoutee.profile.security;

import java.util.List;

import com.raxim.myscoutee.profile.security.condition.AcceptedParticipationCondition;
import com.raxim.myscoutee.profile.security.condition.ActorCanAccessChatCondition;
import com.raxim.myscoutee.profile.security.condition.ActorCanManageAssetCondition;
import com.raxim.myscoutee.profile.security.condition.ActorCanManageEventCondition;
import com.raxim.myscoutee.profile.security.condition.ActorCanManageMembersCondition;
import com.raxim.myscoutee.profile.security.condition.ActorCanManageSupportChatCondition;
import com.raxim.myscoutee.profile.security.condition.ActorCanRefreshAssetSourceCondition;
import com.raxim.myscoutee.profile.security.condition.ActorCanTakeOverAssetCondition;
import com.raxim.myscoutee.profile.security.condition.ActorCanTakeOverEventCondition;
import com.raxim.myscoutee.profile.security.condition.ActorDiffersFromSubjectCondition;
import com.raxim.myscoutee.profile.security.condition.ActorMatchesSubjectCondition;
import com.raxim.myscoutee.profile.security.condition.DisqualifiedParticipationCondition;
import com.raxim.myscoutee.profile.security.condition.ExplicitAllowCondition;
import com.raxim.myscoutee.profile.security.condition.NoExplicitDenyCondition;
import com.raxim.myscoutee.profile.security.condition.PendingParticipationCondition;
import com.raxim.myscoutee.profile.security.condition.SubjectIsNotProtectedMemberCondition;

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
                new ActorCanRefreshAssetSourceCondition(),
                new ActorCanTakeOverAssetCondition(),
                new SubjectIsNotProtectedMemberCondition()));
    }
}
