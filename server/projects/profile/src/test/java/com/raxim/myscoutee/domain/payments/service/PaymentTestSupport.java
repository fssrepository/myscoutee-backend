package com.raxim.myscoutee.domain.payments.service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;
import com.raxim.myscoutee.domain.accounts.service.*;
public final class PaymentTestSupport {
 private PaymentTestSupport() {}
 public static <T> T wire(T service, MongoTemplate mongo) {
  var profiles = new ProfileDirectoryService(null);
  ReflectionTestUtils.setField(profiles,"mongo",mongo);
  ReflectionTestUtils.setField(service,"profiles",profiles);
  ReflectionTestUtils.setField(service,"accountPaymentTotals",new AccountPaymentTotalsService(mongo));
  return service;
 }
}
