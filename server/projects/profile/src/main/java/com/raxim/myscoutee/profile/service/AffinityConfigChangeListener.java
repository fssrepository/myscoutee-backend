package com.raxim.myscoutee.profile.service;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;

@Component
public class AffinityConfigChangeListener extends AbstractMongoEventListener<AffinityConfig> {
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;

    public AffinityConfigChangeListener(AffinityRecomputeTaskService affinityRecomputeTaskService) {
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
    }

    @Override
    public void onAfterSave(AfterSaveEvent<AffinityConfig> event) {
        AffinityConfig config = event == null ? null : event.getSource();
        if (config == null || !Boolean.TRUE.equals(config.getActive())) {
            return;
        }
        String configId = StringUtils.hasText(config.getKey()) ? config.getKey() : config.getId();
        affinityRecomputeTaskService.enqueueConfigChanged(configId, "system");
    }
}
