package com.raxim.myscoutee.domain.notifications.document;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notificationTemplates")
@lombok.Getter @lombok.Setter
public class NotificationTemplate extends com.raxim.myscoutee.common.mongo.MessageTemplateMetadata {

    @Indexed(name = "notification_template_sync_key", unique = true, sparse = true)
    private String syncKey;


    private String titleTemplate;
    private String bodyTemplate;
    private String iconUrl;
    private String badgeUrl;
    private String ctaPath;

}
