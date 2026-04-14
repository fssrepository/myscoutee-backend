package com.raxim.myscoutee.profile.service;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;

public interface PaymentProcessor {
    String getType();
    EventCheckoutSessionDto checkout(EventCheckoutRequestDto request);
    EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId);
}
