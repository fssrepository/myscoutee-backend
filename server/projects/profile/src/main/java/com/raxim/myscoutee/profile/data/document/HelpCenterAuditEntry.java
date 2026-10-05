package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "helpCenterAudit")
@CompoundIndexes({
        @CompoundIndex(name = "help_audit_created", def = "{'createdDate': -1}"),
        @CompoundIndex(name = "help_audit_revision_created", def = "{'revisionId': 1, 'createdDate': -1}"),
        @CompoundIndex(name = "help_audit_document_created", def = "{'documentType': 1, 'createdDate': -1}")
})
public class HelpCenterAuditEntry {
    @Id
    private String id;
    private String baseGroupId;
    public String getBaseGroupId() { return baseGroupId; }
    public void setBaseGroupId(String value) { baseGroupId = value; }

    private String revisionId;
    private String documentType;
    private String lang;
    private String languageLabel;
    private Integer version;
    private String action;
    private String actorUserId;
    private String createdDate;
    private String message;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRevisionId() {
        return revisionId;
    }

    public void setRevisionId(String revisionId) {
        this.revisionId = revisionId;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getLanguageLabel() {
        return languageLabel;
    }

    public void setLanguageLabel(String languageLabel) {
        this.languageLabel = languageLabel;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActorUserId() {
        return actorUserId;
    }

    public void setActorUserId(String actorUserId) {
        this.actorUserId = actorUserId;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
