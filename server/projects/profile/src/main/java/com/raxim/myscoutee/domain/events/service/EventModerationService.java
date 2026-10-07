package com.raxim.myscoutee.domain.events.service;
import java.util.List;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
@org.springframework.stereotype.Service
public class EventModerationService implements com.raxim.myscoutee.domain.events.api.EventModeration {
    private final MongoTemplate mongo;
    public EventModerationService(MongoTemplate mongo) { this.mongo = mongo; }
    public void apply(String sourceId, long version, String status) {
        String collection = "events";
        var query = Query.query(Criteria.where("sourceId").is(sourceId).andOperator(new Criteria().orOperator(
                Criteria.where("moderationVersion").lte(version), Criteria.where("moderationVersion").exists(false))));
        var records = mongo.find(query, Document.class, collection);
        for (Document record : records) {
            String current = record.getString("status");
            String original = record.getString("moderationPreviousStatus");
            var update = new Update().set("moderationStatus", status).set("moderationVersion", version);
            if (status.equals("accepted")) {
                if (original != null) {
                    if ("B".equals(current)) update.set("status", original);
                    update.unset("moderationPreviousStatus");
                }
            } else if (!List.of("DR", "T", "D").contains(current == null ? "" : current)) {
                if (original == null) update.set("moderationPreviousStatus", current == null ? "A" : current);
                update.set("status", "B");
            }
            mongo.updateFirst(Query.query(Criteria.where("_id").is(record.get("_id")).andOperator(new Criteria().orOperator(
                    Criteria.where("moderationVersion").lte(version), Criteria.where("moderationVersion").exists(false)))), update, collection);
        }
    }
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.events.mapper.ActivityEventDetailMapper mapper;
    public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto detail(String sourceId, String ownerId) {
        var record = mongo.findOne(Query.query(Criteria.where("sourceId").is(sourceId).and("ownerUserId").is(ownerId)),
            com.raxim.myscoutee.domain.events.document.ActivityEvent.class);
        if (record == null) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND);
        return mapper.toDto(record, null);
    }
}
