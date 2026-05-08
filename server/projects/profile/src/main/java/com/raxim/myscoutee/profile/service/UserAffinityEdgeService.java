package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;

@Service
public class UserAffinityEdgeService {
    private static final String MODE_PAIR = "pair";
    private static final String MODE_SINGLE = "single";
    private static final String SOCIAL_SEPARATED_FRIENDS = "separated-friends";

    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final UserRatesRepository userRatesRepository;
    private final AffinityConfigsRepository affinityConfigsRepository;

    public UserAffinityEdgeService(
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            UserRatesRepository userRatesRepository,
            AffinityConfigsRepository affinityConfigsRepository) {
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.userRatesRepository = userRatesRepository;
        this.affinityConfigsRepository = affinityConfigsRepository;
    }

    public void recomputeForRates(List<UserRate> rates) {
        Map<String, PairKey> affectedPairs = new LinkedHashMap<>();
        if (rates != null) {
            for (UserRate rate : rates) {
                PairKey pair = resolveEvidencePair(rate);
                if (pair != null) {
                    affectedPairs.put(pair.pairKey(), pair);
                }
            }
        }
        if (affectedPairs.isEmpty()) {
            return;
        }

        AffinityConfig config = activeConfig();
        for (PairKey pair : affectedPairs.values()) {
            recompute(pair, config);
        }
    }

    public void recompute(String firstUserId, String secondUserId) {
        PairKey pair = PairKey.of(firstUserId, secondUserId);
        if (pair == null) {
            return;
        }
        recompute(pair, activeConfig());
    }

    private void recompute(PairKey pair, AffinityConfig config) {
        List<UserRate> pairRates = userRatesRepository.findEvidenceForPair(pair.leftUserId(), pair.rightUserId()).stream()
                .filter(rate -> pair.equals(resolveEvidencePair(rate)))
                .sorted(Comparator.comparing(rate -> normalize(rate.getUpdatedDate())))
                .toList();

        EdgeAccumulator accumulator = new EdgeAccumulator(config);
        for (UserRate rate : pairRates) {
            accumulator.add(rate);
        }

        if (!accumulator.hasEvidence()) {
            userAffinityEdgesRepository.deleteByPairKey(pair.pairKey());
            return;
        }

        UserAffinityEdge edge = userAffinityEdgesRepository.findByPairKey(pair.pairKey()).orElseGet(UserAffinityEdge::new);
        if (!StringUtils.hasText(edge.getId())) {
            edge.setId(new ObjectId().toHexString());
        }
        edge.setPairKey(pair.pairKey());
        edge.setLeftUserId(pair.leftUserId());
        edge.setRightUserId(pair.rightUserId());
        edge.setAffinityScore(accumulator.affinityScore());
        edge.setEdgeWeight(accumulator.edgeWeight());
        edge.setEvidence(accumulator.summary());
        edge.setUpdatedDate(java.time.Instant.now().toString());
        userAffinityEdgesRepository.save(edge);
    }

    private PairKey resolveEvidencePair(UserRate rate) {
        if (rate == null) {
            return null;
        }
        String mode = normalize(rate.getMode());
        if (MODE_PAIR.equals(mode)) {
            return PairKey.of(rate.getRelatedUserId(), rate.getSecondaryRelatedUserId());
        }
        if (MODE_SINGLE.equals(mode)) {
            return PairKey.of(rate.getOwnerUserId(), rate.getRelatedUserId());
        }
        return null;
    }

