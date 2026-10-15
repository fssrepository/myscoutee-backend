package com.raxim.myscoutee.common.delivery;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.function.Supplier;
import java.net.*;
import java.net.http.*;
import com.sun.net.httpserver.HttpServer;
import com.mongodb.client.*;
import org.junit.jupiter.api.*;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;

@Tag("embedded")
class OutboundRetryWorkerTest {
    @Test void boundedWorkerStressUsesRealHttpAndPreservesDatabaseScope() throws Exception {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://"+address.getHost()+":"+address.getPort());
                 var httpWorkers = Executors.newFixedThreadPool(10)) {
                var mongo = new MongoTemplate(new SessionRoutingMongoDatabaseFactory(
                        new SimpleMongoClientDatabaseFactory(client, "retry_real"),
                        new SimpleMongoClientDatabaseFactory(client, "retry_demo")));
                var changes = mock(MongoChangeStreamService.class);
                var provider = mock(ObjectProvider.class);
                var calls = new ConcurrentHashMap<String, AtomicInteger>();
                AtomicInteger active = new AtomicInteger(), maximum = new AtomicInteger();
                var firstWave = new CountDownLatch(10);
                var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
                server.setExecutor(httpWorkers);
                server.createContext("/send", exchange -> {
                    int inFlight = active.incrementAndGet(); maximum.accumulateAndGet(inFlight, Math::max);
                    try {
                        String[] values=exchange.getRequestURI().getQuery().split("&");
                        int id=Integer.parseInt(values[0]), attempt=Integer.parseInt(values[1]);
                        calls.computeIfAbsent(values[0], ignored -> new AtomicInteger()).incrementAndGet();
                        firstWave.countDown();
                        try { firstWave.await(2, TimeUnit.SECONDS); }
                        catch (InterruptedException error) { Thread.currentThread().interrupt(); }
                        int status=id%3==0 || attempt==2 && id%2==0 ? 503 : 200;
                        exchange.sendResponseHeaders(status, -1);
                    } finally {active.decrementAndGet(); exchange.close();}
                });
                server.start();
                try (var http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
                     var worker = new OutboundRetryWorker(mongo, changes, provider, 10, 10)) {
                    var queue = worker.register("ownerRetries", "test-http", task -> {
                        assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
                        try {
                            var response = http.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:"+server.getAddress().getPort()+"/send?"+task.id()+"&"+task.attemptCount()))
                                    .timeout(Duration.ofSeconds(5)).POST(HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.discarding());
                            if(response.statusCode()!=200) throw new IllegalStateException("upstream unavailable");
                        } catch (java.io.IOException error) { throw new IllegalStateException(error); }
                        catch (InterruptedException error) {Thread.currentThread().interrupt(); throw new IllegalStateException(error);}
                    });
                    var callback=ArgumentCaptor.forClass(Supplier.class);
                    verify(changes).watch(eq("outbound-retry-ownerRetries"), eq(Set.of("ownerRetries")), anySet(), callback.capture());
                    MongoSessionModeContext.set(MongoSessionMode.DEMO);
                    for(int i=0;i<40;i++) queue.failed(Integer.toString(i), Map.of("value", i), List.of(), new IllegalStateException(), Instant.now().minusSeconds(1));
                    MongoSessionModeContext.set(MongoSessionMode.REAL);
                    assertEquals(0, mongo.getCollection("ownerRetries").countDocuments());
                    MongoSessionModeContext.set(MongoSessionMode.DEMO);
                    var os=(com.sun.management.OperatingSystemMXBean) java.lang.management.ManagementFactory.getOperatingSystemMXBean();
                    long cpu=os.getProcessCpuTime(), start=System.nanoTime();
                    long deadline=start+TimeUnit.SECONDS.toNanos(20);
                    while(mongo.getCollection("ownerRetries").countDocuments(new org.bson.Document("status",new org.bson.Document("$in",List.of("completed","failed"))).append("reportAt", null))<40 && System.nanoTime()<deadline) {
                        callback.getValue().get(); Thread.sleep(10);
                    }
                    long elapsed=(System.nanoTime()-start)/1_000_000, cpuMillis=(os.getProcessCpuTime()-cpu)/1_000_000;
                    var rows=mongo.findAll(OutboundRetryTask.class,"ownerRetries");
                    assertEquals(40, rows.size());
                    assertEquals(10, maximum.get());
                    for(var row:rows) {
                        int id=Integer.parseInt(row.id());
                        assertEquals(id%3==0?"failed":"completed",row.status());
                        assertTrue(row.attemptCount()<=3);
                        assertEquals(row.attemptCount()-1,calls.get(row.id()).get());
                        assertNull(row.nextAttemptAt());
                    }
                    int totalCalls=calls.values().stream().mapToInt(AtomicInteger::get).sum();
                    for(int i=0;i<3;i++) callback.getValue().get();
                    assertEquals(totalCalls,calls.values().stream().mapToInt(AtomicInteger::get).sum());
                    System.out.println("RETRY_STRESS tasks=40 maxConcurrent="+maximum.get()+" calls="+totalCalls+" elapsedMs="+elapsed+" cpuMs="+cpuMillis);
                } finally {server.stop(0); MongoSessionModeContext.clear();}
            }
        }
    }
    @Test void workerCapacityCannotBeUnbounded() {
        assertThrows(IllegalArgumentException.class, () -> new OutboundRetryWorker(null,null,null,0,60_000));
        assertThrows(IllegalArgumentException.class, () -> new OutboundRetryWorker(null,null,null,11,60_000));
    }
}
