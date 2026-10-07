package com.raxim.myscoutee.domain.chat.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.chat.api.ChatDirectory;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;

@Service
public class ChatDirectoryService implements ChatDirectory {
    private final ChatsRepository chats;
    public ChatDirectoryService(ChatsRepository chats) { this.chats = chats; }
    @Override public Optional<com.raxim.myscoutee.domain.chat.document.Chat> findByOwnerUserIdAndChatId(String owner, String chat) { return chats.findByOwnerUserIdAndChatId(owner, chat); }
    @Override public List<com.raxim.myscoutee.domain.chat.document.Chat> findByChatId(String chat) { return chats.findByChatId(chat); }
}
