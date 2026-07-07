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
import com.raxim.myscoutee.profile.service.EventCheckoutBasketService;
import com.raxim.myscoutee.profile.service.PaymentService;

@RestController
@RequestMapping("/activities/events")
public class PaymentRestController {

    private final PaymentService paymentService;
    private final EventCheckoutBasketService basketService;

    public PaymentRestController(PaymentService paymentService, EventCheckoutBasketService basketService) {
        this.paymentService = paymentService;
        this.basketService = basketService;
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
}
