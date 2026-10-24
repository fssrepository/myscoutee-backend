package com.raxim.myscoutee.microservices.transport.notifications;

import java.net.URI;
import java.time.Duration;
import java.util.Optional;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteNotificationCatalog extends RemoteReadTransport implements NotificationCatalog {
    public RemoteNotificationCatalog(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public long countUnread(String userId) {
        return exchange(queryPath(NotificationCatalogProtocol.UNREAD, "userId", userId), new TypeReference<Long>() {},
                "notifications.unread-count", 4096, value -> value >= 0);
    }
    @Override public long failedJobs(String baseGroupId) {
        return exchange(queryPath(NotificationCatalogProtocol.FAILED_JOBS, "baseGroupId", baseGroupId), new TypeReference<Long>() {},
                "notifications.failed-jobs", 4096, value -> value >= 0);
    }
    @Override public long countOutbox(String baseGroupId, String status) {
        return exchange(queryPath(NotificationCatalogProtocol.OUTBOX, "baseGroupId", baseGroupId, "status", status), new TypeReference<Long>() {},
                "notifications.outbox-count", 4096, value -> value >= 0);
    }
    @Override public Optional<Template> findByTemplateKey(String templateKey) {
        try {
            return Optional.of(exchange(queryPath(NotificationCatalogProtocol.TEMPLATE, "templateKey", templateKey), new TypeReference<Template>() {},
                    "notifications.template", 2 * 1024 * 1024, value -> true));
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return Optional.empty();
            throw failure;
        }
    }
}
