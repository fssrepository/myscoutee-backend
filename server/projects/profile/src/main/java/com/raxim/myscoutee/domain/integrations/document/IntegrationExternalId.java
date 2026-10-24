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
@lombok.Getter @lombok.Setter
public class IntegrationExternalId {
    @Id
    private String id;
    private String ownerUserId;
    private String resourceType;
    private String externalId;
    private String internalId;
    private String createdAtIso;
    private String updatedAtIso;

}
