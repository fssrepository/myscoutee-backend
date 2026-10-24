package com.raxim.myscoutee.microservices.transport.assets;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.assets.api.Assets;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetsEndpoint {
    private final Assets owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public AssetsEndpoint(Assets owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = AssetsProtocol.MANAGE, produces = "application/json")
    public ResponseEntity<?> manage(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Query.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AssetsProtocol.Decision(owner.canManageScopedAssetMembers(command.assetId(), command.eventId(), command.subEventId(), command.userId()))));
    }
    @PostMapping(value = AssetsProtocol.FIND, produces = "application/json")
    public ResponseEntity<?> find(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Query.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AssetsProtocol.Result(true, owner.findAssetByAssetId(command.assetId()).map(com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto::from).orElse(null))));
    }
    @PostMapping(value = AssetsProtocol.SCOPED, produces = "application/json")
    public ResponseEntity<?> scoped(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Query.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AssetsProtocol.Result(true, owner.findAssetByAssetIdWithScopedRequests(command.assetId(), command.eventId(), command.subEventId(), command.status(), command.requestId()).map(com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto::from).orElse(null))));
    }
    @PostMapping(value = AssetsProtocol.DETAIL, produces = "application/json")
    public ResponseEntity<?> detail(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Query.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AssetsProtocol.Detail(true, owner.queryAssetDetail(command.userId(),command.assetId(),command.eventId(),command.subEventId()))));
    }
    @PostMapping(value = AssetsProtocol.ASSIGNABLE, produces = "application/json")
    public ResponseEntity<?> assignable(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Batch.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.queryAssignableAssetDetails(command.userId(),command.eventId(),command.subEventId(),command.ids())));
    }
    @PostMapping(value = AssetsProtocol.REFERENCED, produces = "application/json")
    public ResponseEntity<?> referenced(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Batch.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.queryReferencedAssetDetails(command.userId(),command.ids())));
    }
    @PostMapping(value = AssetsProtocol.PAGE, produces = "application/json")
    public ResponseEntity<?> page(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Page.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.queryVisibleAssetsPage(command.userId(),command.type(),command.category(),command.start(),command.end(),command.page(),command.size(),command.cursor(),command.order())));
    }
    @PostMapping(value = AssetsProtocol.DELETE_SCOPE, produces = "application/json")
    public ResponseEntity<?> delete_scope(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.DeleteScope.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.statusDeleteAssignmentScopeRequests(command.ownerUserId(),command.ids(),command.ownerId(),command.eventId(),command.subEventId(),command.actor(),command.deletedAt()))));
    }
    @PostMapping(value = AssetsProtocol.DELETE_USERS, produces = "application/json")
    public ResponseEntity<?> delete_users(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.DeleteUsers.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.statusDeleteEventAssignmentRequestsForUsers(command.ids(),command.users(),command.eventId(),command.actor(),command.deletedAt())));
    }
    @PostMapping(value = AssetsProtocol.MEMBERS, produces = "application/json")
    public ResponseEntity<?> members(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Members.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.syncRequestsFromMembers(command.assetId(),command.members()))));
    }
    @PostMapping(value = AssetsProtocol.ENTRIES, produces = "application/json")
    public ResponseEntity<?> entries(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Entries.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AssetsProtocol.Status(true, owner.syncScopedRequestsFromMemberEntries(command.assetId(),command.eventId(),command.subEventId(),command.members(),command.actor()))));
    }
    @PostMapping(value = AssetsProtocol.UPSERT, produces = "application/json")
    public ResponseEntity<?> upsert(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetsProtocol.Save.class, AssetsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AssetsProtocol.Saved(true, owner.upsert(command.request()))));
    }
    private AssetsProtocol.Receipt receipt(Runnable action) { action.run(); return new AssetsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (AssetsProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, AssetsProtocol.AUDIENCE, request.getRequestURI(), type, AssetsProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetsProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new AssetsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AssetsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new AssetsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AssetsProtocol.Error("ASSETS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
