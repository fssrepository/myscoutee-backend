package com.raxim.myscoutee.microservices.transport.payments;

import java.util.List;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentProviderDto;

public final class PaymentProvidersProtocol {
    public static final String CATALOG = "/_internal/v1/payments/providers";
    public static final String VALIDATE = "/_internal/v1/payments/providers/validate";
    public static final int MAX_REQUEST_BYTES = 1048576;
    private PaymentProvidersProtocol() {}
    public record Query(String providerId, List<PaymentProviderDto> availableProviders) {}
    public record Result(Boolean resolved, String providerId) {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{CATALOG, VALIDATE}; }
    public static boolean valid(Query query) {
        return query != null && text(query.providerId(), 512) && (query.availableProviders() == null
                || query.availableProviders().size() <= 256 && query.availableProviders().stream().allMatch(PaymentProvidersProtocol::provider));
    }
    public static boolean provider(PaymentProviderDto value) {
        return value != null && text(value.id(), 512) && text(value.label(), 4096) && text(value.logoUrl(), 8192)
                && text(value.logoAlt(), 4096) && text(value.palette(), 4096);
    }
    private static boolean text(String value, int max) { return value == null || value.length() <= max; }
}
