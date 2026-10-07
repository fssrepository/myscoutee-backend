package com.raxim.myscoutee.domain.content.repository;

import java.util.ArrayList;
import java.util.List;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;
import com.raxim.myscoutee.domain.content.document.PhotoFeedPost;
import com.raxim.myscoutee.domain.content.dto.PhotoFeedDtos.Cursor;

@Repository
public class PhotoFeedRepository {
    private final MongoTemplate mongo;
    public PhotoFeedRepository(MongoTemplate mongo) { this.mongo = mongo; }
    public PhotoFeedPost find(String id) { return mongo.findById(id, PhotoFeedPost.class); }
    public PhotoFeedPost insert(PhotoFeedPost post) { return mongo.insert(post); }
    public com.raxim.myscoutee.domain.accounts.document.Users.FeedCountersRecord counters(String userId) {
        var query = Query.query(Criteria.where("userId").is(userId)); query.fields().include("feedCounters");
        var user = mongo.findOne(query, com.raxim.myscoutee.domain.accounts.document.Users.class);
        return user == null || user.getFeedCounters() == null
                ? com.raxim.myscoutee.domain.accounts.document.Users.FeedCountersRecord.empty() : user.getFeedCounters();
    }
    private org.springframework.data.mongodb.core.query.Criteria visible(String viewer, String status) {
        var criteria = org.springframework.data.mongodb.core.query.Criteria.where("moderationStatus").is(List.of("public", "seen").contains(status) ? "accepted" : status);
        criteria.and("deleted").ne(true).and("workspaceGroupId").is(com.raxim.myscoutee.domain.groups.service.CommunityGroupProfilesService.currentGroupId());
        return List.of("public", "seen").contains(status) ? criteria.and("creatorUserId").ne(viewer) : criteria.and("creatorUserId").is(viewer);
    }
    private void filterSeen(List<AggregationOperation> stages, String viewer, String status) {
        if (!List.of("public", "seen").contains(status)) return;
        stages.add(context -> new Document("$lookup", new Document("from", "photoFeedViews")
                .append("localField", "_id").append("foreignField", "postId")
                .append("pipeline", List.of(new Document("$match", new Document("userId", viewer))))
                .append("as", "viewerSeen")));
        stages.add(context -> new Document("$match", new Document("viewerSeen.0", new Document("$exists", "seen".equals(status)))));
    }
    public long count(String viewer, String status) {
        List<AggregationOperation> stages = new ArrayList<>();
        stages.add(Aggregation.match(visible(viewer, status)));
        filterSeen(stages, viewer, status);
        stages.add(Aggregation.count().as("count"));
        var result = mongo.aggregate(Aggregation.newAggregation(stages), "photoFeedPosts", Document.class).getUniqueMappedResult();
        return result == null ? 0 : ((Number) result.get("count")).longValue();
    }
    public void markSeen(String userId, List<String> ids) {
        var allowed = mongo.find(Query.query(Criteria.where("_id").in(ids).and("creatorUserId").ne(userId).and("moderationStatus").is("accepted")
                .and("deleted").ne(true).and("workspaceGroupId").is(com.raxim.myscoutee.domain.groups.service.CommunityGroupProfilesService.currentGroupId())), PhotoFeedPost.class);
        if (allowed.isEmpty()) return;
        var writes = mongo.bulkOps(org.springframework.data.mongodb.core.BulkOperations.BulkMode.UNORDERED, "photoFeedViews");
        String now = java.time.Instant.now().toString();
        for (var post : allowed) writes.upsert(Query.query(Criteria.where("_id").is(userId + ":" + post.id())),
                new org.springframework.data.mongodb.core.query.Update().setOnInsert("userId", userId)
                        .setOnInsert("postId", post.id()).setOnInsert("seenAtIso", now));
        writes.execute();
    }
    public record LocatedPost(PhotoFeedPost post, double distanceKm) {}
    public List<LocatedPost> page(String viewer, String status, double latitude, double longitude, Cursor cursor, int limit) {
        List<AggregationOperation> stages = new ArrayList<>();
        stages.add(context -> new Document("$geoNear", new Document("near",
                new Document("type", "Point").append("coordinates", List.of(longitude, latitude)))
                .append("query", visible(viewer, status).getCriteriaObject()).append("key", "locationGeo").append("distanceField", "distanceMeters").append("spherical", true)));
        filterSeen(stages, viewer, status);
        stages.add(context -> new Document("$set", new Document("distanceBucket",
                new Document("$floor", new Document("$divide", List.of("$distanceMeters", 5000))))));
        if (cursor != null) stages.add(context -> new Document("$match", new Document("$or", List.of(
                new Document("distanceBucket", new Document("$gt", cursor.bucket())),
                new Document("distanceBucket", cursor.bucket()).append("createdAtIso", new Document("$lt", cursor.createdAtIso())),
                new Document("distanceBucket", cursor.bucket()).append("createdAtIso", cursor.createdAtIso())
                        .append("_id", new Document("$gt", cursor.id()))))));
        stages.add(context -> new Document("$sort", new Document("distanceBucket", 1).append("createdAtIso", -1).append("_id", 1)));
        stages.add(context -> new Document("$limit", limit));
        return mongo.aggregate(Aggregation.newAggregation(stages), "photoFeedPosts", Document.class)
                .getMappedResults().stream().map(raw -> new LocatedPost(mongo.getConverter().read(PhotoFeedPost.class, raw),
                        ((Number) raw.get("distanceMeters")).doubleValue() / 1000)).toList();
    }
}
