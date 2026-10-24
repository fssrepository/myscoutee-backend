package com.raxim.myscoutee.domain.email.document;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emailTemplates")
@lombok.Getter @lombok.Setter
public class EmailTemplate extends com.raxim.myscoutee.common.mongo.MessageTemplateMetadata {

    @Indexed(name = "email_template_sync_key", unique = true, sparse = true)
    private String syncKey;


    private String subjectTemplate;
    private String htmlTemplate;
    private String textTemplate;

}
