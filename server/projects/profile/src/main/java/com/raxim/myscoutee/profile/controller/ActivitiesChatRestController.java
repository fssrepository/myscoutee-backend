package com.raxim.myscoutee.profile.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.document.mongo.Profile;
import com.raxim.myscoutee.profile.data.dto.chat.ActivitiesChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.chat.ActivitiesChatSendRequestDto;
import com.raxim.myscoutee.profile.data.dto.chat.ActivitiesChatSummaryDto;
import com.raxim.myscoutee.profile.service.ActivitiesChatService;

@RestController
@RequestMapping("activities/chats")
public class ActivitiesChatRestController {
    private final ActivitiesChatService activitiesChatService;

    public ActivitiesChatRestController(ActivitiesChatService activitiesChatService) {
        this.activitiesChatService = activitiesChatService;
    }

    @GetMapping
    public List<ActivitiesChatSummaryDto> getChats(
            @RequestParam(value = "userId", required = false) String userId,
            Authentication authentication) {
        return activitiesChatService.getChats(currentProfile(authentication, userId));
    }

    @GetMapping("{chatId}/messages")
    public List<ActivitiesChatMessageDto> getChatMessages(
            @PathVariable String chatId,
            @RequestParam(value = "userId", required = false) String userId,
            Authentication authentication) {
        return activitiesChatService.getChatMessages(chatId, currentProfile(authentication, userId));
    }

    @PostMapping("{chatId}/messages")
    public ActivitiesChatMessageDto sendChatMessage(
            @PathVariable String chatId,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestBody(required = false) ActivitiesChatSendRequestDto request,
            Authentication authentication) {
        return activitiesChatService.sendChatMessage(
                chatId,
                currentProfile(authentication, userId),
                request != null ? request.text() : null);
    }

    private Profile currentProfile(Authentication authentication, String userId) {
        FirebasePrincipal principal = (FirebasePrincipal) authentication.getPrincipal();
        return activitiesChatService.resolveActorProfile(principal.getUser().getProfile(), userId);
    }
}
