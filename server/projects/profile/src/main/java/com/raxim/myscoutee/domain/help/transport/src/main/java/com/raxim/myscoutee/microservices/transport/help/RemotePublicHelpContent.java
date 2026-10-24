package com.raxim.myscoutee.microservices.transport.help;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.help.api.PublicHelpContent;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Public read only; the existing transport preserves REAL/DEMO and bounds I/O. */
public final class RemotePublicHelpContent extends RemoteReadTransport implements PublicHelpContent {
    private final ObjectMapper mapper;
    public RemotePublicHelpContent(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public HelpCenterStateDto activeState(String documentType, String lang, String acceptLanguage,
            String contextKey, String baseGroupId) {
        var query = new PublicHelpContentProtocol.Query(documentType, lang, acceptLanguage, contextKey, baseGroupId);
        if (!PublicHelpContentProtocol.valid(query)) throw new IllegalArgumentException("Invalid help content query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > PublicHelpContentProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Help content query exceeds limit");
        try {
            return exchange(PublicHelpContentProtocol.PATH, bytes, new TypeReference<HelpCenterStateDto>() {},
                    "help.public-content", PublicHelpContentProtocol.MAX_RESPONSE_BYTES,
                    value -> value.revisions() != null && value.auditTrail() != null && value.availableLanguages() != null && value.guideFields() != null);
        } catch (RemoteReadException failure) {
            if ("OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }
}
