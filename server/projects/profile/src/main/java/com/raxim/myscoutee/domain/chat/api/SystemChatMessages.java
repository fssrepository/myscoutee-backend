package com.raxim.myscoutee.domain.chat.api;

/** Existing stable system-message IDs and text, including retained conversation history. */
public interface SystemChatMessages {
    String RANDOM_ROOM_WELCOME_MESSAGE_TYPE = "random-room-welcome";
    String RANDOM_ROOM_WELCOME_MESSAGE_ID = "system:" + RANDOM_ROOM_WELCOME_MESSAGE_TYPE;
    String RANDOM_ROOM_WELCOME_MESSAGE = "Welcome! We matched you here by affinity and past interactions. Leave anytime. "
            + "Set visibility to non-public in Global Settings to stop future Random Rooms.";
    String TOURNAMENT_ROOM_WELCOME_MESSAGE_TYPE = "tournament-room-welcome";
}
