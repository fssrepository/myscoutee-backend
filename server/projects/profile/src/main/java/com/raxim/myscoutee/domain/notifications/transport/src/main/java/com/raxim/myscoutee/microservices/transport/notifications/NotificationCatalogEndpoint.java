package com.raxim.myscoutee.microservices.transport.notifications;

import java.util.function.Supplier;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog;
import com.raxim.myscoutee.microservices.transport.notifications.NotificationCatalogProtocol.Error;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public final class NotificationCatalogEndpoint {
    private final NotificationCatalog catalog;
    public NotificationCatalogEndpoint(NotificationCatalog catalog) { this.catalog = catalog; }
    @GetMapping(value = NotificationCatalogProtocol.UNREAD, produces = "application/json")
    public ResponseEntity<?> unread(@RequestParam(required = false) String userId) {
        return read(() -> catalog.countUnread(userId), userId);
    }
    @GetMapping(value = NotificationCatalogProtocol.FAILED_JOBS, produces = "application/json")
    public ResponseEntity<?> failedJobs(@RequestParam(required = false) String baseGroupId) {
        return read(() -> catalog.failedJobs(baseGroupId), baseGroupId);
    }
    @GetMapping(value = NotificationCatalogProtocol.OUTBOX, produces = "application/json")
    public ResponseEntity<?> outbox(@RequestParam(required = false) String baseGroupId, @RequestParam(required = false) String status) {
        return read(() -> catalog.countOutbox(baseGroupId, status), baseGroupId, status);
    }
    @GetMapping(value = NotificationCatalogProtocol.TEMPLATE, produces = "application/json")
    public ResponseEntity<?> template(@RequestParam(required = false) String templateKey) {
        return read(() -> catalog.findByTemplateKey(templateKey).orElse(null), templateKey);
    }
    private ResponseEntity<?> read(Supplier<?> read, String... parameters) {
        return com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.lookup(
                read, Error::new, "NOTIFICATION_CATALOG_UNAVAILABLE", parameters);
    }

}
