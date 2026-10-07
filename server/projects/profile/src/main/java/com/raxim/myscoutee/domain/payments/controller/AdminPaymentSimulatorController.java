package com.raxim.myscoutee.domain.payments.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.payments.service.PaymentSimulatorRegistrationClient;
import com.raxim.myscoutee.domain.payments.service.PaymentSimulatorRegistrationClient.GatewayConfigurationAccess;

@RestController
@RequestMapping("/admin/payment-simulator")
public class AdminPaymentSimulatorController {
    private final PaymentSimulatorRegistrationClient simulatorClient;
    private final com.raxim.myscoutee.domain.content.service.AdminModerationService moderation;
    private final org.springframework.data.mongodb.core.MongoTemplate mongo;
    private final com.raxim.myscoutee.domain.accounts.repository.UsersRepository users;

    public AdminPaymentSimulatorController(PaymentSimulatorRegistrationClient simulatorClient,
            com.raxim.myscoutee.domain.content.service.AdminModerationService moderation,
            org.springframework.data.mongodb.core.MongoTemplate mongo,
            com.raxim.myscoutee.domain.accounts.repository.UsersRepository users) {
        this.moderation = moderation; this.mongo = mongo; this.users = users;
        this.simulatorClient = simulatorClient;
    }

    @PostMapping("/configuration-access")
    @PreAuthorize("hasAuthority('A')")
    public GatewayConfigurationAccess createConfigurationAccess() {
        requireDemoAdmin();
        return simulatorClient.createConfigurationAccess();
    }

    @PostMapping("/authorization-access")
    @PreAuthorize("hasAuthority('A')")
    public GatewayConfigurationAccess createAuthorizationAccess() {
        String groupId = requireDemoAdmin();
        var query = org.springframework.data.mongodb.core.query.Query.query(org.springframework.data.mongodb.core.query.Criteria.where("workspaceGroupId").is(groupId));
        query.fields().include("userId");
        var ids = mongo.find(query, com.raxim.myscoutee.domain.accounts.document.Users.class).stream()
                .map(com.raxim.myscoutee.domain.accounts.document.Users::getUserId).toList();
        var paymentQuery = org.springframework.data.mongodb.core.query.Query.query(org.springframework.data.mongodb.core.query.Criteria.where("userId").in(ids));
        paymentQuery.fields().include("checkoutSessionId");
        var references = mongo.find(paymentQuery, com.raxim.myscoutee.domain.payments.document.Payment.class).stream()
                .map(com.raxim.myscoutee.domain.payments.document.Payment::getCheckoutSessionId)
                .filter(org.springframework.util.StringUtils::hasText).map(id -> "myscoutee:" + id).distinct().toList();
        return simulatorClient.createAuthorizationAccess(new PaymentSimulatorRegistrationClient.AuthorizationScope(
                groupId == null ? "dating" : groupId, ids, references));
    }

    private String requireDemoAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication != null
                && authentication.getPrincipal() instanceof FirebasePrincipal principal
                ? principal.getUserId()
                : "";
        var profile = users.findByUserId(userId == null ? "" : userId).orElse(null);
        String accountId = profile != null && profile.getAccountUserId() != null ? profile.getAccountUserId() : userId;
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO
                || userId == null
                || accountId == null || !accountId.trim().startsWith("admin-demo-")) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Payment simulator administration is available only to demo admins.");
        }
        return moderation.baseGroupId(userId);
    }
}
