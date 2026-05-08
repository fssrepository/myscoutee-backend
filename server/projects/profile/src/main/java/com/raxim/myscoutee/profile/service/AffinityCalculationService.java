package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class AffinityCalculationService {
    private static final String MODE_PAIR = "pair";
    private static final String MODE_SINGLE = "single";
    private static final String SOCIAL_SEPARATED_FRIENDS = "separated-friends";
    private static final double EARTH_RADIUS_METERS = 6_371_000d;

    private final AffinityConfigsRepository affinityConfigsRepository;
    private final UsersRepository usersRepository;
    private final UserRatesRepository userRatesRepository;

    public AffinityCalculationService(
            AffinityConfigsRepository affinityConfigsRepository,
            UsersRepository usersRepository,
            UserRatesRepository userRatesRepository) {
        this.affinityConfigsRepository = affinityConfigsRepository;
        this.usersRepository = usersRepository;
        this.userRatesRepository = userRatesRepository;
    }

    public void applyAffinity(List<UserRate> rates) {
        if (rates == null || rates.isEmpty()) {
            return;
        }

        AffinityConfig config = activeConfig();
        Set<String> userIds = collectUserIds(rates);
        Map<String, Users> usersById = loadUsers(userIds);
        List<UserRate> contextRates = loadContextRates(userIds, rates);

        for (UserRate rate : rates) {
            applyAffinity(rate, usersById, contextRates, config);
        }
    }

    private void applyAffinity(
            UserRate rate,
            Map<String, Users> usersById,
            List<UserRate> contextRates,
            AffinityConfig config) {
        if (rate == null) {
            return;
        }

        String mode = normalize(rate.getMode());
        String ownerUserId = normalize(rate.getOwnerUserId());
        String relatedUserId = normalize(rate.getRelatedUserId());
        String secondaryRelatedUserId = normalize(rate.getSecondaryRelatedUserId());
        Users owner = usersById.get(ownerUserId);
        Users related = usersById.get(relatedUserId);
        Users secondary = usersById.get(secondaryRelatedUserId);

        int scoreGiven = normalizeScore(rate.getScoreGiven());
        int scoreReceived = normalizeScore(rate.getScoreReceived());
        if (MODE_SINGLE.equals(mode)) {
            Integer reciprocalScore = resolveReciprocalScore(rate, contextRates);
            if (reciprocalScore != null && reciprocalScore > 0) {
                scoreReceived = reciprocalScore;
                rate.setScoreReceived(scoreReceived);
            }
        }

        boolean mutuallyRated = MODE_SINGLE.equals(mode) && scoreGiven > 0 && scoreReceived > 0;
        rate.setMutuallyRated(mutuallyRated);

        List<Signal> signals = new ArrayList<>();
        addRatingSignal(signals, rate, mode, scoreGiven, scoreReceived, mutuallyRated, config);
        if (MODE_PAIR.equals(mode)) {
            addCompatibilitySignals(signals, related, secondary, config);
            addOwnerContextSignal(signals, owner, related, secondary, rate, contextRates, config);
        } else {
            addCompatibilitySignals(signals, owner, related, config);
        }

        rate.setAffinityScore(weightedAverage(signals));
        rate.setEvidenceConfidence(evidenceConfidence(rate, owner, related, secondary));
    }

    private void addRatingSignal(
            List<Signal> signals,
            UserRate rate,
            String mode,
            int scoreGiven,
            int scoreReceived,
            boolean mutuallyRated,
            AffinityConfig config) {
        if (scoreGiven <= 0) {
            return;
        }

        double ratingSignal;
        double multiplier;
        if (MODE_PAIR.equals(mode)) {
            ratingSignal = normalizeScoreSignal(scoreGiven);
            multiplier = isInsideNetwork(rate)
                    ? multiplier(config.getRating().getPairInsideNetwork(), 5d)
                    : multiplier(config.getRating().getPairOutsideNetwork(), 2d);
        } else if (mutuallyRated) {
            ratingSignal = harmonic(List.of(normalizeScoreSignal(scoreGiven), normalizeScoreSignal(scoreReceived)));
            multiplier = multiplier(config.getRating().getSingleMutual(), 10d);
        } else {
            ratingSignal = normalizeScoreSignal(scoreGiven);
            multiplier = multiplier(config.getRating().getSingleOneSided(), 2d);
        }
        addSignal(signals, ratingSignal, multiplier);
    }

    private void addCompatibilitySignals(List<Signal> signals, Users left, Users right, AffinityConfig config) {
        addProfileSignals(signals, left, right, config);
        addDistanceSignal(signals, left, right, config);
        addImpressionSignals(signals, left, right, config);
    }

    private Double compatibilityScore(Users left, Users right, AffinityConfig config) {
        List<Signal> signals = new ArrayList<>();
        addCompatibilitySignals(signals, left, right, config);
        return signals.isEmpty() ? null : weightedAverage(signals);
    }

    private void addOwnerContextSignal(
            List<Signal> signals,
            Users owner,
            Users related,
            Users secondary,
            UserRate rate,
            List<UserRate> contextRates,
            AffinityConfig config) {
        if (!isInsideNetwork(rate)) {
            return;
        }

        Double ownerRelated = ownerParticipantContext(owner, related, rate, contextRates, config);
        Double ownerSecondary = ownerParticipantContext(owner, secondary, rate, contextRates, config);
        Double context = harmonic(nonNullValues(ownerRelated, ownerSecondary));
        addSignal(signals, context, multiplier(config.getOwnerContext(), 3d));
    }

    private Double ownerParticipantContext(
            Users owner,
            Users participant,
            UserRate currentRate,
            List<UserRate> contextRates,
            AffinityConfig config) {
        String ownerUserId = normalize(owner == null ? null : owner.getId());
        String participantUserId = normalize(participant == null ? null : participant.getId());
        Double compatibility = compatibilityScore(owner, participant, config);
        Double relationship = relationshipScore(ownerUserId, participantUserId, currentRate, contextRates);
        return average(nonNullValues(compatibility, relationship));
    }

    private Double relationshipScore(
            String firstUserId,
            String secondUserId,
            UserRate currentRate,
            List<UserRate> contextRates) {
        if (!StringUtils.hasText(firstUserId)
                || !StringUtils.hasText(secondUserId)
                || firstUserId.equals(secondUserId)
                || contextRates == null) {
            return null;
        }

        Double best = null;
        for (UserRate candidate : contextRates) {
            if (candidate == null || sameRecord(currentRate, candidate)) {
                continue;
            }
            if (!MODE_SINGLE.equals(normalize(candidate.getMode()))) {
                continue;
            }
            String ownerUserId = normalize(candidate.getOwnerUserId());
            String relatedUserId = normalize(candidate.getRelatedUserId());
            boolean samePair = (firstUserId.equals(ownerUserId) && secondUserId.equals(relatedUserId))
                    || (firstUserId.equals(relatedUserId) && secondUserId.equals(ownerUserId));
            if (!samePair) {
                continue;
            }

            Double candidateScore = relationshipEvidenceScore(candidate);
            if (candidateScore == null) {
                continue;
            }
            best = best == null ? candidateScore : Math.max(best, candidateScore);
        }
        return best;
    }

    private Double relationshipEvidenceScore(UserRate rate) {
        if (rate == null) {
            return null;
        }
        if (isFinite(rate.getAffinityScore()) && rate.getAffinityScore() > 0d) {
            return clamp01(rate.getAffinityScore());
        }

        int scoreGiven = normalizeScore(rate.getScoreGiven());
        int scoreReceived = normalizeScore(rate.getScoreReceived());
        if (scoreGiven > 0 && scoreReceived > 0) {
            return harmonic(List.of(normalizeScoreSignal(scoreGiven), normalizeScoreSignal(scoreReceived)));
        }
        int oneSidedScore = Math.max(scoreGiven, scoreReceived);
        return oneSidedScore > 0 ? normalizeScoreSignal(oneSidedScore) * 0.5d : null;
    }

    private void addProfileSignals(List<Signal> signals, Users left, Users right, AffinityConfig config) {
        if (left == null || right == null) {
            return;
        }
        for (AffinityConfig.FieldRule rule : config.getProfileRules()) {
            if (rule == null || !StringUtils.hasText(rule.getField())) {
                continue;
            }
            Double score = profileSignal(left, right, rule);
            addSignal(signals, score, multiplier(rule, 1d));
        }
    }

    private Double profileSignal(Users left, Users right, AffinityConfig.FieldRule rule) {
        List<String> leftValues = profileValues(left, rule.getField());
        List<String> rightValues = profileValues(right, rule.getField());
        String strategy = normalize(rule.getStrategy());
        if ("exact".equals(strategy)) {
            return exactScore(leftValues, rightValues);
        }
        if ("intersection".equals(strategy) || !StringUtils.hasText(strategy)) {
            return intersectionScore(leftValues, rightValues);
        }
        return null;
    }

    private List<String> profileValues(Users user, String field) {
        if (user == null || !StringUtils.hasText(field)) {
            return List.of();
        }
        return switch (field) {
            case "languages" -> normalizeValues(user.getLanguages());
            case "physique" -> singleValue(user.getPhysique());
            case "gender" -> singleValue(user.getGender());
            case "horoscope" -> singleValue(user.getHoroscope());
            case "city" -> singleValue(user.getCity());
            case "hostTier" -> singleValue(user.getHostTier());
            case "traitLabel" -> singleValue(user.getTraitLabel());
            case "profileDetails.values" -> profileDetailValues(user);
            default -> List.of();
        };
    }

    private List<String> singleValue(String value) {
        String normalized = normalize(value);
        return StringUtils.hasText(normalized) ? List.of(normalized) : List.of();
    }

    private List<String> profileDetailValues(Users user) {
        if (user == null || user.getProfileDetails() == null) {
            return List.of();
        }
        Set<String> values = new LinkedHashSet<>();
        for (Users.ProfileDetailGroupRecord group : user.getProfileDetails()) {
            if (group == null || group.rows() == null) {
                continue;
            }
            for (Users.ProfileDetailRowRecord row : group.rows()) {
                if (row == null) {
                    continue;
                }
                addNormalizedValue(values, row.value());
                if (row.options() != null) {
                    for (String option : row.options()) {
                        addNormalizedValue(values, option);
                    }
                }
            }
        }
        return new ArrayList<>(values);
    }

    private void addDistanceSignal(List<Signal> signals, Users left, Users right, AffinityConfig config) {
        Double score = distanceSignal(left, right, config.getDistance());
        addSignal(signals, score, multiplier(config.getDistance(), 5d));
    }

    private Double distanceSignal(Users left, Users right, AffinityConfig.DistanceRule rule) {
        if (left == null || right == null || left.getLocationCoordinates() == null || right.getLocationCoordinates() == null) {
            return null;
        }
        Double leftLat = left.getLocationCoordinates().latitude();
        Double leftLon = left.getLocationCoordinates().longitude();
        Double rightLat = right.getLocationCoordinates().latitude();
        Double rightLon = right.getLocationCoordinates().longitude();
        if (!isFinite(leftLat) || !isFinite(leftLon) || !isFinite(rightLat) || !isFinite(rightLon)) {
            return null;
        }
        double meters = distanceMeters(leftLat, leftLon, rightLat, rightLon);
        int maxMeters = rule == null || rule.getMaxMeters() == null || rule.getMaxMeters() <= 0
                ? 50_000
                : rule.getMaxMeters();
        return clamp01(1d - Math.min(meters, maxMeters) / maxMeters);
    }

    private void addImpressionSignals(List<Signal> signals, Users left, Users right, AffinityConfig config) {
        if (left == null || right == null) {
            return;
        }
        for (AffinityConfig.FieldRule rule : config.getImpressionRules()) {
            if (rule == null || !StringUtils.hasText(rule.getField())) {
                continue;
            }
            Double score = impressionSignal(left, right, rule);
            addSignal(signals, score, multiplier(rule, 1d));
        }
    }

    private Double impressionSignal(Users left, Users right, AffinityConfig.FieldRule rule) {
        String strategy = normalize(rule.getStrategy());
        if ("trait-vector".equals(strategy)) {
            return traitVectorScore(left, right, rule.getField());
        }
        if ("intersection".equals(strategy)) {
            return intersectionScore(impressionValues(left, rule.getField()), impressionValues(right, rule.getField()));
        }
        return null;
    }

    private Double evidenceConfidence(UserRate rate, Users owner, Users related, Users secondary) {
        List<Double> confidences = new ArrayList<>();
        String mode = normalize(rate == null ? null : rate.getMode());
        if (MODE_PAIR.equals(mode)) {
            addConfidence(confidences, userConfidence(related));
            addConfidence(confidences, userConfidence(secondary));
            if (isInsideNetwork(rate)) {
                addConfidence(confidences, userConfidence(owner));
            }
        } else {
            addConfidence(confidences, userConfidence(owner));
            addConfidence(confidences, userConfidence(related));
        }
        Double confidence = average(confidences);
        return confidence == null ? 1d : confidence;
    }

    private void addConfidence(List<Double> confidences, Double confidence) {
        if (isFinite(confidence)) {
            confidences.add(clamp01(confidence));
        }
    }

    private Double userConfidence(Users user) {
        if (user == null || user.getImpressions() == null) {
            return null;
        }
        return average(nonNullValues(
                sectionConfidence(user.getImpressions().member()),
                sectionConfidence(user.getImpressions().host())));
    }

    private Double sectionConfidence(Users.UserImpressionsSectionRecord section) {
        if (section == null) {
            return null;
        }

        List<Double> signals = new ArrayList<>();
        addConfidence(signals, ratingConfidence(section.averageRating()));
        addConfidence(signals, countConfidence(section.peopleMet(), 20));
        addConfidence(signals, countConfidence(section.totalEvents(), 20));
        addConfidence(signals, countConfidence(section.repeatCount(), 10));
        addConfidence(signals, traitEvidenceConfidence(section.personalityTraits()));
        Double base = average(signals);
        if (base == null) {
            return null;
        }

        int noShowCount = section.noShowCount() == null ? 0 : Math.max(0, section.noShowCount());
        double noShowPenalty = 1d - Math.min(0.8d, noShowCount * 0.2d);
        return clamp01(base * noShowPenalty);
    }

    private Double ratingConfidence(Double averageRating) {
        if (!isFinite(averageRating) || averageRating <= 0d) {
            return null;
        }
        double denominator = averageRating <= 5d ? 5d : 10d;
        return clamp01(averageRating / denominator);
    }

    private Double countConfidence(Integer count, int saturationCount) {
        if (count == null || count < 0 || saturationCount <= 0) {
            return null;
        }
        return clamp01(count / (double) saturationCount);
    }

    private Double traitEvidenceConfidence(List<Users.UserPersonalityTraitRecord> traits) {
        if (traits == null || traits.isEmpty()) {
            return null;
        }
        List<Double> signals = new ArrayList<>();
        for (Users.UserPersonalityTraitRecord trait : traits) {
            if (trait == null || trait.evidenceCount() == null) {
                continue;
            }
            addConfidence(signals, countConfidence(trait.evidenceCount(), 20));
        }
        return average(signals);
    }

    private Double traitVectorScore(Users left, Users right, String field) {
        Map<String, Double> leftVector = traitVector(left, field);
        Map<String, Double> rightVector = traitVector(right, field);
        if (leftVector.isEmpty() || rightVector.isEmpty()) {
            return null;
        }

        Set<String> dimensions = new HashSet<>();
        dimensions.addAll(leftVector.keySet());
        dimensions.addAll(rightVector.keySet());
        double dot = 0d;
        double leftNorm = 0d;
        double rightNorm = 0d;
        for (String dimension : dimensions) {
            double leftValue = leftVector.getOrDefault(dimension, 0d);
            double rightValue = rightVector.getOrDefault(dimension, 0d);
            dot += leftValue * rightValue;
            leftNorm += leftValue * leftValue;
            rightNorm += rightValue * rightValue;
        }
        if (leftNorm <= 0d || rightNorm <= 0d) {
            return null;
        }
        return clamp01(dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm)));
    }

    private Map<String, Double> traitVector(Users user, String field) {
        Users.UserImpressionsSectionRecord section = impressionSection(user, field);
        if (section == null || section.personalityTraits() == null) {
            return Map.of();
        }
        Map<String, Double> vector = new LinkedHashMap<>();
        for (Users.UserPersonalityTraitRecord trait : section.personalityTraits()) {
            if (trait == null) {
                continue;
            }
            String key = normalize(StringUtils.hasText(trait.id()) ? trait.id() : trait.label());
            if (!StringUtils.hasText(key) || trait.percent() == null) {
                continue;
            }
            vector.put(key, clamp01(trait.percent() / 100d));
        }
        return vector;
    }

    private List<String> impressionValues(Users user, String field) {
        Users.UserImpressionsSectionRecord section = impressionSection(user, field);
        if (section == null || !StringUtils.hasText(field)) {
            return List.of();
        }
        return switch (field) {
            case "member.vibeBadges", "host.vibeBadges" -> normalizeValues(section.vibeBadges());
            case "member.personalityBadges", "host.personalityBadges" -> normalizeValues(section.personalityBadges());
            case "member.categoryBadges", "host.categoryBadges" -> normalizeValues(section.categoryBadges());
            default -> List.of();
        };
    }

    private Users.UserImpressionsSectionRecord impressionSection(Users user, String field) {
        if (user == null || user.getImpressions() == null || !StringUtils.hasText(field)) {
            return null;
        }
        if (field.startsWith("host.")) {
            return user.getImpressions().host();
        }
        return user.getImpressions().member();
    }

    private Integer resolveReciprocalScore(UserRate rate, List<UserRate> contextRates) {
        String ownerUserId = normalize(rate.getOwnerUserId());
        String relatedUserId = normalize(rate.getRelatedUserId());
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(relatedUserId)) {
            return null;
        }

        UserRate best = null;
        for (UserRate candidate : contextRates) {
            if (candidate == null || sameRecord(rate, candidate)) {
                continue;
            }
            if (!MODE_SINGLE.equals(normalize(candidate.getMode()))) {
                continue;
            }
            if (!relatedUserId.equals(normalize(candidate.getOwnerUserId()))
                    || !ownerUserId.equals(normalize(candidate.getRelatedUserId()))) {
                continue;
            }
            if (normalizeScore(candidate.getScoreGiven()) <= 0) {
                continue;
            }
            if (best == null || compareUpdatedDate(candidate, best) > 0) {
                best = candidate;
            }
        }
        return best == null ? null : normalizeScore(best.getScoreGiven());
    }

    private int compareUpdatedDate(UserRate left, UserRate right) {
        String leftDate = normalize(left == null ? null : left.getUpdatedDate());
        String rightDate = normalize(right == null ? null : right.getUpdatedDate());
        return leftDate.compareTo(rightDate);
    }

    private boolean sameRecord(UserRate left, UserRate right) {
        String leftId = normalize(left == null ? null : left.getId());
        String rightId = normalize(right == null ? null : right.getId());
        if (StringUtils.hasText(leftId) && leftId.equals(rightId)) {
            return true;
        }
        String leftSyncKey = normalize(left == null ? null : left.getSyncKey());
        String rightSyncKey = normalize(right == null ? null : right.getSyncKey());
        return StringUtils.hasText(leftSyncKey) && leftSyncKey.equals(rightSyncKey);
    }

    private List<UserRate> loadContextRates(Set<String> userIds, List<UserRate> pendingRates) {
        List<UserRate> contextRates = new ArrayList<>();
        if (userIds != null && !userIds.isEmpty()) {
            contextRates.addAll(userRatesRepository.findRelevantByUserIds(new ArrayList<>(userIds)));
        }
        if (pendingRates != null) {
            contextRates.addAll(pendingRates);
        }
        return contextRates;
    }

    private Map<String, Users> loadUsers(Set<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Map.of();
        }
        Map<String, Users> usersById = new HashMap<>();
        for (Users user : usersRepository.findByUserIdIn(userIds)) {
            String userId = normalize(user == null ? null : user.getId());
            if (StringUtils.hasText(userId)) {
                usersById.put(userId, user);
            }
        }
        return usersById;
    }

    private Set<String> collectUserIds(List<UserRate> rates) {
        Set<String> userIds = new LinkedHashSet<>();
        if (rates == null) {
            return userIds;
        }
        for (UserRate rate : rates) {
            addUserId(userIds, rate == null ? null : rate.getOwnerUserId());
            addUserId(userIds, rate == null ? null : rate.getRelatedUserId());
            addUserId(userIds, rate == null ? null : rate.getSecondaryRelatedUserId());
        }
        return userIds;
    }

    private void addUserId(Set<String> userIds, String userId) {
        String normalized = normalize(userId);
        if (StringUtils.hasText(normalized)) {
            userIds.add(normalized);
        }
    }

    private AffinityConfig activeConfig() {
        return affinityConfigsRepository.findFirstByActiveTrueOrderByVersionDesc()
                .orElseGet(AffinityConfig::defaults);
    }

    private Double weightedAverage(List<Signal> signals) {
        double total = 0d;
        double totalMultiplier = 0d;
        for (Signal signal : signals) {
            if (signal == null || !isFinite(signal.value()) || !isFinite(signal.multiplier()) || signal.multiplier() <= 0d) {
                continue;
            }
            total += clamp01(signal.value()) * signal.multiplier();
            totalMultiplier += signal.multiplier();
        }
        return totalMultiplier <= 0d ? 0d : total / totalMultiplier;
    }

    private void addSignal(List<Signal> signals, Double value, double multiplier) {
        if (!isFinite(value) || !isFinite(multiplier) || multiplier <= 0d) {
            return;
        }
        signals.add(new Signal(clamp01(value), multiplier));
    }

    private double multiplier(AffinityConfig.MultiplierRule rule, double fallback) {
        Double multiplier = rule == null ? null : rule.getMultiplier();
        return isFinite(multiplier) ? Math.max(0d, multiplier) : fallback;
    }

    private Double exactScore(Collection<String> leftValues, Collection<String> rightValues) {
        Set<String> left = normalizedSet(leftValues);
        Set<String> right = normalizedSet(rightValues);
        if (left.isEmpty() || right.isEmpty()) {
            return null;
        }
        for (String value : left) {
            if (right.contains(value)) {
                return 1d;
            }
        }
        return 0d;
    }

    private Double intersectionScore(Collection<String> leftValues, Collection<String> rightValues) {
        Set<String> left = normalizedSet(leftValues);
        Set<String> right = normalizedSet(rightValues);
        if (left.isEmpty() || right.isEmpty()) {
            return null;
        }
        Set<String> intersection = new HashSet<>(left);
        intersection.retainAll(right);
        Set<String> union = new HashSet<>(left);
        union.addAll(right);
        return union.isEmpty() ? null : (double) intersection.size() / union.size();
    }

    private List<String> normalizeValues(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        List<String> normalized = new ArrayList<>();
        for (String value : values) {
            String text = normalize(value);
            if (StringUtils.hasText(text)) {
                normalized.add(text);
            }
        }
        return normalized;
    }

    private Set<String> normalizedSet(Collection<String> values) {
        return new LinkedHashSet<>(normalizeValues(values));
    }

    private void addNormalizedValue(Set<String> values, String value) {
        String normalized = normalize(value);
        if (StringUtils.hasText(normalized)) {
            values.add(normalized);
        }
    }

    private List<Double> nonNullValues(Double... values) {
        List<Double> normalized = new ArrayList<>();
        if (values == null) {
            return normalized;
        }
        for (Double value : values) {
            if (isFinite(value)) {
                normalized.add(clamp01(value));
            }
        }
        return normalized;
    }

    private Double harmonic(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        double reciprocalTotal = 0d;
        int count = 0;
        for (Double value : values) {
            if (!isFinite(value)) {
                continue;
            }
            double bounded = clamp01(value);
            if (bounded <= 0d) {
                return 0d;
            }
            reciprocalTotal += 1d / bounded;
            count += 1;
        }
        return count == 0 || reciprocalTotal <= 0d ? null : count / reciprocalTotal;
    }

    private Double average(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        double total = 0d;
        int count = 0;
        for (Double value : values) {
            if (!isFinite(value)) {
                continue;
            }
            total += clamp01(value);
            count += 1;
        }
        return count == 0 ? null : total / count;
    }

    private double normalizeScoreSignal(int score) {
        return clamp01(normalizeScore(score) / 10d);
    }

    private int normalizeScore(Integer value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, Math.min(10, value));
    }

    private boolean isInsideNetwork(UserRate rate) {
        return SOCIAL_SEPARATED_FRIENDS.equals(normalize(rate == null ? null : rate.getSocialContext()));
    }

    private double distanceMeters(double leftLat, double leftLon, double rightLat, double rightLon) {
        double leftLatRad = Math.toRadians(leftLat);
        double rightLatRad = Math.toRadians(rightLat);
        double deltaLat = Math.toRadians(rightLat - leftLat);
        double deltaLon = Math.toRadians(rightLon - leftLon);
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(leftLatRad) * Math.cos(rightLatRad)
                * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }

    private boolean isFinite(Double value) {
        return value != null && Double.isFinite(value);
    }

    private double clamp01(double value) {
        if (!Double.isFinite(value)) {
            return 0d;
        }
        return Math.max(0d, Math.min(1d, value));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private record Signal(double value, double multiplier) {
    }
}
