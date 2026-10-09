package com.raxim.myscoutee.microservices.transport.platform;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.platform.api.PaymentCredentialSecrets;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class PaymentCredentialSecretsEndpoint {
    private final PaymentCredentialSecrets owner;
    private final ObjectMapper mapper;
    public PaymentCredentialSecretsEndpoint(PaymentCredentialSecrets owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = PaymentCredentialSecretsProtocol.DECRYPT, produces = "application/json")
    public ResponseEntity<?> decrypt(HttpServletRequest request) throws java.io.IOException {
        return read(request, PaymentCredentialSecretsProtocol.Decrypt.class, PaymentCredentialSecretsProtocol::valid, command -> new PaymentCredentialSecretsProtocol.Plaintext(true, owner.decryptPaymentCredential(command.providerId(), command.envelope())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, PaymentCredentialSecretsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new PaymentCredentialSecretsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new PaymentCredentialSecretsProtocol.Error("PAYMENT_CREDENTIAL_SECRETS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
