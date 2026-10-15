package com.raxim.myscoutee.common.delivery;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.*;
import java.util.function.*;
import com.mongodb.client.MongoClients;
import org.junit.jupiter.api.*;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.affinity.document.AffinityAdminSignalOutbox;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;

@Tag("embedded")
class AdminProjectionSignalOutboxTest {
    @Test void hourlyJobSendsOnceAndFailureIsRetriedOnlyByTheSeparateWorker() {
        try(var running=Mongod.instance().start(Version.Main.V6_0)) {
            var address=running.current().getServerAddress();
            try(var client=MongoClients.create("mongodb://"+address.getHost()+":"+address.getPort())) {
                var mongo=new MongoTemplate(client,"admin_signal_retry");
                var changes=mock(MongoChangeStreamService.class);var worker=mock(OutboundRetryWorker.class);
                var jobs=mock(NotificationJobs.class);var admin=mock(OperationalTelemetry.class);
                AtomicReference<OutboundRetryQueue> retry=new AtomicReference<>();
                when(worker.register(anyString(),anyString(),any())).thenAnswer(call -> {
                    var queue=new OutboundRetryQueue(mongo,call.getArgument(0),call.getArgument(1),new RetryPolicy(3,Duration.ofMillis(1)),
                            call.getArgument(2), task -> {});retry.set(queue);return queue;
                });
                doAnswer(call -> {JobGroupContext.run("work",call.getArgument(1));return null;}).when(jobs).forEachGroup(eq("affinity-admin-signals"),any(Runnable.class));
                when(jobs.beginScheduledRun(anyString(),anyString(),anyString(),any())).thenReturn(mock(NotificationJobs.Configuration.class));
                AtomicInteger sends=new AtomicInteger();
                doAnswer(call -> {if(sends.incrementAndGet()<3)throw new IllegalStateException();return null;}).when(admin).signalProjectionInputs(any());
                var outbox=new AdminProjectionSignalOutbox(mongo,changes,new ScheduledMongoSessionRunner("same","same"),admin,"affinity",AffinityAdminSignalOutbox.class,jobs,worker);
                outbox.watch("rates",Set.of("userRates"),Set.of(),OperationalTelemetry.ProjectionInput.DERIVED);
                var changed=ArgumentCaptor.forClass(Supplier.class);
                verify(changes).watch(eq("rates"),eq(Set.of("userRates")),eq(Set.of()),changed.capture());
                changed.getValue().get();changed.getValue().get();
                verifyNoInteractions(admin); // Rate actions and the source watcher never call admin.
                outbox.flush();outbox.flush();
                assertEquals(1,sends.get());
                var queue=retry.get();queue.execute(Objects.requireNonNull(queue.claim(Instant.now().plusSeconds(1))));
                outbox.flush();assertEquals(2,sends.get());
                queue.execute(Objects.requireNonNull(queue.claim(Instant.now().plusSeconds(1))));
                outbox.flush();assertEquals(3,sends.get());
                var state=mongo.findById("inputs",AffinityAdminSignalOutbox.class);
                assertEquals(2L,state.deliveredDerivedRevision());
                verify(jobs,times(1)).beginScheduledRun(anyString(),anyString(),anyString(),any());
                verify(jobs).recordRun(eq("affinity-admin-signals"),eq(0),eq("failed"),anyString(),anyString(),any());
                assertNull(queue.claim(Instant.now().plusSeconds(86400)));
                changed.getValue().get();outbox.flush();assertEquals(4,sends.get()); // New work is a new batch, not an old retry budget reset.
            }
        }
    }
}
