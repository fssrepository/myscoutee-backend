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

    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.CsvSource({
            "0,0,8,8,0", "-1,-2,8,8,0", "6,7,8,8,1", "5,7,12,12,2",
            "1,3,10,10,4", "0,3,10,10,4", "1,1,2147483647,2147483647,2147483647",
            "3,1,9,9,3", "1,2,0,0,0", "2,4,-1,12,3"})
    void groupCountStaysBoundedWithoutZeroDivisionOrIntegerOverflow(
            int minimum, int maximum, int incoming, int stage, int expected) {
        assertThat(TournamentGroupCountPolicy.countForIncoming(minimum, maximum, incoming, stage))
                .isEqualTo(expected);
    }

}
