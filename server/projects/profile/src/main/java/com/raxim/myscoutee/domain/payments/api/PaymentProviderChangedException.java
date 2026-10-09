package com.raxim.myscoutee.domain.payments.api;

import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

public final class PaymentProviderChangedException extends ResponseStatusException {
    public static final String CODE = "PAYMENT_PROVIDER_CHANGED";

    private final String currentProvider;

    public PaymentProviderChangedException(HttpStatus status, String currentProvider) {
        super(status, message(currentProvider));
        this.currentProvider = normalize(currentProvider);
    }

    public String getCurrentProvider() {
        return currentProvider;
    }

    private static String message(String currentProvider) {
        String provider = normalize(currentProvider);
        if (!StringUtils.hasText(provider) || "none".equals(provider)) {
            return "Payment provider changed to Cash only. Start payment again.";
        }
        return "Payment provider changed to " + label(provider) + ". Reconnect your card.";
    }

    private static String label(String provider) {
        return switch (provider) {
            case "stripe" -> "Stripe";
            case "barion" -> "Barion";
            default -> Character.toUpperCase(provider.charAt(0)) + provider.substring(1);
        };
    }

    private static String normalize(String value) {
        String normalized = value == null
                ? ""
                : value.trim().toLowerCase(Locale.ROOT);
        return StringUtils.hasText(normalized) && !"none".equals(normalized)
                ? normalized
                : null;
    }
}
