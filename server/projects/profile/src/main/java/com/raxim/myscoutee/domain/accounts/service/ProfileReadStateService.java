package com.raxim.myscoutee.domain.accounts.service;

import java.util.Collection;
import java.util.List;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.accounts.api.ProfileReadState;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserMenuCountersDto;

@Service
public class ProfileReadStateService implements ProfileReadState {
    private final ProfileMenuCountersService counters;
    private final List<ProfileReadCache> caches;

    public ProfileReadStateService(ProfileMenuCountersService counters, List<ProfileReadCache> caches) {
        this.counters = counters;
        this.caches = List.copyOf(caches);
    }

    @Override public UserMenuCountersDto queryMenuCounters(String userId) {
        return counters.queryMenuCounters(userId);
    }

    @Override public void evictUserReadCaches(String userId) {
        caches.forEach(cache -> cache.evictUserReadCaches(userId));
    }

    @Override public void evictUserReadCaches(Collection<String> userIds) {
        caches.forEach(cache -> cache.evictUserReadCaches(userIds));
    }
}
