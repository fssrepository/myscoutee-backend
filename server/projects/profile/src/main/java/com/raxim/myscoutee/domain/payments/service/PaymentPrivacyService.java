package com.raxim.myscoutee.domain.payments.service;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.util.StringUtils;
@Service
public class PaymentPrivacyService implements com.raxim.myscoutee.domain.payments.api.PaymentPrivacy {
 private final MongoTemplate mongo;
 public PaymentPrivacyService(MongoTemplate mongo) { this.mongo = mongo; }
 @Override public void purgePayerRecords(String userId) {
  if (!StringUtils.hasText(userId)) return;
  mongo.remove(Query.query(new Criteria().orOperator(Criteria.where("userId").is(userId))), "payments");
 }
}
