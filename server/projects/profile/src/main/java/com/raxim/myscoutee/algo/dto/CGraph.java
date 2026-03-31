package com.raxim.myscoutee.algo.dto;

import java.util.List;

import com.raxim.myscoutee.algo.util.Mergeable;
import com.raxim.myscoutee.algo.util.MergingSet;

/*
 * connected graph
 */
public class CGraph extends MergingSet<CNode> implements Mergeable<CGraph>, Comparable<CGraph> {
    public void addAll(List<Edge> edges) {
        edges.forEach(edge -> {
            add(edge);

            Edge edgeReversed = new Edge(edge.getTo(), edge.getFrom(), edge.getWeight());
            add(edgeReversed);
        });
    }

    public void add(Edge edge) {
        CNode aNode = new CNode(edge.getFrom());
        aNode.add(edge);

        super.add(aNode);
    }

    @Override
    public boolean canMerge(CGraph other) {
        return super.stream().anyMatch(cNode -> other.contains(cNode));
    }

    @Override
    public int compareTo(CGraph other) {
        if (other == null)
            return 1;
        // Compare graphs by their size (number of nodes)
        return Integer.compare(this.size(), other.size());
    }

    @Override
    public void merge(CGraph other) {
        if (other != null) {
            super.addAll(other);
        }
    }

    @Override
    public String toString() {
        CNode[] cNodes = super.toArray(new CNode[super.size()]);
        return "CGraph [nodesOrdered=" + cNodes + "]";
    }
}
