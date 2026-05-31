package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AdminStatsSnapshot;

public interface AdminStatsRepository extends MongoRepository<AdminStatsSnapshot, String> {
    String GLOBAL_STATS_KEY = "global";

    Optional<AdminStatsSnapshot> findByStatsKey(String statsKey);

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
