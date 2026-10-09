package com.raxim.myscoutee.domain.email.dto;

import com.raxim.myscoutee.domain.email.api.ScheduledMessages;
public record ScheduledMessageTaskDto(String taskKey, String status, String dueAtIso) implements ScheduledMessages.Task {
    public static ScheduledMessageTaskDto from(ScheduledMessages.Task t) { return t == null ? null : new ScheduledMessageTaskDto(t.getTaskKey(), t.getStatus(), t.getDueAtIso()); }
    @Override public String getTaskKey() { return taskKey; }
    @Override public String getStatus() { return status; }
    @Override public String getDueAtIso() { return dueAtIso; }
}
