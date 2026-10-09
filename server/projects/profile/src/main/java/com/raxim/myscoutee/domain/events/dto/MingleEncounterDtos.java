package com.raxim.myscoutee.domain.events.dto;
import com.raxim.myscoutee.domain.events.api.MingleEncounters;
import java.util.List;
public final class MingleEncounterDtos {
    private MingleEncounterDtos() {}
    public record SessionDto(String id, String eventId, String status, Integer revision) implements MingleEncounters.Session {
        public static SessionDto from(MingleEncounters.Session value) { return value == null ? null : new SessionDto(value.getId(), value.getEventId(), value.getStatus(), value.getRevision()); }
        @Override public String getId() { return id; }
        @Override public String getEventId() { return eventId; }
        @Override public String getStatus() { return status; }
        @Override public Integer getRevision() { return revision; }
    }
    public record RoundDto(List<TableDto> tables) implements MingleEncounters.Round {
        public static RoundDto from(MingleEncounters.Round value) { return new RoundDto(value.getTables() == null ? null : value.getTables().stream().map(t -> new TableDto(t.memberUserIds())).toList()); }
        @Override public List<TableDto> getTables() { return tables; }
    }
    public record TableDto(List<String> memberUserIds) implements MingleEncounters.Table {}
}
