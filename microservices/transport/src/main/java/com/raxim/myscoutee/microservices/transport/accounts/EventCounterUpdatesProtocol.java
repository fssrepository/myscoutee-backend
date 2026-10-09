package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.List;
import java.util.HashSet;
import com.raxim.myscoutee.domain.accounts.api.EventCounterUpdates.Change;

public final class EventCounterUpdatesProtocol {
    public static final String PATH = "/_internal/v1/accounts/event-counter-updates";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024;
    public static final int BATCH_SIZE = 512;
    private EventCounterUpdatesProtocol() {}
    public record Command(List<Change> changes) {}
    public record Result(Integer changed) {}
    public record Error(String code) {}
    public static boolean valid(Command command) {
        if (command == null || command.changes() == null || command.changes().size() > BATCH_SIZE) return false;
        var ids = new HashSet<String>();
        return command.changes().stream().allMatch(change -> change != null && change.userId() != null
                && !change.userId().isBlank() && change.userId().length() <= 512 && ids.add(change.userId())
                && change.invitations() >= 0 && change.events() >= 0 && change.hosting() >= 0);
    }
}
