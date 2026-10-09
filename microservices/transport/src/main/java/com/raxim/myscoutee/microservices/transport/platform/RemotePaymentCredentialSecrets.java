package com.raxim.myscoutee.microservices.transport.platform;

import com.raxim.myscoutee.domain.platform.api.PaymentCredentialSecrets;
import com.raxim.myscoutee.domain.platform.dto.EncryptedSecret;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Purpose-scoped owner operation; no master key, arbitrary-purpose method or automatic retry. */
public final class RemotePaymentCredentialSecrets extends RemoteReadTransport implements PaymentCredentialSecrets {
    private final ObjectMapper mapper;
    public RemotePaymentCredentialSecrets(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public String decryptPaymentCredential(String providerId, EncryptedSecret envelope) {
        var command = new PaymentCredentialSecretsProtocol.Decrypt(providerId, envelope);
        if (!PaymentCredentialSecretsProtocol.valid(command)) throw new IllegalArgumentException("Invalid payment-credential-secrets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PaymentCredentialSecretsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("payment-credential-secrets request exceeds byte limit");
        var result = exchange(PaymentCredentialSecretsProtocol.DECRYPT, bytes, new TypeReference<PaymentCredentialSecretsProtocol.Plaintext>() {},
                "payment-credential-secrets.decrypt", PaymentCredentialSecretsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()) && SecretEnvelopeBounds.text(value.value(), 65536));
        return result.value();
    }
}
