package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AssetProfiles {
    Optional<? extends AssetProfile> findByUserId(String userId);
    List<? extends AssetProfile> findByUserIdIn(Collection<String> userIds);
    List<? extends AssetProfile> findByAccountUserId(String accountId);
}
