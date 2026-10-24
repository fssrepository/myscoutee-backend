package com.raxim.myscoutee.domain.email.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scheduledMessageRuns")
@CompoundIndexes({
        @CompoundIndex(name = "scheduled_message_run_rule_started", def = "{'ruleKey': 1, 'startedAtIso': -1}")
})
@lombok.Getter @lombok.Setter
public class ScheduledMessageRun {
    @Id
    private String id;

    @Indexed(name = "scheduled_message_run_id", unique = true)
    private String runId;

    private String ruleKey;
    private String scheduleType;
    private String status;
    private String startedAtIso;
    private String finishedAtIso;
    private Integer affectedCount;
    private Integer notificationCount;
    private Integer emailQueuedCount;
    private Integer failedCount;
    private String detail;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

}
