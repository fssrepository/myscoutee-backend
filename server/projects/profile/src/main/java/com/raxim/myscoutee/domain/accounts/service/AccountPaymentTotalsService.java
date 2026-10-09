package com.raxim.myscoutee.domain.accounts.service;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.accounts.api.PaymentTotals;
import com.raxim.myscoutee.domain.accounts.document.Users;
@Service
public class AccountPaymentTotalsService implements PaymentTotals {
    private final MongoTemplate mongo;
    public AccountPaymentTotalsService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public void increment(String userId, Direction direction, String currency, double amount) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(userId)), new Update().inc(field(direction) + "." + currency, amount), Users.class);
    }
    @Override public void reverseReceipt(String userId, String receiptId, Direction direction, String currency, double amount) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(userId).and("cashReceiptReversals").ne(receiptId)),
                new Update().inc(field(direction) + "." + currency, -amount).inc("paymentAllTotals." + currency, -amount)
                        .addToSet("cashReceiptReversals", receiptId), Users.class);
    }
    @Override public void incrementPendingRefunds(String userId) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(userId)), new Update().inc("paymentRefundsPending", 1), Users.class);
    }
    @Override public void decrementPendingRefunds(String userId) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(userId).and("paymentRefundsPending").gt(0)),
                new Update().inc("paymentRefundsPending", -1), Users.class);
    }
    @Override public String summaryCurrency(String userId) {
        Document user = mongo.getCollection("users").find(new Document("userId", userId)).projection(new Document("summaryCurrency", 1)).first();
        return user == null ? null : user.getString("summaryCurrency");
    }
    @Override public void selectSummaryCurrency(String userId, String currency) {
        mongo.getCollection("users").updateOne(new Document("userId", userId), new Document("$set", new Document("summaryCurrency", currency)));
    }
    private String field(Direction direction) {
        return switch (direction) { case SPENT -> "paymentSpentTotals"; case INCOME -> "paymentIncomeTotals"; case ALL -> "paymentAllTotals"; };
    }
}
