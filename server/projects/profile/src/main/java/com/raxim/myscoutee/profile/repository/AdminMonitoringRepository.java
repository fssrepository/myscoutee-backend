package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AdminMonitoringSnapshot;

public interface AdminMonitoringRepository extends MongoRepository<AdminMonitoringSnapshot, String> {
    String GLOBAL_MONITORING_KEY = "global";

    Optional<AdminMonitoringSnapshot> findByMonitoringKey(String monitoringKey);

    default Optional<AdminMonitoringSnapshot> findGlobalSnapshot() {
        return findByMonitoringKey(GLOBAL_MONITORING_KEY);
    }

    default AdminMonitoringSnapshot globalSnapshotOrDefault() {
        return findGlobalSnapshot().orElseGet(() -> AdminMonitoringSnapshot.createDefault(GLOBAL_MONITORING_KEY));
    }

    default AdminMonitoringSnapshot ensureGlobalSnapshot() {
        return findGlobalSnapshot().orElseGet(() -> {
            AdminMonitoringSnapshot snapshot = AdminMonitoringSnapshot.createDefault(GLOBAL_MONITORING_KEY);
            try {
                return save(snapshot);
            } catch (DuplicateKeyException ignored) {
                return findGlobalSnapshot().orElse(snapshot);
            }
        });
    }
}
