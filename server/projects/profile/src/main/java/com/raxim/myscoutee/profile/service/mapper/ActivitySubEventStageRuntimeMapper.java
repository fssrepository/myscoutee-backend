package com.raxim.myscoutee.profile.service.mapper;

import java.time.Instant;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventStageRuntimeStateDto;

@Component
public class ActivitySubEventStageRuntimeMapper {
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_DELETED = "D";

    public ActivitySubEventStageRuntimeStateDto toDto(ActivitySubEventStageRuntime record) {
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
                safeText(record.getStageFinalizedByUserId()));
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
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
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

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
