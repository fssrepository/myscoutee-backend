package com.raxim.myscoutee.domain.payments.api;
import java.util.Collection;
import java.util.Map;
public interface CheckoutResults {
    Map<String, String> loadResultStatesByEvent(String userId, Collection<String> sourceIds);
}
