package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "adminAffinityGraphLayouts")
public class AdminAffinityGraphLayout {
    @Id
    private String id;

    @Indexed(name = "admin_affinity_graph_layout_version", unique = true)
    private String layoutVersion;

    @Indexed(name = "admin_affinity_graph_layout_generated_at")
    private String generatedAtIso;

    private String scopeKey;
    public String getScopeKey() { return scopeKey; }
    public void setScopeKey(String value) { scopeKey = value; }

    private String source;
    private Integer memberCount;
    private Integer linkCount;
    private Integer componentCount;
    private Integer isolatedCount;
    private Integer maxZoom;
    private Integer tileSize;
    private Integer nodeRenderBudget;
    private Integer edgeRenderBudget;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLayoutVersion() { return layoutVersion; }
    public void setLayoutVersion(String layoutVersion) { this.layoutVersion = layoutVersion; }
    public String getGeneratedAtIso() { return generatedAtIso; }
    public void setGeneratedAtIso(String generatedAtIso) { this.generatedAtIso = generatedAtIso; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }
    public Integer getLinkCount() { return linkCount; }
    public void setLinkCount(Integer linkCount) { this.linkCount = linkCount; }
    public Integer getComponentCount() { return componentCount; }
    public void setComponentCount(Integer componentCount) { this.componentCount = componentCount; }
    public Integer getIsolatedCount() { return isolatedCount; }
    public void setIsolatedCount(Integer isolatedCount) { this.isolatedCount = isolatedCount; }
    public Integer getMaxZoom() { return maxZoom; }
    public void setMaxZoom(Integer maxZoom) { this.maxZoom = maxZoom; }
    public Integer getTileSize() { return tileSize; }
    public void setTileSize(Integer tileSize) { this.tileSize = tileSize; }
    public Integer getNodeRenderBudget() { return nodeRenderBudget; }
    public void setNodeRenderBudget(Integer nodeRenderBudget) { this.nodeRenderBudget = nodeRenderBudget; }
    public Integer getEdgeRenderBudget() { return edgeRenderBudget; }
    public void setEdgeRenderBudget(Integer edgeRenderBudget) { this.edgeRenderBudget = edgeRenderBudget; }
}
