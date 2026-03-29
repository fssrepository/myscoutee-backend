package com.raxim.myscoutee.algo.gen;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.raxim.myscoutee.algo.Algo;
import com.raxim.myscoutee.algo.dto.Node;

public class EventGeneratorByRandom extends GeneratorBase<GeneratorModels.RandomGeneratorRequest, List<GeneratorModels.GeneratedEventPlan>> {

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
}
