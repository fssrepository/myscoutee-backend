package com.raxim.myscoutee.common.mongo;

/** Flat persisted metadata shared by email and notification template documents. */
@lombok.Getter @lombok.Setter
public abstract class MessageTemplateMetadata {
    @org.springframework.data.annotation.Id
    private String id;
    private String baseGroupId;
    private String templateKey;
    private String name;
    private String description;
    private String category;
    private String locale;
    private Boolean enabled;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;
}
