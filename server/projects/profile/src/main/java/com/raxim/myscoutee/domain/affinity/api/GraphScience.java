package com.raxim.myscoutee.domain.affinity.api;

import java.util.Map;
public interface GraphScience {
    GraphScienceResult refresh(String statsKey, Map<String, Map<String, Long>> existing);
    record GraphScienceResult(
            int healthScore,
            String healthLabelKey,
            String insightKey,
            Map<String, Long> metrics,
            Map<String, Long> bridgeUsers,
            Map<String, Long> communities,
            Map<String, Long> signals,
            Map<String, Map<String, Long>> dailyGraphActivity) {}
}
