package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.document.UserSessionAction;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.repository.UserSessionActionsRepository;
import com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges;

@Tag("standard")
class AccountInactivityServiceTest {
    private final UsersRepository users = mock(UsersRepository.class);
    private final UserSessionActionsRepository sessions = mock(UserSessionActionsRepository.class);
    private final AffinityStatusChanges affinity = mock(AffinityStatusChanges.class);
    private final AccountInactivityService service = new AccountInactivityService(users, sessions, new ProfileStatusWork(users, mock(org.springframework.data.mongodb.core.MongoTemplate.class), affinity, null));
    private final Instant now = Instant.parse("2026-10-07T00:00:00Z");

    @Test void recentSessionActivityReschedulesWithoutSavingOrRecomputing() {
        var user = profile();
        var session = new UserSessionAction();
        session.setCreatedDate("2026-10-06T00:00:00Z");
        when(sessions.findByUserIdOrderByCreatedDateDesc("user")).thenReturn(List.of(session));
        var result = service.inactivate("user", 30, now);
        assertThat(result.status()).isEqualTo("scheduled");
        assertThat(result.profile()).isSameAs(user);
        assertThat(result.nextDueAt()).isEqualTo(Instant.parse("2026-11-05T00:00:00Z"));
        verify(users, never()).save(any());
        verifyNoInteractions(affinity);
    }

    @Test void expiredProfileIsSavedBeforeAffinityIsEnqueued() {
        var user = profile();
        when(users.save(user)).thenReturn(user);
        var result = service.inactivate("user", 30, now);
        assertThat(result.status()).isEqualTo("completed");
        assertThat(result.count()).isEqualTo(1);
        assertThat(user.getStatus()).isEqualTo("I");
        assertThat(user.getProfileStatus()).isEqualTo("inactive");
        assertThat(user.getProfileStatusWork()).isNotBlank();
        var order = inOrder(users, affinity);
        order.verify(users).save(user);
        order.verify(affinity).enqueueAdminStatusChanged("user");
    }

    @Test void deletedProfileDoesNotReadSessionsOrWriteState() {
        var user = profile(); user.setProfileStatus("deleted");
        var result = service.inactivate("user", 30, now);
        assertThat(result.status()).isEqualTo("skipped");
        assertThat(result.profile()).isNull();
        verify(users, never()).save(any());
        verifyNoInteractions(sessions, affinity);
    }

    private Users profile() {
        var user = new Users(); user.setId("user"); user.setUserId("user");
        user.setStatus("A"); user.setProfileStatus("public");
        when(users.findByUserId("user")).thenReturn(Optional.of(user));
        return user;
    }
}
