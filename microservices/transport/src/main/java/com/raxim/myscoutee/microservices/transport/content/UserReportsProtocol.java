package com.raxim.myscoutee.microservices.transport.content;

public final class UserReportsProtocol {
    public static final String SUBMIT="/_internal/v1/content/user-reports/submit";
    public static final String EXISTS="/_internal/v1/content/user-reports/exists";
    public static final String SUBMIT_AUDIENCE="content:reports:submit";
    public static final String EXISTS_AUDIENCE="content:reports:exists";
    public static final int MAX_REQUEST_BYTES=64*1024;
    private UserReportsProtocol() {}
    public record ExistsQuery(String syncKey) {}
    public record ExistsResult(boolean exists) {}
    public record Error(String code) {}
    public static String[] paths(){return new String[]{SUBMIT,EXISTS};}
}
