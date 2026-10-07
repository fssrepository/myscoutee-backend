package com.raxim.myscoutee.domain.payments.service;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Stream;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.common.mongo.OwnerScopedQuery;
@Tag("standard")
class PaymentOwnerCursorTest {
 @Test void closesCursorWhenLimitReached() {
  var mongo=mock(MongoTemplate.class);var closed=new AtomicBoolean();
  when(mongo.stream(any(Query.class),eq(String.class))).thenReturn(Stream.of("a","b").onClose(()->closed.set(true)));
  assertThat(OwnerScopedQuery.find(mongo,new Query().limit(1),String.class,x->x,ids->ids)).containsExactly("a");
  assertThat(closed).isTrue();
 }
 @Test void closesCursorWhenOwnerLookupFails() {
  var mongo=mock(MongoTemplate.class);var closed=new AtomicBoolean();
  when(mongo.stream(any(Query.class),eq(String.class))).thenReturn(Stream.of("a").onClose(()->closed.set(true)));
  assertThatThrownBy(()->OwnerScopedQuery.find(mongo,new Query(),String.class,x->x,ids->{throw new IllegalStateException("owner failure");})).hasMessage("owner failure");
  assertThat(closed).isTrue();
 }
}
