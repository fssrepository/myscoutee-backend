package com.raxim.myscoutee.domain.events.algorithm.gen;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.events.algorithm.dto.Edge;
import com.raxim.myscoutee.domain.events.algorithm.dto.FGraph;
import com.raxim.myscoutee.domain.events.algorithm.dto.Node;
import com.raxim.myscoutee.domain.events.algorithm.dto.Range;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.FifaMatch;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.GeneratedEventPlan;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.InviteBatchPlan;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.LeaderboardMember;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.MingleGeneratorRequest;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.MinglePreviousTable;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.MingleRoundPlan;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.PriorityGeneratorRequest;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.RandomGroupTarget;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.RandomGeneratorRequest;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.RandomTargetedGeneratorRequest;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.ScoreGeneratorGroup;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.ScoreGeneratorResult;
import com.raxim.myscoutee.domain.events.algorithm.gen.GeneratorModels.ScoreLeaderboardEntry;

@org.junit.jupiter.api.Tag("standard")
class EventGeneratorsTest {

    @Test
    void mingleGeneratorProjectsOneRoundWithoutMaterializingEventRecords() {
        EventGeneratorByMingle generator = new EventGeneratorByMingle();

        MingleRoundPlan plan = generator.generate(new MingleGeneratorRequest(
                new FGraph(),
                Set.of("u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8"),
                4,
                1,
                List.of(1, 2),
                List.of(),
                Map.of(),
                false));

        assertThat(plan.roundNumber()).isEqualTo(1);
        assertThat(plan.tables()).hasSize(2);
        assertThat(plan.tables()).flatExtracting(table -> table.memberUserIds())
                .containsExactlyInAnyOrder("u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8");
    }

    @Test
    void mingleGeneratorAvoidsPreviousPartnersWhenAnotherTableIsAvailable() {
        EventGeneratorByMingle generator = new EventGeneratorByMingle();

        MingleRoundPlan plan = generator.generate(new MingleGeneratorRequest(
                new FGraph(),
                Set.of("u1", "u2", "u3", "u4"),
                2,
                2,
                List.of(1, 2),
                List.of(
                        new MinglePreviousTable(1, 1, List.of("u1", "u2")),
                        new MinglePreviousTable(1, 2, List.of("u3", "u4"))),
                Map.of(),
                false));

        assertThat(plan.tables()).allSatisfy(table -> {
            assertThat(table.memberUserIds()).doesNotContainSequence("u1", "u2");
            assertThat(table.memberUserIds()).doesNotContainSequence("u3", "u4");
        });
    }

    @Test
    void mingleGeneratorRequiresBalancedPairsWhenConfigured() {
        EventGeneratorByMingle generator = new EventGeneratorByMingle();
        Map<String, String> genders = Map.of(
                "m1", "man",
                "m2", "man",
                "w1", "woman",
                "w2", "woman");

        MingleRoundPlan plan = generator.generate(new MingleGeneratorRequest(
                new FGraph(),
                genders.keySet(),
                2,
                1,
                List.of(1, 2),
                List.of(),
                genders,
                true));

        assertThat(plan.tables()).hasSize(2).allSatisfy(table -> {
            assertThat(table.memberUserIds()).hasSize(2);
            assertThat(table.memberUserIds().stream().map(genders::get))
                    .containsExactlyInAnyOrder("man", "woman");
        });
    }

    @Test
    void mingleGeneratorLeavesUnbalancedPairingOverflowWithoutATable() {
        EventGeneratorByMingle generator = new EventGeneratorByMingle();
        Map<String, String> genders = Map.of(
                "m1", "man",
                "m2", "man",
                "m3", "man",
                "w1", "woman");

        MingleRoundPlan plan = generator.generate(new MingleGeneratorRequest(
                new FGraph(),
                genders.keySet(),
                2,
                1,
                List.of(),
                List.of(),
                genders,
                true));

        assertThat(plan.tables()).singleElement().satisfies(table ->
                assertThat(table.memberUserIds().stream().map(genders::get))
                        .containsExactlyInAnyOrder("man", "woman"));
        assertThat(plan.tables()).flatExtracting(table -> table.memberUserIds()).hasSize(2);
    }

    @Test
    void mingleGeneratorNeverWaitlistsBecauseEveryPossiblePartnerIsARepeat() {
        EventGeneratorByMingle generator = new EventGeneratorByMingle();

        MingleRoundPlan plan = generator.generate(new MingleGeneratorRequest(
                new FGraph(),
                Set.of("u1", "u2", "u3", "u4"),
                2,
                3,
                List.of(1, 2),
                List.of(
                        new MinglePreviousTable(1, 1, List.of("u1", "u2", "u3", "u4")),
                        new MinglePreviousTable(2, 1, List.of("u1", "u2", "u3", "u4"))),
                Map.of(),
                false));

        assertThat(plan.tables()).flatExtracting(table -> table.memberUserIds())
                .containsExactlyInAnyOrder("u1", "u2", "u3", "u4");
    }

