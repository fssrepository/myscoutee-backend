package com.raxim.myscoutee.microservices.transport.platform;

import com.raxim.myscoutee.domain.platform.api.DeploymentSettings;
import com.raxim.myscoutee.domain.platform.dto.EncryptedSecret;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Purpose-scoped owner operation; no master key, arbitrary-purpose method or automatic retry. */
public final class RemoteDeploymentSettings extends RemoteReadTransport implements DeploymentSettings {
    private final ObjectMapper mapper;
    public RemoteDeploymentSettings(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Optional<com.raxim.myscoutee.domain.platform.dto.DeploymentSettingsDto> findById(String id) {
        var command = new DeploymentSettingsProtocol.Query(id);
        if (!DeploymentSettingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid deployment-settings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > DeploymentSettingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("deployment-settings request exceeds byte limit");
        var result = exchange(DeploymentSettingsProtocol.FIND, bytes, new TypeReference<DeploymentSettingsProtocol.Result>() {},
                "deployment-settings.find", DeploymentSettingsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return java.util.Optional.ofNullable(result.value());
    }
}
