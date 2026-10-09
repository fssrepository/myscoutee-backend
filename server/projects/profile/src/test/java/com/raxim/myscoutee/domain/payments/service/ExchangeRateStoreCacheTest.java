package com.raxim.myscoutee.domain.payments.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

@Tag("standard")
class ExchangeRateStoreCacheTest {
    @Configuration(proxyBeanMethods = false) @EnableCaching static class Caching {}

    @Test
    @SuppressWarnings({"unchecked", "rawtypes"})
    void remoteInvalidationCannotLeaveAnOlderConcurrentLoadCached() {
        var mongo = mock(MongoTemplate.class, RETURNS_DEEP_STUBS);
        var changes = mock(MongoChangeStreamService.class);
        var reads = new AtomicInteger();
        var entered = new CountDownLatch(1);
        var release = new CountDownLatch(1);
        var rows = mongo.getCollection("exchangeRates").find(any(Document.class)).sort(any(Document.class))
                .limit(400).map(any(com.mongodb.Function.class));
        when(rows.into(any())).thenAnswer(call -> {
            int read = reads.incrementAndGet();
            if (read == 1) { entered.countDown(); assertThat(release.await(3, TimeUnit.SECONDS)).isTrue(); }
            return List.of(new Document("revision", read));
        });
        new ApplicationContextRunner().withUserConfiguration(Caching.class)
                .withBean(MongoTemplate.class, () -> mongo)
                .withBean(MongoChangeStreamService.class, () -> changes)
                .withBean(org.springframework.cache.CacheManager.class, () -> new ConcurrentMapCacheManager("exchange_rates"))
                .withBean(ExchangeRateStore.class).run(context -> {
                    var store = context.getBean(ExchangeRateStore.class);
                    var callback = org.mockito.ArgumentCaptor.forClass(Supplier.class);
                    verify(changes).watch(eq("exchange-rate-cache"), any(), any(), callback.capture());
                    var executor = java.util.concurrent.Executors.newFixedThreadPool(2);
                    try {
                        var old = executor.submit(store::observations);
                        assertThat(entered.await(3, TimeUnit.SECONDS)).isTrue();
                        var invalidation = executor.submit(() -> callback.getValue().get());
                        release.countDown();
                        old.get(3, TimeUnit.SECONDS); invalidation.get(3, TimeUnit.SECONDS);
                        assertThat(store.observations().getFirst().getInteger("revision")).isEqualTo(2);
                        store.observations(); assertThat(reads.get()).isEqualTo(2);
                        MongoSessionModeContext.set(MongoSessionMode.DEMO);
                        store.observations(); assertThat(reads.get()).isEqualTo(3);
                        JobGroupContext.run("default", store::observations);
                        assertThat(reads.get()).isEqualTo(4); // literal group ID differs from null
                        store.save(List.of()); // local mutation path evicts every physical-DB alias
                        MongoSessionModeContext.set(MongoSessionMode.REAL);
                        store.observations(); assertThat(reads.get()).isEqualTo(5);
                    } finally { release.countDown(); executor.shutdownNow(); MongoSessionModeContext.clear(); }
                });
    }
}
