package com.raxim.myscoutee.microservices.transport.groups;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.groups.api.IntegrationGroups;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class IntegrationGroupsEndpoint {
    private final IntegrationGroups owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    private final com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles profiles;
    public IntegrationGroupsEndpoint(IntegrationGroups owner, ObjectMapper mapper, com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles profiles, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.profiles = profiles; this.verifier = verifier; }
    @PostMapping(value = IntegrationGroupsProtocol.ACTOR_1, produces = "application/json")
    public ResponseEntity<?> actor_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.Actor1.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new IntegrationGroupsProtocol.Actor1Result(true, com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto.from(owner.actor(command.requestedId())))));
    }
    @PostMapping(value = IntegrationGroupsProtocol.DETAIL_1, produces = "application/json")
    public ResponseEntity<?> detail_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.Detail1.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new IntegrationGroupsProtocol.Detail1Result(true, owner.detail(profile(command.actorId()), command.id()))));
    }
    @PostMapping(value = IntegrationGroupsProtocol.PAGE_1, produces = "application/json")
    public ResponseEntity<?> page_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.Page1.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new IntegrationGroupsProtocol.Page1Result(true, owner.page(profile(command.actorId()), command.bucket(), command.category(), command.pageSize(), command.cursor()))));
    }
    @PostMapping(value = IntegrationGroupsProtocol.PAGE_2, produces = "application/json")
    public ResponseEntity<?> page_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.Page2.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new IntegrationGroupsProtocol.Page2Result(true, owner.page(profile(command.actorId()), command.bucket(), command.category(), command.pageSize(), command.cursor(), command.sort()))));
    }
    @PostMapping(value = IntegrationGroupsProtocol.JOINWORKSPACEBASE_1, produces = "application/json")
    public ResponseEntity<?> joinworkspacebase_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.JoinWorkspaceBase1.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.joinWorkspaceBase(profile(command.actorId()), command.groupId()))));
    }
    @PostMapping(value = IntegrationGroupsProtocol.CLAIMINTEGRATIONINVITE_1, produces = "application/json")
    public ResponseEntity<?> claimintegrationinvite_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.ClaimIntegrationInvite1.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.claimIntegrationInvite(command.invite(), command.actorUserId()))));
    }
    @PostMapping(value = IntegrationGroupsProtocol.CLAIMEVENTINVITE_1, produces = "application/json")
    public ResponseEntity<?> claimeventinvite_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.ClaimEventInvite1.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new IntegrationGroupsProtocol.ClaimEventInvite1Result(true, com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto.from(owner.claimEventInvite(command.groupId(), command.inviterProfileId(), command.accountId())))));
    }
    @PostMapping(value = IntegrationGroupsProtocol.ADMINISTEREDGROUPS_1, produces = "application/json")
    public ResponseEntity<?> administeredgroups_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.AdministeredGroups1.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.administeredGroups(profile(command.actorId())).stream().map(com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto::from).toList()));
    }
    @PostMapping(value = IntegrationGroupsProtocol.REQUIREADMIN_1, produces = "application/json")
    public ResponseEntity<?> requireadmin_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IntegrationGroupsProtocol.RequireAdmin1.class, IntegrationGroupsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.requireAdmin(profile(command.actorId()), command.id()))));
    }
    private ProtocolFields.Receipt receipt(Runnable action) { action.run(); return new ProtocolFields.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        return new ReadQueryBodies.CommandReader(IntegrationGroupsProtocol.MAX_REQUEST_BYTES, "INTEGRATION_GROUPS_UNAVAILABLE", verifier, IntegrationGroupsProtocol.AUDIENCE, IntegrationGroupsProtocol::delegated)
                .read(request, mapper, type, valid, action);
    }

    private com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile profile(String id) {
        if (id == null) return null;
        return profiles.findByUserId(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND));
    }
}
