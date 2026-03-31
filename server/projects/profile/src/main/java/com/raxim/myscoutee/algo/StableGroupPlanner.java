package com.raxim.myscoutee.algo;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.util.StringUtils;

import com.raxim.myscoutee.algo.dto.Edge;
import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Node;
import com.raxim.myscoutee.algo.dto.Range;

public class StableGroupPlanner {
    private record CandidateScore(String userId, double score) {}

/**
     * Post-processing step: Applies the local search (Swap Check) 
     * to maximize global affinity across all generated groups.
     */
    private List<Set<Node>> refineGroups(GraphSnapshot snapshot, List<Set<Node>> rawGroups, Set<String> lockedUserIds) {
        List<Set<String>> stringGroups = rawGroups.stream()
                .map(group -> group.stream().map(Node::getId).collect(Collectors.toSet()))
                .toList();

        boolean improved = true;
        int maxPasses = 5;
        int passes = 0;

        while (improved && passes < maxPasses) {
            improved = false;
            passes++;
            for (int i = 0; i < stringGroups.size(); i++) {
                for (int j = i + 1; j < stringGroups.size(); j++) {
                    if (optimizeBySwapping(snapshot, stringGroups.get(i), stringGroups.get(j), lockedUserIds)) {
                        improved = true;
                    }
                }
            }
        }

        return stringGroups.stream()
                .map(groupIds -> (Set<Node>)groupIds.stream()
                        .map(snapshot::node)
                        .collect(Collectors.toCollection(LinkedHashSet::new)))
                .toList();
    }

    private boolean optimizeBySwapping(GraphSnapshot snapshot, Set<String> groupA, Set<String> groupB, Set<String> lockedUserIds) {
        double bestGain = 0d;
        String bestSwapA = null;
        String bestSwapB = null;

        for (String userA : groupA) {
            if (lockedUserIds.contains(userA)) continue;

            for (String userB : groupB) {
                if (lockedUserIds.contains(userB)) continue;
                if (!isSafelySwappable(snapshot, userA, userB)) continue;

                double weightLossA = calculateUserWeightInGroup(snapshot, userA, groupA);
                // FIXED: using snapshot.weight()
                double weightGainA = calculateUserWeightInGroup(snapshot, userB, groupA) - snapshot.weight(userA, userB);

                double weightLossB = calculateUserWeightInGroup(snapshot, userB, groupB);
                // FIXED: using snapshot.weight()
                double weightGainB = calculateUserWeightInGroup(snapshot, userA, groupB) - snapshot.weight(userB, userA);

                double totalGain = (weightGainA - weightLossA) + (weightGainB - weightLossB);

                if (totalGain > bestGain) {
                    bestGain = totalGain;
                    bestSwapA = userA;
                    bestSwapB = userB;
                }
            }
        }

        if (bestSwapA != null && bestSwapB != null) {
            groupA.remove(bestSwapA);
            groupA.add(bestSwapB);
            groupB.remove(bestSwapB);
            groupB.add(bestSwapA);
            return true;
        }
        return false;
    }

    private double calculateUserWeightInGroup(GraphSnapshot snapshot, String userId, Set<String> groupUserIds) {
        double weight = 0d;
        for (String memberId : groupUserIds) {
            if (!memberId.equals(userId)) {
                // FIXED: using snapshot.weight()
                weight += snapshot.weight(userId, memberId);
            }
        }
        return weight;
    }

    private boolean isSafelySwappable(GraphSnapshot snapshot, String userA, String userB) {
        // FIXED: Using snapshot's built-in typeOf method which safely handles nulls
        String typeA = snapshot.typeOf(userA);
        String typeB = snapshot.typeOf(userB);
        return typeA.equals(typeB);
    }
    
