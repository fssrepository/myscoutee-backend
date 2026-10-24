package com.raxim.myscoutee.common.dto;

/** Shared read-view fields; record values retain their existing bean names. */
public interface EntityIdentity {
    String getId();
    String getSyncKey();

    interface RecordFields extends EntityIdentity {
        String id();
        @Override default String getId() { return id(); }
        String syncKey();
        @Override default String getSyncKey() { return syncKey(); }
    }
}
