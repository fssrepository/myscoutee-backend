package com.raxim.myscoutee.microservices.transport.content;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.content.api.IdeaAdministration;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class IdeaAdministrationEndpoint {
    private final IdeaAdministration owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public IdeaAdministrationEndpoint(IdeaAdministration owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = IdeaAdministrationProtocol.ADMINPOSTS_1, produces = "application/json")
    public ResponseEntity<?> adminposts_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IdeaAdministrationProtocol.AdminPosts1.class, IdeaAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.adminPosts(command.adminUserId())));
    }
    @PostMapping(value = IdeaAdministrationProtocol.ADMINPOSTS_2, produces = "application/json")
    public ResponseEntity<?> adminposts_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, IdeaAdministrationProtocol.AdminPosts2.class, IdeaAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.adminPosts(command.adminUserId(), command.lang())));
    }
    @PostMapping(value = IdeaAdministrationProtocol.ADMINPOSTSPAGE_1, produces = "application/json")
    public ResponseEntity<?> adminpostspage_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IdeaAdministrationProtocol.AdminPostsPage1.class, IdeaAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.adminPostsPage(command.adminUserId(), command.lang(), command.status(), command.pageSize(), command.cursor())));
    }
    @PostMapping(value = IdeaAdministrationProtocol.SAVEPOST_1, produces = "application/json")
    public ResponseEntity<?> savepost_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IdeaAdministrationProtocol.SavePost1.class, IdeaAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.savePost(command.request())));
    }
    @PostMapping(value = IdeaAdministrationProtocol.DELETEPOST_1, produces = "application/json")
    public ResponseEntity<?> deletepost_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IdeaAdministrationProtocol.DeletePost1.class, IdeaAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.deletePost(command.postId(), command.request())));
    }
    @PostMapping(value = IdeaAdministrationProtocol.RESTOREPOST_1, produces = "application/json")
    public ResponseEntity<?> restorepost_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, IdeaAdministrationProtocol.RestorePost1.class, IdeaAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.restorePost(command.postId(), command.request())));
    }
    private IdeaAdministrationProtocol.Receipt receipt(Runnable action) { action.run(); return new IdeaAdministrationProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (IdeaAdministrationProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, IdeaAdministrationProtocol.AUDIENCE, request.getRequestURI(), type, IdeaAdministrationProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                if (verified.principal().getAuthorities().stream().noneMatch(role -> "A".equals(role.getAuthority())))
                    throw new org.springframework.security.access.AccessDeniedException("Administrator authority required");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, IdeaAdministrationProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new IdeaAdministrationProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new IdeaAdministrationProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new IdeaAdministrationProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new IdeaAdministrationProtocol.Error("IDEA_ADMINISTRATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
