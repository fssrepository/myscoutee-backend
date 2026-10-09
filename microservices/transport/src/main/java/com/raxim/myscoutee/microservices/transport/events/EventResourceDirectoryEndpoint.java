package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.EventResourceDirectory;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventResourceDirectoryEndpoint {
    private final EventResourceDirectory owner;
    private final ObjectMapper mapper;
    public EventResourceDirectoryEndpoint(EventResourceDirectory owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventResourceDirectoryProtocol.RESOURCES, produces = "application/json")
    public ResponseEntity<?> resources(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventResourceDirectoryProtocol.Resources.class, EventResourceDirectoryProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(command.owners(), command.assetOwners(), command.status()).stream().map(com.raxim.myscoutee.domain.events.dto.EventResourceDto::from).toList()));
    }
    @PostMapping(value = EventResourceDirectoryProtocol.STAGES, produces = "application/json")
    public ResponseEntity<?> stages(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventResourceDirectoryProtocol.Stages.class, EventResourceDirectoryProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.findByOwnerIdInAndStatusNot(command.owners(), command.status()).stream().map(com.raxim.myscoutee.domain.events.dto.EventResourceDto.StageRuntimeDto::from).toList()));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventResourceDirectoryProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventResourceDirectoryProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new EventResourceDirectoryProtocol.Error("EVENT_RESOURCE_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
