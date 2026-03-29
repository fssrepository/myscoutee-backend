package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.SchedulerPlanMarker;

public interface SchedulerPlanMarkersRepository extends MongoRepository<SchedulerPlanMarker, String> {
    Optional<SchedulerPlanMarker> findBySyncKey(String syncKey);
}
