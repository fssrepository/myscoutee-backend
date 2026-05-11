package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;

public interface NotificationOutboxRepository extends MongoRepository<NotificationOutboxItem, String> {
    Optional<NotificationOutboxItem> findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(
            String collapseKey,
            Collection<String> statuses,
            String createdDate);
}
