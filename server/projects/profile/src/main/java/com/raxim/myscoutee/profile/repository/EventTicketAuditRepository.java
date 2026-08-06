package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.EventTicketAudit;

public interface EventTicketAuditRepository extends MongoRepository<EventTicketAudit, String> {
    List<EventTicketAudit> findByTicketIdOrderByCreatedDateAsc(String ticketId);
}
