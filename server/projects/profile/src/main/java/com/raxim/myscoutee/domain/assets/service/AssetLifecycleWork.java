package com.raxim.myscoutee.domain.assets.service;

import java.util.*;
import com.raxim.myscoutee.domain.assets.dto.AssetLifecycleWorkDto;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges;
import com.raxim.myscoutee.domain.chat.api.AttachmentLifecycle;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

/** Persisted with the asset transition; existing owners perform each effect. */
@Service
public class AssetLifecycleWork {
    private final MongoTemplate mongo;
    private final ScheduledMongoSessionRunner databases;
    private final AttachmentLifecycle attachments;
    private final NotificationDelivery notifications;
    private final AffinityStatusChanges affinity;
    private final ActivityCounters counters;
    public AssetLifecycleWork(MongoTemplate mongo, ScheduledMongoSessionRunner databases, AttachmentLifecycle attachments,
            NotificationDelivery notifications, AffinityStatusChanges affinity, ActivityCounters counters) {
        this.mongo = mongo; this.databases = databases; this.attachments = attachments;
        this.notifications = notifications; this.affinity = affinity; this.counters = counters;
    }
    public void prepare(Asset next, String actor, boolean available, String reason, NotificationIntent notification, String... counterUsers) {
        var pending = new ArrayList<>(next.getLifecycleWork());
        if (pending.size() >= 32) throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE, "Asset lifecycle delivery is pending.");
        pending.add(new AssetLifecycleWorkDto(UUID.randomUUID().toString(), next.getVersion() == null ? 0 : next.getVersion() + 1,
                actor, available, reason, notification, Arrays.stream(counterUsers).filter(Objects::nonNull).distinct().toList()));
        next.setLifecycleWork(pending);
    }
    @jakarta.annotation.PostConstruct
    public void initialize() {
        databases.runAcrossConfiguredDatabases(() -> {
            mongo.updateMulti(Query.query(Criteria.where("version").exists(false)), new Update().set("version", 0L), Asset.class);
            mongo.indexOps(Asset.class).ensureIndex(new org.springframework.data.mongodb.core.index.Index()
                    .on("lifecycleWork.id", org.springframework.data.domain.Sort.Direction.ASC).sparse());
        });
    }
    public void deliver(Asset asset) {
        if (asset == null) return;
        for (var work : asset.getLifecycleWork()) {
            JobGroupContext.run(asset.getWorkspaceGroupId(), () -> {
                attachments.project(new AttachmentLifecycle.Projection("asset", asset.getAssetId(), work.revision(), work.available(), work.reason()));
                if (work.notification() != null) notifications.enqueueOnce("asset-lifecycle:" + work.id(), work.notification());
                affinity.enqueueAssetChanged(asset.getAssetId(), work.actor());
                for (String user : work.counterUsers()) counters.refreshAssetCountersForUser(user);
                mongo.updateFirst(Query.query(Criteria.where("_id").is(asset.getId()).and("lifecycleWork.id").is(work.id())),
                        new Update().pull("lifecycleWork", new org.bson.Document("id", work.id())).inc("version", 1L), Asset.class);
            });
        }
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watchPendingWork(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes,
            @org.springframework.beans.factory.annotation.Value("${assets.lifecycle-recovery-delay-ms:10000}") long retryMs) {
        changes.watch("AssetLifecycleWork", java.util.Set.of("assets"), java.util.Set.of("lifecycleWork"), () -> {
            recoverInCurrentDatabase();
            return mongo.exists(Query.query(Criteria.where("lifecycleWork.0").exists(true)), Asset.class)
                    ? java.time.Instant.now().plusMillis(Math.max(1, retryMs)) : null;
        });
    }

    public void recover() {
        databases.runAcrossConfiguredDatabases(this::recoverInCurrentDatabase);
    }

    private void recoverInCurrentDatabase() {
        for (var asset : mongo.find(Query.query(Criteria.where("lifecycleWork.0").exists(true)).limit(20), Asset.class)) {
                try { deliver(asset); }
                catch (RuntimeException pending) {
                    org.slf4j.LoggerFactory.getLogger(AssetLifecycleWork.class).warn("Asset lifecycle delivery remains pending ({})", pending.getClass().getSimpleName());
                }
            }
    }
}
