package com.raxim.myscoutee.domain.chat.api;
import java.util.Collection;
import java.util.Set;
import com.raxim.myscoutee.domain.events.api.EventChatContext;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto;
public interface EventConversations extends SystemChatMessages {
    String ensureMainEventChat(EventChatContext event, Collection<String> participants);
    PublishedMainEventChatResult ensurePublishedMainEventChat(EventChatContext event, Collection<String> participants);
    long updateEventChatOwnerStatus(String eventId, String status);
    ChatMessageDto postSystemMessage(String chatId, String text, String systemType);
    ChatMessageDto ensureInitialSystemMessage(String chatId, String text, String systemType);
    public record PublishedMainEventChatResult(String chatId, Set<String> createdOwnerUserIds) {
        public PublishedMainEventChatResult {
            createdOwnerUserIds = createdOwnerUserIds == null ? Set.of() : Set.copyOf(createdOwnerUserIds);
        }
    }

}
