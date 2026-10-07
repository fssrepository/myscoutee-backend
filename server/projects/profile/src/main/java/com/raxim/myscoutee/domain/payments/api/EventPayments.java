package com.raxim.myscoutee.domain.payments.api;

import java.util.*;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;

public interface EventPayments {
    String FULFILLMENT_KIND_CLIENT = "client";
    String FULFILLMENT_KIND_EVENT_JOIN = "event_join";
    EventCheckoutSessionDto payCheckout(EventCheckoutRequestDto request, String provider);
    EventCheckoutSessionDto payCheckout(
            EventCheckoutRequestDto request,
            String provider,
            String startedPaymentSessionId);
    void recordEventJoin(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            PricingCancellationPolicyDto cancellationPolicy);
    void recordEventJoin(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            String bookingEndAtIso,
            PricingCancellationPolicyDto cancellationPolicy);
    PaymentView completeEventCancellation(com.raxim.myscoutee.domain.payments.api.PaymentView snapshot, String reason);
    void cancelEventBooking(
            String userId,
            String sourceId,
            String fallbackBookingStartAtIso,
            PricingCancellationPolicyDto fallbackCancellationPolicy);
    boolean hasPendingEventJoin(String userId, String sourceId);
    boolean finalizePendingEventJoin(String userId, String sourceId);
    Set<String> findPendingEventJoinSourceIds(String userId, Collection<String> sourceIds);
    boolean hasJoinedEventJoin(String userId, String sourceId);
}
