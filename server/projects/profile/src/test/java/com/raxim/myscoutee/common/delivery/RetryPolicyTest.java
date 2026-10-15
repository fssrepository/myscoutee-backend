package com.raxim.myscoutee.common.delivery;

import java.time.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@Tag("standard")
class RetryPolicyTest {
    @Test void boundedExponentialDelaysIncludeTheOriginalAttempt() {
        Instant now = Instant.parse("2026-10-15T12:00:00Z");
        assertEquals(now.plusSeconds(60), RetryPolicy.DEFAULT.nextAttempt(1, now));
        assertEquals(now.plusSeconds(120), RetryPolicy.DEFAULT.nextAttempt(2, now));
        assertNull(RetryPolicy.DEFAULT.nextAttempt(3, now));
        assertNull(RetryPolicy.DEFAULT.nextAttempt(99, now));
    }
    @Test void invalidPoliciesCannotCreateBusyLoopsOrOverflowingBackoff() {
        assertThrows(IllegalArgumentException.class, () -> new RetryPolicy(0, Duration.ofSeconds(1)));
        assertThrows(IllegalArgumentException.class, () -> new RetryPolicy(17, Duration.ofSeconds(1)));
        assertThrows(IllegalArgumentException.class, () -> new RetryPolicy(3, Duration.ZERO));
        assertThrows(IllegalArgumentException.class, () -> RetryPolicy.DEFAULT.nextAttempt(0, Instant.now()));
    }
}
