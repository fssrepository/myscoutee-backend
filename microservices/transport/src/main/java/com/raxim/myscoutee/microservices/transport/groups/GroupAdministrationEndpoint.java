package com.raxim.myscoutee.microservices.transport.groups;

import com.raxim.myscoutee.domain.groups.api.GroupAdministration;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class GroupAdministrationEndpoint {
    private final GroupAdministration owner;
    public GroupAdministrationEndpoint(GroupAdministration owner) { this.owner = owner; }
    @GetMapping(value = GroupAdministrationProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> managed(@RequestParam(required = false) String accountId) {
        if (accountId != null && accountId.length() > 512) return response(400, new GroupAdministrationProtocol.Error("INVALID_REQUEST"));
        try {
            return response(200, owner.managedGroups(accountId));
        } catch (RuntimeException unavailable) { return response(503, new GroupAdministrationProtocol.Error("GROUP_ADMINISTRATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
