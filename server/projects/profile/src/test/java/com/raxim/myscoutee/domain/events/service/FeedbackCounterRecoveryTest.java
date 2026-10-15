package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.accounts.dto.FeedbackOwnersDto;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.events.document.EventFeedbackState;
import com.raxim.myscoutee.domain.events.repository.EventFeedbackStatesRepository;

@Tag("embedded")
class FeedbackCounterRecoveryTest {
    @Test
    void committedDeltaAndLostReplyRecoverWithoutMovingBucketsTwiceOrOverwritingOtherCounters() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "feedback-recovery");
                var factory = new MongoRepositoryFactory(mongo);
                var users = factory.getRepository(UsersRepository.class);
                var states = factory.getRepository(EventFeedbackStatesRepository.class);
                mongo.getCollection("users").insertMany(List.of(
                        new Document("userId", "viewer").append("menuCounters", new Document("feedback", 2))
                                .append("activities", new Document("contacts", 9).append("feedback", 3)
                                .append("eventFeedback", new Document("pending", 1).append("ownEvents", 0).append("feedbacked", 0).append("removed", 0))),
                        new Document("userId", "host").append("activities", new Document("feedback", 4)
                                .append("eventFeedback", new Document("pending", 0).append("ownEvents", 4).append("feedbacked", 0).append("removed", 0)))));
                var owner = new UserActivityCountersService(users, null, null, null, null, null, null, mongo, null);
                var brokenReply = mock(ActivityCounters.class);
                when(brokenReply.applyFeedbackReceipt(any())).thenAnswer(call -> {
                    owner.applyFeedbackReceipt(call.getArgument(0));
                    throw new IllegalStateException("lost counter reply after commit");
                });
                @SuppressWarnings("unchecked") var provider = (ObjectProvider<ActivityCounters>) mock(ObjectProvider.class);
                when(provider.getObject()).thenReturn(brokenReply);
                var work = new FeedbackCounterWork(states, mongo, provider, null);
                var state = new EventFeedbackState(); state.setViewerUserId("viewer"); state.setEventId("event");
                state.setSubmittedAtIso("2026-10-09T00:00:00Z");
                work.prepareTransition(state, new FeedbackOwnersDto("host", "host", List.of("host")), false, false, true, false);
                state = states.save(state);
                var saved = state;
                var receipt = state.getCounterChange();
                assertThatThrownBy(() -> work.finish(saved)).hasMessageContaining("lost counter reply");
                assertThat(states.findById(state.getId()).orElseThrow().getCounterChange()).isNotNull();
                assertThat(owner.applyFeedbackReceipt(receipt)).isZero();
                when(provider.getObject()).thenReturn(owner);
                var resumed = new FeedbackCounterWork(states, mongo, provider, null).finish(states.findById(state.getId()).orElseThrow());
                assertThat(resumed.getCounterChange()).isNull();
                assertThat(states.findById(state.getId()).orElseThrow().getCounterChange()).isNull();
                var viewer = users.findByUserId("viewer").orElseThrow();
                assertThat(viewer.getActivities().contacts()).isEqualTo(9);
                assertThat(viewer.getActivities().eventFeedback().pending()).isZero();
                assertThat(viewer.getActivities().eventFeedback().feedbacked()).isEqualTo(1);
                assertThat(viewer.getActivities().feedback()).isEqualTo(2);
                assertThat(users.findByUserId("host").orElseThrow().getActivities().eventFeedback().ownEvents()).isEqualTo(5);
                // A state loaded before receipt acknowledgment cannot erase the next operation.
                saved.setOrganizerNote("stale write");
                assertThatThrownBy(() -> states.save(saved)).isInstanceOf(org.springframework.dao.OptimisticLockingFailureException.class);
            }
        }
    }
}
