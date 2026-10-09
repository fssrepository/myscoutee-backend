package com.raxim.myscoutee.domain.events.api;
public interface CheckoutMemberships { void expirePendingCheckoutMembership(String userId, String eventId, String nowIso); void finishPendingCancellations(); }
