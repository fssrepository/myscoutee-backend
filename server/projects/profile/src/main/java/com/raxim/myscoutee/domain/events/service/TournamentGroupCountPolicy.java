package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
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
        if (groupCapacityMax <= 0) {
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

        int groupsNeededForMaximum = (effectiveCapacityMax - 1) / groupCapacityMax + 1;
        int groupsAllowedByMinimum = groupCapacityMin > 0
                ? Math.max(1, effectiveCapacityMax / groupCapacityMin)
                : groupsNeededForMaximum;
        return groupsAllowedByMinimum < groupsNeededForMaximum
                ? groupsAllowedByMinimum : groupsNeededForMaximum;
    }

    private static int nonNegative(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    public static int countForStage(ActivityEvent event, SubEventItem targetStage, List<SubEventItem> stages) {
        if (targetStage == null) {
            return 0;
        }
        if (stages.isEmpty()) {
            stages = List.of(targetStage);
        }
        int incomingCapacityMax = safeCount(event == null ? null : event.getCapacityMax());
        for (SubEventItem stage : stages == null ? List.<SubEventItem>of() : stages) {
            if (stage == null) {
                continue;
            }
            int groupCount = autoTournamentGroupCountForIncoming(stage, incomingCapacityMax);
            if (sameStage(stage, targetStage)) {
                return groupCount;
            }
            if (hasTournamentStageConfig(stage) && groupCount > 0) {
                int advancePerGroup = safeCount(stage.tournamentAdvancePerGroup());
                incomingCapacityMax = advancePerGroup > 0 ? groupCount * advancePerGroup : 0;
            }
        }
        return autoTournamentGroupCountForIncoming(targetStage, incomingCapacityMax);
    }
    private static int autoTournamentGroupCountForIncoming(SubEventItem item, int incomingCapacityMax) {
        if (item == null) {
            return 0;
        }
        return TournamentGroupCountPolicy.countForIncoming(
                item.tournamentGroupCapacityMin(),
                item.tournamentGroupCapacityMax(),
                incomingCapacityMax,
                item.capacityMax());
    }
    private static boolean hasTournamentStageConfig(SubEventItem item) {
        return item != null
                && !Boolean.TRUE.equals(item.optional())
                && (safeCount(item.tournamentGroupCapacityMin()) > 0
                        || safeCount(item.tournamentGroupCapacityMax()) > 0
                        || "Score".equalsIgnoreCase(safeText(item.tournamentLeaderboardType()))
                        || "Fifa".equalsIgnoreCase(safeText(item.tournamentLeaderboardType())));
    }
    private static boolean sameStage(SubEventItem left, SubEventItem right) {
        if (left == null || right == null) {
            return false;
        }
        String leftId = normalizeId(left.id());
        String rightId = normalizeId(right.id());
        return StringUtils.hasText(leftId) && leftId.equals(rightId);
    }
    private static int safeCount(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }
    private static String safeText(String value) { return value == null ? "" : value.trim(); }
    private static String normalizeId(String value) { String text = safeText(value); return StringUtils.hasText(text) ? text : null; }
}
