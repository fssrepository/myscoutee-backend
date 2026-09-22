package com.raxim.myscoutee.profile.service;

import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.dto.admin.ContentModerationDtos.*;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.profile.repository.ContentModerationRepository;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContentModerationServiceTest {
    final ContentModerationRepository repository = mock(ContentModerationRepository.class);
    final MongoTemplate mongo = mock(MongoTemplate.class);
    final ChatService chat = mock(ChatService.class);
    final ContentModerationService service = new ContentModerationService(repository, mongo, chat, mock(UserActivityCountersService.class));
    final Map<String, Item> items = new HashMap<>();
    State state = new State("global", 0, Settings.defaults(), Map.of(), List.of());
    final AdminUserDto admin = new AdminUserDto("admin", "Admin", "", "", "", "", List.of());
    @BeforeEach void persistence() {
        when(repository.state()).thenAnswer(call -> state);
        when(repository.item(anyString())).thenAnswer(call -> items.get(call.getArgument(0)));
        doAnswer(call -> { Item item = call.getArgument(0); items.put(item.id(), item); return null; }).when(repository).saveItem(any());
        when(repository.compareAndSet(any(), any(), any(), any())).thenAnswer(call -> {
            State before = call.getArgument(0);
            if (before.revision() != state.revision()) return false;
            state = new State("global", before.revision() + 1, call.getArgument(1), call.getArgument(2), call.getArgument(3)); return true;
        });
    }
    Item submit() { return service.register("feed", "post", "owner", "Photo", "photo.jpg"); }
    @Test void zeroDelayStillWaitsForScheduledJobAndCountsOnlyOnce() {
        assertEquals("under-review", submit().status());
        submit();
        assertEquals(1, service.snapshot().pendingCount());
        assertEquals(1, items.size());
    }
    @Test void decisionMovesStoredCountersAndRetryDoesNotDuplicateMessage() {
        Item item = submit();
        Decision decision = new Decision("admin", "reject-1", item.version(), "rejected", "Please replace this image.");
        service.decide(item.id(), decision, admin);
        service.decide(item.id(), decision, admin);
        assertEquals(0, service.snapshot().pendingCount());
        assertEquals(1L, service.snapshot().counts().get("feed").get("rejected"));
        verify(chat, times(1)).sendAdminSupportMessage(eq("owner"), eq("admin"), anyString(), anyString(), eq(decision.message()), eq("warned"), eq("content-moderation:reject-1"));
    }
    @Test void staleAdminCannotOverwriteNewerDecision() {
        Item item = submit();
        service.decide(item.id(), new Decision("admin", "accept", 1, "accepted", ""), admin);
        assertThrows(ResponseStatusException.class, () -> service.decide(item.id(), new Decision("admin", "block", 1, "blocked", ""), admin));
        assertEquals("accepted", items.get(item.id()).status());
    }
    @Test void deliveryFailureKeepsIntentAndRetryDoesNotApplyCounterTwice() {
        Item item = submit();
        doThrow(new IllegalStateException("unavailable")).doReturn(null).when(chat).sendAdminSupportMessage(anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
        Decision request = new Decision("admin", "block", 1, "blocked", "Contact support.");
        assertThrows(IllegalStateException.class, () -> service.decide(item.id(), request, admin));
        assertEquals(1, state.pending().size());
        service.decide(item.id(), request, admin);
        assertTrue(state.pending().isEmpty());
        assertEquals(1L, service.snapshot().counts().get("feed").get("blocked"));
        assertEquals(0, service.snapshot().pendingCount());
    }
    @Test void globalSettingsUseRevisionAndDisabledApprovalDoesNotQueryCandidates() {
        service.settings(new SaveSettings("admin", 0, new Settings(false, 5, List.of("feed"))));
        assertThrows(ResponseStatusException.class, () -> service.settings(new SaveSettings("other-admin", 0, Settings.defaults())));
        assertEquals(0, service.approveDue());
        verify(repository, never()).due(any(), anyString(), anyInt());
    }
    @Test void scheduledApprovalUsesConfiguredCategoriesDelayAndWritesDecision() {
        Item item = submit();
        service.settings(new SaveSettings("admin", state.revision(), new Settings(true, 10, List.of("feed"))));
        when(repository.due(any(), anyString(), eq(100))).thenAnswer(call -> {
            Settings configured = call.getArgument(0);
            assertEquals(List.of("feed"), configured.categories());
            long age = java.time.Duration.between(java.time.Instant.parse(call.getArgument(1)), java.time.Instant.now()).toSeconds();
            assertTrue(age >= 599 && age <= 601);
            return List.of(item);
        });
        assertEquals(1, service.approveDue());
        assertEquals("accepted", items.get(item.id()).status());
        assertEquals(0, service.snapshot().pendingCount());
        verifyNoInteractions(chat);
    }
}
