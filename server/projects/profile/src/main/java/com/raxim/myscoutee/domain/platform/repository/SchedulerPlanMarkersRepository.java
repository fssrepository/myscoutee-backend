package com.raxim.myscoutee.domain.platform.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.platform.document.SchedulerPlanMarker;

public interface SchedulerPlanMarkersRepository extends MongoRepository<SchedulerPlanMarker, String> {
    Optional<SchedulerPlanMarker> findBySyncKey(String syncKey);
}
