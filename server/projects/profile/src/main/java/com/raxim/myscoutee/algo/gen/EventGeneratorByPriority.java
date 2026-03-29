package com.raxim.myscoutee.algo.gen;

import java.util.List;
import java.util.Set;

import com.raxim.myscoutee.algo.Algo;
import com.raxim.myscoutee.algo.dto.Node;

public class EventGeneratorByPriority extends GeneratorBase<GeneratorModels.PriorityGeneratorRequest, GeneratorModels.InviteBatchPlan> {

    @Override
    public GeneratorModels.InviteBatchPlan generate(GeneratorModels.PriorityGeneratorRequest input) {
        if (input == null || input.graph() == null || input.range() == null) {
            return new GeneratorModels.InviteBatchPlan(input == null ? "" : input.ownerId(), List.of());
        }

        Algo algo = new Algo();
        Set<Node> selectedNodes = algo.selectInviteBatch(
                input.graph(),
                input.candidateUserIds(),
                input.lockedUserIds(),
                input.range(),
                input.types() == null ? List.of() : input.types(),
                input.hasAny(),
                input.minWeight());

        List<String> invitedUserIds = selectedNodes.stream()
                .map(Node::getId)
                .toList();

        return new GeneratorModels.InviteBatchPlan(input.ownerId(), invitedUserIds);
    }
}
