package com.raxim.myscoutee.common.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.raxim.myscoutee.domain.payments.api.PaymentProviderChangedException;

@RestControllerAdvice
public class PaymentProviderChangedExceptionHandler {
    @ExceptionHandler(PaymentProviderChangedException.class)
    public ResponseEntity<PaymentProviderChangedError> handle(
            PaymentProviderChangedException exception) {
        return ResponseEntity
                .status(exception.getStatusCode())
                .body(new PaymentProviderChangedError(
                        PaymentProviderChangedException.CODE,
                        exception.getReason(),
                        exception.getCurrentProvider()));
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record PaymentProviderChangedError(
            String code,
            String message,
            String currentProvider) {
    }
}
