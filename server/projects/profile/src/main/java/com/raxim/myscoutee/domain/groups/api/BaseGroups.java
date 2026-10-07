package com.raxim.myscoutee.domain.groups.api;

import java.util.List;

public final class BaseGroups {
    private BaseGroups() {}
    public static final String WORK_BASE_ID = "myscoutee-work";
    public static final String COMMUNITY_BASE_ID = "myscoutee-community";
    public static final List<String> BASE_IDS = List.of(WORK_BASE_ID, COMMUNITY_BASE_ID);
    public static boolean isBaseId(String id) { return id != null && BASE_IDS.contains(id); }
    public static String baseIdForType(String type) {
        return "work".equals(type) ? WORK_BASE_ID : "community".equals(type) ? COMMUNITY_BASE_ID : null;
    }
}
