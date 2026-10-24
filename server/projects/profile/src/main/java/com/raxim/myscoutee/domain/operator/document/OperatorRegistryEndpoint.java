package com.raxim.myscoutee.domain.operator.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "operatorRegistryEndpoints")
@CompoundIndexes({
        @CompoundIndex(
                name = "operator_registry_endpoint_enabled_sort",
                def = "{'enabled': 1, 'sortOrder': 1, 'label': 1, '_id': 1}"),
        @CompoundIndex(
                name = "operator_registry_endpoint_base_scope",
                def = "{'baseUrl': 1, 'registryScope': 1}",
                unique = true)
})
@lombok.Getter @lombok.Setter
public class OperatorRegistryEndpoint {
    @Id
    private String id;
    private String label;
    private String baseUrl;
    private String registryScope;
    private Boolean enabled;
    private Integer sortOrder;

}
