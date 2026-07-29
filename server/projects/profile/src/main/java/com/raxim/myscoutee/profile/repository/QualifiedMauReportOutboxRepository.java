package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.QualifiedMauReportOutboxItem;

public interface QualifiedMauReportOutboxRepository
        extends MongoRepository<QualifiedMauReportOutboxItem, String> {
    List<QualifiedMauReportOutboxItem>
            findByDeploymentIdOrderByPeriodAscRevisionAsc(String deploymentId);

    long countByDeploymentIdAndStatus(String deploymentId, String status);

    Page<QualifiedMauReportOutboxItem> findByDeploymentId(
            String deploymentId,
            Pageable pageable);

    Page<QualifiedMauReportOutboxItem> findByDeploymentIdAndStatus(
            String deploymentId,
            String status,
            Pageable pageable);

    Optional<QualifiedMauReportOutboxItem> findByIdAndDeploymentId(
            String id,
            String deploymentId);
}
