package com.raxim.myscoutee.domain.events.service;

public final class TournamentGroupCountPolicy {
    private TournamentGroupCountPolicy() {
    }

    public static int countForIncoming(
            Integer groupCapacityMinValue,
            Integer groupCapacityMaxValue,
            Integer incomingCapacityMaxValue,
            Integer stageCapacityMaxValue) {
        int groupCapacityMin = nonNegative(groupCapacityMinValue);
        int groupCapacityMax = Math.max(groupCapacityMin, nonNegative(groupCapacityMaxValue));
        if (groupCapacityMin <= 0 && groupCapacityMax <= 0) {
            return 0;
        }

        int incomingCapacityMax = nonNegative(incomingCapacityMaxValue);
        int stageCapacityMax = nonNegative(stageCapacityMaxValue);
        int effectiveCapacityMax = incomingCapacityMax > 0 && stageCapacityMax > 0
                ? Math.min(incomingCapacityMax, stageCapacityMax)
                : Math.max(incomingCapacityMax, stageCapacityMax);
        if (effectiveCapacityMax <= 0) {
            return 0;
        }

        int divisor = Math.max(1, groupCapacityMax > 0 ? groupCapacityMax : groupCapacityMin);
        int groupsNeededForMaximum = (int) Math.ceil((double) effectiveCapacityMax / divisor);
        int groupsAllowedByMinimum = groupCapacityMin > 0
                ? Math.max(1, effectiveCapacityMax / groupCapacityMin)
                : groupsNeededForMaximum;
        return Math.min(groupsNeededForMaximum, groupsAllowedByMinimum);
    }

    private static int nonNegative(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }
}
