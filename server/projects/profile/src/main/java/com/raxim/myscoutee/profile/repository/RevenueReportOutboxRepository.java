package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.RevenueReportOutboxItem;

public interface RevenueReportOutboxRepository
        extends MongoRepository<RevenueReportOutboxItem, String> {
    List<RevenueReportOutboxItem>
            findByDeploymentIdOrderByPeriodAscRevisionAsc(String deploymentId);

    long countByDeploymentIdAndStatus(String deploymentId, String status);
}
