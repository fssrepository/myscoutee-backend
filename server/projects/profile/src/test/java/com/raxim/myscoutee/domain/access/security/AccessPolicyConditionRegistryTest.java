package com.raxim.myscoutee.domain.access.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.access.security.condition.ActorCanManageMembersCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorCanTakeOverEventCondition;
import com.raxim.myscoutee.domain.access.security.condition.ActorMatchesSubjectCondition;
import com.raxim.myscoutee.domain.access.security.condition.PendingParticipationCondition;

@org.junit.jupiter.api.Tag("standard")
class AccessPolicyConditionRegistryTest {
    @Test
    void resolvesConditionsByTrimmedCaseInsensitiveName() {
        AccessPolicyConditionRegistry registry = AccessPolicyTestSupport.conditionRegistry();

        assertThat(registry.named(" actorMatchesSubject ")).isInstanceOf(ActorMatchesSubjectCondition.class);
        assertThat(registry.named("ACTORCANMANAGEMEMBERS")).isInstanceOf(ActorCanManageMembersCondition.class);
        assertThat(registry.named("actorCanTakeOverEvent")).isInstanceOf(ActorCanTakeOverEventCondition.class);
        assertThat(registry.named("pendingParticipation")).isInstanceOf(PendingParticipationCondition.class);
    }

    @Test
    void rejectsDuplicateConditionNamesAtStartup() {
        AccessPolicyCondition first = new ActorMatchesSubjectCondition();
        AccessPolicyCondition second = new ActorMatchesSubjectCondition();

        assertThatThrownBy(() -> new AccessPolicyConditionRegistry(List.of(first, second)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Duplicate access policy condition");
    }
}
