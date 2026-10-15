package com.raxim.myscoutee.domain.community.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
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
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.AccountMenuCounterService;
import com.raxim.myscoutee.domain.community.document.CommunityScheduledTask;
import com.raxim.myscoutee.domain.community.repository.*;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.groups.api.*;

@Tag("embedded")
class CommunityTaskCounterRecoveryTest {
    @Test void lostReplyStatusChangesAndMembershipChangesPreserveStoredBuckets() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "task-counter-recovery");
                var factory = new MongoRepositoryFactory(mongo);
                var tasks = factory.getRepository(CommunityScheduledTasksRepository.class);
                var cases = factory.getRepository(ServiceCasesRepository.class);
                var users = factory.getRepository(UsersRepository.class);
                mongo.getCollection("users").insertMany(List.of(new Document("userId", "admin"), new Document("userId", "member")));
                var groups = mock(GroupDirectory.class);
                var group = mock(GroupView.class);
                when(group.id()).thenReturn("homes"); when(group.effectiveType()).thenReturn("community");
                doReturn(Optional.of(group)).when(groups).findById("homes");
                var memberships = mock(CommunityMemberships.class);
                var admin = member("admin", "Admin");
                var member = member("member", "Member");
                when(memberships.forGroup("homes")).thenReturn(List.of(admin, member));
                var accounts = new AccountMenuCounterService(mongo);
                var interrupted = mock(MenuCounterUpdates.class);
                when(interrupted.applyAll(any())).thenAnswer(call -> {
                    List<MenuCounterUpdates.Change> changes = call.getArgument(0);
                    accounts.apply(changes.getFirst());
                    throw new IllegalStateException("lost reply");
                });
                var broken = new CommunityCaseCounterWork(cases, interrupted, memberships, mongo, groups);
                ReflectionTestUtils.setField(broken, "tasks", tasks);
                assertThatThrownBy(() -> broken.saveTask(task(true, false, null), null)).hasMessage("lost reply");
                var stored = tasks.findById("task").orElseThrow();
                var writer = new CommunityCaseCounterWork(cases, accounts, memberships, mongo, groups);
                ReflectionTestUtils.setField(writer, "tasks", tasks);
                writer.saveTask(stored, stored);
                writer.saveTask(tasks.findById("task").orElseThrow(), tasks.findById("task").orElseThrow());
                for (var id : List.of("admin", "member"))
                    assertThat(users.findByUserId(id).orElseThrow().getMenuCounters()).containsEntry("communityTask_active", 1);
                stored = tasks.findById("task").orElseThrow();
                var paused = writer.saveTask(task(false, false, stored.version()), stored);
                assertThat(users.findByUserId("member").orElseThrow().getMenuCounters())
                        .containsEntry("communityTask_active", 0).containsEntry("communityTask_paused", 1);
                when(memberships.forGroup("homes")).thenReturn(List.of(admin));
                writer.groupAdminsChanged("homes", List.of("admin"));
                assertThat(users.findByUserId("member").orElseThrow().getMenuCounters()).containsEntry("communityTask_paused", 0);
                assertThatThrownBy(() -> writer.saveTask(task(true, false, paused.version()), paused))
                        .isInstanceOf(org.springframework.dao.OptimisticLockingFailureException.class);
                stored = tasks.findById("task").orElseThrow();
                var trashed = writer.saveTask(task(false, true, stored.version()), stored);
                var restored = writer.saveTask(task(true, false, trashed.version()), trashed);
                assertThat(users.findByUserId("admin").orElseThrow().getMenuCounters())
                        .containsEntry("communityTask_active", 1).containsEntry("communityTask_paused", 0).containsEntry("communityTask_trash", 0);
                assertThat(tasks.findById("task").orElseThrow().version()).isEqualTo(restored.version());
                assertThat(tasks.findById("task").orElseThrow().counterState().pending()).isEmpty();
            }
        }
    }
    private static CommunityMember member(String id, String role) {
        var member = mock(CommunityMember.class);
        when(member.getUserId()).thenReturn(id); when(member.getRole()).thenReturn(role); when(member.getStatus()).thenReturn("accepted");
        return member;
    }
    private static CommunityScheduledTask task(boolean enabled, boolean deleted, Long version) {
        return new CommunityScheduledTask("task", BaseGroups.COMMUNITY_BASE_ID, "homes", "admin", "Inspection", "Inspection", "maintenance",
                true, List.of(), "2026-11-01T09:00:00Z", "2026-11-01T09:00:00Z", "once", enabled, deleted,
                "2026-10-13T09:00:00Z", "2026-10-13T09:00:00Z", version);
    }
}
