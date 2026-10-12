package com.raxim.myscoutee.domain.affinity.service;

import com.raxim.myscoutee.domain.administration.api.AdministrativeActors;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.affinity.document.AdminAffinityGraphEdge;
import com.raxim.myscoutee.domain.affinity.document.AdminAffinityGraphForest;
import com.raxim.myscoutee.domain.affinity.document.AdminAffinityGraphLayout;
import com.raxim.myscoutee.domain.affinity.document.AdminAffinityGraphNode;
import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphEdgeDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphForestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphForestsDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphMetaDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphNeighborhoodDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphNodeDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphTileDto;
import com.raxim.myscoutee.domain.affinity.repository.AdminAffinityGraphEdgesRepository;
import com.raxim.myscoutee.domain.affinity.repository.AdminAffinityGraphForestsRepository;
import com.raxim.myscoutee.domain.affinity.repository.AdminAffinityGraphLayoutsRepository;
import com.raxim.myscoutee.domain.affinity.repository.AdminAffinityGraphNodesRepository;
import com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;

@Service
public class AdminAffinityGraphService implements com.raxim.myscoutee.domain.affinity.api.AffinityGraph {
    private static final Set<String> ACTIVE_GRAPH_PROFILE_STATUSES = Set.of("public", "friends only", "host only");
    private static final int MAX_DEPTH = 3;
    private static final int MAX_ZOOM = 6;
    private static final int TILE_SIZE = 256;
    private static final int NODE_RENDER_BUDGET = 1000;
    private static final int EDGE_RENDER_BUDGET = 5000;
    private static final int FOREST_OVERVIEW_BASE_BUDGET = 16;
    private static final double WORLD_RADIUS = 620d;

    private final AdministrativeActors adminModerationService;
    private final ProfileSummaries usersRepository;
    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final AdminAffinityGraphLayoutsRepository layoutsRepository;
    private final AdminAffinityGraphNodesRepository graphNodesRepository;
    private final AdminAffinityGraphEdgesRepository graphEdgesRepository;
    private final AdminAffinityGraphForestsRepository graphForestsRepository;

    public AdminAffinityGraphService(
            AdministrativeActors adminModerationService,
            ProfileSummaries usersRepository,
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            AdminAffinityGraphLayoutsRepository layoutsRepository,
            AdminAffinityGraphNodesRepository graphNodesRepository,
            AdminAffinityGraphEdgesRepository graphEdgesRepository,
            AdminAffinityGraphForestsRepository graphForestsRepository) {
        this.adminModerationService = adminModerationService;
        this.usersRepository = usersRepository;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.layoutsRepository = layoutsRepository;
        this.graphNodesRepository = graphNodesRepository;
        this.graphEdgesRepository = graphEdgesRepository;
        this.graphForestsRepository = graphForestsRepository;
    }

