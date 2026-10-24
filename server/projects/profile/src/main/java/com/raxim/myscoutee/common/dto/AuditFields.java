package com.raxim.myscoutee.common.dto;

/** Shared read-view fields; record values retain their existing bean names. */
public interface AuditFields {
    String getCreatedDate();
    String getCreatedUser();
    String getUpdatedDate();
    String getUpdatedUser();

    interface RecordFields extends AuditFields {
        String createdDate();
        @Override default String getCreatedDate() { return createdDate(); }
        String createdUser();
        @Override default String getCreatedUser() { return createdUser(); }
        String updatedDate();
        @Override default String getUpdatedDate() { return updatedDate(); }
        String updatedUser();
        @Override default String getUpdatedUser() { return updatedUser(); }
    }
}
