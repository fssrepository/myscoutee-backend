package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.affinity.service.CampaignRatingProjectionService;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.affinity.document.AffinityConfig;
import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.affinity.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;

@Service
public class UserAffinityEdgeService {
    private static final String MODE_PAIR = "pair";
    private static final String MODE_SINGLE = "single";
    private static final String SOCIAL_SEPARATED_FRIENDS = "separated-friends";

    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final UserRatesRepository userRatesRepository;
    private final AffinityConfigsRepository affinityConfigsRepository;
    private final JobGroupScopeService groupScope;
    private final CampaignRatingProjectionService campaignRatings;

    public UserAffinityEdgeService(
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            UserRatesRepository userRatesRepository,
            AffinityConfigsRepository affinityConfigsRepository, JobGroupScopeService groupScope,
            CampaignRatingProjectionService campaignRatings) {
        this.campaignRatings = campaignRatings;
        this.groupScope = groupScope;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.userRatesRepository = userRatesRepository;
        this.affinityConfigsRepository = affinityConfigsRepository;
    }

    /** Reuses the canonical evidence calculation for a bounded campaign context. */
    public List<UserAffinityEdge> projectEdges(List<UserRate> rates) {
        var configs = configsForUsers(rates.stream().filter(java.util.Objects::nonNull).map(UserRate::getOwnerUserId).toList());
        return projectEdges(rates, configs);
    }

    private List<UserAffinityEdge> projectEdges(List<UserRate> rates, Map<String, AffinityConfig> configs) {
        Map<PairKey, EdgeAccumulator> pairs = new LinkedHashMap<>();
        for (UserRate rate : rates) {
            PairKey pair = resolveEvidencePair(rate);
            if (pair != null) pairs.computeIfAbsent(pair, ignored -> new EdgeAccumulator(configs.getOrDefault(rate.getOwnerUserId(), AffinityConfig.defaults()))).add(rate);
        }
        List<UserAffinityEdge> edges = new ArrayList<>();
        pairs.forEach((pair, accumulator) -> {
            if (!accumulator.hasEvidence()) return;
            UserAffinityEdge edge = new UserAffinityEdge();
            edge.setPairKey(pair.pairKey());
            edge.setLeftUserId(pair.leftUserId());
            edge.setRightUserId(pair.rightUserId());
            edge.setAffinityScore(accumulator.affinityScore());
            edge.setEdgeWeight(accumulator.edgeWeight());
            edge.setEvidence(accumulator.summary());
            edges.add(edge);
        });
        return edges;
    }

    public Map<String, List<UserAffinityEdge>> projectCampaignEdges(List<UserRate> rates) {
        var configs = configsForUsers(rates.stream().map(UserRate::getOwnerUserId).toList());
        Map<String, List<UserRate>> contexts = rates.stream().collect(java.util.stream.Collectors.groupingBy(UserRate::getCampaignId));
        Map<String, List<UserAffinityEdge>> result = new LinkedHashMap<>();
        contexts.forEach((id, rows) -> result.put(id, projectEdges(rows, configs)));
        return result;
    }

    public synchronized void recomputeForRates(List<UserRate> rates) {
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

        var configs = configsForUsers(affectedPairs.values().stream().map(PairKey::leftUserId).toList());
        Map<String, List<UserRate>> evidence = new LinkedHashMap<>();
        for (PairKey pair : affectedPairs.values()) evidence.put(pair.pairKey(),
                userRatesRepository.findEvidenceForPair(pair.leftUserId(), pair.rightUserId()).stream()
                    .filter(rate -> pair.equals(resolveEvidencePair(rate)))
                    .sorted(Comparator.comparing(rate -> normalize(rate.getUpdatedDate()))).toList());
        Map<String, UserRate> summaries = campaignRatings.write(evidence);
        for (PairKey pair : affectedPairs.values()) {
            List<UserRate> rows = new ArrayList<>(evidence.get(pair.pairKey()));
            UserRate summary = summaries.get(pair.pairKey());
            if (summary != null) {
                rows.removeIf(rate -> MODE_SINGLE.equals(rate.getMode()));
                rows.add(summary);
            }
            recompute(pair, configs.getOrDefault(pair.leftUserId(), AffinityConfig.defaults()), rows);
        }
    }

    public List<com.raxim.myscoutee.domain.affinity.document.CampaignRatingSummary> ratingSummaries(String userId) {
        return campaignRatings.forUser(userId);
    }

    public void backfillCampaignRatings() { recomputeForRates(campaignRatings.staleEvidence()); }

    public void recompute(String firstUserId, String secondUserId) {
        PairKey pair = PairKey.of(firstUserId, secondUserId);
        if (pair == null) return;
        UserRate trigger = new UserRate(); trigger.setMode(MODE_SINGLE);
        trigger.setOwnerUserId(pair.leftUserId()); trigger.setRelatedUserId(pair.rightUserId());
        recomputeForRates(List.of(trigger));
    }

    private void recompute(PairKey pair, AffinityConfig config, List<UserRate> pairRates) {
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

    private Map<String, AffinityConfig> configsForUsers(java.util.Collection<String> ids) {
        Map<String, AffinityConfig> result = new LinkedHashMap<>();
        groupScope.usersByGroup(ids).forEach((baseId, users) -> {
            var config = affinityConfigsRepository.findFirstByKeyAndActiveTrueOrderByVersionDesc(baseId == null ? "default" : baseId)
                    .orElseGet(AffinityConfig::defaults);
            users.forEach(user -> result.put(user, config));
        });
        return result;
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
