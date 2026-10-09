package com.raxim.myscoutee.microservices.transport.accounts;

public final class ProfileModerationProtocol {
    public static final String BLOCK = "/_internal/v1/accounts/profile-moderation/block";
    public static final String UNBLOCK = "/_internal/v1/accounts/profile-moderation/unblock";
    public static final String AUDIENCE = "accounts:profile-moderation";
    public static final int MAX_REQUEST_BYTES = 16384;
    private ProfileModerationProtocol() {}
    public static String[] paths() { return new String[]{BLOCK, UNBLOCK}; }
    public record Command(String userId, com.raxim.myscoutee.domain.accounts.api.ProfileModeration.SupportNotice notice) {
        public Command(String userId) { this(userId, null); }
    }
    public record Receipt(Boolean completed, Boolean changed) {}
    public record Error(String code) {}
    public static boolean valid(Command command) { return command != null && command.userId() != null && !command.userId().isBlank() && command.userId().length() <= 512 && valid(command.notice()); }
    private static boolean valid(com.raxim.myscoutee.domain.accounts.api.ProfileModeration.SupportNotice notice) {
        return notice == null || (text(notice.adminUserId(), 512) && !notice.adminUserId().isBlank()
                && text(notice.adminName(), 512) && text(notice.adminInitials(), 64) && text(notice.text(), 8192));
    }
    private static boolean text(String value, int limit) { return value != null && value.length() <= limit; }
}

