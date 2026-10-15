package com.raxim.myscoutee.domain.community.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.test.util.ReflectionTestUtils;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.AccountMenuCounterService;
import com.raxim.myscoutee.domain.community.document.CommunityAnnouncement;
import com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.*;
import com.raxim.myscoutee.domain.community.repository.CommunityAnnouncementsRepository;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.groups.api.*;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;

@Tag("embedded")
class CommunityVoteCounterTest {
    @Test void votesCountOnlyAvailableBallotsAndReplayNeverTouchesRatings() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "vote-counters");
                var factory = new MongoRepositoryFactory(mongo);
                var rows = factory.getRepository(CommunityAnnouncementsRepository.class);
                var users = factory.getRepository(UsersRepository.class);
                for (var id : List.of("admin", "voter", "no-right")) mongo.getCollection("users").insertOne(
                        new Document("userId", "group:homes:" + id).append("accountUserId", id).append("workspaceGroupId", "homes")
                                .append("activities", new Document("game", 7)));
                var profiles = mock(ProfileSummaries.class);
                doAnswer(call -> users.findByWorkspaceGroupIdAndAccountUserIdIn(call.getArgument(0), call.getArgument(1)))
                        .when(profiles).findByWorkspaceGroupIdAndAccountUserIdIn(anyString(), any());
                var groups = mock(GroupDirectory.class);
                var group = mock(GroupView.class); when(group.effectiveType()).thenReturn("community");
                doReturn(Optional.of(group)).when(groups).findById("homes");
                var admin = member("admin", true); admin.setRole("Admin");
                var voter = member("voter", true); var excluded = member("no-right", false);
                var roster = List.of(admin, voter, excluded);
                var members = mock(CommunityMemberships.class); when(members.forGroup("homes")).thenReturn(roster);
                var access = mock(CommunityAuthority.class); when(access.roster("homes")).thenReturn(roster);
                when(access.admin("homes", "admin")).thenReturn(true); when(access.member("homes", "voter")).thenReturn(voter);
                var accounts = spy(new AccountMenuCounterService(mongo));
                var work = new CommunityVoteCounterWork(mongo, accounts, profiles, members, groups, rows);
                var service = new CommunityAnnouncementsService(rows, access, mongo, profiles, mock(NotificationDelivery.class));
                ReflectionTestUtils.setField(service, "voteCounters", work);
                var draft = service.save("admin", new Save("admin", null, "homes", "Vote", "Body", List.of(), true, "2099-01-01T00:00:00Z", null));
                assertThat(draft.votesCount()).isZero();
                assertThat(service.page("admin", "homes", "draft", 10, null, true).total()).isEqualTo(1);
                assertThat(users.findByUserId("group:homes:voter").orElseThrow().getMenuCounters()).doesNotContainKey("announcement_draft_votes");
                doAnswer(call -> { List<MenuCounterUpdates.Change> changes = call.getArgument(0);
                    accounts.apply(changes.getFirst()); throw new IllegalStateException("lost reply"); }).when(accounts).applyAll(any());
                assertThatThrownBy(() -> service.action("admin", draft.id(), new Command("admin", "publish", null, draft.version())))
                        .hasMessage("lost reply");
                doCallRealMethod().when(accounts).applyAll(any());
                work.sync(rows.findById(draft.id()).orElseThrow()); work.sync(rows.findById(draft.id()).orElseThrow());
                assertThat(users.findByUserId("group:homes:voter").orElseThrow().getMenuCounters()).containsEntry("votes", 1);
                assertThat(users.findByUserId("group:homes:no-right").orElseThrow().getMenuCounters()).doesNotContainKey("votes");
                assertThat(service.page("admin", "homes", "draft", 10, null, true).total()).isZero();
                assertThat(service.page("no-right", "homes", "published", 10, null, true).total()).isEqualTo(1);
                var published = rows.findById(draft.id()).orElseThrow();
                var voted = service.action("voter", published.id(), new Command("voter", "vote", "yes", published.version()));
                assertThat(voted.votesCount()).isZero();
                assertThat(service.page("voter", "homes", "published", 10, null, true).total()).isEqualTo(1);
                assertThatThrownBy(() -> service.action("voter", voted.id(), new Command("voter", "vote", "no", voted.version())))
                        .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
                assertThat(users.findByUserId("group:homes:admin").orElseThrow().getMenuCounters()).containsEntry("votes", 1);
                admin.setVotingEligible(false); work.membersChanged("homes");
                assertThat(users.findByUserId("group:homes:admin").orElseThrow().getMenuCounters()).containsEntry("votes", 0);
                admin.setVotingEligible(true); work.membersChanged("homes");
                mongo.updateFirst(Query.query(Criteria.where("_id").is(voted.id())), new Update().set("deadlineIso", "2020-01-01T00:00:00Z"), CommunityAnnouncement.class);
                work.sync(rows.findById(voted.id()).orElseThrow());
                assertThat(users.findByUserId("group:homes:admin").orElseThrow().getMenuCounters()).containsEntry("votes", 0);
                var notice = service.save("admin", new Save("admin", null, "homes", "Notice", "Body", List.of(), false, null, null));
                var publishedNotice = service.action("admin", notice.id(), new Command("admin", "publish", null, notice.version()));
                assertThat(service.page("voter", "homes", "published", 1, null, null).total()).isEqualTo(2);
                assertThat(service.page("voter", "homes", "published", 1, null, null).nextCursor()).isEqualTo("1");
                assertThat(service.page("voter", "homes", "published", 10, null, false).total()).isEqualTo(1);
                excluded.setStatus("blocked"); work.membersChanged("homes");
                assertThat(users.findByUserId("group:homes:no-right").orElseThrow().getMenuCounters())
                        .containsEntry("announcement_published_votes", 0).containsEntry("announcement_published_notices", 0);
                var trash = service.action("admin", notice.id(), new Command("admin", "trash", null, publishedNotice.version()));
                assertThat(service.page("voter", "homes", "published", 10, null, null).total()).isEqualTo(1);
                assertThat(service.page("admin", "homes", "trash", 10, null, false).total()).isEqualTo(1);
                service.action("admin", notice.id(), new Command("admin", "restore", null, trash.version()));
                assertThat(service.page("admin", "homes", "trash", 10, null, false).total()).isZero();
                assertThat(service.page("admin", "homes", "draft", 10, null, false).total()).isEqualTo(1);
                assertThat(users.findAll()).allSatisfy(u -> assertThat(u.getActivities().game()).isEqualTo(7));
                assertThat(rows.findById(voted.id()).orElseThrow().voteCounters().pending()).isEmpty();
            }
        }
    }
    private static CommunityMember member(String id, boolean eligible) {
        var member = new CommunityMember(); member.setUserId(id); member.setRole("Member"); member.setStatus("accepted"); member.setVotingEligible(eligible); return member;
    }
}
