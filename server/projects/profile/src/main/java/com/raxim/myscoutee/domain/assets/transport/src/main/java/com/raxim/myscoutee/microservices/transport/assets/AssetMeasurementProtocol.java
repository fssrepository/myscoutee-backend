package com.raxim.myscoutee.microservices.transport.assets;

public final class AssetMeasurementProtocol {
    private AssetMeasurementProtocol() {}
    public static final String BOOKINGS = "/_internal/v1/assets/asset-measurement/bookings";
    public static String[] paths() { return new String[]{BOOKINGS}; }
}
