package com.raxim.myscoutee.domain.affinity.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;
import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@Service
public class AdminGraphScienceService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final int TIMELINE_DAYS = 14;
    private static final int MAX_EVENT_CLIQUE_SIZE = 60;
    private static final int REACHABILITY_NODE_LIMIT = 250;

    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final UserRatesRepository userRatesRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final UsersRepository usersRepository;

    public AdminGraphScienceService(
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            UserRatesRepository userRatesRepository,
            ActivityMembersRepository activityMembersRepository,
            UsersRepository usersRepository) {
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.userRatesRepository = userRatesRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.usersRepository = usersRepository;
    }

    public void refresh(AdminStatsSnapshot snapshot) {
        if (snapshot == null) {
            return;
        }
        GraphScienceResult result = calculate("global".equals(snapshot.getStatsKey()) ? null : snapshot.getStatsKey());
        snapshot.setGraphHealthScore(result.healthScore());
        snapshot.setGraphHealthLabelKey(result.healthLabelKey());
        snapshot.setGraphInsightKey(result.insightKey());
        snapshot.setGraphMetrics(result.metrics());
        snapshot.setGraphBridgeUsers(result.bridgeUsers());
        snapshot.setGraphCommunities(result.communities());
        snapshot.setGraphSignals(result.signals());
        snapshot.setDailyGraphActivity(mergeDailyGraphActivity(
                snapshot.getDailyGraphActivity(),
                result.dailyGraphActivity()));
    }

    private Map<String, Map<String, Long>> mergeDailyGraphActivity(
            Map<String, Map<String, Long>> existing,
            Map<String, Map<String, Long>> calculated) {
        Map<String, Map<String, Long>> merged = new LinkedHashMap<>();
        if (calculated == null || calculated.isEmpty()) {
            return merged;
        }
        String todayKey = LocalDate.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_LOCAL_DATE);
        calculated.forEach((dateKey, calculatedValues) -> {
            Map<String, Long> values = calculatedValues;
            if (!todayKey.equals(dateKey) && existing != null && existing.containsKey(dateKey)) {
                values = existing.get(dateKey);
            }
            merged.put(dateKey, values == null ? new LinkedHashMap<>() : new LinkedHashMap<>(values));
        });
        return merged;
    }

    private GraphScienceResult calculate(String groupId) {
        List<Users> users = usersRepository.findAll().stream().filter(user -> Objects.equals(groupId, user.getWorkspaceGroupId())).toList();
        Map<String, String> userNamesById = userNamesById(users);
        Map<String, String> userGendersById = userGendersById(users);
        Map<String, GraphEdge> edgesByKey = new LinkedHashMap<>();
        LinkedHashSet<String> nodes = new LinkedHashSet<>();

        addAffinityEdges(edgesByKey, nodes);
        addRateEdges(edgesByKey, nodes);
        addEventMemberEdges(edgesByKey, nodes);

        nodes.retainAll(userNamesById.keySet());
        List<GraphEdge> edges = edgesByKey.values().stream()
                .filter(edge -> userNamesById.containsKey(edge.left()) && userNamesById.containsKey(edge.right()))
                .filter(edge -> StringUtils.hasText(edge.left()) && StringUtils.hasText(edge.right()))
                .toList();
        Map<String, Map<String, Double>> graph = adjacency(edges);
        nodes.addAll(graph.keySet());

        Map<String, String> communitiesByNode = detectCommunities(graph);
        Map<String, Long> communitySizes = communitySizes(communitiesByNode);
        Map<String, Double> localClustering = localClustering(graph);
        Map<String, Long> bridgeUsers = bridgeUsers(graph, communitiesByNode, localClustering, userNamesById);

        long nodeCount = nodes.size();
        long edgeCount = edges.size();
        long weakTieCount = edges.stream().filter(GraphEdge::weakTie).count();
        long recurringEdgeCount = edges.stream().filter(GraphEdge::recurring).count();
        long weakTieRatio = pct(weakTieCount, edgeCount);
        long recurringRatio = pct(recurringEdgeCount, edgeCount);
        long clusteringPct = Math.round(localClustering.values().stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0d) * 100d);
        long reachabilityPct = reachabilityTwoHopPct(graph);
        long largestCommunityPct = pct(communitySizes.values().stream().mapToLong(Long::longValue).max().orElse(0L), Math.max(1L, nodeCount));
        long bridgeCoveragePct = pct(bridgeUsers.size(), Math.max(1L, nodeCount));
        long avgDegreeTenths = nodeCount == 0 ? 0L : Math.round((edgeCount * 2d / nodeCount) * 10d);
        long networkQualityPct = networkQualityPct(edges);
        long clusterQualityPct = clusterQualityPct(clusteringPct, largestCommunityPct, communitySizes.size(), nodeCount);
        Map<String, Long> genderAverages = genderRatingAverages(userGendersById);
        Map<String, Map<String, Long>> daily = dailyGraphActivity(edges, bridgeUsers.size(), communitySizes.size(), clusterQualityPct);

        Map<String, Long> metrics = new LinkedHashMap<>();
        metrics.put("users", nodeCount);
        metrics.put("edges", edgeCount);
        metrics.put("communities", (long) communitySizes.size());
        metrics.put("bridge-users", (long) bridgeUsers.size());
        metrics.put("avg-degree-tenths", avgDegreeTenths);
        metrics.put("reachability-2-hop", reachabilityPct);
        metrics.put("clustering", clusteringPct);
        metrics.put("weak-tie-ratio", weakTieRatio);
        metrics.put("recurring-edge-ratio", recurringRatio);
        metrics.put("network-quality", networkQualityPct);
        metrics.put("cluster-quality", clusterQualityPct);
        metrics.putAll(genderAverages);

        Map<String, Long> signals = new LinkedHashMap<>();
        signals.put("reachability-2-hop", reachabilityPct);
        signals.put("weak-tie-ratio", weakTieRatio);
        signals.put("clustering", clusteringPct);
        signals.put("recurring-edge-ratio", recurringRatio);
        signals.put("bridge-coverage", bridgeCoveragePct);
        signals.put("largest-community", largestCommunityPct);
        signals.put("network-quality", networkQualityPct);
        signals.put("cluster-quality", clusterQualityPct);

        int health = graphHealth(reachabilityPct, weakTieRatio, clusteringPct, recurringRatio);
        return new GraphScienceResult(
                health,
                health >= 80 ? "stats.graph.health.good" : health >= 60 ? "stats.graph.health.watch" : "stats.graph.health.risk",
                insightKey(reachabilityPct, weakTieRatio, clusteringPct, bridgeUsers.size(), nodeCount),
                metrics,
                bridgeUsers,
                communitySizes,
                signals,
                daily);
    }

    private void addAffinityEdges(Map<String, GraphEdge> edgesByKey, Set<String> nodes) {
        for (UserAffinityEdge edge : userAffinityEdgesRepository.findAll()) {
            if (edge == null) {
                continue;
            }
            String left = normalizeId(edge.getLeftUserId());
            String right = normalizeId(edge.getRightUserId());
            if (!validPair(left, right)) {
                continue;
            }
            UserAffinityEdge.EvidenceSummary evidence = edge.getEvidence();
            int pairOutside = safeInt(evidence == null ? null : evidence.getPairOutsideNetworkCount());
            int pairInside = safeInt(evidence == null ? null : evidence.getPairInsideNetworkCount());
            int mutual = safeInt(evidence == null ? null : evidence.getMutualSingleCount());
            int met = safeInt(evidence == null ? null : evidence.getMetCount());
            int oneSided = safeInt(evidence == null ? null : evidence.getSingleOneSidedCount());
            int evidenceCount = Math.max(1, pairOutside + pairInside + mutual + met + oneSided);
            double weight = clamp(safeDouble(edge.getEdgeWeight()), 0.05d, 1.4d);
            boolean weakTie = pairOutside > 0 || weight < 0.35d;
            boolean recurring = mutual + met + pairInside > 1 || evidenceCount > 2;
            addEdge(edgesByKey, nodes, left, right, weight, evidenceCount, weakTie, recurring, edge.getUpdatedDate());
        }
    }

    private void addRateEdges(Map<String, GraphEdge> edgesByKey, Set<String> nodes) {
        for (UserRate rate : userRatesRepository.findAll()) {
            if (rate == null) {
                continue;
            }
            String owner = normalizeId(rate.getOwnerUserId());
            String related = normalizeId(rate.getRelatedUserId());
            String secondary = normalizeId(rate.getSecondaryRelatedUserId());
            String context = normalizeKey(rate.getSocialContext());
            boolean mutual = Boolean.TRUE.equals(rate.getMutuallyRated());
            boolean met = Boolean.TRUE.equals(rate.getMet()) || "met".equals(context);
            double baseWeight = mutual ? 0.9d : met ? 0.7d : "inside-network".equals(context) ? 0.55d : "outside-network".equals(context) ? 0.25d : 0.35d;
            double affinityWeight = clamp(safeDouble(rate.getAffinityScore()) / 10d, 0.05d, 1.0d);
            double weight = Math.max(baseWeight, affinityWeight);
            boolean weakTie = "outside-network".equals(context) || (!mutual && !met && weight < 0.45d);
            boolean recurring = mutual || met || safeInt(rate.getBridgeCount()) > 1;
            String date = firstNonBlank(rate.getUpdatedDate(), rate.getCreatedDate());
            addEdge(edgesByKey, nodes, owner, related, weight, 1, weakTie, recurring, date);
            if (StringUtils.hasText(secondary)) {
                addEdge(edgesByKey, nodes, related, secondary, Math.max(0.18d, weight * 0.75d), 1, weakTie, recurring, date);
                if ("inside-network".equals(context)) {
                    addEdge(edgesByKey, nodes, owner, secondary, Math.max(0.16d, weight * 0.45d), 1, true, false, date);
                }
            }
            String bridge = normalizeId(rate.getBridgeUserId());
            if (StringUtils.hasText(bridge) && !bridge.equals(owner) && !bridge.equals(related)) {
                addEdge(edgesByKey, nodes, bridge, related, Math.max(0.12d, weight * 0.35d), 1, true, false, date);
            }
        }
    }

    private void addEventMemberEdges(Map<String, GraphEdge> edgesByKey, Set<String> nodes) {
        Map<String, List<ActivityMember>> acceptedByEvent = new LinkedHashMap<>();
        for (ActivityMember member : activityMembersRepository.findAll()) {
            if (member == null || !OWNER_TYPE_EVENT.equals(normalizeKey(member.getOwnerType()))) {
                continue;
            }
            String userId = normalizeId(member.getUserId());
            String invitedBy = normalizeId(member.getInvitedByUserId());
            String date = firstNonBlank(member.getActionAtIso(), firstNonBlank(member.getMetAtIso(), member.getUpdatedDate()));
            if (validPair(invitedBy, userId)) {
                addEdge(edgesByKey, nodes, invitedBy, userId, 0.38d, 1, true, false, date);
            }
            if (!STATUS_ACCEPTED.equals(normalizeKey(member.getStatus())) || !StringUtils.hasText(userId)) {
                continue;
            }
            acceptedByEvent.computeIfAbsent(normalizeId(member.getOwnerId()), ignored -> new ArrayList<>()).add(member);
        }

        for (List<ActivityMember> members : acceptedByEvent.values()) {
            List<ActivityMember> limited = members.stream()
                    .filter(member -> StringUtils.hasText(normalizeId(member.getUserId())))
                    .limit(MAX_EVENT_CLIQUE_SIZE)
                    .toList();
            for (int i = 0; i < limited.size(); i++) {
                for (int j = i + 1; j < limited.size(); j++) {
                    ActivityMember left = limited.get(i);
                    ActivityMember right = limited.get(j);
                    String date = latest(firstNonBlank(left.getMetAtIso(), left.getActionAtIso()), firstNonBlank(right.getMetAtIso(), right.getActionAtIso()));
                    addEdge(edgesByKey, nodes, left.getUserId(), right.getUserId(), 0.22d, 1, true, false, date);
                }
            }
        }
    }

    private void addEdge(
            Map<String, GraphEdge> edgesByKey,
            Set<String> nodes,
            String leftUserId,
            String rightUserId,
            double weight,
            int evidenceCount,
            boolean weakTie,
            boolean recurring,
            String seenAtIso) {
        String left = normalizeId(leftUserId);
        String right = normalizeId(rightUserId);
        if (!validPair(left, right)) {
            return;
        }
        String key = pairKey(left, right);
        GraphEdge existing = edgesByKey.get(key);
        GraphEdge next = existing == null
                ? new GraphEdge(left.compareTo(right) <= 0 ? left : right, left.compareTo(right) <= 0 ? right : left)
                : existing;
        next.add(weight, evidenceCount, weakTie, recurring, seenAtIso);
        edgesByKey.put(key, next);
        nodes.add(left);
        nodes.add(right);
    }

    private Map<String, Map<String, Double>> adjacency(List<GraphEdge> edges) {
        Map<String, Map<String, Double>> graph = new LinkedHashMap<>();
        for (GraphEdge edge : edges) {
            graph.computeIfAbsent(edge.left(), ignored -> new LinkedHashMap<>()).put(edge.right(), edge.weight());
            graph.computeIfAbsent(edge.right(), ignored -> new LinkedHashMap<>()).put(edge.left(), edge.weight());
        }
        return graph;
    }

    private Map<String, String> detectCommunities(Map<String, Map<String, Double>> graph) {
        Map<String, String> labels = new LinkedHashMap<>();
        graph.keySet().forEach(node -> labels.put(node, node));
        List<String> nodes = new ArrayList<>(graph.keySet());
        for (int iteration = 0; iteration < 8; iteration++) {
            boolean changed = false;
            for (String node : nodes) {
                Map<String, Double> labelScores = new LinkedHashMap<>();
                graph.getOrDefault(node, Map.of()).forEach((neighbor, weight) -> {
                    String label = labels.getOrDefault(neighbor, neighbor);
                    double score = Math.max(0.01d, safeDouble(weight));
                    labelScores.put(label, safeDouble(labelScores.get(label)) + score);
                });
                String selected = labelScores.entrySet().stream()
                        .sorted(Comparator
                                .comparingDouble((Map.Entry<String, Double> entry) -> safeDouble(entry.getValue()))
                                .reversed()
                                .thenComparing(Map.Entry::getKey))
                        .map(Map.Entry::getKey)
                        .findFirst()
                        .orElse(labels.get(node));
                if (!Objects.equals(labels.get(node), selected)) {
                    labels.put(node, selected);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
        return labels;
    }

    private Map<String, Long> communitySizes(Map<String, String> communitiesByNode) {
        Map<String, Long> raw = new LinkedHashMap<>();
        communitiesByNode.values().forEach(label -> raw.put(label, raw.getOrDefault(label, 0L) + 1L));
        Map<String, Long> result = new LinkedHashMap<>();
        int index = 1;
        for (Long size : raw.values().stream().sorted(Comparator.reverseOrder()).toList()) {
            result.put("Community " + index, size);
            index++;
        }
        return result;
    }

    private Map<String, Double> localClustering(Map<String, Map<String, Double>> graph) {
        Set<String> edgeKeys = new HashSet<>();
        graph.forEach((left, neighbors) -> neighbors.keySet().forEach(right -> edgeKeys.add(pairKey(left, right))));
        Map<String, Double> result = new LinkedHashMap<>();
        graph.forEach((node, neighbors) -> {
            List<String> list = new ArrayList<>(neighbors.keySet());
            int degree = list.size();
            if (degree < 2) {
                result.put(node, 0d);
                return;
            }
            int possible = degree * (degree - 1) / 2;
            int linked = 0;
            for (int i = 0; i < list.size(); i++) {
                for (int j = i + 1; j < list.size(); j++) {
                    if (edgeKeys.contains(pairKey(list.get(i), list.get(j)))) {
                        linked++;
                    }
                }
            }
            result.put(node, possible == 0 ? 0d : (double) linked / possible);
        });
        return result;
    }

    private Map<String, Long> bridgeUsers(
            Map<String, Map<String, Double>> graph,
            Map<String, String> communitiesByNode,
            Map<String, Double> localClustering,
            Map<String, String> userNamesById) {
        Map<String, Long> scores = new LinkedHashMap<>();
        graph.forEach((node, neighbors) -> {
            Set<String> neighborCommunities = new LinkedHashSet<>();
            double weightedDegree = 0d;
            for (Map.Entry<String, Double> entry : neighbors.entrySet()) {
                neighborCommunities.add(communitiesByNode.getOrDefault(entry.getKey(), entry.getKey()));
                weightedDegree += Math.max(0d, entry.getValue());
            }
            if (neighborCommunities.size() < 2) {
                return;
            }
            double clusteringPenalty = localClustering.getOrDefault(node, 0d) * 22d;
            long score = Math.max(1L, Math.round((neighborCommunities.size() - 1) * 34d + neighbors.size() * 4d + weightedDegree * 10d - clusteringPenalty));
            scores.put(firstNonBlank(userNamesById.get(node), node), score);
        });
        return scores.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()).thenComparing(Map.Entry::getKey))
                .limit(8)
                .collect(LinkedHashMap::new, (target, entry) -> target.put(entry.getKey(), entry.getValue()), Map::putAll);
    }

    private long reachabilityTwoHopPct(Map<String, Map<String, Double>> graph) {
        if (graph.size() <= 1) {
            return 0L;
        }
        List<String> nodes = graph.keySet().stream().limit(REACHABILITY_NODE_LIMIT).toList();
        double total = 0d;
        for (String node : nodes) {
            Set<String> reached = new LinkedHashSet<>();
            ArrayDeque<String> queue = new ArrayDeque<>();
            Map<String, Integer> distance = new LinkedHashMap<>();
            queue.add(node);
            distance.put(node, 0);
            while (!queue.isEmpty()) {
                String current = queue.removeFirst();
                int currentDistance = distance.getOrDefault(current, 0);
                if (currentDistance >= 2) {
                    continue;
                }
                for (String neighbor : graph.getOrDefault(current, Map.of()).keySet()) {
                    if (distance.containsKey(neighbor)) {
                        continue;
                    }
                    distance.put(neighbor, currentDistance + 1);
                    reached.add(neighbor);
                    queue.addLast(neighbor);
                }
            }
            total += reached.size() / (double) Math.max(1, graph.size() - 1);
        }
        return Math.round((total / Math.max(1, nodes.size())) * 100d);
    }

    private Map<String, Map<String, Long>> dailyGraphActivity(List<GraphEdge> edges, int bridgeUserCount, int communityCount, long clusterQualityPct) {
        Map<String, Map<String, Long>> result = new LinkedHashMap<>();
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        for (int index = 0; index < TIMELINE_DAYS; index++) {
            LocalDate day = today.minusDays(TIMELINE_DAYS - 1L - index);
            Instant start = day.atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant end = day.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant activeThreshold = start.minusSeconds(30L * 24L * 60L * 60L);
            long activeEdges = 0L;
            long newEdges = 0L;
            long recurringEdges = 0L;
            long weakTies = 0L;
            double activeWeightTotal = 0d;
            for (GraphEdge edge : edges) {
                Instant firstSeen = parseInstant(edge.firstSeenAtIso());
                Instant lastSeen = parseInstant(edge.lastSeenAtIso());
                if (firstSeen != null && !firstSeen.isBefore(start) && firstSeen.isBefore(end)) {
                    newEdges++;
                }
                if (lastSeen != null && !lastSeen.isBefore(activeThreshold) && lastSeen.isBefore(end)) {
                    activeEdges++;
                    activeWeightTotal += clamp(edge.weight(), 0d, 1d);
                    if (edge.weakTie()) {
                        weakTies++;
                    }
                }
                if (edge.recurring() && lastSeen != null && !lastSeen.isBefore(start) && lastSeen.isBefore(end)) {
                    recurringEdges++;
                }
            }
            Map<String, Long> values = new LinkedHashMap<>();
            values.put("activeEdges", activeEdges);
            values.put("newEdges", newEdges);
            values.put("recurringEdges", recurringEdges);
            values.put("weakTies", weakTies);
            values.put("bridgeUsers", (long) bridgeUserCount);
            values.put("communities", (long) communityCount);
            values.put("networkQuality", activeEdges == 0L ? 0L : Math.round((activeWeightTotal / activeEdges) * 100d));
            values.put("clusterQuality", clusterQualityPct);
            result.put(day.format(DateTimeFormatter.ISO_LOCAL_DATE), values);
        }
        return result;
    }

    private long networkQualityPct(List<GraphEdge> edges) {
        if (edges == null || edges.isEmpty()) {
            return 0L;
        }
        return Math.max(0L, Math.min(100L, Math.round(edges.stream()
                .mapToDouble(edge -> clamp(edge == null ? 0d : edge.weight(), 0d, 1d))
                .average()
                .orElse(0d) * 100d)));
    }

    private long clusterQualityPct(long clusteringPct, long largestCommunityPct, int communityCount, long nodeCount) {
        if (nodeCount <= 1L) {
            return 0L;
        }
        double clusteringBalance = 100d - Math.abs(clusteringPct - 38d) * 2.2d;
        double largestCommunityBalance = 100d - Math.max(0d, largestCommunityPct - 40d) * 1.7d;
        double communityCoverage = Math.min(100d, communityCount * 100d / Math.max(1d, nodeCount / 7d));
        return Math.round(clamp(clusteringBalance, 0d, 100d) * 0.45d
                + clamp(largestCommunityBalance, 0d, 100d) * 0.35d
                + clamp(communityCoverage, 0d, 100d) * 0.20d);
    }

    private Map<String, Long> genderRatingAverages(Map<String, String> userGendersById) {
        Map<String, Double> sums = new LinkedHashMap<>();
        Map<String, Long> counts = new LinkedHashMap<>();
        for (UserRate rate : userRatesRepository.findAll()) {
            if (rate == null) {
                continue;
            }
            String owner = normalizeId(rate.getOwnerUserId());
            String related = normalizeId(rate.getRelatedUserId());
            addGenderRate(sums, counts, userGendersById.get(owner), userGendersById.get(related), rate.getScoreGiven());
            addGenderRate(sums, counts, userGendersById.get(related), userGendersById.get(owner), rate.getScoreReceived());
        }
        Map<String, Long> result = new LinkedHashMap<>();
        result.put("female-to-male-avg-tenths", averageTenths(sums, counts, "female-to-male"));
        result.put("male-to-female-avg-tenths", averageTenths(sums, counts, "male-to-female"));
        result.put("female-to-female-avg-tenths", averageTenths(sums, counts, "female-to-female"));
        result.put("male-to-male-avg-tenths", averageTenths(sums, counts, "male-to-male"));
        return result;
    }

    private void addGenderRate(Map<String, Double> sums, Map<String, Long> counts, String fromGender, String toGender, Double score) {
        String from = normalizeGender(fromGender);
        String to = normalizeGender(toGender);
        double safeScore = score == null || !Double.isFinite(score) ? 0d : score;
        if (!StringUtils.hasText(from) || !StringUtils.hasText(to) || safeScore <= 0) {
            return;
        }
        String key = from + "-to-" + to;
        sums.put(key, sums.getOrDefault(key, 0d) + safeScore);
        counts.put(key, counts.getOrDefault(key, 0L) + 1L);
    }

    private long averageTenths(Map<String, Double> sums, Map<String, Long> counts, String key) {
        long count = counts.getOrDefault(key, 0L);
        return count == 0L ? 0L : Math.round((sums.getOrDefault(key, 0d) * 10d) / count);
    }

    private int graphHealth(long reachabilityPct, long weakTieRatio, long clusteringPct, long recurringRatio) {
        double weakTieHealth = 100d - Math.abs(weakTieRatio - 35d) * 2.1d;
        double clusteringHealth = 100d - Math.abs(clusteringPct - 38d) * 2.2d;
        double recurringHealth = Math.min(100d, recurringRatio * 2.2d);
        double score = reachabilityPct * 0.36d
                + clamp(weakTieHealth, 0d, 100d) * 0.24d
                + clamp(clusteringHealth, 0d, 100d) * 0.22d
                + recurringHealth * 0.18d;
        return (int) Math.max(20, Math.min(100, Math.round(score)));
    }

    private String insightKey(long reachabilityPct, long weakTieRatio, long clusteringPct, int bridgeUserCount, long nodeCount) {
        if (nodeCount < 8) {
            return "stats.graph.insight.cold";
        }
        if (reachabilityPct < 45) {
            return "stats.graph.insight.fragmented";
        }
        if (weakTieRatio < 20) {
            return "stats.graph.insight.closed";
        }
        if (clusteringPct > 68) {
            return "stats.graph.insight.cliques";
        }
        if (bridgeUserCount < Math.max(2, nodeCount / 18)) {
            return "stats.graph.insight.bridge-risk";
        }
        return "stats.graph.insight.healthy";
    }

    private Map<String, String> userNamesById(List<Users> users) {
        Map<String, String> result = new LinkedHashMap<>();
        for (Users user : users) {
            if (user == null) {
                continue;
            }
            String userId = normalizeId(user.getId());
            if (StringUtils.hasText(userId)) {
                result.put(userId, firstNonBlank(user.getName(), userId));
            }
        }
        return result;
    }

    private Map<String, String> userGendersById(List<Users> users) {
        Map<String, String> result = new LinkedHashMap<>();
        for (Users user : users) {
            if (user == null) {
                continue;
            }
            String userId = normalizeId(user.getId());
            String gender = normalizeGender(user.getGender());
            if (StringUtils.hasText(userId) && StringUtils.hasText(gender)) {
                result.put(userId, gender);
            }
        }
        return result;
    }

    private boolean validPair(String left, String right) {
        return StringUtils.hasText(left) && StringUtils.hasText(right) && !left.equals(right);
    }

    private String pairKey(String left, String right) {
        String normalizedLeft = normalizeId(left);
        String normalizedRight = normalizeId(right);
        return normalizedLeft.compareTo(normalizedRight) <= 0
                ? normalizedLeft + ":" + normalizedRight
                : normalizedRight + ":" + normalizedLeft;
    }

    private long pct(long value, long total) {
        return Math.max(0L, Math.min(100L, Math.round((value * 100d) / Math.max(1L, total))));
    }

    private int safeInt(Integer value) {
        return value == null ? 0 : Math.max(0, value.intValue());
    }

    private double safeDouble(Double value) {
        return value == null || !Double.isFinite(value.doubleValue()) ? 0d : value.doubleValue();
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeKey(String value) {
        return normalizeId(value).toLowerCase(Locale.ROOT);
    }

    private String normalizeGender(String value) {
        String normalized = normalizeKey(value);
        if ("woman".equals(normalized) || "female".equals(normalized) || "no".equals(normalized) || "nő".equals(normalized)) {
            return "female";
        }
        if ("man".equals(normalized) || "male".equals(normalized) || "ferfi".equals(normalized) || "férfi".equals(normalized)) {
            return "male";
        }
        return "";
    }

    private String firstNonBlank(String value, String fallback) {
        String normalized = normalizeId(value);
        return StringUtils.hasText(normalized) ? normalized : normalizeId(fallback);
    }

    private String latest(String leftIso, String rightIso) {
        Instant left = parseInstant(leftIso);
        Instant right = parseInstant(rightIso);
        if (left == null) {
            return normalizeId(rightIso);
        }
        if (right == null) {
            return normalizeId(leftIso);
        }
        return left.isAfter(right) ? normalizeId(leftIso) : normalizeId(rightIso);
    }

    private Instant parseInstant(String value) {
        try {
            return Instant.parse(normalizeId(value));
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private record GraphScienceResult(
            int healthScore,
            String healthLabelKey,
            String insightKey,
            Map<String, Long> metrics,
            Map<String, Long> bridgeUsers,
            Map<String, Long> communities,
            Map<String, Long> signals,
            Map<String, Map<String, Long>> dailyGraphActivity) {}

    private static final class GraphEdge {
        private final String left;
        private final String right;
        private double weight;
        private int evidenceCount;
        private boolean weakTie;
        private boolean recurring;
        private String firstSeenAtIso = "";
        private String lastSeenAtIso = "";

        private GraphEdge(String left, String right) {
            this.left = left;
            this.right = right;
        }

        private void add(double nextWeight, int nextEvidenceCount, boolean nextWeakTie, boolean nextRecurring, String seenAtIso) {
            this.weight = Math.max(this.weight, nextWeight);
            this.evidenceCount += Math.max(1, nextEvidenceCount);
            this.weakTie = this.weakTie || nextWeakTie;
            this.recurring = this.recurring || nextRecurring || this.evidenceCount > 2;
            if (StringUtils.hasText(seenAtIso)) {
                if (!StringUtils.hasText(this.firstSeenAtIso) || seenAtIso.compareTo(this.firstSeenAtIso) < 0) {
                    this.firstSeenAtIso = seenAtIso;
                }
                if (!StringUtils.hasText(this.lastSeenAtIso) || seenAtIso.compareTo(this.lastSeenAtIso) > 0) {
                    this.lastSeenAtIso = seenAtIso;
                }
            }
        }

        private String left() { return left; }
        private String right() { return right; }
        private double weight() { return weight; }
        private boolean weakTie() { return weakTie; }
        private boolean recurring() { return recurring; }
        private String firstSeenAtIso() { return firstSeenAtIso; }
        private String lastSeenAtIso() { return lastSeenAtIso; }
    }
}
