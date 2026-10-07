package com.raxim.myscoutee.domain.events.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.events.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventStageRuntimeStateDto;

@org.junit.jupiter.api.Tag("standard")
class ActivitySubEventStageRuntimeMapperTest {
    private final ActivitySubEventStageRuntimeMapper mapper = new ActivitySubEventStageRuntimeMapper();

    @Test
    void keepsPendingWorkflowCountersIndependentFromPersistedResourceReads() {
        ActivitySubEventStageRuntime record = new ActivitySubEventStageRuntime();
        record.setOwnerId("event-1");
        record.setSubEventId("stage-1");
        record.setGroupsCount(4);
        record.setGroupResourceMetricsByAssetOwnerId(Map.of(
                "group-a", Map.of(
                        "owner-1", Map.of(
                                "Transport", new GroupResourceMetricRecord(1, 2, 0, 4),
                                "Accommodation", new GroupResourceMetricRecord(0, 1, 0, 2))),
                "group-b", Map.of(
                        "owner-2", Map.of(
                                "Supplies", new GroupResourceMetricRecord(2, 2, 0, 5)))));
        record.setGroupResourceReadAtByUserId(Map.of(
                "group-a", Map.of("user-1", Map.of("Accommodation", "read-at")),
                "group-b", Map.of("user-2", Map.of("Supplies", "read-at"))));

        ActivitySubEventStageRuntimeStateDto result = mapper.toDto(record, "user-1");

        assertEquals(4, result.groupsCount());
        assertEquals(0, result.groupsResourcePendingRead());
        assertEquals(0, mapper.toDto(record, "user-3").groupsResourcePendingRead());
    }
}
