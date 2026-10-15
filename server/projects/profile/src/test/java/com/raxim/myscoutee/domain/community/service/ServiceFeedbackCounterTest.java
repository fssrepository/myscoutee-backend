package com.raxim.myscoutee.domain.community.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.AccountMenuCounterService;
import com.raxim.myscoutee.domain.community.document.ServiceFeedback;
import com.raxim.myscoutee.domain.groups.api.BaseGroups;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;

@Tag("embedded")
class ServiceFeedbackCounterTest {
    @Test
    void transitionsKeepStoredBucketsAndCombinedFeedbackTotalWithoutReadTimeCounting() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://"+address.getHost()+":"+address.getPort())) {
                var mongo = spy(new MongoTemplate(client,"service-feedback-counters"));
                var users = new MongoRepositoryFactory(mongo).getRepository(UsersRepository.class);
                mongo.getCollection("users").insertMany(List.of(
                        new Document("userId","viewer"),new Document("userId","provider"),
                        new Document("userId","viewer-community").append("workspaceGroupId",BaseGroups.COMMUNITY_BASE_ID)
                                .append("accountUserId","viewer").append("activities",new Document("feedback",99)
                                        .append("eventFeedback",new Document("pending",2).append("ownEvents",1)))));
                var profiles=mock(ProfileSummaries.class);
                doAnswer(call -> users.findAll().stream().filter(u -> ((Collection<?>)call.getArgument(0)).contains(u.getUserId())).toList())
                        .when(profiles).findByUserIdIn(any());
                doAnswer(call -> users.findAll().stream().filter(u -> BaseGroups.COMMUNITY_BASE_ID.equals(u.getWorkspaceGroupId())
                        && ((Collection<?>)call.getArgument(1)).contains(u.getAccountUserId())).toList())
                        .when(profiles).findByWorkspaceGroupIdAndAccountUserIdIn(anyString(),any());
                var counters=spy(new AccountMenuCounterService(mongo));
                var service=new ServiceFeedbackService(mongo,profiles,mock(NotificationDelivery.class),counters);
                mongo.save(new ServiceFeedback("feedback",BaseGroups.COMMUNITY_BASE_ID,"case","Case",null,"provider","viewer",
                        "pending",Map.of(),null,"","2026-10-13T10:00:00Z",null,null));
                doAnswer(call -> {
                    List<MenuCounterUpdates.Change> changes = call.getArgument(0);
                    counters.apply(changes.getFirst());
                    throw new IllegalStateException("lost reply after recipient commit");
                }).when(counters).applyAll(any());
                assertThatThrownBy(() -> service.action("viewer", "feedback", new ServiceFeedbackService.Command("viewer", "remove", null, null)))
                        .hasMessage("lost reply after recipient commit");
                assertThat(mongo.findById("feedback", ServiceFeedback.class).status()).isEqualTo("pending");
                doCallRealMethod().when(counters).applyAll(any());
                service.action("viewer","feedback",new ServiceFeedbackService.Command("viewer","remove",null,null));
                assertThat(users.findByUserId("viewer").orElseThrow().getMenuCounters())
                        .containsEntry("serviceFeedback_pending",0).containsEntry("serviceFeedback_removed",1);
                assertThat(users.findByUserId("viewer-community").orElseThrow().getActivities().feedback()).isEqualTo(3);
                service.action("viewer","feedback",new ServiceFeedbackService.Command("viewer","restore",null,null));
                assertThat(users.findByUserId("viewer-community").orElseThrow().getActivities().feedback()).isEqualTo(4);
                var scores=new HashMap<String,Double>();ServiceFeedbackService.CRITERIA.forEach(k->scores.put(k,8d));
                service.action("viewer","feedback",new ServiceFeedbackService.Command("viewer","submit",scores,"Good"));
                assertThat(users.findByUserId("viewer-community").orElseThrow().getActivities().feedback()).isEqualTo(3);
                assertThat(users.findByUserId("provider").orElseThrow().getMenuCounters()).containsEntry("serviceFeedback_received",1);
                assertThatThrownBy(() -> service.action("viewer", "feedback", new ServiceFeedbackService.Command("viewer", "submit", scores, "Good")))
                        .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
                assertThat(users.findByUserId("provider").orElseThrow().getMenuCounters()).containsEntry("serviceFeedback_received", 1);
                clearInvocations(mongo);
                var page=service.page("viewer","feedbacked",20,null);
                assertThat(page.total()).isEqualTo(1);
                assertThat(page.items()).hasSize(1);
                assertThat(page.context()).containsEntry("pending",0L).containsEntry("feedbacked",1L).containsEntry("removed",0L);
                verify(mongo,never()).count(any(org.springframework.data.mongodb.core.query.Query.class),eq(ServiceFeedback.class));
                assertThat(mongo.findById("feedback",ServiceFeedback.class).counterState().pending()).isEmpty();
            }
        }
    }
}
