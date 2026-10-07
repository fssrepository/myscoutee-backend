package com.raxim.myscoutee.domain.events.service;
import java.util.*;
import org.bson.Document;
import org.springframework.stereotype.Component;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.platform.api.JobAudience;
@Component
public class EventJobQueries {
    private final MongoTemplate mongo;
    private final JobAudience audience;
    public EventJobQueries(MongoTemplate mongo, JobAudience audience) { this.mongo = mongo; this.audience = audience; }
    public boolean matchesWorkspace(String id) { return audience.matchesWorkspace(id); }
    public Criteria workspaceCriteria(String field) {
        var scope = audience.workspaceScope();
        return scope.included() ? Criteria.where(field).in(scope.ids()) : Criteria.where(field).nin(scope.ids());
    }
    /** The join stays inside the event owner; filtering precedes sort, offset and limit. */
    public <T> List<T> findEventOwned(Query query, Class<T> type, String eventField) {
        List<Document> pipeline = new ArrayList<>();
        pipeline.add(new Document("$match", query.getQueryObject()));
        pipeline.add(new Document("$lookup", new Document("from", "events").append("localField", eventField)
                .append("foreignField", "sourceId").append("as", "__jobOwner")));
        pipeline.add(new Document("$match", new Document("__jobOwner.0", new Document("$exists", true))));
        pipeline.add(new Document("$match", workspaceCriteria("__jobOwner.workspaceGroupId").getCriteriaObject()));
        if (!query.getSortObject().isEmpty()) pipeline.add(new Document("$sort", query.getSortObject()));
        if (query.getSkip() > 0) pipeline.add(new Document("$skip", query.getSkip()));
        if (query.getLimit() > 0) pipeline.add(new Document("$limit", query.getLimit()));
        pipeline.add(new Document("$unset", "__jobOwner"));
        return mongo.getCollection(mongo.getCollectionName(type)).aggregate(pipeline)
                .map(row -> mongo.getConverter().read(type, row)).into(new ArrayList<>());
    }
}
