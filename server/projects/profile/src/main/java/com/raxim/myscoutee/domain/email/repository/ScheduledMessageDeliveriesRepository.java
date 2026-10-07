package com.raxim.myscoutee.domain.email.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.email.document.ScheduledMessageDelivery;

public interface ScheduledMessageDeliveriesRepository extends MongoRepository<ScheduledMessageDelivery, String> {
    List<ScheduledMessageDelivery> findByRunIdOrderByCreatedDateAsc(String runId);
}
