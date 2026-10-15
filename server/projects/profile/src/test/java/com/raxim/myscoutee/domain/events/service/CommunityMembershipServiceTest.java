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
        when(repository.findById("membership")).thenReturn(Optional.of(stored));
        var next = new ActivityMember(); next.setId("membership"); next.setUserId("account"); next.setStatus("accepted"); next.setRole("Member");
        var state = CommunityMembershipService.counterState(next, stored);
        when(repository.updateCommunityState("membership", "pending", "Member", "previous", "accepted", "Member",
                null, null, false, "now", "accept", "admin", null, true, state, null)).thenReturn(0L);
        assertThat(service.transition("membership", "pending", "Member", "previous", "accepted", "Member",
                null, null, false, "now", "accept", "admin", null, true)).isZero();
        verify(repository).updateCommunityState("membership", "pending", "Member", "previous", "accepted", "Member",
                null, null, false, "now", "accept", "admin", null, true, state, null);
        verify(repository).findByOwnerTypeAndOwnerIdAndUserId("community", "group", "account");
        verify(repository).findById("membership");
        verifyNoMoreInteractions(repository);
    }
    @Test void bucketMovesRetainAnIdempotentUserCounterChangeAndUnrelatedEditsDoNotCountAgain() {
        var member = new ActivityMember(); member.setId("one"); member.setUserId("account");
        member.setStatus("pending"); member.setRole("Member"); member.setRequestKind("invite");
        var invited = CommunityMembershipService.counterState(member, null);
        assertThat(invited.pending().deltas()).containsEntry("groups_invitations", 1).containsEntry("groups_trash", 0);
        assertThat(invited.pending().workspaceGroupId()).isNull();
        var previous = new ActivityMember(); previous.setGroupCounterState(invited);
        member.setStatus("accepted"); member.setRequestKind(null);
        var accepted = CommunityMembershipService.counterState(member, previous);
        assertThat(accepted.pending().deltas()).containsEntry("groups_invitations", -1).containsEntry("groups_participation", 1);
        assertThat(accepted.revision()).isEqualTo(2);
        assertThat(accepted.pending().sourceKey()).isEqualTo(invited.pending().sourceKey());
        previous.setGroupCounterState(accepted);
        assertThat(CommunityMembershipService.counterState(member, previous).pending()).isNull();
        member.setRole("Admin");
        assertThat(CommunityMembershipService.counterState(member, previous).pending().deltas())
                .containsEntry("groups_participation", -1).containsEntry("groups_hosting", 1);
        member.setStatus("deleted"); member.setCommunityAction("remove"); member.setCommunityActor("account");
        assertThat(CommunityMembershipService.counterBucket(member)).isEqualTo("trash");
        member.setRequestKind("invite");
        assertThat(CommunityMembershipService.counterBucket(member)).isNull();
        member.setStatus("blocked");
        assertThat(CommunityMembershipService.counterBucket(member)).isEqualTo("trash");
    }
}
