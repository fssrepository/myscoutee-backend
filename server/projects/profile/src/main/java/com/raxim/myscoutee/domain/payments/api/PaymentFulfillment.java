package com.raxim.myscoutee.domain.payments.api;

import java.util.List;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;

/** Captured checkout facts needed by event fulfillment; excludes gateway credentials and refund state. */
public interface PaymentFulfillment {
    String getUserId();
    String getSourceId();
    String getSlotSourceId();
    String getCheckoutSessionId();
    List<String> getOptionalSubEventIds();
    List<String> getAcceptedPolicyIds();
    List<EventCheckoutBasketItemDto> getBasketItems();
    List<EventCheckoutPricingSummaryRowDto> getPricingSummaryRows();
    List<EventCheckoutLineItemDto> getLineItems();
    Double getAmount();
    String getCurrency();
    List<String> getAppliedPromoCodes();
}
