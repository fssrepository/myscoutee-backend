package com.raxim.myscoutee.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.raxim.myscoutee.profile.data.document.Payment;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PaymentsRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByCheckoutSessionId(String checkoutSessionId);
    Optional<Payment> findByGatewaySessionId(String gatewaySessionId);
    Optional<Payment> findByGatewayAuthorizationId(String gatewayAuthorizationId);
    java.util.List<Payment> findByUserIdAndSourceId(String userId, String sourceId);
    java.util.List<Payment> findByUserIdAndSourceIdIn(String userId, Collection<String> sourceIds);
    java.util.List<Payment> findByUserIdAndPaymentMethodIdOrderByCreatedDateDesc(String userId, String paymentMethodId);
    java.util.List<Payment> findByUserIdOrderByCreatedDateDesc(String userId);
    java.util.List<Payment> findByRevisionRootSessionId(String revisionRootSessionId);
    java.util.List<Payment> findByStatusAndBookingStatus(String status, String bookingStatus);

    /**
     * Narrow candidate read for the local revenue ruleset. The service still
     * validates every field, but simulated checkout sessions and known audit
     * revisions never enter the accounting accumulator.
     */
    @Query("""
            {
              'status': { '$in': ['approved', 'partially_refunded', 'refunded'] },
              'provider': { '$ne': 'dummy' },
              '$or': [
                { 'auditKind': { '$exists': false } },
                { 'auditKind': null },
                { 'auditKind': '' },
                { 'auditKind': 'payment' }
              ]
            }
            """)
    List<Payment> findRevenueCandidates();
}
