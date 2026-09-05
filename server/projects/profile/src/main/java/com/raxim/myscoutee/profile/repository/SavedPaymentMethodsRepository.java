package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;

public interface SavedPaymentMethodsRepository extends MongoRepository<SavedPaymentMethod, String> {
    List<SavedPaymentMethod> findByUserIdAndStatusOrderByCreatedAtIsoDesc(String userId, String status);
    List<SavedPaymentMethod> findByUserIdAndStatusInOrderByCreatedAtIsoDesc(
            String userId,
            List<String> statuses);
    Optional<SavedPaymentMethod> findByIdAndUserId(String id, String userId);
    Optional<SavedPaymentMethod> findByRegistrationId(String registrationId);
    @Query("{ '_id': ?0, 'userId': ?1, 'status': { '$in': ['active', 'expired'] } }")
    @Update("{ '$set': { 'status': 'deleted', 'updatedAtIso': ?2 }, '$inc': { 'version': 1 } }")
    long markDeleted(String id, String userId, String updatedAtIso);
    @Query("{ '_id': ?0, 'userId': ?1, 'status': 'active' }")
    @Update("{ '$set': { 'status': 'replaced', 'replacedByPaymentMethodId': ?2, 'updatedAtIso': ?3 }, '$inc': { 'version': 1 } }")
    long markReplaced(String id, String userId, String replacementId, String updatedAtIso);
    @Query("{ '_id': ?0, 'userId': ?1, 'status': 'active', 'expiredNotifiedAtIso': null }")
    @Update("{ '$set': { 'status': 'expired', 'expiredNotifiedAtIso': ?2, 'updatedAtIso': ?2 }, '$inc': { 'version': 1 } }")
    long markExpired(String id, String userId, String updatedAtIso);
    List<SavedPaymentMethod> findTop100ByStatusAndExpiryKeyLessThanAndExpiredNotifiedAtIsoIsNullOrderByExpiryKeyAsc(
            String status,
            Integer expiryKey);
    long deleteAllByUserId(String userId);
}
