package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.chat.dto.ContactPermissionDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.dao.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class ContactPermissionsEndpoint {
    private final ContactPermissions owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public ContactPermissionsEndpoint(ContactPermissions owner, ActorDelegation.Verifier verifier, ObjectMapper mapper) {
        this.owner = owner; this.verifier = verifier; this.mapper = mapper;
    }
    @PostMapping(value = ContactPermissionsProtocol.USER, produces = "application/json")
    public ResponseEntity<?> user(HttpServletRequest request) throws java.io.IOException {
        return execute(() -> {
            var verified = read(request, ContactPermissionsProtocol.USER, ContactPermissionsProtocol.UserQuery.class);
            String userId = verified.value().userId();
            if (!ContactPermissionsProtocol.id(userId, 512)) throw invalid();
            if (!verified.actor().profileId().equals(userId)) throw new AccessDeniedException("Actor mismatch");
            var records = verified.call(() -> owner.findForUser(userId));
            if (records.stream().anyMatch(value -> !ContactPermissionsProtocol.participant(value, userId)))
                throw new IllegalStateException("Incorrect permission scope");
            return response(200, records.stream().map(ContactPermissionDto::from).toList());
        });
    }
    @PostMapping(value = ContactPermissionsProtocol.ENTRY, produces = "application/json")
    public ResponseEntity<?> entry(HttpServletRequest request) throws java.io.IOException {
        return execute(() -> {
            var verified = read(request, ContactPermissionsProtocol.ENTRY, ContactPermissionsProtocol.EntryQuery.class);
            if (!ContactPermissionsProtocol.id(verified.value().id(), 2048)) throw invalid();
            var item = verified.call(() -> owner.findById(verified.value().id()));
            if (item.isEmpty()) return response(404, new ContactPermissionsProtocol.Error("NOT_FOUND"));
            if (!ContactPermissionsProtocol.participant(item.get(), verified.actor().profileId())) throw new AccessDeniedException("Actor mismatch");
            return response(200, ContactPermissionDto.from(item.get()));
        });
    }
    @PostMapping(value = ContactPermissionsProtocol.SAVE, produces = "application/json")
    public ResponseEntity<?> save(HttpServletRequest request) throws java.io.IOException {
        return execute(() -> {
            var verified = read(request, ContactPermissionsProtocol.SAVE, ContactPermissionsProtocol.Save.class);
            var change = verified.value().change();
            if (!ContactPermissionsProtocol.valid(change)) throw invalid();
            var actor = verified.actor().profileId();
            if (!(actor.equals(change.leftUserId()) || actor.equals(change.rightUserId()))
                    || "pending".equals(change.status()) != actor.equals(change.requestedBy()))
                throw new AccessDeniedException("Actor mismatch");
            return response(200, ContactPermissionDto.from(verified.call(() -> owner.save(change))));
        });
    }
    private <T> DelegatedRequestBodies.Verified<T> read(HttpServletRequest request, String path, Class<T> type) throws java.io.IOException {
        return DelegatedRequestBodies.read(request, mapper, verifier, ContactPermissionsProtocol.AUDIENCE, path, type, ContactPermissionsProtocol.MAX_REQUEST_BYTES);
    }
    @FunctionalInterface private interface Action { ResponseEntity<?> call() throws java.io.IOException; }
    private ResponseEntity<?> execute(Action action) throws java.io.IOException {
        try { return action.call(); }
        catch (AccessDeniedException denied) { return response(403, new ContactPermissionsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ContactPermissionsProtocol.Error(invalid.code())); }
        catch (OptimisticLockingFailureException conflict) { return response(409, new ContactPermissionsProtocol.Error("VERSION_CONFLICT")); }
        catch (DuplicateKeyException conflict) { return response(409, new ContactPermissionsProtocol.Error("DUPLICATE_PERMISSION")); }
        catch (RuntimeException failed) { return response(503, new ContactPermissionsProtocol.Error("PERMISSION_OPERATION_FAILED")); }
    }
    private static ReadQueryBodies.RejectedQuery invalid() { return new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
