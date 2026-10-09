package com.raxim.myscoutee.microservices.transport.events;

import static org.junit.jupiter.api.Assertions.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.sun.net.httpserver.HttpServer;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;

class MeasurementStreamTest {
    private static final String TOKEN = "measurement-test-capability-000000000000000000000000";
    private static final Instant START = Instant.parse("2026-09-01T00:00:00Z"), END = START.plusSeconds(86400);
    private static final String ROW = "{\"kind\":\"evidence\",\"evidence\":{\"userId\":\"actor\",\"actionType\":\"join\",\"occurredAt\":\"2026-09-01T12:00:00Z\",\"sourceId\":\"event\"}}\n";
    private static final String COMPLETE = "{\"kind\":\"complete\",\"count\":1}\n";

    @Test void deliversFirstEvidenceBeforeEndOfBodyAndRetainsRequestScope() throws Exception {
        var consumed = new CountDownLatch(1);
        var peer = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        peer.createContext(EventMeasurementProtocol.JOINS, exchange -> {
            try (exchange) {
                var body = new JsonConfig().objectMapper().readTree(exchange.getRequestBody().readAllBytes());
                if (!("Bearer " + TOKEN).equals(exchange.getRequestHeaders().getFirst("Authorization"))
                        || !"DEMO".equals(exchange.getRequestHeaders().getFirst("X-MyScoutee-Session-Mode"))
                        || !"workspace".equals(body.get("groupId").asString())) { exchange.sendResponseHeaders(403, -1); return; }
                exchange.getResponseHeaders().set("Content-Type", "application/x-ndjson"); exchange.sendResponseHeaders(200, 0);
                exchange.getResponseBody().write(ROW.getBytes(StandardCharsets.UTF_8)); exchange.getResponseBody().flush();
                try { if (!consumed.await(2, TimeUnit.SECONDS)) return; }
                catch (InterruptedException interrupted) { Thread.currentThread().interrupt(); return; }
                exchange.getResponseBody().write(COMPLETE.getBytes(StandardCharsets.UTF_8));
            }
        }); peer.start();
        var metrics = new SimpleMeterRegistry();
        try (var remote = client(peer, metrics)) {
            MongoSessionModeContext.set(MongoSessionMode.DEMO);
            JobGroupContext.call("workspace", () -> {
                try (var cursor = remote.joins(START, END)) {
                    assertTrue(cursor.hasNext()); assertEquals("actor", cursor.next().userId()); consumed.countDown();
                    assertFalse(cursor.hasNext()); assertThrows(java.util.NoSuchElementException.class, cursor::next);
                }
                return null;
            });
            assertFalse(JobGroupContext.isActive());
        } finally { metrics.close(); MongoSessionModeContext.clear(); peer.stop(0); }
    }

    @Test void missingWrongDuplicateAndOutOfOrderTerminalEvidenceFailsWithoutRetry() throws Exception {
        for (String body : new String[]{ROW, ROW + "{\"kind\":\"complete\",\"count\":2}\n", ROW + COMPLETE + COMPLETE,
                ROW + ROW.replace("\"actor\"", "\"aaa\"") + "{\"kind\":\"complete\",\"count\":2}\n"}) {
            var calls = new AtomicInteger();
            var peer = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            peer.createContext(EventMeasurementProtocol.JOINS, exchange -> {
                calls.incrementAndGet();
                try (exchange) {
                    exchange.getRequestBody().readAllBytes(); var bytes = body.getBytes(StandardCharsets.UTF_8);
                    exchange.getResponseHeaders().set("Content-Type", "application/x-ndjson"); exchange.sendResponseHeaders(200, bytes.length);
                    exchange.getResponseBody().write(bytes);
                }
            }); peer.start();
            var metrics = new SimpleMeterRegistry();
        try (var remote = client(peer, metrics)) {
                assertThrows(RemoteReadException.class, () -> { try (var cursor = remote.joins(START, END)) { while (cursor.hasNext()) cursor.next(); } });
                assertEquals(1, calls.get());
            } finally { metrics.close(); peer.stop(0); }
        }
    }
    private RemoteEventMeasurement client(HttpServer peer, SimpleMeterRegistry metrics) {
        return new RemoteEventMeasurement(URI.create("http://127.0.0.1:" + peer.getAddress().getPort()), TOKEN, true,
                Duration.ofSeconds(1), Duration.ofSeconds(4), new JsonConfig().objectMapper(), metrics);
    }
}
