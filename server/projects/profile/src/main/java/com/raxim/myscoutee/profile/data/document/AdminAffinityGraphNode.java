package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "adminAffinityGraphNodes")
@CompoundIndexes({
        @CompoundIndex(name = "admin_affinity_graph_node_layout_user", def = "{'layoutVersion': 1, 'userId': 1}", unique = true),
        @CompoundIndex(name = "admin_affinity_graph_node_layout_tile", def = "{'layoutVersion': 1, 'tileZ': 1, 'tileX': 1, 'tileY': 1}"),
        @CompoundIndex(name = "admin_affinity_graph_node_layout_position", def = "{'layoutVersion': 1, 'x': 1, 'z': 1}"),
        @CompoundIndex(name = "admin_affinity_graph_node_layout_component", def = "{'layoutVersion': 1, 'componentId': 1}"),
        @CompoundIndex(name = "admin_affinity_graph_node_layout_centrality", def = "{'layoutVersion': 1, 'centrality': -1}")
})
public class AdminAffinityGraphNode {
    @Id
    private String id;

    @Indexed(name = "admin_affinity_graph_node_layout")
    private String layoutVersion;

    private String userId;
    private String componentId;
    private Double x;
    private Double y;
    private Double z;
    private Integer degree;
    private Double weightedDegree;
    private Double centrality;
    private String gender;
    private String profileStatus;
    private Integer tileZ;
    private Integer tileX;
    private Integer tileY;
    private String name;
    private String initials;
    private String city;
    private Integer age;
    private String headline;
    private String traitLabel;
    private String statusText;
    private String image;
    private List<String> images = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLayoutVersion() { return layoutVersion; }
    public void setLayoutVersion(String layoutVersion) { this.layoutVersion = layoutVersion; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getComponentId() { return componentId; }
    public void setComponentId(String componentId) { this.componentId = componentId; }
    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }
    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }
    public Double getZ() { return z; }
    public void setZ(Double z) { this.z = z; }
    public Integer getDegree() { return degree; }
    public void setDegree(Integer degree) { this.degree = degree; }
    public Double getWeightedDegree() { return weightedDegree; }
    public void setWeightedDegree(Double weightedDegree) { this.weightedDegree = weightedDegree; }
    public Double getCentrality() { return centrality; }
    public void setCentrality(Double centrality) { this.centrality = centrality; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getProfileStatus() { return profileStatus; }
    public void setProfileStatus(String profileStatus) { this.profileStatus = profileStatus; }
    public Integer getTileZ() { return tileZ; }
    public void setTileZ(Integer tileZ) { this.tileZ = tileZ; }
    public Integer getTileX() { return tileX; }
    public void setTileX(Integer tileX) { this.tileX = tileX; }
    public Integer getTileY() { return tileY; }
    public void setTileY(Integer tileY) { this.tileY = tileY; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getInitials() { return initials; }
    public void setInitials(String initials) { this.initials = initials; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public String getTraitLabel() { return traitLabel; }
    public void setTraitLabel(String traitLabel) { this.traitLabel = traitLabel; }
    public String getStatusText() { return statusText; }
    public void setStatusText(String statusText) { this.statusText = statusText; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images == null ? new ArrayList<>() : new ArrayList<>(images); }
}
