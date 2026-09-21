package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivityMingleSession;

public interface ActivityMingleSessionsRepository extends MongoRepository<ActivityMingleSession, String> {
    Optional<ActivityMingleSession> findByEventId(String eventId);

    List<ActivityMingleSession> findByStatusInOrderByUpdatedAtIsoDesc(Collection<String> statuses);

    List<ActivityMingleSession> findTop50ByStatusInAndPhaseEndsAtIsoLessThanEqualOrderByPhaseEndsAtIsoAsc(
            Collection<String> statuses,
            String phaseEndsAtIso);
}
