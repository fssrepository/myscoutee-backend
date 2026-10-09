package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/** Existing account selection for email; device credentials and unrelated profile data stay with accounts. */
public interface EmailProfiles {
    Optional<? extends EmailProfile> findByUserId(String userId);
    List<? extends EmailProfile> findByUserIdIn(Collection<String> userIds);
    List<? extends EmailProfile> findAll();
}
