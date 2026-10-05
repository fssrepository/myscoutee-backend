package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.List;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.profile.data.document.CommunityGroup;
import com.raxim.myscoutee.profile.data.document.Users;

/** Resolves stored workspace ownership at job boundaries; never accepts an admin-supplied scope. */
@Service
public class JobGroupScopeService {
    private final MongoTemplate mongo;

    public JobGroupScopeService(MongoTemplate mongo) { this.mongo = mongo; }

    public String forWorkspace(String workspaceId) {
        if (workspaceId == null || workspaceId.isBlank()) return null;
        if (CommunityGroup.isBaseId(workspaceId)) return workspaceId;
        var group = mongo.findById(workspaceId, CommunityGroup.class);
        return group == null ? null : group.baseId();
    }

    public java.util.Map<String, List<String>> usersByGroup(java.util.Collection<String> userIds) {
        var profiles = mongo.find(Query.query(Criteria.where("userId").in(userIds)), Users.class);
        var byId = new java.util.HashMap<String, Users>();
        profiles.forEach(profile -> byId.put(profile.getUserId(), profile));
        var workspaces = workspaces();
        var result = new java.util.LinkedHashMap<String, List<String>>();
        for (String userId : userIds) {
            var user = byId.get(userId);
            String workspace = user == null ? null : user.getWorkspaceGroupId();
            String group = workspaces.get(workspace);
            result.computeIfAbsent(group, ignored -> new ArrayList<>()).add(userId);
        }
        return result;
    }

    public String forUser(String userId) {
        var user = mongo.findOne(Query.query(Criteria.where("userId").is(userId)), Users.class);
        return user == null ? JobGroupContext.groupId() : forWorkspace(user.getWorkspaceGroupId());
    }

    public String forTarget(String type, String id) {
        type = type == null ? "" : type.toLowerCase(java.util.Locale.ROOT);
        if ("user".equals(type)) return forUser(id);
        if ("config".equals(type)) {
            var config = mongo.findById(id, com.raxim.myscoutee.profile.data.document.AffinityConfig.class);
            return config == null ? JobGroupContext.groupId() : "default".equals(config.getKey()) ? null : config.getKey();
        }
        String collection = switch (type) { case "event" -> "events"; case "asset" -> "assets"; default -> null; };
        if (collection == null) return JobGroupContext.groupId();
        String field = switch (type) { case "event" -> "sourceId"; case "asset" -> "assetId"; default -> "_id"; };
        var record = mongo.findOne(Query.query(Criteria.where(field).is(id)), Document.class, collection);
        if (record == null) return JobGroupContext.groupId();
        if (record.getString("workspaceGroupId") != null) return forWorkspace(record.getString("workspaceGroupId"));
        String owner = record.getString("ownerUserId");
        if (owner == null) owner = record.getString("creatorUserId");
        return owner == null ? null : forUser(owner);
    }

    private java.util.Map<String, String> workspaces() {
        return JobGroupContext.memo("workspaceBaseIds", () -> {
            var ids = new java.util.HashMap<String, String>();
            CommunityGroup.BASE_IDS.forEach(id -> ids.put(id, id));
            Query query = Query.query(Criteria.where("groupType").in("work", "community"));
            query.fields().include("_id").include("groupType");
            // A partial projection cannot instantiate CommunityGroup's required primitive fields.
            for (Document group : mongo.find(query, Document.class, "communityGroups")) {
                String id = group.getString("_id");
                if (id != null) ids.put(id, CommunityGroup.baseIdForType(group.getString("groupType")));
            }
            return ids;
        });
    }

    public boolean matchesWorkspace(String workspaceId) {
        return !JobGroupContext.isActive()
                || java.util.Objects.equals(workspaces().get(workspaceId), JobGroupContext.groupId());
    }

    public Criteria workspaceCriteria(String field) {
        var workspaces = workspaces();
        String scope = JobGroupContext.groupId();
        return scope == null ? Criteria.where(field).nin(workspaces.keySet())
                : Criteria.where(field).in(workspaces.entrySet().stream()
                    .filter(entry -> scope.equals(entry.getValue())).map(java.util.Map.Entry::getKey).toList());
    }

    /** Filter at the database before applying the batch limit; another group's backlog cannot starve this job. */
    public <T> List<T> findOwned(Query query, Class<T> type, String ownerField) {
        return findOwned(query, type, ownerField, "users", "userId");
    }

    public <T> List<T> findEventOwned(Query query, Class<T> type, String eventField) {
        return findOwned(query, type, eventField, "events", "sourceId");
    }

    private <T> List<T> findOwned(Query query, Class<T> type, String ownerField, String collection, String foreignField) {
        List<Document> pipeline = new ArrayList<>();
        pipeline.add(new Document("$match", query.getQueryObject()));
        pipeline.add(new Document("$lookup", new Document("from", collection).append("localField", ownerField)
                .append("foreignField", foreignField).append("as", "__jobOwner")));
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