    @Test
    void mingleGeneratorKeepsBalancedParticipantsAssignedWhenRepeatsAreUnavoidable() {
        EventGeneratorByMingle generator = new EventGeneratorByMingle();
        Map<String, String> genders = Map.of(
                "m1", "man",
                "m2", "man",
                "w1", "woman",
                "w2", "woman");

        MingleRoundPlan plan = generator.generate(new MingleGeneratorRequest(
                new FGraph(),
                genders.keySet(),
                2,
                3,
                List.of(1, 2),
                List.of(new MinglePreviousTable(2, 1, List.of("m1", "m2", "w1", "w2"))),
                genders,
                true));

        assertThat(plan.tables()).hasSize(2).allSatisfy(table ->
                assertThat(table.memberUserIds().stream().map(genders::get))
                        .containsExactlyInAnyOrder("man", "woman"));
        assertThat(plan.tables()).flatExtracting(table -> table.memberUserIds())
                .containsExactlyInAnyOrder("m1", "m2", "w1", "w2");
    }

    @Test
    void mingleGeneratorWaitlistsOnlyPhysicalTableOverflow() {
        EventGeneratorByMingle generator = new EventGeneratorByMingle();

        MingleRoundPlan plan = generator.generate(new MingleGeneratorRequest(
                new FGraph(),
                Set.of("u1", "u2", "u3", "u4", "u5"),
                2,
                1,
                List.of(1, 2),
                List.of(),
                Map.of(),
                false));

        assertThat(plan.tables()).hasSize(2);
        assertThat(plan.tables()).flatExtracting(table -> table.memberUserIds()).hasSize(4);
    }

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
    void randomGeneratorCanTargetExplicitGroupSlots() {
        EventGeneratorByRandom generator = new EventGeneratorByRandom();

        FGraph graph = graph(
                edge("a1", "a2", 0.95d), edge("a1", "a3", 0.94d), edge("a1", "a4", 0.93d), edge("a1", "a5", 0.92d),
                edge("a2", "a3", 0.91d), edge("a2", "a4", 0.90d), edge("a2", "a5", 0.89d),
                edge("a3", "a4", 0.88d), edge("a3", "a5", 0.87d), edge("a4", "a5", 0.86d),
                edge("b1", "b2", 0.85d), edge("b1", "b3", 0.84d), edge("b2", "b3", 0.83d));

        List<GeneratedEventPlan> plans = generator.generateTargets(new RandomTargetedGeneratorRequest(
                graph,
                List.of(
                        new RandomGroupTarget("group-small", Range.of(3, 3)),
                        new RandomGroupTarget("group-large", Range.of(5, 5))),
                List.of(),
                false));

        assertThat(plans).hasSize(2);
        assertThat(plans.get(0).seedId()).isEqualTo("group-small");
        assertThat(plans.get(0).memberUserIds()).containsExactly("b1", "b2", "b3");
        assertThat(plans.get(1).seedId()).isEqualTo("group-large");
        assertThat(plans.get(1).memberUserIds()).containsExactly("a1", "a2", "a3", "a4", "a5");
    }

    @Test
    void randomTargetedGeneratorLeavesLowestAffinityCapacityOverflowUnassigned() {
        EventGeneratorByRandom generator = new EventGeneratorByRandom();

        FGraph graph = graph(
                edge("a1", "a2", 0.95d),
                edge("a1", "a3", 0.95d),
                edge("a2", "a3", 0.95d),
                edge("b1", "b2", 0.95d),
                edge("b1", "b3", 0.95d),
                edge("b2", "b3", 0.95d),
                edge("a1", "outside", 0.01d));

        List<GeneratedEventPlan> plans = generator.generateTargets(new RandomTargetedGeneratorRequest(
                graph,
                List.of(
                        new RandomGroupTarget("group-1", Range.of(3, 3)),
                        new RandomGroupTarget("group-2", Range.of(3, 3))),
                List.of(),
                false));

        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(GeneratedEventPlan::memberUserIds)
                .containsExactlyInAnyOrder(
                        List.of("a1", "a2", "a3"),
                        List.of("b1", "b2", "b3"));
        assertThat(plans).flatExtracting(GeneratedEventPlan::memberUserIds)
                .containsExactlyInAnyOrder("a1", "a2", "a3", "b1", "b2", "b3")
                .doesNotContain("outside");
    }

