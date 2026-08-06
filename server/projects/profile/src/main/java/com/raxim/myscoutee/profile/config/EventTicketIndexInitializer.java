package com.raxim.myscoutee.profile.config;

import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.PartialIndexFilter;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
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
        mongoTemplate.updateMulti(
                Query.query(Criteria.where("status").is("active")),
                new Update().set("status", EventTicket.STATUS_ACTIVE),
                EventTicket.class);
        mongoTemplate.indexOps(EventTicket.class).createIndex(
                new Index()
                        .on("code", Direction.ASC)
                        .unique()
                        .named("event_ticket_code"));
        if (mongoTemplate.indexOps(EventTicket.class).getIndexInfo().stream()
                .anyMatch(index -> "event_ticket_event_holder".equals(index.getName()))) {
            mongoTemplate.indexOps(EventTicket.class).dropIndex("event_ticket_event_holder");
        }
        mongoTemplate.indexOps(EventTicket.class).createIndex(
                new Index()
                        .on("eventId", Direction.ASC)
                        .on("holderUserId", Direction.ASC)
                        .unique()
                        .partial(PartialIndexFilter.of(Criteria.where("status").is(EventTicket.STATUS_ACTIVE)))
                        .named("event_ticket_active_event_holder"));
        mongoTemplate.indexOps(EventTicket.class).createIndex(
                new Index()
                        .on("eventId", Direction.ASC)
                        .on("usedAtIso", Direction.ASC)
                        .named("event_ticket_event_used"));
    }
}
