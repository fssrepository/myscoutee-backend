package com.raxim.myscoutee.algo.gen;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.raxim.myscoutee.algo.Algo;
import com.raxim.myscoutee.algo.dto.Node;

public class EventGeneratorByRandom implements EventGenerator<GeneratorModels.RandomGeneratorRequest, List<GeneratorModels.GeneratedEventPlan>> {

    @Override
    public List<GeneratorModels.GeneratedEventPlan> generate(GeneratorModels.RandomGeneratorRequest input) {
        if (input == null || input.graph() == null || input.range() == null) {
            return List.of();
        }

        Algo algo = new Algo();
        List<Set<Node>> groups = algo.run(
                input.graph(),
                input.types() == null ? List.of() : input.types(),
                input.range(),
                input.hasAny());

        List<GeneratorModels.GeneratedEventPlan> plans = new ArrayList<>();
        int index = 1;
        for (Set<Node> group : groups) {
            List<String> memberUserIds = group.stream()
                    .map(Node::getId)
                    .sorted()
                    .toList();
            if (!memberUserIds.isEmpty()) {
                plans.add(new GeneratorModels.GeneratedEventPlan("generated-" + index, memberUserIds));
                index += 1;
            }
        }
        return plans;
    }

    public List<GeneratorModels.GeneratedEventPlan> generateTargets(GeneratorModels.RandomTargetedGeneratorRequest input) {
        if (input == null || input.graph() == null || input.targets() == null || input.targets().isEmpty()) {
            return List.of();
        }

        List<GeneratorModels.RandomGroupTarget> targets = input.targets().stream()
                .filter(target -> target != null && target.range() != null)
                .toList();
        if (targets.isEmpty()) {
            return List.of();
        }

        Algo algo = new Algo();
        List<Set<Node>> groups = algo.run(
                input.graph(),
                input.types() == null ? List.of() : input.types(),
                targets.stream().map(GeneratorModels.RandomGroupTarget::range).toList(),
                input.hasAny());

        List<GeneratorModels.GeneratedEventPlan> plans = new ArrayList<>();
        for (int index = 0; index < Math.min(groups.size(), targets.size()); index += 1) {
            GeneratorModels.RandomGroupTarget target = targets.get(index);
            Set<Node> group = groups.get(index);
            List<String> memberUserIds = group.stream()
                    .map(Node::getId)
                    .sorted()
                    .toList();
            plans.add(new GeneratorModels.GeneratedEventPlan(target.targetId(), memberUserIds));
        }
        return plans;
    }
}
