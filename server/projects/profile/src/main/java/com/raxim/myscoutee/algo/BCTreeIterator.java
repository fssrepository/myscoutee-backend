package com.raxim.myscoutee.algo;

import java.util.Iterator;

import com.raxim.myscoutee.algo.dto.CGroup;
import com.raxim.myscoutee.algo.dto.Edge;
import com.raxim.myscoutee.algo.dto.Node;
import com.raxim.myscoutee.algo.dto.Range;

public class BCTreeIterator implements Iterator<CGroup> {

    private final BCTree bcTree;
    private final Range range;
    private final boolean hasAny;
    private final CTreeIterator cTreeIterator;

    private CGroup cGroup = new CGroup();
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

    @Override
    public boolean hasNext() {
        handleGroup();
        return hasAny ? hasAnyRemaining() : hasRemaining();
    }

    private void handleGroup() {
        while (cGroup.size() < this.range.getMax()
                && cTreeIterator.hasNext()) {

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

                cGroup.add(edge);

            } while ((edge.getFrom() == null || edge.getTo() == null)
                    && cTreeIterator.hasNext());

            if (from != null && !bcTree.getUsedNodes().contains(from)) {
                cGroup.add(from);
            }
            if (to != null && !bcTree.getUsedNodes().contains(to)) {
                cGroup.add(to);
            }
            cTree.addAll(cGroup);
        }
        // System.out.println(cGroup);
        cGroup.balance(cTreeIterator.getTypes());
        // cTreeIterator.getUsed().addAll(nodes);
    }

    private boolean hasRemaining() {
        return cGroup.size() >= this.range.getMin()
                && (cGroup.size() % cTreeIterator.getTypes().size() == 0);
    }

    private boolean hasAnyRemaining() {
        return cGroup.size() > 0
                && (cGroup.size() % cTreeIterator.getTypes().size() == 0);
    }

    @Override
    public CGroup next() {
        CGroup result = (CGroup) cGroup.clone();
        cGroup = new CGroup();
        return result;
    }
}
