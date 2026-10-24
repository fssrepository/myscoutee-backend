package com.raxim.myscoutee.domain.content.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "shareTokens")
@lombok.Getter @lombok.Setter
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

}
