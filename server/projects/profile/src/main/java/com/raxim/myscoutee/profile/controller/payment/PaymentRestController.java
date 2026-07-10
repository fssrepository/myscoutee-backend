package com.raxim.myscoutee.profile.controller.payment;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.profile.service.ActivitiesEventsService;
import com.raxim.myscoutee.profile.service.EventCheckoutBasketService;
import com.raxim.myscoutee.profile.service.PaymentService;

@RestController
@RequestMapping("/activities/events")
public class PaymentRestController {

    private final PaymentService paymentService;
    private final EventCheckoutBasketService basketService;
    private final ActivitiesEventsService activitiesEventsService;

    public PaymentRestController(
            PaymentService paymentService,
            EventCheckoutBasketService basketService,
            ActivitiesEventsService activitiesEventsService) {
        this.paymentService = paymentService;
        this.basketService = basketService;
        this.activitiesEventsService = activitiesEventsService;
    }

    @GetMapping("/checkout/basket")
    public EventCheckoutBasketDto basket(
            @RequestParam("userId") String userId,
            @RequestParam("sourceId") String sourceId) {
        return basketService.loadBasketByEvent(userId, sourceId);
    }

    @PostMapping("/checkout/basket")
    public EventCheckoutBasketDto saveBasket(@RequestBody EventCheckoutRequestDto request) {
        return basketService.saveBasket(request);
    }

    @PostMapping("/checkout/state")
    public EventCheckoutBasketDto updateBasketState(@RequestBody EventCheckoutStateChangeRequestDto request) {
        return basketService.updateBasketState(request);
    }

    @PostMapping("/checkout")
    public EventCheckoutSessionDto checkout(
            @RequestBody EventCheckoutRequestDto request,
            @RequestParam(value = "provider", defaultValue = "stripe") String provider) {
        return paymentService.checkout(request, provider);
    }

    @PostMapping("/pay")
    public EventCheckoutSessionDto pay(
            @RequestBody EventCheckoutRequestDto request,
            @RequestParam("paymentSessionId") String paymentSessionId,
            @RequestParam(value = "provider", defaultValue = "stripe") String provider) {
        return paymentService.pay(request, paymentSessionId, provider);
    }

    @PostMapping("/checkout/pay")
    public EventParticipationActionResultDto payCheckout(
            @RequestBody EventCheckoutStateChangeRequestDto request,
            @RequestParam(value = "provider", defaultValue = "stripe") String provider) {
        return activitiesEventsService.payEventCheckout(request, provider);
    }
}
