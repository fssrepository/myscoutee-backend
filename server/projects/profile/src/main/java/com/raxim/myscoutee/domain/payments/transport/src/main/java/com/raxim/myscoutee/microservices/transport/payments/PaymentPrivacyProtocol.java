package com.raxim.myscoutee.microservices.transport.payments;

import java.util.*;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

public final class PaymentPrivacyProtocol {
    public static final String PURGE_PAYER_RECORDS = "/_internal/v1/payments/payment-privacy/purge-payer-records";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private PaymentPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_PAYER_RECORDS}; }
    private static boolean id(String value) { return ProtocolFields.requiredId(value); }
    private static boolean scope(ProtocolFields.JobScope value) {
        return value != null && ProtocolFields.jobScope(value.active(), value.groupId());
    }
    public static boolean valid(ProtocolFields.UserCommand value) { return ProtocolFields.validUserCommand(value); }
}
