package com.raxim.myscoutee.domain.payments.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Public opaque referral code; the owner identity is never taken from a browser claim. */
@Document(collection = "affiliateLinks")
public record AffiliateLink(@Id String ownerUserId, String code, String createdAtIso) { }