    @Test
    void randomTargetedGeneratorKeepsDisconnectedTreesAndExcludesOnlyIsolatedOverflow() {
        EventGeneratorByRandom generator = new EventGeneratorByRandom();
        Edge[] forestEdges = {
                edge("u1", "u2", 0.95d),
                edge("u2", "u3", 0.95d),
                edge("u3", "u4", 0.05d),
                edge("u4", "u5", 0.95d),
                edge("u5", "u6", 0.95d),
                edge("u7", "u8", 0.95d),
                edge("u8", "u9", 0.95d)
        };
        Map<String, Node> nodes = new LinkedHashMap<>();
        for (String userId : List.of(
                "u1", "u2", "u3", "u4", "u5", "u6",
                "u7", "u8", "u9",
                "isolated-1", "isolated-2")) {
            nodes.put(userId, new Node(userId));
        }
        FGraph graph = new FGraph(nodes, List.of(forestEdges));

        List<GeneratedEventPlan> plans = generator.generateTargets(
                new RandomTargetedGeneratorRequest(
                        graph,
                        List.of(
                                new RandomGroupTarget("group-1", Range.of(3, 3)),
                                new RandomGroupTarget("group-2", Range.of(3, 3)),
                                new RandomGroupTarget("group-3", Range.of(3, 3))),
                        List.of(),
                        false));

        assertThat(plans).hasSize(3);
        assertThat(plans).extracting(GeneratedEventPlan::memberUserIds)
                .containsExactlyInAnyOrder(
                        List.of("u1", "u2", "u3"),
                        List.of("u4", "u5", "u6"),
                        List.of("u7", "u8", "u9"));
        assertThat(plans).flatExtracting(GeneratedEventPlan::memberUserIds)
                .doesNotContain("isolated-1", "isolated-2");
    }

    @Test
    void randomTargetedGeneratorKeepsAValidPartialRemainderGroup() {
        EventGeneratorByRandom generator = new EventGeneratorByRandom();

        FGraph graph = graph(
                edge("a1", "a2", 0.95d),
                edge("a1", "a3", 0.95d),
                edge("a2", "a3", 0.95d),
                edge("b1", "b2", 0.95d),
                edge("b1", "b3", 0.95d),
                edge("b2", "b3", 0.95d),
                edge("c1", "c2", 0.95d));

        List<GeneratedEventPlan> plans = generator.generateTargets(new RandomTargetedGeneratorRequest(
                graph,
                List.of(
                        new RandomGroupTarget("group-1", Range.of(2, 3)),
                        new RandomGroupTarget("group-2", Range.of(2, 3)),
                        new RandomGroupTarget("group-3", Range.of(2, 3))),
                List.of(),
                false));

        assertThat(plans).hasSize(3);
        assertThat(plans).extracting(GeneratedEventPlan::memberUserIds)
                .containsExactlyInAnyOrder(
                        List.of("a1", "a2", "a3"),
                        List.of("b1", "b2", "b3"),
                        List.of("c1", "c2"));
        assertThat(plans).flatExtracting(GeneratedEventPlan::memberUserIds)
                .containsExactlyInAnyOrder("a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2");
    }

    @Test
    void randomTargetedGeneratorKeepsTheLongestValidTargetPrefix() {
        EventGeneratorByRandom generator = new EventGeneratorByRandom();

        FGraph graph = graph(
                edge("a1", "a2", 0.95d),
                edge("b1", "b2", 0.95d),
                edge("a1", "outside", 0.01d));

        List<GeneratedEventPlan> plans = generator.generateTargets(
                new RandomTargetedGeneratorRequest(
                        graph,
                        List.of(
                                new RandomGroupTarget("group-1", Range.of(2, 2)),
                                new RandomGroupTarget("group-2", Range.of(2, 2)),
                                new RandomGroupTarget("group-3", Range.of(2, 2))),
                        List.of(),
                        false));

        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(GeneratedEventPlan::seedId)
                .containsExactly("group-1", "group-2");
        assertThat(plans).flatExtracting(GeneratedEventPlan::memberUserIds)
                .containsExactlyInAnyOrder("a1", "a2", "b1", "b2")
                .doesNotContain("outside");
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
    void priorityGeneratorKeepsPlannerRankingOrder() {
        EventGeneratorByPriority generator = new EventGeneratorByPriority();

        FGraph graph = graph(
                edge("locked-1", "u9", 1.0d),
                edge("locked-1", "u1", 0.8d),
                edge("u9", "u1", 0.1d));

        InviteBatchPlan plan = generator.generate(new PriorityGeneratorRequest(
                "event-4",
                graph,
                Set.of("u1", "u9"),
                Set.of("locked-1"),
                Range.of(2, 2),
                List.of(),
                true,
                0.05d));

        assertThat(plan.invitedUserIds()).containsExactly("u9", "u1");
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

    @Test
    void scoreGeneratorNeverAdvancesCapacityPlaceholderMembers() {
        EventGeneratorByScore generator = new EventGeneratorByScore();

        ScoreGeneratorGroup group = new ScoreGeneratorGroup(
                "group-score",
                "Score",
                2,
                List.of(
                        new LeaderboardMember("u1", "Alice"),
                        new LeaderboardMember("u2", "Bob"),
                        new LeaderboardMember("group-score-member-1", "-----")),
                List.of(
                        new ScoreLeaderboardEntry("group-score-member-1", 100, 1000L),
                        new ScoreLeaderboardEntry("u1", 5, 2000L),
                        new ScoreLeaderboardEntry("u2", 3, 3000L)),
                List.of());

        ScoreGeneratorResult result = generator.generate(List.of(group)).getFirst();

        assertThat(result.scoreRows()).extracting(row -> row.memberId())
                .containsExactly("group-score-member-1", "u1", "u2");
        assertThat(result.advancingMemberIds()).containsExactly("u1", "u2");
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
