package com.raxim.myscoutee.domain.community.service;

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
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;

@Tag("embedded")
class CommunityCaseCounterRecoveryTest {
    @Test void commandsUseCurrentMembershipAndLifecycleWhileEditorAndConcurrentWritesRemainProtected() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "community-case-command-version");
                var cases = new MongoRepositoryFactory(mongo).getRepository(ServiceCasesRepository.class);
                var initial = cases.save(record("open", null, List.of("owner", "resident")));
                mongo.updateFirst(org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("_id").is(initial.id())),
                        new org.springframework.data.mongodb.core.query.Update()
                                .set("memberStates", Map.of("owner", "accepted", "resident", "invited")).inc("version", 0L), ServiceCase.class);
                var groups = mock(GroupDirectory.class);
                var service = new CommunityCasesService(cases, mock(com.raxim.myscoutee.domain.groups.api.CommunityAuthority.class),
                        groups, mock(com.raxim.myscoutee.domain.accounts.api.ProfileSummaries.class),
                        mock(com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.class),
                        mock(com.raxim.myscoutee.domain.chat.api.CaseConversations.class),
                        mock(com.raxim.myscoutee.domain.community.repository.ServiceOfferingsRepository.class), null, null, null);
                org.springframework.test.util.ReflectionTestUtils.setField(service, "counterWork",
                        new CommunityCaseCounterWork(cases, mock(MenuCounterUpdates.class), mock(CommunityMemberships.class), mongo, groups, null));
                assertThat(service.action("resident", initial.id(), command("join", initial.version())).version()).isEqualTo(initial.version() + 1);
                var left = service.action("owner", initial.id(), command("leave", initial.version()));
                assertThat(left.ownerAccountId()).isNull();
                assertThat(left.status()).isEqualTo("open");
                assertThat(cases.findById(initial.id()).orElseThrow().membershipStatus("resident")).isEqualTo("accepted");
                var claimed = service.action("resident", initial.id(), command("take-over", initial.version()));
                assertThat(claimed.ownerAccountId()).isEqualTo("resident");
                assertThatThrownBy(() -> service.action("owner", initial.id(), command("start", initial.version())))
                        .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
                assertThat(service.action("resident", initial.id(), command("start", initial.version())).status()).isEqualTo("in-progress");
                for (var action : List.of("start", "save-board-task", "edit-offer"))
                    assertThatThrownBy(() -> service.action("resident", initial.id(), command(action, initial.version())))
                            .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
                assertThatThrownBy(() -> service.save("resident", new com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.SaveCase(
                        "resident", initial.id(), "homes", "Stale title", "", "maintenance", false, List.of("resident"), initial.version())))
                        .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
                assertThat(service.action("resident", initial.id(), command("cancel", initial.version())).status()).isEqualTo("cancelled");
                assertThatThrownBy(() -> service.action("resident", initial.id(), command("complete", initial.version())))
                        .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
                assertThat(service.action("resident", initial.id(), command("reopen", initial.version())).status()).isEqualTo("open");
                var concurrentSnapshot = cases.findById(initial.id()).orElseThrow();
                var last = service.action("resident", initial.id(), command("leave", initial.version()));
                assertThat(last.status()).isEqualTo("trash");
                assertThat(last.ownerAccountId()).isNull();
                assertThatThrownBy(() -> cases.save(concurrentSnapshot))
                        .isInstanceOf(org.springframework.dao.OptimisticLockingFailureException.class);
            }
        }
    }
    private com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Command command(String action, Long version) {
        return new com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Command(
                "", action, version, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }
    @Test void markingReadKeepsAnOpenEditorVersionValidButBusinessWritesStillConflict() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "community-case-read-version");
                var cases = new MongoRepositoryFactory(mongo).getRepository(ServiceCasesRepository.class);
                var editor = cases.save(record("open", null, List.of("owner", "resident")));
                mongo.updateFirst(org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("_id").is(editor.id())),
                        new org.springframework.data.mongodb.core.query.Update()
                                .set("attentionAccountIds", List.of("resident")).inc("version", 0L), ServiceCase.class);
                assertThat(cases.markRead(editor.id(), "resident")).isEqualTo(1);
                assertThat(cases.markRead(editor.id(), "resident")).isZero();
                var read = cases.findById(editor.id()).orElseThrow();
                assertThat(read.attentionAccountIds()).isEmpty();
                assertThat(read.version()).isEqualTo(editor.version());
                assertThat(read.status()).isEqualTo("open");
                var started = cases.save(record("in-progress", editor.version(), editor.participantAccountIds()));
                assertThat(started.version()).isEqualTo(editor.version() + 1);
                assertThatThrownBy(() -> cases.save(record("completed", editor.version(), editor.participantAccountIds())))
                        .isInstanceOf(org.springframework.dao.OptimisticLockingFailureException.class);
            }
        }
    }
    @Test void partialDeliveryReplayAndMembershipChangesKeepStoredCountsAndEditorVersionsCorrect() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "community-counter-recovery");
                var factory = new MongoRepositoryFactory(mongo);
                var users = factory.getRepository(UsersRepository.class);
                var cases = factory.getRepository(ServiceCasesRepository.class);
                for (var id : List.of("owner", "resident", "admin", "new-admin")) {
                    var account = new Users(); account.setUserId(id);
                    account.setMenuCounters(Map.of("otherModule", 7)); users.save(account);
                }
                var accountWriter = new AccountMenuCounterService(mongo);
                var interrupted = mock(MenuCounterUpdates.class);
                when(interrupted.applyAll(anyList())).thenAnswer(call -> {
                    List<MenuCounterUpdates.Change> changes = call.getArgument(0);
                    accountWriter.apply(changes.getFirst());
                    throw new IllegalStateException("reply lost after first recipient commit");
                });
                var failingWriter = new CommunityCaseCounterWork(cases, interrupted, mock(CommunityMemberships.class), mongo, mock(GroupDirectory.class), null);
                assertThatThrownBy(() -> failingWriter.save(record("open", null, List.of("owner", "resident")), null, List.of("admin", "owner")))
                        .hasMessage("reply lost after first recipient commit");
                var pending = cases.findById("case").orElseThrow();
                var writer = new CommunityCaseCounterWork(cases, accountWriter, mock(CommunityMemberships.class), mongo, mock(GroupDirectory.class), null);
                writer.finish(pending); writer.finish(pending);
                var open = cases.findById("case").orElseThrow();
                assertThat(open.counterState().pending()).isEmpty();
                assertThat(open.version()).isEqualTo(pending.version());
                for (var id : List.of("owner", "resident", "admin"))
                    assertThat(users.findByUserId(id).orElseThrow().getMenuCounters())
                            .containsEntry("communityCases", 1).containsEntry("communityCase_open__maintenance", 1).containsEntry("otherModule", 7);
                var trashed = writer.save(record("trash", open.version(), List.of("owner", "resident")), open).record();
                assertThat(cases.findById("case").orElseThrow().version()).isEqualTo(trashed.version());
                assertThat(users.findByUserId("resident").orElseThrow().getMenuCounters())
                        .containsEntry("communityCases", 0).containsEntry("communityCase_open__maintenance", 0).containsEntry("communityCase_trash__maintenance", 1);
                var reopened = writer.save(record("open", trashed.version(), List.of("owner")), trashed).record();
                assertThat(users.findByUserId("resident").orElseThrow().getMenuCounters())
                        .containsEntry("communityCases", 0).containsEntry("communityCase_trash__maintenance", 0);
                org.springframework.test.util.ReflectionTestUtils.setField(writer, "tasks", factory.getRepository(com.raxim.myscoutee.domain.community.repository.CommunityScheduledTasksRepository.class));
                writer.groupAdminsChanged("homes", List.of("new-admin"));
                assertThat(users.findByUserId("admin").orElseThrow().getMenuCounters()).containsEntry("communityCases", 0);
                assertThat(users.findByUserId("owner").orElseThrow().getMenuCounters()).containsEntry("communityCases", 1);
                assertThat(users.findByUserId("new-admin").orElseThrow().getMenuCounters()).containsEntry("communityCases", 1);
                writer.groupAdminsChanged("homes", List.of("new-admin"));
                assertThat(users.findByUserId("new-admin").orElseThrow().getMenuCounters()).containsEntry("communityCases", 1);
                assertThatThrownBy(() -> cases.save(reopened)).isInstanceOf(org.springframework.dao.OptimisticLockingFailureException.class);
            }
        }
    }
    private ServiceCase record(String status, Long version, List<String> participants) {
        return new ServiceCase("case", "myscoutee-community", "homes", "owner", "Repair", "", "maintenance", status, false,
                participants, participants, List.of(), List.of(), List.of(), List.of(), null, null,
                "2026-10-13T10:00:00Z", "2026-10-13T10:00:00Z", version, Map.of(), List.of(), List.of());
    }
}
