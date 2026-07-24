package com.raxim.myscoutee.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.raxim.myscoutee.profile.data.document.Payment;
import java.util.Collection;
import java.util.Optional;

public interface PaymentsRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByCheckoutSessionId(String checkoutSessionId);
    Optional<Payment> findByGatewaySessionId(String gatewaySessionId);
    java.util.List<Payment> findByUserIdAndSourceId(String userId, String sourceId);
    java.util.List<Payment> findByUserIdAndSourceIdIn(String userId, Collection<String> sourceIds);
    java.util.List<Payment> findByRevisionRootSessionId(String revisionRootSessionId);
}
