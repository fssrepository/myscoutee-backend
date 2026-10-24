package com.raxim.myscoutee.domain.events.service;
import java.util.List;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
@org.springframework.stereotype.Service
public class EventModerationService implements com.raxim.myscoutee.domain.events.api.EventModeration {
    private final MongoTemplate mongo;
    public EventModerationService(MongoTemplate mongo,
            com.raxim.myscoutee.domain.events.mapper.ActivityEventDetailMapper mapper) {
        this.mapper = mapper;
 this.mongo = mongo; }
    public void apply(String sourceId, long version, String status) {
        com.raxim.myscoutee.common.config.mongo.MongoStatusUpdates.applyModeration(
                mongo, "events", "sourceId", sourceId, version, status);
    }
    private final com.raxim.myscoutee.domain.events.mapper.ActivityEventDetailMapper mapper;
    public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto detail(String sourceId, String ownerId) {
        var record = mongo.findOne(Query.query(Criteria.where("sourceId").is(sourceId).and("ownerUserId").is(ownerId)),
            com.raxim.myscoutee.domain.events.document.ActivityEvent.class);
        if (record == null) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND);
        return mapper.toDto(record, null);
    }
}
