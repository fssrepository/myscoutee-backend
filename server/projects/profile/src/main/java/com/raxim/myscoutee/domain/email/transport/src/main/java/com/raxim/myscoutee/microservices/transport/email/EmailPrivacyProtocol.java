package com.raxim.myscoutee.microservices.transport.email;

import java.util.*;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

public final class EmailPrivacyProtocol {
    public static final String PURGE_DELIVERY_DATA = "/_internal/v1/email/email-privacy/purge-delivery-data";
    public static final String ANONYMIZE_AUTHORS = "/_internal/v1/email/email-privacy/anonymize-authors";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private EmailPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_DELIVERY_DATA, ANONYMIZE_AUTHORS}; }
    private static boolean id(String value) { return ProtocolFields.requiredId(value); }
    private static boolean scope(ProtocolFields.JobScope value) {
        return value != null && ProtocolFields.jobScope(value.active(), value.groupId());
    }
    public static boolean valid(ProtocolFields.UserCommand value) { return ProtocolFields.validUserCommand(value); }
}
