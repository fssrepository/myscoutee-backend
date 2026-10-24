package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.util.StringUtils;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.events.api.EventOwnership;
import com.raxim.myscoutee.domain.events.dto.EventVersionDto;
import com.raxim.myscoutee.domain.events.dto.EventJobScopeDto;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;

@Service
public class EventOwnershipService implements EventOwnership, com.raxim.myscoutee.domain.events.api.OrganizerEventReads {
    private final MongoTemplate mongo;
    @Override public void markFeedbackProjected(java.util.Collection<String> sourceIds, boolean projected) {
        if (sourceIds.isEmpty()) return;
        mongo.updateMulti(Query.query(Criteria.where("sourceId").in(sourceIds)),
            new Update().set("feedbackCountersProjected", projected), ActivityEvent.class);
    }
    @Override public java.util.Optional<ActivityEvent> findByOwnerUserIdAndSourceId(String owner, String source) { return events.findByOwnerUserIdAndSourceId(owner,source); }
    @Override public boolean ownedExists(String owner,String source) { return mongo.exists(Query.query(Criteria.where("ownerUserId").is(owner).and("sourceId").is(source)),ActivityEvent.class); }
    @Override public List<ActivityEvent> findStoredFamilyBySourceId(String source) { return mongo.find(Query.query(Criteria.where("sourceId").is(source)),ActivityEvent.class); }
    private final ActivityEventsRepository events;
    public EventOwnershipService(ActivityEventsRepository events,
            MongoTemplate mongo) {
        this.mongo = mongo;
 this.events = events; }
    @Override public List<ActivityEvent> findBySourceId(String sourceId) { return events.findBySourceId(sourceId); }
    @Override public java.util.List<ActivityEvent> findBySourceIdIn(java.util.Collection<String> ids) { return events.findBySourceIdIn(ids); }
    @Override public java.util.List<ActivityEvent> findByCreatorUserId(String id) { return events.findByCreatorUserId(id); }
    @Override public java.util.List<ActivityEvent> findAll() { return events.findAll(); }
    @Override public boolean updateAffinity(EventOwnership.Event event, double nextAffinity, double nextBoost) {
        if (event == null) return false;
        boolean updated = updateAffinityVersion(new EventVersionDto(event.getId(), event.getUpdatedDate()), nextAffinity, nextBoost);
        if (updated) {
            ((ActivityEvent) event).setAffinity(nextAffinity);
            ((ActivityEvent) event).setBoost(nextBoost);
        }
        return updated;
    }
    @Override public boolean updateAffinityVersion(EventVersionDto version, double nextAffinity, double nextBoost) {
        if (version == null) {
            return false;
        }
        String id = normalizeId(version.id());
        if (!StringUtils.hasText(id)) {
            return false;
        }
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = normalizeId(version.updatedDate());
        if (StringUtils.hasText(updatedDate)) {
            criteria = criteria.and("updatedDate").is(updatedDate);
        }
        UpdateResult result = mongo.updateFirst(
                new Query(criteria),
                new Update()
                        .set("affinity", nextAffinity)
                        .set("boost", nextBoost),
                ActivityEvent.class);
        return result.getMatchedCount() > 0;
    }
    private String normalizeId(String value) { return value == null ? "" : value.trim(); }
    @Override public java.util.Optional<ActivityEvent> findById(String id) { return events.findById(id); }
    @Override public ActivityEvent findByIdOrSourceId(String id) {
        return mongo.findOne(Query.query(new Criteria().orOperator(Criteria.where("_id").is(id),
                Criteria.where("sourceId").is(id))), ActivityEvent.class);
    }
    public java.util.List<ActivityEvent> chatNavigationEvents(java.util.Collection<String> eventIds) {
        Query eventQuery = Query.query(Criteria.where("sourceId").in(eventIds));
        eventQuery.fields()
                .include("sourceId")
                .include("ownerUserId")
                .include("creatorUserId")
                .include("admins")
                .include("title")
                .include("pendingMembers")
                .include("subEvents");
        return mongo.find(eventQuery, ActivityEvent.class);
    }
    public List<ActivityEvent> findDirectOwnerEvents(String userId) { return events.findDirectOwnerEvents(userId); }
    public List<ActivityEvent> findAdminVisibleEvents(String userId) { return events.findAdminVisibleEvents(userId); }
    public List<ActivityEvent> findAcceptedMembershipEvents(String userId) { return events.findAcceptedMembershipEvents(userId); }
    public List<ActivityEvent> findActiveInvitationEvents(String userId) { return events.findActiveInvitationEvents(userId); }
    public List<ActivityEvent> findPendingRequestEvents(String userId) { return events.findPendingRequestEvents(userId); }
    public List<ActivityEvent> findByOwnerUserId(String userId) { return events.findByOwnerUserId(userId); }
    public List<ActivityEvent> findByAdminsContaining(String userId) { return events.findByAdminsContaining(userId); }
    public List<ActivityEvent> findHomeGameMemberProjections() { return events.findHomeGameMemberProjections(); }
    public List<ActivityEvent> activeOriginalEventsByCreators(java.util.Collection<String> creators) { return mongo.find(Query.query(Criteria.where("creatorUserId").in(creators).and("status").is("A").and("generated").ne(true)), ActivityEvent.class); }
    public List<ActivityEvent> storedEventsBySources(java.util.Collection<String> sources) { return mongo.find(Query.query(Criteria.where("sourceId").in(sources)), ActivityEvent.class); }
    public boolean updateStatusIfSnapshotCurrent(EventOwnership.Event event, String nextStatus, String previousStatus) {
        return event != null && updateStatusVersionIfCurrent(new EventVersionDto(event.getId(), event.getUpdatedDate()), nextStatus, previousStatus);
    }
    @Override public boolean updateStatusVersionIfCurrent(EventVersionDto version, String nextStatus, String previousStatus) {
        return version != null && com.raxim.myscoutee.common.config.mongo.MongoStatusUpdates.updateIfCurrent(
                mongo, ActivityEvent.class, version.id(), version.updatedDate(), nextStatus, previousStatus);
    }
    public EventJobScopeDto findJobScope(String sourceId) {
        var row = mongo.findOne(Query.query(Criteria.where("sourceId").is(sourceId)), org.bson.Document.class, "events");
        return row == null ? null : new EventJobScopeDto(row.getString("workspaceGroupId"), row.getString("ownerUserId"), row.getString("creatorUserId"));
    }
}
