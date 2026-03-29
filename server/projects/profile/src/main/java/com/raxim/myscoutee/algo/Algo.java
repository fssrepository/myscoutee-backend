package com.raxim.myscoutee.algo;

import java.util.List;
import java.util.Set;
import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.dto.Node;
import com.raxim.myscoutee.algo.dto.Range;

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
