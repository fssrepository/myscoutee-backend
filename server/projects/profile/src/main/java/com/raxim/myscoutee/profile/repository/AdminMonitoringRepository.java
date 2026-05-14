package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AdminMonitoringSnapshot;

public interface AdminMonitoringRepository extends MongoRepository<AdminMonitoringSnapshot, String> {
    Optional<AdminMonitoringSnapshot> findByMonitoringKey(String monitoringKey);
}
