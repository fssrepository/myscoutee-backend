package com.raxim.myscoutee.domain.media.service;

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
import com.raxim.myscoutee.common.delivery.*;
import com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService;
import com.raxim.myscoutee.domain.media.api.*;
import com.raxim.myscoutee.domain.media.config.MediaStorageProperties;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;

@Tag("embedded")
class MediaDeletionRetryTest {
    @Test void originalJobDoesNotRetryAndWorkerPreservesPartialBatchAcknowledgments() {
        try (var running = Mongod.instance().start(Version.Main.V6_0)) {
            var address=running.current().getServerAddress();
            try (var client=MongoClients.create("mongodb://"+address.getHost()+":"+address.getPort())) {
                var mongo=new MongoTemplate(client,"media_retry");
                var storage=mock(MediaObjectStoreClient.class); when(storage.isEnabled()).thenReturn(true);
                var source=new MediaDeletionService(mongo,storage,new MediaStorageProperties());
                var worker=mock(OutboundRetryWorker.class); var changes=mock(MongoChangeStreamService.class);
                AtomicReference<OutboundRetryQueue> retry=new AtomicReference<>();
                when(worker.register(eq("mediaDeletionRetries"),eq("media-deletion"),any(),any())).thenAnswer(call -> {
                    var queue=new OutboundRetryQueue(mongo,"mediaDeletionRetries","media-deletion",new RetryPolicy(3,Duration.ofMillis(1)),
                            call.getArgument(2),call.getArgument(3)); retry.set(queue);return queue;
                });
                source.registerRetries(worker,changes);
                var handoff=ArgumentCaptor.forClass(Supplier.class);
                verify(changes).watch(eq("media-deletion-failure-handoff"),eq(Set.of("mediaDeletions")),anySet(),handoff.capture());
                AtomicInteger calls=new AtomicInteger(); List<List<String>> batches=new ArrayList<>();
                when(storage.deleteObjects(anyString(),anyList())).thenAnswer(call -> {
                    List<String> keys=List.copyOf(call.getArgument(1));batches.add(keys);
                    int attempt=calls.incrementAndGet();
                    if(attempt==1)return keys.stream().map(key->new MediaObjectStoreClient.DeleteFailure(key,"SlowDown")).toList();
                    if(attempt==2)return List.of(new MediaObjectStoreClient.DeleteFailure(keys.getFirst(),"SlowDown"));
                    return List.of();
                });
                List<String> keys=List.of("private/documents/owner/entity/a.pdf","private/documents/owner/entity/b.pdf","private/documents/owner/entity/c.pdf");
                JobGroupContext.run("myscoutee-work",()-> {
                    source.enqueue("myscoutee-work",keys.stream().map(key -> "/api/media/private?key=" + key).toList());
                    assertEquals(new MediaDeletionService.Result(0,3),source.process(Instant.now()));
                    assertEquals(new MediaDeletionService.Result(0,0),source.process(Instant.now().plusSeconds(3600)));
                });
                assertEquals(1,calls.get());
                handoff.getValue().get();
                var queue=retry.get();
                queue.execute(Objects.requireNonNull(queue.claim(Instant.now().plusSeconds(1))));
                queue.execute(Objects.requireNonNull(queue.claim(Instant.now().plusSeconds(1))));
                assertEquals(3,calls.get());
                assertEquals(List.of(3,3,1),batches.stream().map(List::size).toList());
                assertEquals(0,mongo.getCollection("mediaDeletions").countDocuments());
                var work=mongo.findAll(OutboundRetryTask.class,"mediaDeletionRetries").getFirst();
                assertEquals("completed",work.status());assertEquals(3,work.attemptCount());
                assertNull(queue.claim(Instant.now().plusSeconds(86400)));
            }
        }
    }
}
