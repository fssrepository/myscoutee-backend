package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.RevenueReportOutboxItem;

public interface RevenueReportOutboxRepository
        extends MongoRepository<RevenueReportOutboxItem, String> {
    List<RevenueReportOutboxItem>
            findByDeploymentIdOrderByPeriodAscRevisionAsc(String deploymentId);

    long countByDeploymentIdAndStatus(String deploymentId, String status);

    Page<RevenueReportOutboxItem> findByDeploymentId(
            String deploymentId,
            Pageable pageable);

    Page<RevenueReportOutboxItem> findByDeploymentIdAndStatus(
            String deploymentId,
            String status,
            Pageable pageable);

    Optional<RevenueReportOutboxItem> findByIdAndDeploymentId(
            String id,
            String deploymentId);
}
