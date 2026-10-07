package com.raxim.myscoutee.domain.operator.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;

@org.junit.jupiter.api.Tag("standard")
class MongoQualifiedMauEvidenceRepositoryTest {
    @SuppressWarnings("unchecked")
    @Test
    void buildsOneDeterministicUnionAcrossTheFrozenActionVocabulary() {
        MongoTemplate template = mock(MongoTemplate.class);
        MongoCollection<Document> collection =
                mock(MongoCollection.class);
        AggregateIterable<Document> aggregate =
                mock(AggregateIterable.class);
        MongoCursor<Document> cursor = mock(MongoCursor.class);
        when(template.getCollection("userRates"))
                .thenReturn(collection);
        when(collection.aggregate(anyList())).thenReturn(aggregate);
        when(aggregate.allowDiskUse(true)).thenReturn(aggregate);
        when(aggregate.batchSize(1_000)).thenReturn(aggregate);
        when(aggregate.iterator()).thenReturn(cursor);
        when(cursor.hasNext()).thenReturn(false);
        MongoQualifiedMauEvidenceRepository repository =
                new MongoQualifiedMauEvidenceRepository(template);

        repository.read(
                Instant.parse("2026-06-01T00:00:00Z"),
                Instant.parse("2026-07-01T00:00:00Z"),
                ignored -> {
                });

        @SuppressWarnings("rawtypes")
        ArgumentCaptor<List> pipelineCaptor =
                ArgumentCaptor.forClass(List.class);
        verify(collection).aggregate(pipelineCaptor.capture());
        @SuppressWarnings("unchecked")
        List<Document> pipeline = pipelineCaptor.getValue();
        assertThat(pipeline.stream()
                .filter(stage -> stage.containsKey("$unionWith"))
                .map(stage -> stage.get(
                        "$unionWith",
                        Document.class).getString("coll")))
                .containsExactly(
                        "activityMembers",
                        "chatMessages",
                        "events",
                        "assetRequests",
                        "eventFeedbackStates");
        assertThat(pipeline).anySatisfy(stage ->
                assertThat(stage.toJson())
                        .contains("\"from\": \"users\""));
        assertThat(pipeline.get(pipeline.size() - 1))
                .containsKey("$sort");
        verify(cursor).close();
    }
}
