package com.raxim.myscoutee.domain.events.dto;

import com.raxim.myscoutee.domain.events.api.EventSchedule;
public record EventScheduleDto(String id, String sourceId, String title, String startAtIso, Boolean published,
        Boolean isTrashed, java.util.List<StageDto> subEvents) implements EventSchedule {
    public static EventScheduleDto from(EventSchedule e) {
        return e == null ? null : new EventScheduleDto(e.getId(), e.getSourceId(), e.getTitle(), e.getStartAtIso(),
                e.getPublished(), e.getIsTrashed(), e.getSubEvents() == null ? null : e.getSubEvents().stream().map(StageDto::from).toList());
    }
    @Override public String getId() { return id; }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getTitle() { return title; }
    @Override public String getStartAtIso() { return startAtIso; }
    @Override public Boolean getPublished() { return published; }
    @Override public Boolean getIsTrashed() { return isTrashed; }
    @Override public java.util.List<StageDto> getSubEvents() { return subEvents; }
    public record StageDto(String id, String name, String startAt, Boolean optional, Integer tournamentGroupCapacityMin,
            Integer tournamentGroupCapacityMax, String tournamentLeaderboardType, Integer slotStartOffsetMinutes) implements EventSchedule.Stage {
        static StageDto from(EventSchedule.Stage s) { return s == null ? null : new StageDto(s.id(), s.name(), s.startAt(), s.optional(),
                s.tournamentGroupCapacityMin(), s.tournamentGroupCapacityMax(), s.tournamentLeaderboardType(), s.slotStartOffsetMinutes()); }
    }
}
