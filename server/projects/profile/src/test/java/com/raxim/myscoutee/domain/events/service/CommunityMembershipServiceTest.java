package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;

@Tag("standard")
class CommunityMembershipServiceTest {
    @Test void returnedMembershipIsDetachedAndTransitionsPreserveCompareAndSetGuards() {
        var repository = mock(ActivityMembersRepository.class);
        var service = new CommunityMembershipService(repository);
        var stored = new ActivityMember();
        stored.setId("membership"); stored.setOwnerType("community"); stored.setOwnerId("group"); stored.setUserId("account");
        stored.setStatus("pending"); stored.setRole("Member"); stored.setActionAtIso("previous");
        when(repository.findByOwnerTypeAndOwnerIdAndUserId("community", "group", "account")).thenReturn(Optional.of(stored));
        var detached = service.member("group", "account").orElseThrow();
        detached.setStatus("accepted");
        assertThat(stored.getStatus()).isEqualTo("pending");
        when(repository.updateCommunityState("membership", "pending", "Member", "previous", "accepted", "Member",
                null, null, false, "now", "accept", "admin", null, true)).thenReturn(0L);
        assertThat(service.transition("membership", "pending", "Member", "previous", "accepted", "Member",
                null, null, false, "now", "accept", "admin", null, true)).isZero();
        verify(repository).updateCommunityState("membership", "pending", "Member", "previous", "accepted", "Member",
                null, null, false, "now", "accept", "admin", null, true);
        verify(repository).findByOwnerTypeAndOwnerIdAndUserId("community", "group", "account");
        verifyNoMoreInteractions(repository);
    }
}
