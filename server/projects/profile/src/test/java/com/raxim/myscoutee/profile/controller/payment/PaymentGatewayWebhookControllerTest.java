package com.raxim.myscoutee.profile.controller.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.service.BarionPaymentProcessor;
import com.raxim.myscoutee.profile.service.PaymentAuthorizationCoordinator;
import com.raxim.myscoutee.profile.service.StripePaymentProcessor;

class PaymentGatewayWebhookControllerTest {
    @AfterEach
    void clearSessionMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void selectsSimulatorSecretOnlyForDemoSession() {
        PaymentGatewayWebhookController controller = controller();

        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        assertThat(controller.resolveStripeWebhookSecret())
                .isEqualTo("whsec_demo");

        MongoSessionModeContext.set(MongoSessionMode.REAL);
        assertThat(controller.resolveStripeWebhookSecret())
                .isEqualTo("whsec_live");
    }

    private PaymentGatewayWebhookController controller() {
        return new PaymentGatewayWebhookController(
                mock(StripePaymentProcessor.class),
                mock(BarionPaymentProcessor.class),
                mock(PaymentAuthorizationCoordinator.class),
                "whsec_live",
                "whsec_demo");
    }
}
