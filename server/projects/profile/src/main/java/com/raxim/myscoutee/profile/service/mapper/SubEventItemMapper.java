package com.raxim.myscoutee.profile.service.mapper;

import java.util.ArrayList;
import java.util.List;

import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventItemDto;

public final class SubEventItemMapper {
    private SubEventItemMapper() {
    }

    public static List<SubEventItemDto> toDtoList(List<SubEventItem> items) {
        if (items == null) {
            return new ArrayList<>();
        }
        List<SubEventItemDto> dtoItems = new ArrayList<>(items.size());
        for (SubEventItem item : items) {
            if (item != null) {
                dtoItems.add(toDto(item));
            }
        }
        return dtoItems;
    }

    public static SubEventItemDto toDto(SubEventItem item) {
        if (item == null) {
            return null;
        }
        return new SubEventItemDto(
                item.id(),
                item.name(),
                item.description(),
                item.startAt(),
                item.endAt(),
                item.location(),
                item.createdByUserId(),
                item.groups() == null ? List.of() : new ArrayList<>(item.groups()),
                item.tournamentGroupCount(),
                item.tournamentGroupCapacityMin(),
                item.tournamentGroupCapacityMax(),
                item.tournamentLeaderboardType(),
                item.tournamentAdvancePerGroup(),
                item.optional(),
                item.pricing(),
                item.capacityMin(),
                item.capacityMax(),
                item.membersAccepted(),
                item.membersPending(),
                item.carsPending(),
                item.accommodationPending(),
                item.suppliesPending(),
                item.carsAccepted(),
                item.accommodationAccepted(),
                item.suppliesAccepted(),
                item.carsCapacityMin(),
                item.carsCapacityMax(),
                item.accommodationCapacityMin(),
                item.accommodationCapacityMax(),
                item.suppliesCapacityMin(),
                item.suppliesCapacityMax(),
                item.slotStartOffsetMinutes(),
                item.slotDurationMinutes(),
                item.stageStatus(),
                item.stageStatusReason(),
                item.stageStatusUpdatedAt(),
                item.stageFinalizedAt(),
                item.stageFinalizedByUserId());
    }

    public static List<SubEventItem> toRecordList(List<SubEventItemDto> items) {
        if (items == null) {
            return new ArrayList<>();
        }
        List<SubEventItem> records = new ArrayList<>(items.size());
        for (SubEventItemDto item : items) {
            if (item != null) {
                records.add(toRecord(item));
            }
        }
        return records;
    }

    public static SubEventItem toRecord(SubEventItemDto item) {
        if (item == null) {
            return null;
        }
        return new SubEventItem(
                item.id(),
                item.name(),
                item.description(),
                item.startAt(),
                item.endAt(),
                item.location(),
                item.createdByUserId(),
                item.groups() == null ? List.of() : new ArrayList<>(item.groups()),
                item.tournamentGroupCount(),
                item.tournamentGroupCapacityMin(),
                item.tournamentGroupCapacityMax(),
                item.tournamentLeaderboardType(),
                item.tournamentAdvancePerGroup(),
                item.optional(),
                item.pricing(),
                item.capacityMin(),
                item.capacityMax(),
                item.membersAccepted(),
                item.membersPending(),
                item.carsPending(),
                item.accommodationPending(),
                item.suppliesPending(),
                item.carsAccepted(),
                item.accommodationAccepted(),
                item.suppliesAccepted(),
                item.carsCapacityMin(),
                item.carsCapacityMax(),
                item.accommodationCapacityMin(),
                item.accommodationCapacityMax(),
                item.suppliesCapacityMin(),
                item.suppliesCapacityMax(),
                item.slotStartOffsetMinutes(),
                item.slotDurationMinutes(),
                item.stageStatus(),
                item.stageStatusReason(),
                item.stageStatusUpdatedAt(),
                item.stageFinalizedAt(),
                item.stageFinalizedByUserId());
    }
}
