package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.campaigns.service.CampaignRatingProjectionService;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.domain.affinity.document.AffinityConfig;
import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.affinity.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class UserAffinityEdgeServiceTest {
    @Mock
    private UserAffinityEdgesRepository userAffinityEdgesRepository;
    @Mock
    private UserRatesRepository userRatesRepository;
    @Mock
    private AffinityConfigsRepository affinityConfigsRepository;

    @Test
    void recomputeCombinesMultipleEvidenceRecordsIntoOnePairEdge() {
        UserRate mutual = singleRate("mutual", "u1", "u2", 0.6d, true);
        UserRate insidePair = pairRate("inside", "owner-1", "u1", "u2", 0.8d, "separated-friends");
        UserRate outsidePair = pairRate("outside", "owner-2", "u1", "u2", 0.9d, null);
        UserAffinityEdgeService service = service(List.of(mutual, insidePair, outsidePair));

        service.recomputeForRates(List.of(mutual));

        UserAffinityEdge edge = capturedEdge();
        assertThat(edge.getLeftUserId()).isEqualTo("u1");
        assertThat(edge.getRightUserId()).isEqualTo("u2");
        assertThat(edge.getAffinityScore()).isCloseTo(0.715d, offset());
        assertThat(edge.getEdgeWeight()).isCloseTo(0.7245d, offset());
        assertThat(edge.getEvidence().getMutualSingleCount()).isEqualTo(1);
        assertThat(edge.getEvidence().getPairInsideNetworkCount()).isEqualTo(1);
        assertThat(edge.getEvidence().getPairOutsideNetworkCount()).isEqualTo(1);
    }

    @Test
    void outsideNetworkPairOnlyProducesWeakEdgeWeight() {
        UserRate outsidePair = pairRate("outside", "owner", "u1", "u2", 0.8d, null);
        UserAffinityEdgeService service = service(List.of(outsidePair));

        service.recomputeForRates(List.of(outsidePair));

        UserAffinityEdge edge = capturedEdge();
        assertThat(edge.getAffinityScore()).isCloseTo(0.8d, offset());
        assertThat(edge.getEdgeWeight()).isCloseTo(0.24d, offset());
        assertThat(edge.getEvidence().getPairOutsideNetworkCount()).isEqualTo(1);
    }

    @Test
    void evidenceConfidenceScalesEdgeWeightButNotRawAffinity() {
        UserRate outsidePair = pairRate("outside", "owner", "u1", "u2", 0.8d, null);
        outsidePair.setEvidenceConfidence(0.25d);
        UserAffinityEdgeService service = service(List.of(outsidePair));

        service.recomputeForRates(List.of(outsidePair));

        UserAffinityEdge edge = capturedEdge();
        assertThat(edge.getAffinityScore()).isCloseTo(0.8d, offset());
        assertThat(edge.getEdgeWeight()).isCloseTo(0.06d, offset());
        assertThat(edge.getEvidence().getTotalMultiplier()).isCloseTo(0.075d, offset());
    }

    @Test
    void missingEvidenceConfidenceRemainsNeutralForLegacyRates() {
        UserRate outsidePair = pairRate("outside", "owner", "u1", "u2", 0.8d, null);
        UserAffinityEdgeService service = service(List.of(outsidePair));

        service.recomputeForRates(List.of(outsidePair));

        assertThat(capturedEdge().getEdgeWeight()).isCloseTo(0.24d, offset());
    }

    @Test
    void unsupportedOneSidedEvidenceDeletesExistingSummaryEdge() {
        UserRate oneSided = singleRate("single", "u1", "u2", 0.8d, false);
        UserAffinityEdgeService service = service(List.of(oneSided));

        service.recomputeForRates(List.of(oneSided));

        verify(userAffinityEdgesRepository).deleteByPairKey("u1:u2");
        verify(userAffinityEdgesRepository, never()).save(any(UserAffinityEdge.class));
    }

    private UserAffinityEdgeService service(List<UserRate> relevantRates) {
        when(affinityConfigsRepository.findFirstByKeyAndActiveTrueOrderByVersionDesc("default"))
                .thenReturn(Optional.of(AffinityConfig.defaults()));
        when(userRatesRepository.findEvidenceForPair("u1", "u2")).thenReturn(relevantRates);
        lenient().when(userAffinityEdgesRepository.findByPairKey("u1:u2")).thenReturn(Optional.empty());
        var groupScope = org.mockito.Mockito.mock(JobGroupScopeService.class);
        when(groupScope.usersByGroup(any())).thenAnswer(a -> {
            java.util.Map<String, List<String>> result = new java.util.HashMap<>();
            result.put(null, List.copyOf(a.<java.util.Collection<String>>getArgument(0))); return result;
        });
        return new UserAffinityEdgeService(
                userAffinityEdgesRepository,
                userRatesRepository,
                affinityConfigsRepository, groupScope, org.mockito.Mockito.mock(CampaignRatingProjectionService.class));
    }

    private UserAffinityEdge capturedEdge() {
        ArgumentCaptor<UserAffinityEdge> edgeCaptor = ArgumentCaptor.forClass(UserAffinityEdge.class);
        verify(userAffinityEdgesRepository).save(edgeCaptor.capture());
        return edgeCaptor.getValue();
    }

    private UserRate singleRate(String id, String ownerUserId, String relatedUserId, double affinityScore, boolean mutuallyRated) {
        UserRate rate = new UserRate();
        rate.setId(id);
        rate.setSyncKey(id);
        rate.setMode("single");
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setAffinityScore(affinityScore);
        rate.setMutuallyRated(mutuallyRated);
        return rate;
    }

    private UserRate pairRate(
            String id,
            String ownerUserId,
            String relatedUserId,
            String secondaryRelatedUserId,
            double affinityScore,
            String socialContext) {
        UserRate rate = new UserRate();
        rate.setId(id);
        rate.setSyncKey(id);
        rate.setMode("pair");
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setSecondaryRelatedUserId(secondaryRelatedUserId);
        rate.setAffinityScore(affinityScore);
        rate.setSocialContext(socialContext);
        return rate;
    }

    private org.assertj.core.data.Offset<Double> offset() {
        return org.assertj.core.data.Offset.offset(0.000001d);
    }
}
