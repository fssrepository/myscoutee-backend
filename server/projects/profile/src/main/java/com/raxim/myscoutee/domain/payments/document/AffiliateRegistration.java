package com.raxim.myscoutee.domain.payments.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** One immutable attribution per newly registered profile; not a payment entitlement. */
@Document(collection = "affiliateRegistrations")
public record AffiliateRegistration(@Id String userId, String referrerUserId,
        String code, String registeredAtIso) { }
