package com.raxim.myscoutee.common.config.mongo;
import java.util.List;
import org.bson.Document;
import org.springframework.util.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
/** Identical version-guarded status operations; each domain retains collection selection. */
public final class MongoStatusUpdates {
    private MongoStatusUpdates() {}
    public static void applyModeration(MongoTemplate mongo, String collection, String identityField,
            String sourceId, long version, String status) {
        var query = Query.query(Criteria.where(identityField).is(sourceId).andOperator(new Criteria().orOperator(
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
    public static boolean updateIfCurrent(MongoTemplate mongo, Class<?> type, String rawId, String rawUpdatedDate,
            String nextStatus, String previousStatus) {
        String id = com.raxim.myscoutee.common.util.TextValues.trim(rawId);
        if (!StringUtils.hasText(id)) return false;
        Criteria criteria = Criteria.where("_id").is(id);
        String updatedDate = com.raxim.myscoutee.common.util.TextValues.trim(rawUpdatedDate);
        if (StringUtils.hasText(updatedDate)) criteria = criteria.and("updatedDate").is(updatedDate);
        Update update = new Update().set("status", nextStatus);
        if (StringUtils.hasText(previousStatus)) update.set("statusBeforeSuppression", previousStatus);
        else update.unset("statusBeforeSuppression");
        return mongo.updateFirst(new Query(criteria), update, type).getMatchedCount() > 0;
    }
}
