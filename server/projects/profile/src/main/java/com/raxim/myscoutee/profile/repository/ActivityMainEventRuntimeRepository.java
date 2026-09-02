package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivityMainEventRuntime;

public interface ActivityMainEventRuntimeRepository extends MongoRepository<ActivityMainEventRuntime, String> {
    Optional<ActivityMainEventRuntime> findByEventIdAndRuntimeKind(String eventId, String runtimeKind);
}
