package com.raxim.myscoutee.domain.integrations.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "integrationExternalIds")
@CompoundIndexes({
        @CompoundIndex(
                name = "integration_external_id_owner_resource_external",
                def = "{'ownerUserId': 1, 'resourceType': 1, 'externalId': 1}",
                unique = true),
        @CompoundIndex(
                name = "integration_external_id_owner_resource_internal",
                def = "{'ownerUserId': 1, 'resourceType': 1, 'internalId': 1}",
                unique = true)
})
public class IntegrationExternalId {
    @Id
    private String id;
    private String ownerUserId;
    private String resourceType;
    private String externalId;
    private String internalId;
    private String createdAtIso;
    private String updatedAtIso;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(String ownerUserId) { this.ownerUserId = ownerUserId; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
    public String getInternalId() { return internalId; }
    public void setInternalId(String internalId) { this.internalId = internalId; }
    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }
    public String getUpdatedAtIso() { return updatedAtIso; }
    public void setUpdatedAtIso(String updatedAtIso) { this.updatedAtIso = updatedAtIso; }
}
