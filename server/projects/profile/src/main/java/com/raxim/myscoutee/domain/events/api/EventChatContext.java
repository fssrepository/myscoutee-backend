package com.raxim.myscoutee.domain.events.api;

/** Event-owned context used to create or refresh the main conversation. */
public interface EventChatContext {
    String getSourceId(); String getAvatar(); String getTitle(); String getStartAtIso(); String getEndAtIso();
}
