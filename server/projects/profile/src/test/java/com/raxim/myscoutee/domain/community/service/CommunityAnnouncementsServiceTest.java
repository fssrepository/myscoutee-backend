package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.community.document.CommunityAnnouncement;
import com.raxim.myscoutee.domain.community.repository.CommunityAnnouncementsRepository;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.service.CommunityAccessService;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.domain.Pageable;

import com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.*;

import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;

@org.junit.jupiter.api.Tag("standard")
class CommunityAnnouncementsServiceTest {
    CommunityAnnouncementsRepository records;
    CommunityAccessService access;
    MongoTemplate mongo;
    UsersRepository users;
    NotificationOutboxService notifications;
    CommunityAnnouncementsService service;
    com.raxim.myscoutee.domain.groups.api.GroupDirectory groups;
    @BeforeEach void setup() {
        records=mock(CommunityAnnouncementsRepository.class);
        access=mock(CommunityAccessService.class);mongo=mock(MongoTemplate.class);users=mock(UsersRepository.class);notifications=mock(NotificationOutboxService.class);
        service=new CommunityAnnouncementsService(records,access,mongo,users,notifications);
        groups = mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "groups", groups);
        when(groups.activeCommunityIds(anyCollection())).thenReturn(Set.of("homes"));
        when(access.admin("homes","admin")).thenReturn(true);
        when(access.roster("homes")).thenReturn(List.of(member("admin","Admin"),member("resident","Member")));
        when(users.findByWorkspaceGroupIdAndAccountUserIdIn(eq("homes"),anyCollection())).thenAnswer(inv->((Collection<String>)inv.getArgument(1)).stream().map(id->{var u=new Users();u.setUserId("group:homes:"+id);return u;}).toList());
        when(access.member("homes","resident")).thenReturn(member("resident","Member"));
        when(records.save(any())).thenAnswer(inv->inv.getArgument(0));
    }
    @Test void immutableMemberVoteUsesAtomicVersionAndAccountGuardAndNotifiesOtherAdmin() {
        var a=announcement(null,List.of());when(records.findById("vote")).thenReturn(Optional.of(a));
        var voted=announcement(null,List.of(new CommunityAnnouncement.Ballot("resident","yes","2026-10-05T10:00:00.000Z")));
        when(mongo.findAndModify(any(Query.class),any(Update.class),any(FindAndModifyOptions.class),eq(CommunityAnnouncement.class))).thenReturn(voted);
        var result=service.action("resident","vote",new Command("resident","vote","yes",0L));
        assertThat(result.results().get("yes")).isEqualTo(1);assertThat(result.myBallot()).isEqualTo("yes");assertThat(result.eligibleMembers()).isEqualTo(2);
        var query=ArgumentCaptor.forClass(Query.class);verify(mongo).findAndModify(query.capture(),any(Update.class),any(FindAndModifyOptions.class),eq(CommunityAnnouncement.class));
        assertThat(query.getValue().getQueryObject().toJson()).contains("ballots.voterAccountId","$ne","resident","version","deadlineIso","$gt");
        verify(notifications).enqueueOnce(eq("announcement-voted:vote:resident"),argThat(n->n.recipientUserIds().equals(List.of("group:homes:admin"))));
        when(records.findById("vote")).thenReturn(Optional.of(voted));
        assertThatThrownBy(()->service.action("resident","vote",new Command("resident","vote","no",0L))).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThatThrownBy(()->service.action("resident","vote",new Command("resident","vote","yes",0L))).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
    }
    @Test void reopeningPreservesFinalMemberBallotsAndDoesNotNotifyEditingAdmin() {
        var a=announcement("2026-10-05T10:00:00.000Z",List.of(new CommunityAnnouncement.Ballot("resident","yes","2026-10-05T09:00:00.000Z")));
        when(records.findById("vote")).thenReturn(Optional.of(a));
        var result=service.save("admin",new Save("admin","vote","homes","Updated","Body",List.of(),true,"2099-02-01T18:00:00Z",0L));
        assertThat(result.closed()).isFalse();assertThat(result.results().get("yes")).isEqualTo(1);assertThat(result.eligibleMembers()).isEqualTo(2);
        verify(notifications).enqueueOnce(eq("announcement-reopened:vote:0"),argThat(n->n.recipientUserIds().equals(List.of("group:homes:resident"))));
        assertThatThrownBy(()->service.save("admin",new Save("admin","vote","homes","Updated","Body",List.of(),false,null,0L))).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
    }
    @Test void closureRetriesItsOutboxBeforeAcknowledgingAndNeverRunsForWork() {
        var a=announcement("2026-10-05T10:00:00.000Z",List.of());
        when(records.pendingClosure(anyString(),any(Pageable.class))).thenReturn(List.of(a));
        when(notifications.enqueueOnce(anyString(),any())).thenThrow(new IllegalStateException("queue unavailable")).thenReturn(Optional.empty());
        JobGroupContext.run(CommunityGroup.WORK_BASE_ID,()->assertThat(service.closeDue(Instant.now())).isZero());
        verifyNoInteractions(records);
        JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID,()->{
            assertThatThrownBy(()->service.closeDue(Instant.now())).isInstanceOf(IllegalStateException.class);
            verify(mongo,never()).updateFirst(any(Query.class),any(Update.class),eq(CommunityAnnouncement.class));
            assertThat(service.closeDue(Instant.now())).isEqualTo(1);
        });
        verify(notifications,times(2)).enqueueOnce(eq("announcement-closed:vote:2026-10-05T10:00:00.000Z"),argThat(n->n.recipientUserIds().size()==2));
        verify(mongo).updateFirst(any(Query.class),any(Update.class),eq(CommunityAnnouncement.class));
    }
    @Test void closureLimitAppliesAfterWorkspaceEligibility() {
        var excluded = announcement("2026-10-05T10:00:00.000Z", List.of());
        var eligible = new CommunityAnnouncement("later", "eligible", "admin", "Title", "Body", List.of(), "published", true,
                "2026-10-05T10:00:00.000Z", "2026-10-05T10:00:00.000Z", null, List.of(), "", "", "", 0L);
        when(records.pendingClosure(anyString(), any(Pageable.class))).thenAnswer(call ->
                call.getArgument(1, Pageable.class).getPageNumber() == 0 ? Collections.nCopies(100, excluded) : List.of(eligible));
        when(groups.activeCommunityIds(List.of("homes"))).thenReturn(Set.of());
        when(groups.activeCommunityIds(List.of("eligible"))).thenReturn(Set.of("eligible"));
        JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID, () -> assertThat(service.closeDue(Instant.now())).isEqualTo(1));
        verify(records).pendingClosure(anyString(), argThat(page -> page.getPageNumber() == 1));
        verify(mongo).updateFirst(argThat(query -> "later".equals(query.getQueryObject().get("_id"))), any(Update.class), eq(CommunityAnnouncement.class));
    }
    private CommunityAnnouncement announcement(String closed,List<CommunityAnnouncement.Ballot> ballots) {
        return new CommunityAnnouncement("vote","homes","admin","Roof inspection","Body",List.of(),"published",true,"2099-01-01T18:00:00.000Z",closed,null,
            ballots,
            "2026-10-05T08:00:00.000Z","2026-10-05T08:00:00.000Z","2026-10-05T08:00:00.000Z",0L);
    }
    private static CommunityMember member(String id,String role) {var m=new CommunityMember();m.setUserId(id);m.setRole(role);m.setStatus("accepted");m.setVotingEligible(true);return m;}
}
