package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivityMingleRound;

public interface ActivityMingleRoundsRepository extends MongoRepository<ActivityMingleRound, String> {
    Optional<ActivityMingleRound> findByEventIdAndRoundNumber(String eventId, Integer roundNumber);

    List<ActivityMingleRound> findByEventIdOrderByRoundNumberAsc(String eventId);
}
