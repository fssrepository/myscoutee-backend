package com.raxim.myscoutee.microservices.transport.affinity;

public final class RatingMeasurementProtocol {
    private RatingMeasurementProtocol() {}
    public static final String RATES = "/_internal/v1/affinity/rating-measurement/rates";
    public static String[] paths() { return new String[]{RATES}; }
}
