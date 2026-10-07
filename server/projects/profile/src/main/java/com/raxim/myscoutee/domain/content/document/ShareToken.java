package com.raxim.myscoutee.domain.content.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "shareTokens")
public class ShareToken {
    @Id
    private String id;

    @Indexed(name = "share_token_value", unique = true)
    private String token;

    private String kind;
    private String entityId;
    private String assetType;
    private String ownerUserId;
    private String createdAtIso;

    @Indexed(name = "share_token_expires_at")
    private String expiresAtIso;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public String getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(String ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getCreatedAtIso() {
        return createdAtIso;
    }

    public void setCreatedAtIso(String createdAtIso) {
        this.createdAtIso = createdAtIso;
    }

    public String getExpiresAtIso() {
        return expiresAtIso;
    }

    public void setExpiresAtIso(String expiresAtIso) {
        this.expiresAtIso = expiresAtIso;
    }
}
