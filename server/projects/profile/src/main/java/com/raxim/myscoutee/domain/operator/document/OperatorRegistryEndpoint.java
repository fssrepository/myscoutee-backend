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
public class OperatorRegistryEndpoint {
    @Id
    private String id;
    private String label;
    private String baseUrl;
    private String registryScope;
    private Boolean enabled;
    private Integer sortOrder;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getRegistryScope() {
        return registryScope;
    }

    public void setRegistryScope(String registryScope) {
        this.registryScope = registryScope;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
