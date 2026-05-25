package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "adminAffinityGraphForests")
@CompoundIndexes({
        @CompoundIndex(name = "admin_affinity_graph_forest_layout_component", def = "{'layoutVersion': 1, 'componentId': 1}", unique = true),
        @CompoundIndex(name = "admin_affinity_graph_forest_layout_size", def = "{'layoutVersion': 1, 'memberCount': -1}")
})
public class AdminAffinityGraphForest {
    @Id
    private String id;

    @Indexed(name = "admin_affinity_graph_forest_layout")
    private String layoutVersion;

    private String componentId;
    private String representativeUserId;
    private String representativeName;
    private String representativeInitials;
    private String gender;
    private Integer memberCount;
    private Integer edgeCount;
    private Double weightedDegree;
    private Double x;
    private Double y;
    private Double z;
    private Double radius;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLayoutVersion() { return layoutVersion; }
    public void setLayoutVersion(String layoutVersion) { this.layoutVersion = layoutVersion; }
    public String getComponentId() { return componentId; }
    public void setComponentId(String componentId) { this.componentId = componentId; }
    public String getRepresentativeUserId() { return representativeUserId; }
    public void setRepresentativeUserId(String representativeUserId) { this.representativeUserId = representativeUserId; }
    public String getRepresentativeName() { return representativeName; }
    public void setRepresentativeName(String representativeName) { this.representativeName = representativeName; }
    public String getRepresentativeInitials() { return representativeInitials; }
    public void setRepresentativeInitials(String representativeInitials) { this.representativeInitials = representativeInitials; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }
    public Integer getEdgeCount() { return edgeCount; }
    public void setEdgeCount(Integer edgeCount) { this.edgeCount = edgeCount; }
    public Double getWeightedDegree() { return weightedDegree; }
    public void setWeightedDegree(Double weightedDegree) { this.weightedDegree = weightedDegree; }
    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }
    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }
    public Double getZ() { return z; }
    public void setZ(Double z) { this.z = z; }
    public Double getRadius() { return radius; }
    public void setRadius(Double radius) { this.radius = radius; }
}
