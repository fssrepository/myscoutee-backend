package com.raxim.myscoutee.domain.campaigns.dto;

/** Existing campaign availability and persisted rating facts for organizer conversations. */
public record CampaignOrganizerContactDto(CampaignSummaryDto campaign, boolean positivelyRated) {}
