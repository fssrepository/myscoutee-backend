package com.raxim.myscoutee.domain.payments.api;

import com.raxim.myscoutee.domain.payments.dto.AffiliateRegistration;

/** Accounts resolves attribution before saving a profile, then records its immutable attribution. */
public interface AffiliateRegistrations {
    AffiliateRegistration resolveRegistration(String code, String userId);
    void recordRegistration(AffiliateRegistration registration);
}
