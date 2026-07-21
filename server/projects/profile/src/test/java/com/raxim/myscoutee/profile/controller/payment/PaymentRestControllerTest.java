package com.raxim.myscoutee.profile.controller.payment;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPromoCodeValidationRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPromoCodeValidationResultDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingActionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingPromoCodeDto;
import com.raxim.myscoutee.profile.service.ActivitiesEventsService;
import com.raxim.myscoutee.profile.service.EventCheckoutBasketService;
import com.raxim.myscoutee.profile.service.EventCheckoutPricingService;
import com.raxim.myscoutee.profile.service.PaymentService;

class PaymentRestControllerTest {
    private EventCheckoutPricingService pricingService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        pricingService = mock(EventCheckoutPricingService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new PaymentRestController(
                mock(PaymentService.class),
                mock(EventCheckoutBasketService.class),
                pricingService,
                mock(ActivitiesEventsService.class)))
                .build();
    }

    @Test
    void promoCodeValidationEndpointReturnsCanonicalVerificationResult() throws Exception {
        when(pricingService.validatePromoCode(any(EventCheckoutPromoCodeValidationRequestDto.class)))
                .thenReturn(new EventCheckoutPromoCodeValidationResultDto(
                        true,
                        "VIP20",
                        new PricingPromoCodeDto(
                                "vip-twenty",
                                "VIP20",
                                new PricingActionDto("decrease_percent", 20d)),
                        "-20.0%",
                        null));

        mockMvc.perform(post("/activities/events/checkout/promo-code/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "sourceId": "event-1",
                                  "code": " vip20 "
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.code").value("VIP20"))
                .andExpect(jsonPath("$.promoCode.id").value("vip-twenty"))
                .andExpect(jsonPath("$.promoCode.action.kind").value("decrease_percent"))
                .andExpect(jsonPath("$.promoCode.action.value").value(20d))
                .andExpect(jsonPath("$.effect").value("-20.0%"));

        verify(pricingService).validatePromoCode(
                new EventCheckoutPromoCodeValidationRequestDto("event-1", " vip20 "));
    }

    @Test
    void promoCodeValidationEndpointExposesLocalizedMessageAndStableBundleKey() throws Exception {
        when(pricingService.validatePromoCode(any(EventCheckoutPromoCodeValidationRequestDto.class)))
                .thenReturn(new EventCheckoutPromoCodeValidationResultDto(
                        false,
                        "MISSING",
                        null,
                        null,
                        "Ez a promóciós kód nem érvényes ehhez az eseményhez.",
                        "event.checkout.promo.invalid"));

        mockMvc.perform(post("/activities/events/checkout/promo-code/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "sourceId": "event-1",
                                  "code": "missing"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false))
                .andExpect(jsonPath("$.code").value("MISSING"))
                .andExpect(jsonPath("$.message")
                        .value("Ez a promóciós kód nem érvényes ehhez az eseményhez."))
                .andExpect(jsonPath("$.messageKey").value("event.checkout.promo.invalid"));
    }
}
