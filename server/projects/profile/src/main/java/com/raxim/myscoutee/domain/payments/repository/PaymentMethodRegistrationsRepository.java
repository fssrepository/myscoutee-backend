package com.raxim.myscoutee.domain.payments.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.payments.document.PaymentMethodRegistration;

public interface PaymentMethodRegistrationsRepository extends MongoRepository<PaymentMethodRegistration, String> {
    Optional<PaymentMethodRegistration> findByIdAndUserId(String id, String userId);
    List<PaymentMethodRegistration> findByUserIdAndStatusOrderByCreatedAtIsoDesc(String userId, String status);
    long deleteAllByUserId(String userId);
}
