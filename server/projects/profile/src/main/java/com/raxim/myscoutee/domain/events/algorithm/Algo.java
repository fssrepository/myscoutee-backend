package com.raxim.myscoutee.domain.events.algorithm;

import java.util.List;
import java.util.Set;
import com.raxim.myscoutee.domain.events.algorithm.dto.FGraph;
import com.raxim.myscoutee.domain.events.algorithm.dto.Node;
import com.raxim.myscoutee.domain.events.algorithm.dto.Range;

public class Algo {
    private final StableGroupPlanner stableGroupPlanner = new StableGroupPlanner();

    public List<Set<Node>> run(FGraph fGraph, List<String> types, Range range, boolean hasAny) {
        if (fGraph == null || range == null) {
            return List.of();
        }
        return stableGroupPlanner.planGroups(fGraph, types, range, hasAny);
    }

    public List<Set<Node>> run(FGraph fGraph, List<String> types, List<Range> ranges, boolean hasAny) {
        if (fGraph == null || ranges == null || ranges.isEmpty()) {
            return List.of();
        }
        return stableGroupPlanner.planGroups(fGraph, types, ranges, hasAny);
    }

    public Set<Node> selectInviteBatch(
            FGraph graph,
            Set<String> candidateUserIds,
            Set<String> lockedUserIds,
            Range range,
            List<String> types,
            boolean hasAny,
            double minWeight) {
        if (graph == null || range == null) {
            return Set.of();
        }
        return stableGroupPlanner.planInviteBatch(graph, candidateUserIds, lockedUserIds, range, types, hasAny, minWeight);
    }
}
