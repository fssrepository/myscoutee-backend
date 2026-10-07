package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.events.api.EventOwnership;
import com.raxim.myscoutee.domain.events.api.MingleEncounters;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationExternalIdsRepository;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.MingleEncounters.Round;
import com.raxim.myscoutee.domain.integrations.document.IntegrationExternalId;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.*;


@Service
public class IntegrationEventQueryService {
    private final EventOwnership events;
    private final MingleEncounters encounters;
    private final IntegrationExternalIdsRepository externalIds;

    public IntegrationEventQueryService(EventOwnership events, MingleEncounters encounters, IntegrationExternalIdsRepository externalIds) {
        this.events = events; this.encounters = encounters; this.externalIds = externalIds;
    }

    public IntegrationEventDto event(String ownerUserId, String eventId) {
        Event event = requireOwnedEvent(ownerUserId, eventId);
        String id = externalIds.findByOwnerUserIdAndResourceTypeAndInternalId(ownerUserId, "event", eventId)
                .map(IntegrationExternalId::getExternalId).orElse(null);
        return new IntegrationEventDto(id, eventId, event.getTitle(), event.getStatus(), event.getSourceLink(),
                event.getMode() == null ? "Casual" : event.getMode(), event.getMingleConfiguration());
    }

    public IntegrationEncountersDto encounters(String ownerUserId, String eventId, int offset, int limit) {
        if (offset < 0 || limit < 1 || limit > 1000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid encounters page.");
        }
        IntegrationEncountersDto all = completedEncounters(ownerUserId, eventId);
        return page(all, offset, limit);
    }

    public IntegrationEncountersDto completedEncounters(String ownerUserId, String eventId) {
        IntegrationEventDto event = event(ownerUserId, eventId);
        if (!"Mingle".equals(event.mode())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Event is not Mingle.");
        var session = encounters.findSession(eventId)
                .filter(value -> "COMPLETED".equals(value.getStatus()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "Mingle has not completed."));
        var completed = encounters.completedRounds(List.of(eventId));
        Set<Pair> unique = new TreeSet<>(Comparator.comparing(Pair::first).thenComparing(Pair::second));
        Set<String> users = new HashSet<>();
        for (Round round : completed) {
            for (var table : round.getTables()) {
                List<String> ids = table.memberUserIds().stream().filter(Objects::nonNull).filter(id -> !id.isBlank()).distinct().sorted().toList();
                users.addAll(ids);
                for (int i = 0; i < ids.size(); i++) {
                    for (int j = i + 1; j < ids.size(); j++) unique.add(new Pair(ids.get(i), ids.get(j)));
                }
            }
        }
        Map<String, String> mappings = users.isEmpty() ? Map.of() : externalIds
                .findByOwnerUserIdAndResourceTypeAndInternalIdIn(ownerUserId, "participant", users).stream()
                .collect(Collectors.toMap(IntegrationExternalId::getInternalId, IntegrationExternalId::getExternalId));
        Map<String, IntegrationEncounterParticipantDto> participants = new HashMap<>();
        for (String userId : users) {
            // Stable only within this organizer's integration namespace; never expose internal user IDs.
            String publicId = UUID.nameUUIDFromBytes(("participant:" + ownerUserId + ":" + userId).getBytes(StandardCharsets.UTF_8)).toString();
            participants.put(userId, new IntegrationEncounterParticipantDto(mappings.get(userId), publicId));
        }
        List<IntegrationEncounterPairDto> pairs = unique.stream()
                .map(pair -> new IntegrationEncounterPairDto(participants.get(pair.first()), participants.get(pair.second())))
                .toList();
        return new IntegrationEncountersDto(event.id(), eventId, session.getRevision() == null ? 0 : session.getRevision(), pairs, pairs.size(), null);
    }

    public static IntegrationEncountersDto page(IntegrationEncountersDto all, int offset, int limit) {
        int start = Math.min(offset, all.total());
        int end = (int) Math.min((long) start + limit, all.total());
        return new IntegrationEncountersDto(all.id(), all.externalId(), all.revision(), all.pairs().subList(start, end),
                all.total(), end < all.total() ? end : null);
    }

    Event requireOwnedEvent(String ownerUserId, String eventId) {
        return events.findByOwnerUserIdAndSourceId(ownerUserId, eventId)
                .filter(event -> Boolean.TRUE.equals(event.getIsAdmin()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
    }

    private record Pair(String first, String second) { }
}
