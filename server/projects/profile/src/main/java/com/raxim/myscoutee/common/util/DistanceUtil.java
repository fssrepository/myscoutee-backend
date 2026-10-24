package com.raxim.myscoutee.common.util;

import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

public class DistanceUtil {
    private static final double EARTH_RADIUS = 6370986.0; // meters

    public static double haversine(GeoJsonPoint a, GeoJsonPoint b) {
        double dLat = Math.toRadians(b.getX() - a.getX());
        double dLon = Math.toRadians(b.getY() - a.getY());
        double lat1 = Math.toRadians(a.getX());
        double lat2 = Math.toRadians(b.getX());
        double dist = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2)
                * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        double c = 2 * Math.asin(Math.sqrt(dist));
        return EARTH_RADIUS * c;
    }

    public static double vincenty(GeoJsonPoint a, GeoJsonPoint b) {
        double dLat = Math.toRadians(b.getX() - a.getX());
        double dLon = Math.toRadians(b.getY() - a.getY());
        double lat1 = Math.toRadians(a.getX());
        double lat2 = Math.toRadians(b.getX());
        double dist = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1)
                * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(dist), Math.sqrt(1 - dist));
        return EARTH_RADIUS * c;
    }
    /** Rounded event distance; preserves the event contract's 6,371,000 metre radius. */
    public static int haversineMeters(double fromLat, double fromLon, double toLat, double toLon) {
        double latitudeDelta = Math.toRadians(toLat - fromLat);
        double longitudeDelta = Math.toRadians(toLon - fromLon);
        double fromLatitude = Math.toRadians(fromLat);
        double toLatitude = Math.toRadians(toLat);
        double sinLatitude = Math.sin(latitudeDelta / 2d);
        double sinLongitude = Math.sin(longitudeDelta / 2d);
        double a = (sinLatitude * sinLatitude)
                + (Math.cos(fromLatitude) * Math.cos(toLatitude) * sinLongitude * sinLongitude);
        double c = 2d * Math.atan2(Math.sqrt(a), Math.sqrt(1d - a));
        return Math.max(0, (int) Math.round(6_371_000d * c));
    }

}
