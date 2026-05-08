package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
class AffinityCalculationServiceTest {
    @Mock
    private AffinityConfigsRepository affinityConfigsRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserRatesRepository userRatesRepository;

    @Test
    void mutualRatingUsesHarmonicAverageSoImbalancedScoresAreLower() {
        AffinityConfig config = ratingOnlyConfig();
        UserRate balanced = singleRate("balanced", "u1", "u2", 5);
        UserRate balancedReciprocal = singleRate("balanced-reciprocal", "u2", "u1", 5);
        UserRate imbalanced = singleRate("imbalanced", "u3", "u4", 9);
        UserRate imbalancedReciprocal = singleRate("imbalanced-reciprocal", "u4", "u3", 1);

        AffinityCalculationService service = service(config, List.of(
                balancedReciprocal,
                imbalancedReciprocal), Map.of());

        service.applyAffinity(List.of(balanced, imbalanced));

        assertThat(balanced.getMutuallyRated()).isTrue();
        assertThat(imbalanced.getMutuallyRated()).isTrue();
        assertThat(balanced.getAffinityScore()).isCloseTo(0.5d, withinOffset());
        assertThat(imbalanced.getAffinityScore()).isCloseTo(0.18d, withinOffset());
        assertThat(imbalanced.getAffinityScore()).isLessThan(balanced.getAffinityScore());
    }

    @Test
    void missingProfileFieldIsSkippedFromDenominator() {
        AffinityConfig config = profileConfig(List.of(
                new AffinityConfig.FieldRule("languages", 2d, "intersection"),
                new AffinityConfig.FieldRule("physique", 3d, "exact")));
        UserRate rate = singleRate("rate", "u1", "u2", 0);
        Users left = user("u1", List.of("hu", "en"), null);
        Users right = user("u2", List.of("en"), "athletic");

        AffinityCalculationService service = service(config, List.of(), Map.of(
                "u1", left,
                "u2", right));

        service.applyAffinity(List.of(rate));

        assertThat(rate.getMutuallyRated()).isFalse();
        assertThat(rate.getAffinityScore()).isCloseTo(0.5d, withinOffset());
    }

    @Test
    void zeroMultiplierDisablesSignalInsteadOfUsingFallback() {
        AffinityConfig config = profileConfig(List.of(
                new AffinityConfig.FieldRule("languages", 1d, "intersection")));
        config.getRating().setSingleOneSided(new AffinityConfig.MultiplierRule(0d));
        UserRate rate = singleRate("rate", "u1", "u2", 10);

        AffinityCalculationService service = service(config, List.of(), Map.of(
                "u1", user("u1", List.of("music"), null),
                "u2", user("u2", List.of("chess"), null)));

        service.applyAffinity(List.of(rate));

        assertThat(rate.getAffinityScore()).isZero();
    }

    @Test
    void outsideNetworkPairSuggestionIsWeakerThanEquivalentRealMutualRating() {
        AffinityConfig config = profileConfig(List.of(
                new AffinityConfig.FieldRule("languages", 8d, "intersection")));
        config.getRating().setSingleMutual(new AffinityConfig.MultiplierRule(10d));
        config.getRating().setPairOutsideNetwork(new AffinityConfig.MultiplierRule(2d));

        Users first = user("u1", List.of("skiing"), null);
        Users second = user("u2", List.of("books"), null);
        UserRate mutual = singleRate("mutual", "u1", "u2", 8);
        UserRate reciprocal = singleRate("reciprocal", "u2", "u1", 8);
        UserRate outsidePair = pairRate("outside", "owner", "u1", "u2", 8, null);

        AffinityCalculationService service = service(config, List.of(reciprocal), Map.of(
                "owner", user("owner", List.of("travel"), null),
                "u1", first,
                "u2", second));

        service.applyAffinity(List.of(mutual, outsidePair));

        assertThat(mutual.getMutuallyRated()).isTrue();
        assertThat(outsidePair.getMutuallyRated()).isFalse();
        assertThat(outsidePair.getAffinityScore()).isLessThan(mutual.getAffinityScore());
    }

