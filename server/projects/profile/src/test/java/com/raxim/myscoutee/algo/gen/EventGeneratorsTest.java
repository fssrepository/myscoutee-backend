package com.raxim.myscoutee.algo.gen;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.algo.dto.Edge;
import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Node;
import com.raxim.myscoutee.algo.dto.Range;
import com.raxim.myscoutee.algo.gen.GeneratorModels.FifaMatch;
import com.raxim.myscoutee.algo.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.LeaderboardMember;
import com.raxim.myscoutee.algo.gen.GeneratorModels.PriorityGeneratorRequest;
import com.raxim.myscoutee.algo.gen.GeneratorModels.RandomGeneratorRequest;
import com.raxim.myscoutee.algo.gen.GeneratorModels.ScoreGeneratorGroup;
import com.raxim.myscoutee.algo.gen.GeneratorModels.ScoreGeneratorResult;
import com.raxim.myscoutee.algo.gen.GeneratorModels.ScoreLeaderboardEntry;

class EventGeneratorsTest {

    @Test
    void randomGeneratorBuildsEventPlanFromStandaloneGraph() {
        EventGeneratorByRandom generator = new EventGeneratorByRandom();

        FGraph graph = graph(
                edge("u1", "u2", 0.9d),
                edge("u1", "u3", 0.8d),
                edge("u2", "u3", 0.85d),
                edge("u2", "u4", 0.75d),
                edge("u3", "u4", 0.7d));

        List<GeneratedEventPlan> plans = generator.generate(new RandomGeneratorRequest(
                graph,
                Range.of(4, 4),
                List.of(),
                false));

        assertThat(plans).singleElement().satisfies(plan -> {
            assertThat(plan.seedId()).isEqualTo("generated-1");
            assertThat(plan.memberUserIds()).containsExactly("u1", "u2", "u3", "u4");
        });
    }

    @Test
    void priorityGeneratorSkipsLockedUsersAndKeepsBestCandidateBatch() {
        EventGeneratorByPriority generator = new EventGeneratorByPriority();

        FGraph graph = graph(
                edge("u1", "u2", 0.95d),
                edge("u1", "u3", 0.92d),
                edge("u2", "u3", 0.9d),
                edge("u3", "u4", 0.15d));

        InviteBatchPlan plan = generator.generate(new PriorityGeneratorRequest(
                "event-1",
                graph,
                Set.of("u1", "u2", "u3", "u4"),
                Set.of("u3"),
                Range.of(2, 2),
                List.of(),
                true,
                0.5d));

        assertThat(plan.ownerId()).isEqualTo("event-1");
        assertThat(plan.invitedUserIds()).containsExactly("u1", "u2");
    }

    @Test
    void randomGeneratorPrefersPackableGroupSizesOverLeavingLargeRemainders() {
        EventGeneratorByRandom generator = new EventGeneratorByRandom();

        FGraph graph = graph(
                edge("u1", "u2", 0.9d), edge("u1", "u3", 0.9d), edge("u1", "u4", 0.9d), edge("u1", "u5", 0.9d), edge("u1", "u6", 0.9d), edge("u1", "u7", 0.9d), edge("u1", "u8", 0.9d), edge("u1", "u9", 0.9d),
                edge("u2", "u3", 0.9d), edge("u2", "u4", 0.9d), edge("u2", "u5", 0.9d), edge("u2", "u6", 0.9d), edge("u2", "u7", 0.9d), edge("u2", "u8", 0.9d), edge("u2", "u9", 0.9d),
                edge("u3", "u4", 0.9d), edge("u3", "u5", 0.9d), edge("u3", "u6", 0.9d), edge("u3", "u7", 0.9d), edge("u3", "u8", 0.9d), edge("u3", "u9", 0.9d),
                edge("u4", "u5", 0.9d), edge("u4", "u6", 0.9d), edge("u4", "u7", 0.9d), edge("u4", "u8", 0.9d), edge("u4", "u9", 0.9d),
                edge("u5", "u6", 0.9d), edge("u5", "u7", 0.9d), edge("u5", "u8", 0.9d), edge("u5", "u9", 0.9d),
                edge("u6", "u7", 0.9d), edge("u6", "u8", 0.9d), edge("u6", "u9", 0.9d),
                edge("u7", "u8", 0.9d), edge("u7", "u9", 0.9d),
                edge("u8", "u9", 0.9d));

        List<GeneratedEventPlan> plans = generator.generate(new RandomGeneratorRequest(
                graph,
                Range.of(4, 6),
                List.of(),
                false));

        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(plan -> plan.memberUserIds().size()).containsExactly(5, 4);
    }

