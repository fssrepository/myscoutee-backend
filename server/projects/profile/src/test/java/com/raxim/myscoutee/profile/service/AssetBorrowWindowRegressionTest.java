package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.CALLS_REAL_METHODS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.util.ReflectionTestUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestBookingRecord;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.SubEventItem;

class AssetBorrowWindowRegressionTest {
    @Test
    void eventAndGroupBookingsUseTheirOwnRuntimeStageWindow() {
        for (String runtime : List.of("event", "event:slot:one")) {
            AssetsService service = service(runtime);
            for (String scope : List.of(runtime, runtime + ":stage:stage:group:1")) {
                assertThat(valid(service, request(scope, "stage", "2026-09-17T10:00:00Z", "2026-09-19T10:00:00Z")))
                        .as("Booking in %s", scope).isTrue();
            }
        }
    }

    @Test
    void invalidStageOrOutOfBoundsDatesRemainRejected() {
        AssetsService service = service("event");
        for (String scope : List.of("event", "event:stage:stage:group:1")) {
            assertThat(valid(service, request(scope, "missing", "2026-09-17T10:00:00Z", "2026-09-18T10:00:00Z"))).isFalse();
            assertThat(valid(service, request(scope, "stage", "2026-09-16T10:00:00Z", "2026-09-18T10:00:00Z"))).isFalse();
            assertThat(valid(service, request(scope, "stage", "2026-09-18T10:00:00Z", "2026-09-20T10:00:00Z"))).isFalse();
            assertThat(valid(service, request(scope, "stage", "2026-09-18T10:00:00Z", "2026-09-18T10:00:00Z"))).isFalse();
        }
    }

    private AssetsService service(String runtime) {
        AssetsService service = mock(AssetsService.class, CALLS_REAL_METHODS);
        MongoTemplate mongo = mock(MongoTemplate.class);
        ReflectionTestUtils.setField(service, "mongoTemplate", mongo);
        SubEventItem stage = mock(SubEventItem.class);
        when(stage.id()).thenReturn("stage");
        when(stage.startAt()).thenReturn("2026-09-17T10:00:00Z");
        when(stage.endAt()).thenReturn("2026-09-19T10:00:00Z");
        ActivityEvent event = new ActivityEvent();
        event.setSourceId(runtime);
        event.setStatus("A");
        event.setSubEvents(List.of(stage));
        when(mongo.findOne(any(Query.class), eq(ActivityEvent.class))).thenAnswer(invocation -> {
            Query query = invocation.getArgument(0);
            var alternatives = query.getQueryObject().getList("$or", org.bson.Document.class);
            return alternatives.stream().anyMatch(item -> runtime.equals(item.getString("sourceId"))) ? event : null;
        });
        return service;
    }

    private boolean valid(AssetsService service, AssetRequestRecord request) {
        return Boolean.TRUE.equals(ReflectionTestUtils.invokeMethod(service, "isBorrowRequestWithinParentWindow", request));
    }

    private AssetRequestRecord request(String scope, String stage, String start, String end) {
        return new AssetRequestRecord("request", "borrower", "Borrower", "B", "", "pending", "", "borrow", start,
                new AssetRequestBookingRecord(scope, "", stage, "", stage, "", "", start, end,
                        1, 0d, null, "USD", List.of(), null, false));
    }
}
