package com.raxim.myscoutee.domain.affinity.api;

/** Calculate both existing event scores from one account-owned participant snapshot. */
public interface EventAffinityScores {
    com.raxim.myscoutee.domain.affinity.dto.EventAffinityScoresDto calculate(
            com.raxim.myscoutee.domain.events.api.EventOwnership.Event event,
            java.util.Collection<String> participantUserIds);
}
