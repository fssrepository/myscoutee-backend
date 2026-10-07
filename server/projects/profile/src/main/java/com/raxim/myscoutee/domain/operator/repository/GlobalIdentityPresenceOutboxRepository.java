package com.raxim.myscoutee.domain.operator.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.operator.document.GlobalIdentityPresenceOutboxItem;

public interface GlobalIdentityPresenceOutboxRepository
        extends MongoRepository<GlobalIdentityPresenceOutboxItem, String> {
    List<GlobalIdentityPresenceOutboxItem>
            findByDeploymentIdOrderByPeriodAscRevisionAscChunkIndexAsc(
                    String deploymentId);

    List<GlobalIdentityPresenceOutboxItem>
            findByDeploymentIdAndPeriodAndRevisionOrderByChunkIndexAsc(
                    String deploymentId,
                    String period,
                    Long revision);
}
