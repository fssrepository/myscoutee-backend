package com.raxim.myscoutee.domain.integrations.api;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantSummaryDto;
public interface ParticipantStatistics { IntegrationParticipantSummaryDto participantSummary(String owner); }
