package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.affinity.api.ConfigurationCatalog;
import com.raxim.myscoutee.domain.affinity.dto.ConfigurationSettingsDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteConfigurationCatalog extends RemoteReadTransport implements ConfigurationCatalog {
    public RemoteConfigurationCatalog(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public ConfigurationSettingsDto active(String key) {
        return read(ConfigurationCatalogProtocol.ACTIVE, "key", key, "affinity.configuration-active");
    }
    @Override public ConfigurationSettingsDto find(String id) {
        return read(ConfigurationCatalogProtocol.FIND, "id", id, "affinity.configuration-entry");
    }
    private ConfigurationSettingsDto read(String path, String parameter, String id, String operation) {
        try {
            return exchange(queryPath(path, parameter, id), new TypeReference<ConfigurationSettingsDto>() {},
                    operation, ConfigurationCatalogProtocol.MAX_RESPONSE_BYTES, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}
