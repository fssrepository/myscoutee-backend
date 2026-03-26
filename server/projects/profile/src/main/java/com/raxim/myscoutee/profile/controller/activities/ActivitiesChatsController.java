package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatDeviceDeleteRequestDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatDeviceUpsertRequestDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatPostMessageRequestDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatSummaryDto;
import com.raxim.myscoutee.profile.service.ActivitiesChatService;

@RestController
@RequestMapping("/activities/chats")
public class ActivitiesChatsController {
    private final ActivitiesChatService activitiesChatService;

    public ActivitiesChatsController(ActivitiesChatService activitiesChatService) {
        this.activitiesChatService = activitiesChatService;
    }

    @GetMapping
    public List<ChatSummaryDto> queryChats(@RequestParam("userId") String userId) {
        return activitiesChatService.queryChats(userId);
    }

    @GetMapping("/{chatId}/messages")
    public List<ChatMessageDto> queryMessages(
            @PathVariable("chatId") String chatId,
            @RequestParam("userId") String userId) {
        return activitiesChatService.queryMessages(chatId, userId);
    }

    @PostMapping("/{chatId}/messages")
    public ChatMessageDto sendMessage(
            @PathVariable("chatId") String chatId,
            @RequestBody ChatPostMessageRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        if (request == null) {
            return null;
        }
        return activitiesChatService.sendMessage(chatId, userId, request.text());
    }

    @PostMapping("/devices")
    public void upsertDevice(
            @RequestBody ChatDeviceUpsertRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        activitiesChatService.upsertDevice(request == null
                ? null
                : new ChatDeviceUpsertRequestDto(
                        request.userId() == null ? userId : request.userId(),
                        request.deviceId(),
                        request.platform(),
                        request.firebaseToken(),
                        request.notificationsEnabled()));
    }

    @DeleteMapping("/devices")
    public void deleteDevice(
            @RequestBody(required = false) ChatDeviceDeleteRequestDto request,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "deviceId", required = false) String deviceId,
            @RequestParam(value = "firebaseToken", required = false) String firebaseToken) {
        ChatDeviceDeleteRequestDto resolvedRequest = request != null
                ? new ChatDeviceDeleteRequestDto(
                        request.userId() == null ? userId : request.userId(),
                        request.deviceId(),
                        request.firebaseToken())
                : new ChatDeviceDeleteRequestDto(userId, deviceId, firebaseToken);
        activitiesChatService.deleteDevice(resolvedRequest);
    }
}
