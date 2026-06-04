package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.NavigatorContactsProfile;

public interface NavigatorContactsProfilesRepository extends MongoRepository<NavigatorContactsProfile, String> {
    Optional<NavigatorContactsProfile> findByUserId(String userId);
}
