package com.raxim.myscoutee.domain.affinity.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.*;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.test.util.ReflectionTestUtils;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.AccountAffinityProjectionService;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.assets.service.AssetOwnershipService;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.service.EventOwnershipService;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

@Tag("standard")
class AffinityProjectionOwnershipTest {
    @Test void eventAndAssetUpdatesKeepSnapshotGuardAndChangeMemoryOnlyAfterMatchedWrite() {
        var mongo = mock(MongoTemplate.class);
        var events = new EventOwnershipService(mock(ActivityEventsRepository.class));
        var assets = new AssetOwnershipService(mock(AssetsRepository.class));
        ReflectionTestUtils.setField(events, "mongo", mongo);
        ReflectionTestUtils.setField(assets, "mongo", mongo);
        var event = new ActivityEvent(); event.setId("event"); event.setUpdatedDate("v1"); event.setAffinity(1d); event.setBoost(2d);
        var asset = new Asset(); asset.setId("asset"); asset.setUpdatedDate("v1"); asset.setAffinity(1d); asset.setBoost(2d);
        when(mongo.updateFirst(any(Query.class), any(Update.class), eq(ActivityEvent.class)))
            .thenReturn(UpdateResult.acknowledged(0, 0L, null), UpdateResult.acknowledged(1, 1L, null));
        when(mongo.updateFirst(any(Query.class), any(Update.class), eq(Asset.class)))
            .thenReturn(UpdateResult.acknowledged(0, 0L, null), UpdateResult.acknowledged(1, 1L, null));
        assertThat(events.updateAffinity(event, 3d, 4d)).isFalse();
        assertThat(assets.updateAffinity(asset, 3d, 4d)).isFalse();
        assertThat(event.getAffinity()).isEqualTo(1d); assertThat(asset.getBoost()).isEqualTo(2d);
        assertThat(events.updateAffinity(event, 3d, 4d)).isTrue();
        assertThat(assets.updateAffinity(asset, 3d, 4d)).isTrue();
        assertThat(event.getAffinity()).isEqualTo(3d); assertThat(asset.getBoost()).isEqualTo(4d);
        for (Class<?> type : List.of(ActivityEvent.class, Asset.class)) {
            var query = ArgumentCaptor.forClass(Query.class); var update = ArgumentCaptor.forClass(Update.class);
            verify(mongo, times(2)).updateFirst(query.capture(), update.capture(), eq(type));
            assertThat(query.getValue().getQueryObject()).containsEntry("updatedDate", "v1").containsKey("_id");
            assertThat(update.getValue().getUpdateObject()).isEqualTo(new Document("$set", new Document("affinity", 3d).append("boost", 4d)));
        }
    }
    @Test void profileUpdateUsesUserIdAndOnlyItsDerivedField() {
        var mongo = mock(MongoTemplate.class);
        var service = new AccountAffinityProjectionService(mongo, mock(UsersRepository.class));
        var profile = new Users(); profile.setId("u"); profile.setAffinity(1d);
        when(mongo.updateFirst(any(Query.class), any(Update.class), eq(Users.class)))
            .thenReturn(UpdateResult.acknowledged(0, 0L, null), UpdateResult.acknowledged(1, 1L, null));
        assertThat(service.updateAffinity(profile, 3d)).isFalse(); assertThat(profile.getAffinity()).isEqualTo(1d);
        assertThat(service.updateAffinity(profile, 3d)).isTrue(); assertThat(profile.getAffinity()).isEqualTo(3d);
        var query = ArgumentCaptor.forClass(Query.class); var update = ArgumentCaptor.forClass(Update.class);
        verify(mongo, times(2)).updateFirst(query.capture(), update.capture(), eq(Users.class));
        assertThat(query.getValue().getQueryObject()).isEqualTo(new Document("userId", "u"));
        assertThat(update.getValue().getUpdateObject()).isEqualTo(new Document("$set", new Document("affinity", 3d)));
    }
    @Test void scopedRecomputationBatchesOnlyTheAlreadySelectedOwners() {
        var rates = mock(UserRatesRepository.class);
        var service = new AffinityMaintenanceService(null, null, null, null, rates, null, null, null, null);
        var ids = java.util.stream.IntStream.range(0, 1001).mapToObj(i -> "owner-" + i).toList();
        JobGroupContext.call("group-a", () -> {
            ReflectionTestUtils.invokeMethod(service, "refreshAllRateAffinities", ids); return null;
        });
        @SuppressWarnings("rawtypes") var batches = ArgumentCaptor.forClass(Collection.class);
        verify(rates, times(2)).findByOwnerUserIdIn(batches.capture());
        assertThat(batches.getAllValues()).extracting(Collection::size).containsExactly(1000, 1);
        assertThat(batches.getAllValues().stream().flatMap(Collection::stream).toList()).containsExactlyElementsOf(ids);
        verify(rates, never()).findAll();
    }
}
