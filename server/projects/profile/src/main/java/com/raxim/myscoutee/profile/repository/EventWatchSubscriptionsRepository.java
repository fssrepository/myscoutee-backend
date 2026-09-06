package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.EventWatchSubscription;

public interface EventWatchSubscriptionsRepository extends MongoRepository<EventWatchSubscription, String> {
    Optional<EventWatchSubscription> findByUserIdAndEventId(String userId, String eventId);

    List<EventWatchSubscription> findByUserIdOrderByUpdatedDateDesc(String userId);

    List<EventWatchSubscription> findByEventId(String eventId);

    List<EventWatchSubscription> findByUserIdAndEventIdIn(String userId, Collection<String> eventIds);

    long countByUserId(String userId);
}
