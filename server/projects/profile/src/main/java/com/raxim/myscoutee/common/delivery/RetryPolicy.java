package com.raxim.myscoutee.common.delivery;

import java.time.Duration;
import java.time.Instant;

/** Attempts include the original call. Scheduling never resets a durable attempt count. */
public record RetryPolicy(int maxAttempts, Duration initialDelay) {
    public static final RetryPolicy DEFAULT = new RetryPolicy(3, Duration.ofMinutes(1));
    public RetryPolicy {
        if (maxAttempts < 1 || maxAttempts > 16 || initialDelay == null || initialDelay.isNegative() || initialDelay.isZero())
            throw new IllegalArgumentException("Invalid retry policy");
    }
    public Instant nextAttempt(int completedAttempts, Instant now) {
        if (completedAttempts < 1) throw new IllegalArgumentException("Original attempt must be counted");
        return completedAttempts >= maxAttempts ? null : now.plus(initialDelay.multipliedBy(1L << (completedAttempts - 1)));
    }
}
