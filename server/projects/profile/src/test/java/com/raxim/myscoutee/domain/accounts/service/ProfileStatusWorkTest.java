package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Tag;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.affinity.api.UserAffinityChanges;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

@Tag("standard")
class ProfileStatusWorkTest {
    @Test void committedStatusSurvivesLostAffinityReplyAndRecoveryClearsOnlyItsOwnMarker() {
        var users = mock(UsersRepository.class);
        var mongo = mock(MongoTemplate.class);
        var affinity = mock(UserAffinityChanges.class);
        var databases = mock(ScheduledMongoSessionRunner.class);
        doAnswer(call -> { ((Runnable) call.getArgument(0)).run(); return null; })
                .when(databases).runAcrossConfiguredDatabases(any());
        var user = new Users(); user.setUserId("profile"); user.setWorkspaceGroupId("workspace"); user.setProfileStatus("blocked");
        when(users.save(user)).thenAnswer(call -> {
            assertThat(user.getProfileStatusWork()).isNotBlank();
            return user;
        });
        when(affinity.enqueueAdminStatusChanged("profile")).thenAnswer(call -> {
            assertThat(JobGroupContext.groupId()).isEqualTo("workspace");
            throw new IllegalStateException("reply lost after enqueue");
        });
        new ProfileStatusWork(users, mongo, affinity, databases).save(user);
        String persisted = user.getProfileStatusWork();
        verify(mongo, never()).updateFirst(any(), any(Update.class), eq(Users.class));
        when(mongo.find(any(Query.class), eq(Users.class))).thenReturn(List.of(user));
        doReturn(null).when(affinity).enqueueAdminStatusChanged("profile");
        new ProfileStatusWork(users, mongo, affinity, databases).recover();
        var guard = ArgumentCaptor.forClass(Query.class);
        verify(mongo).updateFirst(guard.capture(), any(Update.class), eq(Users.class));
        assertThat(guard.getValue().getQueryObject()).containsEntry("userId", "profile").containsEntry("profileStatusWork", persisted);
        assertThat(JobGroupContext.isActive()).isFalse();
        verify(users, times(1)).save(user);
    }
    @Test void supportIntentIsStoredWithTheBlockAndReusesItsMessageIdAfterALostReply() {
        var users = mock(UsersRepository.class);
        var mongo = mock(MongoTemplate.class);
        var affinity = mock(UserAffinityChanges.class);
        var databases = mock(ScheduledMongoSessionRunner.class);
        var support = mock(com.raxim.myscoutee.domain.chat.api.SupportMessages.class);
        doAnswer(call -> { ((Runnable) call.getArgument(0)).run(); return null; })
                .when(databases).runAcrossConfiguredDatabases(any());
        var user = new Users(); user.setUserId("profile"); user.setProfileStatus("public");
        when(users.findByUserId("profile")).thenReturn(java.util.Optional.of(user));
        when(users.save(user)).thenAnswer(call -> {
            assertThat(user.getProfileStatus()).isEqualTo("blocked");
            assertThat(user.getProfileSupportWork()).hasSize(1);
            assertThat(user.getProfileStatusWork()).isNotBlank();
            return user;
        });
        when(support.sendAdminSupportMessage(anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString()))
                .thenThrow(new IllegalStateException("accepted message reply lost")).thenReturn(null);
        var work = new ProfileStatusWork(users, mongo, affinity, databases);
        org.springframework.test.util.ReflectionTestUtils.setField(work, "supportMessages", support);
        var service = new ProfileModerationService(users, work);
        var notice = new com.raxim.myscoutee.domain.accounts.api.ProfileModeration.SupportNotice("admin", "Admin", "A", "Reason");
        assertThat(service.block("profile", notice)).isTrue();
        assertThat(service.block("profile", notice)).isFalse();
        String receipt = user.getProfileSupportWork().getFirst().id();
        verify(mongo, never()).updateFirst(any(), any(Update.class), eq(Users.class));
        when(mongo.find(any(Query.class), eq(Users.class))).thenReturn(List.of(user));
        var replacement = new ProfileStatusWork(users, mongo, affinity, databases);
        org.springframework.test.util.ReflectionTestUtils.setField(replacement, "supportMessages", support);
        replacement.recover();
        verify(support, times(2)).sendAdminSupportMessage("profile", "admin", "Admin", "A", "Reason", "blocked", receipt);
        verify(users, times(1)).save(user);
        verify(mongo, times(2)).updateFirst(any(Query.class), any(Update.class), eq(Users.class));
    }

}
