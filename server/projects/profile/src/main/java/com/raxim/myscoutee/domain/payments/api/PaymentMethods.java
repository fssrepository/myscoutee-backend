package com.raxim.myscoutee.domain.payments.api;


public interface PaymentMethods {
    record Options(boolean cardsAvailable, java.util.List<String> currencies, java.util.Map<String, Double> eurRates) {}
    Options options();
}
