package com.raxim.myscoutee.microservices.transport.accounts;

import java.io.IOException;
import com.raxim.myscoutee.domain.accounts.api.RatingProfiles;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import com.raxim.myscoutee.microservices.transport.accounts.RatingProfilesProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class RatingProfilesEndpoint {
    private final RatingProfiles owner;
    private final ObjectMapper mapper;
    public RatingProfilesEndpoint(RatingProfiles owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = RatingProfilesProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> profiles(HttpServletRequest request) throws IOException {
        try {
            var ids = RatingProfilesProtocol.readIds(request, mapper);
            return response(200, owner.queryRatingProfiles(ids));
        } catch (RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new Error("RATING_PROFILES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
