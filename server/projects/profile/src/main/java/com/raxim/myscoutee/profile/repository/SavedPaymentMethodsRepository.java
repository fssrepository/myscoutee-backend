package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;

public interface SavedPaymentMethodsRepository extends MongoRepository<SavedPaymentMethod, String> {
    List<SavedPaymentMethod> findByUserIdAndStatusOrderByCreatedAtIsoDesc(String userId, String status);
    Optional<SavedPaymentMethod> findByIdAndUserId(String id, String userId);
    Optional<SavedPaymentMethod> findByRegistrationId(String registrationId);
    List<SavedPaymentMethod> findTop100ByStatusAndExpiryKeyLessThanAndExpiredNotifiedAtIsoIsNullOrderByExpiryKeyAsc(
            String status,
            Integer expiryKey);
    long deleteAllByUserId(String userId);
}
