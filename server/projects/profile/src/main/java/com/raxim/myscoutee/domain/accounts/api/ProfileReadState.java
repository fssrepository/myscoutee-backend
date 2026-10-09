package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserMenuCountersDto;

/** Existing selected-profile counters and account-owned read-cache invalidation. */
public interface ProfileReadState {
    UserMenuCountersDto queryMenuCounters(String userId);
    void evictUserReadCaches(String userId);
    void evictUserReadCaches(Collection<String> userIds);
}
