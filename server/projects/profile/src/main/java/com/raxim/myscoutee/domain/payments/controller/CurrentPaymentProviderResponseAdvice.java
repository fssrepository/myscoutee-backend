package com.raxim.myscoutee.domain.payments.controller;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.raxim.myscoutee.domain.payments.api.PaymentProviderResponse;
import com.raxim.myscoutee.domain.payments.service.CurrentPaymentProviderService;
import com.raxim.myscoutee.domain.payments.service.CurrentPaymentProviderService.Snapshot;

@RestControllerAdvice(assignableTypes = PaymentProviderResponse.class)
public class CurrentPaymentProviderResponseAdvice implements ResponseBodyAdvice<Object> {
    private final CurrentPaymentProviderService currentPaymentProviderService;

    public CurrentPaymentProviderResponseAdvice(
            CurrentPaymentProviderService currentPaymentProviderService) {
        this.currentPaymentProviderService = currentPaymentProviderService;
    }

    @Override
    public boolean supports(
            MethodParameter returnType,
            Class<? extends HttpMessageConverter<?>> converterType) {
        Class<?> controllerType = returnType.getContainingClass();
        return PaymentProviderResponse.class.isAssignableFrom(controllerType);
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response) {
        Snapshot snapshot = currentPaymentProviderService.snapshot();
        if (snapshot.available()) {
            response.getHeaders().set(
                    CurrentPaymentProviderService.RESPONSE_HEADER,
                    snapshot.wireValue());
        }
        return body;
    }
}
