package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.algo.gen.EventGeneratorByScore;
import com.raxim.myscoutee.algo.gen.GeneratorModels;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.EventLeaderboardEntry;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardEntryUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardFifaMatchDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardFifaStandingRowDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardGroupDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardMemberDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardScoreEntryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardScoreStandingRowDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.EventLeaderboardEntriesRepository;

@Service
public class ActivitiesEventLeaderboardService {
    private final ActivityEventsRepository activityEventsRepository;
    private final EventLeaderboardEntriesRepository eventLeaderboardEntriesRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final EventGeneratorByScore scoreGenerator = new EventGeneratorByScore();

    public ActivitiesEventLeaderboardService(
            ActivityEventsRepository activityEventsRepository,
            EventLeaderboardEntriesRepository eventLeaderboardEntriesRepository,
            ActivitiesMembersService activitiesMembersService) {
        this.activityEventsRepository = activityEventsRepository;
        this.eventLeaderboardEntriesRepository = eventLeaderboardEntriesRepository;
        this.activitiesMembersService = activitiesMembersService;
    }

    public EventLeaderboardStateDto queryState(String eventId, String subEventId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId)) {
            return new EventLeaderboardStateDto(normalizedEventId, normalizedSubEventId, "", "Score", List.of());
        }

        ActivityEvent event = resolveCanonicalEvent(normalizedEventId);
        SubEventFormItemDto subEvent = resolveSubEvent(event, normalizedSubEventId);
        if (event == null || subEvent == null) {
            return new EventLeaderboardStateDto(normalizedEventId, normalizedSubEventId, "", "Score", List.of());
        }

        List<EventLeaderboardEntry> entries = eventLeaderboardEntriesRepository.findByEventIdAndSubEventId(normalizedEventId, normalizedSubEventId).stream()
                .filter(Objects::nonNull)
                .toList();
        String leaderboardType = normalizeLeaderboardType(subEvent.tournamentLeaderboardType());

        List<SubEventGroupItemDto> resolvedGroups = resolveGroups(subEvent);
        List<GeneratorModels.ScoreGeneratorGroup> generatorGroups = resolvedGroups.stream()
                .map(group -> toGeneratorGroup(normalizedEventId, normalizedSubEventId, leaderboardType, subEvent, group, entries))
                .toList();
        Map<String, GeneratorModels.ScoreGeneratorResult> resultsByGroupId = scoreGenerator.generate(generatorGroups).stream()
                .collect(LinkedHashMap::new, (map, item) -> map.put(item.groupId(), item), Map::putAll);

        List<EventLeaderboardGroupDto> groups = resolvedGroups.stream()
                .map(group -> toGroupDto(normalizedEventId, normalizedSubEventId, leaderboardType, subEvent, group, entries, resultsByGroupId.get(normalizeId(group.id()))))
                .toList();

        return new EventLeaderboardStateDto(
                normalizedEventId,
                normalizedSubEventId,
                safeText(subEvent.name()),
                leaderboardType,
                groups);
    }

    public EventLeaderboardStateDto upsertEntry(EventLeaderboardEntryUpsertRequestDto request) {
        if (request == null) {
            return new EventLeaderboardStateDto("", "", "", "Score", List.of());
        }

        String normalizedEventId = normalizeId(request.eventId());
        String normalizedSubEventId = normalizeId(request.subEventId());
        String normalizedGroupId = normalizeId(request.groupId());
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId) || !StringUtils.hasText(normalizedGroupId)) {
            return queryState(normalizedEventId, normalizedSubEventId);
        }

        String mode = normalizeLeaderboardType(request.mode());
        String nowIso = Instant.now().toString();
        String actorUserId = normalizeId(request.actorUserId());
        if ("Fifa".equalsIgnoreCase(mode)) {
            String pairKey = pairKey(request.homeMemberId(), request.awayMemberId());
            if (!StringUtils.hasText(pairKey)) {
                return queryState(normalizedEventId, normalizedSubEventId);
            }
            EventLeaderboardEntry record = eventLeaderboardEntriesRepository
                    .findByEventIdAndSubEventIdAndGroupIdAndEntryTypeAndPairKey(normalizedEventId, normalizedSubEventId, normalizedGroupId, "fifa", pairKey)
                    .orElseGet(EventLeaderboardEntry::new);
            record.setId(StringUtils.hasText(record.getId()) ? record.getId() : new ObjectId().toHexString());
            record.setSyncKey(StringUtils.hasText(record.getSyncKey()) ? record.getSyncKey() : UUID.randomUUID().toString());
            record.setEventId(normalizedEventId);
            record.setSubEventId(normalizedSubEventId);
            record.setGroupId(normalizedGroupId);
            record.setEntryType("fifa");
            record.setHomeMemberId(normalizeId(request.homeMemberId()));
            record.setAwayMemberId(normalizeId(request.awayMemberId()));
            record.setHomeScore(Math.max(0, request.homeScore() == null ? 0 : request.homeScore()));
            record.setAwayScore(Math.max(0, request.awayScore() == null ? 0 : request.awayScore()));
            record.setPairKey(pairKey);
            record.setNote(safeText(request.note()));
            record.setCreatedAtIso(nowIso);
            record.setCreatedUser(actorUserId);
            record.setUpdatedDate(nowIso);
            record.setUpdatedUser(actorUserId);
            eventLeaderboardEntriesRepository.save(record);
            return queryState(normalizedEventId, normalizedSubEventId);
        }

        String memberId = normalizeId(request.memberId());
        if (!StringUtils.hasText(memberId) || request.scoreValue() == null) {
            return queryState(normalizedEventId, normalizedSubEventId);
        }
        EventLeaderboardEntry record = new EventLeaderboardEntry();
        record.setId(new ObjectId().toHexString());
        record.setSyncKey(UUID.randomUUID().toString());
        record.setEventId(normalizedEventId);
        record.setSubEventId(normalizedSubEventId);
        record.setGroupId(normalizedGroupId);
        record.setEntryType("score");
        record.setMemberId(memberId);
        record.setScoreValue(request.scoreValue());
        record.setNote(safeText(request.note()));
        record.setCreatedAtIso(nowIso);
        record.setCreatedUser(actorUserId);
        record.setUpdatedDate(nowIso);
        record.setUpdatedUser(actorUserId);
        eventLeaderboardEntriesRepository.save(record);
        return queryState(normalizedEventId, normalizedSubEventId);
    }

    private EventLeaderboardGroupDto toGroupDto(
            String eventId,
            String subEventId,
            String leaderboardType,
            SubEventFormItemDto subEvent,
            SubEventGroupItemDto group,
            List<EventLeaderboardEntry> entries,
            GeneratorModels.ScoreGeneratorResult result) {
        String groupId = normalizeId(group.id());
        List<EventLeaderboardMemberDto> members = resolveMembers(groupId);
        Map<String, String> memberNameById = members.stream()
                .collect(LinkedHashMap::new, (map, member) -> map.put(member.memberId(), member.memberName()), Map::putAll);

        List<EventLeaderboardScoreEntryDto> scoreEntries = entries.stream()
                .filter(entry -> "score".equals(normalizeId(entry.getEntryType())))
                .filter(entry -> groupId.equals(normalizeId(entry.getGroupId())))
                .sorted(Comparator.comparingLong((EventLeaderboardEntry entry) -> toEpochMillis(entry.getCreatedAtIso())).reversed())
                .map(entry -> new EventLeaderboardScoreEntryDto(
                        normalizeId(entry.getId()),
                        normalizeId(entry.getMemberId()),
                        entry.getScoreValue() == null ? 0 : entry.getScoreValue(),
                        safeText(entry.getNote()),
                        toEpochMillis(entry.getCreatedAtIso())))
                .toList();

        List<EventLeaderboardFifaMatchDto> fifaMatches = entries.stream()
                .filter(entry -> "fifa".equals(normalizeId(entry.getEntryType())))
                .filter(entry -> groupId.equals(normalizeId(entry.getGroupId())))
                .sorted(Comparator.comparingLong((EventLeaderboardEntry entry) -> toEpochMillis(entry.getCreatedAtIso())).reversed())
                .map(entry -> new EventLeaderboardFifaMatchDto(
                        normalizeId(entry.getId()),
                        normalizeId(entry.getHomeMemberId()),
                        normalizeId(entry.getAwayMemberId()),
                        entry.getHomeScore() == null ? 0 : entry.getHomeScore(),
                        entry.getAwayScore() == null ? 0 : entry.getAwayScore(),
                        safeText(entry.getNote()),
                        toEpochMillis(entry.getCreatedAtIso())))
                .toList();

        List<EventLeaderboardScoreStandingRowDto> scoreRows = result == null
                ? List.of()
                : result.scoreRows().stream()
                        .map(row -> new EventLeaderboardScoreStandingRowDto(
                                row.memberId(),
                                memberNameById.getOrDefault(row.memberId(), row.memberName()),
                                row.total(),
                                row.updates()))
                        .toList();

        List<EventLeaderboardFifaStandingRowDto> fifaRows = result == null
                ? List.of()
                : result.fifaRows().stream()
                        .map(row -> new EventLeaderboardFifaStandingRowDto(
                                row.memberId(),
                                memberNameById.getOrDefault(row.memberId(), row.memberName()),
                                row.points(),
                                row.played(),
                                row.wins(),
                                row.draws(),
                                row.losses(),
                                row.goalsFor(),
                                row.goalsAgainst(),
                                row.goalDiff()))
                        .toList();

        return new EventLeaderboardGroupDto(
                groupId,
                safeText(group.name()),
                members.size(),
                Math.max(0, subEvent.tournamentAdvancePerGroup() == null ? 0 : subEvent.tournamentAdvancePerGroup()),
                result == null ? List.of() : result.advancingMemberIds(),
                members,
                scoreEntries,
                fifaMatches,
                scoreRows,
                fifaRows);
    }

    private GeneratorModels.ScoreGeneratorGroup toGeneratorGroup(
            String eventId,
            String subEventId,
            String leaderboardType,
            SubEventFormItemDto subEvent,
            SubEventGroupItemDto group,
            List<EventLeaderboardEntry> entries) {
        String groupId = normalizeId(group.id());
        List<GeneratorModels.LeaderboardMember> members = resolveMembers(groupId).stream()
                .map(member -> new GeneratorModels.LeaderboardMember(member.memberId(), member.memberName()))
                .toList();
        if (members.isEmpty()) {
            members = resolveMembersFromEntries(groupId, entries).stream()
                    .map(member -> new GeneratorModels.LeaderboardMember(member.memberId(), member.memberName()))
                    .toList();
        }
        List<GeneratorModels.ScoreLeaderboardEntry> scoreEntries = entries.stream()
                .filter(entry -> groupId.equals(normalizeId(entry.getGroupId())))
                .filter(entry -> "score".equals(normalizeId(entry.getEntryType())))
                .map(entry -> new GeneratorModels.ScoreLeaderboardEntry(
                        normalizeId(entry.getMemberId()),
                        entry.getScoreValue() == null ? 0 : entry.getScoreValue(),
                        toEpochMillis(entry.getCreatedAtIso())))
                .toList();
        List<GeneratorModels.FifaMatch> fifaMatches = entries.stream()
                .filter(entry -> groupId.equals(normalizeId(entry.getGroupId())))
                .filter(entry -> "fifa".equals(normalizeId(entry.getEntryType())))
                .map(entry -> new GeneratorModels.FifaMatch(
                        normalizeId(entry.getHomeMemberId()),
                        normalizeId(entry.getAwayMemberId()),
                        entry.getHomeScore() == null ? 0 : entry.getHomeScore(),
                        entry.getAwayScore() == null ? 0 : entry.getAwayScore(),
                        toEpochMillis(entry.getCreatedAtIso())))
                .toList();
        return new GeneratorModels.ScoreGeneratorGroup(
                groupId,
                leaderboardType,
                Math.max(0, subEvent.tournamentAdvancePerGroup() == null ? 0 : subEvent.tournamentAdvancePerGroup()),
                members,
                scoreEntries,
                fifaMatches);
    }

    private List<EventLeaderboardMemberDto> resolveMembers(String groupId) {
        List<ActivityMemberEntryDto> entries = activitiesMembersService.queryMembers("group", groupId);
        List<EventLeaderboardMemberDto> members = new ArrayList<>();
        for (ActivityMemberEntryDto entry : entries) {
            String memberId = normalizeId(entry.userId());
            if (!StringUtils.hasText(memberId)) {
                continue;
            }
            members.add(new EventLeaderboardMemberDto(memberId, safeText(entry.name())));
        }
        return members;
    }

    private List<EventLeaderboardMemberDto> resolveMembersFromEntries(String groupId, List<EventLeaderboardEntry> entries) {
        Map<String, EventLeaderboardMemberDto> membersById = new LinkedHashMap<>();
        for (EventLeaderboardEntry entry : entries) {
            if (!groupId.equals(normalizeId(entry.getGroupId()))) {
                continue;
            }
            if (StringUtils.hasText(normalizeId(entry.getMemberId()))) {
                membersById.put(normalizeId(entry.getMemberId()), new EventLeaderboardMemberDto(normalizeId(entry.getMemberId()), normalizeId(entry.getMemberId())));
            }
            if (StringUtils.hasText(normalizeId(entry.getHomeMemberId()))) {
                membersById.put(normalizeId(entry.getHomeMemberId()), new EventLeaderboardMemberDto(normalizeId(entry.getHomeMemberId()), normalizeId(entry.getHomeMemberId())));
            }
            if (StringUtils.hasText(normalizeId(entry.getAwayMemberId()))) {
                membersById.put(normalizeId(entry.getAwayMemberId()), new EventLeaderboardMemberDto(normalizeId(entry.getAwayMemberId()), normalizeId(entry.getAwayMemberId())));
            }
        }
        return new ArrayList<>(membersById.values());
    }

    private ActivityEvent resolveCanonicalEvent(String sourceId) {
        ActivityEvent preferred = null;
        for (ActivityEvent record : activityEventsRepository.findBySourceId(sourceId)) {
            if (record == null) {
                continue;
            }
            if (preferred == null) {
                preferred = record;
                continue;
            }
            if (Boolean.TRUE.equals(record.getIsHosting()) && !Boolean.TRUE.equals(preferred.getIsHosting())) {
                preferred = record;
                continue;
            }
            if (!Objects.equals(Boolean.TRUE.equals(record.getPublished()), Boolean.TRUE.equals(preferred.getPublished()))
                    && Boolean.TRUE.equals(record.getPublished())) {
                preferred = record;
                continue;
            }
            if ((record.getAcceptedMembers() == null ? 0 : record.getAcceptedMembers())
                    >= (preferred.getAcceptedMembers() == null ? 0 : preferred.getAcceptedMembers())) {
                preferred = record;
            }
        }
        return preferred;
    }

    private SubEventFormItemDto resolveSubEvent(ActivityEvent event, String subEventId) {
        if (event == null || event.getSubEvents() == null) {
            return null;
        }
        for (SubEventFormItemDto item : event.getSubEvents()) {
            if (item != null && subEventId.equals(normalizeId(item.id()))) {
                return item;
            }
        }
        return null;
    }

    private List<SubEventGroupItemDto> resolveGroups(SubEventFormItemDto subEvent) {
        if (subEvent == null) {
            return List.of();
        }
        if (subEvent.groups() != null && !subEvent.groups().isEmpty()) {
            return subEvent.groups().stream().filter(Objects::nonNull).toList();
        }
        int groupCount = Math.max(0, subEvent.tournamentGroupCount() == null ? 0 : subEvent.tournamentGroupCount());
        List<SubEventGroupItemDto> groups = new ArrayList<>();
        for (int index = 0; index < groupCount; index += 1) {
            char suffix = (char) ('A' + index);
            groups.add(new SubEventGroupItemDto(
                    subEvent.id() + ":group:" + (index + 1),
                    "Group " + suffix,
                    subEvent.tournamentGroupCapacityMin(),
                    subEvent.tournamentGroupCapacityMax(),
                    "generated"));
        }
        return groups;
    }

    private String normalizeLeaderboardType(String value) {
        return "Fifa".equalsIgnoreCase(normalizeId(value)) ? "Fifa" : "Score";
    }

    private String pairKey(String first, String second) {
        String left = normalizeId(first);
        String right = normalizeId(second);
        if (!StringUtils.hasText(left) || !StringUtils.hasText(right) || left.equals(right)) {
            return null;
        }
        return left.compareTo(right) <= 0 ? left + ":" + right : right + ":" + left;
    }

    private long toEpochMillis(String value) {
        try {
            return Instant.parse(safeText(value)).toEpochMilli();
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
