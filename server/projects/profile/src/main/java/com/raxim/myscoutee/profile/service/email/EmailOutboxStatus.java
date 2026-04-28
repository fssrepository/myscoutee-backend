package com.raxim.myscoutee.profile.service.email;

public final class EmailOutboxStatus {
    public static final String PENDING = "PENDING";
    public static final String SENDING = "SENDING";
    public static final String SENT = "SENT";
    public static final String FAILED = "FAILED";

    private EmailOutboxStatus() {
    }
}
