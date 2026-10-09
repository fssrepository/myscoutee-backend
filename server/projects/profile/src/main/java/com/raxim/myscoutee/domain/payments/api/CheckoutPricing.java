package com.raxim.myscoutee.domain.payments.api;

import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;

public interface CheckoutPricing {
    PricingConfigDto vipPricingOffer(String sourceId, String userId);
    EventCheckoutRequestDto reprice(EventCheckoutRequestDto request);
}
