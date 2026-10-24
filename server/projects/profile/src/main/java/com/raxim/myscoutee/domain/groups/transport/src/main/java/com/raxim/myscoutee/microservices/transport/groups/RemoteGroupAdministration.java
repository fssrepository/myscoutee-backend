package com.raxim.myscoutee.microservices.transport.groups;

import java.net.URI;
import java.time.Duration;
import java.util.Set;
import com.raxim.myscoutee.domain.groups.api.GroupAdministration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteGroupAdministration extends RemoteReadTransport implements GroupAdministration {
    public RemoteGroupAdministration(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public Set<String> managedGroups(String accountId) {
        return exchange(queryPath(GroupAdministrationProtocol.PATH, "accountId", accountId), new TypeReference<Set<String>>() {},
                "groups.managed", GroupAdministrationProtocol.MAX_RESPONSE_BYTES, value -> value.stream().allMatch(java.util.Objects::nonNull));
    }
}
