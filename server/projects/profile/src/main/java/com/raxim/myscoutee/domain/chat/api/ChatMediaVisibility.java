package com.raxim.myscoutee.domain.chat.api;

import java.util.List;

public interface ChatMediaVisibility {
    List<Message> messages(List<String> urls);
    record Message(String chatId, String deletedAtIso) {}
}
