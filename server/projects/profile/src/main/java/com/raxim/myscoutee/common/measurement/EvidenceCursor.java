package com.raxim.myscoutee.common.measurement;
public interface EvidenceCursor extends java.util.Iterator<MeasurementEvidence>, AutoCloseable {
    @Override void close();
}
