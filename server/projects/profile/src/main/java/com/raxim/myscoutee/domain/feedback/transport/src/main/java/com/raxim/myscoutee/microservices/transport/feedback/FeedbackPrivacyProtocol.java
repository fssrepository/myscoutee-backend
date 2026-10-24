package com.raxim.myscoutee.microservices.transport.feedback;

import java.util.*;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

public final class FeedbackPrivacyProtocol {
    public static final String PURGE_FEEDBACK = "/_internal/v1/feedback/feedback-privacy/purge-feedback";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private FeedbackPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_FEEDBACK}; }
    private static boolean id(String value) { return ProtocolFields.requiredId(value); }
    private static boolean scope(ProtocolFields.JobScope value) {
        return value != null && ProtocolFields.jobScope(value.active(), value.groupId());
    }
    public static boolean valid(ProtocolFields.UserCommand value) { return ProtocolFields.validUserCommand(value); }
}
