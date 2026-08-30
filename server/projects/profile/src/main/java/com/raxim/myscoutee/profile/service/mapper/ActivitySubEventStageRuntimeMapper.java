package com.raxim.myscoutee.profile.service.mapper;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventStageRuntimeStateDto;

@Component
public class ActivitySubEventStageRuntimeMapper {
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_DELETED = "D";

    public ActivitySubEventStageRuntimeStateDto toDto(ActivitySubEventStageRuntime record) {
        return toDto(record, null);
    }

    public ActivitySubEventStageRuntimeStateDto toDto(ActivitySubEventStageRuntime record, String viewerUserId) {
        if (record == null || STATUS_DELETED.equals(safeText(record.getStatus()))) {
            return null;
        }
        return new ActivitySubEventStageRuntimeStateDto(
                normalizeId(record.getOwnerId()),
                normalizeId(record.getSubEventId()),
                safeText(record.getStageStatus()),
                safeText(record.getStageStatusReason()),
                safeText(record.getStageStatusUpdatedAt()),
                safeText(record.getStageFinalizedAt()),
                safeText(record.getStageFinalizedByUserId()),
                normalizeCount(record.getStageResultRevision()),
                normalizeCount(record.getGroupsCount()),
                resourcePendingRead(record, viewerUserId));
    }

