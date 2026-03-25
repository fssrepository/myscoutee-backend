package com.raxim.myscoutee.profile.controller.activities;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatPostMessageRequestDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatSummaryDto;

@RestController
@RequestMapping("/activities/chats")
public class ActivitiesChatsController {

    @GetMapping
    public List<ChatSummaryDto> queryChats(@RequestParam("userId") String userId) {
        return List.of();
    }

    @GetMapping("/{chatId}/messages")
    public List<ChatMessageDto> queryMessages(
            @PathVariable("chatId") String chatId,
            @RequestParam("userId") String userId) {
        return List.of();
    }

    @PostMapping("/{chatId}/messages")
    public ChatMessageDto sendMessage(
            @PathVariable("chatId") String chatId,
            @RequestBody ChatPostMessageRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        String text = request != null && request.text() != null ? request.text().trim() : "";
        if (text.isEmpty()) {
            return null;
        }
        String senderId = userId != null && !userId.trim().isEmpty() ? userId.trim() : "dev-user";
        return new ChatMessageDto(
                UUID.randomUUID().toString(),
                senderId,
                "You",
                "YO",
                "man",
                text,
                Instant.now().toString(),
                true,
                List.of());
    }
}
