package com.raxim.myscoutee.domain.payments.api;

import java.time.Instant;

public interface ExchangeRateRefresh {
    String KEY = "payment-exchange-rates";
    void run(String actor, Instant startedAt);
}
