package com.raxim.myscoutee.domain.affinity.service;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Collections;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.affinity.api.CampaignRatings;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;

@Service
public class CampaignRatingEvidenceService implements CampaignRatings {
    private final UserRatesRepository rates;
    public CampaignRatingEvidenceService(UserRatesRepository rates) { this.rates = rates; }
    @Override public List<Evidence> relevant(String viewerId, String campaignId) { return snapshot(rates.findRelevantInCampaign(viewerId, campaignId)); }
    @Override public List<Evidence> pair(String actorId, String targetId) { return snapshot(rates.findEvidenceForPair(actorId, targetId)); }
    @Override public List<Evidence> byViewer(String viewerId) { return snapshot(rates.findByOwnerUserId(viewerId)); }
    private List<Evidence> snapshot(List<UserRate> rows) {
        return rows.stream().map(r -> new Evidence(r.getMode(), r.getOwnerUserId(), r.getCampaignId(), r.getScoreGiven(),
                r.getCreatedDate(), r.getUpdatedDate(), snapshots(r.getRatingSnapshots()))).toList();
    }
    private Map<String, RatingSnapshot> snapshots(Map<String, UserRate.RatingSnapshot> values) {
        if (values == null) return null;
        Map<String, RatingSnapshot> result = new LinkedHashMap<>();
        values.forEach((id, value) -> result.put(id, value == null ? null : new RatingSnapshot(value.version(), value.profileType(),
                value.criteria() == null ? null : Collections.unmodifiableMap(new LinkedHashMap<>(value.criteria())), value.average())));
        return Collections.unmodifiableMap(result);
    }
}
