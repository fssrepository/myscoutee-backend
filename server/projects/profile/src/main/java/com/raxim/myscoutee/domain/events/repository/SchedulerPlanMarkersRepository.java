package com.raxim.myscoutee.domain.events.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.events.document.SchedulerPlanMarker;

public interface SchedulerPlanMarkersRepository extends MongoRepository<SchedulerPlanMarker, String> {
    Optional<SchedulerPlanMarker> findBySyncKey(String syncKey);
}
