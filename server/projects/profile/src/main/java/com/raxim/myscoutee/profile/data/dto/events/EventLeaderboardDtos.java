package com.raxim.myscoutee.profile.data.dto.events;

import java.util.List;

public final class EventLeaderboardDtos {
    private EventLeaderboardDtos() {
    }

    public record EventLeaderboardEntryUpsertRequestDto(
            String actorUserId,
            String eventId,
            String subEventId,
            String groupId,
            String mode,
            String memberId,
            Integer scoreValue,
            String note,
            String homeMemberId,
            String awayMemberId,
            Integer homeScore,
            Integer awayScore) {
    }

    public record EventLeaderboardMemberDto(
            String memberId,
            String memberName) {
    }

    public record EventLeaderboardScoreEntryDto(
            String id,
            String memberId,
            Integer value,
            String note,
            Long createdAtMs) {
    }

    public record EventLeaderboardFifaMatchDto(
            String id,
            String homeMemberId,
            String awayMemberId,
            Integer homeScore,
            Integer awayScore,
            String note,
            Long createdAtMs) {
    }

    public record EventLeaderboardScoreStandingRowDto(
            String memberId,
            String memberName,
            Integer total,
            Integer updates) {
    }

    public record EventLeaderboardFifaStandingRowDto(
            String memberId,
            String memberName,
            Integer points,
            Integer played,
            Integer wins,
            Integer draws,
            Integer losses,
            Integer goalsFor,
            Integer goalsAgainst,
            Integer goalDiff) {
    }

    public record EventLeaderboardGroupDto(
            String groupId,
            String title,
            Integer memberCount,
            Integer advancePerGroup,
            List<String> advancingMemberIds,
            List<EventLeaderboardMemberDto> members,
            List<EventLeaderboardScoreEntryDto> scoreEntries,
            List<EventLeaderboardFifaMatchDto> fifaMatches,
            List<EventLeaderboardScoreStandingRowDto> scoreRows,
            List<EventLeaderboardFifaStandingRowDto> fifaRows) {
    }

    public record EventLeaderboardStateDto(
            String eventId,
            String subEventId,
            String title,
            String leaderboardType,
            List<EventLeaderboardGroupDto> groups) {
    }
}
