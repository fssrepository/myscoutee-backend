package com.raxim.myscoutee.profile.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.GlobalIdentityPresenceOutboxItem;

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
