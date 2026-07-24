package com.raxim.myscoutee.profile.service.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventStageRuntimeStateDto;

class ActivitySubEventStageRuntimeMapperTest {
    private final ActivitySubEventStageRuntimeMapper mapper = new ActivitySubEventStageRuntimeMapper();

    @Test
    void doesNotCalculateBadgeCountersDuringRuntimeMapping() {
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

        ActivitySubEventStageRuntimeStateDto result = mapper.toDto(record);

        assertEquals(4, result.groupsCount());
    }
}
