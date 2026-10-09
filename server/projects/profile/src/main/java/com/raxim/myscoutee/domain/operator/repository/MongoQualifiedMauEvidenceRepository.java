package com.raxim.myscoutee.domain.operator.repository;
import java.time.Instant;
import java.util.*;
import java.util.function.Consumer;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.accounts.api.MeasurementEligibility;
import com.raxim.myscoutee.domain.affinity.api.RatingMeasurement;
import com.raxim.myscoutee.domain.assets.api.AssetMeasurement;
import com.raxim.myscoutee.domain.chat.api.ChatMeasurement;
import com.raxim.myscoutee.domain.events.api.EventMeasurement;
/** Merges sorted owner streams with bounded memory; never reads a foreign collection. */
@Repository
public class MongoQualifiedMauEvidenceRepository implements QualifiedMauEvidenceRepository {
    public static final String ACTION_RATE = "rate";
    public static final String ACTION_JOIN = "join";
    public static final String ACTION_MESSAGE = "message";
    public static final String ACTION_HOST = "host";
    public static final String ACTION_BOOK = "book";
    public static final String ACTION_VERIFIED_ATTENDANCE =
            "verified-attendance";

    private final RatingMeasurement ratings;
    private final EventMeasurement events;
    private final ChatMeasurement chats;
    private final AssetMeasurement assets;
    private final MeasurementEligibility eligibility;
    public MongoQualifiedMauEvidenceRepository(RatingMeasurement ratings, EventMeasurement events,
            ChatMeasurement chats, AssetMeasurement assets, MeasurementEligibility eligibility) {
        this.ratings = ratings; this.events = events; this.chats = chats; this.assets = assets; this.eligibility = eligibility;
    }
    @Override public void read(Instant startInclusive, Instant endExclusive, Consumer<QualifiedMauActionEvidence> consumer) {
        Objects.requireNonNull(startInclusive, "QMAU start must not be null.");
        Objects.requireNonNull(endExclusive, "QMAU end must not be null.");
        Objects.requireNonNull(consumer, "QMAU consumer must not be null.");
        if (!startInclusive.isBefore(endExclusive)) throw new IllegalArgumentException("QMAU evidence window must be positive.");
        try (var rates = ratings.rates(startInclusive, endExclusive);
             var joins = events.joins(startInclusive, endExclusive);
             var messages = chats.messages(startInclusive, endExclusive);
             var hosts = events.hosts(startInclusive, endExclusive);
             var bookings = assets.bookings(startInclusive, endExclusive);
             var attendance = events.attendance(startInclusive, endExclusive)) {
            var queue = new PriorityQueue<Head>(Comparator.comparing(Head::row, MeasurementEvidence.ORDER).thenComparingInt(Head::source));
            var cursors = List.of(rates, joins, messages, hosts, bookings, attendance);
            for (int i = 0; i < cursors.size(); i++) if (cursors.get(i).hasNext()) queue.add(new Head(cursors.get(i).next(), i));
            var batch = new ArrayList<MeasurementEvidence>(1_000);
            while (!queue.isEmpty()) {
                var head = queue.remove(); batch.add(head.row());
                var cursor = cursors.get(head.source());
                if (cursor.hasNext()) queue.add(new Head(cursor.next(), head.source()));
                if (batch.size() == 1_000) { publish(batch, startInclusive, endExclusive, consumer); batch.clear(); }
            }
            if (!batch.isEmpty()) publish(batch, startInclusive, endExclusive, consumer);
        }
    }
    private void publish(List<MeasurementEvidence> batch, Instant startInclusive, Instant endExclusive, Consumer<QualifiedMauActionEvidence> consumer) {
        var ids = new LinkedHashSet<String>();
        for (var row : batch) if (row.userId() != null) ids.add(row.userId());
        var allowed = eligibility.eligible(ids);
        for (var row : batch) {
            if (!allowed.contains(row.userId())) continue;
                String userId = text(row.userId());
                String actionType = text(row.actionType());
                String occurredAt = text(row.occurredAt());
                String sourceId = text(row.sourceId());
                if (!StringUtils.hasText(userId)
                        || !StringUtils.hasText(actionType)
                        || !StringUtils.hasText(occurredAt)
                        || !StringUtils.hasText(sourceId)) {
                    throw new IllegalStateException(
                            "Authoritative QMAU evidence contains a blank field.");
                }
                Instant parsedAt;
                try {
                    parsedAt = Instant.parse(occurredAt);
                } catch (RuntimeException exception) {
                    throw new IllegalStateException(
                            "Authoritative QMAU evidence contains a non-UTC timestamp.",
                            exception);
                }
                if (parsedAt.isBefore(startInclusive)
                        || !parsedAt.isBefore(endExclusive)) {
                    throw new IllegalStateException(
                            "Authoritative QMAU evidence escaped its completed-period window.");
                }
                consumer.accept(new QualifiedMauActionEvidence(
                        userId,
                        actionType,
                        parsedAt,
                        sourceId));
        }
    }
    private record Head(MeasurementEvidence row, int source) {}
    private static String text(Object value) { return value == null ? "" : String.valueOf(value).trim(); }
}
