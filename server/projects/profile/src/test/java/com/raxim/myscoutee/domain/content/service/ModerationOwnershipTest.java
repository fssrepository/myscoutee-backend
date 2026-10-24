package com.raxim.myscoutee.domain.content.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.*;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.ProfileModerationService;
import com.raxim.myscoutee.domain.events.service.EventModerationService;
import com.raxim.myscoutee.domain.assets.service.AssetModerationProjectionService;

@Tag("standard")
class ModerationOwnershipTest {
    @Test void profileBlockRetryRetainsOriginalStatusAndUnblockRestoresIt() {
        var users = mock(UsersRepository.class); var service = new ProfileModerationService(users,
                new com.raxim.myscoutee.domain.accounts.service.ProfileStatusWork(users, mock(MongoTemplate.class),
                        java.util.List.of(mock(com.raxim.myscoutee.domain.accounts.api.ProfileStatusObserver.class)), null));
        var user = new Users(); user.setUserId("profile"); user.setProfileStatus("inactive");
        when(users.findByUserId("profile")).thenReturn(Optional.of(user));
        assertThat(service.block("profile")).isTrue(); assertThat(user.getProfileStatus()).isEqualTo("blocked");
        assertThat(user.getPreviousProfileStatus()).isEqualTo("inactive");
        assertThat(service.block("profile")).isFalse(); assertThat(user.getPreviousProfileStatus()).isEqualTo("inactive");
        verify(users).save(user);
        service.unblock("profile");
        assertThat(user.getProfileStatus()).isEqualTo("inactive"); assertThat(user.getPreviousProfileStatus()).isNull();
        service.unblock("profile"); // A lost unblock reply must not turn the restored inactive profile public.
        assertThat(user.getProfileStatus()).isEqualTo("inactive");
        verify(users, times(2)).save(user);
    }
    @ParameterizedTest @CsvSource({"events,A,blocked,B", "assets,A,blocked,B", "events,B,accepted,A", "assets,B,accepted,A", "events,T,blocked,T", "assets,D,blocked,D"})
    void resourceOwnerKeepsVersionGuardAndLifecycleRules(String collection, String current, String decision, String expected) {
        var mongo = mock(MongoTemplate.class);
        var record = new Document("_id", "row").append("status", current);
        if (current.equals("B")) record.append("moderationPreviousStatus", "A");
        when(mongo.find(any(Query.class), eq(Document.class), eq(collection))).thenReturn(List.of(record));
        if (collection.equals("events")) new EventModerationService(mongo, null).apply("resource", 7L, decision);
        else new AssetModerationProjectionService(mongo).apply("resource", 7L, decision);
        var query = ArgumentCaptor.forClass(Query.class); var update = ArgumentCaptor.forClass(Update.class);
        verify(mongo).updateFirst(query.capture(), update.capture(), eq(collection));
        assertThat(query.getValue().getQueryObject()).containsEntry("_id", "row");
        assertThat(query.getValue().getQueryObject().toJson()).contains("moderationVersion", "$lte", "7", "$exists", "false");
        var fields = update.getValue().getUpdateObject().get("$set", Document.class);
        assertThat(fields).containsEntry("moderationStatus", decision).containsEntry("moderationVersion", 7L);
        if (current.equals("T") || current.equals("D")) assertThat(fields).doesNotContainKey("status");
        else assertThat(fields).containsEntry("status", expected);
        if (decision.equals("accepted")) assertThat(update.getValue().getUpdateObject().get("$unset", Document.class)).containsKey("moderationPreviousStatus");
    }
}
