package com.raxim.myscoutee.domain.events.algorithm.gen;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// FIX A: Implement EventGenerator directly
public class EventGeneratorByScore implements EventGenerator<List<GeneratorModels.ScoreGeneratorGroup>, List<GeneratorModels.ScoreGeneratorResult>> {

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
            
            List<GeneratorModels.ScoreStandingRow> scoreRows = List.of();
            List<GeneratorModels.FifaStandingRow> fifaRows = List.of();

            // FIX B: Only build the rows required by the leaderboard type to save CPU
            if ("Fifa".equalsIgnoreCase(group.leaderboardType())) {
                fifaRows = buildFifaRows(group);
            } else {
                scoreRows = buildScoreRows(group);
            }
            
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
                    .filter(row -> isAdvancementCandidate(group, row.memberId()))
                    .limit(advanceCount)
                    .map(GeneratorModels.FifaStandingRow::memberId)
                    .toList();
        }
        return scoreRows.stream()
                .filter(row -> isAdvancementCandidate(group, row.memberId()))
                .limit(advanceCount)
                .map(GeneratorModels.ScoreStandingRow::memberId)
                .toList();
    }

    private boolean isAdvancementCandidate(GeneratorModels.ScoreGeneratorGroup group, String memberId) {
        if (group == null || memberId == null || memberId.isBlank()) {
            return false;
        }
        String groupId = group.groupId() == null ? "" : group.groupId().trim();
        String placeholderPrefix = groupId + "-member-";
        if (!groupId.isEmpty() && memberId.startsWith(placeholderPrefix)) {
            String suffix = memberId.substring(placeholderPrefix.length());
            if (suffix.matches("\\d+")) {
                return false;
            }
        }
        return true;
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
            // FIX C: Clean up Map updates with computeIfPresent (no manual null-checking required)
            rowsByMemberId.computeIfPresent(entry.memberId(), (id, current) -> 
                    new GeneratorModels.ScoreStandingAccumulator(
                            current.memberId(),
                            current.memberName(),
                            current.total() + entry.value(),
                            current.updates() + 1)
            );
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
                        .thenComparing(Comparator.comparingInt(GeneratorModels.FifaStandingRow::goalDiff).reversed())
                        .thenComparing(Comparator.comparingInt(GeneratorModels.FifaStandingRow::goalsFor).reversed())
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
