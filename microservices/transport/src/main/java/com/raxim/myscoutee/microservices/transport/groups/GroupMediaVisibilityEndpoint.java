package com.raxim.myscoutee.microservices.transport.groups;

import com.raxim.myscoutee.domain.groups.api.GroupMediaVisibility;
import com.raxim.myscoutee.microservices.transport.groups.GroupMediaVisibilityProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GroupMediaVisibilityEndpoint {
    private final GroupMediaVisibility groups;
    public GroupMediaVisibilityEndpoint(GroupMediaVisibility groups) { this.groups = groups; }
    @GetMapping(value = GroupMediaVisibilityProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> group(@RequestParam(required=false) String id) {
        if (id == null || id.isBlank() || id.length() > 512)
            return response(400, new Error("INVALID_REQUEST"));
        try {
            var result = groups.group(id);
            return result == null ? response(404, new Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) {
            return response(503, new Error("GROUP_VISIBILITY_UNAVAILABLE"));
        }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
