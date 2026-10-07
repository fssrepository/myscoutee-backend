package com.raxim.myscoutee.domain.email.api;

import java.util.*;
import com.raxim.myscoutee.domain.events.api.EventSchedule;
import com.raxim.myscoutee.domain.community.api.CaseFeedbackPreparation;
public interface ScheduledMessages {
    void touchUserActivity(String userId);
    List<? extends Task> scheduleEventStageReminders(EventSchedule event, String actorUserId);
    List<? extends Task> suspendEventStageReminders(String eventId, String actorUserId);
    void scheduleCaseFeedback(CaseFeedbackPreparation.Request closed);
    Task scheduleEventDefinitionChanged(
            String eventId,
            String eventTitle,
            Collection<String> audienceUserIds,
            Collection<String> reasons,
            String actorUserId);
    Task scheduleEventWatchlistDefinitionChanged(
            String eventId,
            String eventTitle,
            Collection<String> audienceUserIds,
            Collection<String> reasons,
            String actorUserId);
    Task scheduleEventLifecycleChanged(
            String eventId,
            String eventTitle,
            Collection<String> audienceUserIds,
            Collection<String> reasons,
            String actorUserId);
    interface Task { String getTaskKey(); String getStatus(); String getDueAtIso(); }

}
