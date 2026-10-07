package com.raxim.myscoutee.domain.assets.document;

import com.raxim.myscoutee.domain.assets.service.AssetsService;
import com.raxim.myscoutee.domain.events.service.ActivitiesResourcesService;

import static org.mockito.Mockito.*;

import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.TestFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestBookingRecord;
import com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestRecord;

@org.junit.jupiter.api.Tag("standard")
class AssetBorrowCancellationRegressionTest {
    private record Case(String name, List<AssetRequestRecord> before, List<AssetRequestRecord> after, boolean remove) {}

    @TestFactory
    Stream<DynamicTest> assignmentCleanupFollowsTheExactRemainingBorrowerRequests() {
        AssetRequestRecord pending = request("one", "nova", "group-a", "pending");
        AssetRequestRecord deleted = request("one", "nova", "group-a", "D");
        AssetRequestRecord accepted = request("one", "nova", "group-a", "accepted");
        return Stream.of(
                new Case("last pending cancelled", List.of(pending), List.of(deleted), true),
                new Case("last pending removed from list", List.of(pending), List.of(), true),
                new Case("another pending request retains assignment", List.of(pending),
                        List.of(deleted, request("two", "nova", "group-a", "pending")), false),
                new Case("another accepted request retains assignment", List.of(pending),
                        List.of(deleted, request("two", "nova", "group-a", "accepted")), false),
                new Case("other group does not retain this assignment", List.of(pending),
                        List.of(deleted, request("two", "nova", "group-b", "accepted")), true),
                new Case("other borrower does not retain this assignment", List.of(pending),
                        List.of(deleted, request("two", "lina", "group-a", "accepted")), true),
                new Case("approval keeps assignment", List.of(pending), List.of(accepted), false),
                new Case("accepted manager leave keeps its existing lifecycle", List.of(accepted), List.of(deleted), false),
                new Case("repeated cancellation does not remove again", List.of(deleted), List.of(deleted), false)
        ).map(item -> DynamicTest.dynamicTest(item.name(), () -> check(item)));
    }

    @SuppressWarnings("unchecked")
    private void check(Case item) {
        AssetsService service = mock(AssetsService.class, CALLS_REAL_METHODS);
        ActivitiesResourcesService resources = mock(ActivitiesResourcesService.class);
        ObjectProvider<ActivitiesResourcesService> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(resources);
        ReflectionTestUtils.setField(service, "activitiesResourcesServiceProvider", provider);
        ReflectionTestUtils.setField(service, "mongoTemplate", mock(MongoTemplate.class));
        ReflectionTestUtils.invokeMethod(service, "syncAssetRequestProjection", asset(item.before()), asset(item.after()));
        verify(resources, times(item.remove() ? 1 : 0))
                .removeCancelledBorrowAssignment("group-a", "stage", "asset", "nova", "casey");
        verify(resources, never()).removeCancelledBorrowAssignment("group-b", "stage", "asset", "nova", "casey");
        verify(resources, never()).removeCancelledBorrowAssignment("group-a", "stage", "asset", "lina", "casey");
    }

    private Asset asset(List<AssetRequestRecord> requests) {
        Asset asset = new Asset();
        asset.setAssetId("asset");
        asset.setOwnerUserId("owner");
        asset.setUpdatedUser("casey");
        asset.setRequests(requests);
        return asset;
    }

    private AssetRequestRecord request(String id, String user, String scope, String status) {
        return new AssetRequestRecord(id, user, user, "", "", status, "", "borrow", "2026-09-17T10:00:00Z",
                new AssetRequestBookingRecord(scope, "", "stage", "", "stage", "", "",
                        "2026-09-17T10:00:00Z", "2026-09-19T10:00:00Z", 1, 0d, null, "USD", List.of(), null, false));
    }
}
