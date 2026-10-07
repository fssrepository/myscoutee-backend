package com.raxim.myscoutee.domain.chat.api;
import java.util.Collection;
import java.util.Set;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto;
public interface EventConversations {
    String RANDOM_ROOM_WELCOME_MESSAGE_TYPE = "random-room-welcome";
    String RANDOM_ROOM_WELCOME_MESSAGE_ID = "system:" + RANDOM_ROOM_WELCOME_MESSAGE_TYPE;
    String RANDOM_ROOM_WELCOME_MESSAGE = "Welcome! We matched you here by affinity and past interactions. Leave anytime. "
            + "Set visibility to non-public in Global Settings to stop future Random Rooms.";
    String TOURNAMENT_ROOM_WELCOME_MESSAGE_TYPE = "tournament-room-welcome";
    String ensureMainEventChat(Event event, Collection<String> participants);
    PublishedMainEventChatResult ensurePublishedMainEventChat(Event event, Collection<String> participants);
    long updateEventChatOwnerStatus(String eventId, String status);
    ChatMessageDto postSystemMessage(String chatId, String text, String systemType);
    ChatMessageDto ensureInitialSystemMessage(String chatId, String text, String systemType);
    public record PublishedMainEventChatResult(String chatId, Set<String> createdOwnerUserIds) {
        public PublishedMainEventChatResult {
            createdOwnerUserIds = createdOwnerUserIds == null ? Set.of() : Set.copyOf(createdOwnerUserIds);
        }
    }

}
