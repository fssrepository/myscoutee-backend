package com.raxim.myscoutee.domain.events.api;

import com.raxim.myscoutee.domain.events.dto.EventVersionDto;

/** Version-qualified projection changes executed by the event owner. */
public interface EventDerivedUpdates {
    boolean updateAffinityVersion(EventVersionDto version, double affinity, double boost);
    boolean updateStatusVersionIfCurrent(EventVersionDto version, String nextStatus, String previousStatus);
}
