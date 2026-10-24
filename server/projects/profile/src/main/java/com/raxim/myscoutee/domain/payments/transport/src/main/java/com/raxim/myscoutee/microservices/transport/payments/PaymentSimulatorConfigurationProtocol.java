package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields.JobScope;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.payments.api.PaymentSimulatorConfiguration;

public final class PaymentSimulatorConfigurationProtocol {
    public static final String ENABLED = "/_internal/v1/payments/payment-simulator-configuration/enabled";
    public static final String CONFIGURATION = "/_internal/v1/payments/payment-simulator-configuration/configuration";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private PaymentSimulatorConfigurationProtocol() {}
    public static String[] paths() { return new String[]{ENABLED, CONFIGURATION}; }
    private static boolean scope(JobScope value) { return ProtocolFields.boundedJobScope(value); }
    public record Query(JobScope scope) {}
    public record Decision(Boolean value) {}
    public static boolean valid(Query q) { return q != null && scope(q.scope()); }
    public record Result(Boolean resolved, com.raxim.myscoutee.domain.payments.api.PaymentSimulatorConfiguration.GatewayConfiguration value) {}
}
