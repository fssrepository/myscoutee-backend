package com.raxim.myscoutee.domain.assets.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestBookingRecord;
import com.raxim.myscoutee.domain.assets.document.AssetRequest;

@org.junit.jupiter.api.Tag("standard")
class AssetAvailabilityMapperTest {
    private static final String ASSET_ID = "asset-1";
    private static final String REQUEST_ID = "borrow-request-1";

    private final AssetAvailabilityMapper mapper = new AssetAvailabilityMapper();

    @Test
    void availabilityRowsExposeTheEmbeddedRequestId() {
        var page = mapper.toOccupancyPage(
                "owner-1",
                ASSET_ID,
                List.of(request(REQUEST_ID)),
                "2027-03-09",
                null,
                null,
                "all",
                "later",
                0,
                20,
                null);

        assertThat(page.items()).singleElement()
                .extracting(item -> item.id())
                .isEqualTo(REQUEST_ID);
    }

    @Test
    void legacyProjectionIdsStillResolveToTheEmbeddedRequestId() {
        var page = mapper.toOccupancyPage(
                "owner-1",
                ASSET_ID,
                List.of(request(null)),
                "2027-03-09",
                null,
                null,
                "all",
                "later",
                0,
                20,
                null);

        assertThat(page.items()).singleElement()
                .extracting(item -> item.id())
                .isEqualTo(REQUEST_ID);
    }

    private AssetRequest request(String sourceRequestId) {
        return new AssetRequest(
                ASSET_ID + ":request:" + REQUEST_ID,
                sourceRequestId,
                ASSET_ID,
                "owner-1",
                "asset:" + ASSET_ID,
                4,
                "borrower-1",
                "Borrower",
                "B",
                "woman",
                "pending",
                "Payment approved. Awaiting owner confirmation.",
                "borrow",
                "2026-07-21T23:22:47.368Z",
                new AssetRequestBookingRecord(
                        "event-1",
                        "Event",
                        "sub-event-1",
                        "Sub event",
                        "sub-event-1",
                        "Sub event",
                        "Mar 9 · 1:00 PM - 2:00 PM",
                        "2027-03-09T13:00",
                        "2027-03-09T14:00",
                        1,
                        10d,
                        "USD",
                        List.of(),
                        "payment-1",
                        true),
                List.of(),
                "2026-07-21T23:22:47.368Z",
                "2026-07-21T23:22:47.368Z");
    }
}
