package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.groups.api.GroupDirectory;

import com.raxim.myscoutee.domain.accounts.api.SelectedProfile;
import com.raxim.myscoutee.domain.events.api.EventOperations;
import com.raxim.myscoutee.domain.events.api.PartnerInvitationAdmission;
import com.raxim.myscoutee.domain.groups.api.IntegrationGroups;
import com.raxim.myscoutee.domain.payments.api.Affiliates;

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
import com.raxim.myscoutee.domain.integrations.document.IntegrationExternalId;
import com.raxim.myscoutee.domain.integrations.document.IntegrationParticipantInvite;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.*;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;

@Service
public class IntegrationParticipantInviteService {
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.accounts.api.ProfileAuthentication profileAuthentication;
    @org.springframework.beans.factory.annotation.Autowired
    private GroupDirectory groupDirectory;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.events.api.MingleEncounters encounters;
    private final MongoTemplate mongo;
    private final EventOwnershipReads events;
    private final AccessPermissions access;
    private final PartnerInvitationAdmission members;
    private final IntegrationPublicEndpointResolver endpoint;
    private final SelectedProfile profiles;
    @org.springframework.beans.factory.annotation.Autowired
    private IntegrationGroups groups;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.accounts.api.ProfileDirectory users;
    @org.springframework.beans.factory.annotation.Autowired
    private Affiliates affiliates;
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private EventOperations eventActions;
    private final SecureRandom random = new SecureRandom();

    public IntegrationParticipantInviteService(MongoTemplate mongo, EventOwnershipReads events, AccessPermissions access,
            PartnerInvitationAdmission members, IntegrationPublicEndpointResolver endpoint, SelectedProfile profiles) {
        this.mongo = mongo; this.events = events; this.access = access; this.members = members; this.endpoint = endpoint; this.profiles = profiles;
    }

    public IntegrationParticipantInvitesDto create(String ownerUserId, String eventId, IntegrationParticipantInviteRequestDto request) {
        requireEvent(ownerUserId, eventId);
        return create(ownerUserId, eventId, request, "event");
    }
    public IntegrationParticipantInvitesDto createGroup(String ownerUserId, String groupId, IntegrationParticipantInviteRequestDto request) {
        groups.requireAdmin(groups.actor(ownerUserId), groupId);
        return create(ownerUserId, groupId, request, "community");
    }
    private IntegrationParticipantInvitesDto create(String ownerUserId, String eventId, IntegrationParticipantInviteRequestDto request, String ownerType) {
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
            ids.put(digest(ownerUserId + "\n" + ("community".equals(ownerType) ? "community\n" : "") + eventId + "\n" + id), id);
        }
        String now = Instant.now().toString();
        BulkOperations writes = mongo.bulkOps(BulkOperations.BulkMode.UNORDERED, IntegrationParticipantInvite.class);
        for (var entry : ids.entrySet()) {
            byte[] bytes = new byte[32]; random.nextBytes(bytes);
            String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            writes.upsert(Query.query(Criteria.where("_id").is(entry.getKey())), new Update()
                    .set("reusable", false)
                    .setOnInsert("ownerUserId", ownerUserId).setOnInsert("eventId", eventId)
                    .setOnInsert("ownerType", ownerType).setOnInsert("participantId", entry.getValue()).setOnInsert("token", token)
                    .setOnInsert("tokenHash", digest(token)).setOnInsert("createdAtIso", now));
        }
        writes.execute();
        var stored = mongo.find(Query.query(Criteria.where("_id").in(ids.keySet())), IntegrationParticipantInvite.class);
        Map<String, IntegrationParticipantInvite> byId = new HashMap<>();
        stored.forEach(invite -> byId.put(invite.id(), invite));
        String appUrl = invitationBaseUrl(ownerUserId) + "&mode=" + invitationLandingType(ownerUserId, ownerType, eventId);
        return new IntegrationParticipantInvitesDto(ids.keySet().stream().map(id -> {
            var invite = byId.get(id);
            return new IntegrationParticipantInviteDto(invite.participantId(), appUrl + "&partnerInvite=" + invite.token(),
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
        boolean community = "community".equals(invite.ownerType());
        var owner = community ? users.findByUserId(invite.ownerUserId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)) : null;
        if (community) groups.requireAdmin(owner, invite.eventId());
        if (community) actor = groups.actor(actor).getUserId();
        var event = community ? null : invite.reusable() ? sharedEventRecord(invite) : requireOwnedEvent(invite.ownerUserId(), invite.eventId());
        boolean invitationAvailable = community || !hasEnded(event);
        if (!community && event.getWorkspaceGroupId() != null && invitationAvailable) {
            var account = users.findByUserId(actor).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
            String accountId = account.getAccountUserId() == null ? account.getUserId() : account.getAccountUserId();
            // Bind API participant claims to the group profile, while rejecting another
            // account's already-bound token before admitting anyone to the group.
            if (invite.claimedUserId() != null && users.findByWorkspaceGroupIdAndAccountUserId(event.getWorkspaceGroupId(), accountId)
                    .filter(profile -> invite.claimedUserId().equals(profile.getUserId())).isEmpty())
                throw new ResponseStatusException(HttpStatus.CONFLICT, "This invitation belongs to another account.");
            var original = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (!profileAuthentication.isAccount(original))
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            var recipient = groups.claimEventInvite(event.getWorkspaceGroupId(), invite.ownerUserId(), accountId);
            groups.joinWorkspaceBase(groups.actor(accountId), event.getWorkspaceGroupId());
            try {
                org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                        profileAuthentication.forProfile(original, users.findByUserId(recipient.getUserId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED))));
                return claimBoundInvite(recipient.getUserId(), invite, event, false, true);
            } finally {
                org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(original);
            }
        }
        return claimBoundInvite(actor, invite, event, community, invitationAvailable);
    }

