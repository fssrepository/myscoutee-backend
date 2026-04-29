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

import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatDeviceDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatDeviceUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageMutationRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatPageResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatPostMessageRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatSummaryDto;
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

    @GetMapping("/page")
    public ChatPageResponseDto queryChatPage(
            @RequestParam("userId") String userId,
            @RequestParam(value = "contextFilter", required = false) String contextFilter,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "sortDirection", required = false) String sortDirection,
            @RequestParam(value = "secondaryFilter", required = false) String secondaryFilter,
            @RequestParam(value = "cursor", required = false) String cursor,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "rangeStartIso", required = false) String rangeStartIso,
            @RequestParam(value = "rangeEndIso", required = false) String rangeEndIso) {
        return activitiesChatService.queryChatPage(
                userId,
                contextFilter,
                sort,
                sortDirection,
                secondaryFilter,
                cursor,
                limit,
                rangeStartIso,
                rangeEndIso);
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
        return activitiesChatService.sendMessage(chatId, userId, request.text(), null, request.replyTo(), request.attachments());
    }

    @PostMapping("/{chatId}/messages/{messageId}/edit")
    public ChatMessageDto editMessage(
            @PathVariable("chatId") String chatId,
            @PathVariable("messageId") String messageId,
            @RequestBody ChatMessageMutationRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        return activitiesChatService.editMessage(chatId, userId, messageId, request == null ? "" : request.text());
    }

    @PostMapping("/{chatId}/messages/{messageId}/delete")
    public ChatMessageDto deleteMessage(
            @PathVariable("chatId") String chatId,
            @PathVariable("messageId") String messageId,
            @RequestParam(value = "userId", required = false) String userId) {
        return activitiesChatService.deleteMessage(chatId, userId, messageId);
    }

    @PostMapping("/{chatId}/messages/{messageId}/pin")
    public ChatMessageDto pinMessage(
            @PathVariable("chatId") String chatId,
            @PathVariable("messageId") String messageId,
            @RequestBody ChatMessageMutationRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        return activitiesChatService.pinMessage(chatId, userId, messageId, request != null && Boolean.TRUE.equals(request.pinned()));
    }

    @PostMapping("/{chatId}/messages/{messageId}/reaction")
    public ChatMessageDto reactToMessage(
            @PathVariable("chatId") String chatId,
            @PathVariable("messageId") String messageId,
            @RequestBody ChatMessageMutationRequestDto request,
            @RequestParam(value = "userId", required = false) String userId) {
        return activitiesChatService.reactToMessage(chatId, userId, messageId, request == null ? "" : request.emoji());
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
