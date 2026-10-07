package com.raxim.myscoutee.domain.accounts.api;
import java.util.Collection;
public interface EventCounterUpdates {
    record Change(WorkspaceProfile profile, int invitations, int events, int hosting) {}
    int replaceExpired(Collection<Change> changes);
}
