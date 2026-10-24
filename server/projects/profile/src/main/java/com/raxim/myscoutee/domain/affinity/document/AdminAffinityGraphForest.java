package com.raxim.myscoutee.domain.affinity.document;

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
@lombok.Getter @lombok.Setter
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

}
