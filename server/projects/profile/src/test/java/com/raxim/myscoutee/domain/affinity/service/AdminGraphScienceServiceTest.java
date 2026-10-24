package com.raxim.myscoutee.domain.affinity.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.domain.events.document.ActivityMember;

import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class AdminGraphScienceServiceTest {
    @Mock
    private UserAffinityEdgesRepository userAffinityEdgesRepository;
    @Mock
    private UserRatesRepository userRatesRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private UsersRepository usersRepository;

    @Test
    void refreshMaterializesGraphScienceSnapshot() {
        when(usersRepository.findAll()).thenReturn(List.of(
                user("u1", "Ava Baker"),
                user("u2", "Lina Stone"),
                user("u3", "Luca Hale"),
                user("u4", "Mason Grant")));
        when(userAffinityEdgesRepository.findAll()).thenReturn(List.of(
                affinityEdge("u1", "u2", 0.9d, "2026-05-08T10:00:00Z", 2, 0, 0, 0),
                affinityEdge("u2", "u3", 0.62d, "2026-05-09T10:00:00Z", 1, 1, 0, 0),
                affinityEdge("u3", "u4", 0.28d, "2026-05-10T10:00:00Z", 0, 0, 1, 0)));
        when(userRatesRepository.findAll()).thenReturn(List.of(
                rate("u1", "u3", null, "inside-network", true, false, "2026-05-10T12:00:00Z"),
                rate("u2", "u4", "u3", "outside-network", false, false, "2026-05-11T12:00:00Z")));
        when(activityMembersRepository.findAll()).thenReturn(List.of(
                member("event-1", "u1", "accepted", "2026-05-11T09:00:00Z"),
                member("event-1", "u4", "accepted", "2026-05-11T09:05:00Z")));

        var snapshot = new AdminGraphScienceService(
                userAffinityEdgesRepository,
                userRatesRepository,
                new com.raxim.myscoutee.domain.events.service.MemberDirectoryService(activityMembersRepository, null),
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository, null))
                .refresh(null, Map.of());

        assertThat(snapshot.healthScore()).isBetween(20, 100);
        assertThat(snapshot.healthLabelKey()).startsWith("stats.graph.health.");
        assertThat(snapshot.insightKey()).startsWith("stats.graph.insight.");
        assertThat(snapshot.metrics())
                .containsEntry("users", 4L)
                .containsKey("edges")
                .containsKey("weak-tie-ratio")
                .containsKey("recurring-edge-ratio");
        assertThat(snapshot.signals())
                .containsKeys("reachability-2-hop", "clustering", "bridge-coverage");
        assertThat(snapshot.dailyGraphActivity()).hasSize(14);
    }

    @Test
    void refreshPreservesHistoricalGraphTimelineAndReplacesToday() {
        when(usersRepository.findAll()).thenReturn(List.of());
        when(userAffinityEdgesRepository.findAll()).thenReturn(List.of());
        when(userRatesRepository.findAll()).thenReturn(List.of());
        when(activityMembersRepository.findAll()).thenReturn(List.of());

        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        String yesterdayKey = today.minusDays(1).toString();
        String todayKey = today.toString();
        Map<String, Long> historical = Map.of(
                "activeEdges", 17L,
                "bridgeUsers", 2L,
                "communities", 2L,
                "clusterQuality", 7L);
        Map<String, Map<String, Long>> existing = new LinkedHashMap<>();
        existing.put(yesterdayKey, historical);
        existing.put(todayKey, Map.of(
                "activeEdges", 99L,
                "bridgeUsers", 9L,
                "communities", 9L,
                "clusterQuality", 99L));

        var snapshot = new AdminGraphScienceService(
                userAffinityEdgesRepository,
                userRatesRepository,
                new com.raxim.myscoutee.domain.events.service.MemberDirectoryService(activityMembersRepository, null),
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository, null))
                .refresh(null, existing);

        assertThat(snapshot.dailyGraphActivity()).hasSize(14);
        assertThat(snapshot.dailyGraphActivity().get(yesterdayKey))
                .containsExactlyInAnyOrderEntriesOf(historical);
        assertThat(snapshot.dailyGraphActivity().get(todayKey))
                .containsEntry("activeEdges", 0L)
                .containsEntry("bridgeUsers", 0L)
                .containsEntry("communities", 0L)
                .containsEntry("clusterQuality", 0L);
    }

    private Users user(String id, String name) {
        Users user = new Users();
        user.setId(id);
        user.setName(name);
        return user;
    }

    private UserAffinityEdge affinityEdge(
            String left,
            String right,
            double weight,
            String updatedAtIso,
            int mutual,
            int inside,
            int outside,
            int met) {
        UserAffinityEdge edge = new UserAffinityEdge();
        edge.setLeftUserId(left);
        edge.setRightUserId(right);
        edge.setEdgeWeight(weight);
        edge.setUpdatedDate(updatedAtIso);
        UserAffinityEdge.EvidenceSummary evidence = new UserAffinityEdge.EvidenceSummary();
        evidence.setMutualSingleCount(mutual);
        evidence.setPairInsideNetworkCount(inside);
        evidence.setPairOutsideNetworkCount(outside);
        evidence.setMetCount(met);
        edge.setEvidence(evidence);
        return edge;
    }

    private UserRate rate(
            String owner,
            String related,
            String secondary,
            String context,
            boolean mutual,
            boolean met,
            String updatedAtIso) {
        UserRate rate = new UserRate();
        rate.setOwnerUserId(owner);
        rate.setRelatedUserId(related);
        rate.setSecondaryRelatedUserId(secondary);
        rate.setSocialContext(context);
        rate.setMutuallyRated(mutual);
        rate.setMet(met);
        rate.setAffinityScore(mutual ? 0.8d : 0.35d);
        rate.setUpdatedDate(updatedAtIso);
        return rate;
    }

    private ActivityMember member(String eventId, String userId, String status, String actionAtIso) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId(eventId);
        member.setUserId(userId);
        member.setStatus(status);
        member.setActionAtIso(actionAtIso);
        return member;
    }
}
