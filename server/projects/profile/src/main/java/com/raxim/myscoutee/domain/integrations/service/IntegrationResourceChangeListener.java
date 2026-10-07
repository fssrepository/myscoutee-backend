package com.raxim.myscoutee.domain.integrations.service;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;

@Component
public class IntegrationResourceChangeListener extends AbstractMongoEventListener<Object> {
    private final IntegrationWebhookService webhookService;

    public IntegrationResourceChangeListener(IntegrationWebhookService webhookService) {
        this.webhookService = webhookService;
    }

    @Override
    public void onAfterSave(AfterSaveEvent<Object> event) {
        Object source = event == null ? null : event.getSource();
        if (source instanceof ActivityEvent activityEvent) {
            webhookService.enqueue(activityEvent);
        } else if (source instanceof ActivityMember activityMember) {
            webhookService.enqueue(activityMember);

        }
    }
}
