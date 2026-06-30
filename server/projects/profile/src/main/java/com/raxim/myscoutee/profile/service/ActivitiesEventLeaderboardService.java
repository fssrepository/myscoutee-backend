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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.algo.gen.EventGeneratorByScore;
import com.raxim.myscoutee.algo.gen.GeneratorModels;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventGroup;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.EventLeaderboardEntry;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardEntryUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardFifaMatchDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardFifaStandingRowDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardGroupDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardMemberDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardScoreEntryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardScoreStandingRowDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardStateDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentGroupsStateDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventTournamentStageDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventGroupsRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.EventLeaderboardEntriesRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@Service
public class ActivitiesEventLeaderboardService {
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_DELETED = "D";

    private final ActivityEventsRepository activityEventsRepository;
    private final ActivitySubEventGroupsRepository activitySubEventGroupsRepository;
    private final ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    private final EventLeaderboardEntriesRepository eventLeaderboardEntriesRepository;
    private final ActivitiesMembersService activitiesMembersService;
    private final AccessControlService accessControlService;
    private final EventGeneratorByScore scoreGenerator = new EventGeneratorByScore();

    public ActivitiesEventLeaderboardService(
            ActivityEventsRepository activityEventsRepository,
            ActivitySubEventGroupsRepository activitySubEventGroupsRepository,
            ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository,
            EventLeaderboardEntriesRepository eventLeaderboardEntriesRepository,
            ActivitiesMembersService activitiesMembersService,
            AccessControlService accessControlService) {
        this.activityEventsRepository = activityEventsRepository;
        this.activitySubEventGroupsRepository = activitySubEventGroupsRepository;
        this.activitySubEventStageRuntimeRepository = activitySubEventStageRuntimeRepository;
        this.eventLeaderboardEntriesRepository = eventLeaderboardEntriesRepository;
        this.activitiesMembersService = activitiesMembersService;
        this.accessControlService = accessControlService;
    }

