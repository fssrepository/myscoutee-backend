package com.raxim.myscoutee.domain.operator.service;

import java.time.Instant;
import java.util.function.Function;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.registry.api.RegistryHttpException;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.util.TextValues;

/** Shared delivery mechanics; each report retains its integrity checks, durable schema and error codes. */
final class OperatorReportDelivery {
    private OperatorReportDelivery() {}
    static boolean retryable(RuntimeException exception) {
        if (exception instanceof RegistryHttpException http) {
            return http.getStatusCode() == 0
                    || http.getStatusCode() == 408
                    || http.getStatusCode() == 425
                    || http.getStatusCode() == 429
                    || http.getStatusCode() >= 500;
        }
        return exception instanceof DataAccessException;
    }
    static boolean retryDue(String nextRetryAt, Instant now) {
        if (nextRetryAt == null || nextRetryAt.isBlank()) return true;
        try { return !Instant.parse(nextRetryAt).isAfter(now); }
        catch (RuntimeException invalid) { return true; }
    }
    static String failureCode(RuntimeException failure, String persistenceCode, String invalidCode, String rejectedCode) {
        if (failure instanceof RegistryHttpException http && http.getErrorCode() != null && !http.getErrorCode().isBlank())
            return http.getErrorCode();
        if (failure instanceof DataAccessException) return persistenceCode;
        return failure instanceof IllegalStateException ? invalidCode : rejectedCode;
    }
    static <T> T save(Supplier<T> save, String conflictMessage) {
        try { return save.get(); }
        catch (DataAccessException concurrent) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, conflictMessage, concurrent);
        }
    }
    static <T> void synchronizeScheduled(Supplier<T> synchronize, Function<T, String> state,
            Function<T, String> code, Logger logger, String kind) {
        MongoSessionMode previous = MongoSessionModeContext.currentMode();
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        try {
            T result = synchronize.get();
            if ("BLOCKED".equals(state.apply(result)) || "ERROR".equals(state.apply(result)))
                logger.warn("Scheduled " + kind + " reporting is {} ({}).", state.apply(result), TextValues.trim(code.apply(result)));
        } catch (RuntimeException failure) {
            logger.warn("Scheduled " + kind + " reporting failed; its durable outbox will be retried.", failure);
        } finally {
            MongoSessionModeContext.set(previous);
        }
    }
}
