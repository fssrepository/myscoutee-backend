package com.raxim.myscoutee.domain.chat.controller;

import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatDto;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatSupportCaseMutationRequestDto;
import com.raxim.myscoutee.domain.chat.service.SupportConversationService;
import com.raxim.myscoutee.domain.access.api.AccessPolicyKeys;
import com.raxim.myscoutee.domain.access.api.RequiresPolicy;

@RestController
@RequestMapping("/activities/chats")
public class SupportChatsController {
    private final SupportConversationService chatService;
    public SupportChatsController(SupportConversationService chatService) { this.chatService = chatService; }

    @PostMapping("/{chatId}/support-case")
    @RequiresPolicy(
            key = AccessPolicyKeys.CHAT_SUPPORT_MANAGE,
            subject = "#request?.userId() ?: #userId ?: #actorUserId",
            resourceId = "#chatId",
            skipWhenAuthenticationOptional = true)
    public ChatDto updateSupportCase(
            @PathVariable("chatId") String chatId,
            @RequestBody(required = false) ChatSupportCaseMutationRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        String actorUserId = request == null || request.userId() == null ? userId : request.userId();
        String action = request == null ? null : request.action();
        return chatService.updateSupportCase(chatId, actorUserId, action);
    }
}
