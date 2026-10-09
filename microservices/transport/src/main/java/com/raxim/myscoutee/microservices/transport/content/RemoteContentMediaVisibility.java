package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.content.api.ContentMediaVisibility;
import com.raxim.myscoutee.domain.content.dto.FeedPostMediaVisibilityDto;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteContentMediaVisibility extends RemoteReadTransport implements ContentMediaVisibility {
    private final ObjectMapper mapper;
    public RemoteContentMediaVisibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public FeedPostMediaVisibilityDto feedPost(List<String> urls) {
        byte[] body = MediaReferenceQueries.encode(urls, mapper);
        try {
            return exchange(ContentMediaVisibilityProtocol.PATH, body, new TypeReference<FeedPostMediaVisibilityDto>() {},
                    "content.media-visibility", ContentMediaVisibilityProtocol.MAX_RESPONSE_BYTES, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}
