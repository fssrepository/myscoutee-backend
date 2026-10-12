package com.raxim.myscoutee.domain.chat.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.community.dto.CaseConversation;
import com.raxim.myscoutee.domain.groups.api.BaseGroups;

@Tag("standard")
class ChatWebSocketSessionRegistryTest {
    @AfterEach void clearMode() { MongoSessionModeContext.clear(); }

    @Test
    void startsAndBroadcastsAllRegisteredChannelsWithoutProductProviders() throws Exception {
        try (var context = new AnnotationConfigApplicationContext()) {
            context.registerBean(ObjectMapper.class, () -> new ObjectMapper());
            context.register(ChatWebSocketSessionRegistry.class);
            context.refresh();
            var registry = context.getBean(ChatWebSocketSessionRegistry.class);
            for (String id : List.of("contact", "event", "c-case-example", "campaign")) {
                var session = session(id);
                registry.register(id, "viewer", session);
                registry.broadcast(ChatStreamEvent.typing(id, "sender", "Sender", "S", null, true));
                verify(session).sendMessage(argThat(message -> message instanceof TextMessage text
                        && text.getPayload().contains("\"chatId\":\"" + id + "\"")));
                verify(session, never()).close(any());
                assertThat(registry.isUserConnected(id, "viewer")).isTrue();
            }
        }
    }

    @Test
    void installedCaseAudienceIsReadOncePerSessionModeAndRetainsMembershipChecks() throws Exception {
        var registry = new ChatWebSocketSessionRegistry(new ObjectMapper());
        try {
            var audience = mock(ChatBroadcastAudience.class);
            ReflectionTestUtils.setField(registry, "audience", audience);
            when(audience.supports("c-case-example")).thenReturn(true);
            when(audience.members("c-case-example", MongoSessionMode.REAL)).thenReturn(Set.of("real"));
            when(audience.members("c-case-example", MongoSessionMode.DEMO)).thenReturn(Set.of("demo"));
            var real = session("real");
            var rejected = session("rejected");
            var demo = session("demo");
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            registry.register("c-case-example", "real", real);
            registry.register("c-case-example", "rejected", rejected);
            MongoSessionModeContext.set(MongoSessionMode.DEMO);
            registry.register("c-case-example", "demo", demo);
            registry.broadcast(ChatStreamEvent.typing("c-case-example", "sender", "Sender", "S", null, true));
            verify(audience).members("c-case-example", MongoSessionMode.REAL);
            verify(audience).members("c-case-example", MongoSessionMode.DEMO);
            verify(real).sendMessage(any(TextMessage.class));
            verify(demo).sendMessage(any(TextMessage.class));
            verify(rejected, never()).sendMessage(any());
            verify(rejected).close(CloseStatus.NOT_ACCEPTABLE);
            assertThat(registry.isUserConnected("c-case-example", "rejected")).isFalse();
        } finally { registry.shutdownBroadcastExecutor(); }
    }

    @Test
    void configuredAudienceFailureIsNotTreatedAsPermissionToBroadcast() throws Exception {
        var registry = new ChatWebSocketSessionRegistry(new ObjectMapper());
        try {
            var audience = mock(ChatBroadcastAudience.class);
            ReflectionTestUtils.setField(registry, "audience", audience);
            when(audience.supports("c-case-example")).thenReturn(true);
            when(audience.members(eq("c-case-example"), any())).thenThrow(new IllegalStateException("owner unavailable"));
            var session = session("viewer");
            registry.register("c-case-example", "viewer", session);
            assertThatThrownBy(() -> registry.broadcast(ChatStreamEvent.typing("c-case-example", "sender", "Sender", "S", null, true)))
                    .isInstanceOf(IllegalStateException.class).hasMessage("owner unavailable");
            verify(session, never()).sendMessage(any());
        } finally { registry.shutdownBroadcastExecutor(); }
    }

    @Test
    void caseAudiencePreservesOwnerReadsAndRestoresTheCallingSessionModeOnSuccessAndFailure() {
        var cases = mock(CaseParticipants.class);
        var profiles = mock(ProfileSummaries.class);
        var audience = new CaseChatBroadcastAudience(cases, profiles);
        var profile = mock(ProfileSummary.class);
        when(profile.getUserId()).thenReturn("profile");
        when(cases.conversation("example")).thenAnswer(call -> {
            assertThat(MongoSessionModeContext.currentMode()).isEqualTo(MongoSessionMode.DEMO);
            return Optional.of(new CaseConversation("example", BaseGroups.COMMUNITY_BASE_ID, "Case",
                    List.of("account"), List.of("account"), List.of()));
        });
        when(profiles.findByWorkspaceGroupIdAndAccountUserIdIn(BaseGroups.COMMUNITY_BASE_ID, List.of("account")))
                .thenAnswer(call -> List.of(profile));
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        assertThat(audience.members("c-case-example", MongoSessionMode.DEMO)).containsExactly("profile");
        assertThat(MongoSessionModeContext.currentMode()).isEqualTo(MongoSessionMode.REAL);
        verify(cases).conversation("example");
        verify(profiles).findByWorkspaceGroupIdAndAccountUserIdIn(BaseGroups.COMMUNITY_BASE_ID, List.of("account"));
        when(cases.conversation("broken")).thenThrow(new IllegalStateException("owner unavailable"));
        assertThatThrownBy(() -> audience.members("c-case-broken", MongoSessionMode.DEMO)).isInstanceOf(IllegalStateException.class);
        assertThat(MongoSessionModeContext.currentMode()).isEqualTo(MongoSessionMode.REAL);
    }

    private WebSocketSession session(String id) {
        var session = mock(WebSocketSession.class);
        when(session.getId()).thenReturn(id);
        when(session.isOpen()).thenReturn(true);
        return session;
    }
}
