package com.raxim.myscoutee.domain.events.algorithm;

import java.util.Iterator;
import java.util.NoSuchElementException;

import com.raxim.myscoutee.domain.events.algorithm.dto.CGroup;
import com.raxim.myscoutee.domain.events.algorithm.dto.Edge;
import com.raxim.myscoutee.domain.events.algorithm.dto.Node;
import com.raxim.myscoutee.domain.events.algorithm.dto.Range;

public class BCTreeIterator implements Iterator<CGroup> {

    private final BCTree bcTree;
    private final Range range;
    private final boolean hasAny;
    private final CTreeIterator cTreeIterator;

    private CGroup cTree = new CGroup();

    public BCTreeIterator(BCTree bcTree,
            final Range range, boolean hasAny) {

        this.bcTree = bcTree;
        this.hasAny = hasAny;
        this.cTreeIterator = (CTreeIterator) bcTree.getcTree().iterator();

        int min = range.getMin() < 2 ? 2 : range.getMin() + (range.getMin() % cTreeIterator.getTypes().size());
        int max = range.getMax() - (range.getMax() % cTreeIterator.getTypes().size());
        // 'max' should be dividable by number of types
        this.range = new Range(min, max);
    }

    private CGroup nextGroup = null;

    @Override
    public boolean hasNext() {
        if (nextGroup == null) {
            nextGroup = computeNextGroup(); // Move handleGroup logic here
        }
        return nextGroup != null && (hasAny ? hasAnyRemaining(nextGroup) : hasRemaining(nextGroup));
    }

    private CGroup computeNextGroup() {
        // If the underlying iterator is empty, we can't build a new group
        if (!cTreeIterator.hasNext()) {
            return null;
        }

        CGroup candidateGroup = new CGroup();

        while (candidateGroup.size() < this.range.getMax() && cTreeIterator.hasNext()) {
            Node from = null;
            Node to = null;
            Edge edge;

            do {
                edge = cTreeIterator.next();

                if (from == null && !cTree.contains(edge.getFrom())) {
                    from = edge.getFrom();
                }

                if (to == null && !cTree.contains(edge.getTo())) {
                    to = edge.getTo();
                }

                candidateGroup.add(edge);

            } while ((edge.getFrom() == null || edge.getTo() == null) && cTreeIterator.hasNext());

            if (from != null && !bcTree.getUsedNodes().contains(from)) {
                candidateGroup.add(from);
            }
            if (to != null && !bcTree.getUsedNodes().contains(to)) {
                candidateGroup.add(to);
            }
            
            // Maintain the historical state of what has been processed
            cTree.addAll(candidateGroup);
        }

        candidateGroup.balance(cTreeIterator.getTypes());
        return candidateGroup;
    }

    private boolean hasRemaining(CGroup group) {
        return group != null 
                && group.size() >= this.range.getMin()
                && (group.size() % cTreeIterator.getTypes().size() == 0);
    }

    private boolean hasAnyRemaining(CGroup group) {
        return group != null 
                && group.size() > 0
                && (group.size() % cTreeIterator.getTypes().size() == 0);
    }

    @Override
    public CGroup next() {
        if (!hasNext()) throw new NoSuchElementException();
        CGroup result = nextGroup;
        nextGroup = null; // Clear the buffer
        return result;
    }
}
