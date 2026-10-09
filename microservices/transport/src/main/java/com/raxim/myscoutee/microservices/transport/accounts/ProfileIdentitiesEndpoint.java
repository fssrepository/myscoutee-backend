package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.ProfileIdentities;
import com.raxim.myscoutee.microservices.transport.accounts.ProfileIdentitiesProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public final class ProfileIdentitiesEndpoint {
    private final ProfileIdentities profiles;
    public ProfileIdentitiesEndpoint(ProfileIdentities profiles) { this.profiles = profiles; }

    @GetMapping(value = ProfileIdentitiesProtocol.PROFILE_PATH, produces = "application/json")
    public ResponseEntity<?> profile(@RequestParam(required = false) String userId) {
        if (tooLong(userId)) return response(400, new Error("INVALID_REQUEST"));
        try {
            var value = profiles.findIdentityByUserId(userId);
            return value.isPresent() ? response(200, value.get()) : response(404, new Error("NOT_FOUND"));
        } catch (RuntimeException unavailable) {
            return response(503, new Error("PROFILE_IDENTITIES_UNAVAILABLE"));
        }
    }

    @GetMapping(value = ProfileIdentitiesProtocol.WORKSPACE_PATH, produces = "application/json")
    public ResponseEntity<?> workspace(@RequestParam(required = false) String groupId) {
        if (tooLong(groupId)) return response(400, new Error("INVALID_REQUEST"));
        try {
            return response(200, profiles.userIdsByWorkspace(groupId));
        } catch (RuntimeException unavailable) {
            return response(503, new Error("PROFILE_IDENTITIES_UNAVAILABLE"));
        }
    }

    @GetMapping(value = ProfileIdentitiesProtocol.FIRST_PROFILE_PATH, produces = "application/json")
    public ResponseEntity<?> firstProfile(@RequestParam(required = false) String userId) {
        if (tooLong(userId)) return response(400, new Error("INVALID_REQUEST"));
        try {
            var value = profiles.findFirstIdentityByUserId(userId);
            return value.isPresent() ? response(200, value.get()) : response(404, new Error("NOT_FOUND"));
        } catch (RuntimeException unavailable) {
            return response(503, new Error("PROFILE_IDENTITIES_UNAVAILABLE"));
        }
    }

    @GetMapping(value = ProfileIdentitiesProtocol.EXISTS_PATH, produces = "application/json")
    public ResponseEntity<?> exists(@RequestParam(required = false) String userId) {
        if (tooLong(userId)) return response(400, new Error("INVALID_REQUEST"));
        try {
            return response(200, profiles.existsNotDeleted(userId));
        } catch (RuntimeException unavailable) {
            return response(503, new Error("PROFILE_IDENTITIES_UNAVAILABLE"));
        }
    }

    private boolean tooLong(String value) { return value != null && value.length() > 512; }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
