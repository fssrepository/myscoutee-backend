package com.raxim.myscoutee.microservices.transport.community;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.community.api.AnnouncementDirectory;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AnnouncementDirectoryEndpoint {
    private final AnnouncementDirectory owner;
    private final ObjectMapper mapper;
    public AnnouncementDirectoryEndpoint(AnnouncementDirectory owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AnnouncementDirectoryProtocol.FIND, produces = "application/json")
    public ResponseEntity<?> find(HttpServletRequest request) throws java.io.IOException {
        return read(request, AnnouncementDirectoryProtocol.Query.class, AnnouncementDirectoryProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AnnouncementDirectoryProtocol.Result(true, owner.find(command.id()).orElse(null))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AnnouncementDirectoryProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AnnouncementDirectoryProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AnnouncementDirectoryProtocol.Error("ANNOUNCEMENT_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
