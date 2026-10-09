package com.raxim.myscoutee.domain.payments.api;


public interface PaymentSimulatorConfiguration {
    public record GatewayConfiguration(
            String provider,
            boolean requires3ds,
            boolean connected,
            String credential) {}

    boolean isEnabled();
    GatewayConfiguration configuration();
}
