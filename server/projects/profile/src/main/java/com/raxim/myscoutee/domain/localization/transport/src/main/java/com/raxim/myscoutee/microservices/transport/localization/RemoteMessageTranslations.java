package com.raxim.myscoutee.microservices.transport.localization;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import com.raxim.myscoutee.domain.localization.api.MessageTranslations;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteMessageTranslations extends RemoteReadTransport implements MessageTranslations {
    public RemoteMessageTranslations(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public String t(String key) {
        if (key == null) throw new IllegalArgumentException("Message key required");
        try {
            return exchangeAuthorized(queryPath(MessageTranslationsProtocol.PATH, "key", key), null,
                    new TypeReference<MessageTranslationsProtocol.Result>() {}, "localization.message", 65536,
                    value -> value.text() != null, Map.of("Accept-Language", LocaleContextHolder.getLocale().toLanguageTag())).text();
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode()))
                throw new NoSuchMessageException(key, LocaleContextHolder.getLocale());
            throw failure;
        }
    }
}
