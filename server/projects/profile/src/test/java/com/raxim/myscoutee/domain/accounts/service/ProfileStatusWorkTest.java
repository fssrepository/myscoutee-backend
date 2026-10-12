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
        new ProfileStatusWork(users, mongo, java.util.List.of(affinity::enqueueAdminStatusChanged), databases).save(user);
        String persisted = user.getProfileStatusWork();
        verify(mongo, never()).updateFirst(any(), any(Update.class), eq(Users.class));
        when(mongo.find(any(Query.class), eq(Users.class))).thenReturn(List.of(user));
        doReturn(null).when(affinity).enqueueAdminStatusChanged("profile");
        new ProfileStatusWork(users, mongo, java.util.List.of(affinity::enqueueAdminStatusChanged), databases).recover();
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
        var work = new ProfileStatusWork(users, mongo, java.util.List.of(affinity::enqueueAdminStatusChanged), databases);
        org.springframework.test.util.ReflectionTestUtils.setField(work, "supportMessages", support);
        var service = new ProfileModerationService(users, work);
        var notice = new com.raxim.myscoutee.domain.accounts.api.ProfileModeration.SupportNotice("admin", "Admin", "A", "Reason");
        assertThat(service.block("profile", notice)).isTrue();
        assertThat(service.block("profile", notice)).isFalse();
        String receipt = user.getProfileSupportWork().getFirst().id();
        verify(mongo, never()).updateFirst(any(), any(Update.class), eq(Users.class));
        when(mongo.find(any(Query.class), eq(Users.class))).thenReturn(List.of(user));
        var replacement = new ProfileStatusWork(users, mongo, java.util.List.of(affinity::enqueueAdminStatusChanged), databases);
        org.springframework.test.util.ReflectionTestUtils.setField(replacement, "supportMessages", support);
        replacement.recover();
        verify(support, times(2)).sendAdminSupportMessage("profile", "admin", "Admin", "A", "Reason", "blocked", receipt);
        verify(users, times(1)).save(user);
        verify(mongo, times(2)).updateFirst(any(Query.class), any(Update.class), eq(Users.class));
    }

    @Test void startsWithoutAffinityAndStillDeliversStoredSupportWorkBeforeClearingTheMarker() {
        var users = mock(UsersRepository.class);
        var mongo = mock(MongoTemplate.class);
        var databases = mock(ScheduledMongoSessionRunner.class);
        var changes = mock(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService.class);
        var support = mock(com.raxim.myscoutee.domain.chat.api.SupportMessages.class);
        var user = new Users(); user.setUserId("profile"); user.setWorkspaceGroupId("workspace");
        user.setProfileSupportWork(List.of(new Users.ProfileSupportWork("receipt", "admin", "Admin", "A", "Reason")));
        when(users.save(user)).thenReturn(user);
        when(support.sendAdminSupportMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenAnswer(call -> {
                    assertThat(JobGroupContext.groupId()).isEqualTo("workspace");
                    return null;
                });
        try (var context = new org.springframework.context.annotation.AnnotationConfigApplicationContext()) {
            context.registerBean(UsersRepository.class, () -> users);
            context.registerBean(MongoTemplate.class, () -> mongo);
            context.registerBean(ScheduledMongoSessionRunner.class, () -> databases);
            context.registerBean(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService.class, () -> changes);
            context.registerBean(com.raxim.myscoutee.domain.chat.api.SupportMessages.class, () -> support);
            context.register(ProfileStatusWork.class);
            context.refresh();
            clearInvocations(mongo);
            assertThat(context.getBeansOfType(com.raxim.myscoutee.domain.accounts.api.ProfileStatusObserver.class)).isEmpty();
            context.getBean(ProfileStatusWork.class).save(user);
        }
        var order = inOrder(users, support, mongo);
        order.verify(users).save(user);
        order.verify(support).sendAdminSupportMessage("profile", "admin", "Admin", "A", "Reason", "blocked", "receipt");
        var query = ArgumentCaptor.forClass(Query.class);
        var update = ArgumentCaptor.forClass(Update.class);
        order.verify(mongo, times(2)).updateFirst(query.capture(), update.capture(), eq(Users.class));
        assertThat(update.getAllValues().get(0).getUpdateObject().toJson()).contains("$pull", "receipt");
        assertThat(query.getAllValues().get(1).getQueryObject()).containsEntry("profileStatusWork", user.getProfileStatusWork());
        assertThat(update.getAllValues().get(1).getUpdateObject().toJson()).contains("$unset", "profileStatusWork");
        verifyNoMoreInteractions(users, support, mongo);
        assertThat(JobGroupContext.isActive()).isFalse();
    }

    @Test void nativeAffinityObserverInvokesTheExistingQueueOnceAndPropagatesFailure() {
        var affinity = mock(UserAffinityChanges.class, CALLS_REAL_METHODS);
        affinity.onProfileStatusChanged("profile");
        verify(affinity).enqueueAdminStatusChanged("profile");
        when(affinity.enqueueAdminStatusChanged("failed")).thenThrow(new IllegalStateException("unavailable"));
        assertThatThrownBy(() -> affinity.onProfileStatusChanged("failed")).hasMessage("unavailable");
    }

    @Test void lifecycleStartsWithoutSupportAndDoesNotDiscardUndeliveredSupportIntent() {
        var users = mock(UsersRepository.class);
        var mongo = mock(MongoTemplate.class);
        var databases = mock(ScheduledMongoSessionRunner.class);
        var changes = mock(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService.class);
        var user = new Users(); user.setUserId("profile");
        when(users.save(user)).thenReturn(user);
        try (var context = new org.springframework.context.annotation.AnnotationConfigApplicationContext()) {
            context.registerBean(UsersRepository.class, () -> users);
            context.registerBean(MongoTemplate.class, () -> mongo);
            context.registerBean(ScheduledMongoSessionRunner.class, () -> databases);
            context.registerBean(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService.class, () -> changes);
            context.register(ProfileStatusWork.class);
            context.refresh();
            clearInvocations(mongo);
            var work = context.getBean(ProfileStatusWork.class);
            work.save(user);
            var query = ArgumentCaptor.forClass(Query.class);
            var update = ArgumentCaptor.forClass(Update.class);
            verify(mongo).updateFirst(query.capture(), update.capture(), eq(Users.class));
            assertThat(query.getValue().getQueryObject()).containsEntry("profileStatusWork", user.getProfileStatusWork());
            assertThat(update.getValue().getUpdateObject().toJson()).contains("$unset", "profileStatusWork");
            clearInvocations(mongo);
            user.setProfileSupportWork(List.of(new Users.ProfileSupportWork("receipt", "admin", "Admin", "A", "Reason")));
            work.save(user);
            assertThat(user.getProfileStatusWork()).isNotBlank();
            assertThat(user.getProfileSupportWork()).hasSize(1);
            verifyNoInteractions(mongo);
        }
    }

}
