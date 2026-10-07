package com.raxim.myscoutee.domain.content.service;

import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.chat.service.ChatService;

import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.*;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.domain.content.repository.ContentModerationRepository;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
class ContentModerationServiceTest {
    final ContentModerationRepository repository = mock(ContentModerationRepository.class);
    final MongoTemplate mongo = mock(MongoTemplate.class);
    final ChatService chat = mock(ChatService.class);
    final ContentModerationService service = new ContentModerationService(repository, mongo, chat, mock(UserActivityCountersService.class));
    final Map<String, Item> items = new HashMap<>();
    final Map<String, State> groupStates = new HashMap<>();
    State state = new State("global", 0, new Settings(true, false, 0, List.of("asset", "event", "feed")), Map.of(), List.of());
    final AdminUserDto admin = new AdminUserDto("admin", "Admin", "", "", "", "", List.of());
    @BeforeEach void persistence() {
        when(repository.state()).thenAnswer(call -> state);
        when(repository.state(anyString())).thenAnswer(call -> groupStates.computeIfAbsent(call.getArgument(0),
                id -> new State("group:" + id, 0, new Settings(false, false, 0, List.of("asset", "event", "feed")), Map.of(), List.of())));
        when(repository.states()).thenAnswer(call -> new ArrayList<>(groupStates.values()));
        when(repository.item(anyString())).thenAnswer(call -> items.get(call.getArgument(0)));
        when(repository.withheld(anyInt())).thenAnswer(call -> items.values().stream()
                .filter(item -> !"accepted".equals(item.status())).limit(call.getArgument(0, Integer.class)).toList());
        doAnswer(call -> { Item item = call.getArgument(0); items.put(item.id(), item); return null; }).when(repository).saveItem(any());
        when(repository.compareAndSet(any(), any(), any(), any())).thenAnswer(call -> {
            State before = call.getArgument(0);
            if (before.id().startsWith("group:")) {
                String groupId = before.id().substring(6);
                if (before.revision() != groupStates.get(groupId).revision()) return false;
                groupStates.put(groupId, new State(before.id(), before.revision() + 1, call.getArgument(1), call.getArgument(2), call.getArgument(3)));
                return true;
            }
            if (before.revision() != state.revision()) return false;
            state = new State("global", before.revision() + 1, call.getArgument(1), call.getArgument(2), call.getArgument(3)); return true;
        });
    }
    Item submit() { return service.register("feed", "post", "owner", "Photo", "photo.jpg"); }
    @Test void groupContentUsesItsOwnSettingsCountersAndDecisionScopeWhileGroupCreationRemainsGlobal() {
        var owner = new com.raxim.myscoutee.domain.accounts.document.Users();
        owner.setUserId("workspace-profile"); owner.setMongoId("different-storage-id"); owner.setWorkspaceGroupId("A");
        when(mongo.findOne(any(org.springframework.data.mongodb.core.query.Query.class), eq(com.raxim.myscoutee.domain.accounts.document.Users.class)))
                .thenAnswer(call -> "workspace-profile".equals(call.getArgument(0, org.springframework.data.mongodb.core.query.Query.class).getQueryObject().get("userId")) ? owner : null);
        service.settings(new SaveSettings("moderator", 0, new Settings(true, false, 0, List.of("feed"))), "A");
        Item scoped = service.register("feed", "scoped-post", "workspace-profile", "Photo", "");
        assertEquals("A", scoped.workspaceGroupId());
        assertEquals(1, service.snapshot("A").pendingCount());
        assertEquals(0, service.snapshot().pendingCount());
        assertEquals(0, service.snapshot("B").pendingCount());
        assertFalse(service.snapshot("B").settings().enabled());
        assertThrows(ResponseStatusException.class, () -> service.scopedItem(scoped.id(), null));
        assertThrows(ResponseStatusException.class, () -> service.scopedItem(scoped.id(), "B"));
        assertEquals(scoped, service.scopedItem(scoped.id(), "A"));
        service.decide(scoped.id(), new Decision("moderator", "approve-group", 1, "accepted", ""), admin);
        service.decide(scoped.id(), new Decision("moderator", "approve-group", 1, "accepted", ""), admin);
        var updates = org.mockito.ArgumentCaptor.forClass(org.springframework.data.mongodb.core.query.Update.class);
        verify(mongo, atLeastOnce()).updateFirst(any(org.springframework.data.mongodb.core.query.Query.class), updates.capture(), eq("communityGroups"));
        var pendingWrites = updates.getAllValues().stream().map(update -> update.getUpdateObject().get("$set", org.bson.Document.class))
                .filter(update -> update.containsKey("moderationPending")).map(update -> update.get("moderationPending")).toList();
        assertEquals(List.of(1L, 0L), pendingWrites);
        assertEquals(1, service.snapshot("A").counts().get("feed").get("accepted"));
        assertEquals(0, service.snapshot().pendingCount());
        assertThrows(ResponseStatusException.class, () -> service.page("group", "under-review", null, 20, "A"));
        assertThrows(ResponseStatusException.class, () -> service.settings(new SaveSettings("moderator", 0,
                new Settings(true, false, 0, List.of("group"))), "B"));
        Item group = service.register("group", "created-group", "workspace-profile", "Group", "");
        assertNull(group.workspaceGroupId());
        assertEquals("under-review", group.status());
        assertEquals(1, service.snapshot().pendingCount());
    }
    @Test void workerUsesEachGroupsOwnApprovalPolicy() {
        var owner = new com.raxim.myscoutee.domain.accounts.document.Users(); owner.setWorkspaceGroupId("A");
        when(mongo.findOne(any(org.springframework.data.mongodb.core.query.Query.class), eq(com.raxim.myscoutee.domain.accounts.document.Users.class))).thenReturn(owner);
        service.settings(new SaveSettings("moderator", 0, new Settings(true, true, 5, List.of("feed"))), "A");
        Item item = service.register("feed", "scoped", "profile", "Photo", "");
        when(repository.due(any(), anyString(), eq(100), eq("A"))).thenReturn(List.of(item));
        assertEquals(1, com.raxim.myscoutee.domain.platform.service.JobGroupContext.call("A", service::approveDue));
        assertEquals("accepted", service.scopedItem(item.id(), "A").status());
        assertEquals(1, service.snapshot("A").counts().get("feed").get("accepted"));
        assertTrue(service.snapshot().counts().isEmpty());
    }
    @Test void disabledModerationJobReleasesEveryCategoryAndBucketWithoutAutoApprovalOrDelay() {
        service.register("event", "pending", "owner", "Event", "");
        Item asset = service.register("asset", "rejected", "owner", "Asset", "");
        service.decide(asset.id(), new Decision("admin", "reject", 1, "rejected", ""), admin);
        Item feed = submit();
        service.decide(feed.id(), new Decision("admin", "accept", 1, "accepted", ""), admin);
        service.decide(feed.id(), new Decision("admin", "block", 2, "blocked", ""), admin);
        Snapshot disabled = service.settings(new SaveSettings("admin", state.revision(), new Settings(false, false, 43200, List.of("feed"))));
        assertEquals(1, disabled.pendingCount());
        assertEquals("rejected", items.get(asset.id()).status());
        assertEquals("blocked", items.get(feed.id()).status());
        assertEquals(3, service.approveDue());
        disabled = service.snapshot();
        assertEquals(0, disabled.pendingCount());
        for (String category : List.of("asset", "event", "feed")) {
            assertEquals(1L, disabled.counts().get(category).get("accepted"));
            assertEquals(0L, disabled.counts().get(category).getOrDefault("under-review", 0L));
            assertEquals(0L, disabled.counts().get(category).getOrDefault("rejected", 0L));
            assertEquals(0L, disabled.counts().get(category).getOrDefault("blocked", 0L));
        }
        var versions = items.values().stream().map(Item::version).sorted().toList();
        service.settings(new SaveSettings("admin", state.revision(), disabled.settings()));
        assertEquals(0, service.approveDue());
        assertEquals(versions, items.values().stream().map(Item::version).sorted().toList());
        assertEquals(disabled.counts(), service.snapshot().counts());
        Item released = items.get(feed.id());
        assertThrows(ResponseStatusException.class, () -> service.decide(feed.id(),
                new Decision("admin", "stale-block", released.version(), "blocked", ""), admin));
        verifyNoInteractions(chat);
    }
    @Test void interruptedDisableResumesCommittedReleaseWithoutCountingTwice() {
        Item item = submit();
        doThrow(new IllegalStateException("storage interrupted")).doAnswer(call -> {
            Item saved = call.getArgument(0); items.put(saved.id(), saved); return null;
        }).when(repository).saveItem(any());
        service.settings(new SaveSettings("admin", state.revision(), Settings.defaults()));
        assertThrows(IllegalStateException.class, service::approveDue);
        assertFalse(state.settings().enabled());
        assertFalse(state.pending().isEmpty());
        service.approveDue();
        assertEquals("accepted", items.get(item.id()).status());
        assertTrue(state.pending().isEmpty());
        assertEquals(1L, service.snapshot().counts().get("feed").get("accepted"));
        assertEquals(0, service.snapshot().pendingCount());
    }
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
        assertEquals(1, com.raxim.myscoutee.domain.platform.service.JobGroupContext.call(null, service::approveDue));
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
