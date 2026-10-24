package com.raxim.myscoutee.microservices.transport.payments;

import java.time.Instant;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class ExchangeRateRefreshProtocol {
    public static final String RUN = "/_internal/v1/payments/exchange-rate-refresh/run";
    public static final int MAX_REQUEST_BYTES = 16384, MAX_RESPONSE_BYTES = 16384;
    private ExchangeRateRefreshProtocol() {}
    public static String[] paths() { return new String[]{RUN}; }
    public record Command(Boolean active, String groupId, String actor, Instant startedAt) {
        public static Command current(String actor, Instant startedAt) {
            return new Command(JobGroupContext.isActive(), JobGroupContext.groupId(), actor, startedAt);
        }
    }
    /** Worker returned; actual completed/failed/skipped status remains in the native job registry. */
    public record Receipt(Boolean returned) {}
    public record Error(String code) {}
    public static boolean valid(Command command) {
        return command != null && command.active() != null && (command.groupId() == null || command.groupId().length() <= 512)
                && (command.active() || command.groupId() == null) && command.actor() != null
                && !command.actor().isBlank() && command.actor().length() <= 512 && command.startedAt() != null;
    }
}
