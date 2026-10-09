package com.raxim.myscoutee.domain.accounts.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.ArrayList;
import java.util.Date;
import org.bson.Document;
import com.mongodb.client.model.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import com.raxim.myscoutee.domain.accounts.repository.UserFriendshipsRepository;

/** One indexed adjacency read per viewer/request; no process-wide authorization cache. */
@Component
public class FriendshipFacts implements com.raxim.myscoutee.domain.accounts.api.Friendships {
    @org.springframework.beans.factory.annotation.Autowired private MongoTemplate mongo;
    private final UserFriendshipsRepository friendships;

    public FriendshipFacts(UserFriendshipsRepository friendships) {
        this.friendships = friendships;
    }

    public boolean pairExists(String first, String second) {
        if (first == null || second == null || first.isBlank() || second.isBlank() || first.equals(second)) return false;
        String left = first.compareTo(second) < 0 ? first : second;
        String right = first.compareTo(second) < 0 ? second : first;
        return friendships.existsById(left.length() + ":" + left + right);
    }

    public Set<String> loadFriendIds(String viewer) {
        if (viewer == null || viewer.isBlank()) return Set.of();
        Set<String> ids = new LinkedHashSet<>();
        for (var pair : friendships.findRelevantByUserIds(List.of(viewer))) {
            if (viewer.equals(pair.leftUserId())) ids.add(pair.rightUserId());
            else if (viewer.equals(pair.rightUserId())) ids.add(pair.leftUserId());
        }
        ids.remove(null);
        ids.remove(viewer);
        return Set.copyOf(ids);
    }
    @Override public void projectMeetings(List<Meeting> meetings) {
        if (meetings.isEmpty()) return;
        var writes = new ArrayList<WriteModel<Document>>();
        for (var meeting : meetings) writes.add(mutualMetFriendshipWrite(meeting));
        mongo.getCollection("userFriendships").bulkWrite(writes, new BulkWriteOptions().ordered(false));
    }
    private WriteModel<Document> mutualMetFriendshipWrite(
            Meeting meeting) {
        String left = meeting.left(); String right = meeting.right();
        Date projectedAt = new Date(meeting.projectedAtMs());
        String eventId = meeting.eventId(); String eventName = meeting.eventName();
        Object earlier = new Document("$or", List.of(
                new Document("$eq", List.of(new Document("$ifNull", List.of("$friendsSince", false)), false)),
                new Document("$lt", List.of(projectedAt, "$friendsSince"))));
        Object later = new Document("$or", List.of(
                new Document("$eq", List.of(new Document("$ifNull", List.of("$lastMetAt", false)), false)),
                new Document("$gt", List.of(projectedAt, "$lastMetAt"))));
        Document values = new Document("leftUserId", literal(left))
                .append("rightUserId", literal(right))
                .append("friendsSince", conditional(earlier, projectedAt, "$friendsSince"))
                .append("firstEventId", conditional(earlier, literal(eventId), "$firstEventId"))
                .append("lastMetAt", conditional(later, projectedAt, "$lastMetAt"))
                .append("lastEventId", conditional(later, literal(eventId), "$lastEventId"))
                .append("lastEventName", conditional(later, literal(eventName), "$lastEventName"));
        return new UpdateOneModel<>(new Document("_id", left.length() + ":" + left + right),
                List.of(new Document("$set", values)),
                new UpdateOptions().upsert(true));
    }

    private Object conditional(Object condition, Object value, String existing) {
        return new Document("$cond", List.of(condition, value, existing));
    }

    private Object literal(String value) {
        return new Document("$literal", value);
    }

}
