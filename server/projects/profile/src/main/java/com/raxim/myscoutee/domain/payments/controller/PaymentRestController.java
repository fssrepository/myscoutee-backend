package com.raxim.myscoutee.domain.payments.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutBasketDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPaymentAuditDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPromoCodeValidationRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPromoCodeValidationResultDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.domain.events.service.ActivitiesEventsService;
import com.raxim.myscoutee.domain.payments.service.EventCheckoutBasketService;
import com.raxim.myscoutee.domain.payments.service.EventCheckoutPricingService;
import com.raxim.myscoutee.domain.payments.service.PaymentService;

@RestController
@RequestMapping("/activities/events")
public class PaymentRestController {

    private final PaymentService paymentService;
    private final EventCheckoutBasketService basketService;
    private final EventCheckoutPricingService pricingService;
    private final ActivitiesEventsService activitiesEventsService;

    public PaymentRestController(
            PaymentService paymentService,
            EventCheckoutBasketService basketService,
            EventCheckoutPricingService pricingService,
            ActivitiesEventsService activitiesEventsService) {
        this.paymentService = paymentService;
        this.basketService = basketService;
        this.pricingService = pricingService;
        this.activitiesEventsService = activitiesEventsService;
    }

    @GetMapping("/checkout/basket")
    public EventCheckoutBasketDto basket(
            @RequestParam("userId") String userId,
            @RequestParam("sourceId") String sourceId) {
        return basketService.loadBasketByEvent(userId, sourceId);
    }

    @GetMapping("/checkout/payment-audit")
    public EventCheckoutPaymentAuditDto paymentAudit(
            @RequestParam("userId") String userId,
            @RequestParam("sourceId") String sourceId,
            @RequestParam("paymentSessionId") String paymentSessionId) {
        return paymentService.loadPaymentAudit(userId, sourceId, paymentSessionId);
    }

    @PostMapping("/checkout/basket")
    public EventCheckoutBasketDto saveBasket(@RequestBody EventCheckoutRequestDto request) {
        return basketService.saveBasket(request);
    }

    @PostMapping("/checkout/state")
    public EventCheckoutBasketDto updateBasketState(@RequestBody EventCheckoutStateChangeRequestDto request) {
        return basketService.updateBasketState(request);
    }

    @PostMapping("/checkout/promo-code/validate")
    public EventCheckoutPromoCodeValidationResultDto validatePromoCode(
            @RequestBody EventCheckoutPromoCodeValidationRequestDto request) {
        return pricingService.validatePromoCode(request);
    }

    @PostMapping("/checkout")
    public EventCheckoutSessionDto checkout(
            @RequestBody EventCheckoutRequestDto request,
            @RequestParam(value = "provider", required = false) String provider) {
        return paymentService.checkout(request, provider);
    }

    @PostMapping("/pay")
    public EventCheckoutSessionDto pay(
            @RequestBody EventCheckoutRequestDto request,
            @RequestParam("paymentSessionId") String paymentSessionId,
            @RequestParam(value = "provider", required = false) String provider) {
        return paymentService.pay(request, paymentSessionId, provider);
    }

    @PostMapping("/checkout/pay")
    public EventParticipationActionResultDto payCheckout(
            @RequestBody EventCheckoutStateChangeRequestDto request,
            @RequestParam(value = "provider", required = false) String provider) {
        return activitiesEventsService.payEventCheckout(request, provider);
    }

    @PostMapping("/checkout/authorize")
    public EventCheckoutSessionDto authorizeCheckout(
            @RequestBody EventCheckoutRequestDto request,
            @RequestParam(value = "provider", required = false) String provider) {
        return paymentService.authorizeClientCheckout(request, provider);
    }
}
