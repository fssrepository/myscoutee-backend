package com.raxim.myscoutee.domain.integrations.api;

import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.AffiliateSummaryDto;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantSummaryDto;

/** Optional business summaries attached to the existing API settings response. */
public interface IntegrationAccountSummaries {
    AffiliateSummaryDto summary(String owner);
    IntegrationParticipantSummaryDto participantSummary(String owner);
}
