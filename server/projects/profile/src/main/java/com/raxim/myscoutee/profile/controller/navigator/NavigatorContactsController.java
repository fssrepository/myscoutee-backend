package com.raxim.myscoutee.profile.controller.navigator;

import com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.ContactChatAccessSnapshot;
import com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.ContactChatAccessCommand;

import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactDeleteRequestDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactProfileDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactsSaveRequestDto;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.service.NavigatorContactsService;

@RestController
@RequestMapping("/navigator/contacts")
public class NavigatorContactsController {
    private final NavigatorContactsService navigatorContactsService;

    public NavigatorContactsController(NavigatorContactsService navigatorContactsService) {
        this.navigatorContactsService = navigatorContactsService;
    }

    @GetMapping("/chat-access")
    public ContactChatAccessSnapshot loadChatAccess() {
        return navigatorContactsService.chatAccessSnapshot();
    }

    @PutMapping("/{userId}/chat-access")
    public ContactChatAccessSnapshot changeChatAccess(
            @PathVariable String userId,
            @RequestBody ContactChatAccessCommand command) {
        navigatorContactsService.changeChatAccess(userId, command);
        return navigatorContactsService.chatAccessSnapshot();
    }

    @GetMapping
    public List<NavigatorContactDto> loadContacts(
            @RequestParam(value = "userId", required = false) String userId) {
        return navigatorContactsService.loadContacts(userId);
    }

    @GetMapping("/{userId}/profile")
    public NavigatorContactProfileDto loadContactProfile(@PathVariable String userId) {
        return navigatorContactsService.loadContactProfile(userId);
    }

    @PutMapping
    public List<NavigatorContactDto> saveContacts(
            @RequestBody(required = false) NavigatorContactsSaveRequestDto request) {
        return navigatorContactsService.saveContacts(request);
    }

    @DeleteMapping("/{contactId}")
    public List<NavigatorContactDto> deleteContact(
            @PathVariable String contactId,
            @RequestBody(required = false) NavigatorContactDeleteRequestDto request) {
        return navigatorContactsService.deleteContact(contactId, request);
    }
}
