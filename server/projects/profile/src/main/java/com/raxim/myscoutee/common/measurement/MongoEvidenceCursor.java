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
}
