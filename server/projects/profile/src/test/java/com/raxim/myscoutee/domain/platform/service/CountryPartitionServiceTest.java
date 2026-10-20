package com.raxim.myscoutee.domain.platform.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.query.Query;

import com.raxim.myscoutee.domain.platform.document.CountryPartition;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.platform.repository.CountryPartitionsRepository;
import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("standard")
class CountryPartitionServiceTest {
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private CountryPartitionService service;
    private final LocationCoordinatesDto point = new LocationCoordinatesDto(47.4979, 19.0402);

    @BeforeEach
    void setup() {
        when(mongo.indexOps(CountryPartition.class)).thenReturn(mock(IndexOperations.class));
        service = new CountryPartitionService(mock(CountryPartitionsRepository.class), mongo, mock(ObjectMapper.class));
        clearInvocations(mongo);
    }

    @Test
    void matchingSavedCountryNeedsOnlyOneLookupAndNoGeometryTransfer() {
        CountryPartition match = new CountryPartition();
        match.setPartitionKey("country:hu");
        when(mongo.findOne(any(Query.class), eq(CountryPartition.class))).thenReturn(match);
        assertThat(service.resolvePartitionKey(point, "country:hu")).isEqualTo("country:hu");
        var query = ArgumentCaptor.forClass(Query.class);
        verify(mongo, times(1)).findOne(query.capture(), eq(CountryPartition.class));
        assertThat(query.getValue().getQueryObject()).containsEntry("partitionKey", "country:hu").containsKey("geometry");
        assertThat(query.getValue().getFieldsObject()).containsEntry("partitionKey", 1).doesNotContainKey("geometry");
        verifyNoMoreInteractions(mongo);
    }

    @Test
    void outsideSavedCountryUsesOneSpatialLookupForAnotherCountry() {
        CountryPartition match = new CountryPartition();
        match.setPartitionKey("country:hu");
        when(mongo.findOne(any(Query.class), eq(CountryPartition.class))).thenReturn(null, match);
        assertThat(service.resolvePartitionKey(point, "country:de")).isEqualTo("country:hu");
        var query = ArgumentCaptor.forClass(Query.class);
        verify(mongo, times(2)).findOne(query.capture(), eq(CountryPartition.class));
        Query lookup = query.getAllValues().get(1);
        assertThat(lookup.getQueryObject()).containsKey("geometry").doesNotContainKey("partitionKey");
        assertThat(lookup.getLimit()).isEqualTo(1);
        assertThat(lookup.getSortObject()).containsEntry("specificity", -1);
        verifyNoMoreInteractions(mongo);
    }

    @Test
    void unsupportedPointHasNoArtificialCountryFallback() {
        assertThat(service.resolvePartitionKey(point, "country:hu")).isNull();
        verify(mongo, times(2)).findOne(any(Query.class), eq(CountryPartition.class));
        verifyNoMoreInteractions(mongo);
    }

    @Test
    void malformedPointDoesNotQueryCountries() {
        assertThat(service.resolvePartitionKey(new LocationCoordinatesDto(91d, 19d), "country:hu")).isNull();
        verifyNoInteractions(mongo);
    }
    @Test
    @SuppressWarnings({"unchecked", "rawtypes"})
    void batchPreservesPositionsAndSpecificityWithoutTransferringGeometry() {
        var collection = mock(com.mongodb.client.MongoCollection.class);
        var matches = mock(com.mongodb.client.AggregateIterable.class);
        var cursor = mock(com.mongodb.client.MongoCursor.class);
        when(mongo.getCollection("countryPartitions")).thenReturn(collection);
        when(collection.aggregate(any(java.util.List.class))).thenReturn(matches);
        when(matches.iterator()).thenReturn(cursor);
        when(cursor.hasNext()).thenReturn(true, true, false);
        when(cursor.next()).thenReturn(
                new org.bson.Document("pointIndex", 3).append("partitionKey", "country:de"),
                new org.bson.Document("pointIndex", 0).append("partitionKey", "country:hu"));

        assertThat(service.resolvePartitionKeys(java.util.Arrays.asList(point, null,
                new LocationCoordinatesDto(91d, 19d), new LocationCoordinatesDto(52.5, 13.4))))
                .containsExactly("country:hu", null, null, "country:de");
        var pipeline = ArgumentCaptor.forClass(java.util.List.class);
        verify(collection, times(1)).aggregate(pipeline.capture());
        var stages = (java.util.List<org.bson.Document>) pipeline.getValue();
        assertThat(stages).hasSize(5);
        assertLookup(stages.subList(0, 4), 0, 19.0402, 47.4979);
        var union = stages.get(4).get("$unionWith", org.bson.Document.class);
        assertThat(union.getString("coll")).isEqualTo("countryPartitions");
        assertLookup((java.util.List<org.bson.Document>) union.get("pipeline"), 3, 13.4, 52.5);
    }

    @Test
    void emptyAndMalformedBatchesDoNotQueryAndOversizedBatchesAreRejected() {
        assertThat(service.resolvePartitionKeys(java.util.List.of())).isEmpty();
        assertThat(service.resolvePartitionKeys(java.util.Arrays.asList(null, new LocationCoordinatesDto(Double.NaN, 0d))))
                .containsExactly(null, null);
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> service.resolvePartitionKeys(null))
                .isInstanceOf(IllegalArgumentException.class);
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> service.resolvePartitionKeys(java.util.Collections.nCopies(129, point)))
                .isInstanceOf(IllegalArgumentException.class);
        verifyNoInteractions(mongo);
    }

    private void assertLookup(java.util.List<org.bson.Document> stages, int index, double longitude, double latitude) {
        var geometry = stages.get(0).get("$match", org.bson.Document.class).get("geometry", org.bson.Document.class)
                .get("$geoIntersects", org.bson.Document.class).get("$geometry", org.bson.Document.class);
        assertThat(geometry.get("coordinates")).isEqualTo(java.util.List.of(longitude, latitude));
        assertThat(stages.get(1)).isEqualTo(new org.bson.Document("$sort", new org.bson.Document("specificity", -1)));
        assertThat(stages.get(2)).isEqualTo(new org.bson.Document("$limit", 1));
        assertThat(stages.get(3).get("$project", org.bson.Document.class))
                .containsEntry("partitionKey", 1).containsEntry("pointIndex", new org.bson.Document("$literal", index))
                .doesNotContainKey("geometry");
    }

}
