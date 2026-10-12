package com.raxim.myscoutee.domain.chat.service;

import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMembersPageResponseDto;

/** The installed resource-membership owner's paged view. */
interface ChatMemberPages {
    ChatMembersPageResponseDto query(String memberOwnerType, String memberOwnerId, Boolean pendingOnly, int offset, int limit);
}
