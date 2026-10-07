package com.raxim.myscoutee.domain.events.algorithm.dto;

import java.util.Comparator;
import java.util.PriorityQueue;

import com.raxim.myscoutee.domain.events.algorithm.util.Mergeable;

public class CNode implements Mergeable<CNode>, Comparable<CNode> {

    private final Node node;
    private PriorityQueue<Edge> edgesOrdered;

    public CNode(Node node) {
        this.node = node;
        this.edgesOrdered = new PriorityQueue<>(
                Comparator.comparing(Edge::getWeight).reversed().thenComparing(Edge::getFrom));
    }

    public Node getNode() {
        return node;
    }

    public int getDegree() {
        return edgesOrdered.size();
    }

    public Edge peek() {
        return edgesOrdered.peek();
    }

    public Edge poll() {
        Edge edge = edgesOrdered.poll();
        return edge;
    }

    public void add(Edge edge) {
        edgesOrdered.add(edge);
    }

    public void remove(Edge edge) {
        edgesOrdered.remove(edge);
    }

    public double getWeight() {
        return !this.edgesOrdered.isEmpty() ? this.peek().getWeight() : -1d;
    }

    @Override
    public String toString() {
        return "CNode [id=" + node + ", degree=" + this.getDegree() + ", toNodes=" + edgesOrdered + "]";
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((node == null) ? 0 : node.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        CNode other = (CNode) obj;
        if (node == null) {
            if (other.getNode() != null)
                return false;
        } else if (!node.equals(other.getNode()))
            return false;
        return true;
    }

    @Override
    public int compareTo(CNode other) {
        if (other == null)
            return 1;
        if (this.node == null || this.node.getId() == null)
            return -1;
        if (other.getNode() == null || other.getNode().getId() == null)
            return 1;

        return this.node.getId().compareTo(other.getNode().getId());
    }

    @Override
    public void merge(CNode other) {
        // AddAll is much more efficient than Stream.concat for PriorityQueues
        if (other != null && other.edgesOrdered != null) {
            this.edgesOrdered.addAll(other.edgesOrdered);
        }
    }

    @Override
    public boolean canMerge(CNode other) {
        return this.getNode().getId().equals(other.getNode().getId());
    }

}
