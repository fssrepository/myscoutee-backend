package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.chat.api.ChatDirectory;

@Tag("standard")
class AccountSupportCaseCounterServiceTest {
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final UsersRepository users = mock(UsersRepository.class);
    private final ChatDirectory chats = mock(ChatDirectory.class);

    @Test
    void startsWithoutProductOwnersAndKeepsOneReadPerWorkspaceAndOneWritePerAdmin() {
        var first = admin("admin-a", "workspace");
        var demo = admin("admin-demo-ava", "workspace");
        var ungrouped = admin("admin-ungrouped", null);
        when(users.findByHostTier("Admin")).thenReturn(List.of(first, demo, ungrouped));
        when(users.findByUserIdIn(List.of("admin-demo-ava", "admin-demo-noel"))).thenReturn(List.of(demo));
        when(chats.supportCaseCounts("workspace")).thenReturn(Map.of("pending", 2, "picked", 3));
        when(chats.supportCaseCounts(null)).thenReturn(Map.of("warned", 1));
        try (var context = new AnnotationConfigApplicationContext()) {
            context.registerBean(MongoTemplate.class, () -> mongo);
            context.registerBean(UsersRepository.class, () -> users);
            context.registerBean(ChatDirectory.class, () -> chats);
            context.register(AccountSupportCaseCounterService.class);
            context.refresh();
            context.getBean(SupportCaseCounters.class).refreshSupportCaseCountersForAdmins();
        }
        verify(users).findByHostTier("Admin");
        verify(users).findByUserIdIn(List.of("admin-demo-ava", "admin-demo-noel"));
        verify(chats).supportCaseCounts("workspace");
        verify(chats).supportCaseCounts(null);
        verifyNoMoreInteractions(users, chats);
        var queries = ArgumentCaptor.forClass(Query.class);
        var updates = ArgumentCaptor.forClass(Update.class);
        verify(mongo, times(3)).updateFirst(queries.capture(), updates.capture(), eq(Users.class));
        assertThat(queries.getAllValues()).extracting(q -> q.getQueryObject().getString("userId"))
                .containsExactly("admin-a", "admin-demo-ava", "admin-ungrouped");
        assertThat(updates.getAllValues().get(0).getUpdateObject().get("$set", Document.class))
                .containsOnly(entry("activities.chat.supportCases.pending", 2),
                        entry("activities.chat.supportCases.warned", 0), entry("activities.chat.supportCases.picked", 3),
                        entry("activities.chat.supportCases.solved", 0), entry("activities.chat.supportCases.blocked", 0),
                        entry("activities.chat.supportCases.all", 5));
        assertThat(updates.getAllValues().get(1).getUpdateObject())
                .isEqualTo(updates.getAllValues().get(0).getUpdateObject());
        assertThat(updates.getAllValues().get(2).getUpdateObject().get("$set", Document.class))
                .containsEntry("activities.chat.supportCases.warned", 1)
                .containsEntry("activities.chat.supportCases.all", 1);
    }

    @Test
    void missingAdminsDoNotQueryChatOrWriteCounters() {
        service().refreshSupportCaseCountersForAdmins();
        verifyNoInteractions(chats, mongo);
    }

    @Test
    void chatOwnerFailureDoesNotWriteEmptyCounters() {
        when(users.findByHostTier("Admin")).thenReturn(List.of(admin("admin-a", "workspace")));
        when(chats.supportCaseCounts("workspace")).thenThrow(new IllegalStateException("owner unavailable"));
        assertThatThrownBy(() -> service().refreshSupportCaseCountersForAdmins())
                .isInstanceOf(IllegalStateException.class).hasMessage("owner unavailable");
        verifyNoInteractions(mongo);
    }

    @Test
    void presenceUsesOnlyTheExistingAccountReadAndNeverRebuildsCounters() {
        var service = service();
        assertThat(service.hasSupportCaseCounters(null)).isFalse();
        verifyNoInteractions(users);
        assertThat(service.hasSupportCaseCounters("absent")).isFalse();
        var user = mock(Users.class, RETURNS_DEEP_STUBS);
        when(users.findByUserId("existing")).thenReturn(Optional.of(user));
        assertThat(service.hasSupportCaseCounters("existing")).isTrue();
        verify(users).findByUserId("absent");
        verify(users).findByUserId("existing");
        verifyNoMoreInteractions(users);
        verifyNoInteractions(chats, mongo);
    }

    private AccountSupportCaseCounterService service() {
        return new AccountSupportCaseCounterService(mongo, users, chats);
    }

    private Users admin(String id, String workspace) {
        var user = new Users();
        user.setUserId(id);
        user.setWorkspaceGroupId(workspace);
        return user;
    }
}
