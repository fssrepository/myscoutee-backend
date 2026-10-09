package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.ExchangeRateConfiguration;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ExchangeRateConfigurationEndpoint {
    private final ExchangeRateConfiguration owner;
    private final ObjectMapper mapper;
    public ExchangeRateConfigurationEndpoint(ExchangeRateConfiguration owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ExchangeRateConfigurationProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] body = ReadQueryBodies.readBytes(request, ExchangeRateConfigurationProtocol.MAX_REQUEST_BYTES);
            ExchangeRateConfigurationProtocol.Query query;
            try {
                query = mapper.readerFor(ExchangeRateConfigurationProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(body);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!ExchangeRateConfigurationProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, new ExchangeRateConfigurationProtocol.Result(true, owner.validate(query.value())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ExchangeRateConfigurationProtocol.Error(invalid.code())); }
        catch (IllegalArgumentException rejected) { return response(400, new ExchangeRateConfigurationProtocol.Error("OWNER_REJECTED")); }
        catch (RuntimeException unavailable) { return response(503, new ExchangeRateConfigurationProtocol.Error("EXCHANGE_RATE_VALIDATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
