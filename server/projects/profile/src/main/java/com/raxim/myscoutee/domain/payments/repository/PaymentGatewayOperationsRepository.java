package com.raxim.myscoutee.domain.payments.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.payments.document.PaymentGatewayOperation;

public interface PaymentGatewayOperationsRepository extends MongoRepository<PaymentGatewayOperation, String> {
    Optional<PaymentGatewayOperation> findByOperationKey(String operationKey);
    List<PaymentGatewayOperation> findByStatusIn(List<String> statuses);
}
