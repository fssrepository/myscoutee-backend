package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.util.StringUtils;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.events.api.EventOwnership;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;

@Service
public class EventOwnershipService implements EventOwnership {
    @org.springframework.beans.factory.annotation.Autowired private MongoTemplate mongo;
    private final ActivityEventsRepository events;
    public EventOwnershipService(ActivityEventsRepository events) { this.events = events; }
    @Override public List<ActivityEvent> findBySourceId(String sourceId) { return events.findBySourceId(sourceId); }
    @Override public java.util.List<ActivityEvent> findBySourceIdIn(java.util.Collection<String> ids) { return events.findBySourceIdIn(ids); }
    @Override public java.util.List<ActivityEvent> findByCreatorUserId(String id) { return events.findByCreatorUserId(id); }
    @Override public java.util.List<ActivityEvent> findAll() { return events.findAll(); }
    @Override public boolean updateAffinity(EventOwnership.Event event, double nextAffinity, double nextBoost) {
        if (event == null) {
            return false;
        }
        String id = normalizeId(event.getId());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(event.getUpdatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        UpdateResult result = mongo.updateFirst(
                new Query(criteria),
                new Update()
                        .set("affinity", nextAffinity)
                        .set("boost", nextBoost),
                ActivityEvent.class);
        if (result.getMatchedCount() <= 0) {
            return false;
        }
        ((ActivityEvent) event).setAffinity(nextAffinity);
        ((ActivityEvent) event).setBoost(nextBoost);
        return true;
    }
    private String normalizeId(String value) { return value == null ? "" : value.trim(); }
    @Override public java.util.Optional<ActivityEvent> findById(String id) { return events.findById(id); }
}
