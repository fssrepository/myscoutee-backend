package com.raxim.myscoutee.microservices.transport.accounts;

import java.io.IOException;
import com.raxim.myscoutee.domain.accounts.api.ProfileCards;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import com.raxim.myscoutee.microservices.transport.accounts.ProfileCardsProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class ProfileCardsEndpoint {
    private final ProfileCards owner;
    private final ObjectMapper mapper;
    public ProfileCardsEndpoint(ProfileCards owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ProfileCardsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> profiles(HttpServletRequest request) throws IOException {
        try {
            var ids = ProfileCardsProtocol.readIds(request, mapper);
            return response(200, owner.queryUsersByIds(ids));
        } catch (RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new Error("PROFILE_CARDS_UNAVAILABLE")); }
    }
    @PostMapping(value = ProfileCardsProtocol.PRESENT, produces = "application/json")
    public ResponseEntity<?> present(HttpServletRequest request) throws IOException {
        try {
            return response(200, owner.presentGameCards(ProfileCardsProtocol.readIds(request, mapper)));
        } catch (RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new Error("PROFILE_CARDS_UNAVAILABLE")); }
    }
    @PostMapping(value = ProfileCardsProtocol.PROFILES, produces = "application/json")
    public ResponseEntity<?> fullProfiles(HttpServletRequest request) throws IOException {
        try {
            return response(200, owner.presentProfiles(ProfileCardsProtocol.readIds(request, mapper)));
        } catch (RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new Error("PROFILE_CARDS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
