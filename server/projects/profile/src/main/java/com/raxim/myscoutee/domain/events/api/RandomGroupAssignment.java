package com.raxim.myscoutee.domain.events.api;

import java.util.function.Consumer;

public interface RandomGroupAssignment {
    Result assignRandomGroups(Consumer<Progress> progress);

    record Progress(int progressPercent, String detail) {}
    record Result(int plans, int affectedUsers) {}
}
