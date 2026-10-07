package com.raxim.myscoutee.domain.events.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.events.document.EventTicketAudit;

public interface EventTicketAuditRepository extends MongoRepository<EventTicketAudit, String> {
    List<EventTicketAudit> findByTicketIdOrderByCreatedDateAsc(String ticketId);
}
