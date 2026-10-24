package com.raxim.myscoutee.microservices.transport.assets;

import java.util.*;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

public final class AssetPrivacyProtocol {
    public static final String PURGE_REMAINING_ASSET_REQUESTS = "/_internal/v1/assets/asset-privacy/purge-remaining-asset-requests";
    public static final String PURGE_OWNED_MEDIA = "/_internal/v1/assets/asset-privacy/purge-owned-media";
    public static final String DELETE_OWNED_RECORDS = "/_internal/v1/assets/asset-privacy/delete-owned-records";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AssetPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_REMAINING_ASSET_REQUESTS, PURGE_OWNED_MEDIA, DELETE_OWNED_RECORDS}; }


    public static boolean valid(ProtocolFields.UserCommand value) { return ProtocolFields.validUserCommand(value); }

    public static boolean valid(ProtocolFields.IdsCommand value) { return ProtocolFields.validIdsCommand(value); }
}
