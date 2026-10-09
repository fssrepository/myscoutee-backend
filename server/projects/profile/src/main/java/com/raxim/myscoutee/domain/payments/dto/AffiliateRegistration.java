package com.raxim.myscoutee.domain.payments.dto;

import org.springframework.data.annotation.Id;

/** One immutable attribution per newly registered profile; not a payment entitlement. */
public record AffiliateRegistration(@Id String userId, String referrerUserId,
        String code, String registeredAtIso) { }
