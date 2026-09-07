package com.raxim.myscoutee.profile.controller.payment;

import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentHistoryPageDto;
import com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentHistoryMutationDto;
import com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentMethodRegistrationDto;
import com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentMethodRegistrationCallbackDto;
import com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.PaymentMethodRegistrationRequestDto;
import com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.SavedPaymentMethodsPageDto;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.SavedPaymentMethodsService;
import com.raxim.myscoutee.profile.service.PaymentSimulatorRegistrationClient;
import com.raxim.myscoutee.profile.service.PaymentRefundService;

@RestController
@RequestMapping("/payment-methods")
public class SavedPaymentMethodsController {
    private final SavedPaymentMethodsService service;
    private final HomeUserProfileService homeUserProfileService;
    private final PaymentSimulatorRegistrationClient simulatorClient;
    private final PaymentRefundService paymentRefundService;

    public SavedPaymentMethodsController(
            SavedPaymentMethodsService service,
            HomeUserProfileService homeUserProfileService,
            PaymentSimulatorRegistrationClient simulatorClient,
            PaymentRefundService paymentRefundService) {
        this.service = service;
        this.homeUserProfileService = homeUserProfileService;
        this.simulatorClient = simulatorClient;
        this.paymentRefundService = paymentRefundService;
    }

    @GetMapping
    public SavedPaymentMethodsPageDto queryPage(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size) {
        return service.queryPage(resolveCurrentUserId(userId), page, size);
    }

    @PostMapping("/registrations")
    public PaymentMethodRegistrationDto beginRegistration(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestBody PaymentMethodRegistrationRequestDto request) {
        return service.beginRegistration(resolveCurrentUserId(userId), request);
    }

    @GetMapping("/registrations/{registrationId}")
    public PaymentMethodRegistrationDto refreshRegistration(
            @PathVariable String registrationId,
            @RequestParam(value = "userId", required = false) String userId) {
        return service.refreshRegistration(resolveCurrentUserId(userId), registrationId);
    }

    @PostMapping("/registrations/callback")
    public void registrationCallback(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody PaymentMethodRegistrationCallbackDto callback) {
        if (!simulatorClient.authorizesCallback(authorization)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Payment simulator callback authorization is invalid.");
        }
        service.receiveSimulatorCallback(
                callback == null ? null : callback.registrationId(),
                callback == null ? null : callback.status());
    }

    @GetMapping("/{paymentMethodId}/history")
    public PaymentHistoryPageDto paymentMethodHistory(
            @PathVariable String paymentMethodId,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size) {
        return service.queryPaymentMethodHistory(resolveCurrentUserId(userId), paymentMethodId, page, size);
    }

    @DeleteMapping("/{paymentMethodId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable String paymentMethodId,
            @RequestParam(value = "userId", required = false) String userId) {
        service.delete(resolveCurrentUserId(userId), paymentMethodId);
    }

    @GetMapping("/history")
    public PaymentHistoryPageDto history(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "direction", required = false, defaultValue = "all") String direction,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size) {
        return service.queryHistory(resolveCurrentUserId(userId), direction, page, size);
    }

    @PostMapping("/history/{paymentId}/refund-request")
    public PaymentHistoryMutationDto requestRefund(
            @PathVariable String paymentId,
            @RequestParam(value = "userId", required = false) String userId) {
        return paymentRefundService.requestRefund(paymentId, resolveCurrentUserId(userId));
    }

    @PostMapping("/history/{paymentId}/refund-approve")
    public PaymentHistoryMutationDto approveRefund(
            @PathVariable String paymentId,
            @RequestParam(value = "userId", required = false) String userId) {
        return paymentRefundService.approveRefund(paymentId, resolveCurrentUserId(userId));
    }

    private String resolveCurrentUserId(String requestedUserId) {
        String resolved = homeUserProfileService.resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolved)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current user is required.");
        }
        return resolved;
    }
}
