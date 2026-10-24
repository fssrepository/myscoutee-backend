package com.raxim.myscoutee.microservices.transport.integrations;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.integrations.api.ParticipantStatistics;

public final class ParticipantStatisticsProtocol {
    public static final String SUMMARY = "/_internal/v1/integrations/participant-statistics/summary";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private ParticipantStatisticsProtocol() {}
    public static String[] paths() { return new String[]{SUMMARY}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Query(Scope scope, String owner) {}
    public static boolean valid(Query value) { return value != null && scope(value.scope()) && value.owner() != null && !value.owner().isBlank() && text(value.owner(), 512); }
}
