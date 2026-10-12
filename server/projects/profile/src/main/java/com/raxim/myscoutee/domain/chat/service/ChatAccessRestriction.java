package com.raxim.myscoutee.domain.chat.service;

import com.raxim.myscoutee.domain.chat.document.Chat;

/** Additional owner rules evaluated before the existing owner/member chat checks. */
interface ChatAccessRestriction {
    boolean allows(Chat chat, String actorUserId);
}
