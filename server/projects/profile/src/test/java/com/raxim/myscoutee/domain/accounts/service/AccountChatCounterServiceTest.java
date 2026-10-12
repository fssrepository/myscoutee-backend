package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.entry;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.raxim.myscoutee.domain.accounts.api.ChatCounters;
import com.raxim.myscoutee.domain.accounts.document.Users;

@Tag("standard")
class AccountChatCounterServiceTest {
    @Test void ordinaryUnreadCountersStartWithoutSupportOrAChatDirectory() {
        var mongo = mock(MongoTemplate.class);
        try (var context = new AnnotationConfigApplicationContext()) {
            context.registerBean(MongoTemplate.class, () -> mongo);
            context.register(AccountChatCounterService.class);
            context.refresh();
            clearInvocations(mongo);
            context.getBean(ChatCounters.class).increment(new ChatCounters.Change("member", "private", 1));
        }
        var query = ArgumentCaptor.forClass(Query.class);
        var update = ArgumentCaptor.forClass(Update.class);
        verify(mongo).updateFirst(query.capture(), update.capture(), eq(Users.class));
        assertThat(query.getValue().getQueryObject()).containsOnly(entry("userId", "member"));
        assertThat(update.getValue().getUpdateObject().get("$inc", org.bson.Document.class))
                .containsOnly(entry("activities.chats", 1), entry("activities.chat.all", 1), entry("activities.chat.private", 1));
        verifyNoMoreInteractions(mongo);
    }
}