    private AffinityConfig activeConfig() {
        return affinityConfigsRepository.findFirstByActiveTrueOrderByVersionDesc()
                .orElseGet(AffinityConfig::defaults);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private double clamp01(Double value) {
        if (value == null || !Double.isFinite(value)) {
            return 0d;
        }
        return Math.max(0d, Math.min(1d, value));
    }

    private double multiplier(AffinityConfig.MultiplierRule rule, double fallback) {
        Double value = rule == null ? null : rule.getMultiplier();
        return value != null && Double.isFinite(value) ? Math.max(0d, value) : fallback;
    }

    private enum EvidenceType {
        MUTUAL_SINGLE,
        SINGLE_ONE_SIDED,
        PAIR_OUTSIDE_NETWORK,
        PAIR_INSIDE_NETWORK,
        MET
    }

    private record PairKey(String leftUserId, String rightUserId) {
        private static PairKey of(String firstUserId, String secondUserId) {
            String first = normalizeId(firstUserId);
            String second = normalizeId(secondUserId);
            if (!StringUtils.hasText(first) || !StringUtils.hasText(second) || first.equals(second)) {
                return null;
            }
            return first.compareTo(second) <= 0
                    ? new PairKey(first, second)
                    : new PairKey(second, first);
        }

        private String pairKey() {
            return leftUserId + ":" + rightUserId;
        }

        private static String normalizeId(String value) {
            return value == null ? "" : value.trim();
        }
    }

    private class EdgeAccumulator {
        private final AffinityConfig config;
        private final List<Evidence> evidence = new ArrayList<>();
        private int mutualSingleCount;
        private int singleOneSidedCount;
        private int pairOutsideNetworkCount;
        private int pairInsideNetworkCount;
        private int metCount;

        private EdgeAccumulator(AffinityConfig config) {
            this.config = config;
        }

        private void add(UserRate rate) {
            if (rate == null) {
                return;
            }
            double affinity = clamp01(rate.getAffinityScore());
            if (affinity <= 0d) {
                return;
            }
            double confidence = evidenceConfidence(rate);
            String mode = normalize(rate.getMode()).toLowerCase();
            if (MODE_PAIR.equals(mode)) {
                boolean insideNetwork = SOCIAL_SEPARATED_FRIENDS.equals(normalize(rate.getSocialContext()));
                addEvidence(insideNetwork ? EvidenceType.PAIR_INSIDE_NETWORK : EvidenceType.PAIR_OUTSIDE_NETWORK, affinity, confidence);
            } else if (MODE_SINGLE.equals(mode)) {
                addEvidence(Boolean.TRUE.equals(rate.getMutuallyRated())
                        ? EvidenceType.MUTUAL_SINGLE
                        : EvidenceType.SINGLE_ONE_SIDED, affinity, confidence);
            }
            if (Boolean.TRUE.equals(rate.getMet())) {
                addEvidence(EvidenceType.MET, affinity, confidence);
            }
        }

        private void addEvidence(EvidenceType type, double affinity, double confidence) {
            double multiplier = evidenceMultiplier(type) * confidence;
            if (multiplier <= 0d) {
                return;
            }
            evidence.add(new Evidence(type, clamp01(affinity), multiplier));
            switch (type) {
                case MUTUAL_SINGLE -> mutualSingleCount += 1;
                case SINGLE_ONE_SIDED -> singleOneSidedCount += 1;
                case PAIR_OUTSIDE_NETWORK -> pairOutsideNetworkCount += 1;
                case PAIR_INSIDE_NETWORK -> pairInsideNetworkCount += 1;
                case MET -> metCount += 1;
            }
        }

        private boolean hasEvidence() {
            return !evidence.isEmpty();
        }

        private double affinityScore() {
            double total = 0d;
            double totalMultiplier = 0d;
            for (Evidence item : evidence) {
                total += item.affinity() * item.multiplier();
                totalMultiplier += item.multiplier();
            }
            return totalMultiplier <= 0d ? 0d : total / totalMultiplier;
        }

        private double edgeWeight() {
            Evidence strongest = evidence.stream()
                    .max(Comparator.comparing(item -> item.affinity() * Math.min(1d, item.multiplier())))
                    .orElse(null);
            if (strongest == null) {
                return 0d;
            }
            double base = strongest.affinity() * Math.min(1d, strongest.multiplier());
            double supportBoost = 0d;
            for (Evidence item : evidence) {
                if (item == strongest) {
                    continue;
                }
                supportBoost += item.affinity() * item.multiplier() * 0.15d;
            }
            return Math.min(1d, base + supportBoost);
        }

        private UserAffinityEdge.EvidenceSummary summary() {
            UserAffinityEdge.EvidenceSummary summary = new UserAffinityEdge.EvidenceSummary();
            summary.setMutualSingleCount(mutualSingleCount);
            summary.setSingleOneSidedCount(singleOneSidedCount);
            summary.setPairOutsideNetworkCount(pairOutsideNetworkCount);
            summary.setPairInsideNetworkCount(pairInsideNetworkCount);
            summary.setMetCount(metCount);
            summary.setStrongestAffinityScore(evidence.stream()
                    .map(Evidence::affinity)
                    .max(Double::compareTo)
                    .orElse(0d));
            summary.setTotalMultiplier(evidence.stream()
                    .mapToDouble(Evidence::multiplier)
                    .sum());
            return summary;
        }

        private double evidenceMultiplier(EvidenceType type) {
            AffinityConfig.EvidenceMultipliers multipliers = config.getEvidence();
            return switch (type) {
                case MUTUAL_SINGLE -> multiplier(multipliers.getMutualSingle(), 1d);
                case SINGLE_ONE_SIDED -> multiplier(multipliers.getSingleOneSided(), 0d);
                case PAIR_OUTSIDE_NETWORK -> multiplier(multipliers.getPairOutsideNetwork(), 0.3d);
                case PAIR_INSIDE_NETWORK -> multiplier(multipliers.getPairInsideNetwork(), 0.7d);
                case MET -> multiplier(multipliers.getMet(), 0.5d);
            };
        }

        private double evidenceConfidence(UserRate rate) {
            Double confidence = rate == null ? null : rate.getEvidenceConfidence();
            return confidence == null || !Double.isFinite(confidence)
                    ? 1d
                    : Math.max(0d, Math.min(1d, confidence));
        }
    }

    private record Evidence(EvidenceType type, double affinity, double multiplier) {
    }
}
