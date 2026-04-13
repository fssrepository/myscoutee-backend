package com.raxim.myscoutee.profile.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final Map<String, PaymentProcessor> processors;
    private final PaymentsRepository paymentsRepository;

    @Value("${payment.enablePay:false}")
    private boolean enablePay;

    public PaymentService(List<PaymentProcessor> processorList, PaymentsRepository paymentsRepository) {
        this.processors = processorList.stream()
            .collect(Collectors.toMap(PaymentProcessor::getType, p -> p));
        this.paymentsRepository = paymentsRepository;
    }

    public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request, String provider) {
        if (!enablePay) {
            return createDummySession(request);
        }

        PaymentProcessor processor = processors.get(provider.toLowerCase());
        if (processor == null) {
            throw new IllegalArgumentException("Unsupported payment provider: " + provider);
        }

        EventCheckoutSessionDto sessionDto = processor.checkout(request);

        Payment payment = new Payment();
        payment.setUserId(request.userId());
        payment.setSourceId(request.sourceId());
        payment.setProvider(provider);
        payment.setStatus("pending");
        payment.setAmount(request.totalAmount());
        payment.setCurrency(request.currency());
        payment.setCreatedDate(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        paymentsRepository.save(payment);

        return sessionDto;
    }

    public EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId, String provider) {
        if (!enablePay) {
            return createDummySession(request);
        }

        PaymentProcessor processor = processors.get(provider.toLowerCase());
        if (processor == null) {
            throw new IllegalArgumentException("Unsupported payment provider: " + provider);
        }

        EventCheckoutSessionDto sessionDto = processor.pay(request, paymentSessionId);

        // Update payment with gateway session ID and new status
        // In a real scenario, we might want to look up the existing payment by user/source
        Payment payment = new Payment();
        payment.setUserId(request.userId());
        payment.setSourceId(request.sourceId());
        payment.setProvider(provider);
        payment.setStatus(sessionDto.status());
        payment.setAmount(sessionDto.amount());
        payment.setCurrency(sessionDto.currency());
        payment.setGatewaySessionId(sessionDto.id());
        payment.setCreatedDate(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        paymentsRepository.save(payment);

        return sessionDto;
    }

    private EventCheckoutSessionDto createDummySession(EventCheckoutRequestDto request) {
        return new EventCheckoutSessionDto(
            "dummy_" + System.currentTimeMillis(),
            "dummy",
            "dummy",
            "approved",
            request.totalAmount(),
            request.currency(),
            null
        );
    }
}
