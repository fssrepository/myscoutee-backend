package com.raxim.myscoutee.domain.events.repository;

import java.util.List;
import java.util.Collection;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.events.document.ActivityMingleRound;

public interface ActivityMingleRoundsRepository extends MongoRepository<ActivityMingleRound, String> {
    List<ActivityMingleRound> findByEventIdInAndStatusOrderByRoundNumberAsc(Collection<String> eventIds, String status);

    Optional<ActivityMingleRound> findByEventIdAndRoundNumber(String eventId, Integer roundNumber);

    List<ActivityMingleRound> findByEventIdOrderByRoundNumberAsc(String eventId);
}
