package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

@org.junit.jupiter.api.Tag("standard")
class TournamentGroupCountPolicyTest {
    @Test
    void stageCapacityCapsTheParentIncomingCapacity() {
        assertThat(TournamentGroupCountPolicy.countForIncoming(1, 2, 8, 4)).isEqualTo(2);
    }

    @Test
    void downstreamStageCapsTheAdvancingCapacity() {
        assertThat(TournamentGroupCountPolicy.countForIncoming(1, 2, 2, 2)).isEqualTo(1);
    }

    @Test
    void incomingCapacityIsUsedWhenTheStageHasNoExplicitMaximum() {
        assertThat(TournamentGroupCountPolicy.countForIncoming(1, 2, 8, null)).isEqualTo(4);
    }

    @Test
    void stageCapacityIsUsedWhenTheParentCapacityIsUnavailable() {
        assertThat(TournamentGroupCountPolicy.countForIncoming(1, 2, null, 4)).isEqualTo(2);
    }

    @Test
    void missingGroupCapacityProducesNoAutomaticGroups() {
        assertThat(TournamentGroupCountPolicy.countForIncoming(null, null, 8, 4)).isZero();
    }
}
