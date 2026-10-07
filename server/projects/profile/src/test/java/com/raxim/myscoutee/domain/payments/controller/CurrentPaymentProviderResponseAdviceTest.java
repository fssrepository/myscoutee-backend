package com.raxim.myscoutee.domain.payments.controller;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import org.junit.jupiter.api.*;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpResponse;
import com.raxim.myscoutee.domain.events.controller.ActivitiesEventsController;
import com.raxim.myscoutee.domain.payments.service.CurrentPaymentProviderService;
@Tag("standard")
class CurrentPaymentProviderResponseAdviceTest {
 @Test void headerRemainsScopedToTheExistingControllersAndAvailability() {
  var provider=mock(CurrentPaymentProviderService.class);
  var advice=new CurrentPaymentProviderResponseAdvice(provider);
  for (Class<?> controller:List.of(ActivitiesEventsController.class,PaymentRestController.class)) {
   var parameter=mock(MethodParameter.class);doReturn(controller).when(parameter).getContainingClass();
   assertThat(advice.supports(parameter,null)).isTrue();
  }
  var other=mock(MethodParameter.class);doReturn(AdminPaymentSimulatorController.class).when(other).getContainingClass();
  assertThat(advice.supports(other,null)).isFalse();
  var response=mock(ServerHttpResponse.class);var headers=new HttpHeaders();when(response.getHeaders()).thenReturn(headers);
  var body=new Object();
  when(provider.snapshot()).thenReturn(CurrentPaymentProviderService.Snapshot.available("stripe"));
  assertThat(advice.beforeBodyWrite(body,null,null,null,null,response)).isSameAs(body);
  assertThat(headers.getFirst(CurrentPaymentProviderService.RESPONSE_HEADER)).isEqualTo("stripe");
  when(provider.snapshot()).thenReturn(CurrentPaymentProviderService.Snapshot.available(null));
  advice.beforeBodyWrite(body,null,null,null,null,response);
  assertThat(headers.getFirst(CurrentPaymentProviderService.RESPONSE_HEADER)).isEqualTo("none");
  headers.clear();when(provider.snapshot()).thenReturn(CurrentPaymentProviderService.Snapshot.unavailable());
  advice.beforeBodyWrite(body,null,null,null,null,response);
  assertThat(headers.isEmpty()).isTrue();
 }
}
