package com.raxim.myscoutee.profile.service;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.IntegrationExternalId;
import com.raxim.myscoutee.profile.data.document.IntegrationParticipantInvite;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.*;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@Service
public class IntegrationParticipantInviteService {
    private final MongoTemplate mongo;
    private final ActivityEventsRepository events;
    private final AccessControlService access;
    private final ActivitiesMembersService members;
    private final IntegrationPublicEndpointResolver endpoint;
    private final HomeUserProfileService profiles;
    private final SecureRandom random = new SecureRandom();

    public IntegrationParticipantInviteService(MongoTemplate mongo, ActivityEventsRepository events, AccessControlService access,
            ActivitiesMembersService members, IntegrationPublicEndpointResolver endpoint, HomeUserProfileService profiles) {
        this.mongo = mongo; this.events = events; this.access = access; this.members = members; this.endpoint = endpoint; this.profiles = profiles;
    }

    public IntegrationParticipantInvitesDto create(String ownerUserId, String eventId, IntegrationParticipantInviteRequestDto request) {
        requireEvent(ownerUserId, eventId);
        if (request == null || request.participantIds() == null || request.participantIds().isEmpty()
                || request.participantIds().size() > IntegrationTokenService.MAX_BATCH_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invite batch must contain 1–1000 participant IDs.");
        }
        LinkedHashMap<String, String> ids = new LinkedHashMap<>();
        Set<String> participantIds = new HashSet<>();
        for (String value : request.participantIds()) {
            String id = value == null ? "" : value.trim();
            if (id.isBlank() || id.length() > 200 || !participantIds.add(id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Participant IDs must be distinct non-empty strings of at most 200 characters.");
            }
            ids.put(digest(ownerUserId + "\n" + eventId + "\n" + id), id);
        }
        String now = Instant.now().toString();
        BulkOperations writes = mongo.bulkOps(BulkOperations.BulkMode.UNORDERED, IntegrationParticipantInvite.class);
        for (var entry : ids.entrySet()) {
            byte[] bytes = new byte[32]; random.nextBytes(bytes);
            String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            writes.upsert(Query.query(Criteria.where("_id").is(entry.getKey())), new Update()
                    .setOnInsert("ownerUserId", ownerUserId).setOnInsert("eventId", eventId)
                    .setOnInsert("participantId", entry.getValue()).setOnInsert("token", token)
                    .setOnInsert("tokenHash", digest(token)).setOnInsert("createdAtIso", now));
        }
        writes.execute();
        var stored = mongo.find(Query.query(Criteria.where("_id").in(ids.keySet())), IntegrationParticipantInvite.class);
        Map<String, IntegrationParticipantInvite> byId = new HashMap<>();
        stored.forEach(invite -> byId.put(invite.id(), invite));
        String appUrl = URI.create(endpoint.resolve()).resolve("/game").toString();
        return new IntegrationParticipantInvitesDto(ids.keySet().stream().map(id -> {
            var invite = byId.get(id);
            return new IntegrationParticipantInviteDto(invite.participantId(), appUrl + "?partnerInvite=" + invite.token(),
                    invite.claimedUserId() != null);
        }).toList());
    }

    public IntegrationParticipantClaimDto claim(String requestedUserId, String token) {
        String actor = profiles.resolveSelectedUserId(requestedUserId);
        if (actor == null || actor.isBlank()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        if (token == null || !token.matches("[A-Za-z0-9_-]{43}")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitation not found.");
        }
        var invite = mongo.findOne(Query.query(Criteria.where("tokenHash").is(digest(token))), IntegrationParticipantInvite.class);
        if (invite == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitation not found.");
        var event = requireEvent(invite.ownerUserId(), invite.eventId());
        if (invite.claimedUserId() != null && !actor.equals(invite.claimedUserId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This invitation belongs to another account.");
        }
        String mappingId = digest(invite.ownerUserId() + "\nparticipant\n" + invite.participantId());
        IntegrationExternalId mapping;
        try {
            mapping = mongo.findAndModify(Query.query(Criteria.where("_id").is(mappingId)), new Update()
                        .setOnInsert("ownerUserId", invite.ownerUserId()).setOnInsert("resourceType", "participant")
                        .setOnInsert("externalId", invite.participantId()).setOnInsert("internalId", actor)
                        .setOnInsert("createdAtIso", Instant.now().toString()),
                FindAndModifyOptions.options().upsert(true).returnNew(true), IntegrationExternalId.class);
        } catch (DuplicateKeyException conflict) {
            mapping = mongo.findById(mappingId, IntegrationExternalId.class);
        }
        if (mapping == null || !actor.equals(mapping.getInternalId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Participant ID is linked to another account.");
        }
        var claimed = mongo.findAndModify(Query.query(Criteria.where("_id").is(invite.id())
                        .and("claimedUserId").in(null, actor)),
                new Update().set("claimedUserId", actor).set("claimedAtIso", Instant.now().toString()),
                FindAndModifyOptions.options().returnNew(true), IntegrationParticipantInvite.class);
        if (claimed == null) throw new ResponseStatusException(HttpStatus.CONFLICT, "Invitation already claimed.");
        members.claimIntegrationInvite(claimed, event, actor);
        return new IntegrationParticipantClaimDto(invite.eventId());
    }

    private com.raxim.myscoutee.profile.data.document.ActivityEvent requireEvent(String ownerUserId, String eventId) {
        var event = events.findByOwnerUserIdAndSourceId(ownerUserId, eventId)
                .filter(value -> Boolean.TRUE.equals(value.getIsAdmin()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
        if (!access.canInviteEventMembers(eventId, ownerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Event invitations are not allowed.");
        }
        return event;
    }

    private static String digest(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (NoSuchAlgorithmException impossible) { throw new IllegalStateException(impossible); }
    }
}
