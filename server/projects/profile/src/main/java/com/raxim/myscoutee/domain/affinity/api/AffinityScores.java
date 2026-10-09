package com.raxim.myscoutee.domain.affinity.api;
import java.util.Collection;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.accounts.api.ScoringProfile;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
public interface AffinityScores extends UserAffinityScores, AssetAffinityScores {
    double resolveUserAffinity(UserDto user);
    double resolveUserAffinity(ScoringProfile user);
    double resolveEventAffinity(Event event, Collection<? extends ScoringProfile> participants);
    double resolveEventBoost(Event event, Collection<? extends ScoringProfile> participants);
}
