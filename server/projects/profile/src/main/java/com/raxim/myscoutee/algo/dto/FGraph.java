package com.raxim.myscoutee.algo.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class FGraph extends Graph {
    private final Set<Node> ignoredNodes;
    private final List<Set<Edge>> ignoredEdges;

    public FGraph() {
        this(Map.of(), List.of());
    }

    public FGraph(Map<String, Node> nodes, List<Edge> edges) {
        this(nodes, edges, Set.of(), List.of());
    }

    public FGraph(Map<String, Node> nodes, List<Edge> edges, Set<Node> ignoredNodes, List<Set<Edge>> ignoredEdges) {
        super(
                edges == null ? List.of() : List.copyOf(edges),
                nodes == null ? Map.of() : Collections.unmodifiableMap(new LinkedHashMap<>(nodes)));
        this.ignoredNodes = ignoredNodes == null
                ? Set.of()
                : Collections.unmodifiableSet(new LinkedHashSet<>(ignoredNodes));
        this.ignoredEdges = ignoredEdges == null
                ? List.of()
                : Collections.unmodifiableList(new ArrayList<>(ignoredEdges));
    }

    public List<Set<Edge>> getIgnoredEdges() {
        return ignoredEdges;
    }

    public Set<Node> getIgnoredNodes() {
        return ignoredNodes;
    }

    public FGraph filter(Set<String> candidateUserIds, Set<String> disabledUserIds, double minWeight) {
        Set<String> includedUserIds = candidateUserIds == null
                ? Set.of()
                : candidateUserIds.stream()
                        .filter(id -> id != null && !id.isBlank())
                        .collect(Collectors.toCollection(LinkedHashSet::new));
        if (includedUserIds.isEmpty()) {
            return new FGraph(Map.of(), List.of(), resolveIgnoredNodes(disabledUserIds), ignoredEdges);
        }

        Map<String, Node> filteredNodes = new LinkedHashMap<>();
        for (String includedUserId : includedUserIds) {
            Node node = getNodes().get(includedUserId);
            filteredNodes.put(includedUserId, node == null ? new Node(includedUserId) : node);
        }

        List<Edge> filteredEdges = getEdges().stream()
                .filter(edge -> edge != null
                        && edge.getFrom() != null
                        && edge.getTo() != null
                        && includedUserIds.contains(edge.getFrom().getId())
                        && includedUserIds.contains(edge.getTo().getId())
                        && edge.getWeight() >= minWeight)
                .toList();

        return new FGraph(filteredNodes, filteredEdges, resolveIgnoredNodes(disabledUserIds), ignoredEdges);
    }

    public double weightBetween(String leftUserId, String rightUserId) {
        if (leftUserId == null || rightUserId == null || leftUserId.isBlank() || rightUserId.isBlank()) {
            return 0d;
        }
        return getEdges().stream()
                .filter(edge -> edge != null && edge.getFrom() != null && edge.getTo() != null)
                .filter(edge -> edge.getFrom().getId().equals(leftUserId) && edge.getTo().getId().equals(rightUserId)
                        || edge.getFrom().getId().equals(rightUserId) && edge.getTo().getId().equals(leftUserId))
                .mapToDouble(Edge::getWeight)
                .max()
                .orElse(0d);
    }

    public static FGraph fromEdges(List<Edge> edges) {
        if (edges == null || edges.isEmpty()) {
            return new FGraph();
        }
        Map<String, Node> nodes = new LinkedHashMap<>();
        List<Edge> normalizedEdges = new ArrayList<>();
        for (Edge edge : edges) {
            if (edge == null || edge.getFrom() == null || edge.getTo() == null) {
                continue;
            }
            nodes.putIfAbsent(edge.getFrom().getId(), edge.getFrom());
            nodes.putIfAbsent(edge.getTo().getId(), edge.getTo());
            normalizedEdges.add(edge);
        }
        return new FGraph(nodes, normalizedEdges);
    }

    private Set<Node> resolveIgnoredNodes(Set<String> disabledUserIds) {
        if (disabledUserIds == null || disabledUserIds.isEmpty()) {
            return Set.of();
        }
        return disabledUserIds.stream()
                .filter(id -> id != null && !id.isBlank())
                .map(id -> getNodes().getOrDefault(id, new Node(id)))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
