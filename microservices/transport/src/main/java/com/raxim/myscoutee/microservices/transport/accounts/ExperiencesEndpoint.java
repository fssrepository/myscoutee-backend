package com.raxim.myscoutee.microservices.transport.accounts;

import java.io.IOException;
import com.raxim.myscoutee.domain.accounts.api.Experiences;
import com.raxim.myscoutee.domain.accounts.dto.ExperienceDtos.UserExperiencesResponseDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import com.raxim.myscoutee.microservices.transport.accounts.ExperiencesProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class ExperiencesEndpoint {
    private final Experiences owner;
    private final ObjectMapper mapper;
    public ExperiencesEndpoint(Experiences owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @GetMapping(value = ExperiencesProtocol.ONE, produces = "application/json")
    public ResponseEntity<?> profile(@RequestParam(required = false) String id) {
        if (!ExperiencesProtocol.validId(id)) return response(400, new Error("INVALID_REQUEST"));
        try {
            return owner.findByUserId(id).<ResponseEntity<?>>map(value -> response(200, UserExperiencesResponseDto.from(value)))
                    .orElseGet(() -> response(404, new Error("NOT_FOUND")));
        } catch (RuntimeException unavailable) { return response(503, new Error("EXPERIENCES_UNAVAILABLE")); }
    }
    @PostMapping(value = ExperiencesProtocol.BATCH, produces = "application/json")
    public ResponseEntity<?> profiles(HttpServletRequest request) throws IOException {
        try {
            var ids = ExperiencesProtocol.readIds(request, mapper);
            return response(200, owner.findByUserIdIn(ids).stream().map(UserExperiencesResponseDto::from).toList());
        } catch (RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new Error("EXPERIENCES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
