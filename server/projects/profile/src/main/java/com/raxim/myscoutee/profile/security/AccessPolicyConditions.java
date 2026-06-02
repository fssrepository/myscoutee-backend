package com.raxim.myscoutee.profile.security;

import java.util.Locale;
import java.util.Map;

import org.springframework.util.StringUtils;

public final class AccessPolicyConditions {
    private static final Map<String, AccessPolicyCondition> CONDITIONS = Map.of(
            normalizeName("actorMatchesSubject"), actorMatchesSubject(),
            normalizeName("noExplicitDeny"), noExplicitDeny(),
            normalizeName("explicitAllow"), explicitAllow(),
            normalizeName("acceptedParticipation"), acceptedParticipation());

    private AccessPolicyConditions() {
    }

    public static AccessPolicyCondition named(String name) {
        return CONDITIONS.get(normalizeName(name));
    }

    public static AccessPolicyCondition actorMatchesSubject() {
        return (context, data) -> StringUtils.hasText(context.actorUserId())
                && context.actorUserId().equals(context.subjectUserId());
    }

    public static AccessPolicyCondition noExplicitDeny() {
        return (context, data) -> !data.hasExplicitGrant(
                context.subjectUserId(),
                context.permission(),
                context.resourceType(),
                context.resourceId(),
                AccessGrantEffect.DENY);
    }

    public static AccessPolicyCondition explicitAllow() {
        return (context, data) -> data.hasExplicitGrant(
                context.subjectUserId(),
                context.permission(),
                context.resourceType(),
                context.resourceId(),
                AccessGrantEffect.ALLOW);
    }

    public static AccessPolicyCondition acceptedParticipation() {
        return (context, data) -> data.hasAcceptedParticipation(
                context.resourceType(),
                context.resourceId(),
                context.subjectUserId());
    }

    private static String normalizeName(String name) {
        return name == null ? "" : name.trim().toLowerCase(Locale.ROOT);
    }
}
