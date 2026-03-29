package com.raxim.myscoutee.algo.gen;

import java.util.List;
import java.util.Set;

import com.raxim.myscoutee.algo.Algo;
import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Node;

public class EventGeneratorByPriority extends GeneratorBase<GeneratorModels.PriorityGeneratorRequest, GeneratorModels.InviteBatchPlan> {

    @Override
    public GeneratorModels.InviteBatchPlan generate(GeneratorModels.PriorityGeneratorRequest input) {
        if (input == null || input.graph() == null || input.range() == null) {
            return new GeneratorModels.InviteBatchPlan(input == null ? "" : input.ownerId(), List.of());
        }

        FGraph filteredGraph = input.graph().filter(
                input.candidateUserIds(),
                input.lockedUserIds(),
                input.minWeight());

        Algo algo = new Algo();
        List<Set<Node>> candidateGroups = algo.run(
                filteredGraph,
                input.types() == null ? List.of() : input.types(),
                input.range(),
                input.hasAny());

        List<String> invitedUserIds = candidateGroups.stream()
                .findFirst()
                .orElse(Set.of())
                .stream()
                .map(Node::getId)
                .sorted()
                .toList();

        return new GeneratorModels.InviteBatchPlan(input.ownerId(), invitedUserIds);
    }
}
