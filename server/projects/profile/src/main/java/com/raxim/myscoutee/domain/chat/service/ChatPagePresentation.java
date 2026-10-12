package com.raxim.myscoutee.domain.chat.service;

import java.util.List;
import java.util.Map;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatDto;

/** Optional owner presentation for a page already selected by the chat service. */
public interface ChatPagePresentation {
    List<ChatDto> present(List<Chat> records, Map<String, ProfileSummary> usersById);
}
