package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.platform.service.JobGroupContext;
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

    @Cacheable(value = "exchange_rates", key = "T(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext).currentMode().name() + ':' + T(com.raxim.myscoutee.domain.platform.service.JobGroupContext).key()")
    public List<Document> observations() {
        return mongo.getCollection("exchangeRates").find(new Document("baseGroupId", JobGroupContext.groupId())).sort(new Document("_id", -1)).limit(400)
                .map(row -> { if (row.getString("date") != null) row.put("_id", row.getString("date")); return row; })
                .into(new java.util.ArrayList<>());
    }

    @CacheEvict(value = "exchange_rates", key = "T(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext).currentMode().name() + ':' + T(com.raxim.myscoutee.domain.platform.service.JobGroupContext).key()")
    public void save(List<Document> observations) {
        var writes = observations.stream().map(row -> {
            String date = row.getString("_id");
            String id = JobGroupContext.groupId() == null ? date : JobGroupContext.key() + ":" + date;
            Document scoped = new Document(row).append("_id", id).append("date", date).append("baseGroupId", JobGroupContext.groupId());
            return new com.mongodb.client.model.UpdateOneModel<Document>(new Document("_id", id),
                    new Document("$setOnInsert", scoped), new UpdateOptions().upsert(true));
        }).toList();
        if (!writes.isEmpty()) mongo.getCollection("exchangeRates").bulkWrite(writes);
    }

    public static Quote quote(List<Document> rows, LocalDate paymentDate, String currency) {
        Document defaults = null;
        for (Document row : rows) {
            if (Boolean.TRUE.equals(row.getBoolean("default"))) {
                defaults = row;
                continue;
            }
            LocalDate date = LocalDate.parse(row.getString("_id"));
            if (date.isAfter(paymentDate) || date.isBefore(paymentDate.minusDays(7))) continue;
            if ("EUR".equals(currency)) return new Quote(date.toString(), row.getString("source"), BigDecimal.ONE);
            Document rates = row.get("rates", Document.class);
            String rate = rates == null ? null : rates.getString(currency);
            if (rate != null) return new Quote(date.toString(), row.getString("source"),
                    BigDecimal.ONE.divide(new BigDecimal(rate), 16, java.math.RoundingMode.HALF_UP));
        }
        if (defaults != null) {
            Document rates = defaults.get("rates", Document.class);
            String rate = rates == null ? null : rates.getString(currency);
            if (rate != null) return new Quote(defaults.getString("_id"), defaults.getString("source"),
                    BigDecimal.ONE.divide(new BigDecimal(rate), 16, java.math.RoundingMode.HALF_UP));
        }
        return "EUR".equals(currency) ? new Quote(paymentDate.toString(), "EUR", BigDecimal.ONE) : null;
    }
    public record Quote(String date, String source, BigDecimal eurPerUnit) {}
}
