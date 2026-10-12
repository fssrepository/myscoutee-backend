package com.raxim.myscoutee.domain.access.security;

import com.raxim.myscoutee.domain.chat.api.ChatDirectory.Chat;

/** Additional installed owner checks before the existing chat owner/member policy. */
interface ChatPolicyRestriction {
    boolean allows(Chat chat, String normalizedActorUserId);
}
