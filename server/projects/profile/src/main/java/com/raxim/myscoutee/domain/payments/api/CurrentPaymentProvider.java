package com.raxim.myscoutee.domain.payments.api;


public interface CurrentPaymentProvider {
    void requireCashOnly();
}
