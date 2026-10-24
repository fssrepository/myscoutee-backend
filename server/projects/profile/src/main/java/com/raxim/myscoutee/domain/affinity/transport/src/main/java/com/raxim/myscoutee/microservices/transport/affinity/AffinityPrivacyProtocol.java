package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.*;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

public final class AffinityPrivacyProtocol {
    public static final String PURGE_RATINGS = "/_internal/v1/affinity/affinity-privacy/purge-ratings";
    public static final String PURGE_EDGES = "/_internal/v1/affinity/affinity-privacy/purge-edges";
    public static final String PURGE_TASKS = "/_internal/v1/affinity/affinity-privacy/purge-tasks";
    public static final String ANONYMIZE_AUTHORS = "/_internal/v1/affinity/affinity-privacy/anonymize-authors";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private AffinityPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_RATINGS, PURGE_EDGES, PURGE_TASKS, ANONYMIZE_AUTHORS}; }
    private static boolean id(String value) { return ProtocolFields.requiredId(value); }
    private static boolean scope(ProtocolFields.JobScope value) {
        return value != null && ProtocolFields.jobScope(value.active(), value.groupId());
    }
    public static boolean valid(ProtocolFields.UserCommand value) { return ProtocolFields.validUserCommand(value); }
}