    @Test
    void priorityGeneratorPrefersCandidatesConnectedToLockedGroup() {
        EventGeneratorByPriority generator = new EventGeneratorByPriority();

        FGraph graph = graph(
                edge("locked-1", "u1", 1.0d),
                edge("locked-1", "u2", 0.8d),
                edge("u1", "u3", 0.95d),
                edge("u2", "u3", 0.1d));

        InviteBatchPlan plan = generator.generate(new PriorityGeneratorRequest(
                "event-2",
                graph,
                Set.of("u1", "u2", "u3"),
                Set.of("locked-1"),
                Range.of(2, 2),
                List.of(),
                true,
                0.05d));

        assertThat(plan.invitedUserIds()).containsExactly("u1", "u2");
    }

    @Test
    void priorityGeneratorCanReturnPartialBatchWhenHasAnyIsEnabled() {
        EventGeneratorByPriority generator = new EventGeneratorByPriority();

        FGraph graph = graph(
                edge("locked-1", "u1", 0.7d));

        InviteBatchPlan plan = generator.generate(new PriorityGeneratorRequest(
                "event-3",
                graph,
                Set.of("u1"),
                Set.of("locked-1"),
                Range.of(2, 2),
                List.of(),
                true,
                0.1d));

        assertThat(plan.invitedUserIds()).containsExactly("u1");
    }

    @Test
    void scoreGeneratorComputesScoreAndFifaLeaderboardsWithAdvancingMembers() {
        EventGeneratorByScore generator = new EventGeneratorByScore();

        ScoreGeneratorGroup scoreGroup = new ScoreGeneratorGroup(
                "group-score",
                "Score",
                2,
                List.of(
                        new LeaderboardMember("u1", "Alice"),
                        new LeaderboardMember("u2", "Bob"),
                        new LeaderboardMember("u3", "Clara")),
                List.of(
                        new ScoreLeaderboardEntry("u2", 3, 1000L),
                        new ScoreLeaderboardEntry("u1", 5, 2000L),
                        new ScoreLeaderboardEntry("u2", 4, 3000L),
                        new ScoreLeaderboardEntry("u3", 2, 4000L)),
                List.of());

        ScoreGeneratorGroup fifaGroup = new ScoreGeneratorGroup(
                "group-fifa",
                "Fifa",
                2,
                List.of(
                        new LeaderboardMember("u1", "Alice"),
                        new LeaderboardMember("u2", "Bob"),
                        new LeaderboardMember("u3", "Clara")),
                List.of(),
                List.of(
                        new FifaMatch("u1", "u2", 2, 0, 1000L),
                        new FifaMatch("u2", "u3", 1, 1, 2000L),
                        new FifaMatch("u3", "u1", 3, 1, 3000L)));

        List<ScoreGeneratorResult> results = generator.generate(List.of(scoreGroup, fifaGroup));

        assertThat(results).hasSize(2);

        ScoreGeneratorResult scoreResult = resultByGroupId(results).get("group-score");
        assertThat(scoreResult.advancingMemberIds()).containsExactly("u2", "u1");
        assertThat(scoreResult.scoreRows())
                .extracting(row -> row.memberId() + ":" + row.total() + ":" + row.updates())
                .containsExactly("u2:7:2", "u1:5:1", "u3:2:1");

        ScoreGeneratorResult fifaResult = resultByGroupId(results).get("group-fifa");
        assertThat(fifaResult.advancingMemberIds()).containsExactly("u3", "u1");
        assertThat(fifaResult.fifaRows())
                .extracting(row -> row.memberId() + ":" + row.points() + ":" + row.goalDiff())
                .containsExactly("u3:4:2", "u1:3:0", "u2:1:-2");
    }

    private Map<String, ScoreGeneratorResult> resultByGroupId(List<ScoreGeneratorResult> results) {
        Map<String, ScoreGeneratorResult> resultsByGroupId = new LinkedHashMap<>();
        for (ScoreGeneratorResult result : results) {
            resultsByGroupId.put(result.groupId(), result);
        }
        return resultsByGroupId;
    }

    private FGraph graph(Edge... edges) {
        Map<String, Node> nodes = new LinkedHashMap<>();
        for (Edge edge : edges) {
            nodes.putIfAbsent(edge.getFrom().getId(), edge.getFrom());
            nodes.putIfAbsent(edge.getTo().getId(), edge.getTo());
        }
        return new FGraph(nodes, List.of(edges));
    }

    private Edge edge(String leftUserId, String rightUserId, double weight) {
        return new Edge(new Node(leftUserId), new Node(rightUserId), weight);
    }
}
