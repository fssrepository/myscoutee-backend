package com.raxim.myscoutee.profile.security;

public record AccessPolicyContext(
        String actorUserId,
        String subjectUserId,
        String permission,
        String resourceType,
        String resourceId) {
}
