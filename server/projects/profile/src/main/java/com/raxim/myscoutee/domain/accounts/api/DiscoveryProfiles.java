package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/** Existing account queries restricted to discovery display and matching facts. */
public interface DiscoveryProfiles {
    Optional<? extends DiscoveryProfile> findByUserId(String id);
    List<? extends DiscoveryProfile> findByUserIdIn(Collection<String> ids);
    List<? extends DiscoveryProfile> findByWorkspaceGroupIdAndAccountUserIdIn(String groupId, Collection<String> accounts);
}
