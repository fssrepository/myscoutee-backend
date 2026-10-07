package com.raxim.myscoutee.domain.accounts.api;

import java.time.Instant;
public interface AccountInactivity {
    Outcome inactivate(String userId, int inactiveDays, Instant now);
    record Outcome(String status, int count, String detail, WorkspaceProfile profile, Instant nextDueAt) {}
}
