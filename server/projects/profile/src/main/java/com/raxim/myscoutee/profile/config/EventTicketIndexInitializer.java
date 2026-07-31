package com.raxim.myscoutee.profile.config;

import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.data.document.EventTicket;

import jakarta.annotation.PostConstruct;

@Component
public class EventTicketIndexInitializer {
    private final MongoTemplate mongoTemplate;

    public EventTicketIndexInitializer(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void ensureIndexes() {
        mongoTemplate.indexOps(EventTicket.class).createIndex(
                new Index()
                        .on("code", Direction.ASC)
                        .unique()
                        .named("event_ticket_code"));
        mongoTemplate.indexOps(EventTicket.class).createIndex(
                new Index()
                        .on("eventId", Direction.ASC)
                        .on("holderUserId", Direction.ASC)
                        .unique()
                        .named("event_ticket_event_holder"));
        mongoTemplate.indexOps(EventTicket.class).createIndex(
                new Index()
                        .on("eventId", Direction.ASC)
                        .on("usedAtIso", Direction.ASC)
                        .named("event_ticket_event_used"));
    }
}
