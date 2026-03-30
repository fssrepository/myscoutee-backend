package com.raxim.myscoutee.algo.gen;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class EventGeneratorByScore extends GeneratorBase<List<GeneratorModels.ScoreGeneratorGroup>, List<GeneratorModels.ScoreGeneratorResult>> {

    @Override
    public List<GeneratorModels.ScoreGeneratorResult> generate(List<GeneratorModels.ScoreGeneratorGroup> input) {
        if (input == null || input.isEmpty()) {
            return List.of();
        }

        List<GeneratorModels.ScoreGeneratorResult> results = new ArrayList<>();
        for (GeneratorModels.ScoreGeneratorGroup group : input) {
            if (group == null) {
                continue;
            }
            List<GeneratorModels.ScoreStandingRow> scoreRows = buildScoreRows(group);
            List<GeneratorModels.FifaStandingRow> fifaRows = buildFifaRows(group);
            List<String> advancingMemberIds = resolveAdvancingMemberIds(group, scoreRows, fifaRows);
            results.add(new GeneratorModels.ScoreGeneratorResult(
                    group.groupId(),
                    advancingMemberIds,
                    scoreRows,
                    fifaRows));
        }
        return results;
    }

    private List<String> resolveAdvancingMemberIds(
            GeneratorModels.ScoreGeneratorGroup group,
            List<GeneratorModels.ScoreStandingRow> scoreRows,
            List<GeneratorModels.FifaStandingRow> fifaRows) {
        int advanceCount = Math.max(0, group == null ? 0 : group.advanceCount());
        String leaderboardType = group == null ? "" : group.leaderboardType();
        if (advanceCount == 0) {
            return List.of();
        }
        if ("Fifa".equalsIgnoreCase(leaderboardType)) {
            return fifaRows.stream()
                    .limit(advanceCount)
                    .map(GeneratorModels.FifaStandingRow::memberId)
                    .toList();
        }
        return scoreRows.stream()
                .limit(advanceCount)
                .map(GeneratorModels.ScoreStandingRow::memberId)
                .toList();
    }

    private List<GeneratorModels.ScoreStandingRow> buildScoreRows(GeneratorModels.ScoreGeneratorGroup group) {
        Map<String, GeneratorModels.ScoreStandingAccumulator> rowsByMemberId = new LinkedHashMap<>();
        for (GeneratorModels.LeaderboardMember member : safeMembers(group)) {
            rowsByMemberId.put(member.memberId(), new GeneratorModels.ScoreStandingAccumulator(
                    member.memberId(),
                    member.memberName(),
                    0,
                    0));
        }
        for (GeneratorModels.ScoreLeaderboardEntry entry : safeScoreEntries(group)) {
            GeneratorModels.ScoreStandingAccumulator current = rowsByMemberId.get(entry.memberId());
            if (current == null) {
                continue;
            }
            rowsByMemberId.put(entry.memberId(), new GeneratorModels.ScoreStandingAccumulator(
                    current.memberId(),
                    current.memberName(),
                    current.total() + entry.value(),
                    current.updates() + 1));
        }
        return rowsByMemberId.values().stream()
                .map(accumulator -> new GeneratorModels.ScoreStandingRow(
                        accumulator.memberId(),
                        accumulator.memberName(),
                        accumulator.total(),
                        accumulator.updates()))
                .sorted(Comparator
                        .comparingInt(GeneratorModels.ScoreStandingRow::total).reversed()
                        .thenComparing(GeneratorModels.ScoreStandingRow::memberName)
                        .thenComparing(GeneratorModels.ScoreStandingRow::memberId))
                .toList();
    }

    private List<GeneratorModels.FifaStandingRow> buildFifaRows(GeneratorModels.ScoreGeneratorGroup group) {
        Map<String, GeneratorModels.FifaStandingAccumulator> rowsByMemberId = new LinkedHashMap<>();
        for (GeneratorModels.LeaderboardMember member : safeMembers(group)) {
            rowsByMemberId.put(member.memberId(), new GeneratorModels.FifaStandingAccumulator(
                    member.memberId(),
                    member.memberName(),
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0));
        }

        for (GeneratorModels.FifaMatch match : safeMatches(group)) {
            GeneratorModels.FifaStandingAccumulator home = rowsByMemberId.get(match.homeMemberId());
            GeneratorModels.FifaStandingAccumulator away = rowsByMemberId.get(match.awayMemberId());
            if (home == null || away == null) {
                continue;
            }

            home = home.withPlayed(1).withGoals(match.homeScore(), match.awayScore());
            away = away.withPlayed(1).withGoals(match.awayScore(), match.homeScore());
            if (match.homeScore() > match.awayScore()) {
                home = home.withWin();
                away = away.withLoss();
            } else if (match.homeScore() < match.awayScore()) {
                away = away.withWin();
                home = home.withLoss();
            } else {
                home = home.withDraw();
                away = away.withDraw();
            }
            rowsByMemberId.put(home.memberId(), home);
            rowsByMemberId.put(away.memberId(), away);
        }

        return rowsByMemberId.values().stream()
                .map(accumulator -> new GeneratorModels.FifaStandingRow(
                        accumulator.memberId(),
                        accumulator.memberName(),
                        accumulator.points(),
                        accumulator.played(),
                        accumulator.wins(),
                        accumulator.draws(),
                        accumulator.losses(),
                        accumulator.goalsFor(),
                        accumulator.goalsAgainst(),
                        accumulator.goalsFor() - accumulator.goalsAgainst()))
                .sorted(Comparator
                        .comparingInt(GeneratorModels.FifaStandingRow::points).reversed()
                        .thenComparingInt(GeneratorModels.FifaStandingRow::goalDiff).reversed()
                        .thenComparingInt(GeneratorModels.FifaStandingRow::goalsFor).reversed()
                        .thenComparing(GeneratorModels.FifaStandingRow::memberName)
                        .thenComparing(GeneratorModels.FifaStandingRow::memberId))
                .toList();
    }

    private List<GeneratorModels.LeaderboardMember> safeMembers(GeneratorModels.ScoreGeneratorGroup group) {
        return group == null || group.members() == null ? List.of() : group.members();
    }

    private List<GeneratorModels.ScoreLeaderboardEntry> safeScoreEntries(GeneratorModels.ScoreGeneratorGroup group) {
        return group == null || group.scoreEntries() == null ? List.of() : group.scoreEntries();
    }

    private List<GeneratorModels.FifaMatch> safeMatches(GeneratorModels.ScoreGeneratorGroup group) {
        return group == null || group.fifaMatches() == null ? List.of() : group.fifaMatches();
    }
}
