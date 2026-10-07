package com.raxim.myscoutee.domain.accounts.api;
import java.util.Collection;
public interface FollowingEvents { void refreshForViewers(Collection<String> ids); java.util.List<String> organizerIds(WorkspaceProfile profile);
    boolean eligibleEvent(com.raxim.myscoutee.domain.events.api.EventOwnership.Event event, String viewer, java.util.Set<String> friends, java.time.Instant now); }
