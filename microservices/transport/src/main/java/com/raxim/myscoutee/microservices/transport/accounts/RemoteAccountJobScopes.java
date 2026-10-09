package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.accounts.api.AccountJobScopes;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** One bounded batch; canonical selection stays with the owner. */
public final class RemoteAccountJobScopes extends RemoteReadTransport implements AccountJobScopes {
    private final ObjectMapper mapper;
    public RemoteAccountJobScopes(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Set<String> matchingOwners(java.util.Collection<String> ids, com.raxim.myscoutee.domain.platform.api.JobAudience.WorkspaceScope scope) {
        var query = new AccountJobScopesProtocol.Query(ids, scope);
        if (!AccountJobScopesProtocol.valid(query)) throw new IllegalArgumentException("Invalid account-job-scopes request");
        byte[] body = mapper.writeValueAsBytes(query);
        if (body.length > AccountJobScopesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
        return exchange(AccountJobScopesProtocol.PATH, body, new TypeReference<java.util.Set<String>>() {},
                "account-job-scopes.read", 2097152, result -> query.ids().containsAll(result) && result.stream().allMatch(item -> item != null && item.length() <= 512));
    }
}
