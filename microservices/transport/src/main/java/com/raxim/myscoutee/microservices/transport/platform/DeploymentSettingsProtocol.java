package com.raxim.myscoutee.microservices.transport.platform;

import com.raxim.myscoutee.domain.platform.api.DeploymentSettings;
import com.raxim.myscoutee.domain.platform.dto.EncryptedSecret;

public final class DeploymentSettingsProtocol {
    public static final String FIND = "/_internal/v1/platform/deployment-settings/find";
    public static final int MAX_REQUEST_BYTES = 1024 * 1024, MAX_RESPONSE_BYTES = 1024 * 1024;
    private DeploymentSettingsProtocol() {}
    public static String[] paths() { return new String[]{FIND}; }
    public record Error(String code) {}
    public record Query(String id) {}
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.platform.dto.DeploymentSettingsDto value) {}
    public static boolean valid(Query value) { return value != null && value.id() != null && !value.id().isBlank() && SecretEnvelopeBounds.text(value.id(), 512); }
}
