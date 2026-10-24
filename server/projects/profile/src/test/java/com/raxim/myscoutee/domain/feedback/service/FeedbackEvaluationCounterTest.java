package com.raxim.myscoutee.domain.feedback.service;

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
import com.raxim.myscoutee.domain.feedback.document.FeedbackEvaluation;
import com.raxim.myscoutee.domain.groups.api.BaseGroups;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;

@Tag("embedded")
class FeedbackEvaluationCounterTest {
    @Test
    void transitionsKeepStoredBucketsAndCombinedFeedbackTotalWithoutReadTimeCounting() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://"+address.getHost()+":"+address.getPort())) {
                var mongo = spy(new MongoTemplate(client,"feedback-evaluation-counters"));
                var users = new MongoRepositoryFactory(mongo).getRepository(UsersRepository.class);
                mongo.getCollection("users").insertMany(List.of(
                        new Document("userId","viewer"),new Document("userId","provider"),
                        new Document("userId","viewer-community").append("workspaceGroupId",BaseGroups.COMMUNITY_BASE_ID)
                                .append("accountUserId","viewer").append("activities",new Document("feedback",99)
                                        .append("feedbackCounts",new Document("pending",2).append("ownEvents",1)))));
                var profiles=mock(ProfileSummaries.class);
                doAnswer(call -> users.findAll().stream().filter(u -> ((Collection<?>)call.getArgument(0)).contains(u.getUserId())).toList())
                        .when(profiles).findByUserIdIn(any());
                doAnswer(call -> users.findAll().stream().filter(u -> BaseGroups.COMMUNITY_BASE_ID.equals(u.getWorkspaceGroupId())
                        && ((Collection<?>)call.getArgument(1)).contains(u.getAccountUserId())).toList())
                        .when(profiles).findByWorkspaceGroupIdAndAccountUserIdIn(anyString(),any());
                var counters=spy(new AccountMenuCounterService(mongo));
                var service=new FeedbackEvaluationService(mongo,profiles,mock(NotificationDelivery.class),counters, null, null);
                var offerings=mock(com.raxim.myscoutee.domain.community.api.ServiceOfferings.class);
                org.springframework.test.util.ReflectionTestUtils.setField(service,"serviceOfferings",offerings);
                mongo.save(new FeedbackEvaluation("feedback",BaseGroups.COMMUNITY_BASE_ID,"case","Case",null,"provider","viewer",
                        "pending",Map.of(),null,"","2026-10-13T10:00:00Z",null,null));
                doAnswer(call -> {
                    List<MenuCounterUpdates.Change> changes = call.getArgument(0);
                    counters.apply(changes.getFirst());
                    throw new IllegalStateException("lost reply after recipient commit");
                }).when(counters).applyAll(any());
                assertThatThrownBy(() -> service.action("viewer", "feedback", new FeedbackEvaluationService.Command("viewer", "remove", null, null)))
                        .hasMessage("lost reply after recipient commit");
                assertThat(mongo.findById("feedback", FeedbackEvaluation.class).status()).isEqualTo("pending");
                doCallRealMethod().when(counters).applyAll(any());
                service.action("viewer","feedback",new FeedbackEvaluationService.Command("viewer","remove",null,null));
                assertThat(users.findByUserId("viewer").orElseThrow().getMenuCounters())
                        .containsEntry("feedbackEvaluation_pending",0).containsEntry("feedbackEvaluation_removed",1);
                assertThat(users.findByUserId("viewer-community").orElseThrow().getActivities().feedback()).isEqualTo(3);
                service.action("viewer","feedback",new FeedbackEvaluationService.Command("viewer","restore",null,null));
                assertThat(users.findByUserId("viewer-community").orElseThrow().getActivities().feedback()).isEqualTo(4);
                var scores=new HashMap<String,Double>();FeedbackEvaluationService.CRITERIA.forEach(k->scores.put(k,8d));
                service.action("viewer","feedback",new FeedbackEvaluationService.Command("viewer","submit",scores,"Good"));
                assertThat(users.findByUserId("viewer-community").orElseThrow().getActivities().feedback()).isEqualTo(3);
                assertThat(users.findByUserId("provider").orElseThrow().getMenuCounters()).containsEntry("feedbackEvaluation_received",1);
                assertThatThrownBy(() -> service.action("viewer", "feedback", new FeedbackEvaluationService.Command("viewer", "submit", scores, "Good")))
                        .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
                assertThat(users.findByUserId("provider").orElseThrow().getMenuCounters()).containsEntry("feedbackEvaluation_received", 1);
                clearInvocations(mongo);
                var page=service.window("viewer","feedbacked",0,20);
                assertThat(page.total()).isEqualTo(1);
                assertThat(page.items()).hasSize(1);
                assertThat(page.context()).containsEntry("pending",0L).containsEntry("feedbacked",1L).containsEntry("removed",0L);
                verify(mongo,never()).count(any(org.springframework.data.mongodb.core.query.Query.class),eq(FeedbackEvaluation.class));
                assertThat(mongo.findById("feedback",FeedbackEvaluation.class).counterState().pending()).isEmpty();
            }
        }
    }
}
