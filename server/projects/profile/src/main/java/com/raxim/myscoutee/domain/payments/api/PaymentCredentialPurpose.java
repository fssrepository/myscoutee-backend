package com.raxim.myscoutee.domain.payments.api;
import java.util.Locale;
import org.springframework.util.StringUtils;
public final class PaymentCredentialPurpose {
    private static final String PAYMENT_CREDENTIAL_PURPOSE_PREFIX =
            "payment-credential/";
    private PaymentCredentialPurpose() {}
    public static String credentialPurpose(String providerId) {
        if (!StringUtils.hasText(providerId)) {
            throw new IllegalArgumentException(
                    "Payment provider id is required for credential encryption.");
        }
        return PAYMENT_CREDENTIAL_PURPOSE_PREFIX
                + providerId.trim().toLowerCase(Locale.ROOT);
    }
}
