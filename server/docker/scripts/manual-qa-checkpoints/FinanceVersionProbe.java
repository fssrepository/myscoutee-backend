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
import com.raxim.myscoutee.profile.repository.AffiliateRevenueRepository;
import com.raxim.myscoutee.profile.service.exchange.ExchangeRateSource;
import com.raxim.myscoutee.profile.service.AffiliateRevenueService;
import com.raxim.myscoutee.profile.service.PaymentService;
import com.raxim.myscoutee.profile.data.document.Payment;

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
