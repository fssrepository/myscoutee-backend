package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.events.api.CommunityMembershipReads;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteCommunityMembershipReads extends RemoteReadTransport implements CommunityMembershipReads {
    public RemoteCommunityMembershipReads(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);
    }
    @Override public List<CommunityMember> forGroup(String id) {
        return exchange(queryPath(CommunityMembershipReadsProtocol.GROUP,"groupId",id),new TypeReference<List<CommunityMember>>() {},
                "events.community-members",CommunityMembershipReadsProtocol.MAX_RESPONSE_BYTES,value->value.stream().allMatch(java.util.Objects::nonNull));
    }
    @Override public Optional<CommunityMember> member(String groupId,String accountId) {
        try {
            return Optional.of(exchange(queryPath(CommunityMembershipReadsProtocol.MEMBER,"groupId",groupId,"accountId",accountId),new TypeReference<CommunityMember>() {},
                    "events.community-member",CommunityMembershipReadsProtocol.MAX_RESPONSE_BYTES,value->true));
        } catch (RemoteReadException failure) {
            if (failure.status()==404 && "NOT_FOUND".equals(failure.remoteCode())) return Optional.empty();
            throw failure;
        }
    }
}