    public List<Set<Node>> planGroups(FGraph graph, List<String> types, Range range, boolean hasAny) {
        GraphSnapshot snapshot = GraphSnapshot.from(graph, 0d);
        if (snapshot.isEmpty() || range == null) {
            return List.of();
        }

        List<String> normalizedTypes = normalizeTypes(types);
        Set<String> eligibleUserIds = filterEligibleUserIds(snapshot.nodeIds(), snapshot, normalizedTypes);
        if (eligibleUserIds.isEmpty()) {
            return List.of();
        }

        List<Set<String>> components = snapshot.connectedComponents(eligibleUserIds);
        
        // Sorting is still fine here, but less critical when executing in parallel
        components.sort(Comparator
                .<Set<String>>comparingInt(Set::size).reversed()
                .thenComparing(Comparator.comparingDouble(snapshot::componentWeight).reversed())
                .thenComparing(this::firstId));

        // --- OPTIMIZATION: Process disconnected graph components concurrently ---
        List<Set<Node>> initialGroups = components.parallelStream()
                .flatMap(component -> {
                    List<Set<Node>> localGroups = new ArrayList<>();
                    Set<String> remainingUserIds = new HashSet<>(component); // Standard HashSet!
                    
                    while (!remainingUserIds.isEmpty()) {
                        int targetSize = resolveGroupTargetSize(snapshot, remainingUserIds, range, hasAny, normalizedTypes);
                        if (targetSize == 0) break;

                        List<String> selectedUserIds = buildGroup(snapshot, remainingUserIds, Set.of(), targetSize, normalizedTypes, false);
                        int minimumGroupSize = minimumRandomGroupSize(range, normalizedTypes);
                        
                        if (selectedUserIds.isEmpty()) break;
                        if (!hasAny && selectedUserIds.size() < minimumGroupSize) break;

                        selectedUserIds.forEach(remainingUserIds::remove);
                        
                        Set<Node> group = selectedUserIds.stream()
                                .map(snapshot::node)
                                .collect(Collectors.toCollection(LinkedHashSet::new));
                                
                        if (!group.isEmpty()) {
                            localGroups.add(group);
                        }
                    }
                    // Stream the resulting groups back to the flatMap to combine them thread-safely
                    return localGroups.stream(); 
                })
                .collect(Collectors.toList());

        // Run the swap check on the fully assembled groups
        return refineGroups(snapshot, initialGroups, Set.of());
    }

    public List<Set<Node>> planGroups(FGraph graph, List<String> types, List<Range> ranges, boolean hasAny) {
        GraphSnapshot snapshot = GraphSnapshot.from(graph, 0d);
        if (snapshot.isEmpty() || ranges == null || ranges.isEmpty()) {
            return List.of();
        }

        List<String> normalizedTypes = normalizeTypes(types);
        Set<String> eligibleUserIds = filterEligibleUserIds(snapshot.nodeIds(), snapshot, normalizedTypes);
        if (eligibleUserIds.isEmpty()) {
            return List.of();
        }

        List<Range> normalizedRanges = normalizeRanges(ranges);
        if (normalizedRanges.isEmpty() || !canSatisfyRemainingRanges(eligibleUserIds.size(), normalizedRanges, normalizedTypes, hasAny)) {
            return List.of();
        }

List<List<String>> plannedGroups = planTargetedGroups(snapshot, eligibleUserIds, normalizedRanges, normalizedTypes, hasAny, 0);
        if (plannedGroups == null) {
            return List.of();
        }
        
        // CLEANUP: Streamlined mapping
        List<Set<Node>> initialGroups = plannedGroups.stream()
                .map(group -> (Set<Node>)group.stream()
                        .map(snapshot::node)
                        .collect(Collectors.toCollection(LinkedHashSet::new)))
                .toList();

        // Run the swap check on the fully assembled groups
        return refineGroups(snapshot, initialGroups, Set.of());
    }

