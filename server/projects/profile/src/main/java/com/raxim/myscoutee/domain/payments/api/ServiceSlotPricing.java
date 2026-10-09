package com.raxim.myscoutee.domain.payments.api;
import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPricingSummaryRowDto;
public interface ServiceSlotPricing {
    Quote quoteServiceSlot(PricingConfigDto pricing, String templateId, String startAtIso, int occupied);
    interface Quote { double amount(); String currency(); List<EventCheckoutPricingSummaryRowDto> rows(); }
}
