package com.raxim.myscoutee.domain.integrations.service;
import java.util.List;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantSummaryDto;
@Service
public class ParticipantStatisticsService implements com.raxim.myscoutee.domain.integrations.api.ParticipantStatistics {
    private final MongoTemplate mongo;
    public ParticipantStatisticsService(MongoTemplate mongo) { this.mongo = mongo; }
    public IntegrationParticipantSummaryDto participantSummary(String owner) {
        // One external participant can be invited to several events. Count the person once.
        var row = mongo.getCollection("integrationParticipantInvites").aggregate(List.of(
                new Document("$match", new Document("ownerUserId", owner).append("reusable", new Document("$ne", true))),
                new Document("$group", new Document("_id", "$participantId").append("registered",
                        new Document("$max", new Document("$cond", List.of(
                                new Document("$ne", List.of(new Document("$ifNull", List.of("$claimedUserId", "")), "")), 1, 0))))),
                new Document("$group", new Document("_id", null).append("imported", new Document("$sum", 1))
                        .append("registered", new Document("$sum", "$registered")))
        )).first();
        return row == null ? new IntegrationParticipantSummaryDto(0, 0)
                : new IntegrationParticipantSummaryDto(((Number) row.get("registered")).longValue(),
                        ((Number) row.get("imported")).longValue());
    }

}