    public EventLeaderboardStateDto queryState(String eventId, String subEventId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId)) {
            return new EventLeaderboardStateDto(normalizedEventId, normalizedSubEventId, "", "Score", List.of());
        }

        ActivityEvent event = resolveCanonicalEvent(normalizedEventId);
        SubEventItem subEvent = resolveSubEvent(event, normalizedSubEventId);
        if (event == null || subEvent == null) {
            return new EventLeaderboardStateDto(normalizedEventId, normalizedSubEventId, "", "Score", List.of());
        }

        List<EventLeaderboardEntry> entries = eventLeaderboardEntriesRepository.findByEventIdAndSubEventId(normalizedEventId, normalizedSubEventId).stream()
                .filter(Objects::nonNull)
                .toList();
        String leaderboardType = normalizeLeaderboardType(subEvent.tournamentLeaderboardType());

        List<SubEventGroupItemDto> resolvedGroups = resolveGroups(normalizedEventId, event, subEvent);
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
        if (!accessControlService.canCurrentActorSubmitLeaderboardEntry(actorUserId, normalizedEventId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to submit leaderboard entry for this event.");
        }
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

    public EventTournamentGroupsStateDto queryTournamentGroups(String userId, String eventId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return new EventTournamentGroupsStateDto("", "", "", false, List.of());
        }
        ActivityEvent event = resolveCanonicalEvent(normalizedEventId);
        if (event == null) {
            return new EventTournamentGroupsStateDto(normalizedEventId, "", "", false, List.of());
        }
        return tournamentGroupsState(normalizedEventId, event, userId);
    }

    public List<EventTournamentGroupDto> queryTournamentStageGroups(String eventId, String slotId, String stageId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSlotId = normalizeId(slotId);
        String normalizedStageId = normalizeId(stageId);
        String ownerSourceId = StringUtils.hasText(normalizedSlotId) ? normalizedSlotId : normalizedEventId;
        if (!StringUtils.hasText(ownerSourceId) || !StringUtils.hasText(normalizedStageId)) {
            return List.of();
        }
        ActivityEvent event = resolveCanonicalEvent(ownerSourceId);
        SubEventItem subEvent = resolveSubEvent(event, normalizedStageId);
        if (subEvent == null && StringUtils.hasText(normalizedSlotId)) {
            event = resolveCanonicalEvent(normalizedEventId);
            subEvent = resolveSubEvent(event, normalizedStageId);
        }
        return tournamentGroups(ownerSourceId, event, subEvent);
    }

    public EventTournamentGroupsStateDto saveTournamentGroup(EventTournamentGroupUpsertRequestDto request) {
        if (request == null) {
            return new EventTournamentGroupsStateDto("", "", "", false, List.of());
        }
        String normalizedEventId = normalizeId(request.eventId());
        String normalizedSlotId = normalizeId(request.slotId());
        String ownerSourceId = StringUtils.hasText(normalizedSlotId) ? normalizedSlotId : normalizedEventId;
        String normalizedSubEventId = normalizeId(request.subEventId());
        String actorUserId = effectiveActorUserId(request.actorUserId());
        String groupName = safeText(request.name());
        if (!StringUtils.hasText(ownerSourceId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(actorUserId)
                || !StringUtils.hasText(groupName)) {
            return queryTournamentGroups(actorUserId, ownerSourceId);
        }

        List<ActivityEvent> documents = loadEventDocuments(ownerSourceId);
        List<ActivityEvent> permissionDocuments = StringUtils.hasText(normalizedEventId)
                ? loadEventDocuments(normalizedEventId)
                : documents;
        ActivityEvent canonical = resolvePreferredEvent(permissionDocuments.isEmpty() ? documents : permissionDocuments);
        if (!canManageTournamentGroups(actorUserId, canonical)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to manage tournament groups for this event.");
        }

        String groupId = normalizeId(request.groupId());
        int capacityMin = Math.max(0, request.capacityMin() == null ? 0 : request.capacityMin());
        int capacityMax = Math.max(capacityMin, request.capacityMax() == null ? capacityMin : request.capacityMax());
        String nowIso = Instant.now().toString();
        ActivityEvent ownerEvent = resolvePreferredEvent(documents);
        ActivityEvent definitionEvent = ownerEvent == null ? canonical : ownerEvent;
        SubEventItem stage = resolveSubEvent(definitionEvent, normalizedSubEventId);
        ActivitySubEventStageRuntime runtimeRecord = upsertStageRuntimeGroupsCount(
                ownerSourceId,
                normalizedSubEventId,
                definitionEvent,
                stage,
                actorUserId);
        String groupOwnerId = normalizeId(runtimeRecord == null ? null : runtimeRecord.getId());
        List<ActivitySubEventGroup> existingGroups = manualGroupRecords(groupOwnerId);
        String nextGroupId = StringUtils.hasText(groupId)
                ? groupId
                : nextManualGroupId(groupOwnerId, existingGroups);
        ActivitySubEventGroup group = activitySubEventGroupsRepository
                .findByOwnerIdAndGroupId(groupOwnerId, nextGroupId)
                .orElseGet(ActivitySubEventGroup::new);
        group.setId(StringUtils.hasText(group.getId()) ? group.getId() : new ObjectId().toHexString());
        group.setSyncKey(StringUtils.hasText(group.getSyncKey()) ? group.getSyncKey() : UUID.randomUUID().toString());
        group.setRecordId(manualGroupRecordId(groupOwnerId, nextGroupId));
        group.setStatus(STATUS_ACTIVE);
        group.setOwnerId(groupOwnerId);
        group.setGroupId(nextGroupId);
        group.setName(groupName);
        group.setCapacityMin(capacityMin);
        group.setCapacityMax(capacityMax);
        group.setCreatedDate(StringUtils.hasText(group.getCreatedDate()) ? group.getCreatedDate() : nowIso);
        group.setCreatedUser(StringUtils.hasText(group.getCreatedUser()) ? group.getCreatedUser() : actorUserId);
        group.setUpdatedDate(nowIso);
        group.setUpdatedUser(actorUserId);
        activitySubEventGroupsRepository.save(group);
        upsertStageRuntimeGroupsCount(ownerSourceId, normalizedSubEventId, definitionEvent, stage, actorUserId);
        return tournamentGroupsState(ownerSourceId, definitionEvent, actorUserId);
    }

    public EventTournamentGroupsStateDto deleteTournamentGroup(EventTournamentGroupDeleteRequestDto request) {
        if (request == null) {
            return new EventTournamentGroupsStateDto("", "", "", false, List.of());
        }
        String normalizedEventId = normalizeId(request.eventId());
        String normalizedSlotId = normalizeId(request.slotId());
        String ownerSourceId = StringUtils.hasText(normalizedSlotId) ? normalizedSlotId : normalizedEventId;
        String normalizedSubEventId = normalizeId(request.subEventId());
        String normalizedGroupId = normalizeId(request.groupId());
        String actorUserId = effectiveActorUserId(request.actorUserId());
        if (!StringUtils.hasText(ownerSourceId)
                || !StringUtils.hasText(normalizedSubEventId)
                || !StringUtils.hasText(normalizedGroupId)
                || !StringUtils.hasText(actorUserId)) {
            return queryTournamentGroups(actorUserId, ownerSourceId);
        }

        List<ActivityEvent> documents = loadEventDocuments(ownerSourceId);
        List<ActivityEvent> permissionDocuments = StringUtils.hasText(normalizedEventId)
                ? loadEventDocuments(normalizedEventId)
                : documents;
        ActivityEvent canonical = resolvePreferredEvent(permissionDocuments.isEmpty() ? documents : permissionDocuments);
        if (!canManageTournamentGroups(actorUserId, canonical)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to manage tournament groups for this event.");
        }

        String nowIso = Instant.now().toString();
        ActivityEvent ownerEvent = resolvePreferredEvent(documents);
        ActivityEvent definitionEvent = ownerEvent == null ? canonical : ownerEvent;
        SubEventItem stage = resolveSubEvent(definitionEvent, normalizedSubEventId);
        ActivitySubEventStageRuntime runtimeRecord = upsertStageRuntimeGroupsCount(
                ownerSourceId,
                normalizedSubEventId,
                definitionEvent,
                stage,
                actorUserId);
        String groupOwnerId = normalizeId(runtimeRecord == null ? null : runtimeRecord.getId());
        activitySubEventGroupsRepository
                .findByOwnerIdAndGroupId(groupOwnerId, normalizedGroupId)
                .ifPresent(group -> {
                    group.setStatus(STATUS_DELETED);
                    group.setUpdatedDate(nowIso);
                    group.setUpdatedUser(actorUserId);
                    activitySubEventGroupsRepository.save(group);
                });
        upsertStageRuntimeGroupsCount(ownerSourceId, normalizedSubEventId, definitionEvent, stage, actorUserId);
        return tournamentGroupsState(ownerSourceId, definitionEvent, actorUserId);
    }

    public List<SubEventGroupItemDto> materializeGeneratedGroups(String eventId, String subEventId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId)) {
            return List.of();
        }

        List<ActivityEvent> documents = activityEventsRepository.findBySourceId(normalizedEventId).stream()
                .filter(Objects::nonNull)
                .toList();
        return materializeGeneratedGroups(normalizedEventId, normalizedSubEventId, documents);
    }

    public List<SubEventGroupItemDto> materializeGeneratedGroups(
            String eventId,
            String subEventId,
            List<ActivityEvent> sourceDocuments) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId)) {
            return List.of();
        }
        List<ActivityEvent> documents = sourceDocuments == null
                ? List.of()
                : sourceDocuments.stream()
                        .filter(Objects::nonNull)
                        .filter(document -> normalizedEventId.equals(normalizeId(document.getSourceId())))
                        .toList();
        if (documents.isEmpty()) {
            return List.of();
        }

        ActivityEvent canonical = resolvePreferredEvent(documents);
        SubEventItem subEvent = resolveSubEvent(canonical, normalizedSubEventId);
        if (subEvent == null) {
            return List.of();
        }

        List<SubEventGroupItemDto> groups = resolveGeneratedGroups(canonical, subEvent);
        if (groups.isEmpty()) {
            return List.of();
        }
        if (subEvent.groups() != null && !subEvent.groups().isEmpty()) {
            return groups;
        }

        String nowIso = Instant.now().toString();
        List<ActivityEvent> updatedDocuments = new ArrayList<>();
        for (ActivityEvent document : documents) {
            List<SubEventItem> updatedSubEvents = replaceSubEventGroups(document.getSubEvents(), normalizedSubEventId, groups);
            if (updatedSubEvents.equals(document.getSubEvents())) {
                continue;
            }
            document.setSubEvents(updatedSubEvents);
            document.setUpdatedDate(nowIso);
            document.setUpdatedUser(StringUtils.hasText(normalizeId(document.getUpdatedUser()))
                    ? normalizeId(document.getUpdatedUser())
                    : StringUtils.hasText(normalizeId(document.getCreatorUserId()))
                            ? normalizeId(document.getCreatorUserId())
                            : "scheduler");
            updatedDocuments.add(document);
        }

        if (!updatedDocuments.isEmpty()) {
            activityEventsRepository.saveAll(updatedDocuments);
        }
        return groups;
    }

    private EventTournamentGroupsStateDto tournamentGroupsState(String ownerId, ActivityEvent event, String userId) {
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerId) || event == null) {
            return new EventTournamentGroupsStateDto(normalizedOwnerId, "", "", false, List.of());
        }
        return new EventTournamentGroupsStateDto(
                normalizedOwnerId,
                safeText(event.getTitle()),
                safeText(event.getSubtitle()),
                canManageTournamentGroups(userId, event),
                tournamentStages(normalizedOwnerId, event));
    }

    private List<EventTournamentStageDto> tournamentStages(String ownerId, ActivityEvent event) {
        List<SubEventItem> subEvents = event == null || event.getSubEvents() == null
                ? List.of()
                : event.getSubEvents();
        List<EventTournamentStageDto> stages = new ArrayList<>();
        for (int index = 0; index < subEvents.size(); index += 1) {
            SubEventItem subEvent = subEvents.get(index);
            if (subEvent == null || !isTournamentStage(subEvent)) {
                continue;
            }
            stages.add(new EventTournamentStageDto(
                    normalizeId(subEvent.id()),
                    safeText(subEvent.name()),
                    safeText(subEvent.description()),
                    safeText(subEvent.location()),
                    safeText(subEvent.startAt()),
                    safeText(subEvent.endAt()),
                    index + 1,
                    safeText(subEvent.stageStatus()),
                    normalizeLeaderboardType(subEvent.tournamentLeaderboardType()),
                    Math.max(0, subEvent.tournamentAdvancePerGroup() == null ? 0 : subEvent.tournamentAdvancePerGroup()),
                    tournamentGroups(ownerId, event, subEvent)));
        }
        return stages;
    }

    private List<EventTournamentGroupDto> tournamentGroups(String ownerId, ActivityEvent event, SubEventItem subEvent) {
        List<SubEventGroupItemDto> groups = resolveGroups(ownerId, event, subEvent);
        List<EventTournamentGroupDto> result = new ArrayList<>();
        for (int index = 0; index < groups.size(); index += 1) {
            SubEventGroupItemDto group = groups.get(index);
            if (group == null) {
                continue;
            }
            String groupId = normalizeId(group.id());
            if (!StringUtils.hasText(groupId)) {
                groupId = normalizeId(subEvent.id()) + ":group:" + (index + 1);
            }
            int capacityMin = Math.max(0, group.capacityMin() == null ? 0 : group.capacityMin());
            int capacityMax = Math.max(capacityMin, group.capacityMax() == null ? capacityMin : group.capacityMax());
            result.add(new EventTournamentGroupDto(
                    groupId,
                    safeText(group.name()),
                    safeText(group.source()).isBlank() ? "manual" : safeText(group.source()),
                    capacityMin,
                    capacityMax,
                    resolveMembers(groupId).size(),
                    0));
        }
        return result;
    }

    private boolean isTournamentStage(SubEventItem subEvent) {
        return subEvent != null
                && !Boolean.TRUE.equals(subEvent.optional())
                && (autoTournamentGroupCount(subEvent) > 0
                        || "Score".equalsIgnoreCase(safeText(subEvent.tournamentLeaderboardType()))
                        || "Fifa".equalsIgnoreCase(safeText(subEvent.tournamentLeaderboardType())));
    }

    private List<SubEventItem> upsertTournamentGroup(
            List<SubEventItem> subEvents,
            String subEventId,
            String groupId,
            String name,
            int capacityMin,
            int capacityMax) {
        if (subEvents == null || subEvents.isEmpty()) {
            return List.of();
        }
        List<SubEventItem> updated = new ArrayList<>();
        for (SubEventItem subEvent : subEvents) {
            if (subEvent == null) {
                continue;
            }
            if (!subEventId.equals(normalizeId(subEvent.id()))) {
                updated.add(subEvent);
                continue;
            }
            List<SubEventGroupItemDto> groups = new ArrayList<>(resolveGeneratedGroups(null, subEvent));
            int targetIndex = -1;
            for (int index = 0; index < groups.size(); index += 1) {
                if (normalizeId(groupId).equals(normalizeId(groups.get(index).id()))) {
                    targetIndex = index;
                    break;
                }
            }
            String nextGroupId = StringUtils.hasText(groupId) ? groupId : nextTournamentGroupId(subEventId, groups);
            SubEventGroupItemDto nextGroup = new SubEventGroupItemDto(
                    nextGroupId,
                    name,
                    capacityMin,
                    capacityMax,
                    "manual");
            if (targetIndex >= 0) {
                groups.set(targetIndex, nextGroup);
            } else {
                groups.add(nextGroup);
            }
            updated.add(copySubEventWithGroups(subEvent, groups, null));
        }
        return updated;
    }

    private List<SubEventItem> deleteTournamentGroup(
            List<SubEventItem> subEvents,
            String subEventId,
            String groupId) {
        if (subEvents == null || subEvents.isEmpty()) {
            return List.of();
        }
        List<SubEventItem> updated = new ArrayList<>();
        for (SubEventItem subEvent : subEvents) {
            if (subEvent == null) {
                continue;
            }
            if (!subEventId.equals(normalizeId(subEvent.id()))) {
                updated.add(subEvent);
                continue;
            }
            List<SubEventGroupItemDto> groups = resolveGeneratedGroups(null, subEvent).stream()
                    .filter(group -> group != null && !groupId.equals(normalizeId(group.id())))
                    .toList();
            updated.add(copySubEventWithGroups(subEvent, groups, groups.isEmpty() ? 0 : null));
        }
        return updated;
    }

    private String nextTournamentGroupId(String subEventId, List<SubEventGroupItemDto> groups) {
        String prefix = normalizeId(subEventId) + ":group:";
        int index = Math.max(1, groups == null ? 1 : groups.size() + 1);
        while (containsGroupId(groups, prefix + index)) {
            index += 1;
        }
        return prefix + index;
    }

    private boolean containsGroupId(List<SubEventGroupItemDto> groups, String groupId) {
        if (groups == null) {
            return false;
        }
        for (SubEventGroupItemDto group : groups) {
            if (groupId.equals(normalizeId(group == null ? null : group.id()))) {
                return true;
            }
        }
        return false;
    }

    private EventLeaderboardGroupDto toGroupDto(
            String eventId,
            String subEventId,
            String leaderboardType,
            SubEventItem subEvent,
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
            SubEventItem subEvent,
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

    private List<ActivityEvent> loadEventDocuments(String sourceId) {
        String normalizedSourceId = normalizeId(sourceId);
        if (!StringUtils.hasText(normalizedSourceId)) {
            return List.of();
        }
        List<ActivityEvent> documents = activityEventsRepository.findBySourceId(normalizedSourceId).stream()
                .filter(Objects::nonNull)
                .toList();
        if (!documents.isEmpty()) {
            return documents;
        }
        return activityEventsRepository.findById(normalizedSourceId).stream()
                .filter(Objects::nonNull)
                .toList();
    }

    private ActivityEvent resolveCanonicalEvent(String sourceId) {
        return resolvePreferredEvent(loadEventDocuments(sourceId));
    }

    private SubEventItem resolveSubEvent(ActivityEvent event, String subEventId) {
        if (event == null || event.getSubEvents() == null) {
            return null;
        }
        for (SubEventItem item : event.getSubEvents()) {
            if (item != null && subEventId.equals(normalizeId(item.id()))) {
                return item;
            }
        }
        return null;
    }

    private List<SubEventGroupItemDto> resolveGroups(String ownerId, ActivityEvent event, SubEventItem subEvent) {
        List<SubEventGroupItemDto> groups = new ArrayList<>(resolveGeneratedGroups(event, subEvent));
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEvent == null ? null : subEvent.id());
        if (StringUtils.hasText(normalizedOwnerId) && StringUtils.hasText(normalizedSubEventId)) {
            activitySubEventStageRuntimeRepository
                    .findByOwnerIdAndSubEventId(normalizedOwnerId, normalizedSubEventId)
                    .map(ActivitySubEventStageRuntime::getId)
                    .map(this::manualGroupRecords)
                    .ifPresent(records -> groups.addAll(records.stream()
                            .map(this::toManualSubEventGroup)
                            .filter(Objects::nonNull)
                            .toList()));
        }
        return groups;
    }

    private List<SubEventGroupItemDto> resolveGeneratedGroups(ActivityEvent event, SubEventItem subEvent) {
        if (subEvent == null) {
            return List.of();
        }
        if (subEvent.groups() != null && (!subEvent.groups().isEmpty() || Integer.valueOf(0).equals(subEvent.tournamentGroupCount()))) {
            return subEvent.groups().stream()
                    .filter(Objects::nonNull)
                    .map(group -> new SubEventGroupItemDto(
                            normalizeId(group.id()),
                            safeText(group.name()),
                            group.capacityMin(),
                            group.capacityMax(),
                            StringUtils.hasText(safeText(group.source())) ? safeText(group.source()) : "generated"))
                    .toList();
        }
        int groupCount = autoTournamentGroupCount(event, subEvent);
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

    private List<ActivitySubEventGroup> manualGroupRecords(String ownerId) {
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }
        List<ActivitySubEventGroup> records = activitySubEventGroupsRepository
                .findByOwnerIdAndStatusNot(normalizedOwnerId, STATUS_DELETED);
        return (records == null ? List.<ActivitySubEventGroup>of() : records)
                .stream()
                .filter(Objects::nonNull)
                .filter(group -> StringUtils.hasText(normalizeId(group.getGroupId())))
                .sorted(Comparator
                        .comparing((ActivitySubEventGroup group) -> safeText(group.getCreatedDate()))
                        .thenComparing(group -> safeText(group.getGroupId())))
                .toList();
    }

    private SubEventGroupItemDto toManualSubEventGroup(ActivitySubEventGroup group) {
        if (group == null || STATUS_DELETED.equals(safeText(group.getStatus()))) {
            return null;
        }
        String groupId = normalizeId(group.getGroupId());
        if (!StringUtils.hasText(groupId)) {
            return null;
        }
        int capacityMin = Math.max(0, group.getCapacityMin() == null ? 0 : group.getCapacityMin());
        int capacityMax = Math.max(capacityMin, group.getCapacityMax() == null ? capacityMin : group.getCapacityMax());
        return new SubEventGroupItemDto(
                groupId,
                safeText(group.getName()),
                capacityMin,
                capacityMax,
                "manual");
    }

    private ActivitySubEventStageRuntime upsertStageRuntimeGroupsCount(
            String ownerId,
            String subEventId,
            ActivityEvent event,
            SubEventItem stage,
            String actorUserId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedOwnerId) || !StringUtils.hasText(normalizedSubEventId)) {
            return null;
        }
        String nowIso = Instant.now().toString();
        ActivitySubEventStageRuntime record = activitySubEventStageRuntimeRepository
                .findByOwnerIdAndSubEventId(normalizedOwnerId, normalizedSubEventId)
                .orElseGet(ActivitySubEventStageRuntime::new);
        record.setId(StringUtils.hasText(record.getId()) ? record.getId() : new ObjectId().toHexString());
        int groupsCount = autoTournamentGroupCount(event, stage)
                + manualGroupRecords(record.getId()).size();
        record.setSyncKey(StringUtils.hasText(record.getSyncKey()) ? record.getSyncKey() : UUID.randomUUID().toString());
        record.setRecordId(normalizedOwnerId + ":" + normalizedSubEventId);
        record.setStatus(STATUS_ACTIVE);
        record.setOwnerId(normalizedOwnerId);
        record.setSubEventId(normalizedSubEventId);
        record.setGroupsCount(Math.max(0, groupsCount));
        record.setCreatedDate(StringUtils.hasText(record.getCreatedDate()) ? record.getCreatedDate() : nowIso);
        record.setCreatedUser(StringUtils.hasText(record.getCreatedUser()) ? record.getCreatedUser() : normalizeId(actorUserId));
        record.setUpdatedDate(nowIso);
        record.setUpdatedUser(normalizeId(actorUserId));
        return activitySubEventStageRuntimeRepository.save(record);
    }

    private String nextManualGroupId(String ownerId, List<ActivitySubEventGroup> groups) {
        String prefix = normalizeId(ownerId) + ":manual-group:";
        int index = Math.max(1, groups == null ? 1 : groups.size() + 1);
        while (containsManualGroupId(groups, prefix + index)) {
            index += 1;
        }
        return prefix + index;
    }

    private boolean containsManualGroupId(List<ActivitySubEventGroup> groups, String groupId) {
        if (groups == null) {
            return false;
        }
        for (ActivitySubEventGroup group : groups) {
            if (groupId.equals(normalizeId(group == null ? null : group.getGroupId()))) {
                return true;
            }
        }
        return false;
    }

    private String manualGroupRecordId(String ownerId, String groupId) {
        return normalizeId(ownerId) + ":" + normalizeId(groupId);
    }

    private int autoTournamentGroupCount(SubEventItem subEvent) {
        return autoTournamentGroupCountForIncoming(subEvent, subEvent == null ? 0 : safeCount(subEvent.capacityMax()));
    }

    private int autoTournamentGroupCount(ActivityEvent event, SubEventItem targetStage) {
        if (targetStage == null) {
            return 0;
        }
        List<SubEventItem> stages = event == null || event.getSubEvents() == null
                ? List.of(targetStage)
                : event.getSubEvents();
        int incomingCapacityMax = Math.max(safeCount(event == null ? null : event.getCapacityMax()), safeCount(targetStage.capacityMax()));
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

    private int autoTournamentGroupCountForIncoming(SubEventItem subEvent, int incomingCapacityMax) {
        if (subEvent == null) {
            return 0;
        }
        if (subEvent.groups() != null && !subEvent.groups().isEmpty()) {
            return (int) subEvent.groups().stream().filter(Objects::nonNull).count();
        }
        int explicitCount = Math.max(0, subEvent.tournamentGroupCount() == null ? 0 : subEvent.tournamentGroupCount());
        if (explicitCount > 0) {
            return explicitCount;
        }
        int groupMin = Math.max(0, subEvent.tournamentGroupCapacityMin() == null ? 0 : subEvent.tournamentGroupCapacityMin());
        int groupMax = Math.max(groupMin, subEvent.tournamentGroupCapacityMax() == null ? groupMin : subEvent.tournamentGroupCapacityMax());
        if (groupMin <= 0 && groupMax <= 0) {
            return 0;
        }
        int divisor = Math.max(1, groupMax > 0 ? groupMax : groupMin);
        int capacityMax = Math.max(0, incomingCapacityMax > 0 ? incomingCapacityMax : safeCount(subEvent.capacityMax()));
        return capacityMax > 0 ? Math.max(1, (int) Math.ceil((double) capacityMax / divisor)) : 0;
    }

    private boolean hasTournamentStageConfig(SubEventItem subEvent) {
        return subEvent != null
                && !Boolean.TRUE.equals(subEvent.optional())
                && ((subEvent.groups() != null && !subEvent.groups().isEmpty())
                        || safeCount(subEvent.tournamentGroupCount()) > 0
                        || safeCount(subEvent.tournamentGroupCapacityMin()) > 0
                        || safeCount(subEvent.tournamentGroupCapacityMax()) > 0
                        || "Score".equalsIgnoreCase(safeText(subEvent.tournamentLeaderboardType()))
                        || "Fifa".equalsIgnoreCase(safeText(subEvent.tournamentLeaderboardType())));
    }

    private boolean sameStage(SubEventItem left, SubEventItem right) {
        if (left == null || right == null) {
            return false;
        }
        String leftId = normalizeId(left.id());
        String rightId = normalizeId(right.id());
        return StringUtils.hasText(leftId) && leftId.equals(rightId);
    }

    private int safeCount(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private ActivityEvent resolvePreferredEvent(List<ActivityEvent> records) {
        ActivityEvent preferred = null;
        for (ActivityEvent record : records) {
            if (record == null) {
                continue;
            }
            if (preferred == null) {
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

    private boolean canManageTournamentGroups(String requestedActorUserId, ActivityEvent event) {
        return isEventOwnerOrAdmin(event, effectiveActorUserId(requestedActorUserId));
    }

    private String effectiveActorUserId(String requestedActorUserId) {
        if (!accessControlService.requiresAuthenticatedActor()) {
            return normalizeId(requestedActorUserId);
        }
        return normalizeId(accessControlService.resolveActorUserId(SecurityContextHolder.getContext().getAuthentication()));
    }

    private boolean isEventOwnerOrAdmin(ActivityEvent event, String actorUserId) {
        String normalizedActorUserId = normalizeId(actorUserId);
        if (event == null || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
        }
        if (normalizedActorUserId.equals(normalizeId(event.getOwnerUserId()))
                || normalizedActorUserId.equals(normalizeId(event.getCreatorUserId()))) {
            return true;
        }
        for (String adminUserId : event.getAdmins() == null ? List.<String>of() : event.getAdmins()) {
            if (normalizedActorUserId.equals(normalizeId(adminUserId))) {
                return true;
            }
        }
        return false;
    }

    private List<SubEventItem> replaceSubEventGroups(
            List<SubEventItem> subEvents,
            String subEventId,
            List<SubEventGroupItemDto> groups) {
        if (subEvents == null || subEvents.isEmpty()) {
            return List.of();
        }
        List<SubEventItem> updated = new ArrayList<>();
        for (SubEventItem subEvent : subEvents) {
            if (subEvent == null) {
                continue;
            }
            if (!subEventId.equals(normalizeId(subEvent.id()))) {
                updated.add(subEvent);
                continue;
            }
            updated.add(copySubEventWithGroups(subEvent, groups, null));
        }
        return updated;
    }

    private SubEventItem copySubEventWithGroups(
            SubEventItem subEvent,
            List<SubEventGroupItemDto> groups,
            Integer tournamentGroupCountOverride) {
        List<SubEventGroupItemDto> normalizedGroups = groups == null
                ? List.of()
                : groups.stream().filter(Objects::nonNull).toList();
        GroupCapacityTotals capacityTotals = tournamentGroupCapacityTotals(normalizedGroups);
        Integer capacityMin = normalizedGroups.isEmpty() ? subEvent.capacityMin() : capacityTotals.min();
        Integer capacityMax = normalizedGroups.isEmpty() ? subEvent.capacityMax() : capacityTotals.max();
        Integer membersPending = normalizedGroups.isEmpty()
                ? subEvent.membersPending()
                : Math.max(0, capacityTotals.max() - Math.max(0, subEvent.membersAccepted() == null ? 0 : subEvent.membersAccepted()));
        Integer tournamentGroupCount = tournamentGroupCountOverride != null
                ? tournamentGroupCountOverride
                : normalizedGroups.isEmpty() ? subEvent.tournamentGroupCount() : normalizedGroups.size();
        return new SubEventItem(
                subEvent.id(),
                subEvent.name(),
                subEvent.description(),
                subEvent.startAt(),
                subEvent.endAt(),
                subEvent.location(),
                subEvent.createdByUserId(),
                normalizedGroups,
                tournamentGroupCount,
                subEvent.tournamentGroupCapacityMin(),
                subEvent.tournamentGroupCapacityMax(),
                subEvent.tournamentLeaderboardType(),
                subEvent.tournamentAdvancePerGroup(),
                subEvent.optional(),
                subEvent.pricing(),
                capacityMin,
                capacityMax,
                subEvent.membersAccepted(),
                membersPending,
                subEvent.carsPending(),
                subEvent.accommodationPending(),
                subEvent.suppliesPending(),
                subEvent.carsAccepted(),
                subEvent.accommodationAccepted(),
                subEvent.suppliesAccepted(),
                subEvent.carsCapacityMin(),
                subEvent.carsCapacityMax(),
                subEvent.accommodationCapacityMin(),
                subEvent.accommodationCapacityMax(),
                subEvent.suppliesCapacityMin(),
                subEvent.suppliesCapacityMax(),
                subEvent.slotStartOffsetMinutes(),
                subEvent.slotDurationMinutes(),
                subEvent.stageStatus(),
                subEvent.stageStatusReason(),
                subEvent.stageStatusUpdatedAt(),
                subEvent.stageFinalizedAt(),
                subEvent.stageFinalizedByUserId());
    }

    private GroupCapacityTotals tournamentGroupCapacityTotals(List<SubEventGroupItemDto> groups) {
        int capacityMin = 0;
        int capacityMax = 0;
        for (SubEventGroupItemDto group : groups == null ? List.<SubEventGroupItemDto>of() : groups) {
            if (group == null) {
                continue;
            }
            int groupMin = Math.max(0, group.capacityMin() == null ? 0 : group.capacityMin());
            int groupMax = Math.max(groupMin, group.capacityMax() == null ? groupMin : group.capacityMax());
            capacityMin += groupMin;
            capacityMax += groupMax;
        }
        return new GroupCapacityTotals(capacityMin, capacityMax);
    }

    private record GroupCapacityTotals(int min, int max) {
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
