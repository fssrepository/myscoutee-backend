package com.raxim.myscoutee.microservices.transport.feedback;

public final class FeedbackMeasurementProtocol {
    private FeedbackMeasurementProtocol() {}
    public static final String ATTENDANCE = "/_internal/v1/feedback/feedback-measurement/attendance";
    public static String[] paths() { return new String[]{ATTENDANCE}; }
}
