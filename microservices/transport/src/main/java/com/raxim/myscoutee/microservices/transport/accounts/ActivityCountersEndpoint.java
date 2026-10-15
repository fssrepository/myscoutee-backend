package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ActivityCountersEndpoint {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates menuCounters;
    private final ActivityCounters owner;
    private final com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters supportCounters;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.domain.accounts.api.ServiceFeedbackCounters feedback;
    private final com.raxim.myscoutee.domain.accounts.api.FeedCounts feed;
    public ActivityCountersEndpoint(ActivityCounters owner, ObjectMapper mapper,
            com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters supportCounters,
            com.raxim.myscoutee.domain.accounts.api.ServiceFeedbackCounters feedback, com.raxim.myscoutee.domain.accounts.api.FeedCounts feed) {
        this.owner = owner; this.mapper = mapper; this.supportCounters = supportCounters; this.feedback = feedback; this.feed = feed;
    }
    @PostMapping(value = ActivityCountersProtocol.MENU_CHANGE, produces = "application/json")
    public ResponseEntity<?> menuChange(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.MenuChange.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(),
                        () -> menuCounters.applyAll(query.changes())));
    }
    @PostMapping(value = ActivityCountersProtocol.FEEDBACK_RECEIPT, produces = "application/json")
    public ResponseEntity<?> feedbackReceipt(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.FeedbackReceipt.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(),
                    () -> new ActivityCountersProtocol.Count(owner.applyFeedbackReceipt(query.change()))));
    }
    @PostMapping(value = ActivityCountersProtocol.SUPPORT_PRESENT, produces = "application/json")
    public ResponseEntity<?> hasSupportCaseCounters(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.IdQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> new ActivityCountersProtocol.Decision(supportCounters.hasSupportCaseCounters(query.userId()))));
    }
    @PostMapping(value = ActivityCountersProtocol.SUPPORT_REFRESH, produces = "application/json")
    public ResponseEntity<?> refreshSupportCaseCountersForAdmins(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.ScopeQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> { supportCounters.refreshSupportCaseCountersForAdmins(); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.FEED_REFRESH, produces = "application/json")
    public ResponseEntity<?> refreshFeedCountersForUser(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.IdQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> { owner.refreshFeedCountersForUser(query.userId()); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.EVENT_SOURCES, produces = "application/json")
    public ResponseEntity<?> refreshEventCountersForSourceIds(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.IdsQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> { owner.refreshEventCountersForSourceIds(query.ids()); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.ASSET_REFRESH, produces = "application/json")
    public ResponseEntity<?> refreshAssetCountersForUser(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.IdQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> { owner.refreshAssetCountersForUser(query.userId()); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.EVENT_USERS, produces = "application/json")
    public ResponseEntity<?> refreshEventCountersForUsers(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.IdsQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> { owner.refreshEventCountersForUsers(query.ids()); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.MEMBERSHIP_DELTAS, produces = "application/json")
    public ResponseEntity<?> applyActiveEventMembershipDeltas(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.MembershipQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> { owner.applyActiveEventMembershipDeltas(query.added(), query.removed()); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.STORED_EVENTS, produces = "application/json")
    public ResponseEntity<?> readStoredEventCounters(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.IdQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> new ActivityCountersProtocol.Counters(true, owner.readStoredEventCounters(query.userId()))));
    }
    @PostMapping(value = ActivityCountersProtocol.EXPIRE_FOLLOWING, produces = "application/json")
    public ResponseEntity<?> expireFollowingCounters(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.InstantQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> { owner.expireFollowingCounters(query.now()); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.FEEDBACK_ELIGIBILITY, produces = "application/json")
    public ResponseEntity<?> syncFeedbackEligibilityForSourceIds(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.EligibilityQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> new ActivityCountersProtocol.Count(owner.syncFeedbackEligibilityForSourceIds(query.ids(), query.now()))));
    }
    @PostMapping(value = ActivityCountersProtocol.FEEDBACK_TRANSITION, produces = "application/json")
    public ResponseEntity<?> applyFeedbackTransition(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.FeedbackQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> { owner.applyFeedbackTransition(query.owners(), query.userId(), query.wasSubmitted(), query.wasRemoved(), query.isSubmitted(), query.isRemoved()); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.SERVICE_FEEDBACK, produces = "application/json")
    public ResponseEntity<?> serviceFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.ServiceFeedbackQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(),
                        () -> { feedback.updateServiceFeedbackPending(query.userId(), query.count()); return new ActivityCountersProtocol.Receipt(true); }));
    }
    @PostMapping(value = ActivityCountersProtocol.STORED_FEED, produces = "application/json")
    public ResponseEntity<?> storedFeed(HttpServletRequest request) throws java.io.IOException {
        return read(request, ActivityCountersProtocol.IdQuery.class, ActivityCountersProtocol::valid,
                query -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(query.scope().active(), query.scope().groupId(), () -> {
                    var counters = feed.counters(query.userId());
                    return new ActivityCountersProtocol.FeedValue(true, counters.revision(), counters.counts());
                }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ActivityCountersProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ActivityCountersProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ActivityCountersProtocol.Error("ACTIVITY_COUNTER_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
