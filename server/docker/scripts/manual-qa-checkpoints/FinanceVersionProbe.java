import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Proxy;
import java.util.List;
import java.util.UUID;
import org.bson.Document;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.payments.repository.AffiliateRevenueRepository;
import com.raxim.myscoutee.domain.payments.service.ExchangeRateSource;
import com.raxim.myscoutee.domain.payments.service.AffiliateRevenueService;
import com.raxim.myscoutee.domain.payments.service.PaymentService;
import com.raxim.myscoutee.domain.payments.document.Payment;

/** Focused QA against the watcher's compiled classes; no Spring server or Gradle build. */
class FinanceVersionProbe {
    public static void main(String[] args) throws Exception {
        if (!"demo_db".equals(System.getenv("MONGODB_DEMO_DATABASE")))
            throw new IllegalStateException("This probe is restricted to the existing demo_db runtime.");
        var source = new ExchangeRateSource(" , ", "http://payment-simulator:18082");
        source.validate("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml");
        rejects(() -> source.validate("http://payment-simulator:18082/exchange-rates/eurofxref.xml"));
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        try {
            source.validate("http://payment-simulator:18082/exchange-rates/eurofxref.xml");
            rejects(() -> source.validate("http://payment-simulator:9999/rates"));
            rejects(() -> source.validate("http://other-internal-service:18082/rates"));
            rejects(() -> source.validate("http://secret@payment-simulator:18082/rates"));
        } finally { MongoSessionModeContext.clear(); }
        var devSource = new ExchangeRateSource(" payment-simulator, ", "http://payment-simulator:18082");
        rejects(() -> devSource.validate("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml"));
        System.out.println("PASS compiled ExchangeRateSource: REAL HTTPS, DEMO exact simulator origin, dev outbound restriction. No external HTTP call.");

        var settings = MongoClientSettings.builder()
            .applyToClusterSettings(b -> b.hosts(List.of(new ServerAddress(System.getenv("MONGODB_HOST"), 27017))))
            .credential(MongoCredential.createCredential(System.getenv("MONGO_APP_USERNAME"), "demo_db",
                System.getenv("MONGO_APP_PASSWORD").toCharArray())).build();
        String owner = "qa-finance-version-" + UUID.randomUUID(), payment = owner + "-payment";
        try (var client = MongoClients.create(settings)) {
            var mongo = new MongoTemplate(client, "demo_db");
            if (args.length == 1 && "authorization-revenue".equals(args[0])) {
                verifyAuthorizationRevenue(client);
                return;
            }
            if (args.length == 1 && "refund-intent".equals(args[0])) {
                verifyRefundIntent(client);
                return;
            }
            if (args.length == 1 && "default-fx".equals(args[0])) {
                verifyDefaultFx(client, mongo);
                return;
            }
            var partners = mongo.getCollection("affiliatePartners");
            var ledger = mongo.getCollection("affiliatePaymentContributions");
            var repository = new AffiliateRevenueRepository(mongo);
            try {
                // Produce the newer state through real repository mutations, then deliver stale work.
                repository.record(owner, payment, 7L, "EUR", 700L, 0L, 1L);
                repository.record(owner, payment, 8L, "EUR", 700L, 700L, 1L);
                var partnerBefore = partners.find(new Document("_id", owner)).first();
                var ledgerBefore = ledger.find(new Document("_id", owner + ":" + payment)).first();
                repository.record(owner, payment, 7L, "EUR", 700L, 0L, 1L);
                repository.record(owner, payment, 8L, "EUR", 700L, 700L, 1L);
                if (!partnerBefore.equals(partners.find(new Document("_id", owner)).first())
                        || !ledgerBefore.equals(ledger.find(new Document("_id", owner + ":" + payment)).first()))
                    throw new AssertionError("Stale/replayed version changed the persisted contribution or counters.");
                System.out.println("PASS compiled AffiliateRevenueRepository + Mongo: capture v7, full refund v8, stale v7 and repeated v8 leave ledger/counters unchanged.");
            } finally {
                ledger.deleteMany(new Document("ownerUserId", owner));
                partners.deleteOne(new Document("_id", owner));
            }
            for (int boundary = 0; boundary < 4; boundary++) verifyRecovery(client, boundary);
        }
    }
    private static void verifyRefundIntent(MongoClient client) throws Exception {
        String prefix = "qaRefundIntent_" + UUID.randomUUID().toString().replace("-", "") + "_";
        var isolated = isolatedTemplate(client, prefix, null);
        var repository = new org.springframework.data.mongodb.repository.support.MongoRepositoryFactory(isolated)
                .getRepository(com.raxim.myscoutee.domain.payments.repository.PaymentsRepository.class);
        try {
            for (String scenario : List.of("normal", "timeout", "late-receipt", "legacy", "cash")) {
                var receipts = new java.util.concurrent.ConcurrentHashMap<String, com.raxim.myscoutee.domain.payments.service.PaymentGateway.RefundResult>();
                var calls = new java.util.concurrent.atomic.AtomicInteger();
                var first = new java.util.concurrent.atomic.AtomicBoolean(true);
                var arrived = new java.util.concurrent.CountDownLatch(1);
                var release = new java.util.concurrent.CountDownLatch(1);
                var processor = (com.raxim.myscoutee.domain.payments.service.PaymentProcessor) Proxy.newProxyInstance(
                        com.raxim.myscoutee.domain.payments.service.PaymentProcessor.class.getClassLoader(),
                        new Class<?>[]{com.raxim.myscoutee.domain.payments.service.PaymentProcessor.class}, (proxy, method, arguments) -> {
                    if (method.getName().equals("getType")) return "stripe";
                    if (!method.getName().equals("refundCapturedPayment")) throw new UnsupportedOperationException(method.getName());
                    calls.incrementAndGet();
                    String key = (String) arguments[3];
                    var receipt = receipts.computeIfAbsent(key, k -> new com.raxim.myscoutee.domain.payments.service.PaymentGateway.RefundResult(
                            "stripe", (String) arguments[0], "receipt-" + k,
                            com.raxim.myscoutee.domain.payments.service.PaymentGateway.RefundStatus.SUCCEEDED,
                            (java.math.BigDecimal) arguments[1], (String) arguments[2], "succeeded"));
                    if (first.compareAndSet(true, false)) {
                        if (scenario.equals("timeout")) throw new IllegalStateException("Injected response loss after provider commit");
                        if (scenario.equals("late-receipt")) {
                            arrived.countDown();
                            if (!release.await(10, java.util.concurrent.TimeUnit.SECONDS)) throw new IllegalStateException("Late receipt timed out");
                        }
                    }
                    return receipt;
                });
                var service = new PaymentService(List.of(processor), repository, null, null, null, null, null, null, null);
                var secondInstance = new PaymentService(List.of(processor), repository, null, null, null, null, null, null, null);
                var payment = new Payment(); payment.setId(scenario); payment.setAuditKind("payment");
                payment.setProvider(scenario.equals("cash") ? "cash" : "stripe"); payment.setStatus("captured"); payment.setAmount(100D);
                payment.setCurrency("EUR"); payment.setUserId(prefix); payment.setRecipientUserId(prefix + "organizer");
                payment.setSourceId(prefix + "event"); payment.setGatewayAuthorizationId(scenario);
                payment = repository.save(payment);
                if (scenario.equals("legacy")) {
                    payment.setRefundedAmount(25D); payment.setRefundStatus("partial");
                    payment.setRefundedAtIso("2026-09-23T00:00:00Z"); payment.setRefundCurrency("EUR");
                    payment.setGatewayRefundStatus("succeeded"); payment.setGatewayRefundId("legacy-refund-receipt");
                    payment = repository.save(payment);
                    receipts.put("legacy", new com.raxim.myscoutee.domain.payments.service.PaymentGateway.RefundResult(
                            "stripe", scenario, "legacy-refund-receipt",
                            com.raxim.myscoutee.domain.payments.service.PaymentGateway.RefundStatus.SUCCEEDED,
                            java.math.BigDecimal.valueOf(25), "EUR", "succeeded"));
                }
                final Payment original = payment;
                String now = java.time.Instant.now().toString();
                var asyncFailure = new java.util.concurrent.atomic.AtomicReference<Throwable>();
                Thread delayed = null;
                if (scenario.equals("late-receipt")) {
                    delayed = new Thread(() -> {
                        try { service.approvePolicyRefund(original, now, 25D, "EUR", "policy-25", "Policy"); }
                        catch (Throwable error) { asyncFailure.set(error); }
                    });
                    delayed.start();
                    if (!arrived.await(10, java.util.concurrent.TimeUnit.SECONDS)) throw new AssertionError("Provider was not reached");
                } else {
                    try { service.approvePolicyRefund(payment, now, 25D, "EUR", "policy-25", "Policy"); }
                    catch (IllegalStateException error) {
                        if (!scenario.equals("timeout")) throw error;
                        var intent = repository.findById(scenario).orElseThrow();
                        if (intent.getGatewayRefundAmount() != 25D || intent.getGatewayRefundTargetAmount() != 25D
                                || intent.getRefundedAmount() != null && intent.getRefundedAmount() != 0D)
                            throw new AssertionError("Timeout lost persisted intent or claimed a refund");
                    }
                }
                var priorHistory = isolated.getCollection("payments").find(new Document("_id", "refund:" + scenario)).first();
                try {
                    secondInstance.approvePolicyRefund(repository.findById(scenario).orElseThrow(), now, 100D, "EUR", "event-cancelled", "Event cancelled");
                } finally { release.countDown(); }
                if (delayed != null) {
                    delayed.join(10000);
                    if (delayed.isAlive() || asyncFailure.get() != null) throw new AssertionError("Delayed refund failed", asyncFailure.get());
                }
                var completed = repository.findById(scenario).orElseThrow();
                int callsBeforeReplay = calls.get();
                service.approvePolicyRefund(original, now, 25D, "EUR", "policy-25", "Policy");
                service.approvePolicyRefund(completed, now, 100D, "EUR", "event-cancelled", "Event cancelled");
                completed = repository.findById(scenario).orElseThrow();
                var total = receipts.values().stream().map(r -> r.amount()).reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
                if (!scenario.equals("cash") && (receipts.size() != 2 || total.compareTo(java.math.BigDecimal.valueOf(100)) != 0)
                        || scenario.equals("cash") && !receipts.isEmpty()
                        || completed.getRefundedAmount() != 100D || !"full".equals(completed.getRefundStatus())
                        || completed.getGatewayRefundAmount() != 75D
                        || !scenario.equals("cash") && !completed.getGatewayRefundId().endsWith(":10000")
                        || priorHistory != null && !priorHistory.equals(isolated.getCollection("payments").find(new Document("_id", "refund:" + scenario)).first())
                        || repository.findById("refund:" + scenario).orElseThrow().getAmount() != 25D
                        || repository.findById("refund:" + scenario + ":10000").orElseThrow().getAmount() != 75D
                        || isolated.getCollection("payments").countDocuments(new Document("auditKind", "refund").append("supersedesPaymentId", scenario)) != 2
                        || calls.get() != callsBeforeReplay)
                    throw new AssertionError("Refund target/replay contract failed: " + scenario);
                System.out.println("PASS compiled PaymentService + versioned Mongo: " + scenario + "; separate operations25/75; primary cumulative100; separate refund rows 25 and 75; stale/full replay no extra provider call.");
            }
        } finally { isolated.getCollection("payments").drop(); }
    }
    private static void verifyDefaultFx(MongoClient client, MongoTemplate live) {
        var seed = live.getCollection("exchangeRates").find(new Document("_id", "default-v1")).first();
        if (seed == null || !Boolean.TRUE.equals(seed.getBoolean("default")))
            throw new AssertionError("Versioned default seed was not imported.");
        String prefix = "qaDefaultFx_" + UUID.randomUUID().toString().replace("-", "") + "_";
        var isolated = isolatedTemplate(client, prefix, null);
        try {
            isolated.getCollection("exchangeRates").insertOne(seed);
            var store = new com.raxim.myscoutee.domain.payments.service.ExchangeRateStore(isolated);
            var service = new com.raxim.myscoutee.domain.payments.service.PaymentEuroService(store, isolated);
            var payment = new Payment(); payment.setAuditKind("payment"); payment.setStatus("captured");
            payment.setCurrency("HUF"); payment.setAmount(5000D); payment.setCreatedDate("2026-09-24T00:00:00Z");
            service.prepare(payment);
            if (payment.getEuro() == null || payment.getEuro().amountMinor() != 1250
                    || !"default-v1".equals(payment.getEuro().rateDate()))
                throw new AssertionError("First payment did not use persisted default.");
            isolated.getCollection("exchangeRates").insertOne(new Document("_id", "2026-09-24")
                    .append("source", "qa-daily").append("rates", new Document("HUF", "500")));
            // A cold store reads persisted observations; daily values win for new payments.
            var cold = new com.raxim.myscoutee.domain.payments.service.ExchangeRateStore(isolated);
            var quote = com.raxim.myscoutee.domain.payments.service.ExchangeRateStore.quote(
                    cold.observations(), java.time.LocalDate.parse("2026-09-24"), "HUF");
            if (!"qa-daily".equals(quote.source())) throw new AssertionError("Daily rate did not win.");
            var outage = com.raxim.myscoutee.domain.payments.service.ExchangeRateStore.quote(
                    cold.observations(), java.time.LocalDate.parse("2026-12-01"), "HUF");
            if (!"seed-default-v1".equals(outage.source())) throw new AssertionError("Outage lost default.");
            payment.setRefundedAmount(1250D); payment.setRefundedAtIso("2026-09-24T01:00:00Z");
            new com.raxim.myscoutee.domain.payments.service.PaymentEuroService(cold, isolated).prepare(payment);
            if (payment.getEuro().refundedMinor() != 313 || !"default-v1".equals(payment.getEuro().rateDate()))
                throw new AssertionError("Refund changed original seeded basis.");
            isolated.getCollection("users").insertOne(new Document("userId", prefix).append("summaryCurrency", "CZK"));
            var snapshot = payment.getEuro();
            isolated.getCollection("payments").insertOne(new Document("auditKind", "payment")
                    .append("userId", prefix).append("accountedSpentAmount", 5000D)
                    .append("euro", new Document("rateDate", snapshot.rateDate())
                            .append("amount", snapshot.amount()).append("refunded", snapshot.refunded())));
            var summary = service.summary(prefix, false);
            if (summary.outgoing() != 312.5 || summary.incoming() != 78.12 || summary.missingRates() != 0)
                throw new AssertionError("Default snapshot summary conversion failed: " + summary);
            isolated.getCollection("payments").updateMany(new Document("userId", prefix),
                    new Document("$set", new Document("euro.rateDate", "2026-09-20")));
            var missingDayBefore = isolated.getCollection("payments").find(new Document("userId", prefix)).first();
            var fallbackSummary = service.summary(prefix, false);
            if (fallbackSummary.outgoing() != 312.5 || fallbackSummary.incoming() != 78.12
                    || fallbackSummary.missingRates() != 0
                    || !missingDayBefore.equals(isolated.getCollection("payments").find(new Document("userId", prefix)).first()))
                throw new AssertionError("Absent daily observation must use default without rewriting payment snapshot: " + fallbackSummary);
            System.out.println("PASS summary with absent daily observation uses persisted default; payment snapshot unchanged.");
            System.out.println("PASS compiled default FX + Mongo: first payment 5000 HUF = 12.50 EUR; cold persisted read; daily priority; outage default; refund retains seed basis; CZK summary uses immutable default; no external HTTP.");
        } finally {
            for (String name : List.of("exchangeRates", "users", "payments")) isolated.getCollection(name).drop();
        }
    }
    private static void verifyAuthorizationRevenue(MongoClient client) {
        String prefix = "qaAuthorizationRevenue_" + UUID.randomUUID().toString().replace("-", "") + "_";
        MongoTemplate isolated = isolatedTemplate(client, prefix, null);
        var repository = new AffiliateRevenueRepository(isolated);
        var service = new AffiliateRevenueService(isolated, repository, null);
        try {
            Payment payment = new Payment();
            payment.setId("hold"); payment.setVersion(7L); payment.setAuditKind("payment");
            payment.setStatus("authorized"); payment.setCurrency("EUR"); payment.setAmount(7D);
            payment.setAffiliateOwnerUserId("owner"); payment.setAffiliateAttributionResolved(true);
            payment.setAffiliateRevenuePending(true);
            payment.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_EVENT_JOIN);
            isolated.insert(payment);
            service.record(payment);
            Document held = repository.summary("owner");
            Document eur = held.get("totals", Document.class).get("EUR", Document.class);
            if (AffiliateRevenueRepository.number(held, "purchases") != 0L
                    || AffiliateRevenueRepository.number(held, "eventBookings") != 0L
                    || AffiliateRevenueRepository.number(eur, "grossMinor") != 0L)
                throw new AssertionError("Authorization hold was counted as revenue: " + held.toJson());
            payment = isolated.findById("hold", Payment.class);
            payment.setStatus("captured"); payment.setAffiliateRevenuePending(true);
            payment = isolated.save(payment);
            service.record(payment);
            Document captured = repository.summary("owner");
            eur = captured.get("totals", Document.class).get("EUR", Document.class);
            if (AffiliateRevenueRepository.number(captured, "purchases") != 1L
                    || AffiliateRevenueRepository.number(captured, "eventBookings") != 1L
                    || AffiliateRevenueRepository.number(eur, "grossMinor") != 700L)
                throw new AssertionError("Capture did not replace the zero hold contribution.");
            service.record(payment);
            if (!captured.equals(repository.summary("owner"))) throw new AssertionError("Capture replay changed totals.");
            System.out.println("PASS compiled affiliate service + isolated Mongo: authorized hold contributes zero; capture contributes EUR7 once; replay unchanged. This is not a provider/UI hold-only test.");
        } finally {
            for (String name : List.of("payments", "affiliatePartners", "affiliatePaymentContributions"))
                isolated.getCollection(name).drop();
        }
    }

    private static void verifyRecovery(MongoClient client, int boundary) {
        String prefix = "qaFinanceRecovery_" + UUID.randomUUID().toString().replace("-", "") + "_";
        var fault = new WriteFault(boundary);
        MongoTemplate failing = isolatedTemplate(client, prefix, fault);
        MongoTemplate clean = isolatedTemplate(client, prefix, null);
        Payment payment = new Payment();
        payment.setId("payment"); payment.setVersion(7L); payment.setAuditKind("payment");
        payment.setStatus("captured"); payment.setCurrency("EUR"); payment.setAmount(7D);
        payment.setAffiliateOwnerUserId("owner"); payment.setAffiliateAttributionResolved(true);
        payment.setAffiliateRevenuePending(true); payment.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_EVENT_JOIN);
        try {
            clean.insert(payment);
            long initialVersion = payment.getVersion();
            try {
                new AffiliateRevenueService(failing, new AffiliateRevenueRepository(failing), null).record(payment);
                throw new AssertionError("Expected injected write failure at boundary " + boundary);
            } catch (InjectedFailure expected) { }
            if (!fault.fired || !clean.findById("payment", Payment.class).isAffiliateRevenuePending())
                throw new AssertionError("Failure lost the durable payment pending marker.");
            Document interrupted = clean.getCollection("affiliatePartners").find(new Document("_id", "owner")).first();
            Document contribution = clean.getCollection("affiliatePaymentContributions").find().first();
            if (boundary == 0 && (interrupted != null || contribution != null)
                    || boundary == 1 && (interrupted.get("pending") == null || contribution != null)
                    || boundary == 2 && (interrupted.get("pending") == null || contribution == null)
                    || boundary == 3 && (interrupted.get("pending") != null || contribution == null))
                throw new AssertionError("Wrong persisted interruption boundary " + boundary);
            // Fresh instances recover the real persisted journal; no outcome is seeded or patched.
            var recovered = new AffiliateRevenueService(clean, new AffiliateRevenueRepository(clean), null);
            recovered.record(clean.findById("payment", Payment.class));
            var partner = clean.getCollection("affiliatePartners").find(new Document("_id", "owner")).first();
            var saved = clean.findById("payment", Payment.class);
            var eur = partner.get("totals", Document.class).get("EUR", Document.class);
            if (AffiliateRevenueRepository.number(eur, "grossMinor") != 700L
                    || AffiliateRevenueRepository.number(eur, "refundedMinor") != 0L
                    || AffiliateRevenueRepository.number(partner, "purchases") != 1L
                    || AffiliateRevenueRepository.number(partner, "eventBookings") != 1L
                    || partner.get("pending") != null || saved.isAffiliateRevenuePending() || saved.getVersion() != initialVersion)
                throw new AssertionError("Recovery mismatch boundary " + boundary + ": " + partner.toJson() + ", version=" + saved.getVersion() + ", pending=" + saved.isAffiliateRevenuePending() + ", initialVersion=" + payment.getVersion());
            recovered.record(payment); // Replayed original work must also be harmless.
            if (!partner.equals(clean.getCollection("affiliatePartners").find(new Document("_id", "owner")).first()))
                throw new AssertionError("Recovery replay duplicated counters.");
            System.out.println("PASS compiled service/repository + isolated Mongo recovery boundary " + boundary + "; one contribution, pending cleared, original payment version retained.");
        } finally {
            for (String name : List.of("payments", "affiliatePartners", "affiliatePaymentContributions"))
                client.getDatabase("demo_db").getCollection(prefix + name).drop();
        }
    }
    private static MongoTemplate isolatedTemplate(MongoClient client, String prefix, WriteFault fault) {
        return new MongoTemplate(new SimpleMongoClientDatabaseFactory(client, "demo_db") {
            @Override public MongoDatabase getMongoDatabase() {
                MongoDatabase database = super.getMongoDatabase();
                return (MongoDatabase) Proxy.newProxyInstance(MongoDatabase.class.getClassLoader(), new Class<?>[]{MongoDatabase.class},
                    (proxy, method, args) -> {
                        if (method.getName().equals("getCollection")) {
                            String name = (String) args[0];
                            Object[] mapped = args.clone(); mapped[0] = prefix + name;
                            MongoCollection<?> collection = (MongoCollection<?>) method.invoke(database, mapped);
                            if (fault == null) return collection;
                            return Proxy.newProxyInstance(MongoCollection.class.getClassLoader(), new Class<?>[]{MongoCollection.class},
                                (p, m, a) -> {
                                    boolean hit = !fault.fired && m.getName().equals("updateOne") && a.length >= 2 && (
                                        fault.boundary == 0 && name.equals("affiliatePartners") && a[1] instanceof Document insertion && insertion.containsKey("$setOnInsert")
                                        || fault.boundary == 1 && name.equals("affiliatePartners") && a[1] instanceof Document pending && pending.containsKey("$set")
                                        || fault.boundary == 2 && name.equals("affiliatePaymentContributions")
                                        || fault.boundary == 3 && name.equals("affiliatePartners") && a[1] instanceof Document increment && increment.containsKey("$inc"));
                                    if (hit && fault.boundary == 0) { fault.fired = true; throw new InjectedFailure(); }
                                    Object result;
                                    try { result = m.invoke(collection, a); }
                                    catch (InvocationTargetException e) { throw e.getCause(); }
                                    if (hit) { fault.fired = true; throw new InjectedFailure(); }
                                    return result;
                                });
                        }
                        try { return method.invoke(database, args); }
                        catch (InvocationTargetException e) { throw e.getCause(); }
                    });
            }
        });
    }
    private static class WriteFault {
        final int boundary; boolean fired;
        WriteFault(int boundary) { this.boundary = boundary; }
    }
    private static class InjectedFailure extends RuntimeException { }
    private static void rejects(Runnable action) {
        try { action.run(); } catch (IllegalArgumentException expected) { return; }
        throw new AssertionError("Unsafe source was accepted.");
    }
}
