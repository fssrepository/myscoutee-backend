package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.accounts.api.ScoringProfiles;
import com.raxim.myscoutee.domain.affinity.api.EventAffinityScores;
import com.raxim.myscoutee.domain.affinity.dto.EventAffinityScoresDto;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import org.springframework.stereotype.Service;

/** Composition of the existing owner calculations; account facts are fetched once for both scores. */
@Service
public final class EventAffinityService implements EventAffinityScores {
    private final AbsoluteAffinityService scores;
    private final ScoringProfiles profiles;
    public EventAffinityService(AbsoluteAffinityService scores, ScoringProfiles profiles) {
        this.scores = scores; this.profiles = profiles;
    }
    @Override public EventAffinityScoresDto calculate(Event event, java.util.Collection<String> participantUserIds) {
        var participants = profiles.findByUserIdIn(participantUserIds);
        return new EventAffinityScoresDto(scores.resolveEventAffinity(event, participants), scores.resolveEventBoost(event, participants));
    }
}
