package com.raxim.myscoutee.domain.payments.api;

public interface Affiliates extends com.raxim.myscoutee.domain.integrations.api.IntegrationAccountSummaries {
    String link(String owner);
}