    public ActivitySubEventStageRuntime toRecord(
            ActivitySubEventStageRuntimeStateDto state,
            ActivitySubEventStageRuntime existing,
            String actorUserId) {
        if (state == null) {
            return null;
        }
        String ownerId = normalizeId(state.ownerId());
        String subEventId = normalizeId(state.subEventId());
        if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(subEventId)) {
            return null;
        }
        String nowIso = Instant.now().toString();
        ActivitySubEventStageRuntime next = existing == null ? new ActivitySubEventStageRuntime() : cloneRecord(existing);
        next.setId(existing == null ? new ObjectId().toHexString() : existing.getId());
        next.setSyncKey(StringUtils.hasText(next.getSyncKey()) ? next.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setRecordId(recordId(ownerId, subEventId));
        next.setStatus(STATUS_ACTIVE);
        next.setOwnerId(ownerId);
        next.setSubEventId(subEventId);
        next.setStageStatus(safeText(state.stageStatus()));
        next.setStageStatusReason(safeText(state.stageStatusReason()));
        next.setStageStatusUpdatedAt(safeText(state.stageStatusUpdatedAt()));
        next.setStageFinalizedAt(safeText(state.stageFinalizedAt()));
        next.setStageFinalizedByUserId(safeText(state.stageFinalizedByUserId()));
        next.setStageResultRevision(state.stageResultRevision() == null
                ? existing == null ? null : normalizeCount(existing.getStageResultRevision())
                : normalizeCount(state.stageResultRevision()));
        next.setGroupsCount(state.groupsCount() == null
                ? existing == null ? null : normalizeCount(existing.getGroupsCount())
                : normalizeCount(state.groupsCount()));
        next.setCreatedDate(existing == null ? nowIso : firstNonBlank(existing.getCreatedDate(), nowIso));
        next.setCreatedUser(existing == null ? normalizeId(actorUserId) : safeText(existing.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(normalizeId(actorUserId));
        return next;
    }

    public String recordId(String ownerId, String subEventId) {
        String normalizedOwnerId = normalizeId(ownerId);
        String normalizedSubEventId = normalizeId(subEventId);
        return StringUtils.hasText(normalizedOwnerId) && StringUtils.hasText(normalizedSubEventId)
                ? normalizedOwnerId + ":" + normalizedSubEventId
                : "";
    }

    private ActivitySubEventStageRuntime cloneRecord(ActivitySubEventStageRuntime source) {
        ActivitySubEventStageRuntime clone = new ActivitySubEventStageRuntime();
        clone.setId(source.getId());
        clone.setSyncKey(source.getSyncKey());
        clone.setRecordId(source.getRecordId());
        clone.setStatus(source.getStatus());
        clone.setOwnerId(source.getOwnerId());
        clone.setSubEventId(source.getSubEventId());
        clone.setStageStatus(source.getStageStatus());
        clone.setStageStatusReason(source.getStageStatusReason());
        clone.setStageStatusUpdatedAt(source.getStageStatusUpdatedAt());
        clone.setStageFinalizedAt(source.getStageFinalizedAt());
        clone.setStageFinalizedByUserId(source.getStageFinalizedByUserId());
        clone.setStageResultRevision(source.getStageResultRevision());
        clone.setGroupsCount(source.getGroupsCount());
        clone.setGroupResourceMetricsByAssetOwnerId(cloneGroupResourceMetrics(
                source.getGroupResourceMetricsByAssetOwnerId()));
        clone.setGroupResourceReadAtByUserId(cloneGroupResourceReadAt(
                source.getGroupResourceReadAtByUserId()));
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
    }

    private Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> cloneGroupResourceMetrics(
            Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> source) {
        Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> result = new LinkedHashMap<>();
        for (Map.Entry<String, Map<String, Map<String, GroupResourceMetricRecord>>> groupEntry :
                (source == null ? Map.<String, Map<String, Map<String, GroupResourceMetricRecord>>>of() : source).entrySet()) {
            Map<String, Map<String, GroupResourceMetricRecord>> byAssetOwner = new LinkedHashMap<>();
            for (Map.Entry<String, Map<String, GroupResourceMetricRecord>> ownerEntry :
                    (groupEntry.getValue() == null ? Map.<String, Map<String, GroupResourceMetricRecord>>of() : groupEntry.getValue()).entrySet()) {
                byAssetOwner.put(ownerEntry.getKey(), new LinkedHashMap<>(
                        ownerEntry.getValue() == null ? Map.of() : ownerEntry.getValue()));
            }
            result.put(groupEntry.getKey(), byAssetOwner);
        }
        return result;
    }

    public int resourcePendingRead(ActivitySubEventStageRuntime record, String viewerUserId) {
        String normalizedViewerUserId = normalizeId(viewerUserId);
        if (record == null || !StringUtils.hasText(normalizedViewerUserId)) {
            return 0;
        }
        Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> metricsByGroup =
                record.getGroupResourceMetricsByAssetOwnerId() == null
                        ? Map.of()
                        : record.getGroupResourceMetricsByAssetOwnerId();
        Map<String, Map<String, Map<String, String>>> readsByGroup =
                record.getGroupResourceReadAtByUserId() == null
                        ? Map.of()
                        : record.getGroupResourceReadAtByUserId();
        int total = 0;
        for (Map.Entry<String, Map<String, Map<String, String>>> groupEntry : readsByGroup.entrySet()) {
            Map<String, String> readAtByType = groupEntry.getValue() == null
                    ? Map.of()
                    : groupEntry.getValue().getOrDefault(normalizedViewerUserId, Map.of());
            Map<String, Map<String, GroupResourceMetricRecord>> metricsByOwner =
                    metricsByGroup.getOrDefault(groupEntry.getKey(), Map.of());
            for (String resourceType : readAtByType.keySet()) {
                for (Map<String, GroupResourceMetricRecord> metricsByType : metricsByOwner.values()) {
                    GroupResourceMetricRecord metric = metricsByType == null ? null : metricsByType.get(resourceType);
                    total = Math.addExact(total, normalizeCount(metric == null ? null : metric.pending()));
                }
            }
        }
        return total;
    }

    private Map<String, Map<String, Map<String, String>>> cloneGroupResourceReadAt(
            Map<String, Map<String, Map<String, String>>> source) {
        Map<String, Map<String, Map<String, String>>> result = new LinkedHashMap<>();
        for (Map.Entry<String, Map<String, Map<String, String>>> groupEntry :
                (source == null ? Map.<String, Map<String, Map<String, String>>>of() : source).entrySet()) {
            Map<String, Map<String, String>> byUser = new LinkedHashMap<>();
            for (Map.Entry<String, Map<String, String>> userEntry :
                    (groupEntry.getValue() == null ? Map.<String, Map<String, String>>of() : groupEntry.getValue()).entrySet()) {
                byUser.put(userEntry.getKey(), new LinkedHashMap<>(
                        userEntry.getValue() == null ? Map.of() : userEntry.getValue()));
            }
            result.put(groupEntry.getKey(), byUser);
        }
        return result;
    }

    private String firstNonBlank(String... values) {
        if (values == null) {
            return "";
        }
        for (String value : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private Integer normalizeCount(Integer value) {
        return value == null ? null : Math.max(0, value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
