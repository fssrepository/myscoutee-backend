package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.EventTicket;

public interface EventTicketsRepository extends MongoRepository<EventTicket, String> {
    Optional<EventTicket> findByCode(String code);

    Optional<EventTicket> findByEventIdAndHolderUserId(String eventId, String holderUserId);
}
