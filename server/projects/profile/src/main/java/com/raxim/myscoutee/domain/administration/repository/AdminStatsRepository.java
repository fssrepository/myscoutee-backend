package com.raxim.myscoutee.domain.administration.repository;

import java.util.Optional;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;

public interface AdminStatsRepository extends MongoRepository<AdminStatsSnapshot, String> {
    String GLOBAL_STATS_KEY = "global";

    Optional<AdminStatsSnapshot> findByStatsKey(String statsKey);

    default AdminStatsSnapshot snapshotOrDefault(String groupId) {
        String key = groupId == null ? GLOBAL_STATS_KEY : groupId;
        return findByStatsKey(key).orElseGet(() -> AdminStatsSnapshot.createDefault(key));
    }

    default AdminStatsSnapshot ensureSnapshot(String groupId) {
        if (groupId == null) return ensureGlobalSnapshot();
        return findByStatsKey(groupId).orElseGet(() -> {
            try { return save(AdminStatsSnapshot.createDefault(groupId)); }
            catch (DuplicateKeyException ignored) { return findByStatsKey(groupId).orElseThrow(); }
        });
    }

    default Optional<AdminStatsSnapshot> findGlobalSnapshot() {
        return findByStatsKey(GLOBAL_STATS_KEY);
    }

    default AdminStatsSnapshot globalSnapshotOrDefault() {
        return findGlobalSnapshot().orElseGet(() -> AdminStatsSnapshot.createDefault(GLOBAL_STATS_KEY));
    }

    default AdminStatsSnapshot ensureGlobalSnapshot() {
        return findGlobalSnapshot().orElseGet(() -> {
            AdminStatsSnapshot snapshot = AdminStatsSnapshot.createDefault(GLOBAL_STATS_KEY);
            try {
                return save(snapshot);
            } catch (DuplicateKeyException ignored) {
                return findGlobalSnapshot().orElse(snapshot);
            }
        });
    }
}
