package com.raxim.myscoutee.profile.service.exchange;

import java.math.*;
import com.raxim.myscoutee.profile.data.dto.payment.ExchangeRateDtos.Snapshot;
import com.raxim.myscoutee.profile.data.dto.payment.ExchangeRateDtos.Summary;
import java.time.*;
import java.util.*;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.profile.data.document.Payment;

@Service
public class PaymentEuroService {
    private final ExchangeRateStore rates;
    private final MongoTemplate mongo;
    public PaymentEuroService(ExchangeRateStore rates, MongoTemplate mongo) { this.rates = rates; this.mongo = mongo; }

    public void prepare(Payment payment) {
        if (payment == null || !"payment".equals(payment.getAuditKind()) || !contributes(payment)) return;
        Snapshot previous = payment.getEuro();
        String rate, date, source;
        if (previous != null) { rate = previous.rate(); date = previous.rateDate(); source = previous.source(); }
        else {
            String stamp = payment.getCapturedAtIso();
            if (stamp == null || stamp.isBlank()) stamp = payment.getGatewayApprovedAtIso();
            if (stamp == null || stamp.isBlank()) stamp = payment.getCreatedDate();
            LocalDate day;
            try { day = Instant.parse(stamp).atZone(ZoneOffset.UTC).toLocalDate(); }
            catch (RuntimeException invalid) { return; }
            var quote = ExchangeRateStore.quote(rates.observations(), day, payment.getCurrency().toUpperCase(Locale.ROOT));
            if (quote == null) return;
            rate = quote.eurPerUnit().toPlainString(); date = quote.date(); source = quote.source();
        }
        long gross = convert(payment.getAmount(), rate);
        long refund = payment.getRefundedAtIso() == null || payment.getRefundedAtIso().isBlank() ? 0
                : Math.min(gross, convert(payment.getRefundedAmount(), rate));
        BigDecimal rawGross = raw(payment.getAmount(), rate);
        BigDecimal rawRefund = refund == 0 ? BigDecimal.ZERO : raw(payment.getRefundedAmount(), rate).min(rawGross);
        payment.setEuro(new Snapshot(rate, date, source, gross, refund, rawGross.toPlainString(), rawRefund.toPlainString()));
    }
    private static boolean contributes(Payment payment) {
        return Set.of("authorized", "approved", "captured", "partially_refunded", "refunded").contains(
                payment.getStatus() == null ? "" : payment.getStatus())
                || "released".equals(payment.getStatus()) && payment.getRefundedAmount() != null && payment.getRefundedAmount() > 0;
    }
    private static BigDecimal raw(Double value, String rate) {
        return value == null || !Double.isFinite(value) || value <= 0 ? BigDecimal.ZERO
                : BigDecimal.valueOf(value).multiply(new BigDecimal(rate));
    }
    private static long convert(Double value, String rate) {
        if (value == null || !Double.isFinite(value) || value <= 0) return 0;
        return BigDecimal.valueOf(value).multiply(new BigDecimal(rate)).movePointRight(2)
                .setScale(0, RoundingMode.HALF_UP).longValueExact();
    }
    /** Bounded catch-up after observations arrive; version fence prevents overwriting a concurrent payment/refund. */
    public int fillMissing(boolean refreshed) {
        int updated = 0;
        Criteria criteria = Criteria.where("auditKind").is("payment").and("euro").is(null).and("accountedSpentAmount").gt(0);
        if (!refreshed) criteria.orOperator(Criteria.where("euroCheckedAt").is(null),
                Criteria.where("euroCheckedAt").lt(Instant.now().minusSeconds(3600).toString()));
        Query query = Query.query(criteria).with(org.springframework.data.domain.Sort.by("euroCheckedAt")).limit(100);
        for (Payment payment : mongo.find(query, Payment.class)) {
            prepare(payment);
            Update update = new Update().set("euroCheckedAt", Instant.now().toString());
            if (payment.getEuro() != null) update.set("euro", payment.getEuro());
            updated += mongo.updateFirst(Query.query(Criteria.where("_id").is(payment.getId()).and("version").is(payment.getVersion())),
                    update, Payment.class).getModifiedCount();
        }
        return updated;
    }
    public String currency(String userId) {
        Document user = mongo.getCollection("users").find(new Document("userId", userId))
                .projection(new Document("summaryCurrency", 1)).first();
        String value = user == null ? null : user.getString("summaryCurrency");
        return value == null || !value.matches("[A-Z]{3}") ? "EUR" : value;
    }
    public List<String> currencies() {
        Set<String> codes = new TreeSet<>(); codes.add("EUR");
        var observations = rates.observations();
        for (var observation : observations) {
            Document values = observation.get("rates", Document.class);
            if (values != null) codes.addAll(values.keySet());
        }
        return List.copyOf(codes);
    }
    public void selectCurrency(String userId, String currency) {
        if (currency == null || !currencies().contains(currency))
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Unsupported summary currency.");
        mongo.getCollection("users").updateOne(new Document("userId", userId),
                new Document("$set", new Document("summaryCurrency", currency)));
    }
    public Summary summary(String userId, boolean affiliate) {
        String currency = currency(userId);

        Document match = new Document("auditKind", "payment");
        if (affiliate) match.append("affiliateOwnerUserId", userId).append("status", new Document("$in",
                List.of("approved", "captured", "partially_refunded", "refunded")));
        else match.append("$or", List.of(new Document("userId", userId), new Document("recipientUserId", userId)))
                .append("accountedSpentAmount", new Document("$gt", 0));
        String defaultRate = rates.observations().stream()
                .filter(row -> Boolean.TRUE.equals(row.getBoolean("default")))
                .map(row -> row.get("rates", Document.class))
                .filter(Objects::nonNull).map(row -> row.getString(currency)).filter(Objects::nonNull)
                .findFirst().orElse(null);
        Object conversion = "EUR".equals(currency) ? 1 : new Document("$convert", new Document("input",
                new Document("$ifNull", Arrays.asList(
                        new Document("$arrayElemAt", List.of("$observation.rates." + currency, 0)), defaultRate)))
                .append("to", "decimal").append("onError", null).append("onNull", null));
        Object available = new Document("$and", List.of(new Document("$ne", Arrays.asList("$euro", null)),
                new Document("$ne", Arrays.asList(conversion, null))));
        Object gross = new Document("$round", List.of(new Document("$multiply", List.of(new Document("$multiply", List.of(new Document("$toDecimal", new Document("$ifNull", List.of("$euro.amount", "0"))), 100)),
                new Document("$ifNull", List.of(conversion, 0)))), 0));
        Object refund = new Document("$round", List.of(new Document("$multiply", List.of(new Document("$multiply", List.of(new Document("$toDecimal", new Document("$ifNull", List.of("$euro.refunded", "0"))), 100)),
                new Document("$ifNull", List.of(conversion, 0)))), 0));
        Object payer = new Document("$eq", List.of("$userId", userId));
        Document group = new Document("_id", null)
                .append("gross", new Document("$sum", gross)).append("refunded", new Document("$sum", refund))
                .append("outgoing", new Document("$sum", new Document("$cond", List.of(payer, gross, refund))))
                .append("incoming", new Document("$sum", new Document("$cond", List.of(payer, refund, gross))))
                .append("missing", new Document("$sum", new Document("$cond", List.of(available, 0, 1))));
        List<Document> pipeline = new ArrayList<>();
        pipeline.add(new Document("$match", match));
        if (!"EUR".equals(currency)) pipeline.add(new Document("$lookup", new Document("from", "exchangeRates")
                .append("localField", "euro.rateDate").append("foreignField", "_id").append("as", "observation")));
        pipeline.add(new Document("$group", group));
        Document result = mongo.getCollection("payments").aggregate(pipeline).first();
        long grossValue = number(result, "gross"), refundValue = number(result, "refunded");
        return new Summary(number(result, "outgoing") / 100D, number(result, "incoming") / 100D,
                grossValue / 100D, refundValue / 100D, (grossValue - refundValue) / 100D, number(result, "missing"), currency, currencies());
    }
    private static long number(Document row, String field) { return row != null && row.get(field) instanceof org.bson.types.Decimal128 d ? d.bigDecimalValue().longValueExact() : row != null && row.get(field) instanceof Number n ? n.longValue() : 0; }
}
