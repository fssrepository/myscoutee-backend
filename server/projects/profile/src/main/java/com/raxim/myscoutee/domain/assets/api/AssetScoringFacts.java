package com.raxim.myscoutee.domain.assets.api;

import java.util.List;

/** Asset-owned content/capacity inputs read by the existing affinity formulas. */
public interface AssetScoringFacts {
    String getType();
    String getTitle();
    String getSubtitle();
    String getCategory();
    String getCity();
    String getVisibility();
    String getDetails();
    List<String> getRoutes();
    List<? extends Policy> getPolicies();
    List<? extends Request> getRequests();
    Integer getCapacityTotal();
    Integer getQuantity();
    String getUpdatedDate();
    String getCreatedDate();
    interface Policy { String title(); String description(); Boolean required(); }
    interface Request { String status(); }

    /** Common record bridge for the existing asset content facts. */
    interface RecordFields extends AssetScoringFacts {
        String type();
        @Override default String getType() { return type(); }
        String title();
        @Override default String getTitle() { return title(); }
        String subtitle();
        @Override default String getSubtitle() { return subtitle(); }
        String category();
        @Override default String getCategory() { return category(); }
        String city();
        @Override default String getCity() { return city(); }
    }
}
