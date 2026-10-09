package com.raxim.myscoutee.microservices.transport.email;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.email.api.EmailPrivacy;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** The existing account purge job owns retries and stage ordering; transport never retries. */
public final class RemoteEmailPrivacy extends RemoteReadTransport implements EmailPrivacy {
    private final ObjectMapper mapper;
    public RemoteEmailPrivacy(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void purgeDeliveryData(String userId) {
        var command = new EmailPrivacyProtocol.UserCommand(EmailPrivacyProtocol.Scope.current(), userId);
        send(EmailPrivacyProtocol.PURGE_DELIVERY_DATA, command, EmailPrivacyProtocol.valid(command));
    }
    @Override public void anonymizeAuthors(String userId) {
        var command = new EmailPrivacyProtocol.UserCommand(EmailPrivacyProtocol.Scope.current(), userId);
        send(EmailPrivacyProtocol.ANONYMIZE_AUTHORS, command, EmailPrivacyProtocol.valid(command));
    }
    private void send(String path, Object command, boolean valid) {
        exchange(path, encode(command, valid), new TypeReference<EmailPrivacyProtocol.Receipt>() {},
                "email-privacy.command", EmailPrivacyProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    private byte[] encode(Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid purge command");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EmailPrivacyProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Purge command exceeds byte limit");
        return bytes;
    }
}
