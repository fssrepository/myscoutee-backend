package com.raxim.myscoutee.domain.events.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.events.document.EventTicket;

public interface EventTicketsRepository extends MongoRepository<EventTicket, String> {
    Optional<EventTicket> findByCode(String code);

    Optional<EventTicket> findByEventIdAndHolderUserIdAndStatus(
            String eventId,
            String holderUserId,
            String status);

    List<EventTicket> findByEventId(String eventId);

    List<EventTicket> findByHolderUserIdInAndStatus(java.util.Collection<String> holderUserIds, String status);

    List<EventTicket> findByHolderUserIdAndStatus(String holderUserId, String status);
}
