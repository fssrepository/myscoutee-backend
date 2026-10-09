package com.raxim.myscoutee.microservices.transport.platform;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobAudience;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.platform.dto.JobAudienceGroupDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteJobAudience extends RemoteReadTransport implements JobAudience {
    private final ObjectMapper mapper;
    public RemoteJobAudience(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);this.mapper=mapper;
    }
    private JobAudienceProtocol.Context context() {
        return new JobAudienceProtocol.Context(JobGroupContext.isActive(),JobGroupContext.groupId());
    }
    private byte[] bytes(Object query) {
        var body=mapper.writeValueAsBytes(query);
        if(body.length>JobAudienceProtocol.MAX_REQUEST_BYTES)throw new IllegalArgumentException("Job audience query exceeds limit");
        return body;
    }
    @Override public WorkspaceScope workspaceScope() {
        // The canonical implementation memoizes workspace ownership once per job.
        // Keep that boundary across HTTP so filtering N rows does not make N calls.
        return JobGroupContext.memo("remote.platform.workspaceScope." + com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode(),()-> {
            var scope = exchange(JobAudienceProtocol.SCOPE,
                bytes(new JobAudienceProtocol.ScopeQuery(context())),new TypeReference<JobAudienceProtocol.ScopeResult>() {},
                "platform.job-workspaces",JobAudienceProtocol.MAX_RESPONSE_BYTES,
                value->value.included()!=null && value.ids()!=null && value.ids().stream().allMatch(Objects::nonNull));
            return new WorkspaceScope(Set.copyOf(scope.ids()), scope.included());
        });
    }
    @Override public String forUser(String userId) {
        if(!JobAudienceProtocol.bounded(userId))throw new IllegalArgumentException("User identifier exceeds limit");
        return exchange(JobAudienceProtocol.USER,bytes(new JobAudienceProtocol.UserQuery(context(),userId)),
                new TypeReference<JobAudienceProtocol.Group>() {},"platform.job-user",4096,
                value->Boolean.TRUE.equals(value.resolved()) && JobAudienceProtocol.bounded(value.groupId())).groupId();
    }
    @Override public String forTarget(String type,String id) {
        if(!JobAudienceProtocol.bounded(type) || !JobAudienceProtocol.bounded(id))throw new IllegalArgumentException("Job target exceeds limit");
        return exchange(JobAudienceProtocol.TARGET,bytes(new JobAudienceProtocol.TargetQuery(context(),type,id)),
                new TypeReference<JobAudienceProtocol.Group>() {},"platform.job-target",4096,
                value->Boolean.TRUE.equals(value.resolved()) && JobAudienceProtocol.bounded(value.groupId())).groupId();
    }
    @Override public Map<String,List<String>> usersByGroup(Collection<String> ids) {
        if(!JobAudienceProtocol.valid(ids))throw new IllegalArgumentException("User batch exceeds limit");
        var buckets=exchange(JobAudienceProtocol.USERS,bytes(new JobAudienceProtocol.UsersQuery(context(),ids)),
                new TypeReference<List<JobAudienceGroupDto>>() {},"platform.job-users",JobAudienceProtocol.MAX_RESPONSE_BYTES,
                value->value.stream().allMatch(bucket->bucket!=null && bucket.userIds()!=null));
        var result=new LinkedHashMap<String,List<String>>();
        for(var bucket:buckets) {
            if(result.putIfAbsent(bucket.groupId(),bucket.userIds())!=null)throw new RemoteReadException("INVALID_RESPONSE",200);
        }
        return result;
    }
}