    public Set<Node> planInviteBatch(
            FGraph graph,
            Set<String> candidateUserIds,
            Set<String> lockedUserIds,
            Range range,
            List<String> types,
            boolean hasAny,
            double minWeight) {
        GraphSnapshot snapshot = GraphSnapshot.from(graph, minWeight);
        if (snapshot.isEmpty() || range == null) {
            return Set.of();
        }

        List<String> normalizedTypes = normalizeTypes(types);
        Set<String> eligibleCandidates = filterEligibleUserIds(normalizeUserIds(candidateUserIds), snapshot, normalizedTypes);
        Set<String> anchors = normalizeUserIds(lockedUserIds);
        anchors.retainAll(snapshot.nodeIds());
        if (eligibleCandidates.isEmpty()) {
            return Set.of();
        }

        int targetSize = resolveInviteTargetSize(snapshot, eligibleCandidates, range, hasAny, normalizedTypes);
        if (targetSize == 0) {
            return Set.of();
        }

        List<String> selectedUserIds = buildGroup(snapshot, eligibleCandidates, anchors, targetSize, normalizedTypes, !anchors.isEmpty());
        int minimumSize = minimumInviteSize(range, normalizedTypes);
        if (!hasAny && selectedUserIds.size() < minimumSize) {
            return Set.of();
        }
        if (hasAny && selectedUserIds.isEmpty()) {
            return Set.of();
        }

        return selectedUserIds.stream()
                .map(snapshot::node)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private List<String> buildGroup(
            GraphSnapshot snapshot,
            Set<String> poolUserIds,
            Set<String> anchorUserIds,
            int targetSize,
            List<String> types,
            boolean requireAnchorForSeed) {
        if (poolUserIds.isEmpty() || targetSize <= 0) {
            return List.of();
        }

        Map<String, Integer> typeTargets = resolveTypeTargets(snapshot, poolUserIds, targetSize, types);
        if (!types.isEmpty() && typeTargets.isEmpty()) {
            return List.of();
        }

        // Changed LinkedHashSet to standard HashSet for better performance
        Set<String> availableUserIds = new HashSet<>(poolUserIds); 
        List<String> selectedUserIds = new ArrayList<>();

        // --- OPTIMIZATION: Precompute scores to avoid O(N^2) recalculations ---
        Map<String, Double> anchorWeights = new HashMap<>();
        Map<String, Double> poolDegrees = new HashMap<>();
        Map<String, Double> selectedWeights = new HashMap<>();

        for (String candidate : availableUserIds) {
            anchorWeights.put(candidate, snapshot.totalWeight(candidate, anchorUserIds));
            poolDegrees.put(candidate, snapshot.degree(candidate, poolUserIds));
            selectedWeights.put(candidate, 0d); // Initially 0
        }

        while (selectedUserIds.size() < targetSize && !availableUserIds.isEmpty()) {
            List<String> candidates = availableUserIds.stream()
                    .filter(candidateUserId -> fitsTypeQuota(snapshot, candidateUserId, selectedUserIds, typeTargets))
                    .toList();
            
            if (candidates.isEmpty()) {
                break;
            }

            String nextUserId = selectedUserIds.isEmpty()
                    ? chooseSeedOptimized(candidates, anchorWeights, poolDegrees, anchorUserIds.isEmpty(), requireAnchorForSeed)
                    : chooseNextOptimized(candidates, anchorWeights, selectedWeights, poolDegrees);

            if (!StringUtils.hasText(nextUserId)) {
                break;
            }

            selectedUserIds.add(nextUserId);
            availableUserIds.remove(nextUserId);

            // --- OPTIMIZATION: Incrementally update selectedWeights for remaining candidates only ---
            for (String remainingUserId : availableUserIds) {
                double edgeWeight = snapshot.weight(nextUserId, remainingUserId);
                if (edgeWeight > 0d) {
                    // CLEANUP: Use an explicit lambda to avoid the unboxing warning
                    selectedWeights.merge(remainingUserId, edgeWeight, (oldVal, newVal) -> oldVal + newVal);
                }
            }
        }
        return selectedUserIds;
    }

    private String chooseSeedOptimized(
            List<String> candidateUserIds,
            Map<String, Double> anchorWeights,
            Map<String, Double> poolDegrees,
            boolean noAnchors,
            boolean requireAnchorForSeed) {
        
        String bestUserId = null;
        double bestScore = Double.NEGATIVE_INFINITY;

        for (String candidateUserId : candidateUserIds) {
            double anchorWeight = anchorWeights.get(candidateUserId);
            double degree = poolDegrees.get(candidateUserId);

            if (requireAnchorForSeed && anchorWeight <= 0d) continue;
            if (!requireAnchorForSeed && degree <= 0d) continue;

            double score = noAnchors ? degree : (anchorWeight * 100d + degree);
            
            if (bestUserId == null || score > bestScore || (score == bestScore && candidateUserId.compareTo(bestUserId) < 0)) {
                bestUserId = candidateUserId;
                bestScore = score;
            }
        }
        return bestUserId;
    }

    private String chooseNextOptimized(
            List<String> candidateUserIds,
            Map<String, Double> anchorWeights,
            Map<String, Double> selectedWeights,
            Map<String, Double> poolDegrees) {
        
        // --- OPTIMIZATION: Adaptive Parallelism Threshold ---
        // If the pool is small, sequential is faster. If it's huge, go parallel.
        // (You can tune this threshold number based on your server's CPU benchmarks)
        if (candidateUserIds.size() < 1000) {
            return chooseNextSequential(candidateUserIds, anchorWeights, selectedWeights, poolDegrees);
        }

        // --- PARALLEL PATH ---
        return candidateUserIds.parallelStream()
                .map(candidateUserId -> {
                    double anchorWeight = anchorWeights.getOrDefault(candidateUserId, 0d);
                    double selectedWeight = selectedWeights.getOrDefault(candidateUserId, 0d);
                    
                    if (anchorWeight <= 0d && selectedWeight <= 0d) {
                        return new CandidateScore(candidateUserId, Double.NEGATIVE_INFINITY);
                    }

                    double degree = poolDegrees.getOrDefault(candidateUserId, 0d);
                    double score = anchorWeight * 100d + selectedWeight * 10d + degree;
                    
                    return new CandidateScore(candidateUserId, score);
                })
                .filter(cs -> cs.score() > Double.NEGATIVE_INFINITY)
                .reduce((c1, c2) -> {
                    // Tie-breaking logic (Highest score wins, alphabetical if tied)
                    if (c1.score() > c2.score()) return c1;
                    if (c2.score() > c1.score()) return c2;
                    return c1.userId().compareTo(c2.userId()) < 0 ? c1 : c2;
                })
                .map(CandidateScore::userId)
                .orElse(null);
    }

    // --- SEQUENTIAL PATH (Your previously optimized logic) ---
    private String chooseNextSequential(
            List<String> candidateUserIds,
            Map<String, Double> anchorWeights,
            Map<String, Double> selectedWeights,
            Map<String, Double> poolDegrees) {
        
        String bestUserId = null;
        double bestScore = Double.NEGATIVE_INFINITY;

        for (String candidateUserId : candidateUserIds) {
            double anchorWeight = anchorWeights.getOrDefault(candidateUserId, 0d);
            double selectedWeight = selectedWeights.getOrDefault(candidateUserId, 0d);
            
            if (anchorWeight <= 0d && selectedWeight <= 0d) continue;

            double degree = poolDegrees.getOrDefault(candidateUserId, 0d);
            double score = anchorWeight * 100d + selectedWeight * 10d + degree;
            
            if (bestUserId == null || score > bestScore || (score == bestScore && candidateUserId.compareTo(bestUserId) < 0)) {
                bestUserId = candidateUserId;
                bestScore = score;
            }
        }
        return bestUserId;
    }

    private int resolveGroupTargetSize(GraphSnapshot snapshot, Set<String> availableUserIds, Range range, boolean hasAny, List<String> types) {
        int maximumSize = Math.min(availableUserIds.size(), Math.max(0, range.getMax()));
        int minimumSize = minimumRandomGroupSize(range, types);
        int bestSize = 0;
        int bestScore = Integer.MIN_VALUE;
        for (int size = maximumSize; size >= 1; size -= 1) {
            if (!hasAny && size < minimumSize) {
                continue;
            }
            if (!types.isEmpty() && resolveTypeTargets(snapshot, availableUserIds, size, types).isEmpty()) {
                continue;
            }
            int score = size;
            int remainder = availableUserIds.size() - size;
            if (remainder == 0 || remainder >= minimumSize || hasAny && remainder > 0) {
                score += 1_000;
            }
            if (score > bestScore) {
                bestSize = size;
                bestScore = score;
            }
        }
        return bestSize;
    }

    private List<List<String>> planTargetedGroups(
            GraphSnapshot snapshot,
            Set<String> remainingUserIds,
            List<Range> ranges,
            List<String> types,
            boolean hasAny,
            int index) {
        
        if (index >= ranges.size()) {
            return remainingUserIds.isEmpty() ? new ArrayList<>() : null;
        }

        Range range = ranges.get(index);
        List<Range> remainingRanges = ranges.subList(index + 1, ranges.size());
        
        for (List<String> candidateGroup : enumerateTargetedGroups(snapshot, remainingUserIds, range, remainingRanges, types, hasAny)) {
            
            // MEMORY OPTIMIZATION: Use standard HashSet instead of LinkedHashSet inside heavy recursion loops
            Set<String> nextRemainingUserIds = new HashSet<>(remainingUserIds); 
            candidateGroup.forEach(nextRemainingUserIds::remove);

            List<List<String>> remainingGroups = planTargetedGroups(snapshot, nextRemainingUserIds, ranges, types, hasAny, index + 1);
            if (remainingGroups != null) {
                List<List<String>> plannedGroups = new ArrayList<>();
                plannedGroups.add(candidateGroup);
                plannedGroups.addAll(remainingGroups);
                return plannedGroups;
            }
        }
        return null;
    }

    private List<List<String>> enumerateTargetedGroups(
            GraphSnapshot snapshot,
            Set<String> remainingUserIds,
            Range range,
            List<Range> remainingRanges,
            List<String> types,
            boolean hasAny) {
            
        List<Set<String>> components = snapshot.connectedComponents(remainingUserIds);
        components.sort(Comparator
                .<Set<String>>comparingInt(Set::size)
                .thenComparing(Comparator.comparingDouble(snapshot::componentWeight).reversed())
                .thenComparing(this::firstId));

        int minimumSize = minimumRandomGroupSize(range, types);
        
        // THREAD SAFETY: A concurrent set allows multiple threads to safely deduplicate keys
        Set<String> seenGroupKeys = ConcurrentHashMap.newKeySet();

        // --- OPTIMIZATION: Parallelize Candidate Generation ---
        return components.parallelStream()
                .flatMap(component -> {
                    List<List<String>> localCandidates = new ArrayList<>();
                    int maximumSize = Math.min(component.size(), Math.max(0, range.getMax()));
                    
                    for (int size = maximumSize; size >= 1; size -= 1) {
                        if (!hasAny && size < minimumSize) continue;
                        if (!types.isEmpty() && resolveTypeTargets(snapshot, component, size, types).isEmpty()) continue;
                        if (!canSatisfyRemainingRanges(remainingUserIds.size() - size, remainingRanges, types, hasAny)) continue;

                        List<String> selectedUserIds = buildGroup(snapshot, component, Set.of(), size, types, false);
                        
                        if (selectedUserIds.isEmpty()) continue;
                        if (!hasAny && selectedUserIds.size() < minimumSize) continue;

                        String groupKey = String.join("|", selectedUserIds);
                        
                        // Thread-safe addition and presence check
                        if (seenGroupKeys.add(groupKey)) {
                            localCandidates.add(selectedUserIds);
                        }
                    }
                    return localCandidates.stream();
                })
                .toList();
    }

    private boolean canSatisfyRemainingRanges(int remainingUserCount, List<Range> remainingRanges, List<String> types, boolean hasAny) {
        if (remainingRanges == null || remainingRanges.isEmpty()) {
            return remainingUserCount == 0;
        }

        int minimumPossible = 0;
        int maximumPossible = 0;
        for (Range range : remainingRanges) {
            if (range == null) {
                continue;
            }
            minimumPossible += hasAny ? 0 : minimumRandomGroupSize(range, types);
            maximumPossible += Math.max(0, range.getMax());
        }
        return remainingUserCount >= minimumPossible && remainingUserCount <= maximumPossible;
    }

    private int resolveInviteTargetSize(GraphSnapshot snapshot, Set<String> availableUserIds, Range range, boolean hasAny, List<String> types) {
        int maximumSize = Math.min(availableUserIds.size(), Math.max(0, range.getMax()));
        int minimumSize = minimumInviteSize(range, types);
        for (int size = maximumSize; size >= 1; size -= 1) {
            if (!hasAny && size < minimumSize) {
                continue;
            }
            if (!types.isEmpty() && resolveTypeTargets(snapshot, availableUserIds, size, types).isEmpty()) {
                continue;
            }
            return size;
        }
        return 0;
    }

    private int minimumRandomGroupSize(Range range, List<String> types) {
        int minimumSize = range == null ? 0 : Math.max(0, range.getMin());
        if (!types.isEmpty()) {
            minimumSize = Math.max(minimumSize, types.size());
        }
        return Math.max(2, minimumSize);
    }

    private int minimumInviteSize(Range range, List<String> types) {
        int minimumSize = range == null ? 0 : Math.max(0, range.getMin());
        if (!types.isEmpty()) {
            minimumSize = Math.max(minimumSize, 1);
        }
        return Math.max(1, minimumSize);
    }

    private Map<String, Integer> resolveTypeTargets(GraphSnapshot snapshot, Set<String> poolUserIds, int targetSize, List<String> types) {
        if (types.isEmpty()) {
            return Map.of();
        }

        Map<String, Integer> availableCounts = new LinkedHashMap<>();
        Map<String, Integer> targetCounts = new LinkedHashMap<>();
        for (String type : types) {
            availableCounts.put(type, 0);
            targetCounts.put(type, 0);
        }
        for (String userId : poolUserIds) {
            String type = snapshot.typeOf(userId);
            if (availableCounts.containsKey(type)) {
                availableCounts.put(type, availableCounts.get(type) + 1);
            }
        }

        int assigned = 0;
        while (assigned < targetSize) {
            boolean progressed = false;
            for (String type : types) {
                if (targetCounts.get(type) < availableCounts.get(type)) {
                    targetCounts.put(type, targetCounts.get(type) + 1);
                    assigned += 1;
                    progressed = true;
                    if (assigned == targetSize) {
                        break;
                    }
                }
            }
            if (!progressed) {
                return Map.of();
            }
        }
        return targetCounts;
    }

    private boolean fitsTypeQuota(
            GraphSnapshot snapshot,
            String candidateUserId,
            List<String> selectedUserIds,
            Map<String, Integer> typeTargets) {
        if (typeTargets.isEmpty()) {
            return true;
        }

        String type = snapshot.typeOf(candidateUserId);
        if (!typeTargets.containsKey(type)) {
            return false;
        }
        int selectedCountForType = 0;
        for (String selectedUserId : selectedUserIds) {
            if (type.equals(snapshot.typeOf(selectedUserId))) {
                selectedCountForType += 1;
            }
        }
        return selectedCountForType < typeTargets.get(type);
    }

    private Set<String> normalizeUserIds(Set<String> userIds) {
        Set<String> normalized = new LinkedHashSet<>();
        if (userIds == null) {
            return normalized;
        }
        for (String userId : userIds) {
            if (StringUtils.hasText(userId)) {
                normalized.add(userId.trim());
            }
        }
        return normalized;
    }

    private Set<String> filterEligibleUserIds(Set<String> userIds, GraphSnapshot snapshot, List<String> types) {
        Set<String> eligible = new LinkedHashSet<>();
        for (String userId : userIds) {
            if (!snapshot.contains(userId)) {
                continue;
            }
            if (!types.isEmpty() && !types.contains(snapshot.typeOf(userId))) {
                continue;
            }
            eligible.add(userId);
        }
        return eligible;
    }

    private List<String> normalizeTypes(List<String> types) {
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        if (types == null) {
            return List.of();
        }
        for (String type : types) {
            if (StringUtils.hasText(type)) {
                normalized.add(type.trim());
            }
        }
        return List.copyOf(normalized);
    }

    private List<Range> normalizeRanges(List<Range> ranges) {
        List<Range> normalized = new ArrayList<>();
        for (Range range : ranges == null ? List.<Range>of() : ranges) {
            if (range == null) {
                continue;
            }
            int min = Math.max(0, range.getMin());
            int max = Math.max(min, range.getMax());
            normalized.add(Range.of(min, max));
        }
        return normalized;
    }

    private String firstId(Set<String> userIds) {
        return userIds.stream().sorted().findFirst().orElse("");
    }

    private static final class GraphSnapshot {
        private final Map<String, Node> nodesById;
        private final Map<String, Map<String, Double>> weightsByUserId;

        private GraphSnapshot(Map<String, Node> nodesById, Map<String, Map<String, Double>> weightsByUserId) {
            this.nodesById = nodesById;
            this.weightsByUserId = weightsByUserId;
        }

        static GraphSnapshot from(FGraph graph, double minimumWeight) {
            Map<String, Node> nodesById = new LinkedHashMap<>();
            Map<String, Map<String, Double>> weightsByUserId = new LinkedHashMap<>();
            if (graph == null) {
                return new GraphSnapshot(nodesById, weightsByUserId);
            }

            if (graph.getNodes() != null) {
                graph.getNodes().forEach((userId, node) -> {
                    if (node != null && StringUtils.hasText(node.getId())) {
                        nodesById.put(node.getId(), node);
                    } else if (StringUtils.hasText(userId)) {
                        nodesById.put(userId, new Node(userId));
                    }
                });
            }

            double effectiveMinimumWeight = Math.max(0d, minimumWeight);
            for (Edge edge : graph.getEdges() == null ? List.<Edge>of() : graph.getEdges()) {
                if (edge == null || edge.getFrom() == null || edge.getTo() == null) {
                    continue;
                }
                String fromUserId = edge.getFrom().getId();
                String toUserId = edge.getTo().getId();
                if (!StringUtils.hasText(fromUserId) || !StringUtils.hasText(toUserId) || fromUserId.equals(toUserId)) {
                    continue;
                }

                nodesById.putIfAbsent(fromUserId, edge.getFrom());
                nodesById.putIfAbsent(toUserId, edge.getTo());

                double weight = edge.getWeight();
                if (weight <= 0d || weight + 1e-9 < effectiveMinimumWeight) {
                    continue;
                }

                addWeight(weightsByUserId, fromUserId, toUserId, weight);
                addWeight(weightsByUserId, toUserId, fromUserId, weight);
            }
            return new GraphSnapshot(nodesById, weightsByUserId);
        }

        boolean isEmpty() {
            return nodesById.isEmpty();
        }

        boolean contains(String userId) {
            return nodesById.containsKey(userId);
        }

        Set<String> nodeIds() {
            return new LinkedHashSet<>(nodesById.keySet());
        }

        Node node(String userId) {
            return nodesById.get(userId);
        }

        String typeOf(String userId) {
            Node node = nodesById.get(userId);
            return node == null || !StringUtils.hasText(node.getType()) ? "" : node.getType().trim();
        }

        double weight(String leftUserId, String rightUserId) {
            if (!StringUtils.hasText(leftUserId) || !StringUtils.hasText(rightUserId) || leftUserId.equals(rightUserId)) {
                return 0d;
            }
            return weightsByUserId.getOrDefault(leftUserId, Map.of()).getOrDefault(rightUserId, 0d);
        }

        double totalWeight(String userId, Collection<String> otherUserIds) {
            if (!StringUtils.hasText(userId) || otherUserIds == null || otherUserIds.isEmpty()) {
                return 0d;
            }
            double total = 0d;
            for (String otherUserId : otherUserIds) {
                if (StringUtils.hasText(otherUserId) && !userId.equals(otherUserId)) {
                    total += weight(userId, otherUserId);
                }
            }
            return total;
        }

        double degree(String userId, Collection<String> poolUserIds) {
            return totalWeight(userId, poolUserIds);
        }

        List<Set<String>> connectedComponents(Set<String> candidateUserIds) {
            Set<String> remaining = new HashSet<>(candidateUserIds);
            List<Set<String>> components = new ArrayList<>();
            while (!remaining.isEmpty()) {
                String rootUserId = remaining.iterator().next();
                Deque<String> queue = new ArrayDeque<>();
                Set<String> component = new LinkedHashSet<>();
                queue.add(rootUserId);
                remaining.remove(rootUserId);

                while (!queue.isEmpty()) {
                    String currentUserId = queue.removeFirst();
                    component.add(currentUserId);
                    for (String neighborUserId : weightsByUserId.getOrDefault(currentUserId, Map.of()).keySet()) {
                        if (remaining.remove(neighborUserId)) {
                            queue.addLast(neighborUserId);
                        }
                    }
                }

                if (!component.isEmpty()) {
                    components.add(component);
                }
            }
            return components;
        }

        // In GraphSnapshot
        double componentWeight(Set<String> component) {
            double weight = 0d;
            for (String nodeId : component) {
                Map<String, Double> edges = weightsByUserId.get(nodeId);
                if (edges != null) {
                    for (Map.Entry<String, Double> edge : edges.entrySet()) {
                        if (component.contains(edge.getKey())) {
                            weight += edge.getValue();
                        }
                    }
                }
            }
            // Divide by 2 because each undirected edge is counted twice
            return weight / 2.0; 
        }

        private static void addWeight(Map<String, Map<String, Double>> weightsByUserId, String fromUserId, String toUserId, double weight) {
            Map<String, Double> weights = weightsByUserId.computeIfAbsent(fromUserId, key -> new HashMap<>()); 
    
            // The linter sees explicit object comparison and stops complaining
            weights.merge(toUserId, weight, (oldVal, newVal) -> oldVal > newVal ? oldVal : newVal);
        }
    }
}
