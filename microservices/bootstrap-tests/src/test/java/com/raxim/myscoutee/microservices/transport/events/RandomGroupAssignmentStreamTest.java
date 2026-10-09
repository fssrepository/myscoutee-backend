package com.raxim.myscoutee.microservices.transport.events;

import static org.junit.jupiter.api.Assertions.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.sun.net.httpserver.HttpServer;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;

/** Actual streamed HTTP; in particular, progress must arrive before the terminal result exists. */
class RandomGroupAssignmentStreamTest {
    private static final String TOKEN = "test-only-job-stream-capability-000000000000000000000";
    private static final byte[] PROGRESS = "{\"kind\":\"progress\",\"progressPercent\":25,\"detail\":\"Planning\"}\n".getBytes(StandardCharsets.UTF_8);
    private static final byte[] RESULT = "{\"kind\":\"result\",\"plans\":2,\"affectedUsers\":12}\n".getBytes(StandardCharsets.UTF_8);

    @Test void progressRunsOnCallerBeforeServerProducesResultAndKeepsScope() throws Exception {
        var callback = new CountDownLatch(1);
        var calls = new AtomicInteger();
        var peer = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        peer.createContext(RandomGroupAssignmentProtocol.RUN, exchange -> {
            calls.incrementAndGet();
            try (exchange) {
                if (!("Bearer " + TOKEN).equals(exchange.getRequestHeaders().getFirst("Authorization"))
                        || !"DEMO".equals(exchange.getRequestHeaders().getFirst("X-MyScoutee-Session-Mode"))) {
                    exchange.sendResponseHeaders(401, -1); return;
                }
                exchange.getRequestBody().readAllBytes();
                exchange.getResponseHeaders().set("Content-Type", "application/x-ndjson");
                exchange.sendResponseHeaders(200, 0);
                exchange.getResponseBody().write(PROGRESS); exchange.getResponseBody().flush();
                try { if (!callback.await(2, TimeUnit.SECONDS)) return; }
                catch (InterruptedException interrupted) { Thread.currentThread().interrupt(); return; }
                exchange.getResponseBody().write(RESULT);
            }
        });
        peer.start();
        var metrics = new SimpleMeterRegistry();
        try (var remote = client(peer, metrics, Duration.ofSeconds(4))) {
            var caller = Thread.currentThread();
            MongoSessionModeContext.set(MongoSessionMode.DEMO);
            var result = JobGroupContext.call("workspace", () -> remote.assignRandomGroups(progress -> {
                assertSame(caller, Thread.currentThread());
                assertEquals(MongoSessionMode.DEMO, MongoSessionModeContext.currentMode());
                assertEquals("workspace", JobGroupContext.groupId());
                assertEquals(25, progress.progressPercent()); callback.countDown();
            }));
            assertEquals(2, result.plans()); assertEquals(12, result.affectedUsers()); assertEquals(1, calls.get());
            assertFalse(JobGroupContext.isActive());
        } finally { metrics.close(); MongoSessionModeContext.clear(); peer.stop(0); }
    }

    @Test void partialDuplicateAndUnterminatedResultsAreNeverReportedSuccessfulOrRetried() throws Exception {
        for (String body : new String[]{new String(PROGRESS, StandardCharsets.UTF_8),
                new String(RESULT, StandardCharsets.UTF_8).stripTrailing(),
                new String(RESULT, StandardCharsets.UTF_8).repeat(2),
                "{\"kind\":\"result\",\"plans\":2}\n",
                "{\"kind\":\"error\",\"detail\":\"ASSIGNMENT_OUTCOME_UNKNOWN\"}\n"}) {
            var calls = new AtomicInteger();
            var peer = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            peer.createContext(RandomGroupAssignmentProtocol.RUN, exchange -> {
                calls.incrementAndGet();
                try (exchange) {
                    exchange.getRequestBody().readAllBytes();
                    var bytes = body.getBytes(StandardCharsets.UTF_8);
                    exchange.getResponseHeaders().set("Content-Type", "application/x-ndjson");
                    exchange.sendResponseHeaders(200, bytes.length); exchange.getResponseBody().write(bytes);
                }
            }); peer.start();
            var metrics = new SimpleMeterRegistry();
        try (var remote = client(peer, metrics, Duration.ofSeconds(2))) {
                assertThrows(RemoteReadException.class, () -> remote.assignRandomGroups(null));
                assertEquals(1, calls.get());
            } finally { metrics.close(); peer.stop(0); }
        }
    }

    private RemoteRandomGroupAssignment client(HttpServer peer, SimpleMeterRegistry metrics, Duration timeout) {
        return new RemoteRandomGroupAssignment(URI.create("http://127.0.0.1:" + peer.getAddress().getPort()),
                TOKEN, true, Duration.ofSeconds(1), timeout, new JsonConfig().objectMapper(), metrics);
    }
}
