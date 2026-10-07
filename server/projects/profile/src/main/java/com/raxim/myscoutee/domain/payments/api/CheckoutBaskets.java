package com.raxim.myscoutee.domain.payments.api;

import java.util.*;
import java.time.Instant;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;

public interface CheckoutBaskets {
    public record CheckoutCardStates(Map<String, String> resultStates, Map<String, String> pendingReasons) {}
    EventCheckoutBasketDto loadBasketByEvent(String userId, String sourceId);
    CheckoutCardStates loadCardStatesByEvent(String userId, Collection<String> sourceIds);
    Map<String, Integer> activeSlotReservationCountsByEvent(String sourceId);
    Map<String, Integer> activeOptionalReservationCountsByEvent(String sourceId);
    EventCheckoutBasketDto saveBasket(EventCheckoutRequestDto request);
    EventCheckoutBasketDto updateBasketState(EventCheckoutStateChangeRequestDto request);
    void retireCancelledEventReservations(String sourceId, Collection<String> participantIds);
    void finalizeAcceptedReservation(String userId, String sourceId);
    boolean wasCheckoutExpired(String userId, String sourceId, String requestAtIso);
    int purgeExpiredDraftBasketsScheduled(Instant now);
}