    private IntegrationParticipantClaimDto claimBoundInvite(String actor, IntegrationParticipantInvite invite,
            Event event, boolean community, boolean invitationAvailable) {
        if (!community && !invite.reusable() && invitationAvailable) requireInvitePermission(invite.ownerUserId(), invite.eventId());
        if (invite.claimedUserId() != null && !actor.equals(invite.claimedUserId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This invitation belongs to another account.");
        }
        IntegrationParticipantInvite claimed;
        if (invite.reusable()) {
            // Reusable UI links admit each caller through the same membership workflow.
            // They never allocate an API participant ID or bind the link to its first visitor.
            claimed = new IntegrationParticipantInvite(invite.id(), invite.ownerUserId(), invite.eventId(), null,
                    invite.token(), invite.tokenHash(), actor, invite.createdAtIso(), Instant.now().toString(), invite.ownerType(), true);
        } else {
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
            claimed = mongo.findAndModify(Query.query(Criteria.where("_id").is(invite.id())
                            .and("claimedUserId").in(null, actor)),
                    new Update().set("claimedUserId", actor).set("claimedAtIso", Instant.now().toString()),
                    FindAndModifyOptions.options().returnNew(true), IntegrationParticipantInvite.class);
            if (claimed == null) throw new ResponseStatusException(HttpStatus.CONFLICT, "Invitation already claimed.");
        }
        if (community) {
            groups.claimIntegrationInvite(claimed, actor);
            groups.joinWorkspaceBase(groups.actor(actor), invite.eventId());
            return new IntegrationParticipantClaimDto(null, true, invite.eventId());
        }
        if (invitationAvailable) {
            if (!invite.reusable() || access.canInviteEventMembers(invite.eventId(), invite.ownerUserId())) {
                members.claimIntegrationInvite(claimed, event.getId(), actor);
            } else {
                // A public share grants no inviter/admin privileges. Use the recipient's normal admission command.
                var result = eventActions.requestJoin(new com.raxim.myscoutee.domain.events.dto.EventsDtos.EventActionRequestDto(
                        actor, invite.eventId(), null, List.of(), List.of(), List.of(), null, false,
                        null, null, null, null, null, null, null));
                if (result == null || "unchanged".equals(result.membershipStatus()))
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Event participation is unavailable.");
            }
        }
        return new IntegrationParticipantClaimDto(invite.eventId(), invitationAvailable, null, event.getWorkspaceGroupId());
    }

    public record ExternalInviteLinkDto(String url) { }

    public ExternalInviteLinkDto externalLink(String requestedUserId, String ownerType, String entityId) {
        String actor = profiles.resolveSelectedUserId(requestedUserId);
        if ("community".equals(ownerType)) {
            var account = groups.actor(actor);
            groups.requireAdmin(account, entityId);
            actor = account.getUserId();
        }
        else if ("event".equals(ownerType)) {
            if (eventActions.loadEventDetailById(actor, entityId) == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found.");
        }
        else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported invitation target.");
        String id = digest(actor + "\nshared-invite\n" + ownerType + "\n" + entityId);
        byte[] bytes = new byte[32]; random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        IntegrationParticipantInvite invite;
        try {
            invite = mongo.findAndModify(Query.query(Criteria.where("_id").is(id)), new Update()
                    .setOnInsert("ownerUserId", actor).setOnInsert("ownerType", ownerType)
                    .setOnInsert("eventId", entityId).setOnInsert("reusable", true)
                    .setOnInsert("token", token).setOnInsert("tokenHash", digest(token))
                    .setOnInsert("createdAtIso", Instant.now().toString()),
                    FindAndModifyOptions.options().upsert(true).returnNew(true), IntegrationParticipantInvite.class);
        } catch (DuplicateKeyException conflict) {
            invite = mongo.findById(id, IntegrationParticipantInvite.class);
        }
        return new ExternalInviteLinkDto(invitationBaseUrl(actor) + "&partnerInvite=" + invite.token()
                + "&mode=" + invitationLandingType(actor, ownerType, entityId));
    }

    private String invitationLandingType(String actor, String ownerType, String entityId) {
        var profile = users.findByUserId(actor).orElse(null);
        String groupId = "community".equals(ownerType) ? entityId : profile == null ? null : profile.getWorkspaceGroupId();
        var group = groupId == null ? null : groupDirectory.findById(groupId).orElse(null);
        return group == null ? "dating" : group.effectiveType();
    }

    private String invitationBaseUrl(String owner) {
        String affiliateQuery = URI.create(affiliates.link(owner)).getRawQuery();
        return URI.create(endpoint.resolve()).resolve("/game") + "?" + affiliateQuery;
    }

    private Event sharedEventRecord(IntegrationParticipantInvite invite) {
        var inviter = users.findByUserId(invite.ownerUserId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return events.findBySourceId(invite.eventId()).stream()
                .filter(event -> Objects.equals(inviter.getWorkspaceGroupId(), event.getWorkspaceGroupId()))
                .filter(event -> !Boolean.TRUE.equals(event.getIsTrashed()))
                .min(Comparator.comparing(event -> !Boolean.TRUE.equals(event.getIsAdmin())))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
    }

    private Event requireEvent(String ownerUserId, String eventId) {
        var event = requireOwnedEvent(ownerUserId, eventId);
        requireInvitePermission(ownerUserId, eventId);
        return event;
    }

    private Event requireOwnedEvent(String ownerUserId, String eventId) {
        return events.findByOwnerUserIdAndSourceId(ownerUserId, eventId)
                .filter(value -> Boolean.TRUE.equals(value.getIsAdmin()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
    }

    private void requireInvitePermission(String ownerUserId, String eventId) {
        if (!access.canInviteEventMembers(eventId, ownerUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Event invitations are not allowed.");
        }
    }

    private boolean hasEnded(Event event) {
        if (Boolean.TRUE.equals(event.getIsExpired())) return true;
        if (event.getEndAtIso() != null && !event.getEndAtIso().isBlank()
                && !Instant.parse(event.getEndAtIso()).isAfter(Instant.now())) return true;
        return "Mingle".equals(event.getMode()) && encounters.isCompleted(event.getSourceId());
    }

    private static String digest(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (NoSuchAlgorithmException impossible) { throw new IllegalStateException(impossible); }
    }
}