    @Test
    void insideNetworkPairAffinityIsLowerWhenOwnerContextIsWeak() {
        AffinityConfig config = profileConfig(List.of(
                new AffinityConfig.FieldRule("languages", 8d, "intersection")));
        config.getRating().setPairInsideNetwork(new AffinityConfig.MultiplierRule(5d));
        config.setOwnerContext(new AffinityConfig.MultiplierRule(3d));

        Users first = user("u1", List.of("music"), null);
        Users second = user("u2", List.of("music"), null);
        UserRate strongOwnerPair = pairRate("strong-owner", "strong-owner", "u1", "u2", 8, "separated-friends");
        UserRate weakOwnerPair = pairRate("weak-owner", "weak-owner", "u1", "u2", 8, "separated-friends");

        AffinityCalculationService service = service(config, List.of(), Map.of(
                "strong-owner", user("strong-owner", List.of("music"), null),
                "weak-owner", user("weak-owner", List.of("chess"), null),
                "u1", first,
                "u2", second));

        service.applyAffinity(List.of(strongOwnerPair, weakOwnerPair));

        assertThat(weakOwnerPair.getAffinityScore()).isLessThan(strongOwnerPair.getAffinityScore());
    }

    @Test
    void insideNetworkOwnerContextUsesExistingOwnerRelationshipEvidence() {
        AffinityConfig config = profileConfig(List.of(
                new AffinityConfig.FieldRule("languages", 8d, "intersection")));
        config.getRating().setPairInsideNetwork(new AffinityConfig.MultiplierRule(5d));
        config.setOwnerContext(new AffinityConfig.MultiplierRule(3d));

        Users first = user("u1", List.of("music"), null);
        Users second = user("u2", List.of("music"), null);
        UserRate connectedOwnerFirst = mutualSingleRate("connected-owner-u1", "connected-owner", "u1", 9, 9, 0.9d);
        UserRate connectedOwnerSecond = mutualSingleRate("connected-owner-u2", "connected-owner", "u2", 9, 9, 0.9d);
        UserRate connectedOwnerPair = pairRate("connected-owner-pair", "connected-owner", "u1", "u2", 8, "separated-friends");
        UserRate weakOwnerPair = pairRate("weak-owner-pair", "weak-owner", "u1", "u2", 8, "separated-friends");

        AffinityCalculationService service = service(config, List.of(connectedOwnerFirst, connectedOwnerSecond), Map.of(
                "connected-owner", user("connected-owner", List.of("chess"), null),
                "weak-owner", user("weak-owner", List.of("chess"), null),
                "u1", first,
                "u2", second));

        service.applyAffinity(List.of(connectedOwnerPair, weakOwnerPair));

        assertThat(connectedOwnerPair.getAffinityScore()).isGreaterThan(weakOwnerPair.getAffinityScore());
    }

    @Test
    void evidenceConfidenceUsesImpressionEvidenceAndNoShowPenaltyWithoutChangingAffinity() {
        AffinityConfig config = ratingOnlyConfig();
        UserRate strongEvidence = singleRate("strong-evidence", "strong-owner", "u1", 8);
        UserRate weakEvidence = singleRate("weak-evidence", "weak-owner", "u1", 8);
        Users strongOwner = userWithImpressionConfidence("strong-owner", 4.8d, 20, 20, 10, 0, 20);
        Users weakOwner = userWithImpressionConfidence("weak-owner", 4.8d, 20, 20, 10, 4, 20);
        Users related = userWithImpressionConfidence("u1", 4.8d, 20, 20, 10, 0, 20);

        AffinityCalculationService service = service(config, List.of(), Map.of(
                "strong-owner", strongOwner,
                "weak-owner", weakOwner,
                "u1", related));

        service.applyAffinity(List.of(strongEvidence, weakEvidence));

        assertThat(strongEvidence.getAffinityScore()).isEqualTo(weakEvidence.getAffinityScore());
        assertThat(strongEvidence.getEvidenceConfidence()).isGreaterThan(weakEvidence.getEvidenceConfidence());
        assertThat(weakEvidence.getEvidenceConfidence()).isLessThan(0.7d);
    }

