package com.raxim.myscoutee.domain.events.algorithm;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.events.algorithm.dto.CGraph;
import com.raxim.myscoutee.domain.events.algorithm.dto.Edge;
import com.raxim.myscoutee.domain.events.algorithm.dto.Node;

@org.junit.jupiter.api.Tag("standard")
class CTreeIteratorTest {
    @Test
    void repeatedAvailabilityChecksDoNotConsumeAnEdge() {
        CGraph graph = new CGraph();
        Edge first = new Edge(new Node("a"), new Node("b"), 3D);
        graph.addAll(List.of(first, new Edge(new Node("a"), new Node("c"), 2D),
                new Edge(new Node("b"), new Node("d"), 1D)));
        var iterator = new CTree(graph).iterator();
        assertThat(iterator.hasNext()).isTrue();
        assertThat(iterator.hasNext()).isTrue();
        assertThat(iterator.next()).isEqualTo(first);
        var rest = new ArrayList<Edge>();
        iterator.forEachRemaining(rest::add);
        assertThat(rest).hasSize(2);
        assertThat(rest).extracting(edge -> edge.getTo().getId()).containsExactlyInAnyOrder("c", "d");
        assertThat(iterator.hasNext()).isFalse();
        assertThatThrownBy(iterator::next).isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void ignoredConnectionsAreTraversedWithoutEmittingThemOrDisabledNodes() {
        Node a = new Node("a"), b = new Node("b"), c = new Node("c"), d = new Node("d");
        Edge ignored = new Edge(a, b, 4D), reversed = new Edge(b, a, 4D);
        CGraph graph = new CGraph();
        graph.addAll(List.of(ignored, new Edge(b, c, 3D), new Edge(c, d, 2D)));
        var edges = new ArrayList<Edge>();
        new CTree(graph, List.of(), List.of(Set.of(ignored)), Set.of(d))
                .forEach(edges::add);
        assertThat(edges).isNotEmpty().doesNotContain(ignored, reversed);
        assertThat(edges).allSatisfy(edge -> {
            assertThat(edge.getFrom()).isNotEqualTo(d);
            assertThat(edge.getTo()).isNotEqualTo(d);
        });
    }

    @Test
    void emptyGraphIsExhaustedEvenWhenNextIsCalledWithoutAnAvailabilityCheck() {
        var iterator = new CTree(new CGraph()).iterator();
        assertThat(iterator.hasNext()).isFalse();
        assertThatThrownBy(iterator::next).isInstanceOf(NoSuchElementException.class);
    }
}
