package com.raxim.myscoutee.domain.platform.service;

import java.util.function.Supplier;

/** Execution scope of one seeded job. Null is the existing Dating base group. */
public final class JobGroupContext {
    private record Scope(String groupId, java.util.Map<String, Object> memo) {}
    private static final ThreadLocal<Scope> CURRENT = new ThreadLocal<>();

    private JobGroupContext() {}

    public static String groupId() {
        Scope scope = CURRENT.get();
        return scope == null ? null : scope.groupId();
    }

    public static boolean isActive() { return CURRENT.get() != null; }

    public static String key() { return groupId() == null ? "default" : groupId(); }

    public static <T> T call(String groupId, Supplier<T> action) {
        Scope previous = CURRENT.get();
        CURRENT.set(new Scope(groupId == null || groupId.isBlank() ? null : groupId.trim(), new java.util.HashMap<>()));
        try { return action.get(); }
        finally {
            if (previous == null) CURRENT.remove();
            else CURRENT.set(previous);
        }
    }

    public static void run(String groupId, Runnable action) {
        call(groupId, () -> { action.run(); return null; });
    }

    @SuppressWarnings("unchecked")
    public static <T> T memo(String key, Supplier<T> read) {
        Scope scope = CURRENT.get();
        return scope == null ? read.get() : (T) scope.memo().computeIfAbsent(key, ignored -> read.get());
    }
}
