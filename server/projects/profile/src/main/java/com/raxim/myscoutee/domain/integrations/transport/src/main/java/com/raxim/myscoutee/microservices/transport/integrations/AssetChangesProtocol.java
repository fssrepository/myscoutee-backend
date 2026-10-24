package com.raxim.myscoutee.microservices.transport.integrations;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields.JobScope;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.integrations.api.AssetChanges;

public final class AssetChangesProtocol {
    public static final String ENQUEUE = "/_internal/v1/integrations/asset-changes/enqueue";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AssetChangesProtocol() {}
    public static String[] paths() { return new String[]{ENQUEUE}; }
    private static boolean scope(JobScope value) { return ProtocolFields.boundedJobScope(value); }
    public record Change(JobScope scope, com.raxim.myscoutee.domain.assets.dto.AssetChangeDto asset) {}
    public static boolean valid(Change value) { return value != null && scope(value.scope()); }
}
