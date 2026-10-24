package com.raxim.myscoutee.microservices.transport.platform;

import java.util.function.Supplier;
import com.raxim.myscoutee.domain.platform.api.JobAudience;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.platform.dto.JobAudienceGroupDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class JobAudienceEndpoint {
    private final JobAudience owner;
    private final ObjectMapper mapper;
    public JobAudienceEndpoint(JobAudience owner, ObjectMapper mapper) { this.owner=owner; this.mapper=mapper; }
    @PostMapping(value=JobAudienceProtocol.SCOPE, produces="application/json")
    public ResponseEntity<?> scope(HttpServletRequest request) throws java.io.IOException {
        try {
            var query=read(request,JobAudienceProtocol.ScopeQuery.class);
            return scoped(query.context(),()-> {
                var scope=owner.workspaceScope();
                return new JobAudienceProtocol.ScopeResult(scope.ids(),scope.included());
            });
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(),new JobAudienceProtocol.Error(invalid.code())); }
    }
    @PostMapping(value=JobAudienceProtocol.USER, produces="application/json")
    public ResponseEntity<?> user(HttpServletRequest request) throws java.io.IOException {
        try {
            var query=read(request,JobAudienceProtocol.UserQuery.class);
            if(!JobAudienceProtocol.bounded(query.userId()))throw invalid();
            return scoped(query.context(),()->new JobAudienceProtocol.Group(true,owner.forUser(query.userId())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(),new JobAudienceProtocol.Error(invalid.code())); }
    }
    @PostMapping(value=JobAudienceProtocol.TARGET, produces="application/json")
    public ResponseEntity<?> target(HttpServletRequest request) throws java.io.IOException {
        try {
            var query=read(request,JobAudienceProtocol.TargetQuery.class);
            if(!JobAudienceProtocol.bounded(query.type()) || !JobAudienceProtocol.bounded(query.id()))throw invalid();
            return scoped(query.context(),()->new JobAudienceProtocol.Group(true,owner.forTarget(query.type(),query.id())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(),new JobAudienceProtocol.Error(invalid.code())); }
    }
    @PostMapping(value=JobAudienceProtocol.USERS, produces="application/json")
    public ResponseEntity<?> users(HttpServletRequest request) throws java.io.IOException {
        try {
            var query=read(request,JobAudienceProtocol.UsersQuery.class);
            if(!JobAudienceProtocol.valid(query.userIds()))throw invalid();
            return scoped(query.context(),()->owner.usersByGroup(query.userIds()).entrySet().stream()
                    .map(entry->new JobAudienceGroupDto(entry.getKey(),entry.getValue())).toList());
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(),new JobAudienceProtocol.Error(invalid.code())); }
    }
    private ResponseEntity<?> scoped(JobAudienceProtocol.Context context,Supplier<?> query) {
        if(!JobAudienceProtocol.valid(context))return response(400,new JobAudienceProtocol.Error("INVALID_REQUEST"));
        try {
            return JobGroupContext.call(context.active(),context.groupId(),()->response(200,query.get()));
        } catch(RuntimeException failed) {return response(503,new JobAudienceProtocol.Error("AUDIENCE_UNAVAILABLE"));}
    }
    private <T> T read(HttpServletRequest request,Class<T> type) throws java.io.IOException {
        var bytes=ReadQueryBodies.readBytes(request,JobAudienceProtocol.MAX_REQUEST_BYTES);
        try {
            T value=mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                    .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            if(value==null)throw invalid();return value;
        } catch(RuntimeException invalid){throw invalid();}
    }
    private static ReadQueryBodies.RejectedQuery invalid(){return new ReadQueryBodies.RejectedQuery(400,"INVALID_REQUEST");}
    private ResponseEntity<?> response(int status,Object body){return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);}
}
