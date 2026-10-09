package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.AccountInactivity;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Existing native worker operations, single attempt only; workflow acknowledgment recovery is separate. */
public final class RemoteAccountInactivity extends RemoteReadTransport implements AccountInactivity {
    private final ObjectMapper mapper;
    public RemoteAccountInactivity(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Outcome inactivate(String userId, int inactiveDays, java.time.Instant now) {
        var command = new AccountInactivityProtocol.Inactivate(AccountInactivityProtocol.Scope.current(), userId, inactiveDays, now);
        if (!AccountInactivityProtocol.valid(command)) throw new IllegalArgumentException("Invalid account-inactivity request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AccountInactivityProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("account-inactivity request exceeds byte limit");
        var result = exchange(AccountInactivityProtocol.INACTIVATE, bytes, new TypeReference<AccountInactivityProtocol.Result>() {},
                "account-inactivity.inactivate", AccountInactivityProtocol.MAX_RESPONSE_BYTES, value -> value.count() != null && value.count() >= 0 && value.count() <= 1 && value.status() != null
                        && java.util.Set.of("skipped", "scheduled", "completed").contains(value.status()));
        return result.outcome();
    }
}
