package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/** Existing account directory queries restricted to stored scoring inputs. */
public interface ScoringProfiles {
    Optional<? extends ScoringProfile> findByUserId(String userId);
    List<? extends ScoringProfile> findByUserIdIn(Collection<String> userIds);
}
