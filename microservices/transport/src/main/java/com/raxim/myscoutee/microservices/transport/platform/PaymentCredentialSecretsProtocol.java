package com.raxim.myscoutee.microservices.transport.platform;

import com.raxim.myscoutee.domain.platform.api.PaymentCredentialSecrets;
import com.raxim.myscoutee.domain.platform.dto.EncryptedSecret;

public final class PaymentCredentialSecretsProtocol {
    public static final String DECRYPT = "/_internal/v1/platform/payment-credential-secrets/decrypt";
    public static final int MAX_REQUEST_BYTES = 1024 * 1024, MAX_RESPONSE_BYTES = 1024 * 1024;
    private PaymentCredentialSecretsProtocol() {}
    public static String[] paths() { return new String[]{DECRYPT}; }
    public record Error(String code) {}
    public record Decrypt(String providerId, EncryptedSecret envelope) {}
    public record Plaintext(Boolean resolved, String value) {}
    public static boolean valid(Decrypt value) { return value != null && value.providerId() != null && !value.providerId().isBlank() && SecretEnvelopeBounds.text(value.providerId(), 512) && SecretEnvelopeBounds.envelope(value.envelope()); }
}
