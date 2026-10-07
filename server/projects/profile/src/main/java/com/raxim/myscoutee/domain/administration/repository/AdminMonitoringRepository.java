package com.raxim.myscoutee.domain.administration.repository;

import java.util.Optional;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.administration.document.AdminMonitoringSnapshot;

public interface AdminMonitoringRepository extends MongoRepository<AdminMonitoringSnapshot, String> {
    String GLOBAL_MONITORING_KEY = "global";

    Optional<AdminMonitoringSnapshot> findByMonitoringKey(String monitoringKey);

    default AdminMonitoringSnapshot snapshotOrDefault(String groupId) {
        return findByMonitoringKey(groupId == null ? GLOBAL_MONITORING_KEY : groupId)
                .orElseGet(() -> AdminMonitoringSnapshot.createDefault(groupId == null ? GLOBAL_MONITORING_KEY : groupId));
    }

    default AdminMonitoringSnapshot ensureSnapshot(String groupId) {
        if (groupId == null) return ensureGlobalSnapshot();
        return findByMonitoringKey(groupId).orElseGet(() -> {
            try { return save(AdminMonitoringSnapshot.createDefault(groupId)); }
            catch (DuplicateKeyException ignored) { return findByMonitoringKey(groupId).orElseThrow(); }
        });
    }

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
