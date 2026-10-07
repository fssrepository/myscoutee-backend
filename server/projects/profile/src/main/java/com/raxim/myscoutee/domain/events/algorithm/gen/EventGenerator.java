package com.raxim.myscoutee.domain.events.algorithm.gen;

public interface EventGenerator<I, O> {

    O generate(I input);
}
