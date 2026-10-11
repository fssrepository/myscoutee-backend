package com.raxim.myscoutee.domain.chat.controller;

import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatDto;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatServiceEnsureRequestDto;
import com.raxim.myscoutee.domain.chat.service.ResourceConversationService;

@RestController
@RequestMapping("/activities/chats")
public class ResourceConversationsController {
    private final ResourceConversationService conversations;
    public ResourceConversationsController(ResourceConversationService conversations) { this.conversations = conversations; }

    @PostMapping("/service")
    public ChatDto ensureServiceChat(
            @RequestBody ChatServiceEnsureRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        return conversations.ensureServiceChat(request, userId);
    }

}
