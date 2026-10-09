package com.raxim.myscoutee.domain.accounts.api;

import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto;

/** Account-owned identity reads; callers still enforce their operation's authorization. */
public interface ProfileIdentities {
    Optional<ProfileIdentityDto> findIdentityByUserId(String userId);
    Optional<ProfileIdentityDto> findFirstIdentityByUserId(String userId);
    boolean existsNotDeleted(String userId);
    List<String> userIdsByWorkspace(String groupId);
}
