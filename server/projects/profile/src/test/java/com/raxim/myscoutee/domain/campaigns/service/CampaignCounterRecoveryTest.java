package com.raxim.myscoutee.domain.campaigns.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.AccountMenuCounterService;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.campaigns.repository.CampaignsRepository;

@Tag("embedded")
class CampaignCounterRecoveryTest {
    @Test
    void lostReplyAndRestartDoNotDoubleCountOrInvalidateTheReturnedEditorVersion() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "campaign-counter-recovery");
                var factory = new MongoRepositoryFactory(mongo);
                var users = factory.getRepository(UsersRepository.class);
                var campaigns = factory.getRepository(CampaignsRepository.class);
                var profile = new Users();
                profile.setUserId("owner"); profile.setWorkspaceGroupId("work");
                profile.setMenuCounters(Map.of("otherModule", 7));
                users.save(profile);
                var owner = new AccountMenuCounterService(mongo);
                var lostReply = mock(MenuCounterUpdates.class);
                when(lostReply.apply(any())).thenAnswer(call -> {
                    owner.apply(call.getArgument(0));
                    throw new IllegalStateException("lost reply after commit");
                });
                var interrupted = new CampaignCounterWork(campaigns, lostReply, mongo);
                assertThatThrownBy(() -> interrupted.save(record("draft", null), null))
                        .hasMessage("lost reply after commit");
                var pending = campaigns.findById("campaign").orElseThrow();
                assertThat(pending.counterChange()).isNotNull();
                var recovered = new CampaignCounterWork(campaigns, owner, mongo);
                recovered.finish(pending);
                recovered.finish(pending);
                assertThat(users.findByUserId("owner").orElseThrow().getMenuCounters())
                        .containsEntry("campaignsDrafts", 1).containsEntry("otherModule", 7);
                var draft = campaigns.findById("campaign").orElseThrow();
                assertThat(draft.counterChange()).isNull();
                assertThat(draft.version()).isEqualTo(pending.version());
                var published = recovered.save(record("published", draft.version()), draft);
                assertThat(published.owner().counters()).containsEntry("campaignsDrafts", 0)
                        .containsEntry("campaignsPublished", 1).containsEntry("otherModule", 7);
                var persisted = campaigns.findById("campaign").orElseThrow();
                assertThat(persisted.version()).isEqualTo(published.campaign().version());
                assertThat(persisted.counterChange()).isNull();
                assertThatThrownBy(() -> campaigns.save(draft))
                        .isInstanceOf(org.springframework.dao.OptimisticLockingFailureException.class);
                assertThatThrownBy(() -> owner.apply(new MenuCounterUpdates.Change("owner", "other-workspace",
                        "campaign-new", 1, Map.of("campaignsDrafts", 1))))
                        .isInstanceOf(IllegalStateException.class);
                assertThat(users.findByUserId("owner").orElseThrow().getMenuCounters())
                        .containsEntry("campaignsDrafts", 0).containsEntry("campaignsPublished", 1);
            }
        }
    }

    private Campaign record(String status, Long version) {
        return new Campaign("campaign", "work", "owner", "A campaign", "Description", "work", "creative",
                List.of(), List.of(), status, "2026-10-13T10:00:00Z", "2026-10-13T10:00:00Z", version);
    }
}
