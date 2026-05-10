package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.Users;

public interface UsersRepository extends MongoRepository<Users, String> {
    Optional<Users> findByUserId(String userId);

    List<Users> findByUserIdIn(Collection<String> userIds);

    List<Users> findByProfileStatus(String profileStatus);

    List<Users> findByProfileStatusIn(Collection<String> profileStatuses);

    List<Users> findByPartitionKey(String partitionKey);

    List<Users> findByProfileStatusAndDeletedAtIsoLessThanEqual(String profileStatus, String deletedAtIso);
}
