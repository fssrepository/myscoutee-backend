package com.raxim.myscoutee.microservices.transport.payments;

public final class CurrentPaymentProviderProtocol {
    public static final String PATH = "/_internal/v1/payments/current-provider/cash-only";
    private CurrentPaymentProviderProtocol() {}
    /** A checked precondition result, not a payment command or a success fallback. */
    public record Result(Boolean resolved, Boolean cashOnly, String currentProvider) {}
    public record Error(String code) {}
}
