package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;
import com.raxim.myscoutee.domain.payments.dto.PaymentFulfillmentDto;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class EventCheckoutProtocol {
    public static final String PAY = "/_internal/v1/events/event-checkout/pay";
    public static final String FINALIZE = "/_internal/v1/events/event-checkout/finalize";
    public static final String AUDIENCE = "events:event-checkout";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 1024 * 1024;
    private EventCheckoutProtocol() {}
    public static String[] paths() { return new String[]{PAY, FINALIZE}; }
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(JobGroupContext.isActive(), JobGroupContext.groupId()); }
    }
    public record Pay(Scope scope, EventCheckoutStateChangeRequestDto request, String provider) {}
    public record Finalize(Scope scope, PaymentFulfillmentDto payment) {}
    public record Result(Boolean resolved, EventParticipationActionResultDto value) {}
    public record Error(String code) {}
    private static boolean scope(Scope value) { return value != null && value.active() != null
            && (value.groupId() == null || value.groupId().length() <= 512) && (value.active() || value.groupId() == null); }
    public static boolean valid(Pay command) { return command != null && scope(command.scope())
            && command.request() != null && command.request().userId() != null
            && (command.provider() == null || command.provider().length() <= 512); }
    public static boolean valid(Finalize command) { return command != null && scope(command.scope()); }
}
