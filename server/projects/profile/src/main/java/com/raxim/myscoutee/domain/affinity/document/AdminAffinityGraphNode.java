package com.raxim.myscoutee.domain.affinity.document;

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
@lombok.Getter @lombok.Setter
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

    public void setImages(List<String> images) { this.images = images == null ? new ArrayList<>() : new ArrayList<>(images); }
}
