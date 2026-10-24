package com.raxim.myscoutee.domain.operator.document;

/** Common flat journal identity; each report retains its own schema version and indexes. */
@lombok.Getter @lombok.Setter
public abstract class RegistryOutboxIdentity {
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_ACCEPTED = "ACCEPTED";
    public static final String STATUS_BLOCKED = "BLOCKED";
    @org.springframework.data.annotation.Id
    private String id;
    @org.springframework.data.annotation.Version
    private Long version;
    private Integer schemaVersion;
    private String registryScope;
    private String deploymentId;

    protected RegistryOutboxIdentity(int schemaVersion) {
        this.schemaVersion = schemaVersion;
    }
}
