package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.UserExperienceProfile;

public interface UserExperienceProfilesRepository extends MongoRepository<UserExperienceProfile, String> {
    Optional<UserExperienceProfile> findByUserId(String userId);

    List<UserExperienceProfile> findByUserIdIn(Collection<String> userIds);
}
