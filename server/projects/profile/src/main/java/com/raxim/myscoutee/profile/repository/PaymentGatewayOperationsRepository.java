package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.PaymentGatewayOperation;

public interface PaymentGatewayOperationsRepository extends MongoRepository<PaymentGatewayOperation, String> {
    Optional<PaymentGatewayOperation> findByOperationKey(String operationKey);
    List<PaymentGatewayOperation> findByStatusIn(List<String> statuses);
}
