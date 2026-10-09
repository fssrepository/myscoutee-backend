package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.PartnerInvitationAdmission;

public final class PartnerInvitationAdmissionProtocol {
    public static final String CLAIM = "/_internal/v1/events/partner-invitation-admission/claim";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "events:partner-invitation-admission";
    private PartnerInvitationAdmissionProtocol() {}
    public static String[] paths() { return new String[]{CLAIM}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Claim(Scope scope, com.raxim.myscoutee.domain.integrations.dto.ParticipantInvitationDto invite, String eventRecordId, String actorUserId) {}
    public static boolean valid(Claim q) { return q!=null && scope(q.scope()) && q.invite()!=null && q.actorUserId()!=null && q.eventRecordId()!=null && text(q.actorUserId(),512) && text(q.eventRecordId(),512); }
}
