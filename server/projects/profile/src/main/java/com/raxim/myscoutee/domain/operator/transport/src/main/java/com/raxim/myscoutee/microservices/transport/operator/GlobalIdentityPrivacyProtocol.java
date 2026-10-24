package com.raxim.myscoutee.microservices.transport.operator;

import java.util.*;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

public final class GlobalIdentityPrivacyProtocol {
    public static final String PREPARE_PURGE_UNLINK = "/_internal/v1/operator/global-identity-privacy/prepare-purge-unlink";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private GlobalIdentityPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PREPARE_PURGE_UNLINK}; }
    private static boolean id(String value) { return ProtocolFields.requiredId(value); }
    private static boolean scope(ProtocolFields.JobScope value) {
        return value != null && ProtocolFields.jobScope(value.active(), value.groupId());
    }
    public static boolean valid(ProtocolFields.UserCommand value) { return ProtocolFields.validUserCommand(value); }
}
