package com.raxim.myscoutee.domain.affinity.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "adminAffinityGraphEdges")
@CompoundIndexes({
        @CompoundIndex(name = "admin_affinity_graph_edge_layout_pair", def = "{'layoutVersion': 1, 'sourceUserId': 1, 'targetUserId': 1}", unique = true),
        @CompoundIndex(name = "admin_affinity_graph_edge_layout_source", def = "{'layoutVersion': 1, 'sourceUserId': 1}"),
        @CompoundIndex(name = "admin_affinity_graph_edge_layout_target", def = "{'layoutVersion': 1, 'targetUserId': 1}"),
        @CompoundIndex(name = "admin_affinity_graph_edge_layout_component_lod", def = "{'layoutVersion': 1, 'componentId': 1, 'lodLevel': 1}"),
        @CompoundIndex(name = "admin_affinity_graph_edge_layout_weight", def = "{'layoutVersion': 1, 'weight': -1}")
})
public class AdminAffinityGraphEdge {
    @Id
    private String id;

    @Indexed(name = "admin_affinity_graph_edge_layout")
    private String layoutVersion;

    private String sourceUserId;
    private String targetUserId;
    private Double weight;
    private Double affinityScore;
    private String componentId;
    private Integer lodLevel;
    private Integer tileZ;
    private Integer minTileX;
    private Integer maxTileX;
    private Integer minTileY;
    private Integer maxTileY;
    private Double minX;
    private Double minY;
    private Double minZ;
    private Double maxX;
    private Double maxY;
    private Double maxZ;
    private String updatedDate;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLayoutVersion() { return layoutVersion; }
    public void setLayoutVersion(String layoutVersion) { this.layoutVersion = layoutVersion; }
    public String getSourceUserId() { return sourceUserId; }
    public void setSourceUserId(String sourceUserId) { this.sourceUserId = sourceUserId; }
    public String getTargetUserId() { return targetUserId; }
    public void setTargetUserId(String targetUserId) { this.targetUserId = targetUserId; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Double getAffinityScore() { return affinityScore; }
    public void setAffinityScore(Double affinityScore) { this.affinityScore = affinityScore; }
    public String getComponentId() { return componentId; }
    public void setComponentId(String componentId) { this.componentId = componentId; }
    public Integer getLodLevel() { return lodLevel; }
    public void setLodLevel(Integer lodLevel) { this.lodLevel = lodLevel; }
    public Integer getTileZ() { return tileZ; }
    public void setTileZ(Integer tileZ) { this.tileZ = tileZ; }
    public Integer getMinTileX() { return minTileX; }
    public void setMinTileX(Integer minTileX) { this.minTileX = minTileX; }
    public Integer getMaxTileX() { return maxTileX; }
    public void setMaxTileX(Integer maxTileX) { this.maxTileX = maxTileX; }
    public Integer getMinTileY() { return minTileY; }
    public void setMinTileY(Integer minTileY) { this.minTileY = minTileY; }
    public Integer getMaxTileY() { return maxTileY; }
    public void setMaxTileY(Integer maxTileY) { this.maxTileY = maxTileY; }
    public Double getMinX() { return minX; }
    public void setMinX(Double minX) { this.minX = minX; }
    public Double getMinY() { return minY; }
    public void setMinY(Double minY) { this.minY = minY; }
    public Double getMinZ() { return minZ; }
    public void setMinZ(Double minZ) { this.minZ = minZ; }
    public Double getMaxX() { return maxX; }
    public void setMaxX(Double maxX) { this.maxX = maxX; }
    public Double getMaxY() { return maxY; }
    public void setMaxY(Double maxY) { this.maxY = maxY; }
    public Double getMaxZ() { return maxZ; }
    public void setMaxZ(Double maxZ) { this.maxZ = maxZ; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
}
