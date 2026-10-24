package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import org.springframework.test.util.ReflectionTestUtils;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.AccountMenuCounterService;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;

@Tag("embedded")
class CommunityMembershipCounterPersistenceTest {
    @Test void acknowledgedCounterDoesNotBlockRightsChangesAndLostRepliesDoNotDoubleCount() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "group-membership-counters");
                var factory = new MongoRepositoryFactory(mongo);
                var members = factory.getRepository(ActivityMembersRepository.class);
                var users = factory.getRepository(UsersRepository.class);
                var account = new Users(); account.setUserId("account"); users.save(account);
                var counters = spy(new AccountMenuCounterService(mongo));
                var service = new CommunityMembershipService(members, null, null);
                ReflectionTestUtils.setField(service, "mongo", mongo);
                ReflectionTestUtils.setField(service, "counters", counters);
                var member = new CommunityMember();
                member.setId("membership"); member.setOwnerType("community"); member.setOwnerId("homes");
                member.setUserId("account"); member.setStatus("accepted"); member.setRole("Admin");
                member.setActionAtIso("before"); member.setVotingEligible(true);
                service.register(member);
                // Delivery acknowledges with an explicit null, while the object mapper omits null fields.
                var stored = mongo.getCollection("activityMembers").find(new Document("_id", "membership")).first();
                assertThat(stored.get("groupCounterState", Document.class)).containsKey("pending");
                assertThat(service.transition("membership", "accepted", "Admin", "before", "accepted", "Admin",
                        null, null, false, "revoked", "revoke-vote", "account", null, false)).isEqualTo(1);
                assertThat(members.findById("membership").orElseThrow().getVotingEligible()).isFalse();
                assertThat(users.findByUserId("account").orElseThrow().getMenuCounters()).containsEntry("groups_hosting", 1);
                // A second same-bucket write also works when saving omitted the null field.
                assertThat(service.transition("membership", "accepted", "Admin", "revoked", "accepted", "Admin",
                        null, null, false, "granted", "grant-vote", "account", null, true)).isEqualTo(1);
                assertThat(service.transition("membership", "accepted", "Admin", "before", "accepted", "Admin",
                        null, null, false, "stale", "revoke-vote", "account", null, false)).isZero();

                doAnswer(call -> {
                    List<MenuCounterUpdates.Change> changes = call.getArgument(0);
                    changes.forEach(counters::apply);
                    throw new IllegalStateException("lost reply after counter commit");
                }).when(counters).applyAll(any());
                assertThatThrownBy(() -> service.transition("membership", "accepted", "Admin", "granted", "accepted", "Member",
                        null, null, false, "stepped-down", "step-down-admin", "account", null, true))
                        .hasMessage("lost reply after counter commit");
                assertThat(members.findById("membership").orElseThrow().getGroupCounterState().pending()).isNotNull();
                doCallRealMethod().when(counters).applyAll(any());
                assertThat(service.transition("membership", "accepted", "Member", "stepped-down", "accepted", "Member",
                        null, null, false, "revoked-again", "revoke-vote", "account", null, false)).isEqualTo(1);
                assertThat(members.findById("membership").orElseThrow().getGroupCounterState().pending()).isNull();
                assertThat(users.findByUserId("account").orElseThrow().getMenuCounters())
                        .containsEntry("groups_hosting", 0).containsEntry("groups_participation", 1);
            }
        }
    }
}
