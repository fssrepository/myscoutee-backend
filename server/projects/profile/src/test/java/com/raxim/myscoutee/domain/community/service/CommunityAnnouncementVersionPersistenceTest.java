package com.raxim.myscoutee.domain.community.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import org.springframework.test.util.ReflectionTestUtils;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.community.document.CommunityAnnouncement;
import com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.*;
import com.raxim.myscoutee.domain.community.repository.CommunityAnnouncementsRepository;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.groups.api.CommunityAuthority;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;

@Tag("embedded")
class CommunityAnnouncementVersionPersistenceTest {
    @Test void concurrentClosureAcknowledgementsDoNotInvalidateTheReturnedEditorVersion() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "announcement-versions");
                var records = new MongoRepositoryFactory(mongo).getRepository(CommunityAnnouncementsRepository.class);
                var access = mock(CommunityAuthority.class);
                var users = mock(ProfileSummaries.class);
                var notifications = mock(NotificationDelivery.class);
                var service = new CommunityAnnouncementsService(records, access, mongo, users, notifications);
                ReflectionTestUtils.setField(service, "voteCounters", mock(CommunityVoteCounterWork.class));
                var groups = mock(GroupDirectory.class);
                ReflectionTestUtils.setField(service, "groups", groups);
                when(groups.activeCommunityIds(anyCollection())).thenReturn(Set.of("homes"));
                when(access.admin("homes", "admin")).thenReturn(true);
                var resident = new CommunityMember(); resident.setUserId("resident"); resident.setVotingEligible(true);
                when(access.roster("homes")).thenReturn(List.of(resident));
                var profile = mock(ProfileSummary.class); when(profile.getUserId()).thenReturn("group:homes:resident");
                doReturn(List.of(profile)).when(users).findByWorkspaceGroupIdAndAccountUserIdIn(eq("homes"), anyCollection());
                var ballot = new CommunityAnnouncement.Ballot("resident", "yes", "2026-10-05T09:00:00.000Z");
                var original = records.insert(new CommunityAnnouncement("vote", "homes", "admin", "Title", "Body", List.of(),
                        "published", true, "2099-01-01T18:00:00.000Z", null, null, List.of(ballot),
                        "2026-10-05T08:00:00.000Z", "2026-10-05T08:00:00.000Z", "2026-10-05T08:00:00.000Z", null));
                // The scheduled worker observes the close before its HTTP notification is acknowledged.
                var overlap = new AtomicBoolean(true);
                doAnswer(call -> {
                    if (overlap.getAndSet(false)) JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID,
                            () -> assertThat(service.closeDue(Instant.now())).isEqualTo(1));
                    return java.util.Optional.empty();
                }).when(notifications).enqueueOnce(anyString(), any());
                var closed = service.action("admin", "vote", new Command("admin", "close", null, original.version()));
                var stored = records.findById("vote").orElseThrow();
                assertThat(closed.version()).isEqualTo(original.version() + 1);
                assertThat(stored.version()).isEqualTo(closed.version());
                assertThat(stored.closureNotifiedAtIso()).isNotNull();
                assertThat(service.detail("admin", "vote").version()).isEqualTo(closed.version());
                var edit = new Save("admin", "vote", "homes", "Title", "Body", List.of(), true,
                        "2099-02-01T18:00:00.000Z", closed.version());
                var reopened = service.save("admin", edit);
                assertThat(reopened.closed()).isFalse();
                assertThat(reopened.results()).containsEntry("yes", 1);
                assertThat(records.findById("vote").orElseThrow().ballots()).containsExactly(ballot);
                assertThatThrownBy(() -> service.save("admin", edit))
                        .isInstanceOfSatisfying(org.springframework.web.server.ResponseStatusException.class,
                                error -> assertThat(error.getStatusCode().value()).isEqualTo(409));
            }
        }
    }
}
