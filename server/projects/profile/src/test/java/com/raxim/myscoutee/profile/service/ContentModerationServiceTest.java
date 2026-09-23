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
    State state = new State("global", 0, new Settings(true, false, 0, List.of("asset", "event", "feed")), Map.of(), List.of());
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
    @Test void defaultModerationIsOffAndDoesNotHoldBackAnyCategoryOrRunAutoApproval() {
        service.settings(new SaveSettings("admin", state.revision(), Settings.defaults()));
        assertFalse(service.snapshot().settings().enabled());
        assertFalse(service.snapshot().settings().autoApprove());
        for (String category : List.of("asset", "event", "feed")) {
            assertEquals("accepted", service.register(category, "default", "owner", "Content", "").status());
        }
        assertEquals(0, service.snapshot().pendingCount());
        assertEquals(0, service.approveDue());
        verify(repository, never()).due(any(), anyString(), anyInt());
    }
    @Test void disabledAutoApprovalWaitsForReviewAndCountsOnlyOnce() {
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
        Decision request = new Decision("admin", "reject", 1, "rejected", "Contact support.");
        assertThrows(IllegalStateException.class, () -> service.decide(item.id(), request, admin));
        assertEquals(1, state.pending().size());
        service.decide(item.id(), request, admin);
        assertTrue(state.pending().isEmpty());
        assertEquals(1L, service.snapshot().counts().get("feed").get("rejected"));
        assertEquals(0, service.snapshot().pendingCount());
    }
    @Test void globalSettingsUseRevisionAndDisabledApprovalDoesNotQueryCandidates() {
        service.settings(new SaveSettings("admin", 0, new Settings(true, false, 5, List.of("feed"))));
        assertThrows(ResponseStatusException.class, () -> service.settings(new SaveSettings("other-admin", 0, Settings.defaults())));
        assertEquals(0, service.approveDue());
        verify(repository, never()).due(any(), anyString(), anyInt());
    }
    @Test void scheduledApprovalUsesConfiguredCategoriesDelayAndWritesDecision() {
        Item item = submit();
        service.settings(new SaveSettings("admin", state.revision(), new Settings(true, true, 10, List.of("feed"))));
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
    @Test void allCategoryUsesStoredBucketTotalIndependentOfPageSizeAndMovesOnDecisions() {
        Item feed = submit();
        service.register("event", "party", "owner", "Event", "");
        service.register("asset", "car", "owner", "Asset", "");
        when(repository.page(eq("all"), eq("under-review"), isNull(), eq(2)))
                .thenReturn(List.of(feed, items.get("event:party")));
        Page page = service.page("all", "under-review", null, 1);
        assertEquals(3, page.total());
        assertEquals(1, page.items().size());
        assertEquals(feed.id(), page.nextCursor());
        service.decide(feed.id(), new Decision("admin", "accept", 1, "accepted", ""), admin);
        assertEquals(2, service.page("all", "under-review", null, 1).total());
        when(repository.page(eq("feed"), eq("accepted"), isNull(), anyInt())).thenReturn(List.of(items.get(feed.id())));
        assertEquals(1, service.page("feed", "accepted", null, 20).total());
        service.decide(feed.id(), new Decision("admin", "block", 2, "blocked", ""), admin);
        service.decide(feed.id(), new Decision("admin", "unblock", 3, "under-review", ""), admin);
        assertEquals(3, service.page("all", "under-review", null, 1).total());
        assertEquals(0L, service.snapshot().counts().get("feed").get("blocked"));
        assertThrows(ResponseStatusException.class, () -> service.register("all", "invalid", "owner", "", ""));
        assertThrows(ResponseStatusException.class, () -> service.page("all", "invalid", null, 10));
    }

    @Test void zeroMinuteAutoApprovalImmediatelyApprovesEverySelectedCategory() {
        service.settings(new SaveSettings("admin", state.revision(), new Settings(true, true, 0, List.of("asset", "event", "feed"))));
        for (String category : List.of("asset", "event", "feed")) {
            Item item = service.register(category, "immediate-" + category, "owner", "Content", "");
            assertEquals("accepted", item.status());
            assertTrue(item.hasBeenPublic());
            service.register(category, item.sourceId(), "owner", "Content", "");
            assertEquals(1L, service.snapshot().counts().get(category).get("accepted"));
        }
        assertEquals(0, service.snapshot().pendingCount());
    }
    @Test void persistedItemsWithoutPublicHistoryRemainReadable() {
        var context = new org.springframework.data.mongodb.core.mapping.MongoMappingContext();
        var converter = new org.springframework.data.mongodb.core.convert.MappingMongoConverter(
                org.springframework.data.mongodb.core.convert.NoOpDbRefResolver.INSTANCE, context);
        converter.afterPropertiesSet();
        for (String status : List.of("under-review", "accepted", "blocked")) {
            var document = new org.bson.Document();
            converter.write(new Item("feed:old", "feed", "old", "owner", "Photo", "", "2026-09-22T10:00:00Z",
                    status, 1, "submit", "", ""), document);
            document.remove("publiclyVisibleOnce");
            Item read = converter.read(Item.class, document);
            assertEquals(status, read.status());
            assertEquals(!"under-review".equals(status), read.hasBeenPublic());
        }
    }
    @Test void zeroMinutesDoesNotApproveExcludedCategories() {
        service.settings(new SaveSettings("admin", state.revision(), new Settings(true, true, 0, List.of("feed"))));
        assertEquals("under-review", service.register("event", "event", "owner", "Event", "").status());
        assertEquals("under-review", service.register("asset", "asset", "owner", "Asset", "").status());
        assertEquals("accepted", submit().status());
    }
    @Test void rejectIsBeforePublicApprovalAndBlockIsAfterItIncludingAfterUnblock() {
        Item item = submit();
        assertThrows(ResponseStatusException.class, () -> service.decide(item.id(), new Decision("admin", "invalid-block", 1, "blocked", ""), admin));
        Item accepted = service.decide(item.id(), new Decision("admin", "accept", 1, "accepted", ""), admin);
        assertTrue(accepted.hasBeenPublic());
        assertThrows(ResponseStatusException.class, () -> service.decide(item.id(), new Decision("admin", "invalid-reject", 2, "rejected", ""), admin));
        service.decide(item.id(), new Decision("admin", "block", 2, "blocked", ""), admin);
        Item unblocked = service.decide(item.id(), new Decision("admin", "unblock", 3, "under-review", ""), admin);
        assertTrue(unblocked.publiclyVisibleOnce());
        assertThrows(ResponseStatusException.class, () -> service.decide(item.id(), new Decision("admin", "still-invalid-reject", 4, "rejected", ""), admin));
    }

}
