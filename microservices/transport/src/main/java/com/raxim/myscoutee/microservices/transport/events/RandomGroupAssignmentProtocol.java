package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

public final class RandomGroupAssignmentProtocol {
    public static final String RUN = "/_internal/v1/events/random-group-assignment/run";
    public static final int MAX_REQUEST_BYTES = 16384, MAX_FRAME_BYTES = 16384, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private RandomGroupAssignmentProtocol() {}
    public static String[] paths() { return new String[]{RUN}; }
    public record Command(Boolean active, String groupId) {
        public static Command current() { return new Command(JobGroupContext.isActive(), JobGroupContext.groupId()); }
    }
    public record Frame(String kind, Integer progressPercent, String detail, Integer plans, Integer affectedUsers) {}
    public record Error(String code) {}
    public static boolean valid(Command command) {
        return command != null && command.active() != null && (command.groupId() == null || command.groupId().length() <= 512)
                && (command.active() || command.groupId() == null);
    }
}
