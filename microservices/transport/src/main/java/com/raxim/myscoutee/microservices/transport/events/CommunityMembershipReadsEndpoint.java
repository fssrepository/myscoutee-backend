package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Supplier;
import com.raxim.myscoutee.domain.events.api.CommunityMembershipReads;
import com.raxim.myscoutee.microservices.transport.events.CommunityMembershipReadsProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class CommunityMembershipReadsEndpoint {
    private final CommunityMembershipReads members;
    public CommunityMembershipReadsEndpoint(CommunityMembershipReads members) { this.members=members; }
    @GetMapping(value=CommunityMembershipReadsProtocol.GROUP,produces="application/json")
    public ResponseEntity<?> group(@RequestParam(required=false) String groupId) {
        return read(()->members.forGroup(groupId),groupId,null);
    }
    @GetMapping(value=CommunityMembershipReadsProtocol.MEMBER,produces="application/json")
    public ResponseEntity<?> member(@RequestParam(required=false) String groupId,@RequestParam(required=false) String accountId) {
        return read(()->members.member(groupId,accountId).orElse(null),groupId,accountId);
    }
    private ResponseEntity<?> read(Supplier<?> action,String groupId,String accountId) {
        if (!CommunityMembershipReadsProtocol.validId(groupId)||!CommunityMembershipReadsProtocol.validId(accountId)) return response(400,new Error("INVALID_REQUEST"));
        try {
            var value=action.get();
            return value==null?response(404,new Error("NOT_FOUND")):response(200,value);
        } catch (RuntimeException unavailable) { return response(503,new Error("COMMUNITY_MEMBERSHIPS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status,Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
