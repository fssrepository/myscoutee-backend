package com.raxim.myscoutee.common.measurement;
import org.bson.Document;
import com.mongodb.client.MongoCursor;
/** Shared cursor mechanics only. Each domain constructs and executes its own query. */
public final class MongoEvidenceCursor implements EvidenceCursor {
    private final MongoCursor<Document> cursor;
    public MongoEvidenceCursor(MongoCursor<Document> cursor) { this.cursor = cursor; }
    public boolean hasNext() { return cursor.hasNext(); }
    public MeasurementEvidence next() {
        var row = cursor.next();
        return new MeasurementEvidence(value(row, "userId"), value(row, "actionType"), value(row, "occurredAt"), value(row, "sourceId"));
    }
    public void close() { cursor.close(); }
    private static String value(Document row, String key) { var value = row.get(key); return value == null ? null : String.valueOf(value); }

    public static Document range(String start, String end) {
        return new Document("$gte", start).append("$lt", end);
    }
    public static Document rangeClause(
            String field,
            String start,
            String end) {
        return new Document(field, range(start, end));
    }
    public static Document match(Document criteria) {
        return new Document("$match", criteria);
    }
    public static Document project(
            Object userId,
            String actionType,
            Object occurredAt,
            Object sourceId) {
        return new Document(
                "$project",
                new Document("_id", 0)
                        .append("userId", userId)
                        .append("actionType", actionType)
                        .append("occurredAt", occurredAt)
                        .append("sourceId", sourceId));
    }
    public static Document source(Object... parts) {
        return new Document("$concat", java.util.List.of(parts));
    }

}
