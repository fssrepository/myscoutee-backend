package com.raxim.myscoutee.profile.repository;

import java.util.ArrayList;
import java.util.List;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import com.raxim.myscoutee.profile.data.document.PhotoFeedPost;
import com.raxim.myscoutee.profile.data.dto.feed.PhotoFeedDtos.Cursor;

@Repository
public class PhotoFeedRepository {
    private final MongoTemplate mongo;
    public PhotoFeedRepository(MongoTemplate mongo) { this.mongo = mongo; }
    public PhotoFeedPost find(String id) { return mongo.findById(id, PhotoFeedPost.class); }
    public PhotoFeedPost insert(PhotoFeedPost post) { return mongo.insert(post); }
    private org.springframework.data.mongodb.core.query.Criteria visible(String viewer) {
        return new org.springframework.data.mongodb.core.query.Criteria().orOperator(
            org.springframework.data.mongodb.core.query.Criteria.where("moderationStatus").is("accepted"),
            org.springframework.data.mongodb.core.query.Criteria.where("creatorUserId").is(viewer));
    }
    public long count(String viewer) { return mongo.count(Query.query(visible(viewer)), PhotoFeedPost.class); }
    public record LocatedPost(PhotoFeedPost post, double distanceKm) {}
    public List<LocatedPost> page(String viewer, double latitude, double longitude, Cursor cursor, int limit) {
        List<AggregationOperation> stages = new ArrayList<>();
        stages.add(context -> new Document("$geoNear", new Document("near",
                new Document("type", "Point").append("coordinates", List.of(longitude, latitude)))
                .append("query", visible(viewer).getCriteriaObject()).append("key", "locationGeo").append("distanceField", "distanceMeters").append("spherical", true)));
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
