package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.Users;

public interface UsersRepository extends MongoRepository<Users, String> {
    @Query(value = "{}", sort = "{ 'name': 1, 'userId': 1 }", collation = "{ 'locale': 'en', 'strength': 2 }")
    List<Users> findAllByOrderByNameAscUserIdAsc();

    Optional<Users> findByUserId(String userId);

    Optional<Users> findFirstByEmail(String email);

    Optional<Users> findFirstByFirebaseUid(String firebaseUid);

    Optional<Users> findFirstByGoogleId(String googleId);

    Optional<Users> findFirstByFacebookId(String facebookId);

    List<Users> findByUserIdIn(Collection<String> userIds);

    List<Users> findByEmailIn(Collection<String> emails);

    List<Users> findByProfileStatus(String profileStatus);

    List<Users> findByProfileStatusIn(Collection<String> profileStatuses);

    List<Users> findByHostTier(String hostTier);

    List<Users> findByPartitionKey(String partitionKey);

    List<Users> findByProfileStatusAndDeletedAtIsoLessThanEqual(String profileStatus, String deletedAtIso);
}
