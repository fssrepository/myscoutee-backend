package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;

/** Existing account-owned game-card presentation, including native visibility and ordering. */
public interface ProfileCards {
    List<UserDto> queryUsersByIds(Collection<String> userIds);
    /** Existing member-card presentation without the discovery usability filter. */
    List<UserDto> presentGameCards(Collection<String> userIds);
    /** Existing full profile presentation, with impressions, batched without the discovery filter. */
    List<UserDto> presentProfiles(Collection<String> userIds);
}
