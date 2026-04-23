package com.raxim.myscoutee.profile.service;

import java.util.List;
import java.util.Objects;

import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatReadAvatarDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatReadReceiptDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatSocketEventDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatTypingDto;

public record ChatStreamEvent(
        String type,
        String chatId,
        String id,
        String clientId,
        String senderId,
        String senderName,
        String senderInitials,
        String senderGender,
        String text,
        String sentAtIso,
        List<ChatReadAvatarDto> readBy,
        Boolean typing,
        List<String> messageIds,
        String readAtIso) {

    public static ChatStreamEvent message(
            String chatId,
            String id,
            String clientId,
            String senderId,
            String senderName,
            String senderInitials,
            String senderGender,
            String text,
            String sentAtIso,
            List<ChatReadAvatarDto> readBy) {
        return new ChatStreamEvent(
                "message",
                chatId,
                id,
                clientId,
                senderId,
                senderName,
                senderInitials,
                senderGender,
                text,
                sentAtIso,
                readBy,
                null,
                null,
                null);
    }

    public static ChatStreamEvent typing(
            String chatId,
            String senderId,
            String senderName,
            String senderInitials,
            String senderGender,
            boolean typing) {
        return new ChatStreamEvent(
                "typing",
                chatId,
                null,
                null,
                senderId,
                senderName,
                senderInitials,
                senderGender,
                null,
                null,
                null,
                typing,
                null,
                null);
    }

    public static ChatStreamEvent read(
            String chatId,
            String senderId,
            String senderInitials,
            String senderGender,
            List<String> messageIds,
            String readAtIso) {
        return new ChatStreamEvent(
                "read",
                chatId,
                null,
                null,
                senderId,
                null,
                senderInitials,
                senderGender,
                null,
                null,
                null,
                null,
                messageIds,
                readAtIso);
    }

    public ChatSocketEventDto toSocketEvent(String viewerUserId) {
        if ("typing".equalsIgnoreCase(type)) {
            return new ChatSocketEventDto(
                    "typing",
                    chatId,
                    null,
                    new ChatTypingDto(
                            senderId,
                            senderName,
                            senderInitials,
                            senderGender,
                            Boolean.TRUE.equals(typing)),
                    null);
        }
        if ("read".equalsIgnoreCase(type)) {
            return new ChatSocketEventDto(
                    "read",
                    chatId,
                    null,
                    null,
                    new ChatReadReceiptDto(
                            senderId,
                            senderInitials,
                            senderGender,
                            messageIds == null ? List.of() : List.copyOf(messageIds),
                            readAtIso));
        }
        return new ChatSocketEventDto(
                "message",
                chatId,
                new ChatMessageDto(
                        id,
                        clientId,
                        senderId,
                        senderName,
                        senderInitials,
                        senderGender,
                        text,
                        sentAtIso,
                        Objects.equals(senderId, viewerUserId),
                        readBy == null ? List.of() : List.copyOf(readBy)),
                null,
                null);
    }
}
