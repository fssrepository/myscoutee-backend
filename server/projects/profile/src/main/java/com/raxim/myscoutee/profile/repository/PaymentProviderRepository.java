package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.PaymentProvider;

public interface PaymentProviderRepository extends MongoRepository<PaymentProvider, String> {
    List<PaymentProvider> findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc();
}
