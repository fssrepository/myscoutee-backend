package com.raxim.myscoutee.domain.events.algorithm;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;

import com.raxim.myscoutee.domain.events.algorithm.dto.Edge;
import com.raxim.myscoutee.domain.events.algorithm.dto.FGraph;
import com.raxim.myscoutee.domain.events.algorithm.dto.Node;
import com.raxim.myscoutee.domain.events.algorithm.dto.Range;
import com.raxim.myscoutee.domain.events.algorithm.gen.EventGeneratorByPriority;
import com.raxim.myscoutee.domain.events.algorithm.gen.EventGeneratorByRandom;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.PriorityGeneratorRequest;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.RandomGeneratorRequest;

@org.junit.jupiter.api.Tag("standard")
class AlgorithmJsonFixturesTest {
    private static final JsonParser JSON_PARSER = JsonParserFactory.getJsonParser();

    @ParameterizedTest(name = "{0}")
    @MethodSource("randomGroupFixtures")
    void randomGeneratorMatchesJsonFixtures(String ignoredName, RandomGroupFixture fixture) {
        EventGeneratorByRandom generator = new EventGeneratorByRandom();

        List<List<String>> actualGroups = generator.generate(new RandomGeneratorRequest(
                buildGraph(fixture.nodes(), fixture.edges()),
                fixture.range().toRange(),
                fixture.types() == null ? List.of() : fixture.types(),
                Boolean.TRUE.equals(fixture.hasAny())))
                .stream()
                .map(plan -> plan.memberUserIds())
                .toList();

        assertThat(actualGroups).containsExactlyElementsOf(fixture.expectedGroups());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("priorityBatchFixtures")
    void priorityGeneratorMatchesJsonFixtures(String ignoredName, PriorityBatchFixture fixture) {
        EventGeneratorByPriority generator = new EventGeneratorByPriority();

        List<String> invitedUserIds = generator.generate(new PriorityGeneratorRequest(
                "fixture-owner",
                buildGraph(fixture.nodes(), fixture.edges()),
                fixture.candidateUserIds() == null ? Set.of() : new LinkedHashSet<>(fixture.candidateUserIds()),
                fixture.lockedUserIds() == null ? Set.of() : new LinkedHashSet<>(fixture.lockedUserIds()),
                fixture.range().toRange(),
                fixture.types() == null ? List.of() : fixture.types(),
                Boolean.TRUE.equals(fixture.hasAny()),
                fixture.minWeight() == null ? 0d : fixture.minWeight()))
                .invitedUserIds();

        assertThat(invitedUserIds).containsExactlyElementsOf(fixture.expectedInvitedUserIds());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("weightBetweenFixtures")
    void fGraphWeightBetweenMatchesJsonFixtures(String ignoredName, WeightBetweenFixture fixture) {
        FGraph graph = buildGraph(fixture.nodes(), fixture.edges());

        assertThat(graph.weightBetween(fixture.leftUserId(), fixture.rightUserId()))
                .isEqualTo(fixture.expectedWeight());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("filterFixtures")
    void fGraphFilterMatchesJsonFixtures(String ignoredName, FilterFixture fixture) {
        FGraph filteredGraph = buildGraph(fixture.nodes(), fixture.edges()).filter(
                fixture.candidateUserIds() == null ? Set.of() : new LinkedHashSet<>(fixture.candidateUserIds()),
                fixture.disabledUserIds() == null ? Set.of() : new LinkedHashSet<>(fixture.disabledUserIds()),
                fixture.minWeight() == null ? 0d : fixture.minWeight());

        assertThat(filteredGraph.getNodes().keySet()).containsExactlyElementsOf(fixture.expectedNodeIds());
        assertThat(filteredGraph.getIgnoredNodes().stream().map(Node::getId).sorted().toList())
                .containsExactlyElementsOf(fixture.expectedIgnoredNodeIds());
        assertThat(filteredGraph.getEdges().stream().map(this::toPair).sorted().toList())
                .containsExactlyElementsOf(fixture.expectedEdgePairs().stream().sorted().toList());
    }

    private static Stream<Arguments> randomGroupFixtures() {
        return loadFixtureMaps("algo/fixtures/random-groups.json").stream()
                .map(AlgorithmJsonFixturesTest::toRandomGroupFixture)
                .map(fixture -> Arguments.of(fixture.name(), fixture));
    }

    private static Stream<Arguments> priorityBatchFixtures() {
        return loadFixtureMaps("algo/fixtures/priority-batches.json").stream()
                .map(AlgorithmJsonFixturesTest::toPriorityBatchFixture)
                .map(fixture -> Arguments.of(fixture.name(), fixture));
    }

    private static Stream<Arguments> weightBetweenFixtures() {
        return loadFixtureMaps("algo/fixtures/fgraph-weight-between.json").stream()
                .map(AlgorithmJsonFixturesTest::toWeightBetweenFixture)
                .map(fixture -> Arguments.of(fixture.name(), fixture));
    }

    private static Stream<Arguments> filterFixtures() {
        return loadFixtureMaps("algo/fixtures/fgraph-filter.json").stream()
                .map(AlgorithmJsonFixturesTest::toFilterFixture)
                .map(fixture -> Arguments.of(fixture.name(), fixture));
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> loadFixtureMaps(String resourcePath) {
        try (InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                throw new IllegalStateException("Missing fixture resource: " + resourcePath);
            }
            String json = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            return JSON_PARSER.parseList(json).stream()
                    .map(item -> (Map<String, Object>) item)
                    .toList();
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to read fixture resource: " + resourcePath, exception);
        }
    }

    @SuppressWarnings("unchecked")
    private static RandomGroupFixture toRandomGroupFixture(Map<String, Object> value) {
        return new RandomGroupFixture(
                asString(value.get("name")),
                toRangeFixture((Map<String, Object>) value.get("range")),
                asStringList(value.get("types")),
                asBoolean(value.get("hasAny")),
                toNodeFixtures(value.get("nodes")),
                toEdgeFixtures(value.get("edges")),
                toStringMatrix(value.get("expectedGroups")));
    }

    @SuppressWarnings("unchecked")
    private static PriorityBatchFixture toPriorityBatchFixture(Map<String, Object> value) {
        return new PriorityBatchFixture(
                asString(value.get("name")),
                toRangeFixture((Map<String, Object>) value.get("range")),
                asStringList(value.get("types")),
                asBoolean(value.get("hasAny")),
                asDoubleObject(value.get("minWeight")),
                asStringList(value.get("candidateUserIds")),
                asStringList(value.get("lockedUserIds")),
                toNodeFixtures(value.get("nodes")),
                toEdgeFixtures(value.get("edges")),
                asStringList(value.get("expectedInvitedUserIds")));
    }

    private static WeightBetweenFixture toWeightBetweenFixture(Map<String, Object> value) {
        return new WeightBetweenFixture(
                asString(value.get("name")),
                toNodeFixtures(value.get("nodes")),
                toEdgeFixtures(value.get("edges")),
                asString(value.get("leftUserId")),
                asString(value.get("rightUserId")),
                asDouble(value.get("expectedWeight")));
    }

    private static FilterFixture toFilterFixture(Map<String, Object> value) {
        return new FilterFixture(
                asString(value.get("name")),
                toNodeFixtures(value.get("nodes")),
                toEdgeFixtures(value.get("edges")),
                asStringList(value.get("candidateUserIds")),
                asStringList(value.get("disabledUserIds")),
                asDoubleObject(value.get("minWeight")),
                asStringList(value.get("expectedNodeIds")),
                asStringList(value.get("expectedIgnoredNodeIds")),
                asStringList(value.get("expectedEdgePairs")));
    }

    private static FGraph buildGraph(List<NodeFixture> nodes, List<EdgeFixture> edges) {
        Map<String, Node> nodesById = new LinkedHashMap<>();
        if (nodes != null) {
            for (NodeFixture node : nodes) {
                if (node != null && node.id() != null && !node.id().isBlank()) {
                    nodesById.put(node.id(), new Node(node.id(), node.type()));
                }
            }
        }

        List<Edge> graphEdges = new ArrayList<>();
        if (edges != null) {
            for (EdgeFixture edge : edges) {
                if (edge == null || edge.from() == null || edge.to() == null || edge.from().isBlank() || edge.to().isBlank()) {
                    continue;
                }
                Node from = nodesById.computeIfAbsent(edge.from(), key -> new Node(key));
                Node to = nodesById.computeIfAbsent(edge.to(), key -> new Node(key));
                graphEdges.add(new Edge(from, to, edge.weight()));
            }
        }
        return new FGraph(nodesById, graphEdges);
    }

    private String toPair(Edge edge) {
        String left = edge.getFrom().getId();
        String right = edge.getTo().getId();
        return left.compareTo(right) <= 0 ? left + ":" + right : right + ":" + left;
    }

    @SuppressWarnings("unchecked")
    private static List<NodeFixture> toNodeFixtures(Object value) {
        if (!(value instanceof List<?> listValue)) {
            return List.of();
        }
        List<NodeFixture> nodes = new ArrayList<>();
        for (Object item : listValue) {
            if (!(item instanceof Map<?, ?> rawMap)) {
                continue;
            }
            Map<String, Object> map = (Map<String, Object>) rawMap;
            nodes.add(new NodeFixture(asString(map.get("id")), asString(map.get("type"))));
        }
        return nodes;
    }

    @SuppressWarnings("unchecked")
    private static List<EdgeFixture> toEdgeFixtures(Object value) {
        if (!(value instanceof List<?> listValue)) {
            return List.of();
        }
        List<EdgeFixture> edges = new ArrayList<>();
        for (Object item : listValue) {
            if (!(item instanceof Map<?, ?> rawMap)) {
                continue;
            }
            Map<String, Object> map = (Map<String, Object>) rawMap;
            edges.add(new EdgeFixture(
                    asString(map.get("from")),
                    asString(map.get("to")),
                    asDouble(map.get("weight"))));
        }
        return edges;
    }

    private static List<List<String>> toStringMatrix(Object value) {
        if (!(value instanceof List<?> rows)) {
            return List.of();
        }
        List<List<String>> matrix = new ArrayList<>();
        for (Object row : rows) {
            matrix.add(asStringList(row));
        }
        return matrix;
    }

    private static List<String> asStringList(Object value) {
        if (!(value instanceof List<?> listValue)) {
            return List.of();
        }
        List<String> values = new ArrayList<>();
        for (Object item : listValue) {
            values.add(asString(item));
        }
        return values;
    }

    private static RangeFixture toRangeFixture(Map<String, Object> value) {
        return new RangeFixture(asInt(value == null ? null : value.get("min")), asInt(value == null ? null : value.get("max")));
    }

    private static String asString(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private static boolean asBoolean(Object value) {
        if (value instanceof Boolean booleanValue) {
            return booleanValue;
        }
        return Boolean.parseBoolean(asString(value));
    }

    private static int asInt(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        String text = asString(value);
        return text.isEmpty() ? 0 : Integer.parseInt(text);
    }

    private static double asDouble(Object value) {
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        String text = asString(value);
        return text.isEmpty() ? 0d : Double.parseDouble(text);
    }

    private static Double asDoubleObject(Object value) {
        return value == null ? null : asDouble(value);
    }

    private record NodeFixture(
            String id,
            String type) {
    }

    private record EdgeFixture(
            String from,
            String to,
            double weight) {
    }

    private record RangeFixture(
            int min,
            int max) {
        Range toRange() {
            return Range.of(min, max);
        }
    }

    private record RandomGroupFixture(
            String name,
            RangeFixture range,
            List<String> types,
            Boolean hasAny,
            List<NodeFixture> nodes,
            List<EdgeFixture> edges,
            List<List<String>> expectedGroups) {
    }

    private record PriorityBatchFixture(
            String name,
            RangeFixture range,
            List<String> types,
            Boolean hasAny,
            Double minWeight,
            List<String> candidateUserIds,
            List<String> lockedUserIds,
            List<NodeFixture> nodes,
            List<EdgeFixture> edges,
            List<String> expectedInvitedUserIds) {
    }

    private record WeightBetweenFixture(
            String name,
            List<NodeFixture> nodes,
            List<EdgeFixture> edges,
            String leftUserId,
            String rightUserId,
            double expectedWeight) {
    }

    private record FilterFixture(
            String name,
            List<NodeFixture> nodes,
            List<EdgeFixture> edges,
            List<String> candidateUserIds,
            List<String> disabledUserIds,
            Double minWeight,
            List<String> expectedNodeIds,
            List<String> expectedIgnoredNodeIds,
            List<String> expectedEdgePairs) {
    }
}
