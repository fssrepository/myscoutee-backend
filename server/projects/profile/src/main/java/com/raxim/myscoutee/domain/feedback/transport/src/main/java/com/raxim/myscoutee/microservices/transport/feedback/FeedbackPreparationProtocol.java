package com.raxim.myscoutee.microservices.transport.feedback;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.feedback.api.FeedbackPreparation;

public final class FeedbackPreparationProtocol {
    public static final String PREPARE = "/_internal/v1/feedback/feedback-preparation/prepare";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private FeedbackPreparationProtocol() {}
    public static String[] paths() { return new String[]{PREPARE}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record Command(Scope scope, String snapshot) {}
    public record Result(Integer count) {}
    public static boolean valid(Command value) { return value != null && scope(value.scope()) && value.snapshot() != null && !value.snapshot().isBlank() && text(value.snapshot(), 1024 * 1024); }
}
