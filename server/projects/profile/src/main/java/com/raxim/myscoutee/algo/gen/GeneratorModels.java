package com.raxim.myscoutee.algo.gen;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Range;

public final class GeneratorModels {
    private GeneratorModels() {
    }

    public record RandomGeneratorRequest(
            FGraph graph,
            Range range,
            List<String> types,
            boolean hasAny) {
    }

    public record RandomGroupTarget(
            String targetId,
            Range range) {
    }

    public record RandomTargetedGeneratorRequest(
            FGraph graph,
            List<RandomGroupTarget> targets,
            List<String> types,
            boolean hasAny) {
    }

    public record GeneratedEventPlan(
            String seedId,
            List<String> memberUserIds) {
    }

    public record PriorityGeneratorRequest(
            String ownerId,
            FGraph graph,
            Set<String> candidateUserIds,
            Set<String> lockedUserIds,
            Range range,
            List<String> types,
            boolean hasAny,
            double minWeight) {
    }

    public record InviteBatchPlan(
            String ownerId,
            List<String> invitedUserIds) {
    }

    public record MingleGeneratorRequest(
            FGraph graph,
            Set<String> eligibleUserIds,
            int groupSize,
            int roundNumber,
            List<Integer> tableNumbers,
            List<MinglePreviousTable> previousTables,
            Map<String, String> userGenders,
            boolean requireGenderBalance) {
    }

    public record MinglePreviousTable(
            int roundNumber,
            int tableNumber,
            List<String> memberUserIds) {
    }

    public record MingleTablePlan(
            int tableNumber,
            List<String> memberUserIds) {
    }

    public record MingleRoundPlan(
            int roundNumber,
            List<MingleTablePlan> tables) {
    }

    public record LeaderboardMember(
            String memberId,
            String memberName) {
    }

    public record ScoreLeaderboardEntry(
            String memberId,
            int value,
            long createdAtMs) {
    }

    public record FifaMatch(
            String homeMemberId,
            String awayMemberId,
            int homeScore,
            int awayScore,
            long createdAtMs) {
    }

    public record ScoreGeneratorGroup(
            String groupId,
            String leaderboardType,
            int advanceCount,
            List<LeaderboardMember> members,
            List<ScoreLeaderboardEntry> scoreEntries,
            List<FifaMatch> fifaMatches) {
    }

    public record ScoreStandingRow(
            String memberId,
            String memberName,
            int total,
            int updates) {
    }

    public record FifaStandingRow(
            String memberId,
            String memberName,
            int points,
            int played,
            int wins,
            int draws,
            int losses,
            int goalsFor,
            int goalsAgainst,
            int goalDiff) {
    }

    public record ScoreGeneratorResult(
            String groupId,
            List<String> advancingMemberIds,
            List<ScoreStandingRow> scoreRows,
            List<FifaStandingRow> fifaRows) {
    }

    record ScoreStandingAccumulator(
            String memberId,
            String memberName,
            int total,
            int updates) {
    }

    record FifaStandingAccumulator(
            String memberId,
            String memberName,
            int points,
            int played,
            int wins,
            int draws,
            int losses,
            int goalsFor,
            int goalsAgainst) {

        FifaStandingAccumulator withPlayed(int delta) {
            return new FifaStandingAccumulator(memberId, memberName, points, played + delta, wins, draws, losses, goalsFor, goalsAgainst);
        }

        FifaStandingAccumulator withGoals(int goalsForDelta, int goalsAgainstDelta) {
            return new FifaStandingAccumulator(memberId, memberName, points, played, wins, draws, losses, goalsFor + goalsForDelta, goalsAgainst + goalsAgainstDelta);
        }

        FifaStandingAccumulator withWin() {
            return new FifaStandingAccumulator(memberId, memberName, points + 3, played, wins + 1, draws, losses, goalsFor, goalsAgainst);
        }

        FifaStandingAccumulator withDraw() {
            return new FifaStandingAccumulator(memberId, memberName, points + 1, played, wins, draws + 1, losses, goalsFor, goalsAgainst);
        }

        FifaStandingAccumulator withLoss() {
            return new FifaStandingAccumulator(memberId, memberName, points, played, wins, draws, losses + 1, goalsFor, goalsAgainst);
        }
    }
}
