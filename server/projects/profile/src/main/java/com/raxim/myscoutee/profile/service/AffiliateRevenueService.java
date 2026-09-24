package com.raxim.myscoutee.profile.service;

import java.util.Map;
import java.util.TreeMap;
import java.util.Set;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.profile.data.document.AffiliateRegistration;
import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.AffiliateRevenueDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.AffiliateCurrencyRevenueDto;
import com.raxim.myscoutee.profile.repository.AffiliateRevenueRepository;

@Service
public class AffiliateRevenueService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.profile.service.exchange.PaymentEuroService euroService;
    private final MongoTemplate mongo;
    private final AffiliateRevenueRepository repository;
    private final ScheduledMongoSessionRunner sessions;
    public AffiliateRevenueService(MongoTemplate mongo, AffiliateRevenueRepository repository, ScheduledMongoSessionRunner sessions) {
        this.mongo = mongo; this.repository = repository; this.sessions = sessions;
    }

    public void prepare(Payment payment) {
        if (payment == null || !"payment".equals(payment.getAuditKind())) return;
        if (!payment.isAffiliateAttributionResolved()) {
            AffiliateRegistration registration = mongo.findById(payment.getUserId(), AffiliateRegistration.class);
            payment.setAffiliateOwnerUserId(registration == null ? null : registration.referrerUserId());
            payment.setAffiliateAttributionResolved(true);
        }
        payment.setAffiliateRevenuePending(payment.getAffiliateOwnerUserId() != null);
    }

    public void record(Payment payment) {
        if (payment == null || !payment.isAffiliateRevenuePending()) return;
        String currency = payment.getCurrency() == null ? "" : payment.getCurrency().toUpperCase(java.util.Locale.ROOT);
        if (!currency.matches("[A-Z]{3}")) throw new IllegalArgumentException("Invalid affiliate payment currency");
        Contribution contribution = contribution(payment);
        repository.record(payment.getAffiliateOwnerUserId(), payment.getId(), payment.getVersion(), currency,
                contribution.gross(), contribution.refunded(), contribution.eventBookings());
        // A newer save keeps its own pending flag, including across process failure/retry.
        mongo.updateFirst(Query.query(Criteria.where("_id").is(payment.getId()).and("version").is(payment.getVersion())),
                // This bookkeeping acknowledgement must not advance the payment domain version.
                new Update().set("affiliateRevenuePending", false).set("version", payment.getVersion()), Payment.class);
    }

    static Contribution contribution(Payment payment) {
        boolean settled = Set.of("approved", "captured", "partially_refunded", "refunded").contains(
                payment.getStatus() == null ? "" : payment.getStatus());
        long gross = settled ? minor(payment.getAmount()) : 0L;
        long refunded = payment.getRefundedAtIso() == null || payment.getRefundedAtIso().isBlank()
                ? 0L : Math.min(gross, minor(payment.getRefundedAmount()));
        return new Contribution(gross, refunded, gross > 0 && PaymentService.FULFILLMENT_KIND_EVENT_JOIN.equals(payment.getFulfillmentKind()) ? 1L : 0L);
    }
    record Contribution(long gross, long refunded, long eventBookings) { }
    private static long minor(Double amount) {
        return amount == null || !Double.isFinite(amount) || amount <= 0 ? 0L
                : BigDecimal.valueOf(amount).movePointRight(2).setScale(0, RoundingMode.HALF_UP).longValueExact();
    }

    public AffiliateRevenueDto summary(String owner) {
        Document summary = repository.summary(owner);
        Map<String, AffiliateCurrencyRevenueDto> currencies = new TreeMap<>();
        Document totals = summary == null ? null : summary.get("totals", Document.class);
        if (totals != null) totals.forEach((currency, value) -> {
            Document row = (Document) value;
            currencies.put(currency, new AffiliateCurrencyRevenueDto(
                    AffiliateRevenueRepository.number(row, "grossMinor") / 100D,
                    AffiliateRevenueRepository.number(row, "refundedMinor") / 100D,
                    AffiliateRevenueRepository.number(row, "netMinor") / 100D));
        });
        return new AffiliateRevenueDto(currencies, AffiliateRevenueRepository.number(summary, "purchases"),
                AffiliateRevenueRepository.number(summary, "eventBookings"), euroService == null ? null : euroService.summary(owner, true));
    }

    @Scheduled(fixedDelay = 30_000L)
    public void finishInterruptedWrites() {
        sessions.runAcrossConfiguredDatabases(() -> {
            for (Payment payment : mongo.find(Query.query(Criteria.where("affiliateRevenuePending").is(true)).limit(100), Payment.class)) {
                try { record(payment); }
                catch (RuntimeException error) {
                    org.slf4j.LoggerFactory.getLogger(AffiliateRevenueService.class)
                            .warn("Affiliate counter write remains pending: {}", error.getClass().getSimpleName());
                }
            }
        });
    }
}
