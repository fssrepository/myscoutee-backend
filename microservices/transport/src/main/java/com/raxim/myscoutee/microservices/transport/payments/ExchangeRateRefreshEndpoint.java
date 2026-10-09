package com.raxim.myscoutee.microservices.transport.payments;

import java.io.IOException;
import java.util.concurrent.Semaphore;
import com.raxim.myscoutee.domain.payments.api.ExchangeRateRefresh;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ExchangeRateRefreshEndpoint {
    private final ExchangeRateRefresh owner;
    private final ObjectMapper mapper;
    private final Semaphore execution = new Semaphore(1);
    public ExchangeRateRefreshEndpoint(ExchangeRateRefresh owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ExchangeRateRefreshProtocol.RUN, produces = "application/json")
    public ResponseEntity<?> run(HttpServletRequest request) throws IOException {
        try {
            var bytes = ReadQueryBodies.readBytes(request, ExchangeRateRefreshProtocol.MAX_REQUEST_BYTES);
            ExchangeRateRefreshProtocol.Command command;
            try {
                command = mapper.readerFor(ExchangeRateRefreshProtocol.Command.class)
                        .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException error) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!ExchangeRateRefreshProtocol.valid(command)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            if (!execution.tryAcquire()) return error(503, "BUSY");
            try {
                JobGroupContext.call(command.active(), command.groupId(), () -> { owner.run(command.actor(), command.startedAt()); return null; });
                return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(new ExchangeRateRefreshProtocol.Receipt(true));
            } finally { execution.release(); }
        } catch (ReadQueryBodies.RejectedQuery error) { return error(error.status(), error.code()); }
        catch (RuntimeException error) { return error(503, "REFRESH_OUTCOME_UNKNOWN"); }
    }
    private ResponseEntity<?> error(int status, String code) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(new ExchangeRateRefreshProtocol.Error(code));
    }
}
