package com.raxim.myscoutee.domain.payments.dto;

import java.util.List;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;
import com.raxim.myscoutee.domain.payments.api.PaymentFulfillment;

/** Exact event-fulfillment input, without reconstructing a foreign payment document. */
public record PaymentFulfillmentDto(String userId, String sourceId, String slotSourceId, String checkoutSessionId,
        List<String> optionalSubEventIds, List<String> acceptedPolicyIds, List<EventCheckoutBasketItemDto> basketItems,
        List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows, List<EventCheckoutLineItemDto> lineItems,
        Double amount, String currency, List<String> appliedPromoCodes) implements PaymentFulfillment {
    public static PaymentFulfillmentDto from(PaymentFulfillment value) {
        return value == null ? null : new PaymentFulfillmentDto(value.getUserId(), value.getSourceId(), value.getSlotSourceId(),
                value.getCheckoutSessionId(), value.getOptionalSubEventIds(), value.getAcceptedPolicyIds(), value.getBasketItems(),
                value.getPricingSummaryRows(), value.getLineItems(), value.getAmount(), value.getCurrency(), value.getAppliedPromoCodes());
    }
    @Override public String getUserId() { return userId; }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getSlotSourceId() { return slotSourceId; }
    @Override public String getCheckoutSessionId() { return checkoutSessionId; }
    @Override public List<String> getOptionalSubEventIds() { return optionalSubEventIds; }
    @Override public List<String> getAcceptedPolicyIds() { return acceptedPolicyIds; }
    @Override public List<EventCheckoutBasketItemDto> getBasketItems() { return basketItems; }
    @Override public List<EventCheckoutPricingSummaryRowDto> getPricingSummaryRows() { return pricingSummaryRows; }
    @Override public List<EventCheckoutLineItemDto> getLineItems() { return lineItems; }
    @Override public Double getAmount() { return amount; }
    @Override public String getCurrency() { return currency; }
    @Override public List<String> getAppliedPromoCodes() { return appliedPromoCodes; }
}
