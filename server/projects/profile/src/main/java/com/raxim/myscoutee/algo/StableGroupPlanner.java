package com.raxim.myscoutee.algo;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.util.StringUtils;

import com.raxim.myscoutee.algo.dto.Edge;
import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Node;
import com.raxim.myscoutee.algo.dto.Range;

public class StableGroupPlanner {
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
        components.sort(Comparator
                .<Set<String>>comparingInt(Set::size).reversed()
                .thenComparing(Comparator.comparingDouble(snapshot::componentWeight).reversed())
                .thenComparing(this::firstId));

        List<Set<Node>> groups = new ArrayList<>();
        for (Set<String> component : components) {
            Set<String> remainingUserIds = new LinkedHashSet<>(component);
            while (!remainingUserIds.isEmpty()) {
                int targetSize = resolveGroupTargetSize(snapshot, remainingUserIds, range, hasAny, normalizedTypes);
                if (targetSize == 0) {
                    break;
                }

                List<String> selectedUserIds = buildGroup(snapshot, remainingUserIds, Set.of(), targetSize, normalizedTypes, false);
                int minimumGroupSize = minimumRandomGroupSize(range, normalizedTypes);
                if (selectedUserIds.isEmpty()) {
                    break;
                }
                if (!hasAny && selectedUserIds.size() < minimumGroupSize) {
                    break;
                }

                selectedUserIds.forEach(remainingUserIds::remove);
                Set<Node> group = selectedUserIds.stream()
                        .map(snapshot::node)
                        .collect(LinkedHashSet::new, Set::add, Set::addAll);
                if (!group.isEmpty()) {
                    groups.add(group);
                }
            }
        }
        return groups;
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

        Set<String> availableUserIds = new LinkedHashSet<>(poolUserIds);
        List<String> selectedUserIds = new ArrayList<>();
        while (selectedUserIds.size() < targetSize && !availableUserIds.isEmpty()) {
            List<String> candidates = availableUserIds.stream()
                    .filter(candidateUserId -> fitsTypeQuota(snapshot, candidateUserId, selectedUserIds, typeTargets))
                    .sorted()
                    .toList();
            if (candidates.isEmpty()) {
                break;
            }

            String nextUserId = selectedUserIds.isEmpty()
                    ? chooseSeed(snapshot, candidates, poolUserIds, anchorUserIds, requireAnchorForSeed)
                    : chooseNext(snapshot, candidates, poolUserIds, anchorUserIds, selectedUserIds);
            if (!StringUtils.hasText(nextUserId)) {
                break;
            }

            selectedUserIds.add(nextUserId);
            availableUserIds.remove(nextUserId);
        }
        return selectedUserIds;
    }

    private String chooseSeed(
            GraphSnapshot snapshot,
            List<String> candidateUserIds,
            Set<String> poolUserIds,
            Set<String> anchorUserIds,
            boolean requireAnchorForSeed) {
        String bestUserId = null;
        double bestScore = Double.NEGATIVE_INFINITY;
        for (String candidateUserId : candidateUserIds) {
            double anchorWeight = snapshot.totalWeight(candidateUserId, anchorUserIds);
            double degree = snapshot.degree(candidateUserId, poolUserIds);
            if (requireAnchorForSeed && anchorWeight <= 0d) {
                continue;
            }
            if (!requireAnchorForSeed && degree <= 0d) {
                continue;
            }

            double score = anchorUserIds.isEmpty()
                    ? degree
                    : anchorWeight * 100d + degree;
            if (bestUserId == null
                    || score > bestScore
                    || score == bestScore && candidateUserId.compareTo(bestUserId) < 0) {
                bestUserId = candidateUserId;
                bestScore = score;
            }
        }
        return bestUserId;
    }

    private String chooseNext(
            GraphSnapshot snapshot,
            List<String> candidateUserIds,
            Set<String> poolUserIds,
            Set<String> anchorUserIds,
            List<String> selectedUserIds) {
        String bestUserId = null;
        double bestScore = Double.NEGATIVE_INFINITY;
        for (String candidateUserId : candidateUserIds) {
            double anchorWeight = snapshot.totalWeight(candidateUserId, anchorUserIds);
            double selectedWeight = snapshot.totalWeight(candidateUserId, selectedUserIds);
            if (anchorWeight <= 0d && selectedWeight <= 0d) {
                continue;
            }

            double degree = snapshot.degree(candidateUserId, poolUserIds);
            double score = anchorWeight * 100d + selectedWeight * 10d + degree;
            if (bestUserId == null
                    || score > bestScore
                    || score == bestScore && candidateUserId.compareTo(bestUserId) < 0) {
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
            Set<String> remaining = new LinkedHashSet<>(candidateUserIds);
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

        double componentWeight(Set<String> component) {
            List<String> ids = component.stream().sorted().toList();
            double weight = 0d;
            for (int index = 0; index < ids.size(); index += 1) {
                for (int nestedIndex = index + 1; nestedIndex < ids.size(); nestedIndex += 1) {
                    weight += weight(ids.get(index), ids.get(nestedIndex));
                }
            }
            return weight;
        }

        private static void addWeight(Map<String, Map<String, Double>> weightsByUserId, String fromUserId, String toUserId, double weight) {
            weightsByUserId.computeIfAbsent(fromUserId, key -> new LinkedHashMap<>())
                    .merge(toUserId, weight, Math::max);
        }
    }
}
