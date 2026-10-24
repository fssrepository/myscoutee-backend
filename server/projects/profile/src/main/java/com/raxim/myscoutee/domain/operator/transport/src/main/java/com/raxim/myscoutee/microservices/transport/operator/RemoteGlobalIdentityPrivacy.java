package com.raxim.myscoutee.microservices.transport.operator;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.operator.api.GlobalIdentityPrivacy;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** The existing account purge job owns retries and stage ordering; transport never retries. */
public final class RemoteGlobalIdentityPrivacy extends RemoteReadTransport implements GlobalIdentityPrivacy {
    private final ObjectMapper mapper;
    public RemoteGlobalIdentityPrivacy(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void preparePurgeUnlink(String userId) {
        if (userId == null || userId.isBlank()) return;
        var command = new ProtocolFields.UserCommand(ProtocolFields.JobScope.current(), userId);
        send(GlobalIdentityPrivacyProtocol.PREPARE_PURGE_UNLINK, command, GlobalIdentityPrivacyProtocol.valid(command));
    }
    private void send(String path, Object command, boolean valid) {
        exchange(path, encode(command, valid), new TypeReference<ProtocolFields.Receipt>() {},
                "global-identity-privacy.command", GlobalIdentityPrivacyProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    private byte[] encode(Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid purge command");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > GlobalIdentityPrivacyProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Purge command exceeds byte limit");
        return bytes;
    }
}
