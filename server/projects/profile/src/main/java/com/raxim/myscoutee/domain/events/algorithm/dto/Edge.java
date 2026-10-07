package com.raxim.myscoutee.domain.events.algorithm.dto;

public class Edge {

    private final Node from;
    private final Node to;
    private final double weight;

    public Edge() {
        this(null, null, 0d);
    }

    public Node getFrom() {
        return from;
    }

    public Node getTo() {
        return to;
    }

    public double getWeight() {
        return weight;
    }

    public Edge(String from, String to) {
        this(new Node(from), new Node(to), 0);
    }

    public static Edge of(String from, String to) {
        return new Edge(from, to);
    }

    public Edge(Node from, Node to) {
        this(from, to, 0d);
    }

    public Edge(Node from, Node to, double weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    @Override
    public int hashCode() {
        int fromHash = from != null ? from.hashCode() : 0;
        int toHash = to != null ? to.hashCode() : 0;
        // Addition ensures A->B and B->A produce the exact same hash code
        return fromHash + toHash; 
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Edge)) return false;
        Edge other = (Edge) obj;
        
        // Handle undirected equality cleanly and null-safely
        boolean standard = java.util.Objects.equals(this.from, other.from) && 
                           java.util.Objects.equals(this.to, other.to);
        boolean reversed = java.util.Objects.equals(this.from, other.to) && 
                           java.util.Objects.equals(this.to, other.from);
        
        return standard || reversed;
    }

    @Override
    public String toString() {
        return "Edge [from=" + from + ", to=" + to + ", weight=" + weight + "]";
    }
}
