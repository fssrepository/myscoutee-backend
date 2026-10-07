package com.raxim.myscoutee.domain.accounts.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile;

public interface NavigatorContactsProfilesRepository extends MongoRepository<NavigatorContactsProfile, String> {
    Optional<NavigatorContactsProfile> findByUserId(String userId);
}