    @Test
    void missingImpressionConfidenceIsNeutralForExistingRateBehavior() {
        AffinityConfig config = ratingOnlyConfig();
        UserRate rate = singleRate("rate", "u1", "u2", 8);
        AffinityCalculationService service = service(config, List.of(), Map.of(
                "u1", user("u1", List.of("music"), null),
                "u2", user("u2", List.of("music"), null)));

        service.applyAffinity(List.of(rate));

        assertThat(rate.getEvidenceConfidence()).isEqualTo(1d);
    }

    private AffinityCalculationService service(
            AffinityConfig config,
            List<UserRate> existingRates,
            Map<String, Users> usersById) {
        when(affinityConfigsRepository.findFirstByActiveTrueOrderByVersionDesc()).thenReturn(Optional.of(config));
        when(userRatesRepository.findRelevantByUserIds(anyList())).thenReturn(existingRates);
        when(usersRepository.findByUserIdIn(anyCollection())).thenAnswer(invocation -> {
            Collection<String> requestedIds = invocation.getArgument(0);
            return requestedIds.stream()
                    .map(usersById::get)
                    .filter(java.util.Objects::nonNull)
                    .toList();
        });
        return new AffinityCalculationService(affinityConfigsRepository, usersRepository, userRatesRepository);
    }

    private AffinityConfig ratingOnlyConfig() {
        AffinityConfig config = AffinityConfig.defaults();
        config.setProfileRules(List.of());
        config.setImpressionRules(List.of());
        return config;
    }

    private AffinityConfig profileConfig(List<AffinityConfig.FieldRule> rules) {
        AffinityConfig config = ratingOnlyConfig();
        config.setProfileRules(rules);
        return config;
    }

    private UserRate singleRate(String id, String ownerUserId, String relatedUserId, int scoreGiven) {
        UserRate rate = new UserRate();
        rate.setId(id);
        rate.setSyncKey(id);
        rate.setMode("single");
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setScoreGiven(scoreGiven);
        rate.setUpdatedDate("2026-05-08T00:00:00Z");
        return rate;
    }

    private UserRate mutualSingleRate(
            String id,
            String ownerUserId,
            String relatedUserId,
            int scoreGiven,
            int scoreReceived,
            double affinityScore) {
        UserRate rate = singleRate(id, ownerUserId, relatedUserId, scoreGiven);
        rate.setScoreReceived(scoreReceived);
        rate.setAffinityScore(affinityScore);
        rate.setMutuallyRated(true);
        return rate;
    }

    private UserRate pairRate(
            String id,
            String ownerUserId,
            String relatedUserId,
            String secondaryRelatedUserId,
            int scoreGiven,
            String socialContext) {
        UserRate rate = new UserRate();
        rate.setId(id);
        rate.setSyncKey(id);
        rate.setMode("pair");
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setSecondaryRelatedUserId(secondaryRelatedUserId);
        rate.setScoreGiven(scoreGiven);
        rate.setSocialContext(socialContext);
        rate.setUpdatedDate("2026-05-08T00:00:00Z");
        return rate;
    }

    private Users user(String userId, List<String> languages, String physique) {
        Users user = new Users();
        user.setId(userId);
        user.setLanguages(languages);
        user.setPhysique(physique);
        return user;
    }

    private Users userWithImpressionConfidence(
            String userId,
            double averageRating,
            int peopleMet,
            int totalEvents,
            int repeatCount,
            int noShowCount,
            int traitEvidenceCount) {
        Users user = user(userId, List.of("music"), null);
        Users.UserPersonalityTraitRecord trait = new Users.UserPersonalityTraitRecord(
                "warm",
                "Warm",
                80,
                traitEvidenceCount,
                "2026-05-08T00:00:00Z");
        Users.UserImpressionsSectionRecord section = new Users.UserImpressionsSectionRecord(
                0,
                averageRating,
                peopleMet,
                totalEvents,
                repeatCount,
                noShowCount,
                List.of("friendly"),
                List.of("warm"),
                List.of(trait),
                List.of("music"));
        user.setImpressions(new Users.UserImpressionsRecord(section, section));
        return user;
    }

    private org.assertj.core.data.Offset<Double> withinOffset() {
        return org.assertj.core.data.Offset.offset(0.000001d);
    }
}
