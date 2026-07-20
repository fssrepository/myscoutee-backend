package com.raxim.myscoutee.e2e;

import com.raxim.myscoutee.profile.data.document.ChatMessage;

final class E2eChatTestSupport {
    private E2eChatTestSupport() {
    }

    static ChatMessage persistedMessage(String chatId, ChatMessage message) {
        ChatMessage persisted = message == null ? new ChatMessage() : message;
        persisted.setChatId(chatId);
        persisted.setMongoId(ChatMessage.buildMongoId(chatId, persisted.getId()));
        persisted.refreshMessageSearchFields();
        return persisted;
    }
}
