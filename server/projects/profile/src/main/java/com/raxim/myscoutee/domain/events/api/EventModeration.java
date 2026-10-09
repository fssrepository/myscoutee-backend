package com.raxim.myscoutee.domain.events.api;
public interface EventModeration {
    void apply(String sourceId, long version, String status);
    com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto detail(String sourceId, String ownerId);
}
