package com.raxim.myscoutee.domain.payments.dto;

import java.util.List;
public final class ExchangeRateDtos {
    private ExchangeRateDtos() {}
    public record Snapshot(String rate, String rateDate, String source, long amountMinor, long refundedMinor, String amount, String refunded) {}
    public record Summary(double outgoing, double incoming, double gross, double refunded, double net, long missingRates, String currency, List<String> currencies) {}
}
