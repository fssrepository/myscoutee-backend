package com.raxim.myscoutee.domain.events.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges;
import com.raxim.myscoutee.domain.chat.api.AttachmentLifecycle;
import com.raxim.myscoutee.domain.email.api.ScheduledMessages;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.dto.EventLifecycleWorkDto;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

/** Existing email, chat, counter and affinity owners consume durable event effects. */
@Service
public class EventLifecycleWork {
    private final MongoTemplate mongo;
    private final ScheduledMongoSessionRunner databases;
    private final AttachmentLifecycle attachments;
    private final ScheduledMessages messages;
    private final AffinityStatusChanges affinity;
    private final org.springframework.beans.factory.ObjectProvider<ActivityCounters> counters;
    public EventLifecycleWork(MongoTemplate mongo, ScheduledMongoSessionRunner databases, AttachmentLifecycle attachments,
            ScheduledMessages messages, AffinityStatusChanges affinity, org.springframework.beans.factory.ObjectProvider<ActivityCounters> counters) {
        this.mongo = mongo; this.databases = databases; this.attachments = attachments;
        this.messages = messages; this.affinity = affinity; this.counters = counters;
    }
    public void prepare(ActivityEvent next, String actor, boolean available, String attachmentReason,
            String notificationReason, Collection<String> audience) {
        var pending = new ArrayList<>(next.getLifecycleWork());
        if (pending.size() >= 32) throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE, "Event lifecycle delivery is pending.");
        pending.add(new EventLifecycleWorkDto(UUID.randomUUID().toString(), next.getVersion() == null ? 0 : next.getVersion() + 1,
                actor, available, attachmentReason, notificationReason, next.getTitle(), List.copyOf(audience)));
        next.setLifecycleWork(pending);
    }
    @jakarta.annotation.PostConstruct
    public void initialize() {
        databases.runAcrossConfiguredDatabases(() -> {
            mongo.updateMulti(Query.query(Criteria.where("version").exists(false)), new Update().set("version", 0L), ActivityEvent.class);
            mongo.indexOps(ActivityEvent.class).ensureIndex(new org.springframework.data.mongodb.core.index.Index()
                    .on("lifecycleWork.id", org.springframework.data.domain.Sort.Direction.ASC).sparse());
        });
    }
    public void deliver(ActivityEvent event) {
        if (event == null) return;
        for (var work : event.getLifecycleWork()) {
            JobGroupContext.run(event.getWorkspaceGroupId(), () -> {
                attachments.project(new AttachmentLifecycle.Projection("event", event.getSourceId(), work.revision(), work.available(), work.attachmentReason()));
                if (work.notificationReason() != null && !work.audience().isEmpty())
                    messages.scheduleEventLifecycleChangedOnce(work.id(), event.getSourceId(), work.title(), work.audience(), List.of(work.notificationReason()), work.actor());
                affinity.enqueueEventChanged(event.getSourceId(), work.actor());
                counters.getObject().refreshEventCountersForSourceIds(List.of(event.getSourceId()));
                mongo.updateFirst(Query.query(Criteria.where("_id").is(event.getId()).and("lifecycleWork.id").is(work.id())),
                        new Update().pull("lifecycleWork", new org.bson.Document("id", work.id())).inc("version", 1L), ActivityEvent.class);
            });
        }
    }
    @Scheduled(fixedDelayString = "${events.lifecycle-recovery-delay-ms:10000}", initialDelayString = "${events.lifecycle-recovery-delay-ms:10000}")
    public void recover() {
        databases.runAcrossConfiguredDatabases(() -> {
            for (var event : mongo.find(Query.query(Criteria.where("lifecycleWork.0").exists(true)).limit(20), ActivityEvent.class)) {
                try { deliver(event); }
                catch (RuntimeException pending) {
                    org.slf4j.LoggerFactory.getLogger(EventLifecycleWork.class).warn("Event lifecycle delivery remains pending ({})", pending.getClass().getSimpleName());
                }
            }
        });
    }
}
