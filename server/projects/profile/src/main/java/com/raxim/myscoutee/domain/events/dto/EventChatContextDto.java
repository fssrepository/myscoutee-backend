package com.raxim.myscoutee.domain.events.dto;

import com.raxim.myscoutee.domain.events.api.EventChatContext;
public record EventChatContextDto(String sourceId, String avatar, String title, String startAtIso, String endAtIso)
        implements EventChatContext {
    public static EventChatContextDto from(EventChatContext e) {
        return e == null ? null : new EventChatContextDto(e.getSourceId(), e.getAvatar(), e.getTitle(), e.getStartAtIso(), e.getEndAtIso());
    }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getAvatar() { return avatar; }
    @Override public String getTitle() { return title; }
    @Override public String getStartAtIso() { return startAtIso; }
    @Override public String getEndAtIso() { return endAtIso; }
}
