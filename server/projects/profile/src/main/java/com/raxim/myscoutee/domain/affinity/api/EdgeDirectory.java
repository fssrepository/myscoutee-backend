package com.raxim.myscoutee.domain.affinity.api;
public interface EdgeDirectory {
    java.util.List<? extends EdgeView> findAll();
    java.util.List<? extends EdgeView> findRelevantByUserIds(java.util.List<String> ids);

    /** Existing single batch lookup, projected to the maximum positive weight per unordered pair. */
    static java.util.Map<String, Double> weightsByPairKey(java.util.List<? extends EdgeView> edges) {
        java.util.Map<String, Double> result = new java.util.LinkedHashMap<>();
        for (EdgeView edge : edges) {
            String left = edge == null || edge.getLeftUserId() == null ? "" : edge.getLeftUserId().trim();
            String right = edge == null || edge.getRightUserId() == null ? "" : edge.getRightUserId().trim();
            if (!org.springframework.util.StringUtils.hasText(left) || !org.springframework.util.StringUtils.hasText(right) || left.equals(right)) continue;
            double weight = edgeWeight(edge);
            if (weight <= 0d) continue;
            String key = left.compareTo(right) <= 0 ? left + ":" + right : right + ":" + left;
            Double existing = result.get(key);
            if (existing == null || weight > existing) result.put(key, weight);
        }
        return result;
    }
    private static double edgeWeight(EdgeView edge) {
        if (edge == null) return 0d;
        Double value = edge.getEdgeWeight();
        if (value == null || !Double.isFinite(value) || value <= 0d) value = edge.getAffinityScore();
        return value == null || !Double.isFinite(value) ? 0d : Math.max(0d, Math.min(1d, value));
    }

}
