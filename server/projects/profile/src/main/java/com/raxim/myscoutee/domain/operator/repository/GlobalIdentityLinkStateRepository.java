package com.raxim.myscoutee.domain.operator.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.operator.document.GlobalIdentityLinkState;

public interface GlobalIdentityLinkStateRepository
        extends MongoRepository<GlobalIdentityLinkState, String> {
    Optional<GlobalIdentityLinkState> findByDeploymentIdAndLocalUserId(
            String deploymentId,
            String localUserId);

    Optional<GlobalIdentityLinkState>
            findFirstByLocalUserIdOrderByUpdatedAtDesc(String localUserId);

    List<GlobalIdentityLinkState>
            findByPendingOperationIsNotNullOrderByUpdatedAtAsc();

    List<GlobalIdentityLinkState>
            findByPurgeRequestedTrueAndPurgedAtIsNullOrderByUpdatedAtAsc();

    List<GlobalIdentityLinkState>
            findByDeploymentIdAndLocalUserIdInAndStatusInAndKeyVersionAndSuite(
                    String deploymentId,
                    Collection<String> localUserIds,
                    Collection<String> statuses,
                    Long keyVersion,
                    String suite);
}
