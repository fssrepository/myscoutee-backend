package com.raxim.myscoutee.domain.payments.api;

import com.raxim.myscoutee.domain.payments.dto.AffiliateRegistration;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.*;

public interface Affiliates {
    String link(String owner);
    AffiliateSummaryDto summary(String owner);
    IntegrationParticipantSummaryDto participantSummary(String owner);
    AffiliateRegistration resolveRegistration(String code, String userId);
    void recordRegistration(AffiliateRegistration registration);
}
