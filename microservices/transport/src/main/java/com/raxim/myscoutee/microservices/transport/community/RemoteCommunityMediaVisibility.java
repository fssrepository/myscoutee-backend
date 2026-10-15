package com.raxim.myscoutee.microservices.transport.community;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.community.api.CommunityMediaVisibility;
import com.raxim.myscoutee.domain.community.dto.AnnouncementMediaVisibilityDto;
import com.raxim.myscoutee.domain.community.dto.OfferingMediaVisibilityDto;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteCommunityMediaVisibility extends RemoteReadTransport implements CommunityMediaVisibility {
    private final ObjectMapper mapper;
    public RemoteCommunityMediaVisibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public List<String> referencedDocuments(List<String> urls) {
        return exchange(CommunityMediaVisibilityProtocol.DOCUMENTS_PATH, MediaReferenceQueries.encode(urls, mapper),
                new TypeReference<List<String>>() {}, "community.media.documents", CommunityMediaVisibilityProtocol.MAX_DOCUMENT_RESPONSE_BYTES,
                value -> value != null && value.size() <= urls.size() && urls.containsAll(value));
    }
    @Override public AnnouncementMediaVisibilityDto announcement(List<String> urls) {
        return read(CommunityMediaVisibilityProtocol.ANNOUNCEMENT_PATH, urls, new TypeReference<AnnouncementMediaVisibilityDto>() {}, "community.media.announcement");
    }
    @Override public OfferingMediaVisibilityDto offering(List<String> urls) {
        return read(CommunityMediaVisibilityProtocol.OFFERING_PATH, urls, new TypeReference<OfferingMediaVisibilityDto>() {}, "community.media.offering");
    }
    private <T> T read(String path, List<String> urls, TypeReference<T> type, String operation) {
        byte[] body = MediaReferenceQueries.encode(urls, mapper);
        try {
            return exchange(path, body, type, operation, CommunityMediaVisibilityProtocol.MAX_RESPONSE_BYTES, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}
