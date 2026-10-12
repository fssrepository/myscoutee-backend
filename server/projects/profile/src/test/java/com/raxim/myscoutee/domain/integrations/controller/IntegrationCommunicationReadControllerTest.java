package com.raxim.myscoutee.domain.integrations.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.domain.chat.api.ChatQueries;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.*;
import com.raxim.myscoutee.domain.notifications.api.NotificationReads;
import com.raxim.myscoutee.domain.notifications.dto.NotificationDtos.UserNotificationsPageResponseDto;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationAccess;
import com.raxim.myscoutee.domain.integrations.service.IntegrationCapabilitiesService;
import com.raxim.myscoutee.domain.integrations.service.IntegrationRoleAccessService;
import com.raxim.myscoutee.domain.integrations.service.IntegrationTokenService.AuthenticatedIntegrationClient;

@Tag("standard")
class IntegrationCommunicationReadControllerTest {
    private final ChatQueries chats = mock(ChatQueries.class);
    private final NotificationReads notifications = mock(NotificationReads.class);
    private final IntegrationRoleAccessService roles = mock(IntegrationRoleAccessService.class);
    private final IntegrationCapabilitiesService access = new IntegrationCapabilitiesService(Optional.empty(), roles);
    private final org.springframework.test.web.servlet.MockMvc mvc = MockMvcBuilders.standaloneSetup(
            new IntegrationCommunicationReadController(access, chats, notifications)).build();

    private UsernamePasswordAuthenticationToken authentication(IntegrationAccess.Mode mode) {
        var profile = new Users(); profile.setUserId("owner");
        var auth = new UsernamePasswordAuthenticationToken(new FirebasePrincipal("owner", null, "INTEGRATION", profile), null, List.of());
        auth.setDetails(new AuthenticatedIntegrationClient("owner", "key", "client").withAccess(mode));
        return auth;
    }

    @Test void existingRoutesKeepAuthenticatedActorArgumentsAndResponseShapeWithoutProductOwners() throws Exception {
        var auth = authentication(IntegrationAccess.Mode.READ);
        when(chats.queryChatPage("owner", "contacts", "recent", null, null, "next", 12, null, null, false, null))
                .thenReturn(new ChatPageResponseDto(List.of(), 0, null, 3, null));
        mvc.perform(get("/integrations/v1/chats").principal(auth).param("context", "contacts")
                .param("limit", "12").param("cursor", "next").param("userId", "forged"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items").isArray()).andExpect(jsonPath("$.chats").value(3));
        verify(chats).queryChatPage("owner", "contacts", "recent", null, null, "next", 12, null, null, false, null);

        when(chats.queryMessagesPage("chat", "owner", 20, null, null, false))
                .thenReturn(new ChatMessagesPageResponseDto(List.of(), 0, null, null, 4));
        mvc.perform(get("/integrations/v1/chats/chat/messages").principal(auth).param("userId", "forged"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.notificationUnread").value(4));
        verify(chats).queryMessagesPage("chat", "owner", 20, null, null, false);

        when(notifications.queryPage("owner", "unread", 20, null, null))
                .thenReturn(new UserNotificationsPageResponseDto(List.of(), 0L, null, 2, false));
        mvc.perform(get("/integrations/v1/notifications").principal(auth).param("bucket", "unread"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.unreadCount").value(2));
        verify(notifications).queryPage("owner", "unread", 20, null, null);
        verifyNoMoreInteractions(chats, notifications);
    }

    @Test void detailStillUsesOwnerVisibilityAndPreservesNotFound() throws Exception {
        mvc.perform(get("/integrations/v1/chats/absent").principal(authentication(IntegrationAccess.Mode.FULL)))
                .andExpect(status().isNotFound());
        verify(chats).queryChatById("absent", "owner");
        verifyNoMoreInteractions(chats, notifications);
    }

    @Test void pageBoundsAreCheckedBeforeAnyOwnerRead() throws Exception {
        for (String path : List.of("/chats", "/chats/chat/messages", "/notifications"))
            for (String limit : List.of("0", "101"))
                mvc.perform(get("/integrations/v1" + path).principal(authentication(IntegrationAccess.Mode.READ)).param("limit", limit))
                        .andExpect(status().isBadRequest());
        verifyNoInteractions(chats, notifications);
    }

    @Test void unauthenticatedBlockedWriteOnlyAndMismatchedClientsCannotRead() throws Exception {
        for (String path : List.of("/chats", "/chats/chat", "/chats/chat/messages", "/notifications")) {
            mvc.perform(get("/integrations/v1" + path)).andExpect(status().isUnauthorized());
            for (var mode : List.of(IntegrationAccess.Mode.BLOCKED, IntegrationAccess.Mode.WRITE))
                mvc.perform(get("/integrations/v1" + path).principal(authentication(mode))).andExpect(status().isForbidden());
            var wrong = authentication(IntegrationAccess.Mode.FULL);
            wrong.setDetails(new AuthenticatedIntegrationClient("foreign", "key", "client").withAccess(IntegrationAccess.Mode.FULL));
            mvc.perform(get("/integrations/v1" + path).principal(wrong)).andExpect(status().isUnauthorized());
        }
        verifyNoInteractions(chats, notifications);
    }
}
