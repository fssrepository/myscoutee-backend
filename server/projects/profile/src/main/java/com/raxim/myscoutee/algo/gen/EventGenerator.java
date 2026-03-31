package com.raxim.myscoutee.algo.gen;

public interface EventGenerator<I, O> {

    O generate(I input);
}
