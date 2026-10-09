package com.raxim.myscoutee.microservices.transport.groups;

public final class GroupAdministrationProtocol {
    public static final String PATH = "/_internal/v1/groups/administration/managed";
    public static final int MAX_RESPONSE_BYTES = 1024 * 1024;
    private GroupAdministrationProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{PATH}; }
}
