package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.Users;

public interface UsersRepository extends MongoRepository<Users, String> {
    @Query("{ 'userId': ?0, 'workspaceGroupId': null }")
    @org.springframework.data.mongodb.repository.Update("{ '$set': { 'activeWorkspaceGroupId': ?1 } }")
    long updateActiveWorkspace(String accountId, String groupId);

    @Query("{ 'userId': ?0, 'activeWorkspaceGroupId': ?1 }")
    @org.springframework.data.mongodb.repository.Update("{ '$unset': { 'activeWorkspaceGroupId': '' } }")
    long clearActiveWorkspace(String accountId, String groupId);

    @Query("{ 'userId': ?0 }")
    @org.springframework.data.mongodb.repository.Update("{ '$set': { 'locationCoordinates': ?1, 'partitionKey': ?2 } }")
    long updateLocation(String userId, Users.LocationCoordinatesRecord coordinates, String partitionKey);

    Optional<Users> findByWorkspaceGroupIdAndAccountUserId(String workspaceGroupId, String accountUserId);
    List<Users> findByAccountUserId(String accountUserId);
    List<Users> findByWorkspaceGroupId(String workspaceGroupId);
    @Query("{ 'workspaceGroupId': ?0, 'userId': {'$ne': ?1}, 'profileStatus': {'$nin': ['deleted','blocked','inactive']} }")
    org.springframework.data.domain.Page<Users> findPaymentMembers(String workspaceGroupId,String currentUserId,org.springframework.data.domain.Pageable pageable);
    List<Users> findByWorkspaceGroupIdAndAccountUserIdIn(String workspaceGroupId, java.util.Collection<String> accountIds);

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
