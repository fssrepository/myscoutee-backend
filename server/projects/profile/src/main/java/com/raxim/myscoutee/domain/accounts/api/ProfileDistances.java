package com.raxim.myscoutee.domain.accounts.api;

public final class ProfileDistances {
    private ProfileDistances() {}
    public static Double distance(WorkspaceProfile owner, WorkspaceProfile viewer) {
        var a = owner.getLocationCoordinates(); var b = viewer.getLocationCoordinates();
        if (a == null || b == null || a.latitude() == null || a.longitude() == null || b.latitude() == null || b.longitude() == null) return null;
        double h = Math.pow(Math.sin(Math.toRadians(b.latitude() - a.latitude()) / 2), 2)
            + Math.cos(Math.toRadians(a.latitude())) * Math.cos(Math.toRadians(b.latitude()))
            * Math.pow(Math.sin(Math.toRadians(b.longitude() - a.longitude()) / 2), 2);
        return Math.round(12742 * Math.asin(Math.sqrt(Math.min(1, h))) * 10.0) / 10.0;
    }
}
