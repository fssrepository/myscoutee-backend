package com.raxim.myscoutee.domain.payments.api;

import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions;
import java.util.Map;
import java.util.function.Consumer;

public interface PaymentPrivacy extends AccountPurgeActions {
    void purgePayerRecords(String userId);
    @Override
    default Map<Action, Consumer<Context>> accountPurgeActions() {
        return Map.ofEntries(
                Map.entry(Action.PAYER_RECORDS, context -> purgePayerRecords(context.userId())));
    }
}
