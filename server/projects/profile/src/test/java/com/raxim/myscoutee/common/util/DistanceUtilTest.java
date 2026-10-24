package com.raxim.myscoutee.common.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class DistanceUtilTest {
    @Test void identicalCoordinatesHaveZeroDistance() {
        assertEquals(0, DistanceUtil.haversineMeters(47.5, 19.0, 47.5, 19.0));
    }
    @Test void eventDistancesKeepTheirMetreRoundingAndRadius() {
        assertEquals(111195, DistanceUtil.haversineMeters(0, 0, 0, 1));
        assertEquals(111195, DistanceUtil.haversineMeters(0, 0, 1, 0));
        assertEquals(111195, DistanceUtil.haversineMeters(0, 1, 0, 0));
    }
    @Test void crossingTheDateLineUsesTheShortArc() {
        assertEquals(222390, DistanceUtil.haversineMeters(0, 179, 0, -179));
    }
}
