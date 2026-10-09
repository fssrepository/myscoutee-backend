package com.raxim.myscoutee.microservices.transport.payments;

public final class ExchangeRateConfigurationProtocol {
    public static final String PATH = "/_internal/v1/payments/exchange-rate-source/validate";
    public static final int MAX_REQUEST_BYTES = 16384;
    private ExchangeRateConfigurationProtocol() {}
    public record Query(String value) {}
    public record Result(Boolean resolved, String source) {}
    public record Error(String code) {}
    public static boolean valid(Query value) { return value != null && (value.value() == null || value.value().length() <= 8192); }
}
