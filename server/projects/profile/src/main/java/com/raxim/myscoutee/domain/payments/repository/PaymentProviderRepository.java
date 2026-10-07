package com.raxim.myscoutee.domain.payments.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.payments.document.PaymentProvider;

public interface PaymentProviderRepository extends MongoRepository<PaymentProvider, String> {
    List<PaymentProvider> findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc();
}
