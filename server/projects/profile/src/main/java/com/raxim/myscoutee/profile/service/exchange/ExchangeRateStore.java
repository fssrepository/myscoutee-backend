package com.raxim.myscoutee.profile.service.exchange;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import com.mongodb.client.model.UpdateOptions;

/** Durable daily observations; the process cache is only an acceleration layer. */
@Service
public class ExchangeRateStore {
    private final MongoTemplate mongo;
    public ExchangeRateStore(MongoTemplate mongo) { this.mongo = mongo; }

    @Cacheable(value = "exchange_rates", key = "T(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext).currentMode().name()")
    public List<Document> observations() {
        return mongo.getCollection("exchangeRates").find().sort(new Document("_id", -1)).limit(400)
                .into(new java.util.ArrayList<>());
    }

    @CacheEvict(value = "exchange_rates", key = "T(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext).currentMode().name()")
    public void save(List<Document> observations) {
        var writes = observations.stream().map(row -> new com.mongodb.client.model.UpdateOneModel<Document>(
                new Document("_id", row.getString("_id")), new Document("$setOnInsert", row), new UpdateOptions().upsert(true))).toList();
        if (!writes.isEmpty()) mongo.getCollection("exchangeRates").bulkWrite(writes);
    }

    public static Quote quote(List<Document> rows, LocalDate paymentDate, String currency) {

        for (Document row : rows) {
            LocalDate date = LocalDate.parse(row.getString("_id"));
            if (date.isAfter(paymentDate) || date.isBefore(paymentDate.minusDays(7))) continue;
            if ("EUR".equals(currency)) return new Quote(date.toString(), row.getString("source"), BigDecimal.ONE);
            Document rates = row.get("rates", Document.class);
            String rate = rates == null ? null : rates.getString(currency);
            if (rate != null) return new Quote(date.toString(), row.getString("source"),
                    BigDecimal.ONE.divide(new BigDecimal(rate), 16, java.math.RoundingMode.HALF_UP));
        }
        return "EUR".equals(currency) ? new Quote(paymentDate.toString(), "EUR", BigDecimal.ONE) : null;
    }
    public record Quote(String date, String source, BigDecimal eurPerUnit) {}
}
