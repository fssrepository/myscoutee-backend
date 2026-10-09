package com.raxim.myscoutee.microservices.transport.content;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.content.api.ContentPrivacy;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** The existing account purge job owns retries and stage ordering; transport never retries. */
public final class RemoteContentPrivacy extends RemoteReadTransport implements ContentPrivacy {
    private final ObjectMapper mapper;
    public RemoteContentPrivacy(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void purgeIdeaPosts(String userId) {
        var command = new ContentPrivacyProtocol.UserCommand(ContentPrivacyProtocol.Scope.current(), userId);
        send(ContentPrivacyProtocol.PURGE_IDEA_POSTS, command, ContentPrivacyProtocol.valid(command));
    }
    @Override public void purgeFeedback(String userId) {
        var command = new ContentPrivacyProtocol.UserCommand(ContentPrivacyProtocol.Scope.current(), userId);
        send(ContentPrivacyProtocol.PURGE_FEEDBACK, command, ContentPrivacyProtocol.valid(command));
    }
    @Override public void purgeReports(String userId) {
        var command = new ContentPrivacyProtocol.UserCommand(ContentPrivacyProtocol.Scope.current(), userId);
        send(ContentPrivacyProtocol.PURGE_REPORTS, command, ContentPrivacyProtocol.valid(command));
    }
    @Override public void purgeFeedViews(String userId) {
        var command = new ContentPrivacyProtocol.UserCommand(ContentPrivacyProtocol.Scope.current(), userId);
        send(ContentPrivacyProtocol.PURGE_FEED_VIEWS, command, ContentPrivacyProtocol.valid(command));
    }
    @Override public void purgeShareTokens(String userId) {
        var command = new ContentPrivacyProtocol.UserCommand(ContentPrivacyProtocol.Scope.current(), userId);
        send(ContentPrivacyProtocol.PURGE_SHARE_TOKENS, command, ContentPrivacyProtocol.valid(command));
    }
    private void send(String path, Object command, boolean valid) {
        exchange(path, encode(command, valid), new TypeReference<ContentPrivacyProtocol.Receipt>() {},
                "content-privacy.command", ContentPrivacyProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    private byte[] encode(Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid purge command");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ContentPrivacyProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Purge command exceeds byte limit");
        return bytes;
    }
}
