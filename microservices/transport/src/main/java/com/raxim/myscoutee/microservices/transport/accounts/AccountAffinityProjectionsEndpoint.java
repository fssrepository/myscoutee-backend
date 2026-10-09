package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections;
import com.raxim.myscoutee.domain.accounts.dto.ScoringProfileDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AccountAffinityProjectionsEndpoint {
    private final AccountAffinityProjections owner;
    private final ObjectMapper mapper;
    public AccountAffinityProjectionsEndpoint(AccountAffinityProjections owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AccountAffinityProjectionsProtocol.UPDATE, produces = "application/json")
    public ResponseEntity<?> update(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountAffinityProjectionsProtocol.AffinityCommand.class, AccountAffinityProjectionsProtocol::valid,
                query -> new AccountAffinityProjectionsProtocol.Decision(owner.updateAffinity(query.userId(), query.affinity())));
    }
    @PostMapping(value = AccountAffinityProjectionsProtocol.JOB, produces = "application/json")
    public ResponseEntity<?> job(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountAffinityProjectionsProtocol.JobQuery.class, AccountAffinityProjectionsProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.active(), query.groupId(),
                        () -> owner.profilesForCurrentJob().stream().map(ScoringProfileDto::from).toList()));
    }
    @PostMapping(value = AccountAffinityProjectionsProtocol.CANDIDATE, produces = "application/json")
    public ResponseEntity<?> candidate(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountAffinityProjectionsProtocol.UserQuery.class, AccountAffinityProjectionsProtocol::valid,
                query -> new AccountAffinityProjectionsProtocol.Decision(owner.publicRandomRoomCandidate(query.userId())));
    }
    @PostMapping(value = AccountAffinityProjectionsProtocol.STALE, produces = "application/json")
    public ResponseEntity<?> stale(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountAffinityProjectionsProtocol.EmptyQuery.class, AccountAffinityProjectionsProtocol::valid,
                query -> java.util.Objects.requireNonNull(owner.staleRatingProfileIds()));
    }
    @PostMapping(value = AccountAffinityProjectionsProtocol.BACKFILL, produces = "application/json")
    public ResponseEntity<?> backfill(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountAffinityProjectionsProtocol.BackfillCommand.class, AccountAffinityProjectionsProtocol::valid, query -> {
            owner.backfillRatings(query.projections(), query.changedAt()); return new AccountAffinityProjectionsProtocol.Receipt(true);
        });
    }
    @PostMapping(value = AccountAffinityProjectionsProtocol.REFRESH, produces = "application/json")
    public ResponseEntity<?> refresh(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountAffinityProjectionsProtocol.RefreshCommand.class, AccountAffinityProjectionsProtocol::valid, query -> {
            owner.refreshRating(query.projection(), query.changedAt()); return new AccountAffinityProjectionsProtocol.Receipt(true);
        });
    }
    @PostMapping(value = AccountAffinityProjectionsProtocol.TOUCH, produces = "application/json")
    public ResponseEntity<?> touch(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountAffinityProjectionsProtocol.TouchCommand.class, AccountAffinityProjectionsProtocol::valid, query -> {
            owner.touchRatingActivity(query.userId(), query.activityMs()); return new AccountAffinityProjectionsProtocol.Receipt(true);
        });
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AccountAffinityProjectionsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AccountAffinityProjectionsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AccountAffinityProjectionsProtocol.Error("ACCOUNT_AFFINITY_PROJECTIONS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