    public AdminAffinityGraphMetaDto meta(String adminUserId, Double minWeight, Double maxWeight) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        if (isDefaultWeightRange(minWeight, maxWeight)) {
            Optional<AdminAffinityGraphLayout> materializedLayout = latestMaterializedLayout(groupId);
            if (materializedLayout.isPresent()) {
                return toMetaDto(materializedLayout.get());
            }
        }
        GraphSnapshot snapshot = loadSnapshot(groupId);
        FilteredGraph graph = filterGraph(snapshot, minWeight, maxWeight);
        List<ComponentRecord> components = components(snapshot, graph.edges());
        long isolated = components.stream().filter(component -> component.nodes().size() == 1 && component.edges().isEmpty()).count();
        return new AdminAffinityGraphMetaDto(
                snapshot.generatedAtIso(),
                "http",
                snapshot.layoutVersion(),
                snapshot.nodesById().size(),
                graph.edges().size(),
                components.size(),
                Math.toIntExact(isolated),
                MAX_ZOOM,
                TILE_SIZE,
                NODE_RENDER_BUDGET,
                EDGE_RENDER_BUDGET,
                false);
    }

    public AdminAffinityGraphDto full(String adminUserId, Double minWeight, Double maxWeight) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        GraphSnapshot snapshot = loadSnapshot(groupId);
        FilteredGraph graph = filterGraph(snapshot, minWeight, maxWeight);
        return new AdminAffinityGraphDto(
                snapshot.generatedAtIso(),
                "http",
                snapshot.layoutVersion(),
                snapshot.sortedNodes(),
                graph.sortedEdgeDtos());
    }

    public AdminAffinityGraphNeighborhoodDto neighborhood(
            String adminUserId,
            String userId,
            Integer depth,
            Double minWeight,
            Double maxWeight) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        GraphSnapshot snapshot = loadSnapshot(groupId);
        String centerUserId = normalizeId(userId);
        int normalizedDepth = Math.max(1, Math.min(MAX_DEPTH, depth == null ? 1 : depth));
        FilteredGraph graph = filterGraph(snapshot, minWeight, maxWeight);
        LinkedHashSet<String> visibleNodeIds = neighborhoodNodeIds(centerUserId, normalizedDepth, graph.adjacency());
        if (snapshot.nodesById().containsKey(centerUserId)) {
            visibleNodeIds.add(centerUserId);
        }
        List<AdminAffinityGraphNodeDto> nodes = visibleNodeIds.stream()
                .map(snapshot.nodesById()::get)
                .filter(node -> node != null)
                .sorted(Comparator.comparing(AdminAffinityGraphNodeDto::name).thenComparing(AdminAffinityGraphNodeDto::id))
                .toList();
        List<AdminAffinityGraphEdgeDto> edges = graph.edges().stream()
                .filter(edge -> visibleNodeIds.contains(edge.source()) && visibleNodeIds.contains(edge.target()))
                .map(GraphEdge::dto)
                .sorted(edgeComparator())
                .toList();
        return new AdminAffinityGraphNeighborhoodDto(
                snapshot.generatedAtIso(),
                "http",
                snapshot.layoutVersion(),
                centerUserId,
                normalizedDepth,
                nodes,
                edges);
    }

    public AdminAffinityGraphForestsDto forests(
            String adminUserId,
            Double minWeight,
            Double maxWeight,
            Integer forestLevel,
            Integer limit,
            Integer offset) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        if (isDefaultWeightRange(minWeight, maxWeight)) {
            Optional<AdminAffinityGraphLayout> materializedLayout = latestMaterializedLayout(groupId);
            if (materializedLayout.isPresent()) {
                AdminAffinityGraphLayout layout = materializedLayout.get();
                int forestCount = Math.toIntExact(Math.min(
                        Integer.MAX_VALUE,
                        graphForestsRepository.countByLayoutVersion(layout.getLayoutVersion())));
                ForestPageSpec forestPage = forestPageSpec(forestCount, forestLevel, limit, offset);
                List<AdminAffinityGraphForestDto> forests = graphForestsRepository
                        .findByLayoutVersionOrderByMemberCountDesc(
                                layout.getLayoutVersion(),
                                PageRequest.of(
                                        forestPage.limit() <= 0 ? 0 : forestPage.offset() / forestPage.limit(),
                                        Math.max(1, forestPage.limit())))
                        .stream()
                        .map(this::toForestDto)
                        .toList();
                return new AdminAffinityGraphForestsDto(
                        firstNonBlank(layout.getGeneratedAtIso(), Instant.now().toString()),
                        firstNonBlank(layout.getSource(), "materialized"),
                        layout.getLayoutVersion(),
                        forestCount,
                        forestPage.forestLevel(),
                        forestPage.maxForestLevel(),
                        forestPage.limit(),
                        forestPage.offset(),
                        forests);
            }
        }
        GraphSnapshot snapshot = loadSnapshot(groupId);
        FilteredGraph graph = filterGraph(snapshot, minWeight, maxWeight);
        List<ComponentRecord> components = components(snapshot, graph.edges());
        Map<String, Position> centers = componentCenters(components);
        List<AdminAffinityGraphForestDto> forests = components.stream()
                .map(component -> toForestDto(component, centers.get(component.id())))
                .toList();
        ForestPage forestPage = forestPage(forests, forestLevel, limit, offset);
        return new AdminAffinityGraphForestsDto(
                snapshot.generatedAtIso(),
                "http",
                snapshot.layoutVersion(),
                forests.size(),
                forestPage.forestLevel(),
                forestPage.maxForestLevel(),
                forestPage.limit(),
                forestPage.offset(),
                forestPage.forests());
    }

    public AdminAffinityGraphTileDto tile(
            String adminUserId,
            String layoutVersion,
            Integer z,
            Integer x,
            Integer y,
            Double minWeight,
            Double maxWeight,
            String componentId) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        Optional<AdminAffinityGraphLayout> materializedLayout = materializedLayout(layoutVersion, groupId);
        if (materializedLayout.isPresent()) {
            return materializedTile(materializedLayout.get(), z, x, y, minWeight, maxWeight, componentId);
        }
        GraphSnapshot snapshot = loadSnapshot(groupId);
        int zoom = Math.max(0, Math.min(MAX_ZOOM, z == null ? 0 : z));
        int maxTile = (1 << zoom) - 1;
        int tileX = Math.max(0, Math.min(maxTile, x == null ? 0 : x));
        int tileY = Math.max(0, Math.min(maxTile, y == null ? 0 : y));
        FilteredGraph graph = filterGraph(snapshot, minWeight, maxWeight);
        List<ComponentRecord> components = components(snapshot, graph.edges());
        LayoutRecord layout = layout(components);
        String requestedComponentId = normalizeText(componentId);
        Set<String> tileNodeIds = new LinkedHashSet<>();
        for (Map.Entry<String, Position> entry : layout.nodePositions().entrySet()) {
            String nodeId = entry.getKey();
            String nodeComponentId = layout.componentIdsByNodeId().get(nodeId);
            if (StringUtils.hasText(requestedComponentId) && !requestedComponentId.equals(nodeComponentId)) {
                continue;
            }
            TileKey key = tileKey(entry.getValue(), zoom);
            if (key.x() == tileX && key.y() == tileY) {
                tileNodeIds.add(nodeId);
            }
        }

        boolean truncated = tileNodeIds.size() > NODE_RENDER_BUDGET;
        List<String> limitedNodeIds = tileNodeIds.stream().limit(NODE_RENDER_BUDGET).toList();
        Set<String> limitedNodeIdSet = new HashSet<>(limitedNodeIds);
        NodeMetrics metrics = nodeMetrics(graph.edges());
        List<AdminAffinityGraphNodeDto> nodes = limitedNodeIds.stream()
                .map(snapshot.nodesById()::get)
                .filter(node -> node != null)
                .map(node -> withLayout(
                        node,
                        layout.componentIdsByNodeId().get(node.id()),
                        layout.nodePositions().get(node.id()),
                        metrics))
                .toList();
        List<AdminAffinityGraphEdgeDto> edges = graph.edges().stream()
                .filter(edge -> limitedNodeIdSet.contains(edge.source()) && limitedNodeIdSet.contains(edge.target()))
                .limit(EDGE_RENDER_BUDGET)
                .map(GraphEdge::dto)
                .toList();
        boolean edgeTruncated = graph.edges().stream()
                .filter(edge -> limitedNodeIdSet.contains(edge.source()) && limitedNodeIdSet.contains(edge.target()))
                .skip(EDGE_RENDER_BUDGET)
                .findAny()
                .isPresent();
        return new AdminAffinityGraphTileDto(
                snapshot.generatedAtIso(),
                "http",
                StringUtils.hasText(normalizeText(layoutVersion)) ? normalizeText(layoutVersion) : snapshot.layoutVersion(),
                zoom,
                tileX,
                tileY,
                tileNodeIds.size(),
                edges.size(),
                truncated || edgeTruncated,
                nodes,
                edges);
    }

    public AdminAffinityGraphMetaDto rebuildLayout(String adminUserId) {
        String groupId = adminModerationService.baseGroupId(adminUserId);
        return rebuildMaterializedLayout(groupId);
    }

    AdminAffinityGraphMetaDto rebuildMaterializedLayout() {
        return rebuildMaterializedLayout(JobGroupContext.groupId());
    }

    private AdminAffinityGraphMetaDto rebuildMaterializedLayout(String groupId) {
        Instant generatedAt = Instant.now();
        String layoutVersion = "layout-" + scopeKey(groupId) + "-" + generatedAt.toEpochMilli();
        GraphSnapshot snapshot = loadSnapshot(generatedAt.toString(), layoutVersion, groupId);
        FilteredGraph graph = filterGraph(snapshot, 0d, 1d);
        List<ComponentRecord> components = components(snapshot, graph.edges());
        LayoutRecord layout = layout(components);
        NodeMetrics metrics = nodeMetrics(graph.edges());
        Map<String, Position> componentCenters = componentCenters(components);
        long isolated = components.stream().filter(component -> component.nodes().size() == 1 && component.edges().isEmpty()).count();

        AdminAffinityGraphLayout layoutDocument = new AdminAffinityGraphLayout();
        layoutDocument.setScopeKey(scopeKey(groupId));
        layoutDocument.setLayoutVersion(layoutVersion);
        layoutDocument.setGeneratedAtIso(generatedAt.toString());
        layoutDocument.setSource("materialized");
        layoutDocument.setMemberCount(snapshot.nodesById().size());
        layoutDocument.setLinkCount(graph.edges().size());
        layoutDocument.setComponentCount(components.size());
        layoutDocument.setIsolatedCount(Math.toIntExact(isolated));
        layoutDocument.setMaxZoom(MAX_ZOOM);
        layoutDocument.setTileSize(TILE_SIZE);
        layoutDocument.setNodeRenderBudget(NODE_RENDER_BUDGET);
        layoutDocument.setEdgeRenderBudget(EDGE_RENDER_BUDGET);

        graphNodesRepository.saveAll(snapshot.nodesById().values().stream()
                .map(node -> toNodeDocument(
                        layoutVersion,
                        withLayout(
                                node,
                                layout.componentIdsByNodeId().get(node.id()),
                                layout.nodePositions().get(node.id()),
                                metrics)))
                .toList());
        graphEdgesRepository.saveAll(graph.edges().stream()
                .map(edge -> toEdgeDocument(
                        layoutVersion,
                        layout.componentIdsByNodeId().get(edge.source()),
                        edge,
                        layout.nodePositions()))
                .toList());
        graphForestsRepository.saveAll(components.stream()
                .map(component -> toForestDocument(layoutVersion, toForestDto(component, componentCenters.get(component.id()))))
                .toList());
        layoutsRepository.save(layoutDocument);
        return toMetaDto(layoutDocument);
    }

    private Optional<AdminAffinityGraphLayout> latestMaterializedLayout(String groupId) {
        return layoutsRepository.findFirstByScopeKeyOrderByGeneratedAtIsoDesc(scopeKey(groupId))
                .filter(layout -> StringUtils.hasText(layout.getLayoutVersion()));
    }

    private Optional<AdminAffinityGraphLayout> materializedLayout(String layoutVersion, String groupId) {
        String normalizedLayoutVersion = normalizeText(layoutVersion);
        if (StringUtils.hasText(normalizedLayoutVersion)) {
            return layoutsRepository.findByLayoutVersion(normalizedLayoutVersion).filter(layout -> scopeKey(groupId).equals(layout.getScopeKey()));
        }
        return latestMaterializedLayout(groupId);
    }

    private AdminAffinityGraphMetaDto toMetaDto(AdminAffinityGraphLayout layout) {
        return new AdminAffinityGraphMetaDto(
                firstNonBlank(layout.getGeneratedAtIso(), Instant.now().toString()),
                firstNonBlank(layout.getSource(), "materialized"),
                layout.getLayoutVersion(),
                intValue(layout.getMemberCount()),
                intValue(layout.getLinkCount()),
                intValue(layout.getComponentCount()),
                intValue(layout.getIsolatedCount()),
                intValue(layout.getMaxZoom(), MAX_ZOOM),
                intValue(layout.getTileSize(), TILE_SIZE),
                intValue(layout.getNodeRenderBudget(), NODE_RENDER_BUDGET),
                intValue(layout.getEdgeRenderBudget(), EDGE_RENDER_BUDGET),
                true);
    }

    private AdminAffinityGraphTileDto materializedTile(
            AdminAffinityGraphLayout layout,
            Integer z,
            Integer x,
            Integer y,
            Double minWeight,
            Double maxWeight,
            String componentId) {
        int maxZoom = intValue(layout.getMaxZoom(), MAX_ZOOM);
        int zoom = Math.max(0, Math.min(maxZoom, z == null ? 0 : z));
        int maxTile = (1 << zoom) - 1;
        int tileX = Math.max(0, Math.min(maxTile, x == null ? 0 : x));
        int tileY = Math.max(0, Math.min(maxTile, y == null ? 0 : y));
        String requestedComponentId = normalizeText(componentId);
        TileBounds bounds = tileBounds(zoom, tileX, tileY);
        List<AdminAffinityGraphNode> tileNodes = StringUtils.hasText(requestedComponentId)
                ? graphNodesRepository.findByLayoutVersionAndComponentIdAndViewport(
                        layout.getLayoutVersion(),
                        requestedComponentId,
                        bounds.minX(),
                        bounds.maxX(),
                        bounds.minZ(),
                        bounds.maxZ())
                : graphNodesRepository.findByLayoutVersionAndViewport(
                        layout.getLayoutVersion(),
                        bounds.minX(),
                        bounds.maxX(),
                        bounds.minZ(),
                        bounds.maxZ());
        boolean nodeTruncated = tileNodes.size() > intValue(layout.getNodeRenderBudget(), NODE_RENDER_BUDGET);
        List<AdminAffinityGraphNode> limitedNodes = tileNodes.stream()
                .sorted(Comparator
                        .comparingDouble((AdminAffinityGraphNode node) -> doubleValue(node.getCentrality()))
                        .reversed()
                        .thenComparing(AdminAffinityGraphNode::getUserId, Comparator.nullsLast(String::compareTo)))
                .limit(intValue(layout.getNodeRenderBudget(), NODE_RENDER_BUDGET))
                .toList();
        List<String> nodeIds = limitedNodes.stream()
                .map(AdminAffinityGraphNode::getUserId)
                .filter(StringUtils::hasText)
                .toList();
        Set<String> nodeIdSet = new HashSet<>(nodeIds);
        WeightRange range = weightRange(minWeight, maxWeight);
        int edgeRenderBudget = intValue(layout.getEdgeRenderBudget(), EDGE_RENDER_BUDGET);
        List<AdminAffinityGraphEdge> filteredEdges = graphEdgesRepository
                .findRelevantByLayoutVersionAndUserIds(layout.getLayoutVersion(), nodeIds)
                .stream()
                .filter(edge -> nodeIdSet.contains(edge.getSourceUserId()) && nodeIdSet.contains(edge.getTargetUserId()))
                .filter(edge -> doubleValue(edge.getWeight()) >= range.min() && doubleValue(edge.getWeight()) <= range.max())
                .filter(edge -> !StringUtils.hasText(requestedComponentId) || requestedComponentId.equals(edge.getComponentId()))
                .sorted(Comparator
                        .comparingDouble((AdminAffinityGraphEdge edge) -> doubleValue(edge.getWeight()))
                        .reversed()
                        .thenComparing(AdminAffinityGraphEdge::getSourceUserId, Comparator.nullsLast(String::compareTo))
                        .thenComparing(AdminAffinityGraphEdge::getTargetUserId, Comparator.nullsLast(String::compareTo)))
                .toList();
        List<AdminAffinityGraphEdgeDto> edges = filteredEdges.stream()
                .limit(edgeRenderBudget)
                .map(this::toEdgeDto)
                .toList();
        boolean edgeTruncated = filteredEdges.size() > edgeRenderBudget;
        return new AdminAffinityGraphTileDto(
                firstNonBlank(layout.getGeneratedAtIso(), Instant.now().toString()),
                firstNonBlank(layout.getSource(), "materialized"),
                layout.getLayoutVersion(),
                zoom,
                tileX,
                tileY,
                tileNodes.size(),
                edges.size(),
                nodeTruncated || edgeTruncated,
                limitedNodes.stream().map(this::toNodeDto).toList(),
                edges);
    }

    private String scopeKey(String groupId) { return groupId == null ? "dating" : groupId; }

    private GraphSnapshot loadSnapshot(String groupId) {
        String generatedAtIso = Instant.now().toString();
        return loadSnapshot(generatedAtIso, "live-" + scopeKey(groupId) + "-" + generatedAtIso, groupId);
    }

    private GraphSnapshot loadSnapshot(String generatedAtIso, String layoutVersion, String groupId) {
        Map<String, AdminAffinityGraphNodeDto> nodesById = new LinkedHashMap<>();
        for (ProfileSummary user : usersRepository.findByWorkspaceGroupId(groupId)) {
            AdminAffinityGraphNodeDto node = toNode(user);
            if (node != null) {
                nodesById.put(node.id(), node);
            }
        }
        List<GraphEdge> edges = new ArrayList<>();
        Map<String, GraphEdge> edgeByKey = new LinkedHashMap<>();
        for (UserAffinityEdge edge : userAffinityEdgesRepository.findAll()) {
            GraphEdge graphEdge = toEdge(edge, nodesById);
            if (graphEdge == null) {
                continue;
            }
            GraphEdge existing = edgeByKey.get(graphEdge.key());
            if (existing == null || existing.weight() < graphEdge.weight()) {
                edgeByKey.put(graphEdge.key(), graphEdge);
            }
        }
        edges.addAll(edgeByKey.values());
        edges.sort(Comparator.comparing(GraphEdge::source).thenComparing(GraphEdge::target));
        return new GraphSnapshot(
                generatedAtIso,
                layoutVersion,
                nodesById,
                edges);
    }

    private FilteredGraph filterGraph(GraphSnapshot snapshot, Double minWeight, Double maxWeight) {
        WeightRange range = weightRange(minWeight, maxWeight);
        List<GraphEdge> edges = snapshot.edges().stream()
                .filter(edge -> edge.weight() >= range.min() && edge.weight() <= range.max())
                .toList();
        Map<String, List<GraphEdge>> adjacency = new LinkedHashMap<>();
        for (String nodeId : snapshot.nodesById().keySet()) {
            adjacency.put(nodeId, new ArrayList<>());
        }
        for (GraphEdge edge : edges) {
            adjacency.computeIfAbsent(edge.source(), ignored -> new ArrayList<>()).add(edge);
            adjacency.computeIfAbsent(edge.target(), ignored -> new ArrayList<>()).add(edge);
        }
        return new FilteredGraph(edges, adjacency);
    }

    private LinkedHashSet<String> neighborhoodNodeIds(
            String centerUserId,
            int depth,
            Map<String, List<GraphEdge>> adjacency) {
        LinkedHashSet<String> result = new LinkedHashSet<>();
        if (!StringUtils.hasText(centerUserId) || !adjacency.containsKey(centerUserId)) {
            return result;
        }
        ArrayDeque<NodeDepth> queue = new ArrayDeque<>();
        queue.add(new NodeDepth(centerUserId, 0));
        result.add(centerUserId);
        while (!queue.isEmpty()) {
            NodeDepth current = queue.removeFirst();
            if (current.depth() >= depth) {
                continue;
            }
            for (GraphEdge edge : adjacency.getOrDefault(current.nodeId(), List.of())) {
                String other = edge.other(current.nodeId());
                if (result.add(other)) {
                    queue.addLast(new NodeDepth(other, current.depth() + 1));
                }
            }
        }
        return result;
    }

    private List<ComponentRecord> components(GraphSnapshot snapshot, List<GraphEdge> edges) {
        Map<String, String> parent = new LinkedHashMap<>();
        snapshot.nodesById().keySet().forEach(nodeId -> parent.put(nodeId, nodeId));
        for (GraphEdge edge : edges) {
            union(parent, edge.source(), edge.target());
        }
        Map<String, List<AdminAffinityGraphNodeDto>> groupedNodes = new LinkedHashMap<>();
        for (AdminAffinityGraphNodeDto node : snapshot.nodesById().values()) {
            groupedNodes.computeIfAbsent(find(parent, node.id()), ignored -> new ArrayList<>()).add(node);
        }
        Map<String, List<GraphEdge>> groupedEdges = new LinkedHashMap<>();
        for (GraphEdge edge : edges) {
            groupedEdges.computeIfAbsent(find(parent, edge.source()), ignored -> new ArrayList<>()).add(edge);
        }
        List<ComponentRecord> components = new ArrayList<>();
        int index = 0;
        for (List<AdminAffinityGraphNodeDto> nodes : groupedNodes.values().stream()
                .sorted(Comparator
                        .comparingInt((List<AdminAffinityGraphNodeDto> nodes) -> nodes.size())
                        .reversed()
                        .thenComparing(nodes -> nodes.get(0).id()))
                .toList()) {
            String root = find(parent, nodes.get(0).id());
            List<GraphEdge> componentEdges = groupedEdges.getOrDefault(root, List.of());
            components.add(new ComponentRecord("c" + index, nodes, componentEdges, representative(nodes, componentEdges)));
            index += 1;
        }
        return components;
    }

    private AdminAffinityGraphForestDto toForestDto(ComponentRecord component, Position center) {
        AdminAffinityGraphNodeDto representative = component.representative();
        double weightedDegree = component.edges().stream().mapToDouble(GraphEdge::weight).sum();
        return new AdminAffinityGraphForestDto(
                component.id(),
                representative.id(),
                representative.name(),
                representative.initials(),
                representative.gender(),
                component.nodes().size(),
                component.edges().size(),
                round(weightedDegree),
                round(center.x()),
                round(center.y()),
                round(center.z()),
                round(Math.max(3d, Math.sqrt(component.nodes().size()) * 5.5d)));
    }

    private AdminAffinityGraphNodeDto withLayout(
            AdminAffinityGraphNodeDto node,
            String componentId,
            Position position,
            NodeMetrics metrics) {
        int degree = metrics.degree().getOrDefault(node.id(), 0);
        double weightedDegree = metrics.weightedDegree().getOrDefault(node.id(), 0d);
        double centrality = metrics.maxWeightedDegree() <= 0d ? 0d : weightedDegree / metrics.maxWeightedDegree();
        return new AdminAffinityGraphNodeDto(
                node.id(),
                node.name(),
                node.initials(),
                node.gender(),
                node.city(),
                node.age(),
                node.headline(),
                node.traitLabel(),
                node.statusText(),
                node.profileStatus(),
                node.image(),
                node.images(),
                firstNonBlank(componentId, node.componentId()),
                position == null ? node.x() : round(position.x()),
                position == null ? node.y() : round(position.y()),
                position == null ? node.z() : round(position.z()),
                degree,
                round(weightedDegree),
                round(centrality));
    }

    private AdminAffinityGraphNodeDto representative(List<AdminAffinityGraphNodeDto> nodes, List<GraphEdge> edges) {
        Map<String, Integer> degree = new HashMap<>();
        Map<String, Double> weightedDegree = new HashMap<>();
        for (GraphEdge edge : edges) {
            degree.put(edge.source(), degree.getOrDefault(edge.source(), 0) + 1);
            degree.put(edge.target(), degree.getOrDefault(edge.target(), 0) + 1);
            weightedDegree.put(edge.source(), weightedDegree.getOrDefault(edge.source(), 0d) + edge.weight());
            weightedDegree.put(edge.target(), weightedDegree.getOrDefault(edge.target(), 0d) + edge.weight());
        }
        return nodes.stream()
                .sorted(Comparator
                        .comparingInt((AdminAffinityGraphNodeDto node) -> degree.getOrDefault(node.id(), 0))
                        .reversed()
                        .thenComparing(Comparator.comparingDouble((AdminAffinityGraphNodeDto node) -> weightedDegree.getOrDefault(node.id(), 0d)).reversed())
                        .thenComparing(AdminAffinityGraphNodeDto::name)
                        .thenComparing(AdminAffinityGraphNodeDto::id))
                .findFirst()
                .orElse(nodes.get(0));
    }

    private NodeMetrics nodeMetrics(List<GraphEdge> edges) {
        Map<String, Integer> degree = new HashMap<>();
        Map<String, Double> weightedDegree = new HashMap<>();
        double maxWeightedDegree = 0d;
        for (GraphEdge edge : edges) {
            degree.put(edge.source(), degree.getOrDefault(edge.source(), 0) + 1);
            degree.put(edge.target(), degree.getOrDefault(edge.target(), 0) + 1);
            double sourceWeight = weightedDegree.getOrDefault(edge.source(), 0d) + edge.weight();
            double targetWeight = weightedDegree.getOrDefault(edge.target(), 0d) + edge.weight();
            weightedDegree.put(edge.source(), sourceWeight);
            weightedDegree.put(edge.target(), targetWeight);
            maxWeightedDegree = Math.max(maxWeightedDegree, Math.max(sourceWeight, targetWeight));
        }
        return new NodeMetrics(degree, weightedDegree, maxWeightedDegree);
    }

    private LayoutRecord layout(List<ComponentRecord> components) {
        Map<String, Position> componentCenters = componentCenters(components);
        Map<String, Position> nodePositions = new LinkedHashMap<>();
        Map<String, String> componentIdsByNodeId = new LinkedHashMap<>();
        for (ComponentRecord component : components) {
            Position center = componentCenters.get(component.id());
            List<AdminAffinityGraphNodeDto> nodes = component.nodes();
            double radius = Math.max(7d, Math.sqrt(nodes.size()) * 4.6d);
            for (int index = 0; index < nodes.size(); index += 1) {
                AdminAffinityGraphNodeDto node = nodes.get(index);
                Position offset = spherePoint(index, nodes.size(), node.id(), radius);
                nodePositions.put(node.id(), new Position(
                        center.x() + offset.x(),
                        center.y() + offset.y(),
                        center.z() + offset.z()));
                componentIdsByNodeId.put(node.id(), component.id());
            }
        }
        return new LayoutRecord(nodePositions, componentIdsByNodeId);
    }

    private Map<String, Position> componentCenters(List<ComponentRecord> components) {
        Map<String, Position> centers = new LinkedHashMap<>();
        for (int index = 0; index < components.size(); index += 1) {
            ComponentRecord component = components.get(index);
            double angle = index * 2.399963229728653d;
            double distance = index == 0 ? 0d : 70d + Math.sqrt(index) * 42d;
            centers.put(component.id(), new Position(
                    Math.cos(angle) * distance,
                    (index % 3 - 1) * 10d,
                    Math.sin(angle) * distance));
        }
        return centers;
    }

    private Position spherePoint(int index, int count, String seedText, double radius) {
        if (count <= 1) {
            return new Position(0d, 0d, 0d);
        }
        double golden = Math.PI * (3d - Math.sqrt(5d));
        double y = 1d - (index / (double) (count - 1)) * 2d;
        double shellRadius = Math.sqrt(Math.max(0d, 1d - y * y));
        double theta = golden * index + seededUnit(seedText) * 0.45d;
        return new Position(
                Math.cos(theta) * shellRadius * radius,
                y * radius,
                Math.sin(theta) * shellRadius * radius);
    }

    private TileKey tileKey(Position position, int zoom) {
        int tiles = 1 << zoom;
        int x = (int) Math.floor(clamp((position.x() + WORLD_RADIUS) / (WORLD_RADIUS * 2d), 0d, 0.999999d) * tiles);
        int y = (int) Math.floor(clamp((position.z() + WORLD_RADIUS) / (WORLD_RADIUS * 2d), 0d, 0.999999d) * tiles);
        return new TileKey(zoom, x, y);
    }

    private TileBounds tileBounds(int zoom, int tileX, int tileY) {
        int tiles = 1 << zoom;
        double span = (WORLD_RADIUS * 2d) / tiles;
        double minX = -WORLD_RADIUS + tileX * span;
        double maxX = minX + span;
        double minZ = -WORLD_RADIUS + tileY * span;
        double maxZ = minZ + span;
        return new TileBounds(minX, maxX, minZ, maxZ);
    }

    private AdminAffinityGraphNodeDto toNode(ProfileSummary user) {
        if (user == null) {
            return null;
        }
        String id = normalizeId(user.getUserId());
        if (!StringUtils.hasText(id) || isExcludedUser(id, user)) {
            return null;
        }
        List<String> images = safeImages(user.getImages());
        String name = firstNonBlank(user.getName(), user.getInitials(), id);
        String initials = normalizeText(user.getInitials());
        return new AdminAffinityGraphNodeDto(
                id,
                name,
                StringUtils.hasText(initials)
                        ? initials.substring(0, Math.min(3, initials.length())).toUpperCase()
                        : initialsFor(firstNonBlank(name, id)),
                normalizeText(user.getGender()),
                normalizeText(user.getCity()),
                user.getAge(),
                normalizeText(user.getHeadline()),
                normalizeText(user.getTraitLabel()),
                normalizeText(user.getStatusText()),
                normalizeText(user.getProfileStatus()),
                images.isEmpty() ? null : images.get(0),
                images,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
    }

    private AdminAffinityGraphNodeDto toNodeDto(AdminAffinityGraphNode node) {
        return new AdminAffinityGraphNodeDto(
                normalizeId(node.getUserId()),
                firstNonBlank(node.getName(), node.getInitials(), node.getUserId()),
                firstNonBlank(node.getInitials(), initialsFor(firstNonBlank(node.getName(), node.getUserId()))),
                normalizeText(node.getGender()),
                normalizeText(node.getCity()),
                node.getAge(),
                normalizeText(node.getHeadline()),
                normalizeText(node.getTraitLabel()),
                normalizeText(node.getStatusText()),
                normalizeText(node.getProfileStatus()),
                normalizeText(node.getImage()),
                safeImages(node.getImages()),
                normalizeText(node.getComponentId()),
                round(doubleValue(node.getX())),
                round(doubleValue(node.getY())),
                round(doubleValue(node.getZ())),
                intValue(node.getDegree()),
                round(doubleValue(node.getWeightedDegree())),
                round(doubleValue(node.getCentrality())));
    }

    private AdminAffinityGraphEdgeDto toEdgeDto(AdminAffinityGraphEdge edge) {
        String source = normalizeId(edge.getSourceUserId());
        String target = normalizeId(edge.getTargetUserId());
        return new AdminAffinityGraphEdgeDto(
                firstNonBlank(edge.getId(), edgeKey(source, target)),
                source,
                target,
                clamp(firstFinite(edge.getWeight(), edge.getAffinityScore()), 0d, 1d),
                firstFinite(edge.getAffinityScore(), edge.getWeight()),
                normalizeText(edge.getUpdatedDate()));
    }

    private AdminAffinityGraphForestDto toForestDto(AdminAffinityGraphForest forest) {
        return new AdminAffinityGraphForestDto(
                normalizeText(forest.getComponentId()),
                normalizeId(forest.getRepresentativeUserId()),
                normalizeText(forest.getRepresentativeName()),
                normalizeText(forest.getRepresentativeInitials()),
                normalizeText(forest.getGender()),
                intValue(forest.getMemberCount()),
                intValue(forest.getEdgeCount()),
                round(doubleValue(forest.getWeightedDegree())),
                round(doubleValue(forest.getX())),
                round(doubleValue(forest.getY())),
                round(doubleValue(forest.getZ())),
                round(doubleValue(forest.getRadius())));
    }

    private AdminAffinityGraphNode toNodeDocument(String layoutVersion, AdminAffinityGraphNodeDto node) {
        AdminAffinityGraphNode document = new AdminAffinityGraphNode();
        document.setLayoutVersion(layoutVersion);
        document.setUserId(node.id());
        document.setComponentId(node.componentId());
        document.setX(node.x());
        document.setY(node.y());
        document.setZ(node.z());
        document.setDegree(node.degree());
        document.setWeightedDegree(node.weightedDegree());
        document.setCentrality(node.centrality());
        document.setGender(node.gender());
        document.setProfileStatus(node.profileStatus());
        TileKey maxTile = tileKey(new Position(doubleValue(node.x()), doubleValue(node.y()), doubleValue(node.z())), MAX_ZOOM);
        document.setTileZ(maxTile.z());
        document.setTileX(maxTile.x());
        document.setTileY(maxTile.y());
        document.setName(node.name());
        document.setInitials(node.initials());
        document.setCity(node.city());
        document.setAge(node.age());
        document.setHeadline(node.headline());
        document.setTraitLabel(node.traitLabel());
        document.setStatusText(node.statusText());
        document.setImage(node.image());
        document.setImages(node.images());
        return document;
    }

    private AdminAffinityGraphEdge toEdgeDocument(
            String layoutVersion,
            String componentId,
            GraphEdge edge,
            Map<String, Position> nodePositions) {
        Position sourcePosition = nodePositions.getOrDefault(edge.source(), new Position(0d, 0d, 0d));
        Position targetPosition = nodePositions.getOrDefault(edge.target(), new Position(0d, 0d, 0d));
        TileKey sourceTile = tileKey(sourcePosition, MAX_ZOOM);
        TileKey targetTile = tileKey(targetPosition, MAX_ZOOM);
        AdminAffinityGraphEdge document = new AdminAffinityGraphEdge();
        document.setLayoutVersion(layoutVersion);
        document.setSourceUserId(edge.source());
        document.setTargetUserId(edge.target());
        document.setWeight(edge.weight());
        document.setAffinityScore(edge.dto().affinityScore());
        document.setComponentId(componentId);
        document.setLodLevel(edge.weight() >= 0.8d ? 0 : edge.weight() >= 0.5d ? 1 : 2);
        document.setTileZ(MAX_ZOOM);
        document.setMinTileX(Math.min(sourceTile.x(), targetTile.x()));
        document.setMaxTileX(Math.max(sourceTile.x(), targetTile.x()));
        document.setMinTileY(Math.min(sourceTile.y(), targetTile.y()));
        document.setMaxTileY(Math.max(sourceTile.y(), targetTile.y()));
        document.setMinX(round(Math.min(sourcePosition.x(), targetPosition.x())));
        document.setMinY(round(Math.min(sourcePosition.y(), targetPosition.y())));
        document.setMinZ(round(Math.min(sourcePosition.z(), targetPosition.z())));
        document.setMaxX(round(Math.max(sourcePosition.x(), targetPosition.x())));
        document.setMaxY(round(Math.max(sourcePosition.y(), targetPosition.y())));
        document.setMaxZ(round(Math.max(sourcePosition.z(), targetPosition.z())));
        document.setUpdatedDate(edge.dto().updatedDate());
        return document;
    }

    private AdminAffinityGraphForest toForestDocument(String layoutVersion, AdminAffinityGraphForestDto forest) {
        AdminAffinityGraphForest document = new AdminAffinityGraphForest();
        document.setLayoutVersion(layoutVersion);
        document.setComponentId(forest.componentId());
        document.setRepresentativeUserId(forest.representativeUserId());
        document.setRepresentativeName(forest.representativeName());
        document.setRepresentativeInitials(forest.representativeInitials());
        document.setGender(forest.gender());
        document.setMemberCount(forest.memberCount());
        document.setEdgeCount(forest.edgeCount());
        document.setWeightedDegree(forest.weightedDegree());
        document.setX(forest.x());
        document.setY(forest.y());
        document.setZ(forest.z());
        document.setRadius(forest.radius());
        return document;
    }

    private GraphEdge toEdge(UserAffinityEdge edge, Map<String, AdminAffinityGraphNodeDto> nodesById) {
        if (edge == null) {
            return null;
        }
        String source = normalizeId(edge.getLeftUserId());
        String target = normalizeId(edge.getRightUserId());
        if (!StringUtils.hasText(source)
                || !StringUtils.hasText(target)
                || source.equals(target)
                || !nodesById.containsKey(source)
                || !nodesById.containsKey(target)) {
            return null;
        }
        double weight = clamp(firstFinite(edge.getEdgeWeight(), edge.getAffinityScore()), 0d, 1d);
        if (weight <= 0d) {
            return null;
        }
        String key = edgeKey(source, target);
        AdminAffinityGraphEdgeDto dto = new AdminAffinityGraphEdgeDto(
                firstNonBlank(edge.getId(), key),
                source,
                target,
                weight,
                firstFinite(edge.getAffinityScore(), weight),
                normalizeText(edge.getUpdatedDate()));
        return new GraphEdge(key, source, target, weight, dto);
    }

    private boolean isExcludedUser(String id, ProfileSummary user) {
        if (user == null) {
            return true;
        }
        if (id.startsWith("admin-demo-")) {
            return true;
        }
        String profileStatus = normalizeText(user.getProfileStatus()).toLowerCase();
        return !ACTIVE_GRAPH_PROFILE_STATUSES.contains(profileStatus);
    }

    private void union(Map<String, String> parent, String left, String right) {
        String leftRoot = find(parent, left);
        String rightRoot = find(parent, right);
        if (!leftRoot.equals(rightRoot)) {
            parent.put(rightRoot, leftRoot);
        }
    }

    private String find(Map<String, String> parent, String id) {
        String parentId = parent.getOrDefault(id, id);
        if (parentId.equals(id)) {
            return id;
        }
        String root = find(parent, parentId);
        parent.put(id, root);
        return root;
    }

    private WeightRange weightRange(Double minWeight, Double maxWeight) {
        double min = clamp(firstFinite(minWeight, 0d), 0d, 1d);
        double max = clamp(firstFinite(maxWeight, 1d), 0d, 1d);
        if (min > max) {
            double swap = min;
            min = max;
            max = swap;
        }
        return new WeightRange(min, max);
    }

    private boolean isDefaultWeightRange(Double minWeight, Double maxWeight) {
        WeightRange range = weightRange(minWeight, maxWeight);
        return range.min() <= 0d && range.max() >= 1d;
    }

    private ForestPage forestPage(
            List<AdminAffinityGraphForestDto> forests,
            Integer requestedForestLevel,
            Integer requestedLimit,
            Integer requestedOffset) {
        ForestPageSpec spec = forestPageSpec(forests.size(), requestedForestLevel, requestedLimit, requestedOffset);
        List<AdminAffinityGraphForestDto> page = forests.stream()
                .skip(spec.offset())
                .limit(spec.limit())
                .toList();
        return new ForestPage(page, spec.forestLevel(), spec.maxForestLevel(), spec.limit(), spec.offset());
    }

    private ForestPageSpec forestPageSpec(
            int total,
            Integer requestedForestLevel,
            Integer requestedLimit,
            Integer requestedOffset) {
        int maxForestLevel = maxForestLevel(total);
        int forestLevel = Math.max(0, Math.min(maxForestLevel, requestedForestLevel == null ? 0 : requestedForestLevel));
        int levelLimit = Math.min(total, Math.max(1, FOREST_OVERVIEW_BASE_BUDGET * (1 << forestLevel)));
        int limit = Math.max(1, Math.min(Math.max(1, total), requestedLimit == null ? levelLimit : requestedLimit));
        int offset = Math.max(0, Math.min(total, requestedOffset == null ? 0 : requestedOffset));
        return new ForestPageSpec(forestLevel, maxForestLevel, limit, offset);
    }

    private int maxForestLevel(int totalCount) {
        int total = Math.max(1, totalCount);
        return Math.max(0, (int) Math.ceil(Math.log(total / (double) FOREST_OVERVIEW_BASE_BUDGET) / Math.log(2d)));
    }

    private Comparator<AdminAffinityGraphEdgeDto> edgeComparator() {
        return Comparator.comparing(AdminAffinityGraphEdgeDto::source)
                .thenComparing(AdminAffinityGraphEdgeDto::target);
    }

    private String edgeKey(String source, String target) {
        return source.compareTo(target) <= 0 ? source + ":" + target : target + ":" + source;
    }

    private List<String> safeImages(List<String> images) {
        if (images == null || images.isEmpty()) {
            return List.of();
        }
        return images.stream()
                .map(this::normalizeText)
                .filter(StringUtils::hasText)
                .toList();
    }

    private String initialsFor(String value) {
        String normalized = normalizeText(value);
        if (!StringUtils.hasText(normalized)) {
            return "M";
        }
        String[] parts = normalized.split("\\s+");
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            if (!part.isBlank()) {
                builder.append(part.charAt(0));
            }
            if (builder.length() >= 3) {
                break;
            }
        }
        return builder.length() == 0
                ? normalized.substring(0, Math.min(3, normalized.length())).toUpperCase()
                : builder.toString().toUpperCase();
    }

    private String normalizeId(String value) {
        return normalizeText(value);
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            String normalized = normalizeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private double firstFinite(Double... values) {
        for (Double value : values) {
            if (value != null && Double.isFinite(value)) {
                return value;
            }
        }
        return 0d;
    }

    private int intValue(Integer value) {
        return intValue(value, 0);
    }

    private int intValue(Integer value, int fallback) {
        return value == null ? fallback : value;
    }

    private double doubleValue(Double value) {
        return value == null || !Double.isFinite(value) ? 0d : value;
    }

    private double clamp(double value, double min, double max) {
        if (!Double.isFinite(value)) {
            return min;
        }
        return Math.max(min, Math.min(max, value));
    }

    private double seededUnit(String text) {
        long hash = 2166136261L;
        for (int index = 0; index < text.length(); index += 1) {
            hash ^= text.charAt(index);
            hash *= 16777619L;
        }
        return ((hash & 0xffffffffL) % 1000L) / 1000d;
    }

    private double round(double value) {
        return Math.round(value * 1000d) / 1000d;
    }

    private record GraphSnapshot(
            String generatedAtIso,
            String layoutVersion,
            Map<String, AdminAffinityGraphNodeDto> nodesById,
            List<GraphEdge> edges) {
        List<AdminAffinityGraphNodeDto> sortedNodes() {
            return nodesById.values().stream()
                    .sorted(Comparator.comparing(AdminAffinityGraphNodeDto::name).thenComparing(AdminAffinityGraphNodeDto::id))
                    .toList();
        }
    }

    private record FilteredGraph(
            List<GraphEdge> edges,
            Map<String, List<GraphEdge>> adjacency) {
        List<AdminAffinityGraphEdgeDto> sortedEdgeDtos() {
            return edges.stream()
                    .map(GraphEdge::dto)
                    .sorted(Comparator.comparing(AdminAffinityGraphEdgeDto::source).thenComparing(AdminAffinityGraphEdgeDto::target))
                    .toList();
        }
    }

    private record GraphEdge(
            String key,
            String source,
            String target,
            double weight,
            AdminAffinityGraphEdgeDto dto) {
        String other(String nodeId) {
            return source.equals(nodeId) ? target : source;
        }
    }

    private record ComponentRecord(
            String id,
            List<AdminAffinityGraphNodeDto> nodes,
            List<GraphEdge> edges,
            AdminAffinityGraphNodeDto representative) {}

    private record ForestPage(
            List<AdminAffinityGraphForestDto> forests,
            int forestLevel,
            int maxForestLevel,
            int limit,
            int offset) {}

    private record ForestPageSpec(
            int forestLevel,
            int maxForestLevel,
            int limit,
            int offset) {}

    private record LayoutRecord(
            Map<String, Position> nodePositions,
            Map<String, String> componentIdsByNodeId) {}

    private record NodeMetrics(
            Map<String, Integer> degree,
            Map<String, Double> weightedDegree,
            double maxWeightedDegree) {}

    private record Position(double x, double y, double z) {}

    private record TileKey(int z, int x, int y) {}

    private record TileBounds(double minX, double maxX, double minZ, double maxZ) {}

    private record WeightRange(double min, double max) {}

    private record NodeDepth(String nodeId, int depth) {}
}
